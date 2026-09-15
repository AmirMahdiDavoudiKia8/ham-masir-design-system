# Pulls a timestamped copy of the VPS's persistent/ folder (mentor accounts,
# uploaded photos/voices, .env.local, payment-requests log) down to this
# machine — a second, independent copy alongside ParsPack's own server-side
# backup, in case that backup or the server itself is ever unavailable.
# Keeps the last $KeepCount archives and deletes older ones.
#
# Run by the Windows scheduled task "HamMasirPersistentBackup".
#
# ─── Why it is built this way ────────────────────────────────────────────────
# The run gets KILLED, not just errored: this is a laptop, the task used to
# stop when it went on battery, and it opened a visible console window that is
# easy to close. A killed process never reaches a `finally` block, so the
# previous try/finally fix could not help. Observed in the wild, 2026-09-13/15:
#   - a half-downloaded archive (1.5MB, 15 entries, fails gzip -t) sitting in
#     the backup folder with a real backup's name
#   - two 3MB archives abandoned in the VPS's /tmp
# So the design must stay correct when the process dies at ANY instant:
#
#   1. NO REMOTE TEMP FILE. tar streams straight down the ssh connection. If
#      this machine dies mid-transfer, the remote tar just gets SIGPIPE and
#      exits — there is nothing on the server to clean up, ever.
#
#   2. WRITE TO .partial, RENAME ONLY AFTER VERIFYING. A killed run leaves a
#      `.partial` file, which the prune filter ignores and which can never be
#      mistaken for a real backup. Only a fully verified archive gets the
#      `.tar.gz` name. Stale .partial files are swept at the start of each run.
#
# The download goes through `cmd /c ... > file` on purpose. Windows PowerShell
# 5.1's own `>` operator re-encodes a native command's stdout as text and
# silently corrupts binary data; cmd's redirection is byte-exact. Do not
# "simplify" this to a PowerShell redirect.
# ─────────────────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

$VpsHost = "root@45.159.149.67"
$SshKey = "$env:USERPROFILE\.ssh\hammasir_vps"
$BackupDir = "$env:USERPROFILE\HamMasirBackups"
$KeepCount = 14
$MinEntries = 5

# Non-interactive: a host-key prompt or a hung TCP connection must fail fast
# instead of leaving a scheduled task waiting forever with no one to answer.
$SshArgs = "-i `"$SshKey`" -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=30 -o ServerAliveInterval=15 -o ServerAliveCountMax=4"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$finalArchive = Join-Path $BackupDir "hammasir-persistent-$stamp.tar.gz"
$partialArchive = "$finalArchive.partial"

# Leftovers of runs that were killed mid-download. Never real backups.
Get-ChildItem -Path $BackupDir -Filter "*.partial" -ErrorAction SilentlyContinue | Remove-Item -Force

Write-Host "Streaming persistent/ from the VPS..."
cmd /c "ssh $SshArgs $VpsHost `"tar -czf - -C /var/www/hammasir persistent`" > `"$partialArchive`""
if ($LASTEXITCODE -ne 0) {
    Remove-Item $partialArchive -Force -ErrorAction SilentlyContinue
    throw "Streaming download failed (ssh exit $LASTEXITCODE)"
}

# A backup nobody verified is not a backup. Listing the archive walks the
# entire gzip stream, so a truncated transfer fails here, not on restore day.
Write-Host "Verifying archive..."
$listing = & tar -tzf $partialArchive 2>&1
if ($LASTEXITCODE -ne 0) {
    Remove-Item $partialArchive -Force -ErrorAction SilentlyContinue
    throw "Archive is corrupt or truncated: $listing"
}
$entryCount = ($listing | Measure-Object -Line).Lines
if ($entryCount -lt $MinEntries) {
    Remove-Item $partialArchive -Force -ErrorAction SilentlyContinue
    throw "Archive has only $entryCount entries - refusing to keep a suspiciously empty backup"
}
Write-Host "  OK - $entryCount entries, $([math]::Round((Get-Item $partialArchive).Length / 1MB, 2)) MB"

# The only point at which a file becomes a "real" backup.
Move-Item -Path $partialArchive -Destination $finalArchive -Force

# Prune only now that a verified archive exists — pruning after a failed run
# could delete a good old backup and leave nothing better in its place.
Write-Host "Pruning old backups (keeping last $KeepCount)..."
Get-ChildItem -Path $BackupDir -Filter "hammasir-persistent-*.tar.gz" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -Skip $KeepCount |
    Remove-Item -Force

# Deliberately no second ssh call here (e.g. to sweep /tmp on the VPS). This
# method never creates remote temp files, so there is nothing to sweep — and a
# trivial `rm -f` over this laptop's link to the VPS was observed hanging for
# 165s+ (well past ConnectTimeout/ServerAlive), holding the whole task in
# "Running". Every extra network round-trip is another place to hang; the one
# download above is the only call that has to happen.

Write-Host "Done: $finalArchive"

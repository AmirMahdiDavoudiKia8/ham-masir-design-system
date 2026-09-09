# Pulls a timestamped copy of the VPS's persistent/ folder (mentor accounts,
# uploaded photos/voices, .env.local, payment-requests log) down to this
# machine — a second, independent copy alongside ParsPack's own server-side
# backup, in case that backup or the server itself is ever unavailable.
# Keeps the last $KeepCount archives and deletes older ones.
#
# Run by the Windows scheduled task "HamMasirPersistentBackup" (~04:30 daily).
#
# STRUCTURE: the download is wrapped in try/finally so the remote /tmp archive
# is deleted and old local archives are pruned even when a step fails. The
# earlier version ran those two steps as plain trailing statements under
# $ErrorActionPreference = "Stop", so any failure mid-run skipped both. That
# was not theoretical: the 2026-09-09 run aborted (task result 0x8007042B,
# ERROR_PROCESS_ABORTED) after the download completed but before cleanup, and
# a 3.1MB /tmp/hammasir-persistent-2026-09-02_0430.tar.gz was still sitting on
# the VPS from an earlier, identical abort.

$ErrorActionPreference = "Stop"

$VpsHost = "root@45.159.149.67"
$SshKey = "$env:USERPROFILE\.ssh\hammasir_vps"
$RemotePath = "/var/www/hammasir/persistent"
$BackupDir = "$env:USERPROFILE\HamMasirBackups"
$KeepCount = 14

# Non-interactive: without these, a host-key prompt or a hung TCP connection
# makes the scheduled task sit forever with no console for anyone to answer.
$SshOpts = @(
    "-i", $SshKey,
    "-o", "BatchMode=yes",
    "-o", "StrictHostKeyChecking=accept-new",
    "-o", "ConnectTimeout=30",
    "-o", "ServerAliveInterval=15",
    "-o", "ServerAliveCountMax=4"
)

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$remoteArchive = "/tmp/hammasir-persistent-$stamp.tar.gz"
$localArchive = Join-Path $BackupDir "hammasir-persistent-$stamp.tar.gz"
$downloaded = $false

try {
    Write-Host "Archiving persistent/ on the VPS..."
    & ssh @SshOpts $VpsHost "tar -czf $remoteArchive -C /var/www/hammasir persistent && echo OK"
    if ($LASTEXITCODE -ne 0) { throw "Remote tar failed (exit $LASTEXITCODE)" }

    Write-Host "Downloading to $localArchive..."
    & scp @SshOpts "${VpsHost}:${remoteArchive}" $localArchive
    if ($LASTEXITCODE -ne 0) { throw "scp download failed (exit $LASTEXITCODE)" }

    # A backup nobody verified is not a backup. gzip -t walks the whole stream,
    # so a silently truncated transfer is caught here rather than on the day
    # it is needed.
    Write-Host "Verifying archive integrity..."
    & ssh @SshOpts $VpsHost "echo verify-connection-ok" | Out-Null
    $testOutput = & tar -tzf $localArchive 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Downloaded archive is corrupt or truncated: $testOutput" }
    $entryCount = ($testOutput | Measure-Object -Line).Lines
    if ($entryCount -lt 5) { throw "Archive has only $entryCount entries - suspiciously empty" }
    Write-Host "  OK - $entryCount entries"
    $downloaded = $true
}
finally {
    # Always runs, including on failure above, so a dead run cannot leave a
    # multi-megabyte archive behind on the VPS the way earlier ones did.
    Write-Host "Cleaning up remote temp file..."
    try {
        & ssh @SshOpts $VpsHost "rm -f $remoteArchive"
    } catch {
        Write-Warning "Remote cleanup failed: $_"
    }

    # Prune ONLY when this run produced a verified archive. Pruning after a
    # failed run could delete a good old backup and leave nothing but the
    # broken new one.
    if ($downloaded) {
        Write-Host "Pruning old local backups (keeping last $KeepCount)..."
        try {
            Get-ChildItem -Path $BackupDir -Filter "hammasir-persistent-*.tar.gz" |
                Sort-Object LastWriteTime -Descending |
                Select-Object -Skip $KeepCount |
                Remove-Item -Force
        } catch {
            Write-Warning "Pruning failed: $_"
        }
    } else {
        Write-Warning "Run did not produce a verified archive - skipping prune and keeping every existing backup."
    }
}

Write-Host "Done: $localArchive"

# Pulls a timestamped copy of the VPS's persistent/ folder (mentor accounts,
# uploaded photos/voices, .env.local, payment-requests log) down to this
# machine — a second, independent copy alongside ParsPack's own server-side
# backup, in case that backup or the server itself is ever unavailable.
# Keeps the last $KeepCount archives and deletes older ones.

$ErrorActionPreference = "Stop"

$VpsHost = "root@45.159.149.67"
$SshKey = "$env:USERPROFILE\.ssh\hammasir_vps"
$RemotePath = "/var/www/hammasir/persistent"
$BackupDir = "$env:USERPROFILE\HamMasirBackups"
$KeepCount = 14

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$remoteArchive = "/tmp/hammasir-persistent-$stamp.tar.gz"
$localArchive = Join-Path $BackupDir "hammasir-persistent-$stamp.tar.gz"

Write-Host "Archiving persistent/ on the VPS..."
& ssh -i $SshKey $VpsHost "tar -czf $remoteArchive -C /var/www/hammasir persistent && echo OK"
if ($LASTEXITCODE -ne 0) { throw "Remote tar failed" }

Write-Host "Downloading to $localArchive..."
& scp -i $SshKey "${VpsHost}:${remoteArchive}" $localArchive
if ($LASTEXITCODE -ne 0) { throw "scp download failed" }

Write-Host "Cleaning up remote temp file..."
& ssh -i $SshKey $VpsHost "rm -f $remoteArchive"

Write-Host "Pruning old local backups (keeping last $KeepCount)..."
Get-ChildItem -Path $BackupDir -Filter "hammasir-persistent-*.tar.gz" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -Skip $KeepCount |
    Remove-Item -Force

Write-Host "Done: $localArchive"

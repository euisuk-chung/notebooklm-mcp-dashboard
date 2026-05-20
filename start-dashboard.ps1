# NotebookLM Dashboard launcher.
# Starts the FastAPI backend (port 8000) and the Vite frontend (port 5173) as
# detached hidden processes. Designed to be invoked by the
# "NotebookLM Dashboard Auto Start" Scheduled Task at user logon.

$ErrorActionPreference = 'Continue'

$repoRoot    = $PSScriptRoot
$backendDir  = Join-Path $repoRoot 'backend'
$frontendDir = Join-Path $repoRoot 'frontend'
$logDir      = Join-Path $repoRoot '.logs'

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

function Test-PortInUse {
    param([int]$Port)
    try {
        $conn = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction Stop
        return [bool]$conn
    } catch {
        return $false
    }
}

# Backend ----------------------------------------------------------------------
if (Test-PortInUse -Port 8000) {
    "[{0}] backend skip: port 8000 already in use" -f (Get-Date -Format s) |
        Out-File -FilePath (Join-Path $logDir 'launcher.log') -Append -Encoding utf8
} else {
    $backendOut = Join-Path $logDir 'backend.log'
    $backendErr = Join-Path $logDir 'backend.err.log'
    Start-Process -FilePath 'uv' `
        -ArgumentList @('run','uvicorn','app.main:app','--host','0.0.0.0','--port','8000','--app-dir','src') `
        -WorkingDirectory $backendDir `
        -WindowStyle Hidden `
        -RedirectStandardOutput $backendOut `
        -RedirectStandardError $backendErr | Out-Null
}

# Frontend ---------------------------------------------------------------------
if (Test-PortInUse -Port 5173) {
    "[{0}] frontend skip: port 5173 already in use" -f (Get-Date -Format s) |
        Out-File -FilePath (Join-Path $logDir 'launcher.log') -Append -Encoding utf8
} else {
    $frontendOut = Join-Path $logDir 'frontend.log'
    $frontendErr = Join-Path $logDir 'frontend.err.log'
    Start-Process -FilePath 'cmd.exe' `
        -ArgumentList @('/c','npm','run','dev') `
        -WorkingDirectory $frontendDir `
        -WindowStyle Hidden `
        -RedirectStandardOutput $frontendOut `
        -RedirectStandardError $frontendErr | Out-Null
}

exit 0

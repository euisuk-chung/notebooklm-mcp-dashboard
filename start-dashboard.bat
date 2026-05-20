@echo off
REM Manual launcher wrapper for Windows. Double-click or run from cmd.
REM The actual logic lives in start-dashboard.ps1 (also used by Task Scheduler).
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start-dashboard.ps1"

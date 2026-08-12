@echo off
cd /d "%~dp0"
where php >nul 2>nul
if errorlevel 1 (
  echo.
  echo PHP is not installed or not available in PATH.
  echo Install PHP/XAMPP, then run this file again.
  echo Do NOT use VS Code Live Server for PHP form submissions.
  pause
  exit /b 1
)
echo Starting Medico Overseas at http://127.0.0.1:8000/
start "" http://127.0.0.1:8000/
php -S 127.0.0.1:8000

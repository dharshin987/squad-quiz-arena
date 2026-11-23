@echo off
setlocal
cd /d "%~dp0"
start "Squad GK & G10 Arena" http://127.0.0.1:8000/
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8000 --bind 127.0.0.1
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8000 --bind 127.0.0.1
  exit /b
)
echo Python was not found. Install Python 3 or open the deployed GitHub Pages link.
pause

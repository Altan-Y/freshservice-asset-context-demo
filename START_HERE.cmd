@echo off
setlocal
where docker >nul 2>nul
if errorlevel 1 (
  echo Docker wurde nicht gefunden. Bitte Docker Desktop starten oder installieren.
  pause
  exit /b 1
)
docker compose up -d --build
if errorlevel 1 (
  echo Der Docker-Start ist fehlgeschlagen.
  pause
  exit /b 1
)
timeout /t 2 >nul
start "" http://localhost:8082
endlocal

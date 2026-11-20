@echo off
setlocal
cd /d "%~dp0"

echo [GatroxM] Iniciando backend y frontend en ventanas separadas...
start "GatroxM Backend (3000)" cmd /k "%~dp0start-backend.cmd"

REM Espera breve para que el backend levante antes del frontend
timeout /t 3 /nobreak >nul

if not exist "%~dp0gatroxm-portfolio-frontend\package.json" (
  echo [GatroxM] Frontend aun no generado. El backend ya se esta iniciando.
  echo           Vuelve a ejecutar start-frontend.cmd cuando termine la construccion del frontend.
  exit /b 0
)

start "GatroxM Frontend (4200)" cmd /k "%~dp0start-frontend.cmd"
echo [GatroxM] Listo. Backend: http://localhost:3000  Frontend: http://localhost:4200

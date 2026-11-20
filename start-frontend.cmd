@echo off
setlocal
cd /d "%~dp0gatroxm-portfolio-frontend"
if not exist package.json (
  echo [GatroxM] El frontend aun no esta listo. Espera a que termine la construccion inicial.
  exit /b 1
)
echo [GatroxM] Frontend -> http://localhost:4200
call npx.cmd ng serve --open

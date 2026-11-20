@echo off
setlocal
cd /d "%~dp0gatroxm-portfolio-backend"
echo [GatroxM] Backend -> http://localhost:3000
call npm.cmd run dev

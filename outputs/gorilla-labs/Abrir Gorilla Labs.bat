@echo off
cd /d "%~dp0"
start "Gorilla Labs - servidor local" /b node preview-server.js
timeout /t 2 /nobreak >nul
start "Gorilla Labs - Vista previa" http://127.0.0.1:8000
echo El servidor sigue activo en esta ventana. Presiona Ctrl+C para detenerlo.
pause

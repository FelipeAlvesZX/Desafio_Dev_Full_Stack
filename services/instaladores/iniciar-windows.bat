@echo off
setlocal
cd /d "%~dp0..\docker"

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao encontrado. Instale o Docker Desktop:
    echo   https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Subindo banco de dados, backend e frontend via Docker Compose...
docker compose up --build -d
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao subir os containers. Veja o log acima.
    pause
    exit /b 1
)

echo.
echo Projeto no ar:
echo   Frontend: http://localhost:4222
echo   Backend:  http://localhost:8082
echo.
echo Para parar tudo depois, rode: docker compose down
echo.
pause
endlocal
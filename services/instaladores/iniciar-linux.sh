#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../docker"

if ! command -v docker >/dev/null 2>&1; then
    echo "[ERRO] Docker nao encontrado. Instale: https://docs.docker.com/engine/install/"
    exit 1
fi

echo "Subindo banco de dados, backend e frontend via Docker Compose..."
docker compose up --build -d

echo ""
echo "Projeto no ar:"
echo "  Frontend: http://localhost:4222"
echo "  Backend:  http://localhost:8082"
echo ""
echo "Para parar tudo depois, rode: docker compose down (dentro de services/docker)"
#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../docker"

if ! command -v docker >/dev/null 2>&1; then
    echo "[ERRO] Docker nao encontrado. Instale o Docker Desktop para Mac:"
    echo "  https://www.docker.com/products/docker-desktop"
    read -p "Pressione ENTER para sair..."
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
read -p "Pressione ENTER para fechar esta janela..."
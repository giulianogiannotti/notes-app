#!/bin/bash
# run-app.sh
# Script para levantar el backend, frontend y migraciones en un solo comando.

set -e  # Salir si hay error

echo "=== Creando archivo de configuración si no existe ==="
CONFIG_FILE="backend/notes-backend/.env"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Creando archivo $CONFIG_FILE con configuración por defecto..."
  cat <<EOL > "$CONFIG_FILE"
# Variables de entorno ejemplo:
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_basededatos
EOL
else
  echo "Archivo de configuración ya existe, no se sobreescribe."
fi

echo "=== Ejecutando migraciones de TypeORM ==="
cd backend/notes-backend
npm install
npm run typeorm migration:run -- -d src/data-source.ts

echo "=== Arrancando backend (npm run dev) ==="
# Ejecutamos backend en background
npm run start dev &
BACKEND_PID=$!

echo "=== Arrancando frontend (npm run dev) ==="
cd ../../frontend/notes-frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "Aplicación corriendo:"
echo " - Backend PID: $BACKEND_PID"
echo " - Frontend PID: $FRONTEND_PID"

echo "Para detener la app ejecuta: kill $BACKEND_PID $FRONTEND_PID"

wait $BACKEND_PID $FRONTEND_PID

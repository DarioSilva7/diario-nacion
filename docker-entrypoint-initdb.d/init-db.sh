#!/bin/bash

# Esperar a que el servicio de base de datos esté disponible
echo "Esperando a que la base de datos esté lista..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Esperando..."
  sleep 2
done

# Exportar la contraseña para que psql y createdb la usen automáticamente
export PGPASSWORD="$DB_PASSWORD"

# Crear la base de datos si no existe
echo "Verificando si la base de datos existe..."
DB_EXISTS=$(psql -h "$DB_HOST" -U "$DB_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" != "1" ]; then
  echo "Creando base de datos '$DB_NAME'..."
  createdb -h "$DB_HOST" -U "$DB_USER" "$DB_NAME"
else
  echo "La base de datos '$DB_NAME' ya existe."
fi
sleep 2
# Ejecutar migraciones
echo "Ahora se correrrian las migraciones..."
sleep 2
# echo "Ejecutando migraciones..."
# npx typeorm migration:run

# Ejecutar el contenedor con el comando que se pasó a Docker
exec "$@"

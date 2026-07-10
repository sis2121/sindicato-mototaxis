#!/bin/bash
set -e
echo "🔄 Ejecutando migraciones..."
flask db upgrade || (flask db init && flask db migrate -m "init" && flask db upgrade)
echo "🚀 Iniciando la aplicación Flask..."
exec gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 wsgi:app

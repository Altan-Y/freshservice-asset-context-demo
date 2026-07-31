#!/usr/bin/env sh
set -eu
docker compose up -d --build
printf '%s\n' 'Open http://localhost:8082'

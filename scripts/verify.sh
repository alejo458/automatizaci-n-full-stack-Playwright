#!/usr/bin/env bash
# Harness mínimo: conserva códigos de salida. Una prueba no ejecutada NO cuenta como aprobada.
set -u
mkdir -p artifacts
npm run typecheck;           TC=$?
WORKERS=2 npx playwright test; PW=$?
echo "{\"typecheck\":$TC,\"playwright\":$PW}" > artifacts/exit-codes.json
cat artifacts/exit-codes.json
[ $TC -eq 0 ] && [ $PW -eq 0 ]

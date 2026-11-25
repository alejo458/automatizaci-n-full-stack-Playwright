# Skills adicionales propuestas

| | 1. triage-playwright-failure | 2. contract-diff-api | 3. new-test-data-builder |
|---|---|---|---|
| Propósito | Clasificar un fallo: test, datos o bug de producto | Comparar documentación/OpenAPI vs respuestas reales y producir hallazgos | Crear builders sintéticos y fixtures con limpieza |
| Usuario | Quien revisa CI | QA/dev de API | Dev que añade escenarios |
| Entradas | `playwright-report`, `results.json`, trazas | Doc/colección Postman + `BASE_URL` | Esquema del recurso + reglas de validación |
| Salidas | Informe con causa probable, evidencia, acción | `FINDINGS.md` con esperado/observado | Builder + fixture + test de ejemplo |
| Verificación | Cada conclusión cita artefacto; reproducción con 1 comando | Replay de peticiones; diff reproducible | typecheck + test usa limpieza (sin datos huérfanos) |
| Prioridad | **Alta (la primera)** | Media | Media |

## Cuál construiría primero y por qué
**triage-playwright-failure**: es el cuello de botella diario; sin triage, los fallos intermitentes erosionan la confianza en los gates.

## Medición de utilidad
Tiempo medio de diagnóstico, % de fallos clasificados correctamente (revisión humana por muestreo), reducción de reruns manuales, nº de skills reutilizadas sin ayuda.

## Script o fixture en lugar de skill
Limpieza de datos, generación de fechas libres, login/token y exit codes son **determinísticos**: van en fixtures/scripts (`fixtures/index.ts`, `scripts/verify.sh`). La skill orquesta criterio, no lógica mecánica.

## Gates
- **Smoke** (`npm run test:smoke`): en cada PR, bloqueante.
- **Regresión** (`npm run test:regression`): nocturno/pre-release; publicar `artifacts/results.json` y `exit-codes.json`.

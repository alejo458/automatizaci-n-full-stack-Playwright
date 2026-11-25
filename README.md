# RBP QA Automation (Playwright + TypeScript)

Pruebas API + UI de reserva en Restful Booker Platform (`https://automationintesting.online`).

## Instalación
```bash
npm ci   # (usa npm install la primera vez para generar package-lock.json y commitearlo)
npm run install:browsers
cp .env.example .env   # opcional; exportar BASE_URL/ADMIN_USER/ADMIN_PASS
```
Entorno local alternativo: levantar RBP según su README y usar `BASE_URL=http://localhost:3003`.

## Ejecución
| Objetivo | Comando |
|---|---|
| Todo (2 workers) | `WORKERS=2 npm test` |
| Smoke | `npm run test:smoke` |
| Regresión | `npm run test:regression` |
| Harness con exit codes | `npm run verify` |
| Reporte | `npm run report` |

Evidencias: `playwright-report/`, `test-results/` (trazas, screenshots, video en fallo), `artifacts/results.json`, `artifacts/exit-codes.json`.
**Una prueba no ejecutada no cuenta como aprobada.**

## Estructura
`src/api` clientes · `src/pages` POM · `src/data` datos sintéticos · `fixtures` aislamiento/limpieza · `tests/api`, `tests/e2e` · `.claude/skills/implement-playwright-tests/SKILL.md` · `docs/`.

## Escenarios
- API exitosa (parametrizada ×2): crear + consultar, valida identidad, habitación, fechas, huésped.
- API negativa (×2 datasets): 400 y la reserva no existe.
- UI + API: reserva por UI, confirmación, consulta por API del mismo registro.

## Uso para otro desarrollador / agente
Invocar al agente con: *"Usa la skill implement-playwright-tests para <escenario>"*. Debe respetar `SKILL.md` y reportar exit codes.

## Evidencia de uso de IA (COMPLETAR con datos reales)
1. Commit `skill: add implement-playwright-tests` (antes de usarla).
2. Prompt/invocación exacta usada con el agente.
3. Diff generado por el agente (commit separado o rama).
4. Ejecución: comando + exit codes + reporte.
5. Correcciones humanas y su justificación.
6. Commit final del resultado.

## Tiempo invertido y pendientes
_Completar._ Pendientes: validar selectores/rutas en run real, completar `docs/FINDINGS.md`, generar lockfile.

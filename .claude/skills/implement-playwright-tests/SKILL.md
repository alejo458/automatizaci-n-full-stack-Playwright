---
name: implement-playwright-tests
description: Implementa pruebas Playwright (TypeScript) de API y UI para Restful Booker Platform siguiendo POM, clientes de API y fixtures del repo. Úsala al añadir o modificar escenarios de prueba.
---

# Implementar pruebas Playwright

## Propósito
Convertir un escenario de negocio en pruebas Playwright Test mantenibles, aisladas y verificables, reutilizando la arquitectura existente.

## Entradas requeridas
1. Escenario en lenguaje natural (qué comprobar, resultado esperado de negocio).
2. Capa(s): `api`, `ui` o integrada.
3. Contrato esperado (doc de API / README). Si falta, ver "Información insuficiente".
4. `BASE_URL` y credenciales (`.env`, nunca en código).

## Pasos
1. Leer `README.md`, `fixtures/index.ts`, `src/api/*`, `src/pages/*` y un test existente. No inventar rutas: confirmarlas con `curl`/`codegen`.
2. Escribir las expectativas (status, campos) **desde la documentación antes de ejecutar**. Anotar en `docs/FINDINGS.md` cualquier diferencia contrato vs observado.
3. Implementar solo lo faltante:
   - API: método en el cliente de `src/api/` (devuelve `APIResponse`; el test valida).
   - UI: locators y acciones en un Page Object de `src/pages/`; los specs no contienen selectores.
   - Datos: builders en `src/data/` (sintéticos, apellido único para localizar el registro propio).
4. Usar fixtures de `fixtures/index.ts` (`bookingApi`, `room`, `freeStay`, `track`). Todo registro creado se registra con `track(id)` para limpieza.
5. Escribir el spec en `tests/api` o `tests/e2e`, con tags `@smoke` y/o `@regression`.
6. Ejecutar la verificación (abajo). Corregir y repetir.

## Convenciones
- **POM**: una clase por página/flujo, locators como propiedades `readonly`, métodos con nombre de intención (`fillGuest`, `submit`), aserciones de pantalla en métodos `expect*`.
- **Locators**: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByTestId`. Prohibido XPath/CSS frágil.
- **Esperas**: solo aserciones web-first y `expect.poll`. Prohibido `waitForTimeout` y `sleep`.
- **Aislamiento**: tests independientes, sin orden; cada test crea y limpia sus datos; backend real (sin `route.fulfill` ni mocks en los escenarios principales).
- **Clientes de API** separados de los tests; sin `fetch`/`axios` ad hoc.
- **Fixtures**: lo que se repite en 2+ tests o requiere limpieza va a una fixture.

## Comandos de verificación
```bash
npm run typecheck
WORKERS=2 npx playwright test <archivo> ; echo "exit=$?"
npm run verify          # typecheck + suite completa, escribe artifacts/exit-codes.json
```

## Criterios de éxito
- `typecheck` exit 0 y Playwright exit 0 con ≥2 workers, sin `test.skip`/`fixme` nuevos.
- Aserciones de negocio (identidad, habitación, fechas, huésped), no solo status.
- Ejecutado 2 veces seguidas sin fallo (detecta dependencias/colisiones de datos).
- Sin esperas fijas, sin selectores en specs, datos limpiados.

## Ante errores
- **Fallo de test**: leer traza/screenshot en `test-results/` y `playwright-report/`. Distinguir: (a) error del test, (b) datos/colisión, (c) bug del producto. Para (c) **no debilitar la aserción**: documentar en `docs/FINDINGS.md` (pasos, esperado, observado, evidencia) y marcar con `test.fail()` justificado solo si el humano lo aprueba.
- **No ejecutable (sin red, sin navegadores)**: reportar "no ejecutado", con el comando y el error; nunca declarar aprobado.
- **Información insuficiente** (ruta, campo, selector o regla de negocio desconocida): detenerse, listar lo que falta y preguntar. No adivinar ni inventar datos esperados.
- **Prohibido**: borrar/relajar aserciones, subir timeouts para "arreglar", compartir datos entre tests.

## Salida esperada
Resumen con: archivos cambiados, comando ejecutado, exit codes, diferencias contrato/observado, supuestos pendientes.

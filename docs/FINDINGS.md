# Hallazgos contrato vs comportamiento observado

> Estado: **pendiente de ejecución real.** Completar tras correr la suite.
> No se declara ningún bug hasta tener evidencia (traza/screenshot/respuesta).

| # | Caso | Esperado (doc) | Observado | Evidencia | Severidad |
|---|------|----------------|-----------|-----------|-----------|
| – | – | – | – | – | – |

Supuestos a confirmar en el primer run:
- `POST /api/auth/login` → 200 + `token`.
- `POST /api/booking` crea con 201; inválido → 400.
- `GET /api/booking?roomid=N` y `GET /api/booking/{id}` requieren cookie `token`.
- La lectura devuelve fechas como `bookingDates` (se tolera `bookingdates`).
- Ruta UI `/reservation/{roomid}?checkin=..&checkout=..` y textos "Book this room", "Reserve Now", "Booking Confirmed".

# Casos priorizados (no automatizados) y riesgo

| Caso | Riesgo que cubre |
|------|------------------|
| Reservar fechas solapadas con una reserva existente → rechazo (409/400) | Doble reserva / pérdida de ingresos e integridad del inventario |
| Reservar sin autenticación recursos protegidos (`GET /booking/{id}`) → 401/403 | Exposición de datos personales (email, teléfono) |
| Validar límites de campos (firstname 2/3/18/19 chars, phone 10/11/21/22) | Reglas de validación inconsistentes entre UI y API |
| Checkout anterior o igual al checkin → rechazo | Reservas con duración inválida/negativa |
| Consistencia del calendario del reporte (`/api/report`) tras crear/borrar reserva | Vistas administrativas desincronizadas |

## Limitaciones
- Demo compartida: otros usuarios y reinicios pueden afectar datos; se mitiga con fechas lejanas, apellido único y verificación de solapamiento.
- Selectores UI y rutas de API a validar en el primer run real.

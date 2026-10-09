# Pendientes y decisiones abiertas — CRM CrediMil

Última actualización: 8 de octubre de 2026

---

## Bloqueantes — alguien debe decidir antes de construir

### Almacenamiento de documentos (AWS)
Decidieron S3. **Falta la cuenta.** El código ya está listo: con agregar
`ALMACEN_BUCKET`, `ALMACEN_REGION`, `ALMACEN_ACCESS_KEY` y `ALMACEN_SECRET_KEY`
al `.env`, cambia solo. Mientras, guarda en disco local.

- ¿Quién abre y paga la cuenta?
- El bucket debe quedar **privado**. Son INEs y comprobantes de 23,500 personas.
- Alternativa más barata: Cloudflare R2 (mismo código, sin cobro por salida).
  Solo requiere agregar `ALMACEN_ENDPOINT`.

### Riesgos del sistema actual (reportados, sin respuesta)
1. Las fotos de INE se abren **sin contraseña** desde `credimil.com/fotos_visita/...`
2. Si el servidor falla se pierden las ~128,000 imágenes: no hay respaldo
3. No hay registro de quién vio qué documento
4. No hay política de cuánto tiempo se conservan después de liquidar un crédito

### Notificaciones (descartado por ahora)
Van **al cliente por SMS**, no a promotoras. Requiere contratar proveedor
(Twilio, Sinch, Infobip) y tiene costo por mensaje. Las tablas que se habían
creado se eliminaron porque asumían destinatario interno.

- ¿Con qué mandan SMS hoy? Si ya tienen proveedor, reusarlo es más simple.
- Hay regulación mexicana sobre SMS comerciales masivos.

---

## Preguntas sin contestar

### Catálogo de productos
- El catálogo migrado tiene **13 plazos** (10, 12, 14, 18, 21, 28, 35, 36, 40,
  45, 52, 144, 161). El negocio habló de cuatro (12, 14, 18, 21). ¿Cuáles se
  ofrecen en el alta? ¿Qué pasa con los créditos vivos en otros plazos?
- **Basura detectada, pendiente de validar:**
  - Plazo 10 tiene las mismas tarifas que plazo 12 (10% vs 32% de interés real)
  - Duplicados: 10/$10,000, 12/$5,000, 52/$60,000
  - Outlier: 10/$12,000 → $1,200 (rompe el patrón de su plazo)
  - Inconsistencia grave: 52/$58,000 → $1,257 (12%) vs 52/$60,000 → $2,189 (90%)

### Corte semanal
- Corre los martes a las 23:59. ¿**Por zona** o uno global? La tabla vieja
  (`Cortes` con campo `Zona`, `Corte_Sector` con desglose) sugiere por zona.
- Se construirá primero como endpoint manual y luego se automatiza con cron.
  Un proceso que agrega deuda a cientos de clientes no debe correr sin
  supervisión la primera vez.

### Multas
- "Si se cobra multa no se puede incrementar el monto" — ¿significa que un
  cliente con multas no puede renovar por más dinero, o que al cobrar multa no
  se agrega la semana adicional?
- ¿La multa por visita al domicilio es siempre $50?

### Contrato
- La cláusula segunda dice que los pagos son los **SÁBADOS**, pero el corte es
  martes. ¿El contrato está desactualizado? **Debe revisarlo el área legal**,
  no desarrollo.

### Zonas de cobranza
- W, X y Z son "lo mismo" y se asignan a mano, pero mencionaron cobranza
  **judicial y extrajudicial**. ¿Qué letra es cuál?
- ¿El cambio a zona especial debe ser automático al llegar a 3 fallos, o
  siempre manual? (Hoy es manual.)

### Cobranza judicial
La tabla vieja de créditos tiene un bloque completo sin modelar: `demanda`,
`montolegal`, `etapa`, `juzgado`, `expediente`, `cargogestor`, `cargoabogado`,
`nivelgestion`, `penalizado`, `convenio`. Hay tabla `etapas` con 8 pasos
(JUZGADO → EXPEDIENTE → RADICACIÓN → DILIGENCIAS → EMPLAZAMIENTO → BIENES
EMBARGADOS → SENTENCIA → EJECUCIÓN).

Solo se guardaron las marcas booleanas. **El flujo completo es un módulo propio
(Gestión).** ¿Entra en el alcance?

### Campos del sistema viejo sin aclarar
- `pregunta1`, `pregunta2`, `pregunta3` en solicitudes — ¿qué son?
- `v_tel` y `v_tel_aval` (default PENDIENTE) — ¿alguien verifica por teléfono
  antes de aprobar? ¿Quién?
- `presolicitud` — ¿qué es?
- `beneficiario` y `tel_beneficiario` — ¿de servicios funerarios?

### Tarjetón
- Se imprimen `plazo × 2 + 1` casillas. El físico de referencia (14 semanas)
  traía 29, que coincide. **Confirmar con uno de otro plazo.**
- El QR lleva el número de crédito. ¿Es lo que contiene el del sistema viejo, o
  apunta a una URL?

### Rol super_admin
El negocio lo pidió para regenerar créditos. **Queda para la siguiente visita**,
cuando dividan bien los roles. Mientras, esas acciones las hace `administrador`.

---

## Por construir

### Pagos (siguiente módulo)
Schema listo: `pagos_credito`, `cortes`, `corte_detalles`. Falta todo lo demás.

Requisito acordado: **captura con check**. Si el cliente pagó exacto, un clic;
si pagó diferente, captura manual. Reduce errores.

Destraba: estado de cuenta, semanas adicionales, fallos reales, calificación,
reversar y regenerar créditos.

### Créditos — operaciones faltantes
- **Regenerar** (quitar semana adicional y recolocar el pago antes del corte) —
  requiere Pagos
- **Reversar** (cancelar y devolver el saldo al crédito anterior) — requiere Pagos
- **Cancelar** (dejar el crédito muerto, sin restaurar nada)
- **Créditos especiales** (gente fuera del padrón, como familiares)

### Otros módulos
- **Usuarios**: el backend existe desde el primer entregable, el frontend es
  placeholder
- **Evidencia**: la tabla vieja `imagenes` tiene 128,586 registros
- **Reportes, Gestión, Balance**: sin definir
- **Dashboards por rol**: hoy `/inicio` sirve el de admin a los cinco roles

### Migración del histórico
El schema ya está preparado (`id_legacy` en todas las tablas, folios arrancando
arriba del sistema viejo). Antes de migrar:

1. Correr el diagnóstico de CURPs:
```sql
SELECT COUNT(*) AS total,
       SUM(curp IS NULL OR TRIM(curp) = '') AS sin_curp,
       SUM(CHAR_LENGTH(TRIM(curp)) <> 18)   AS mal_formada
FROM clientes;
```
2. Limpiar duplicados y vacíos
3. Agregar `@unique` a `personas.curp`
4. Cambiar de `db push` a `prisma migrate` para tener historial

---

## Deuda técnica

| Qué | Dónde | Urgencia |
|---|---|---|
| Credenciales de BD hardcodeadas (en git) | `src/lib/prisma.ts` | Alta |
| `@unique` en CURP | `schema.prisma` | Tras migración |
| Helper de zona duplicado ×3 | `*.routes.ts` | Baja |
| `GET /documentos/:id` no filtra por zona | `documentos.routes.ts` | Media |
| `solicitud_empleo` / `solicitud_referencias` sin usar | `schema.prisma` | Baja |
| `as any` en payloads de clientes | frontend | Baja |
| `useCreditoDetalle` devuelve `any` | frontend | Baja |
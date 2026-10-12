/*  Formato de fechas y dinero para la UI.

    Fechas de SOLO FECHA (@db.Date: fecha_inicio, fecha_fin_estimada, la
    fecha de un pago, fecha_corte…) llegan como "AAAA-MM-DD" o como
    medianoche UTC ("…T00:00:00.000Z"). Se formatean en UTC: en hora
    local (León, UTC−6) saldrían un día antes.

    Fechas con HORA (fecha_alta, fecha_hora de pagos, movimientos) son
    instantes reales y se formatean en hora local.
*/

type Fecha = string | Date | null | undefined;

const ESTILOS_FECHA = {
  corta: { day: "2-digit", month: "short", year: "numeric" },
  media: { dateStyle: "medium" },
  larga: { day: "2-digit", month: "long", year: "numeric" },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

type EstiloFecha = keyof typeof ESTILOS_FECHA;

/** Fecha de solo fecha → texto. null si no hay fecha o es inválida. */
export function formatearFechaSolo(valor: Fecha, estilo: EstiloFecha = "media"): string | null {
  if (!valor) return null;

  // "AAAA-MM-DD" sin hora: new Date() ya la toma como UTC.
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;

  return fecha.toLocaleDateString("es-MX", { ...ESTILOS_FECHA[estilo], timeZone: "UTC" });
}

/** Instante (fecha y hora) → texto en hora local. */
export function formatearFechaHora(valor: Fecha): string | null {
  if (!valor) return null;

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;

  return fecha.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

/*  Hoy en hora local como "AAAA-MM-DD", para inputs de fecha y para
    mandar al backend. No usar toISOString(): después de las 18:00 en
    León ya es mañana en UTC.  */
export function hoyLocal(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Decimales del backend (string o number) → "$1,234.50". */
export function formatearMoneda(valor: string | number | null | undefined): string {
  return Number(valor ?? 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

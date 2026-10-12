export const LETRAS_ZONA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
 
export const ZONA_EMPLEADOS = "Y";
export const ZONAS_COBRANZA = ["W", "X", "Z"] as const;
export const ZONAS_ESPECIALES = ["W", "X", "Y", "Z"] as const;
 
export function esZonaEspecial(zona: string | null | undefined): boolean {
  return !!zona && (ZONAS_ESPECIALES as readonly string[]).includes(zona.toUpperCase());
}
 
/** Texto explicativo para la UI según la zona destino. */
export function descripcionZonaEspecial(zona: string): string {
  if (zona === ZONA_EMPLEADOS) return "créditos de empleados";
  return "cobranza (cuentas que no pagan)";
}
 
export const OPCIONES_ZONA = LETRAS_ZONA.map((l) => ({ valor: l, etiqueta: l }));
 
export const OPCIONES_SECTOR = Array.from({ length: 100 }, (_, i) => ({
  valor: String(i + 1),
  etiqueta: String(i + 1),
}));
/*  Para barras de filtros, donde la etiqueta va oculta: la opción
    elegida tiene que decir sola qué es ("Zona B", no "B").  */
export const OPCIONES_FILTRO_ZONA = LETRAS_ZONA.map((l) => ({ valor: l, etiqueta: `Zona ${l}` }));

export const OPCIONES_FILTRO_SECTOR = OPCIONES_SECTOR.map((o) => ({
  valor: o.valor,
  etiqueta: `Sector ${o.valor}`,
}));

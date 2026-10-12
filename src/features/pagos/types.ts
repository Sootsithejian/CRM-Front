/*  Tipos del módulo de Pagos. Espejo de pagos.routes.ts del backend.

    Ojo con los montos: los campos que salen directo de la tabla
    (monto, multa de un pago) son Decimal y llegan como string; los que
    calcula el backend (estado de cuenta, sumas) llegan como number.
    Siempre Number() antes de operar.

    Fechas: `fecha` de un pago y las del encabezado del crédito llegan
    como "AAAA-MM-DD"; primer_corte y fecha_fin_estimada del estado de
    cuenta llegan como medianoche UTC. Formatear con formatearFechaSolo.
*/

import { ROLES } from "../../shared/constants/roles";
import type { Rol } from "../../shared/constants/roles";

/** Espejo de POST /pagos en el backend. Cancelar: solo administrador. */
export const ROLES_CAPTURA_PAGOS: Rol[] = [ROLES.ADMINISTRADOR, ROLES.GERENTE_ZONA, ROLES.PROMOTOR];

export const TIPOS_PAGO = ["EFE", "DEP", "TRA", "OFI"] as const;

export type TipoPago = (typeof TIPOS_PAGO)[number];

export const ETIQUETA_TIPO_PAGO: Record<TipoPago, string> = {
  EFE: "Efectivo",
  DEP: "Depósito",
  TRA: "Transferencia",
  OFI: "Oficina",
};

export const OPCIONES_TIPO_PAGO = TIPOS_PAGO.map((t) => ({
  valor: t,
  etiqueta: ETIQUETA_TIPO_PAGO[t],
}));

/** Máximo de multas por crédito (MAX_MULTAS_POR_CREDITO en el backend). */
export const MAX_MULTAS_POR_CREDITO = 4;

export const LARGO_OBSERVACIONES = 500;

export function etiquetaTipoPago(tipo: string): string {
  return ETIQUETA_TIPO_PAGO[tipo as TipoPago] ?? tipo;
}

export interface Pago {
  id: number;
  id_credito: number;
  id_cliente: number;
  monto: string;
  multa: string;
  tipo: string;
  semana: number;
  fecha: string;
  fecha_hora: string;
  zona: string | null;
  sector: string | null;
  usuario: string;
  observaciones: string | null;
  cancelado: boolean;
  fecha_cancelado: string | null;
  usuario_cancelado: string | null;
  motivo_cancelado: string | null;
  id_corte: number | null;
}

export interface PagoListado extends Pago {
  numero_credito: number;
  numero_cliente: number;
  nombre_cliente: string;
}

export interface PagoDetalle extends PagoListado {
  corte: { id: number; fecha_corte: string; estatus: string } | null;
}

export interface RespuestaPagos {
  total: number;
  pagina: number;
  limite: number;
  paginas: number;
  suma_monto: number;
  suma_multas: number;
  pagos: PagoListado[];
}

export interface FiltrosPagos {
  fecha_desde?: string;
  fecha_hasta?: string;
  zona?: string;
  sector?: string;
  tipo?: string;
  numero_credito?: string;
  cancelados?: string;
  pagina?: number;
  limite?: number;
}

export interface EstadoCuenta {
  deuda_total: number;
  pago_adelantado: number;
  pagado: number;
  abonado: number;
  saldo: number;
  excedente: number;
  multas_cobradas: number;
  pago_fijo: number;
  plazo: number;
  semanas_adicionales: number;
  semanas_exigibles: number;
  semana_actual: number;
  semanas_cerradas: number;
  primer_corte: string;
  fecha_fin_estimada: string;
  esperado: number;
  atraso: number;
  adelanto: number;
  al_corriente: boolean;
  liquidable: boolean;
  fallos: number;
  calificacion: "BUENO" | "REGULAR" | "MALO";
}

export interface SemanaEstado {
  semana: number;
  fecha_corte: string;
  cerrada: boolean;
  esperado_acumulado: number;
  abonado_semana: number;
  abonado_acumulado: number;
  multas_semana: number;
  /** null = esa semana todavía no pasa por un corte ejecutado. */
  genero_fallo: boolean | null;
}

export interface EncabezadoCredito {
  id: number;
  numero_credito: number;
  numero_cliente: number;
  nombre_cliente: string;
  estatus: string;
  zona: string | null;
  sector: string | null;
  fecha_inicio: string;
  fecha_liquidado: string | null;
}

export interface RespuestaEstadoCuenta {
  credito: EncabezadoCredito;
  /** null mientras el crédito no se entrega. */
  estado_cuenta: EstadoCuenta | null;
  semanas: SemanaEstado[];
  pagos: Pago[];
}

export interface PagoInput {
  id_credito: number;
  monto: number;
  multa?: number;
  tipo?: TipoPago;
  /** AAAA-MM-DD. Si se omite, el backend usa hoy en León. */
  fecha?: string;
  observaciones?: string;
}

export interface RespuestaRegistroPago {
  message: string;
  pago: Pago;
  liquidado: boolean;
  excedente: number;
  estado_cuenta: EstadoCuenta;
}

export interface RespuestaCancelacionPago {
  message: string;
  pago: Pago;
  credito_reactivado: boolean;
  advertencia: string | null;
  estado_cuenta: EstadoCuenta;
}

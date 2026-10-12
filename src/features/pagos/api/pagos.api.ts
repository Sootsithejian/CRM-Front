import { api } from "../../../shared/api/client";
import type {
  FiltrosPagos,
  PagoDetalle,
  PagoInput,
  RespuestaCancelacionPago,
  RespuestaEstadoCuenta,
  RespuestaPagos,
  RespuestaRegistroPago,
} from "../types";

export async function listarPagos(filtros: FiltrosPagos = {}): Promise<RespuestaPagos> {
  const { data } = await api.get<RespuestaPagos>("/pagos", { params: filtros });
  return data;
}

export async function obtenerPago(id: number): Promise<PagoDetalle> {
  const { data } = await api.get<{ pago: PagoDetalle }>(`/pagos/${id}`);
  return data.pago;
}

export async function registrarPago(payload: PagoInput): Promise<RespuestaRegistroPago> {
  const { data } = await api.post<RespuestaRegistroPago>("/pagos", payload);
  return data;
}

export async function cancelarPago(id: number, motivo: string): Promise<RespuestaCancelacionPago> {
  const { data } = await api.patch<RespuestaCancelacionPago>(`/pagos/${id}/cancelar`, { motivo });
  return data;
}

/** Por id interno, o por número de crédito con por = "numero". */
export async function obtenerEstadoCuenta(
  valor: number,
  por: "id" | "numero" = "id"
): Promise<RespuestaEstadoCuenta> {
  const { data } = await api.get<RespuestaEstadoCuenta>(`/creditos/${valor}/estado-cuenta`, {
    params: por === "numero" ? { por: "numero" } : undefined,
  });
  return data;
}

import { api } from "../../../shared/api/client";
import type {
    Cotizacion,
    FiltrosSolicitudes,
    PlazoDisponible,
    ProductoCredito,
    RespuestaSolicitudes,
    SolicitudInput,
    FiltrosCreditos,
    RespuestaCreditos,
} from "../types";

export async function listarPlazos(): Promise<PlazoDisponible[]> {
    const { data } = await api.get<{ plazos: PlazoDisponible[]}>("/creditos/plazos");
    return data.plazos;
}

export async function listarProductos(plazo: number): Promise<ProductoCredito[]> {
    const { data } = await api.get<{ productos: ProductoCredito[]}>("/creditos/productos", {
        params: { plazo}
    });
    return data.productos;
}

export async function listarSolicitudes(
    filtros: FiltrosSolicitudes = {}
): Promise<RespuestaSolicitudes> {
    const { data } = await api.get<RespuestaSolicitudes>("/solicitudes", {
        params: filtros,
    });
    return data;
}

export async function crearSolicitud(payload: SolicitudInput) {
    const { data } = await api.post("/solicitudes", payload);
    return data;
}

export async function dictaminarSolicitud(
    id: number,
    accion: "preaprobar" | "aprobar" | "rechazar",
    motivo?: string
) {
    const { data} = await api.patch(`/solicitudes/${id}/dictamen`, { accion, motivo });
    return data;
}

export async function cotizar(params: {
    id_producto: number;
    servicios_funerarios?: boolean;
    pago_adelantado?: number;
    saldo_anterior?: number;
}): Promise<Cotizacion> {
    const { data } = await api.get<Cotizacion>("/creditos/cotizar", {params});
    return data;
}

export type PropietarioDoc = "TITULAR" | "AVAL_1" | "AVAL_2";
export type TipoDoc = "INE_FRENTE" | "INE_REVERSO" | "COMPROBANTE_DOMICILIO";

export async function subirDocumento(
    idSolicitud: number,
    propietario: PropietarioDoc,
    tipo: TipoDoc,
    archivo: File
) {
    const form = new FormData();
    form.append("archivo", archivo);
    form.append("propietario", propietario);
    form.append("tipo", tipo);

    const { data } = await api.post(`/solicitudes/${idSolicitud}/documentos`, form, {
        headers: { "Content-Type": "multipart/form-data"},
    });
    return data;
}

export async function listarCreditos(
  filtros: FiltrosCreditos = {}
): Promise<RespuestaCreditos> {
  const { data } = await api.get<RespuestaCreditos>("/creditos", { params: filtros });
  return data;
}
 
export async function obtenerCredito(id: number) {
  const { data } = await api.get(`/creditos/${id}`);
  return data;
}

/*  Descarga un PDF protegido


*/

async function abrirPdf(url: string, nombre: string, descargar: boolean) {
  const { data } = await api.get(url, {
    params: descargar ? { descargar: "true" } : undefined,
    responseType: "blob",

  });
 
  const blobUrl = URL.createObjectURL(data as Blob);
 
  if (descargar) {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = nombre;
    a.click();
  } else {
    window.open(blobUrl, "_blank");
  }
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);

}
 
export function abrirTarjeton(idCredito: number, numero: number, descargar = false) {
  return abrirPdf(
    `/creditos/${idCredito}/tarjeton`,
    `tarjeton-${numero}.pdf`,
    descargar
  );

}
 
export function abrirContrato(idCredito: number, numero: number, descargar = false) {
  return abrirPdf(
    `/creditos/${idCredito}/contrato`,
    `contrato-${numero}.pdf`,
    descargar
  );

}
 
import { api } from "../../../shared/api/client";
import type { AltaListaNegraInput, FiltrosListaNegra, RespuestaListaNegra } from "../types";

export async function listarListaNegra(
    filtros: FiltrosListaNegra = {}
): Promise<RespuestaListaNegra> {
    const { data } = await api.get <RespuestaListaNegra>("/lista-negra",  {
        params: filtros,
    });
    return data
}

export async function agregarAListaNegra(payload: AltaListaNegraInput) {
    const { data } = await api.post("/lista-negra", payload);
    return data;
}

export async function retirarDeListaNegra(id: number, motivo_baja: string) {
    const { data } = await api.patch(`/lista-negra/${id}/baja`, {motivo_baja});
    return data;
}
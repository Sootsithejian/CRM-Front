import { api } from "../../../shared/api/client";
import type { ConteoUsuarios, FiltrosUsuarios, UsuarioListado } from "../types";

export async function listarUsuarios(
    filtros: FiltrosUsuarios = {}
): Promise<UsuarioListado[]> {
    const { data } = await api.get<{ usuarios: UsuarioListado[] }> ("/usuarios", {
        params: filtros,
    });
    return  data.usuarios;
}

export async function contarUsuarios(
    filtros: Pick<FiltrosUsuarios, "estatus" | "zona"> = {}
): Promise<ConteoUsuarios> {
    const {data} = await api.get<ConteoUsuarios>("/usuarios/conteo", {
        params: filtros
    });
    return data;
}
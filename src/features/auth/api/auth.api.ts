import { api } from "../../../shared/api/client";
import type { LoginPayload, LoginResponse,UsuarioPerfil } from "../types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const {data} = await api.post<LoginResponse>("/auth/login", payload);
    return data;
}

export async function obtenerPerfil(): Promise<UsuarioPerfil> {
    const {data} = await api.get<{ usuario: UsuarioPerfil}>("/me");
    return data.usuario;
}
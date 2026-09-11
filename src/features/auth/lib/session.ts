import { jwtDecode } from "jwt-decode";
import { esRolValido } from "../../../shared/constants/roles";
import type { JwtPayload, Sesion } from "../types";

const STORAGE_KEY = "credimil.token";

export function guardarToken(token:string): void {
    try {
        localStorage.setItem(STORAGE_KEY, token);
    } catch {

    }
}

export function leerToken(): string | null {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function borrarToken(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {

    }
}

/**Convertir token en sesion utilizable */

export function decodificarSesion(token: string | null): Sesion | null {
    if (!token) return null;

    let payload: JwtPayload;
    try {
        payload = jwtDecode<JwtPayload>(token);
    } catch {
        return null;
    }

    if(!payload?.exp || !payload.id || !payload.usuario) return null;

    const expiraEn = payload.exp * 1000;
    if(Date.now() >= expiraEn) return null;

    if(!esRolValido(payload.rol)) return null;

    return {
        id: payload.id,
        usuario: payload.usuario,
        rol: payload.rol,
        expiraEn,
    };
}

/**Leer y validar el token guardado */

export function recuperarSesion(): Sesion | null {
    const token = leerToken();
    const sesion = decodificarSesion(token);

    if(token && !sesion) borrarToken();

    return sesion;
}
import axios from "axios";
import type { AxiosError } from "axios";
import { borrarToken, leerToken } from "../../features/auth/lib/session";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {"Content-Type": "application/json"},
    timeout: 15000,
});

const RUTAS_PUBLICAS =["/auth/login"];

function esRutaPublica(url: string | undefined): boolean {
    if (!url) return false;
    return RUTAS_PUBLICAS.some((ruta) => url.includes(ruta));
}

let alExpirarSesion: (() => void) | null = null;

export function registrarManejadorDeSesionExpirada(fn: () => void): void {
    alExpirarSesion = fn;
}

/**Request: adjunta el token */

api.interceptors.request.use((config) => {
    const token = leerToken();
    if(token && !esRutaPublica(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**Response 401 de sesion */

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status;
        const url = error.config?.url;

        if(status === 401 && !esRutaPublica(url)) {
            borrarToken();
            alExpirarSesion?.();
        }
        return Promise.reject(error);
    }
);

/**Extraer message del back con fallback */

export function mensajeDeError(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if(typeof data?.message === "string" && data.message.trim()) {
            return data.message
        }
    }
    return fallback;
} 
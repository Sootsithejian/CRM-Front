import type {Rol} from "../../shared/constants/roles";

/**Payload del JWT del backend */

export interface JwtPayload {
    id: number;
    usuario: string;
    rol: string;
    token_version: number;
    iat: number;
    exp: number;
}

/**Respuesta de GET/api/me */

export interface UsuarioPerfil {
    id: number;
    nombre: string | null;
    usuario: string;
    rol: string;
    zona: string | null;
    puesto: string | null;
}

/**Derivacion del token sin llamar a la api */

export interface Sesion {
    id: number;
    usuario:string;
    rol: Rol;
    expiraEn: number;
}

export interface LoginPayload {
    usuario: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}

/**Error de login */

export interface LoginError {
    variante: "error" | "warning";
    titulo: string;
    detalle: string;
    bloqueadoHasta?: Date;
}
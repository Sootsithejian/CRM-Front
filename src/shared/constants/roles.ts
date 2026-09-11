export const ROLES = {
    ADMINISTRADOR : "administrador",
    GERENTE_ZONA : "gerente_zona",
    PROMOTOR : "promotor",
    AUDITOR : "auditor",
    LECTURA : "lectura",
} as const;

export type Rol = (typeof ROLES)[keyof typeof ROLES];

/**Etiquetas legibles en la ui */

export const ETIQUETA_ROL: Record<Rol, string> = {
    administrador : "Administrador",
    gerente_zona : "Gerente de zona",
    promotor : "Promotor",
    auditor : "Auditor",
    lectura : "Lectura",
};

/**Ruta de aterrizaje de cada rol al iniciar sesion */

export const RUTA_INICIO_POR_ROL: Record<Rol, string> = {
    administrador: "/inicio",
    gerente_zona : "/inicio",
    promotor : "/inicio",
    auditor : "/inicio",
    lectura : "/inicio",
};

export const RUTA_INICIO_FALLBACK = "/inicio";

export function esRolValido(valor: unknown): valor is Rol {
    return(
        typeof valor === "string" &&
        (Object.values(ROLES) as string[]).includes(valor)
    );
}

export function rutaInicioDe(rol: string | null | undefined): string {
    return esRolValido(rol) ? RUTA_INICIO_POR_ROL[rol] : RUTA_INICIO_FALLBACK;
}
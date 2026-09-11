export interface RegistroListaNegra {
    id: number;
    id_persona: number;
    id_cliente: number | null;
    nombre: string;
    curp: string | null;
    telefono: string | null;
    numero_cliente: number | null;
    zona: string | null;
    sector: string | null;
    motivo: string | null;
    activa: string | null;
    fecha_alta: string;
    usuario_alta: string;
    fecha_baja: string | null;
    usuario_baja: string | null;
    motivo_baja: string | null;
}

export interface RespuestaListaNegra {
    total: number;
    pagina: number;
    limite: number;
    paginas: number;
    registros: RegistroListaNegra[];
}

export interface FiltrosListaNegra {
    search?: string;
    activa?: "true" | "false";
    pagina?: number;
    limite?: number;
}

export interface AltaListaNegraInput {
    id_persona?: number;
    curp?: string;
    motivo: string;
}
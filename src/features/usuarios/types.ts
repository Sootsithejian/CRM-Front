export interface UsuarioListado {
    id:number;
    nombre: string | null;
    usuario: string;
    puesto: string | null;
    rol:string;
    id_sucursal:number | null;
    zona: string | null;
    estatus: string;
    sueldo: number | null;
    fecha_contratacion: string | null;
    telefono: string | null;
    categoria: string | null;
}

export interface FiltrosUsuarios {
    estatus?:string;
    zona?:string;
    search?:string;
}

export interface ConteoUsuarios {
    total:number;
    activos:number;
    inactivos:number;
}
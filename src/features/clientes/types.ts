export interface Domicilio {
    calle: string;
    numero_ext: string | null;
    numero_int: string | null;
    colonia: string | null;
    cp: string | null;
    municipio: string | null;
    estado?: string | null;
    entre_calles?: string | null;
    tipo_vivienda?: string | null;
}

/* Get /api/clientes */
export interface ClienteListado {
    id: number;
    numero_cliente: number;
    nombre: string;
    curp: string | null;
    telefono: string | null;
    zona: string | null;
    sector: string | null;
    estatus: string;
    color: string;
    en_lista_negra: boolean;
    total_avales: number;
    domicilio: Pick<Domicilio, "calle" | "numero_ext" | "colonia"> | null;
    fecha_alta: string;
    observaciones: string | null;
}

export interface RespuestaListado {
    total: number;
    pagina: number;
    limite: number;
    paginas: number;
    clientes: ClienteListado[];
}

export interface FiltrosClientes {
    search?: string;
    zona?: string;
    sector?: string;
    estatus?: string;
    pagina?: number;
    limite?: number;
}

/* Get /api/clientes/:id */
export interface PersonaDetalle {
    id: number;
    curp: string | null;
    nombre: string;
    fecha_nac: string | null;
    sexo: string | null;
    rfc: string | null;
    ocupacion: string | null;
    estado_civil: string | null;
    email: string | null;
    tel_principal: string | null;
    tel_2: string | null;
    tel_3: string | null;
    en_lista_negra: boolean;
}

export interface AvalDetalle {
    id_relacion: number;
    parentesco: string | null;
    fecha_inicio: string;
    id_credito: number | null;
    persona: {
        id: number;
        curp: string | null;
        nombre: string;
        tel_principal: string | null;
        en_lista_negra: boolean;
    };
    domicilios: Domicilio[];
}

export interface ClienteDetalle {
    cliente: {
        id: number;
        numero_cliente: number;
        zona: string | null;
        sector: string | null;
        estatus: string;
        color: string;
        observaciones: string | null;
        fecha_alta: string;
        usuario_alta: string | null;
    };
    persona: PersonaDetalle;
    domicilios: Domicilio[];
    /*Vacio hasta que exista el modulo de creditos: el aval se regista al crear el credito
    no al cliente 
    */
   avales: AvalDetalle[];
   avala_a: {
    id_relacion: number;
    parentesco: string | null;
    id_cliente: number;
    numero_cliente: number;
    nombre: string;
    curp: string | null;
   }[];
}

export interface Catalogos {
    zonas: (string | null)[];
    sectores: ( string | null)[];
}

/* Cuerpo de post /api/clientes y patch /api/clientes/:id */
export interface PersonaInput {
    curp: string;
    nombre: string;
    fecha_nac?: string;
    sexo?: string;
    rfc?: string;
    ocupacion?: string;
    estado_civil?: string;
    email?: string;
    tel_principal?: string;
    tel_2?: string;
    tel_3?: string;
}

export interface ClienteFormInput {
    persona: PersonaInput;
    domicilio: Omit<Domicilio, "numero_ext" | "numero_int"> & {
        numero_ext?: string;
        numero_int?:string;
    };
    cliente?: {
        zona?: string;
        sector?: string;
        estatus?: string;
        observaciones?: string;
    };
}

export interface CambioZona{
    id: number;
    id_cliente: number;
    zona_anterior: string | null;
    sector_anterior: string | null;
    zona_nueva: string | null;
    sector_nuevo: string | null;
    motivo: string | null;
    fecha: string;
    usuario: string;
}


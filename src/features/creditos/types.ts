import type { PersonaInput } from "../clientes/types";

export type Dictamen = 
| "PENDIENTE"
| "PREAPROBADA"
| "APROBADA"
| "RECHAZADA"
| "CANCELADA";

export interface PlazoDisponible {
    plazo: number;
    productos: number;
    monto_min: string;
    monto_max: string;
}

export interface ProductoCredito {
    id: number;
    plazo: number;
    monto: string;
    pago_fijo: string;
}

export interface Cotizacion {
    producto: {
        id:number;
        plazo: number;
        monto: number;
        pago_fijo: number;
    };
    desglose: {
        monto: number;
        gastos_admin: number;
        servicios_funerarios: number;
        saldo_anterior: number;
        pago_adelantado: number;
        monto_entregar: number;
        total_a_pagar: number;
        pago_semanal: number;
        plazo: number;
    };
}

export interface SolicitudListado {
    id: number;
    folio: number;
    dictamen: Dictamen;
    tipo: string;
    monto: string;
    plazo: number;
    pago_fijo: string;
    monto_entregar: string;
    zona: string | null;
    sector: string | null;
    fecha_captura: string;
    usuario_captura: string;
    id_cliente: number;
    numero_cliente: number;
    nombre: string;
    curp: string | null;
    telefono: string | null;
    total_avales: number;
}

export interface RespuestaSolicitudes {
    total: number;
    pagina: number;
    limite: number;
    paginas: number;
    solicitudes: SolicitudListado[];
}

export interface FiltrosSolicitudes {
     search?: string;
     dictamen?: string;
     zona?: string;
     sector?: string;
     pagina?: number;
     limite?: number;
}

export interface AvalInput {
    curp: string;
    nombre: string;
    telefono?: string;
    ocupacion?: string;
    parentesco?: string;
}

export interface EmpleoInput {
    nombre_empresa: string;
    puesto?: string;
    antiguedad?: string;
    horario?: string;
    calle?: string;
    numero_ext?: string;
    colonia?: string;
    telefono?: string;
    celular?: string;
}

export interface ReferenciaInput {
    nombre: string;
    parentesco?: string;
    calle?: string;
    numero_ext?: string;
    colonia?: string;
    telefono?: string;
    celular?: string;
    horario?: string;
}

export interface SolicitudInput {
    id_cliente: number;
    id_producto: number;
    tipo?: string;
    incluye_servicios_funerarios?: boolean;
    pago_adelantado?: number;
    id_credito_anterior?: number;
    observaciones?: string;
    avales?: AvalInput[];
    empleos?: EmpleoInput;
    referencias?: ReferenciaInput[];
}

export interface ClienteSolicitud {
    id: number;
    numero_cliente: number;
    nombre: string;
    curp: string | null;
    telefono: string | null;
    zona: string | null;
    sector: string | null;
    tipo_vivienda: string | null;
    direccion: string | null;
    en_lista_negra: boolean;
}

export interface GarantiaInput {
    propietario: "TITULAR" | "AVAL_1" | "AVAL_2";
    orden: number;
    articulo: string;
    marca?: string;
}

export interface DatosCredito {
    tipo: string;
    id_producto: number | null;
    plazo: number | null;
    prorroga: boolean;
    apoyo_economico: boolean;
    pago_adelantado: number;
    multas: number;
    fecha_entrega: string;
    id_credito_anterior: number | null;
    saldo_anterior: number;
    garantias: GarantiaInput[];
}

export interface DatosAval {
    curp: string;
    nombre: string;
    parentesco: string;
    ocupacion: string;
    calle: string;
    numero_ext: string;
    numero_int?: string;
    colonia: string;
    cp: string;
    tipo_vivienda: string;
    telefono: string;
    ciudad: string;
    garantias: { articulo: string; marca?: string}[];
}

export interface BorradorSolicitud {
    cliente: ClienteSolicitud | null;
    credito: DatosCredito;
    aval1: DatosAval | null;
    aval2: DatosAval | null;
    observaciones: string;
    docsTitular: DocumentosPersona;
    docsAval1: DocumentosPersona;
    docsAval2: DocumentosPersona;
}

export interface DomicilioInput {
    calle: string;
    numero_ext?: string;
    numero_int?: string;
    colonia?: string;
    cp?: string;
    municipio?: string;
    estado?: string;
    entre_calles?: string;
    tipo_vivienda?: string;
}
 
export interface ClienteFormInput {
    persona: PersonaInput;
    domicilio: DomicilioInput;
    cliente?: {
        zona?: string;
        sector?: string;
        estatus?: string;
        observaciones?: string;
    };
}

export interface DocumentosPersona {
    ine_frente: File | null;
    ine_reverso: File | null;
    comprobante_domicilio: File | null;
}

export const DOCS_VACIOS: DocumentosPersona = {
    ine_frente: null,
    ine_reverso: null,
    comprobante_domicilio: null,
}

export interface CreditoListado {
  id: number;
  numero_credito: number;
  id_cliente: number;
  numero_cliente: number;
  nombre: string;
  curp: string | null;
  telefono: string | null;
  monto: string;
  plazo: number;
  pago_fijo: string;
  total_a_pagar: string;
  estatus: string;
  liquidado: boolean;
  fallos: number;
  semanas_adicionales: number;
  zona: string | null;
  sector: string | null;
  fecha_inicio: string;
  total_avales: number;

}
 
export interface RespuestaCreditos {
  total: number;
  pagina: number;
  limite: number;
  paginas: number;
  creditos: CreditoListado[];

}
 
export interface FiltrosCreditos {
  search?: string;
  estatus?: string;
  zona?: string;
  sector?: string;
  liquidado?: string;
  pagina?: number;
  limite?: number;

}
 
/* ============================================================

   DATOS SIMULADOS — DASHBOARD ADMINISTRADOR
 
   Nada de este archivo viene del backend. Cada bloque indica a

   qué módulo pertenece y qué debe reemplazarlo.
 
   La forma de estos objetos es INVENTADA para poder maquetar.

   Cuando exista cada endpoint, ajusta los tipos a lo que

   realmente devuelva la API — no asumas que coincidirán.

   ============================================================ */
 
// ---------- KPIs ----------
 
export interface KpiMock {

  valor: string;

  delta: number; // porcentaje vs. periodo anterior

}
 
// TODO: conectar a endpoint real cuando exista el módulo de clientes

export const KPI_CLIENTES: KpiMock = { valor: "1,248", delta: 12 };
 
// TODO: conectar a endpoint real cuando exista el módulo de créditos

export const KPI_CREDITOS_ACTIVOS: KpiMock = { valor: "364", delta: 8 };
 
// TODO: conectar a endpoint real cuando exista el módulo de pagos

export const KPI_INGRESOS: KpiMock = { valor: "$120,000.00", delta: 5 };
 
// El cuarto KPI (Usuarios Activos) NO está aquí: usa GET /api/usuarios real.
 
// ---------- Gráfica de créditos otorgados ----------
 
export interface PuntoGrafica {

  mes: string;

  monto: number; // miles de MXN

}
 
// TODO: conectar a endpoint real cuando exista el módulo de créditos

export const CREDITOS_YTD: PuntoGrafica[] = [

  { mes: "Feb", monto: 40 },

  { mes: "Mar", monto: 55 },

  { mes: "Abr", monto: 60 },

  { mes: "May", monto: 72 },

  { mes: "Jun", monto: 68 },

  { mes: "Jul", monto: 75 },

];
 
// ---------- Actividad reciente ----------
 
export type TipoActividad =

  | "cliente_registrado"

  | "credito_aprobado"

  | "pago_registrado"

  | "info_actualizada";
 
export interface ActividadMock {

  id: number;

  persona: string;

  tipo: TipoActividad;

  descripcion: string;

  hace: string;

}
 
// TODO: conectar a endpoint real cuando exista el módulo de auditoría

export const ACTIVIDAD_RECIENTE: ActividadMock[] = [

  {

    id: 1,

    persona: "María López",

    tipo: "cliente_registrado",

    descripcion: "Cliente registrado",

    hace: "Hace 10 minutos",

  },

  {

    id: 2,

    persona: "Juan Pérez",

    tipo: "credito_aprobado",

    descripcion: "Crédito aprobado",

    hace: "Hace 45 minutos",

  },

  {

    id: 3,

    persona: "Ana García",

    tipo: "pago_registrado",

    descripcion: "Pago registrado",

    hace: "Hace 2 horas",

  },

  {

    id: 4,

    persona: "Carlos Ruiz",

    tipo: "info_actualizada",

    descripcion: "Información actualizada",

    hace: "Hace 4 horas",

  },

  {

    id: 5,

    persona: "Pedro Sánchez",

    tipo: "credito_aprobado",

    descripcion: "Crédito aprobado",

    hace: "Ayer a las 17:30",

  },

];
 
// ---------- Pagos próximos ----------
 
export type EstadoPago = "proximo" | "al_dia" | "vencido";
 
export interface PagoMock {

  id: number;

  cliente: string;

  fecha: string;

  monto: string;

  estado: EstadoPago;

}
 
// TODO: conectar a endpoint real cuando exista el módulo de pagos

export const PAGOS_PROXIMOS: PagoMock[] = [

  { id: 1, cliente: "Luis Gómez", fecha: "28 de Jul", monto: "$4,500 MXN", estado: "proximo" },

  { id: 2, cliente: "Sofía Torres", fecha: "29 de Jul", monto: "$6,200 MXN", estado: "proximo" },

  { id: 3, cliente: "Jorge Castro", fecha: "30 de Jul", monto: "$3,100 MXN", estado: "al_dia" },

  { id: 4, cliente: "Elena Rost", fecha: "25 de Jul", monto: "$8,400 MXN", estado: "vencido" },

  { id: 5, cliente: "Andrés Manuel", fecha: "01 de Ago", monto: "$2,900 MXN", estado: "al_dia" },

];
 
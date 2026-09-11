import {

  BarChart3,

  CreditCard,

  DollarSign,

  FileText,

  Home,

  Settings,

  UserCog,

  Users,

  Wallet,

} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { ROLES } from "../constants/roles";

import type { Rol } from "../constants/roles";
 
export interface NavHijo {

  id: string;

  label: string;

  ruta: string;

  roles: Rol[];

  disponible: boolean;

}
 
export interface NavItem {

  id: string;

  label: string;

  /** Ruta propia. Si tiene hijos, se omite: el padre solo expande. */

  ruta?: string;

  icono: LucideIcon;

  roles: Rol[];

  disponible: boolean;

  hijos?: NavHijo[];

}
 
const TODOS_LOS_ROLES: Rol[] = [

  ROLES.ADMINISTRADOR,

  ROLES.GERENTE_ZONA,

  ROLES.PROMOTOR,

  ROLES.AUDITOR,

  ROLES.LECTURA,

];
 
/** Roles que pueden escribir (alta y edición). */

const ROLES_CAPTURA: Rol[] = [

  ROLES.ADMINISTRADOR,

  ROLES.GERENTE_ZONA,

  ROLES.PROMOTOR,

];
 
export const NAV_ITEMS: NavItem[] = [

  {

    id: "inicio",

    label: "Inicio",

    ruta: "/inicio",

    icono: Home,

    roles: TODOS_LOS_ROLES,

    disponible: true,

  },

  {

    id: "clientes",

    label: "Clientes",

    icono: Users,

    roles: TODOS_LOS_ROLES,

    disponible: true,

    hijos: [

      {

        id: "clientes-alta",

        label: "Alta",

        ruta: "/clientes/alta",

        roles: ROLES_CAPTURA,

        disponible: true,

      },

      {

        id: "clientes-consulta",

        label: "Consulta",

        ruta: "/clientes",

        roles: TODOS_LOS_ROLES,

        disponible: true,

      },

      {

        // Pendiente de definir el canal (aviso en app vs. SMS/WhatsApp).

        id: "clientes-notificacion",

        label: "Enviar notificación",

        ruta: "/clientes/notificacion",

        roles: ROLES_CAPTURA,

        disponible: false,

      },

      {

        // Descartado en la definición de alcance; se reactiva si vuelve.

        id: "clientes-ubicaciones",

        label: "Ubicaciones",

        ruta: "/clientes/ubicaciones",

        roles: TODOS_LOS_ROLES,

        disponible: false,

      },

      {

        id: "clientes-lista-negra",

        label: "Lista negra",

        ruta: "/clientes/lista-negra",

        roles: [

          ROLES.ADMINISTRADOR,

          ROLES.GERENTE_ZONA,

          ROLES.AUDITOR,

          ROLES.LECTURA,

        ],

        disponible: true,

      },

    ],

  },

  {

    id: "creditos",

    label: "Créditos",

    ruta: "/creditos",

    icono: CreditCard,

    roles: TODOS_LOS_ROLES,

    disponible: false,

  },

  {

    id: "evidencia",

    label: "Evidencia",

    ruta: "/evidencia",

    icono: FileText,

    roles: TODOS_LOS_ROLES,

    disponible: false,

  },

  {

    id: "pagos",

    label: "Pagos",

    ruta: "/pagos",

    icono: Wallet,

    roles: TODOS_LOS_ROLES,

    disponible: false,

  },

  {

    id: "reportes",

    label: "Reportes",

    ruta: "/reportes",

    icono: BarChart3,

    roles: TODOS_LOS_ROLES,

    disponible: false,

  },

  {

    id: "usuarios",

    label: "Usuarios",

    ruta: "/usuarios",

    icono: UserCog,

    roles: [

      ROLES.ADMINISTRADOR,

      ROLES.GERENTE_ZONA,

      ROLES.AUDITOR,

      ROLES.LECTURA,

    ],

    disponible: true,

  },

  {

    id: "gestion",

    label: "Gestión",

    ruta: "/gestion",

    icono: Settings,

    roles: [ROLES.ADMINISTRADOR],

    disponible: false,

  },

  {

    id: "balance",

    label: "Balance",

    ruta: "/balance",

    icono: DollarSign,

    roles: TODOS_LOS_ROLES,

    disponible: false,

  },

];
 
/** Ítems visibles para un rol, con sus hijos ya filtrados. */

export function navItemsPara(rol: Rol): NavItem[] {

  return NAV_ITEMS.filter((item) => item.roles.includes(rol)).map((item) => ({

    ...item,

    hijos: item.hijos?.filter((h) => h.roles.includes(rol)),

  }));

}
 
/** id del grupo que contiene una ruta, o null. Sirve para autoexpandir. */

export function grupoDeRuta(pathname: string): string | null {

  for (const item of NAV_ITEMS) {

    if (!item.hijos) continue;

    if (item.hijos.some((h) => pathname === h.ruta || pathname.startsWith(h.ruta + "/"))) {

      return item.id;

    }

  }

  return null;

}
 
import { useEffect, useState } from "react";

import { NavLink, useLocation } from "react-router-dom";

import { ChevronDown, LogOut } from "lucide-react";

import { useAuth } from "../../features/auth/hooks/useAuth";

import { grupoDeRuta, navItemsPara } from "./nav.config";

import type { NavHijo, NavItem } from "./nav.config";

interface SidebarProps {

  /** Cierra el drawer en móvil al navegar. */

  onNavegar?: () => void;

}

export function Sidebar({ onNavegar }: SidebarProps) {

  const { sesion, cerrarSesion } = useAuth();

  const location = useLocation();

  // Grupo abierto. Se autoexpande si la ruta actual vive adentro.

  const [abierto, setAbierto] = useState<string | null>(() =>

    grupoDeRuta(location.pathname)

  );

  useEffect(() => {

    const grupo = grupoDeRuta(location.pathname);

    if (grupo) setAbierto(grupo);

  }, [location.pathname]);

  if (!sesion) return null;

  const items = navItemsPara(sesion.rol);

  return (
    <div className="flex h-full flex-col bg-navy-800 text-white">
      <div className="px-6 pt-6 pb-8">
        <p className="text-xl font-bold tracking-tight">

          CrediMil <span className="text-primary-500">Servicios</span>
        </p>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-accent-500 uppercase">

          Portal Administrativo
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">

          {items.map((item) => (
            <li key={item.id}>

              {item.hijos && item.hijos.length > 0 ? (
                <Grupo

                  item={item}

                  abierto={abierto === item.id}

                  onАlternarGrupo={() =>

                    setAbierto((prev) => (prev === item.id ? null : item.id))

                  }

                  onNavegar={onNavegar}

                />

              ) : (
                <ItemSimple item={item} onNavegar={onNavegar} />

              )}
            </li>

          ))}
        </ul>
      </nav>

      <div className="border-t border-white/15 px-3 py-4">
        <button

          type="button"

          onClick={cerrarSesion}

          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-accent-500 transition duration-150 hover:bg-white/10"
        >
          <LogOut size={20} strokeWidth={1.75} aria-hidden="true" />

          Salir del sistema
        </button>
      </div>
    </div>

  );

}

/* ---------- Ítem sin hijos ---------- */

const CLASE_BASE =

  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition duration-150";

function ItemSimple({ item, onNavegar }: { item: NavItem; onNavegar?: () => void }) {

  const Icono = item.icono;

  if (!item.disponible || !item.ruta) {

    return (
      <span

        className={`${CLASE_BASE} cursor-default text-white/35`}

        title="Próximamente"

        aria-disabled="true"
      >
        <Icono size={20} strokeWidth={1.75} aria-hidden="true" />

        {item.label}
      </span>

    );

  }

  return (
    <NavLink

      to={item.ruta}

      end

      onClick={onNavegar}

      className={({ isActive }) =>

        [

          CLASE_BASE,

          "relative",

          isActive

            ? "bg-white/10 text-white before:absolute before:top-1.5 before:bottom-1.5 before:-left-3 before:w-1 before:rounded-r-full before:bg-primary-500"

            : "text-white/75 hover:bg-white/[0.07] hover:text-white",

        ].join(" ")

      }
    >
      <Icono size={20} strokeWidth={1.75} aria-hidden="true" />

      {item.label}
    </NavLink>

  );

}

/* ---------- Grupo con hijos ---------- */

function Grupo({

  item,

  abierto,

  onАlternarGrupo,

  onNavegar,

}: {

  item: NavItem;

  abierto: boolean;

  onАlternarGrupo: () => void;

  onNavegar?: () => void;

}) {

  const Icono = item.icono;

  const location = useLocation();

  const hayRutaActiva = item.hijos!.some(

    (h) => location.pathname === h.ruta || location.pathname.startsWith(h.ruta + "/")

  );

  return (
    <>
      <button

        type="button"

        onClick={onАlternarGrupo}

        aria-expanded={abierto}

        className={[

          CLASE_BASE,

          "relative w-full",

          hayRutaActiva

            ? "bg-white/10 text-white before:absolute before:top-1.5 before:bottom-1.5 before:-left-3 before:w-1 before:rounded-r-full before:bg-primary-500"

            : "text-white/75 hover:bg-white/[0.07] hover:text-white",

        ].join(" ")}
      >
        <Icono size={20} strokeWidth={1.75} aria-hidden="true" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown

          size={16}

          className={`transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}

          aria-hidden="true"

        />
      </button>

      {abierto && (
        <ul className="mt-1 mb-1 flex flex-col gap-0.5 border-l border-white/15 pl-3 ml-6">

          {item.hijos!.map((hijo) => (
            <li key={hijo.id}>
              <ItemHijo hijo={hijo} onNavegar={onNavegar} />
            </li>

          ))}
        </ul>

      )}
    </>

  );

}

function ItemHijo({ hijo, onNavegar }: { hijo: NavHijo; onNavegar?: () => void }) {

  const CLASE_HIJO = "block rounded-lg px-3 py-2 text-sm transition duration-150";

  if (!hijo.disponible) {

    return (
      <span

        className={`${CLASE_HIJO} cursor-default text-white/30`}

        title="Próximamente"

        aria-disabled="true"
      >

        {hijo.label}
      </span>

    );

  }

  return (
    <NavLink

      to={hijo.ruta}

      end

      onClick={onNavegar}

      className={({ isActive }) =>

        isActive

          ? `${CLASE_HIJO} bg-primary-500/20 font-semibold text-white`

          : `${CLASE_HIJO} text-white/65 hover:bg-white/[0.07] hover:text-white`

      }
    >

      {hijo.label}
    </NavLink>

  );

}

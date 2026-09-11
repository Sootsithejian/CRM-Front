import { useEffect, useState } from "react";

import { Outlet, useLocation } from "react-router-dom";

import { Menu } from "lucide-react";

import { Sidebar } from "./Sidebar";
 
export function AppLayout() {

  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const location = useLocation();
 
  // Cierra el drawer al cambiar de ruta.

  useEffect(() => {

    setDrawerAbierto(false);

  }, [location.pathname]);
 
  // Bloquea el scroll del fondo mientras el drawer está abierto.

  useEffect(() => {

    document.body.style.overflow = drawerAbierto ? "hidden" : "";

    return () => {

      document.body.style.overflow = "";

    };

  }, [drawerAbierto]);
 
  // Cierra con Escape.

  useEffect(() => {

    if (!drawerAbierto) return;

    const alPresionar = (e: KeyboardEvent) => {

      if (e.key === "Escape") setDrawerAbierto(false);

    };

    window.addEventListener("keydown", alPresionar);

    return () => window.removeEventListener("keydown", alPresionar);

  }, [drawerAbierto]);
 
  return (
<div className="min-h-dvh bg-slate-50">

      {/* Sidebar fijo — escritorio */}
<aside className="fixed inset-y-0 left-0 hidden w-60 lg:block">
<Sidebar />
</aside>
 
      {/* Drawer — móvil y tablet */}

      {drawerAbierto && (
<div className="fixed inset-0 z-40 lg:hidden">
<button

            type="button"

            className="absolute inset-0 bg-slate-900/50"

            onClick={() => setDrawerAbierto(false)}

            aria-label="Cerrar menú"

          />
<div className="absolute inset-y-0 left-0 w-64 shadow-xl">
<Sidebar onNavegar={() => setDrawerAbierto(false)} />
</div>
</div>

      )}
 
      {/* Contenido */}
<div className="lg:pl-60">

        {/* Barra superior — solo móvil */}
<div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
<button

            type="button"

            onClick={() => setDrawerAbierto(true)}

            className="flex size-10 items-center justify-center rounded-lg text-slate-700 transition duration-150 hover:bg-slate-100"

            aria-label="Abrir menú"

            aria-expanded={drawerAbierto}
>

            {drawerAbierto ? <Menu size={22} /> : <Menu size={22} />}
</button>
<p className="text-base font-bold text-navy-800">

            CrediMil <span className="text-primary-500">Servicios</span>
</p>
</div>
 
        <main className="px-4 py-6 lg:px-8 lg:py-8">
<Outlet />
</main>
</div>
</div>

  );

}
 
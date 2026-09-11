import { Link } from "react-router-dom";

import { CirclePlus, Search, UserPlus, Wallet } from "lucide-react";

import type { LucideIcon } from "lucide-react";
 
type Tono = "sky" | "green" | "amber" | "slate";
 
const TONOS: Record<Tono, string> = {

  sky: "bg-sky-100 text-sky-600",

  green: "bg-green-100 text-green-600",

  amber: "bg-amber-100 text-amber-600",

  slate: "bg-slate-100 text-slate-600",

};
 
interface Accion {

  id: string;

  label: string;

  icono: LucideIcon;

  tono: Tono;

  /** Ruta destino. undefined = módulo aún no disponible. */

  ruta?: string;

}
 
const ACCIONES: Accion[] = [

  // TODO: conectar a endpoint real cuando exista el módulo de clientes

  { id: "nuevo-cliente", label: "Nuevo Cliente", icono: UserPlus, tono: "sky" },
 
  // TODO: conectar a endpoint real cuando exista el módulo de créditos

  { id: "nuevo-credito", label: "Nuevo Crédito", icono: CirclePlus, tono: "green" },
 
  // TODO: conectar a endpoint real cuando exista el módulo de pagos

  { id: "registrar-pago", label: "Registrar Pago", icono: Wallet, tono: "amber" },
 
  // Único acceso funcional: el módulo de usuarios ya tiene ruta.

  { id: "usuarios", label: "Gestionar Usuarios", icono: Search, tono: "slate", ruta: "/usuarios" },

];
 
const CAJA =

  "flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 px-4 py-8 text-center";
 
export function AccionesRapidas() {

  return (
<section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
<h2 className="mb-5 text-base font-bold text-slate-900">

        Acciones Rápidas
</h2>
 
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {ACCIONES.map((accion) => (
<TarjetaAccion key={accion.id} accion={accion} />

        ))}
</div>
</section>

  );

}
 
function TarjetaAccion({ accion }: { accion: Accion }) {

  const Icono = accion.icono;
 
  const contenido = (
<>
<span

        className={`flex size-11 items-center justify-center rounded-full ${TONOS[accion.tono]}`}
>
<Icono size={20} strokeWidth={2} aria-hidden="true" />
</span>
<span className="text-sm font-medium text-slate-900">{accion.label}</span>
</>

  );
 
  if (!accion.ruta) {

    return (
<div

        className={`${CAJA} cursor-default bg-slate-50/60 opacity-60`}

        title="Próximamente"

        aria-disabled="true"
>

        {contenido}
</div>

    );

  }
 
  return (
<Link

      to={accion.ruta}

      className={`${CAJA} bg-white transition duration-150 hover:border-primary-500 hover:bg-slate-50 focus-visible:border-primary-500`}
>

      {contenido}
</Link>

  );

}
 
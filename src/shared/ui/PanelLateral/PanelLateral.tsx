import type { ReactNode } from "react";

/*  Columna lateral de las pantallas de detalle: UNA tarjeta con secciones
    separadas por línea, no una tarjeta por sección. Así lo administrativo
    se lee como un solo bloque secundario y no compite con el contenido
    principal. Si ninguna sección se renderiza, el panel desaparece.  */
export function PanelLateral({
  etiqueta,
  children,
}: {
  /** Nombre del bloque para lectores de pantalla. */
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <aside
      aria-label={etiqueta}
      className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white empty:hidden"
    >
      {children}
    </aside>
  );
}

export function SeccionLateral({
  titulo,
  accion,
  children,
}: {
  titulo: string;
  accion?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
        {accion}
      </div>
      {children}
    </section>
  );
}

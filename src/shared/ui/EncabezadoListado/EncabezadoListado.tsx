import type { ReactNode } from "react";

/*  Cabecera de una página de listado: título chico con el conteo al lado
    y, opcional, una acción a la derecha. Sin subtítulo de presentación:
    en una herramienta que se abre cien veces al día, el espacio vertical
    es para la tabla.  */
export function EncabezadoListado({
  titulo,
  total,
  accion,
}: {
  titulo: string;
  /** null mientras carga: no se muestra un conteo viejo o en cero. */
  total: number | null;
  accion?: ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">
        {titulo}
        {total !== null && (
          <span className="ml-2 font-normal text-slate-500 tabular-nums">
            {total.toLocaleString("es-MX")}
          </span>
        )}
      </h1>
      {accion}
    </header>
  );
}

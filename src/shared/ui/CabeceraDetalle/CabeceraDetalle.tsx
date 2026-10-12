import { Fragment } from "react";
import type { ReactNode } from "react";

/*  Cabecera de las pantallas de detalle (crédito, cliente, pago): dice
    qué estás viendo en el título, el contexto en una línea gris con los
    datos resaltados, y las acciones a la derecha. `children` va debajo,
    separado por una línea (p. ej. las cifras clave del crédito).

    Insignias solo para lo que sale de lo normal (cancelado, lista negra,
    calificación mala): un "Vigente" verde en cada pantalla es ruido.  */
export function CabeceraDetalle({
  titulo,
  insignias,
  contexto = [],
  acciones,
  children,
}: {
  titulo: ReactNode;
  insignias?: ReactNode;
  /** Piezas de la línea de contexto; se separan con "·". */
  contexto?: ReactNode[];
  acciones?: ReactNode;
  children?: ReactNode;
}) {
  const piezas = contexto.filter((p) => p !== null && p !== undefined && p !== false);

  return (
    <header className="mb-6 rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between lg:px-6 lg:py-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold text-slate-900 tabular-nums">{titulo}</h1>
            {insignias}
          </div>

          {piezas.length > 0 && (
            <p className="mt-1 text-sm text-slate-500">
              {piezas.map((p, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <span className="mx-1.5 text-slate-300" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {p}
                </Fragment>
              ))}
            </p>
          )}
        </div>

        {acciones && <div className="flex flex-wrap gap-2 sm:justify-end">{acciones}</div>}
      </div>

      {children}
    </header>
  );
}

/** Dato dentro de la línea de contexto: resalta solo el valor. */
export function DatoContexto({ children }: { children: ReactNode }) {
  return <span className="font-medium text-slate-900 tabular-nums">{children}</span>;
}

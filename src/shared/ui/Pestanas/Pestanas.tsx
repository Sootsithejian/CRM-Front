import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

/*  Pestañas con el patrón ARIA de tablist: Tab entra a la pestaña
    activa, las flechas cambian de pestaña, Inicio/Fin van a los
    extremos. Solo se monta el panel activo.  */

export interface Pestana {
  id: string;
  etiqueta: ReactNode;
  contenido: ReactNode;
}

export function Pestanas({
  pestanas,
  inicial,
  etiqueta,
  extra,
}: {
  pestanas: Pestana[];
  inicial?: string;
  /** Nombre del grupo para lectores de pantalla. */
  etiqueta: string;
  /** Algo a la derecha de las pestañas, p. ej. un botón. */
  extra?: ReactNode;
}) {
  const base = useId();
  const [activa, setActiva] = useState(inicial ?? pestanas[0]?.id);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);

  const indice = Math.max(
    0,
    pestanas.findIndex((p) => p.id === activa)
  );

  const enfocar = (i: number) => {
    const n = (i + pestanas.length) % pestanas.length;
    setActiva(pestanas[n].id);
    botones.current[n]?.focus();
  };

  const alTeclear = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") enfocar(indice + 1);
    else if (e.key === "ArrowLeft") enfocar(indice - 1);
    else if (e.key === "Home") enfocar(0);
    else if (e.key === "End") enfocar(pestanas.length - 1);
    else return;
    e.preventDefault();
  };

  const actual = pestanas[indice];

  return (
    <div>
      <div className="flex items-end justify-between gap-3 border-b border-slate-200">
        <div role="tablist" aria-label={etiqueta} className="-mb-px flex gap-5 overflow-x-auto">
          {pestanas.map((p, i) => {
            const sel = i === indice;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  botones.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${p.id}`}
                aria-selected={sel}
                aria-controls={`${base}-panel-${p.id}`}
                tabIndex={sel ? 0 : -1}
                onClick={() => setActiva(p.id)}
                onKeyDown={alTeclear}
                className={`border-b-2 pt-1 pb-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                  sel
                    ? "border-navy-800 text-slate-900"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {p.etiqueta}
              </button>
            );
          })}
        </div>
        {extra && <div className="shrink-0 pb-2">{extra}</div>}
      </div>

      {actual && (
        <div
          role="tabpanel"
          id={`${base}-panel-${actual.id}`}
          aria-labelledby={`${base}-tab-${actual.id}`}
          tabIndex={0}
          className="pt-4 focus-visible:outline-offset-4"
        >
          {actual.contenido}
        </div>
      )}
    </div>
  );
}

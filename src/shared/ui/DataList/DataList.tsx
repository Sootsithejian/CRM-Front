import type { ReactNode } from "react";

/*  Lista etiqueta → valor para las pantallas de detalle.

    La etiqueta va a la izquierda en slate-500 (4.8:1 sobre blanco; el
    slate-400 de antes quedaba en 2.6:1, debajo de AA) y el valor a la
    derecha en slate-900, con cifras tabulares para que el dinero se
    alinee entre renglones.

    `titulo` agrupa: una lista por grupo de datos relacionados, en vez de
    una sola cuadrícula con todo. `columnas={2}` reparte los renglones en
    dos columnas desde sm:. `compacta` baja el alto del renglón.  */
interface DataListProps {
  titulo?: string;
  columnas?: 1 | 2;
  compacta?: boolean;
  className?: string;
  children: ReactNode;
}

export function DataList({
  titulo,
  columnas = 1,
  compacta = false,
  className,
  children,
}: DataListProps) {
  return (
    <div className={className}>
      {titulo && (
        <h3 className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {titulo}
        </h3>
      )}
      <dl
        className={[
          "grid gap-x-10 text-sm",
          columnas === 2 && "sm:grid-cols-2",
          compacta ? "[&>div]:py-1.5" : "[&>div]:py-2",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </dl>
    </div>
  );
}

interface DataItemProps {
  label: string;
  children: ReactNode;
  /** Para identificadores como el CURP: monoespaciada y un poco más chica. */
  mono?: boolean;
  /** Texto debajo del valor, en gris (p. ej. "16 × $650.00"). */
  detalle?: ReactNode;
}

export function DataItem({ label, children, mono = false, detalle }: DataItemProps) {
  const vacio = children === null || children === undefined || children === "";

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 text-right break-words">
        {vacio ? (
          <span className="text-slate-500">—</span>
        ) : (
          <span
            className={`font-medium text-slate-900 tabular-nums ${mono ? "font-mono text-[13px]" : ""}`}
          >
            {children}
          </span>
        )}
        {detalle && !vacio && (
          <span className="block text-xs text-slate-500 tabular-nums">{detalle}</span>
        )}
      </dd>
    </div>
  );
}

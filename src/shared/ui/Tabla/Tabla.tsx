import type { MouseEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { Paginacion } from "../Paginacion/Paginacion";
import { Spinner } from "../Spinner/Spinner";

/*  Estilo compartido de tablas.

    - PanelTabla: una sola tarjeta con la barra de filtros arriba, la
      tabla y la paginación como pie. Antes eran tres cajas separadas.
    - Tabla: filas de ~40px (px-3 py-2, texto sm). Las columnas con
      `alinear: "der"` son para dinero y cantidades: van a la derecha y
      con cifras tabulares para que se alineen entre filas.
    - FilaEnlace: toda la fila abre el detalle. La celda principal debe
      llevar además un <Link> para que funcione con teclado y con
      Ctrl/⌘+clic.  */

export interface ColumnaTabla {
  titulo: string;
  alinear?: "izq" | "der";
  /** Solo para lectores de pantalla (p. ej. la columna de acciones). */
  oculto?: boolean;
}

const ALINEACION = {
  izq: "text-left",
  der: "text-right",
};

const CELDA = "px-3 first:pl-4 last:pr-4 lg:first:pl-5 lg:last:pr-5";

export function PanelTabla({
  filtros,
  resumen,
  pie,
  children,
}: {
  filtros?: ReactNode;
  /** Franja entre filtros y tabla, p. ej. los totales de pagos. */
  resumen?: ReactNode;
  pie?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {filtros && <div className="border-b border-slate-200 p-4 lg:px-5">{filtros}</div>}
      {resumen && (
        <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm lg:px-5">
          {resumen}
        </div>
      )}
      {children}
      {pie && <div className="border-t border-slate-200 px-4 py-3 lg:px-5">{pie}</div>}
    </section>
  );
}

export function Tabla({
  columnas,
  anchoMinimo = "min-w-[720px]",
  children,
}: {
  columnas: ColumnaTabla[];
  /** Clase literal de Tailwind, p. ej. "min-w-[900px]". */
  anchoMinimo?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse text-sm ${anchoMinimo}`}>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columnas.map((c, i) => (
              <th
                key={c.titulo || i}
                scope="col"
                className={`${CELDA} py-2.5 text-xs font-semibold tracking-wide whitespace-nowrap text-slate-500 uppercase ${ALINEACION[c.alinear ?? "izq"]}`}
              >
                {c.oculto ? <span className="sr-only">{c.titulo}</span> : c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  alinear = "izq",
  numerico = false,
  className = "",
  children,
}: {
  alinear?: "izq" | "der";
  /** Dinero o cantidades: a la derecha, cifras tabulares, sin cortar. */
  numerico?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const alineacion = numerico ? "text-right tabular-nums whitespace-nowrap" : ALINEACION[alinear];
  return <td className={`${CELDA} py-2 align-middle ${alineacion} ${className}`}>{children}</td>;
}

export function Fila({ className = "", children }: { className?: string; children: ReactNode }) {
  return <tr className={className}>{children}</tr>;
}

/** Fila que abre `to` al hacer clic en cualquier parte que no sea un control. */
export function FilaEnlace({
  to,
  className = "",
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  const alClic = (e: MouseEvent<HTMLTableRowElement>) => {
    // Los links y botones de la fila hacen lo suyo.
    if ((e.target as HTMLElement).closest("a, button, input, select, label")) return;
    // No navegar si el usuario estaba seleccionando texto para copiarlo.
    if (window.getSelection()?.toString()) return;

    if (e.ctrlKey || e.metaKey) {
      window.open(to, "_blank", "noopener");
    } else {
      navigate(to);
    }
  };

  return (
    <tr
      onClick={alClic}
      className={`cursor-pointer transition-colors duration-100 hover:bg-slate-50 ${className}`}
    >
      {children}
    </tr>
  );
}

export function TablaCargando() {
  return (
    <div className="py-16">
      <Spinner centered size="lg" />
    </div>
  );
}

export function TablaVacia({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="px-4 py-16 text-center">
      <p className="font-medium text-slate-900">{titulo}</p>
      {children && <p className="mt-1 text-sm text-slate-500">{children}</p>}
    </div>
  );
}

/** "1–25 de 1,284 clientes" + paginación. Nada si no hay resultados. */
export function PieTabla({
  pagina,
  paginas,
  total,
  limite,
  sustantivo,
  onCambiar,
}: {
  pagina: number;
  paginas: number;
  total: number;
  limite: number;
  sustantivo: string;
  onCambiar: (pagina: number) => void;
}) {
  if (total === 0) return null;

  const desde = (pagina - 1) * limite + 1;
  const hasta = Math.min(pagina * limite, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-slate-500 tabular-nums">
        <span className="font-medium text-slate-900">
          {desde.toLocaleString("es-MX")}–{hasta.toLocaleString("es-MX")}
        </span>{" "}
        de <span className="font-medium text-slate-900">{total.toLocaleString("es-MX")}</span>{" "}
        {sustantivo}
      </p>
      <Paginacion pagina={pagina} paginas={paginas} onCambiar={onCambiar} />
    </div>
  );
}

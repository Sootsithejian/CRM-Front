import { Link } from "react-router-dom";

import { Badge, FilaEnlace, Tabla, Td } from "../../../shared/ui";
import type { ColumnaTabla } from "../../../shared/ui";
import { formatearFechaSolo, formatearMoneda } from "../../../shared/lib/formato";

import { etiquetaTipoPago } from "../types";
import type { Pago } from "../types";

const COLUMNAS: ColumnaTabla[] = [
  { titulo: "Fecha" },
  { titulo: "Sem.", alinear: "der" },
  { titulo: "Abono", alinear: "der" },
  { titulo: "Multa", alinear: "der" },
  { titulo: "Forma" },
  { titulo: "Capturó" },
  { titulo: "Estado", oculto: true },
];

/** Pagos de un crédito, del más reciente al más antiguo. */
export function TablaPagosCredito({ pagos }: { pagos: Pago[] }) {
  if (pagos.length === 0) {
    return <p className="text-sm text-slate-500">Todavía no hay pagos registrados.</p>;
  }

  const ordenados = [...pagos].reverse();

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <Tabla columnas={COLUMNAS} anchoMinimo="min-w-[640px]">
        {ordenados.map((p) => (
          <FilaEnlace
            key={p.id}
            to={`/pagos/${p.id}`}
            className={p.cancelado ? "text-slate-500" : "text-slate-700"}
          >
            <Td className="whitespace-nowrap">
              <Link
                to={`/pagos/${p.id}`}
                className="font-medium text-slate-900 hover:text-primary-700"
              >
                {formatearFechaSolo(p.fecha)}
              </Link>
            </Td>
            <Td numerico>{p.semana}</Td>
            <Td numerico className={p.cancelado ? "line-through" : "font-semibold text-slate-900"}>
              {formatearMoneda(p.monto)}
            </Td>
            <Td numerico className={p.cancelado ? "line-through" : ""}>
              {Number(p.multa) > 0 ? formatearMoneda(p.multa) : "—"}
            </Td>
            <Td>{etiquetaTipoPago(p.tipo)}</Td>
            <Td>{p.usuario}</Td>
            <Td alinear="der">{p.cancelado && <Badge variant="danger">Cancelado</Badge>}</Td>
          </FilaEnlace>
        ))}
      </Tabla>
    </div>
  );
}

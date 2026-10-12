import { Link, useNavigate } from "react-router-dom";
import { CirclePlus, Pencil } from "lucide-react";

import {
  Badge,
  FilaEnlace,
  Tabla,
  TablaCargando,
  TablaVacia,
  Td,
} from "../../../shared/ui";
import type { ColumnaTabla } from "../../../shared/ui";
import type { ClienteListado } from "../types";

interface TablaProps {
  clientes: ClienteListado[];
  cargando: boolean;
  puedeEditar: boolean;
}

const COLUMNAS: ColumnaTabla[] = [
  { titulo: "Cliente" },
  { titulo: "CURP" },
  { titulo: "Nº cliente", alinear: "der" },
  { titulo: "Zona" },
  { titulo: "Teléfono" },
  { titulo: "Estado" },
  { titulo: "Acciones", alinear: "der", oculto: true },
];

/** Observaciones truncadas: el badge no puede crecer sin límite. */
function textoEstado(obs: string | null): string | null {
  if (!obs || !obs.trim()) return null;
  const limpio = obs.trim();
  return limpio.length > 22 ? `${limpio.slice(0, 22)}…` : limpio;
}

export function TablaClientes({ clientes, cargando, puedeEditar }: TablaProps) {
  const navigate = useNavigate();

  if (cargando) return <TablaCargando />;

  if (clientes.length === 0) {
    return (
      <TablaVacia titulo="Sin resultados">
        Ajusta los filtros o la búsqueda para encontrar clientes.
      </TablaVacia>
    );
  }

  return (
    <Tabla columnas={COLUMNAS} anchoMinimo="min-w-[860px]">
      {clientes.map((c) => {
        const obs = textoEstado(c.observaciones ?? null);
        return (
          <FilaEnlace key={c.id} to={`/clientes/${c.id}`}>
            <Td>
              <Link
                to={`/clientes/${c.id}`}
                className="font-medium text-slate-900 hover:text-primary-700"
              >
                {c.nombre}
              </Link>
            </Td>
            <Td className="font-mono text-[13px] whitespace-nowrap text-slate-600">
              {c.curp ?? <span className="font-sans text-slate-500">—</span>}
            </Td>
            <Td numerico className="text-slate-700">
              {c.numero_cliente}
            </Td>
            <Td className="whitespace-nowrap text-slate-700">
              {c.zona ?? "—"}
              {c.sector ? `-${c.sector}` : ""}
            </Td>
            <Td className="whitespace-nowrap text-slate-700 tabular-nums">
              {c.telefono ?? "—"}
            </Td>
            <Td>
              {c.en_lista_negra ? (
                <Badge variant="danger">Lista negra</Badge>
              ) : obs ? (
                <Badge variant="success">{obs}</Badge>
              ) : (
                <span className="text-slate-500">—</span>
              )}
            </Td>
            <Td alinear="der">
              <div className="flex items-center justify-end gap-0.5">
                <BotonAccion
                  icono={Pencil}
                  etiqueta={`Editar ${c.nombre}`}
                  onClick={() => navigate(`/clientes/${c.id}/editar`)}
                  deshabilitado={!puedeEditar}
                />
                <BotonAccion
                  icono={CirclePlus}
                  etiqueta={`Nuevo crédito para ${c.nombre}`}
                  onClick={() => navigate(`/creditos/solicitudes/nueva?cliente=${c.id}`)}
                  deshabilitado={!puedeEditar || c.en_lista_negra}
                />
              </div>
            </Td>
          </FilaEnlace>
        );
      })}
    </Tabla>
  );
}

function BotonAccion({
  icono: Icono,
  etiqueta,
  onClick,
  deshabilitado = false,
}: {
  icono: typeof Pencil;
  etiqueta: string;
  onClick?: () => void;
  deshabilitado?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      title={etiqueta}
      aria-label={etiqueta}
      className="flex size-8 items-center justify-center rounded-md text-slate-500 transition duration-150 hover:not-disabled:bg-slate-200/70 hover:not-disabled:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35"
    >
      <Icono size={15} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

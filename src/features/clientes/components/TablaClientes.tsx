import { useNavigate } from "react-router-dom";

import { CirclePlus, Eye, Pencil } from "lucide-react";

import { Badge, Spinner } from "../../../shared/ui";

import type { ClienteListado } from "../types";
 
interface TablaProps {

  clientes: ClienteListado[];

  cargando: boolean;

  puedeEditar: boolean;

}
 
/** Observaciones truncadas: el badge no puede crecer sin límite. */

function textoEstado(obs: string | null): string | null {

  if (!obs || !obs.trim()) return null;

  const limpio = obs.trim();

  return limpio.length > 22 ? `${limpio.slice(0, 22)}…` : limpio;

}
 
export function TablaClientes({ clientes, cargando, puedeEditar }: TablaProps) {

  const navigate = useNavigate();
 
  if (cargando) {

    return (
<div className="rounded-xl border border-slate-200 bg-white py-16">
<Spinner centered size="lg" />
</div>

    );

  }
 
  if (clientes.length === 0) {

    return (
<div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
<p className="font-medium text-slate-900">Sin resultados</p>
<p className="mt-1 text-sm text-slate-500">

          Ajusta los filtros o la búsqueda para encontrar clientes.
</p>
</div>

    );

  }
 
  return (
<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
<table className="w-full min-w-[820px] border-collapse text-sm">
<thead>
<tr className="border-b border-slate-200">
<th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">

              Cliente / Identificación
</th>
<th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">

              Nº Cliente
</th>
<th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">

              Zona
</th>
<th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">

              Sector
</th>
<th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">

              Teléfono
</th>
<th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">

              Estado
</th>
<th className="px-5 py-3.5 text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">

              Acciones
</th>
</tr>
</thead>
 
        <tbody className="divide-y divide-slate-100">

          {clientes.map((c) => {

            const obs = textoEstado(c.observaciones ?? null);
 
            return (
<tr key={c.id} className="transition duration-150 hover:bg-slate-50">
<td className="px-5 py-4">
<p className="font-semibold text-slate-900">{c.nombre}</p>
<p className="mt-0.5 text-xs text-slate-500">{c.curp ?? "Sin CURP"}</p>
</td>
<td className="px-5 py-4 whitespace-nowrap text-slate-700">

                  {c.numero_cliente}
</td>
<td className="px-5 py-4 text-slate-700">{c.zona ?? "—"}</td>
<td className="px-5 py-4 text-slate-700">{c.sector ?? "—"}</td>
<td className="px-5 py-4 whitespace-nowrap text-slate-700">

                  {c.telefono ?? "—"}
</td>
<td className="px-5 py-4">

                  {c.en_lista_negra ? (
<Badge variant="danger">Lista Negra</Badge>

                  ) : obs ? (
<Badge variant="success">{obs}</Badge>

                  ) : (
<span className="text-slate-400">—</span>

                  )}
</td>
<td className="px-5 py-4">
<div className="flex items-center justify-end gap-1.5">
<BotonAccion

                      icono={Eye}

                      etiqueta={`Ver detalle de ${c.nombre}`}

                      onClick={() => navigate(`/clientes/${c.id}`)}

                    />
<BotonAccion

                      icono={Pencil}

                      etiqueta={`Editar ${c.nombre}`}

                      onClick={() => navigate(`/clientes/${c.id}/editar`)}

                      deshabilitado={!puedeEditar}

                    />

                    {/* Módulo de créditos aún no existe. */}
<BotonAccion

                      icono={CirclePlus}

                      etiqueta="Nuevo crédito (próximamente)"

                      deshabilitado

                    />
</div>
</td>
</tr>

            );

          })}
</tbody>
</table>
</div>

  );

}
 
function BotonAccion({

  icono: Icono,

  etiqueta,

  onClick,

  deshabilitado = false,

}: {

  icono: typeof Eye;

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

      className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition duration-150 hover:not-disabled:border-slate-300 hover:not-disabled:bg-slate-50 hover:not-disabled:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
>
<Icono size={15} strokeWidth={2} aria-hidden="true" />
</button>

  );

}
 
import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Eye, Search } from "lucide-react";

import {

  Alert,

  Badge,

  Breadcrumb,

  Paginacion,

  Select,

  Spinner,

} from "../../../shared/ui";

import { useDebounce } from "../../../shared/hooks/useDebounce";

import { OPCIONES_SECTOR, OPCIONES_ZONA } from "../../../shared/constants/zonas";

import { useCreditos } from "../hooks/useCreditos";
 
const LIMITE = 25;
 
/** 0-1 fallos → bueno, 2 → regular, 3+ → malo. */

function calificacion(fallos: number) {

  if (fallos >= 3) return { label: "Malo", variant: "danger" as const };

  if (fallos === 2) return { label: "Regular", variant: "warning" as const };

  return { label: "Bueno", variant: "success" as const };

}
 
export function ConsultaCreditosPage() {

  const navigate = useNavigate();
 
  const [search, setSearch] = useState("");

  const [zona, setZona] = useState("");

  const [sector, setSector] = useState("");

  const [liquidado, setLiquidado] = useState("");

  const [pagina, setPagina] = useState(1);
 
  const searchDiferido = useDebounce(search, 400);
 
  const filtros = useMemo(

    () => ({

      search: searchDiferido || undefined,

      zona: zona || undefined,

      sector: sector || undefined,

      liquidado: liquidado || undefined,

      pagina,

      limite: LIMITE,

    }),

    [searchDiferido, zona, sector, liquidado, pagina]

  );
 
  const { creditos, total, paginas, cargando, error } = useCreditos(filtros);
 
  const cambiar = (fn: (v: string) => void) => (valor: string) => {

    fn(valor);

    setPagina(1);

  };
 
  const desde = total === 0 ? 0 : (pagina - 1) * LIMITE + 1;

  const hasta = Math.min(pagina * LIMITE, total);
 
  return (
<>
<Breadcrumb

        items={[

          { label: "Inicio", ruta: "/inicio" },

          { label: "Créditos" },

          { label: "Consulta" },

        ]}

      />
 
      <header className="mb-6">
<h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">

          Consulta de Créditos
</h1>
<p className="mt-1 text-slate-500">

          Revisa los créditos otorgados, su estado y su historial.
</p>
</header>
 
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
<div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_150px_150px_180px]">
<div className="flex flex-col gap-2">
<label className="text-sm font-medium text-slate-900" htmlFor="buscar-cred">

              Búsqueda rápida
</label>
<div className="relative flex items-center">
<Search

                size={18}

                className="pointer-events-none absolute left-4 text-slate-400"

                aria-hidden="true"

              />
<input

                id="buscar-cred"

                type="search"

                value={search}

                onChange={(e) => cambiar(setSearch)(e.target.value)}

                placeholder="Nº de crédito, nº de cliente, nombre o CURP…"

                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pr-4 pl-11 text-base text-slate-900 transition duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/35 focus:outline-none"

              />
</div>
</div>
 
          <Select

            label="Zona"

            value={zona}

            onChange={(e) => cambiar(setZona)(e.target.value)}

            placeholder="Todas"

            opciones={OPCIONES_ZONA}

          />
 
          <Select

            label="Sector"

            value={sector}

            onChange={(e) => cambiar(setSector)(e.target.value)}

            placeholder="Todos"

            opciones={OPCIONES_SECTOR}

          />
 
          <Select

            label="Estado"

            value={liquidado}

            onChange={(e) => cambiar(setLiquidado)(e.target.value)}

            placeholder="Todos"

            opciones={[

              { valor: "false", etiqueta: "Activos" },

              { valor: "true", etiqueta: "Liquidados" },

            ]}

          />
</div>
</section>
 
      {error && (
<div className="mb-6">
<Alert variant="error" title="Error al cargar">{error}</Alert>
</div>

      )}
 
      {cargando ? (
<div className="rounded-xl border border-slate-200 bg-white py-16">
<Spinner centered size="lg" />
</div>

      ) : creditos.length === 0 ? (
<div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
<p className="font-medium text-slate-900">Sin créditos</p>
<p className="mt-1 text-sm text-slate-500">

            No hay créditos que coincidan con los filtros.
</p>
</div>

      ) : (
<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
<table className="w-full min-w-[980px] border-collapse text-sm">
<thead>
<tr className="border-b border-slate-200">

                {[

                  "Crédito", "Cliente", "Monto / Plazo", "Pago semanal",

                  "Zona", "Calificación", "Estado", "",

                ].map((h, i) => (
<th

                    key={h || i}

                    className={`px-5 py-3.5 text-xs font-semibold tracking-wide text-slate-500 uppercase ${

                      i === 7 ? "text-right" : "text-left"

                    }`}
>

                    {h}
</th>

                ))}
</tr>
</thead>
 
            <tbody className="divide-y divide-slate-100">

              {creditos.map((c) => {

                const cal = calificacion(c.fallos);
 
                return (
<tr key={c.id} className="transition duration-150 hover:bg-slate-50">
<td className="px-5 py-4 font-semibold text-slate-900">

                      {c.numero_credito}
</td>
 
                    <td className="px-5 py-4">
<p className="font-semibold text-slate-900">{c.nombre}</p>
<p className="mt-0.5 text-xs text-slate-500">

                        Nº {c.numero_cliente} · {c.curp ?? "Sin CURP"}
</p>
</td>
 
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">

                      ${Number(c.monto).toLocaleString("es-MX")}
<span className="text-slate-400"> / {c.plazo} sem</span>

                      {c.semanas_adicionales > 0 && (
<span className="ml-1 text-xs font-semibold text-accent-600">

                          +{c.semanas_adicionales}
</span>

                      )}
</td>
 
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">

                      ${Number(c.pago_fijo).toLocaleString("es-MX")}
</td>
 
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">

                      {c.zona ?? "—"}

                      {c.sector ? `-${c.sector}` : ""}
</td>
 
                    <td className="px-5 py-4">
<Badge variant={cal.variant}>{cal.label}</Badge>

                      {c.fallos > 0 && (
<span className="ml-2 text-xs text-slate-500">

                          {c.fallos} {c.fallos === 1 ? "fallo" : "fallos"}
</span>

                      )}
</td>
 
                    <td className="px-5 py-4">

                      {c.liquidado ? (
<Badge variant="neutral">Liquidado</Badge>

                      ) : (
<Badge variant="info">{c.estatus}</Badge>

                      )}
</td>
 
                    <td className="px-5 py-4 text-right">
<button

                        type="button"

                        onClick={() => navigate(`/creditos/${c.id}`)}

                        title={`Ver crédito ${c.numero_credito}`}

                        aria-label={`Ver crédito ${c.numero_credito}`}

                        className="ml-auto flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
>
<Eye size={15} aria-hidden="true" />
</button>
</td>
</tr>

                );

              })}
</tbody>
</table>
</div>

      )}
 
      {!cargando && total > 0 && (
<div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row">
<p className="text-sm text-slate-500">

            Mostrando{" "}
<span className="font-semibold text-slate-900">{desde} - {hasta}</span> de{" "}
<span className="font-semibold text-slate-900">{total}</span> créditos
</p>
<Paginacion pagina={pagina} paginas={paginas} onCambiar={setPagina} />
</div>

      )}
</>

  );

}
 
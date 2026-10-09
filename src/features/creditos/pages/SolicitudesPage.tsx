import { useMemo, useState } from "react";

import { useLocation } from "react-router-dom";

import { Search } from "lucide-react";

import {

  Alert,

  Badge,

  Breadcrumb,

  Button,

  Paginacion,

  Select,

  Spinner,

} from "../../../shared/ui";

import { useDebounce } from "../../../shared/hooks/useDebounce";

import { useAuth } from "../../auth/hooks/useAuth";

import { ROLES } from "../../../shared/constants/roles";

import { useSolicitudes } from "../hooks/useSolicitudes";

import { ModalDictamen } from "../components/ModalDictamen";

import type { Dictamen, SolicitudListado } from "../types";
 
const LIMITE = 25;
 
const BADGE: Record<Dictamen, { label: string; variant: "warning" | "info" | "success" | "danger" | "neutral" }> = {

  PENDIENTE: { label: "Pendiente", variant: "warning" },

  PREAPROBADA: { label: "Preaprobada", variant: "info" },

  APROBADA: { label: "Aprobada", variant: "success" },

  RECHAZADA: { label: "Rechazada", variant: "danger" },

  CANCELADA: { label: "Cancelada", variant: "neutral" },

};
 
type Accion = "preaprobar" | "aprobar" | "rechazar";
 
export function SolicitudesPage() {

  const { sesion } = useAuth();

  const location = useLocation();
 
  const [search, setSearch] = useState("");

  const [dictamen, setDictamen] = useState("PENDIENTE");

  const [pagina, setPagina] = useState(1);
 
  const [aDictaminar, setADictaminar] = useState<SolicitudListado | null>(null);

  const [accion, setAccion] = useState<Accion>("preaprobar");
 
  const [aviso, setAviso] = useState<string | null>(

    (location.state as { mensaje?: string } | null)?.mensaje ?? null

  );
 
  const searchDiferido = useDebounce(search, 400);
 
  const filtros = useMemo(

    () => ({

      search: searchDiferido || undefined,

      dictamen: dictamen || undefined,

      pagina,

      limite: LIMITE,

    }),

    [searchDiferido, dictamen, pagina]

  );
 
  const { solicitudes, total, paginas, cargando, error, recargar } =

    useSolicitudes(filtros);
 
  const esAdmin = sesion?.rol === ROLES.ADMINISTRADOR;

  const esGerente = sesion?.rol === ROLES.GERENTE_ZONA;

  const puedeDictaminar = esAdmin || esGerente;
 
  const abrir = (s: SolicitudListado, a: Accion) => {

    setADictaminar(s);

    setAccion(a);

  };
 
  const alDictaminar = (mensaje: string) => {

    setADictaminar(null);

    setAviso(mensaje);

    recargar();

  };
 
  const desde = total === 0 ? 0 : (pagina - 1) * LIMITE + 1;

  const hasta = Math.min(pagina * LIMITE, total);
 
  return (
<>
<Breadcrumb

        items={[

          { label: "Inicio", ruta: "/inicio" },

          { label: "Créditos" },

          { label: "Solicitudes" },

        ]}

      />
 
      <header className="mb-6">
<h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">

          Solicitudes de Crédito
</h1>
<p className="mt-1 text-slate-500">

          Revisa, preaprueba y autoriza las solicitudes capturadas por las

          promotoras.
</p>
</header>
 
      {aviso && (
<div className="mb-6">
<Alert variant="success" onDismiss={() => setAviso(null)}>

            {aviso}
</Alert>
</div>

      )}
 
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
<div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
<div className="flex flex-col gap-2">
<label className="text-sm font-medium text-slate-900" htmlFor="buscar-sol">

              Búsqueda rápida
</label>
<div className="relative flex items-center">
<Search

                size={18}

                className="pointer-events-none absolute left-4 text-slate-400"

                aria-hidden="true"

              />
<input

                id="buscar-sol"

                type="search"

                value={search}

                onChange={(e) => {

                  setSearch(e.target.value);

                  setPagina(1);

                }}

                placeholder="Folio, número de cliente, nombre o CURP…"

                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pr-4 pl-11 text-base text-slate-900 transition duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/35 focus:outline-none"

              />
</div>
</div>
 
          <Select

            label="Estado"

            value={dictamen}

            onChange={(e) => {

              setDictamen(e.target.value);

              setPagina(1);

            }}

            placeholder="Todas"

            opciones={[

              { valor: "PENDIENTE", etiqueta: "Pendientes" },

              { valor: "PREAPROBADA", etiqueta: "Preaprobadas" },

              { valor: "APROBADA", etiqueta: "Aprobadas" },

              { valor: "RECHAZADA", etiqueta: "Rechazadas" },

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

      ) : solicitudes.length === 0 ? (
<div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
<p className="font-medium text-slate-900">Sin solicitudes</p>
<p className="mt-1 text-sm text-slate-500">

            No hay solicitudes que coincidan con los filtros.
</p>
</div>

      ) : (
<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
<table className="w-full min-w-[920px] border-collapse text-sm">
<thead>
<tr className="border-b border-slate-200">

                {["Folio", "Cliente", "Monto / Plazo", "Recibe", "Zona", "Capturó", "Estado", "Acciones"].map(

                  (h, i) => (
<th

                      key={h}

                      className={`px-5 py-3.5 text-xs font-semibold tracking-wide text-slate-500 uppercase ${

                        i === 7 ? "text-right" : "text-left"

                      }`}
>

                      {h}
</th>

                  )

                )}
</tr>
</thead>
 
            <tbody className="divide-y divide-slate-100">

              {solicitudes.map((s) => {

                const badge = BADGE[s.dictamen];
 
                const puedePreaprobar =

                  puedeDictaminar && s.dictamen === "PENDIENTE";

                const puedeAprobar = esAdmin && s.dictamen === "PREAPROBADA";

                const puedeRechazar =

                  puedeDictaminar &&

                  (s.dictamen === "PENDIENTE" || s.dictamen === "PREAPROBADA");
 
                return (
<tr key={s.id} className="transition duration-150 hover:bg-slate-50">
<td className="px-5 py-4 font-semibold text-slate-900">

                      {s.folio}
</td>
 
                    <td className="px-5 py-4">
<p className="font-semibold text-slate-900">{s.nombre}</p>
<p className="mt-0.5 text-xs text-slate-500">

                        Nº {s.numero_cliente} · {s.curp ?? "Sin CURP"}
</p>
</td>
 
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">

                      ${Number(s.monto).toLocaleString("es-MX")}
<span className="text-slate-400"> / {s.plazo} sem</span>
</td>
 
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">

                      ${Number(s.monto_entregar).toLocaleString("es-MX")}
</td>
 
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">

                      {s.zona ?? "—"}

                      {s.sector ? `-${s.sector}` : ""}
</td>
 
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500">
<p>{s.usuario_captura}</p>
<p className="text-xs text-slate-400">

                        {new Date(s.fecha_captura).toLocaleDateString("es-MX", {

                          dateStyle: "medium",

                        })}
</p>
</td>
 
                    <td className="px-5 py-4">
<Badge variant={badge.variant}>{badge.label}</Badge>
</td>
 
                    <td className="px-5 py-4">
<div className="flex flex-wrap items-center justify-end gap-2">

                        {puedePreaprobar && (
<Button size="sm" onClick={() => abrir(s, "preaprobar")}>

                            Preaprobar
</Button>

                        )}

                        {puedeAprobar && (
<Button size="sm" onClick={() => abrir(s, "aprobar")}>

                            Aprobar
</Button>

                        )}

                        {puedeRechazar && (
<Button

                            size="sm"

                            variant="secondary"

                            onClick={() => abrir(s, "rechazar")}
>

                            Rechazar
</Button>

                        )}

                        {!puedePreaprobar && !puedeAprobar && !puedeRechazar && (
<span className="text-xs text-slate-400">—</span>

                        )}
</div>
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
<span className="font-semibold text-slate-900">{total}</span> solicitudes
</p>
<Paginacion pagina={pagina} paginas={paginas} onCambiar={setPagina} />
</div>

      )}
 
      <ModalDictamen

        solicitud={aDictaminar}

        accion={accion}

        onCerrar={() => setADictaminar(null)}

        onExito={alDictaminar}

      />
</>

  );

}
 
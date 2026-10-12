import { useMemo, useState } from "react";

import { useLocation } from "react-router-dom";


import {
  Alert,
  EncabezadoListado,
  CampoBusqueda,
  Badge,
  Breadcrumb,
  Button,
  Fila,
  PanelTabla,
  PieTabla,
  Select,
  Tabla,
  TablaCargando,
  TablaVacia,
  Td,
} from "../../../shared/ui";
import type { ColumnaTabla } from "../../../shared/ui";
import { formatearMoneda } from "../../../shared/lib/formato";

import { useDebounce } from "../../../shared/hooks/useDebounce";

import { useAuth } from "../../auth/hooks/useAuth";

import { ROLES } from "../../../shared/constants/roles";

import { useSolicitudes } from "../hooks/useSolicitudes";

import { ModalDictamen } from "../components/ModalDictamen";

import type { Dictamen, SolicitudListado } from "../types";
 
const LIMITE = 25;

const COLUMNAS: ColumnaTabla[] = [
  { titulo: "Folio" },
  { titulo: "Cliente" },
  { titulo: "Nº cliente", alinear: "der" },
  { titulo: "Monto", alinear: "der" },
  { titulo: "Plazo", alinear: "der" },
  { titulo: "Recibe", alinear: "der" },
  { titulo: "Zona" },
  { titulo: "Capturó" },
  { titulo: "Fecha" },
  { titulo: "Estado" },
  { titulo: "Acciones", alinear: "der", oculto: true },
];
 
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
 
  return (
<>
<Breadcrumb

        items={[

          { label: "Inicio", ruta: "/inicio" },

          { label: "Créditos" },

          { label: "Solicitudes" },

        ]}

      />
 
      <EncabezadoListado titulo="Solicitudes de crédito" total={cargando ? null : total} />
 
      {aviso && (
<div className="mb-6">
<Alert variant="success" onDismiss={() => setAviso(null)}>

            {aviso}
</Alert>
</div>

      )}
 
      {error && (
        <div className="mb-6">
          <Alert variant="error" title="Error al cargar">{error}</Alert>
        </div>
      )}

      <PanelTabla
        filtros={
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_200px]">
            <CampoBusqueda
              etiqueta="Buscar solicitud"
              valor={search}
              onCambiar={(v) => {
                setSearch(v);
                setPagina(1);
              }}
              placeholder="Folio, número de cliente, nombre o CURP…"
            />
            <Select
              label="Estado"
              etiquetaOculta
              compacto
              value={dictamen}
              onChange={(e) => {
                setDictamen(e.target.value);
                setPagina(1);
              }}
              placeholder="Todos los estados"
              opciones={[
                { valor: "PENDIENTE", etiqueta: "Pendientes" },
                { valor: "PREAPROBADA", etiqueta: "Preaprobadas" },
                { valor: "APROBADA", etiqueta: "Aprobadas" },
                { valor: "RECHAZADA", etiqueta: "Rechazadas" },
              ]}
            />
          </div>
        }
        pie={
          !cargando && (
            <PieTabla
              pagina={pagina}
              paginas={paginas}
              total={total}
              limite={LIMITE}
              sustantivo="solicitudes"
              onCambiar={setPagina}
            />
          )
        }
      >
        {cargando ? (
          <TablaCargando />
        ) : solicitudes.length === 0 ? (
          <TablaVacia titulo="Sin solicitudes">
            No hay solicitudes que coincidan con los filtros.
          </TablaVacia>
        ) : (
          <Tabla columnas={COLUMNAS} anchoMinimo="min-w-[1120px]">
            {solicitudes.map((s) => {
              const badge = BADGE[s.dictamen];
              const puedePreaprobar = puedeDictaminar && s.dictamen === "PENDIENTE";
              const puedeAprobar = esAdmin && s.dictamen === "PREAPROBADA";
              const puedeRechazar =
                puedeDictaminar &&
                (s.dictamen === "PENDIENTE" || s.dictamen === "PREAPROBADA");

              return (
                <Fila key={s.id}>
                  <Td className="font-semibold text-slate-900 tabular-nums">{s.folio}</Td>
                  <Td className="max-w-[16rem] truncate text-slate-900">
                    <span title={s.curp ?? undefined}>{s.nombre}</span>
                  </Td>
                  <Td numerico className="text-slate-600">{s.numero_cliente}</Td>
                  <Td numerico className="text-slate-700">{formatearMoneda(s.monto)}</Td>
                  <Td numerico className="text-slate-600">{s.plazo} sem</Td>
                  <Td numerico className="font-semibold text-slate-900">
                    {formatearMoneda(s.monto_entregar)}
                  </Td>
                  <Td className="whitespace-nowrap text-slate-600">
                    {s.zona ?? "—"}
                    {s.sector ? `-${s.sector}` : ""}
                  </Td>
                  <Td className="whitespace-nowrap text-slate-600">{s.usuario_captura}</Td>
                  <Td className="whitespace-nowrap text-slate-600 tabular-nums">
                    {new Date(s.fecha_captura).toLocaleDateString("es-MX", { dateStyle: "medium" })}
                  </Td>
                  <Td>
                    {/* Insignia solo si la solicitud espera a alguien; las
                        cerradas van como texto. */}
                    {s.dictamen === "PENDIENTE" || s.dictamen === "PREAPROBADA" ? (
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    ) : (
                      <span className="text-slate-500">{badge.label}</span>
                    )}
                  </Td>
                  <Td alinear="der">
                    <div className="flex items-center justify-end gap-1.5">
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
                        <Button size="sm" variant="ghost" onClick={() => abrir(s, "rechazar")}>
                          Rechazar
                        </Button>
                      )}
                    </div>
                  </Td>
                </Fila>
              );
            })}
          </Tabla>
        )}
      </PanelTabla>

      <ModalDictamen

        solicitud={aDictaminar}

        accion={accion}

        onCerrar={() => setADictaminar(null)}

        onExito={alDictaminar}

      />
</>

  );

}
 
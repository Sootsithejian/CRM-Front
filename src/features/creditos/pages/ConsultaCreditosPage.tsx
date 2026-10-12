import { useMemo, useState } from "react";

import { Link } from "react-router-dom";


import {
  Alert,
  EncabezadoListado,
  CampoBusqueda,
  Badge,
  Breadcrumb,
  FilaEnlace,
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

import { OPCIONES_FILTRO_SECTOR, OPCIONES_FILTRO_ZONA } from "../../../shared/constants/zonas";

import { useCreditos } from "../hooks/useCreditos";
 
const LIMITE = 25;

const COLUMNAS: ColumnaTabla[] = [
  { titulo: "Crédito" },
  { titulo: "Cliente" },
  { titulo: "Nº cliente", alinear: "der" },
  { titulo: "Monto", alinear: "der" },
  { titulo: "Plazo", alinear: "der" },
  { titulo: "Pago semanal", alinear: "der" },
  { titulo: "Zona" },
  { titulo: "Calificación" },
  { titulo: "Estado" },
];
 
/** 0-1 fallos → bueno, 2 → regular, 3+ → malo. */

function calificacion(fallos: number) {

  if (fallos >= 3) return { label: "Malo", variant: "danger" as const };

  if (fallos === 2) return { label: "Regular", variant: "warning" as const };

  return { label: "Bueno", variant: "success" as const };

}
 
export function ConsultaCreditosPage() {
 
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
 
  return (
<>
<Breadcrumb

        items={[

          { label: "Inicio", ruta: "/inicio" },

          { label: "Créditos" },

          { label: "Consulta" },

        ]}

      />
 
      <EncabezadoListado titulo="Créditos" total={cargando ? null : total} />
 
      {error && (
        <div className="mb-6">
          <Alert variant="error" title="Error al cargar">{error}</Alert>
        </div>
      )}

      <PanelTabla
        filtros={
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,1fr)_140px_150px_190px]">
            <CampoBusqueda
              className="col-span-2 lg:col-span-1"
              etiqueta="Buscar crédito"
              valor={search}
              onCambiar={cambiar(setSearch)}
              placeholder="Nº de crédito, nº de cliente, nombre o CURP…"
            />
            <Select
              label="Zona"
              etiquetaOculta
              compacto
              value={zona}
              onChange={(e) => cambiar(setZona)(e.target.value)}
              placeholder="Todas las zonas"
              opciones={OPCIONES_FILTRO_ZONA}
            />
            <Select
              label="Sector"
              etiquetaOculta
              compacto
              value={sector}
              onChange={(e) => cambiar(setSector)(e.target.value)}
              placeholder="Todos los sectores"
              opciones={OPCIONES_FILTRO_SECTOR}
            />
            <Select
              label="Estado"
              etiquetaOculta
              compacto
              className="col-span-2 lg:col-span-1"
              value={liquidado}
              onChange={(e) => cambiar(setLiquidado)(e.target.value)}
              placeholder="Activos y liquidados"
              opciones={[
                { valor: "false", etiqueta: "Solo activos" },
                { valor: "true", etiqueta: "Solo liquidados" },
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
              sustantivo="créditos"
              onCambiar={setPagina}
            />
          )
        }
      >
        {cargando ? (
          <TablaCargando />
        ) : creditos.length === 0 ? (
          <TablaVacia titulo="Sin créditos">
            No hay créditos que coincidan con los filtros.
          </TablaVacia>
        ) : (
          <Tabla columnas={COLUMNAS} anchoMinimo="min-w-[1000px]">
            {creditos.map((c) => {
              const cal = calificacion(c.fallos);
              return (
                <FilaEnlace key={c.id} to={`/creditos/${c.id}`}>
                  <Td className="tabular-nums">
                    <Link
                      to={`/creditos/${c.id}`}
                      className="font-semibold text-slate-900 hover:text-primary-700"
                    >
                      {c.numero_credito}
                    </Link>
                  </Td>
                  <Td className="max-w-[16rem] truncate text-slate-900" >
                    <span title={c.curp ?? undefined}>{c.nombre}</span>
                  </Td>
                  <Td numerico className="text-slate-600">{c.numero_cliente}</Td>
                  <Td numerico className="text-slate-900">{formatearMoneda(c.monto)}</Td>
                  <Td numerico className="text-slate-600">
                    {c.plazo} sem
                    {c.semanas_adicionales > 0 && (
                      <span className="ml-1 text-xs font-semibold text-amber-700">
                        +{c.semanas_adicionales}
                      </span>
                    )}
                  </Td>
                  <Td numerico className="text-slate-900">{formatearMoneda(c.pago_fijo)}</Td>
                  <Td className="whitespace-nowrap text-slate-600">
                    {c.zona ?? "—"}
                    {c.sector ? `-${c.sector}` : ""}
                  </Td>
                  {/* Insignia solo para lo que pide atención: un "Bueno" verde en
                      cada fila es ruido. */}
                  <Td className="whitespace-nowrap">
                    {cal.variant === "success" ? (
                      <span className="text-slate-600">{cal.label}</span>
                    ) : (
                      <Badge variant={cal.variant}>{cal.label}</Badge>
                    )}
                    {c.fallos > 0 && (
                      <span className="ml-2 text-xs text-slate-500 tabular-nums">
                        {c.fallos} {c.fallos === 1 ? "fallo" : "fallos"}
                      </span>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap">
                    {c.liquidado ? (
                      <span className="text-slate-500">Liquidado</span>
                    ) : c.estatus === "ENTREGADO" ? (
                      <span className="text-slate-600">Entregado</span>
                    ) : c.estatus === "NO ENTREGADO" ? (
                      <Badge variant="info">Por entregar</Badge>
                    ) : (
                      <Badge variant="neutral">{c.estatus}</Badge>
                    )}
                  </Td>
                </FilaEnlace>
              );
            })}
          </Tabla>
        )}
      </PanelTabla>
    </>

  );

}
 
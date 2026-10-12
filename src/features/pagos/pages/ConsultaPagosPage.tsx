import { useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Wallet } from "lucide-react";

import {
  Alert,
  EncabezadoListado,
  CampoBusqueda,
  Badge,
  Breadcrumb,
  Button,
  FilaEnlace,
  Input,
  PanelTabla,
  PieTabla,
  Select,
  Tabla,
  TablaCargando,
  TablaVacia,
  Td,
} from "../../../shared/ui";
import type { ColumnaTabla } from "../../../shared/ui";

import { useDebounce } from "../../../shared/hooks/useDebounce";

import { OPCIONES_FILTRO_SECTOR, OPCIONES_FILTRO_ZONA } from "../../../shared/constants/zonas";

import { formatearFechaSolo, formatearMoneda } from "../../../shared/lib/formato";

import { useAuth } from "../../auth/hooks/useAuth";

import { usePagos } from "../hooks/usePagos";

import { OPCIONES_TIPO_PAGO, ROLES_CAPTURA_PAGOS, etiquetaTipoPago } from "../types";

const LIMITE = 25;

const COLUMNAS: ColumnaTabla[] = [
  { titulo: "Fecha" },
  { titulo: "Sem.", alinear: "der" },
  { titulo: "Crédito" },
  { titulo: "Cliente" },
  { titulo: "Abono", alinear: "der" },
  { titulo: "Multa", alinear: "der" },
  { titulo: "Forma" },
  { titulo: "Zona" },
  { titulo: "Capturó" },
  { titulo: "Estado", oculto: true },
];

export function ConsultaPagosPage() {
  const navigate = useNavigate();
  const { sesion } = useAuth();
  const puedeCapturar = !!sesion && ROLES_CAPTURA_PAGOS.includes(sesion.rol);

  const [numeroCredito, setNumeroCredito] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [zona, setZona] = useState("");
  const [sector, setSector] = useState("");
  const [tipo, setTipo] = useState("");
  const [cancelados, setCancelados] = useState("");
  const [pagina, setPagina] = useState(1);

  const numeroDiferido = useDebounce(numeroCredito, 400);

  const filtros = useMemo(
    () => ({
      numero_credito: numeroDiferido || undefined,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
      zona: zona || undefined,
      sector: sector || undefined,
      tipo: tipo || undefined,
      cancelados: cancelados || undefined,
      pagina,
      limite: LIMITE,
    }),
    [numeroDiferido, fechaDesde, fechaHasta, zona, sector, tipo, cancelados, pagina]
  );

  const { pagos, total, paginas, sumaMonto, sumaMultas, cargando, error } = usePagos(filtros);

  const cambiar = (fn: (v: string) => void) => (valor: string) => {
    fn(valor);
    setPagina(1);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Inicio", ruta: "/inicio" },
          { label: "Pagos" },
          { label: "Consulta" },
        ]}
      />

      <EncabezadoListado
        titulo="Pagos"
        total={cargando ? null : total}
        accion={
          puedeCapturar && (
            <Button onClick={() => navigate("/pagos/registrar")}>
              <Wallet size={16} aria-hidden="true" />
              Registrar pago
            </Button>
          )
        }
      />

      {error && (
        <div className="mb-6">
          <Alert variant="error" title="Error al cargar">
            {error}
          </Alert>
        </div>
      )}

      <PanelTabla
        filtros={
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <CampoBusqueda
              className="col-span-2"
              etiqueta="Número de crédito"
              inputMode="numeric"
              valor={numeroCredito}
              onCambiar={(v) => cambiar(setNumeroCredito)(v.replace(/\D/g, ""))}
              placeholder="Nº de crédito"
            />
            {/* Periodo: dos fechas con un guion en medio se leen como rango. */}
            <div className="col-span-2 flex items-center gap-2" role="group" aria-label="Periodo">
              <div className="min-w-0 flex-1">
                <Input
                  label="Desde"
                  etiquetaOculta
                  compacto
                  type="date"
                  value={fechaDesde}
                  max={fechaHasta || undefined}
                  onChange={(e) => cambiar(setFechaDesde)(e.target.value)}
                />
              </div>
              <span className="text-slate-500" aria-hidden="true">–</span>
              <div className="min-w-0 flex-1">
                <Input
                  label="Hasta"
                  etiquetaOculta
                  compacto
                  type="date"
                  value={fechaHasta}
                  min={fechaDesde || undefined}
                  onChange={(e) => cambiar(setFechaHasta)(e.target.value)}
                />
              </div>
            </div>
            <Select
              label="Forma de pago"
              etiquetaOculta
              compacto
              value={tipo}
              onChange={(e) => cambiar(setTipo)(e.target.value)}
              placeholder="Todas las formas"
              opciones={OPCIONES_TIPO_PAGO}
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
              value={cancelados}
              onChange={(e) => cambiar(setCancelados)(e.target.value)}
              placeholder="Solo vigentes"
              opciones={[
                { valor: "true", etiqueta: "Solo cancelados" },
                { valor: "todos", etiqueta: "Vigentes y cancelados" },
              ]}
            />
          </div>
        }
        resumen={
          /* Las sumas del backend incluyen los cancelados si el filtro los
             trae: solo se muestran como "cobrado" cuando son puros vigentes. */
          !cargando && !error && total > 0 && !cancelados ? (
            <dl className="flex flex-wrap gap-x-8 gap-y-1 tabular-nums">
              <Total label="Pagos" valor={total.toLocaleString("es-MX")} />
              <Total label="Abonado" valor={formatearMoneda(sumaMonto)} />
              <Total label="Multas" valor={formatearMoneda(sumaMultas)} />
            </dl>
          ) : null
        }
        pie={
          !cargando && (
            <PieTabla
              pagina={pagina}
              paginas={paginas}
              total={total}
              limite={LIMITE}
              sustantivo="pagos"
              onCambiar={setPagina}
            />
          )
        }
      >
        {cargando ? (
          <TablaCargando />
        ) : pagos.length === 0 ? (
          !error && (
            <TablaVacia titulo="Sin pagos">No hay pagos que coincidan con los filtros.</TablaVacia>
          )
        ) : (
          <Tabla columnas={COLUMNAS} anchoMinimo="min-w-[980px]">
            {pagos.map((p) => (
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
                <Td className="font-medium text-slate-900 tabular-nums">{p.numero_credito}</Td>
                <Td className="max-w-[16rem] truncate">
                  <span title={`Cliente ${p.numero_cliente}`}>{p.nombre_cliente}</span>
                </Td>
                <Td
                  numerico
                  className={p.cancelado ? "line-through" : "font-semibold text-slate-900"}
                >
                  {formatearMoneda(p.monto)}
                </Td>
                <Td numerico className={p.cancelado ? "line-through" : ""}>
                  {Number(p.multa) > 0 ? formatearMoneda(p.multa) : "—"}
                </Td>
                <Td>{etiquetaTipoPago(p.tipo)}</Td>
                <Td className="whitespace-nowrap">
                  {p.zona ?? "—"}
                  {p.sector ? `-${p.sector}` : ""}
                </Td>
                <Td>{p.usuario}</Td>
                <Td alinear="der">{p.cancelado && <Badge variant="danger">Cancelado</Badge>}</Td>
              </FilaEnlace>
            ))}
          </Tabla>
        )}
      </PanelTabla>

    </>
  );
}

function Total({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900">{valor}</dd>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { FileText, Wallet } from "lucide-react";

import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  CabeceraDetalle,
  DatoContexto,
  PanelLateral,
  SeccionLateral,
  DataItem,
  DataList,
  Spinner,
} from "../../../shared/ui";

import { useCreditoDetalle } from "../hooks/useCreditoDetalle";
import { BotonesImpresion } from "../components/BotonesImpresion";
import { CifrasCredito } from "../components/CifrasCredito";
import { DesgloseEntrega } from "../components/DesgloseEntrega";
import {
  formatearFechaHora,
  formatearFechaSolo,
  formatearMoneda,
} from "../../../shared/lib/formato";
import { useAuth } from "../../auth/hooks/useAuth";
import { EstadoCuentaCredito } from "../../pagos/components/EstadoCuentaCredito";
import { useEstadoCuenta } from "../../pagos/hooks/useEstadoCuenta";
import { ROLES_CAPTURA_PAGOS } from "../../pagos/types";

const CAL: Record<string, "success" | "warning" | "danger"> = {
  BUENO: "success",
  REGULAR: "warning",
  MALO: "danger",
};

const DOCS: Record<string, string> = {
  INE_FRENTE: "INE frente",
  INE_REVERSO: "INE reverso",
  COMPROBANTE_DOMICILIO: "Comprobante de domicilio",
};

const DUENOS: Record<string, string> = {
  TITULAR: "Titular",
  AVAL_1: "Aval 1",
  AVAL_2: "Aval 2",
};

export function DetalleCreditoPage() {
  const { id } = useParams<{ id: string }>();
  const idNumerico = Number(id);
  const navigate = useNavigate();

  const { detalle, cargando, error } = useCreditoDetalle(idNumerico);
  // Una sola petición para la cabecera y la sección de estado de cuenta.
  const estadoCuenta = useEstadoCuenta(Number.isNaN(idNumerico) ? null : idNumerico);

  const { sesion } = useAuth();
  const puedeCapturarPagos = !!sesion && ROLES_CAPTURA_PAGOS.includes(sesion.rol);

  const migas = [
    { label: "Inicio", ruta: "/inicio" },
    { label: "Créditos", ruta: "/creditos" },
    { label: detalle ? `Crédito ${detalle.credito.numero_credito}` : "Detalle del crédito" },
  ];

  if (Number.isNaN(idNumerico)) {
    return (
      <>
        <Breadcrumb items={migas} />
        <Alert variant="error" title="Dirección inválida">
          El identificador del crédito no es válido.
        </Alert>
      </>
    );
  }

  if (cargando) {
    return (
      <>
        <Breadcrumb items={migas} />
        <div className="rounded-xl border border-slate-200 bg-white py-20">
          <Spinner centered size="lg" />
        </div>
      </>
    );
  }

  if (error || !detalle) {
    return (
      <>
        <Breadcrumb items={migas} />
        <Alert variant="error" title="No se pudo abrir el crédito">
          {error ?? "Error desconocido."}
        </Alert>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate("/creditos")}>
            Volver a la consulta
          </Button>
        </div>
      </>
    );
  }

  const { credito, cliente, avales, garantias, documentos, solicitud, movimientos } =
    detalle;

  const estado = estadoCuenta.datos?.estado_cuenta ?? null;
  const recibePagos =
    estadoCuenta.datos?.credito.estatus === "ENTREGADO" && !!estado && estado.saldo > 0;

  const plazoTotal = credito.plazo + credito.semanas_adicionales;

  return (
    <>
      <Breadcrumb items={migas} />

      <CabeceraDetalle
        titulo={`Crédito ${credito.numero_credito}`}
        insignias={
          <>
            {credito.calificacion !== "BUENO" && (
              <Badge variant={CAL[credito.calificacion] ?? "neutral"}>
                {credito.calificacion}
              </Badge>
            )}
            {credito.liquidado && <Badge variant="neutral">Liquidado</Badge>}
            {credito.demanda && <Badge variant="danger">En demanda</Badge>}
          </>
        }
        contexto={[
          <Link
            to={`/clientes/${cliente.id}`}
            className="font-medium text-slate-900 hover:text-primary-700"
          >
            {cliente.nombre}
          </Link>,
          <>
            Cliente <DatoContexto>{cliente.numero_cliente}</DatoContexto>
          </>,
          <>
            Zona <DatoContexto>{`${credito.zona ?? "—"}-${credito.sector ?? "—"}`}</DatoContexto>
          </>,
          <>
            Capturó <DatoContexto>{credito.usuario_alta}</DatoContexto>
          </>,
        ]}
        acciones={
          <BotonesImpresion idCredito={credito.id} numeroCredito={credito.numero_credito} />
        }
      >
        <CifrasCredito
          estado={estado}
          cargando={estadoCuenta.cargando}
          error={estadoCuenta.error}
          accion={
            puedeCapturarPagos && recibePagos ? (
              <Button
                onClick={() =>
                  navigate(`/pagos/registrar?credito=${credito.numero_credito}`)
                }
              >
                <Wallet size={16} aria-hidden="true" />
                Registrar pago
              </Button>
            ) : null
          }
        />
      </CabeceraDetalle>

      {credito.fallos >= 2 && (
        <div className="mb-6">
          <Alert
            variant={credito.fallos >= 3 ? "error" : "warning"}
            title={
              credito.fallos >= 3 ? "Cliente con mal historial" : "Estampa de morosidad"
            }
          >
            {credito.fallos} fallos acumulados en la vida del crédito.
            {credito.fallos >= 3 &&
              " No aplica para incremento de monto en renovaciones."}
          </Alert>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* Principal: lo que se consulta a diario. */}
        <div className="min-w-0 lg:col-span-2">
          <EstadoCuentaCredito
            datos={estadoCuenta.datos}
            cargando={estadoCuenta.cargando}
            error={estadoCuenta.error}
          />
        </div>

        {/* Lateral: condiciones y lo administrativo, en una sola tarjeta. */}
        <div className="min-w-0">
        <PanelLateral etiqueta="Datos del crédito">
          <SeccionLateral titulo="Condiciones">
            <div className="flex flex-col gap-5">
              <DesgloseEntrega
                monto={credito.monto}
                gastosAdmin={credito.gastos_admin}
                serviciosFunerarios={credito.servicios_funerarios}
                saldoAnterior={credito.saldo_anterior}
                pagoAdelantado={credito.pago_adelantado}
                montoEntregar={credito.monto_entregar}
              />

              <DataList titulo="Pago" compacta>
                <DataItem
                  label="Plazo"
                  detalle={
                    credito.semanas_adicionales > 0
                      ? `${credito.plazo} + ${credito.semanas_adicionales} adicionales`
                      : undefined
                  }
                >
                  {plazoTotal} semanas
                </DataItem>
                <DataItem
                  label="Total a pagar"
                  detalle={
                    // Solo si la cuenta cuadra: no mostrar una multiplicación falsa.
                    Math.abs(credito.plazo * Number(credito.pago_fijo) - Number(credito.total_a_pagar)) < 0.01
                      ? `${credito.plazo} × ${formatearMoneda(credito.pago_fijo)}`
                      : undefined
                  }
                >
                  {formatearMoneda(credito.total_a_pagar)}
                </DataItem>
                <DataItem label="Multas">{formatearMoneda(credito.multas)}</DataItem>
                <DataItem label="Prórroga">{credito.prorroga ? "Sí" : "No"}</DataItem>
              </DataList>

              <DataList titulo="Fechas" compacta>
                <DataItem label="Inicio">{formatearFechaSolo(credito.fecha_inicio)}</DataItem>
                <DataItem label="Fin estimado">
                  {formatearFechaSolo(credito.fecha_fin_estimada)}
                </DataItem>
              </DataList>
            </div>
          </SeccionLateral>

          <SeccionLateral
            titulo="Cliente"
            accion={
              <Link
                to={`/clientes/${cliente.id}`}
                className="text-sm font-medium text-primary-700 hover:underline"
              >
                Ver ficha
              </Link>
            }
          >
            <DataList compacta>
              <DataItem label="Nombre">{cliente.nombre}</DataItem>
              <DataItem label="CURP" mono>
                {cliente.curp}
              </DataItem>
              <DataItem label="Teléfono">{cliente.telefono}</DataItem>
              <DataItem label="Domicilio">
                {cliente.domicilio
                  ? [
                      `${cliente.domicilio.calle} ${cliente.domicilio.numero_ext ?? ""}`.trim(),
                      cliente.domicilio.colonia,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : null}
              </DataItem>
            </DataList>
          </SeccionLateral>

          {avales.length > 0 && (
            <SeccionLateral titulo={avales.length === 1 ? "Aval" : `Avales (${avales.length})`}>
              <div className="flex flex-col gap-4">
                {avales.map((a: any) => (
                  <DataList
                    key={a.orden}
                    titulo={avales.length > 1 ? `Aval ${a.orden}` : undefined}
                    compacta
                  >
                    <DataItem label="Nombre">{a.nombre}</DataItem>
                    <DataItem label="CURP" mono>
                      {a.curp}
                    </DataItem>
                    <DataItem label="Parentesco">{a.parentesco}</DataItem>
                    <DataItem label="Teléfono">{a.telefono}</DataItem>
                  </DataList>
                ))}
              </div>
            </SeccionLateral>
          )}

          {(garantias.length > 0 || documentos.length > 0) && (
            <SeccionLateral titulo="Garantías y documentos">
              <div className="flex flex-col gap-4">
                {garantias.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Garantías
                    </h3>
                    <ul className="divide-y divide-slate-100 text-sm">
                      {garantias.map((g: any) => (
                        <li key={g.id} className="flex items-center justify-between gap-2 py-1.5">
                          <span className="min-w-0 text-slate-900">
                            {g.articulo}
                            {g.marca && <span className="text-slate-500"> · {g.marca}</span>}
                          </span>
                          <span className="shrink-0 text-xs text-slate-500">
                            {DUENOS[g.propietario] ?? g.propietario}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {documentos.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Documentos
                    </h3>
                    <ul className="divide-y divide-slate-100 text-sm">
                      {documentos.map((d: any) => (
                        <li key={d.id} className="flex items-center gap-2 py-1.5">
                          <FileText size={15} className="shrink-0 text-slate-500" aria-hidden="true" />
                          <span className="min-w-0 flex-1 truncate text-slate-900">
                            {DOCS[d.tipo] ?? d.tipo}
                          </span>
                          <span className="shrink-0 text-xs text-slate-500">
                            {DUENOS[d.propietario] ?? d.propietario}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SeccionLateral>
          )}

          {solicitud && (
            <SeccionLateral titulo="Origen">
              <DataList compacta>
                <DataItem label="Folio">{solicitud.folio}</DataItem>
                <DataItem label="Capturó">{solicitud.usuario_captura}</DataItem>
                <DataItem label="Preaprobó">{solicitud.usuario_preaprueba}</DataItem>
                <DataItem label="Aprobó">{solicitud.usuario_aprueba}</DataItem>
              </DataList>
            </SeccionLateral>
          )}

          {movimientos.length > 0 && <Movimientos movimientos={movimientos} />}
        </PanelLateral>
        </div>
      </div>
    </>
  );
}

const MOVIMIENTOS_VISIBLES = 5;

/** Bitácora del crédito, en el orden del backend; los demás plegados. */
function Movimientos({ movimientos }: { movimientos: any[] }) {
  const [todos, setTodos] = useState(false);
  const visibles = todos ? movimientos : movimientos.slice(0, MOVIMIENTOS_VISIBLES);
  const ocultos = movimientos.length - MOVIMIENTOS_VISIBLES;

  return (
    <SeccionLateral titulo="Movimientos">
      <ul className="divide-y divide-slate-100">
        {visibles.map((m) => (
          <li key={m.id} className="py-2 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <p className="min-w-0 font-medium text-slate-900">{m.tipo}</p>
              <p className="shrink-0 text-xs text-slate-500 tabular-nums">
                {formatearFechaHora(m.fecha)}
              </p>
            </div>
            {m.descripcion && <p className="mt-0.5 text-slate-600">{m.descripcion}</p>}
            <p className="mt-0.5 text-xs text-slate-500">{m.usuario}</p>
          </li>
        ))}
      </ul>
      {ocultos > 0 && (
        <button
          type="button"
          onClick={() => setTodos((v) => !v)}
          aria-expanded={todos}
          className="mt-2 text-sm font-medium text-primary-700 hover:underline"
        >
          {todos ? "Ver menos" : `Ver ${ocultos} más`}
        </button>
      )}
    </SeccionLateral>
  );
}

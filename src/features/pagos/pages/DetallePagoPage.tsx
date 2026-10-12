import { useState } from "react";


import { Link, useNavigate, useParams } from "react-router-dom";


import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  CabeceraDetalle,
  DataItem,
  DataList,
  DatoContexto,
  Spinner,
} from "../../../shared/ui";

import { ROLES } from "../../../shared/constants/roles";

import { formatearFechaHora, formatearFechaSolo, formatearMoneda } from "../../../shared/lib/formato";

import { useAuth } from "../../auth/hooks/useAuth";

import { usePagoDetalle } from "../hooks/usePagoDetalle";

import { ModalCancelarPago } from "../components/ModalCancelarPago";

import { etiquetaTipoPago } from "../types";
import type { RespuestaCancelacionPago } from "../types";

export function DetallePagoPage() {
  const { id } = useParams<{ id: string }>();
  const idNumerico = Number(id);
  const navigate = useNavigate();
  const { sesion } = useAuth();

  const { pago, cargando, error, recargar } = usePagoDetalle(idNumerico);

  const [cancelando, setCancelando] = useState(false);
  const [cancelacion, setCancelacion] = useState<RespuestaCancelacionPago | null>(null);

  // Espejo de PATCH /pagos/:id/cancelar: solo administrador.
  const esAdmin = sesion?.rol === ROLES.ADMINISTRADOR;

  const migas = [
    { label: "Inicio", ruta: "/inicio" },
    { label: "Pagos", ruta: "/pagos" },
    { label: "Detalle del pago" },
  ];

  if (Number.isNaN(idNumerico)) {
    return (
      <>
        <Breadcrumb items={migas} />
        <Alert variant="error" title="Dirección inválida">
          El identificador del pago no es válido.
        </Alert>
      </>
    );
  }

  if (cargando && !pago) {
    return (
      <>
        <Breadcrumb items={migas} />
        <div className="rounded-xl border border-slate-200 bg-white py-20">
          <Spinner centered size="lg" />
        </div>
      </>
    );
  }

  if (error || !pago) {
    return (
      <>
        <Breadcrumb items={migas} />
        <Alert variant="error" title="No se pudo abrir el pago">
          {error ?? "Error desconocido."}
        </Alert>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate("/pagos")}>
            Volver a la consulta
          </Button>
        </div>
      </>
    );
  }

  const alCancelar = (r: RespuestaCancelacionPago) => {
    setCancelando(false);
    setCancelacion(r);
    recargar();
  };

  return (
    <>
      <Breadcrumb items={migas} />

      <CabeceraDetalle
        titulo={`Pago de ${formatearMoneda(pago.monto)}`}
        insignias={pago.cancelado && <Badge variant="danger">Cancelado</Badge>}
        contexto={[
          <>
            Crédito{" "}
            <Link
              to={`/creditos/${pago.id_credito}`}
              className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-primary-700"
            >
              {pago.numero_credito}
            </Link>
          </>,
          <span className="text-slate-900">{pago.nombre_cliente}</span>,
          <>
            Semana <DatoContexto>{pago.semana}</DatoContexto>
          </>,
          formatearFechaSolo(pago.fecha, "larga"),
        ]}
        acciones={
          esAdmin &&
          !pago.cancelado && (
            <Button variant="danger" onClick={() => setCancelando(true)}>
              Cancelar pago
            </Button>
          )
        }
      />

      {cancelacion && (
        <div className="mb-6 flex flex-col gap-3">
          <Alert variant="success" onDismiss={() => setCancelacion(null)}>
            {cancelacion.message}.
          </Alert>
          {cancelacion.advertencia && <Alert variant="warning">{cancelacion.advertencia}</Alert>}
        </div>
      )}

      {pago.cancelado && (
        <div className="mb-6">
          <Alert variant="error" title="Pago cancelado">
            {pago.motivo_cancelado}
            <span className="mt-1 block text-xs">
              Por {pago.usuario_cancelado ?? "—"} el {formatearFechaHora(pago.fecha_cancelado) ?? "—"}
            </span>
          </Alert>
        </div>
      )}

      <section
        aria-label="Datos del pago"
        className="rounded-xl border border-slate-200 bg-white p-4 lg:max-w-4xl lg:p-5"
      >
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          <DataList titulo="Cobro" compacta>
            <DataItem label="Abono">{formatearMoneda(pago.monto)}</DataItem>
            <DataItem label="Multa">
              {Number(pago.multa) > 0 ? formatearMoneda(pago.multa) : null}
            </DataItem>
            <DataItem label="Forma de pago">{etiquetaTipoPago(pago.tipo)}</DataItem>
            <DataItem label="Fecha del pago">{formatearFechaSolo(pago.fecha, "larga")}</DataItem>
            <DataItem label="Semana del crédito">{pago.semana}</DataItem>
          </DataList>

          <DataList titulo="Registro" compacta>
            <DataItem label="Capturó">{pago.usuario}</DataItem>
            <DataItem label="Capturado">{formatearFechaHora(pago.fecha_hora)}</DataItem>
            <DataItem label="Cliente">{pago.numero_cliente}</DataItem>
            <DataItem label="Zona y sector">{`${pago.zona ?? "—"}-${pago.sector ?? "—"}`}</DataItem>
            <DataItem label="Corte">
              {pago.corte
                ? `${formatearFechaSolo(pago.corte.fecha_corte)} · ${pago.corte.estatus}`
                : "Pendiente"}
            </DataItem>
          </DataList>
        </div>

        {pago.observaciones && (
          <div className="mt-6">
            <h3 className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Observaciones
            </h3>
            <p className="text-sm whitespace-pre-line text-slate-900">{pago.observaciones}</p>
          </div>
        )}
      </section>

      <ModalCancelarPago
        pago={cancelando ? pago : null}
        onCerrar={() => setCancelando(false)}
        onExito={alCancelar}
      />
    </>
  );
}

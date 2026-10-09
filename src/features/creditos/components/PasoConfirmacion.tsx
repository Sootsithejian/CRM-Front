import { useEffect, useState } from "react";

import { Alert, Button, Textarea } from "../../../shared/ui";

import { cotizar } from "../api/creditos.api";

import type { BorradorSolicitud, Cotizacion } from "../types";
 
interface PasoConfirmacionProps {

  borrador: BorradorSolicitud;

  enviando: boolean;

  error: string | null;

  onObservaciones: (texto: string) => void;

  onEnviar: () => void;

  onAnterior: () => void;

  onCancelar: () => void;

  onLimpiarError: () => void;

}
 
export function PasoConfirmacion({

  borrador,

  enviando,

  error,

  onObservaciones,

  onEnviar,

  onAnterior,

  onCancelar,

  onLimpiarError,

}: PasoConfirmacionProps) {

  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);

  const { cliente, credito, aval1, aval2 } = borrador;
 
  useEffect(() => {

    if (!credito.id_producto) return;
 
    cotizar({

      id_producto: credito.id_producto,

      pago_adelantado: credito.pago_adelantado,

      saldo_anterior: credito.saldo_anterior,

    })

      .then(setCotizacion)

      .catch(() => setCotizacion(null));

  }, [credito.id_producto, credito.pago_adelantado, credito.saldo_anterior]);
 
  const fecha = credito.fecha_entrega

    ? new Date(credito.fecha_entrega + "T00:00:00").toLocaleDateString("es-MX", {

        day: "numeric",

        month: "long",

        year: "numeric",

      })

    : "—";
 
  return (
<>

      {error && (
<div className="mb-6">
<Alert variant="error" title="No se registró la solicitud" onDismiss={onLimpiarError}>

            {error}
</Alert>
</div>

      )}
 
      <Bloque titulo="Resumen: Cliente Solicitante">
<Dato label="Nº cliente" valor={cliente?.numero_cliente} />
<Dato label="Nombre del cliente" valor={cliente?.nombre} />
<Dato label="CURP" valor={cliente?.curp} />
<Dato

          label="Zona / Sector"

          valor={

            cliente?.zona ? `Zona ${cliente.zona} - Sector ${cliente.sector ?? "—"}` : null

          }

        />
</Bloque>
 
      <Bloque titulo="Resumen: Datos del Crédito solicitado">
<Dato

          label="Monto solicitado"

          valor={

            cotizacion

              ? `$${cotizacion.desglose.monto.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`

              : null

          }

        />
<Dato label="Plazo" valor={credito.plazo ? `${credito.plazo} semanas` : null} />
<Dato

          label="Pago semanal"

          valor={

            cotizacion

              ? `$${cotizacion.desglose.pago_semanal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`

              : null

          }

        />
<Dato label="Fecha programada" valor={fecha} />
</Bloque>
 
      {cotizacion && (
<section className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-6">
<p className="mb-4 text-sm font-bold text-sky-900">

            El cliente recibirá en efectivo
</p>
<p className="text-3xl font-bold text-sky-900">

            ${cotizacion.desglose.monto_entregar.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
</p>
<p className="mt-3 text-sm text-sky-800">

            Monto ${cotizacion.desglose.monto.toLocaleString("es-MX")} menos gastos

            de administración ${cotizacion.desglose.gastos_admin.toLocaleString("es-MX")}

            {cotizacion.desglose.saldo_anterior > 0 &&

              `, saldo anterior $${cotizacion.desglose.saldo_anterior.toLocaleString("es-MX")}`}

            {cotizacion.desglose.pago_adelantado > 0 &&

              `, pago adelantado $${cotizacion.desglose.pago_adelantado.toLocaleString("es-MX")}`}

            . Total a pagar: $

            {cotizacion.desglose.total_a_pagar.toLocaleString("es-MX")}.
</p>
</section>

      )}
 
      <Bloque titulo="Resumen: Aval Principal">
<Dato label="Nombre completo" valor={aval1?.nombre} />
<Dato label="CURP" valor={aval1?.curp} />
<Dato label="Parentesco" valor={aval1?.parentesco} />
<Dato label="Teléfono" valor={aval1?.telefono} />
</Bloque>
 
      {aval2 ? (
<Bloque titulo="Resumen: Segundo Aval">
<Dato label="Nombre completo" valor={aval2.nombre} />
<Dato label="CURP" valor={aval2.curp} />
<Dato label="Parentesco" valor={aval2.parentesco} />
<Dato label="Teléfono" valor={aval2.telefono} />
</Bloque>

      ) : (
<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
<h2 className="mb-1 text-base font-bold text-slate-900">

            Resumen: Segundo Aval
</h2>
<p className="text-sm text-slate-500">

            Esta solicitud se registra con un solo aval.
</p>
</section>

      )}
 
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-4 text-base font-bold text-slate-900">

          Observaciones Adicionales
</h2>
<Textarea

          rows={3}

          placeholder="Notas para quien revise esta solicitud…"

          value={borrador.observaciones}

          onChange={(e) => onObservaciones(e.target.value)}

          disabled={enviando}

        />
</section>
 
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
<Button variant="ghost" onClick={onCancelar} disabled={enviando}>

          Cancelar Solicitud
</Button>
 
        <div className="flex flex-wrap gap-3">
<Button variant="secondary" onClick={onAnterior} disabled={enviando}>

            Anterior
</Button>
<Button onClick={onEnviar} loading={enviando}>

            Dar de Alta Solicitud
</Button>
</div>
</div>
</>

  );

}
 
function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {

  return (
<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">{titulo}</h2>
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {children}
</div>
</section>

  );

}
 
function Dato({ label, valor }: { label: string; valor: React.ReactNode }) {

  const vacio = valor === null || valor === undefined || valor === "";

  return (
<div>
<p className="mb-1 text-xs tracking-wide text-slate-400 uppercase">{label}</p>
<p className={vacio ? "text-slate-400" : "font-semibold text-slate-900"}>

        {vacio ? "—" : valor}
</p>
</div>

  );

}
 
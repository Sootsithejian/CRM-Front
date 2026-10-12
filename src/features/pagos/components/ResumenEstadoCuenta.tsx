import type { ReactNode } from "react";

import { formatearFechaSolo, formatearMoneda } from "../../../shared/lib/formato";

import type { EstadoCuenta } from "../types";

/** Cifras clave del estado de cuenta, en mosaico. */
export function ResumenEstadoCuenta({ estado }: { estado: EstadoCuenta }) {
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Dato label="Saldo" destacado>
        {formatearMoneda(estado.saldo)}
      </Dato>

      <Dato label="Pago semanal">{formatearMoneda(estado.pago_fijo)}</Dato>

      {estado.al_corriente ? (
        <Dato label="Situación" tono="ok">
          Al corriente
          {estado.adelanto > 0 && (
            <span className="block text-xs font-normal text-green-700">
              Adelanto de {formatearMoneda(estado.adelanto)}
            </span>
          )}
        </Dato>
      ) : (
        <Dato label="Atraso" tono="alerta">
          {formatearMoneda(estado.atraso)}
        </Dato>
      )}

      <Dato label="Semana">
        {Math.min(estado.semana_actual, estado.semanas_exigibles)} de {estado.semanas_exigibles}
        {estado.semanas_adicionales > 0 && (
          <span className="block text-xs font-normal text-slate-500">
            Incluye {estado.semanas_adicionales} adicional
            {estado.semanas_adicionales === 1 ? "" : "es"}
          </span>
        )}
      </Dato>

      <Dato label="Abonado">
        {formatearMoneda(estado.abonado)}
        <span className="block text-xs font-normal text-slate-500">
          de {formatearMoneda(estado.deuda_total)}
        </span>
      </Dato>

      <Dato label="Multas cobradas">{formatearMoneda(estado.multas_cobradas)}</Dato>

      <Dato label="Fallos">{estado.fallos}</Dato>

      <Dato label="Fin estimado">{formatearFechaSolo(estado.fecha_fin_estimada) ?? "—"}</Dato>
    </dl>
  );
}

const TONOS = {
  normal: "border-slate-200 bg-slate-50 text-slate-900",
  ok: "border-green-200 bg-green-50 text-green-800",
  alerta: "border-red-200 bg-red-50 text-red-800",
};

function Dato({
  label,
  children,
  tono = "normal",
  destacado = false,
}: {
  label: string;
  children: ReactNode;
  tono?: keyof typeof TONOS;
  destacado?: boolean;
}) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${TONOS[tono]}`}>
      <dt className="text-xs tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className={`mt-1 font-semibold ${destacado ? "text-xl" : "text-base"}`}>{children}</dd>
    </div>
  );
}

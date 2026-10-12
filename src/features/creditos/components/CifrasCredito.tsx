import type { ReactNode } from "react";
import { CircleCheck } from "lucide-react";

import { Skeleton } from "../../../shared/ui";
import { formatearMoneda } from "../../../shared/lib/formato";
import type { EstadoCuenta } from "../../pagos/types";

interface CifrasCreditoProps {
  estado: EstadoCuenta | null;
  cargando: boolean;
  error: string | null;
  /** Acción al final de la fila, p. ej. "Registrar pago". */
  accion?: ReactNode;
}

/*  Las cuatro cifras que se consultan a diario, en la cabecera del
    crédito: saldo, atraso, pago semanal y semana actual. El resto del
    estado de cuenta vive más abajo.  */
export function CifrasCredito({ estado, cargando, error, accion }: CifrasCreditoProps) {
  if (cargando) {
    return (
      <Fila>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-7 w-28" />
          </div>
        ))}
      </Fila>
    );
  }

  if (error || !estado) {
    return (
      <p className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500 lg:px-6">
        {error
          ? "No se pudieron cargar las cifras del crédito."
          : "Sin estado de cuenta todavía: el calendario de pagos empieza con la entrega."}
      </p>
    );
  }

  return (
    <Fila accion={accion}>
      <Cifra
        label="Saldo"
        valor={formatearMoneda(estado.saldo)}
        detalle={`de ${formatearMoneda(estado.deuda_total)}`}
      />

      {estado.al_corriente ? (
        <Cifra
          label="Atraso"
          valor={formatearMoneda(0)}
          detalle={
            <span className="inline-flex items-center gap-1 font-medium text-green-700">
              <CircleCheck size={13} aria-hidden="true" />
              {estado.adelanto > 0
                ? `Adelanto de ${formatearMoneda(estado.adelanto)}`
                : "Al corriente"}
            </span>
          }
        />
      ) : (
        <Cifra label="Atraso" valor={formatearMoneda(estado.atraso)} tono="alerta" />
      )}

      <Cifra label="Pago semanal" valor={formatearMoneda(estado.pago_fijo)} />

      <Cifra
        label="Semana"
        valor={`${Math.min(estado.semana_actual, estado.semanas_exigibles)} de ${estado.semanas_exigibles}`}
        detalle={
          estado.semanas_adicionales > 0
            ? `Incluye ${estado.semanas_adicionales} adicional${estado.semanas_adicionales === 1 ? "" : "es"}`
            : undefined
        }
      />
    </Fila>
  );
}

function Fila({ children, accion }: { children: ReactNode; accion?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 lg:flex-row lg:items-end lg:px-6 lg:py-5">
      <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">{children}</dl>
      {accion && <div className="shrink-0 [&>button]:w-full lg:[&>button]:w-auto">{accion}</div>}
    </div>
  );
}

function Cifra({
  label,
  valor,
  detalle,
  tono = "normal",
}: {
  label: string;
  valor: string;
  detalle?: ReactNode;
  tono?: "normal" | "alerta";
}) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd
        className={`mt-0.5 text-xl font-semibold tracking-tight tabular-nums lg:text-2xl ${tono === "alerta" ? "text-red-700" : "text-slate-900"}`}
      >
        {valor}
      </dd>
      {detalle && <dd className="mt-0.5 text-xs text-slate-500 tabular-nums">{detalle}</dd>}
    </div>
  );
}

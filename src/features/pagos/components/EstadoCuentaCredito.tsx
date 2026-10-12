import type { ReactNode } from "react";

import { Alert, Badge, Fila, Pestanas, Spinner, Tabla, Td } from "../../../shared/ui";
import type { ColumnaTabla } from "../../../shared/ui";

import { formatearFechaSolo, formatearMoneda } from "../../../shared/lib/formato";

import { TablaPagosCredito } from "./TablaPagosCredito";

import type { RespuestaEstadoCuenta, SemanaEstado } from "../types";

/*  Estado de cuenta dentro del detalle del crédito: una sola tarjeta con
    el resto de las cifras arriba y, en pestañas, semana por semana y los
    pagos. Saldo, atraso, pago semanal y semana actual van en la cabecera
    (CifrasCredito), así que aquí no se repiten. Los datos los carga la
    página con useEstadoCuenta para compartir una sola petición.  */
export function EstadoCuentaCredito({
  datos,
  cargando,
  error,
}: {
  datos: RespuestaEstadoCuenta | null;
  cargando: boolean;
  error: string | null;
}) {
  if (cargando) {
    return (
      <Tarjeta>
        <div className="py-10">
          <Spinner centered />
        </div>
      </Tarjeta>
    );
  }

  if (error || !datos) {
    return (
      <Tarjeta>
        <Alert variant="error">{error ?? "No se pudo cargar el estado de cuenta."}</Alert>
      </Tarjeta>
    );
  }

  const { credito, estado_cuenta: estado, semanas, pagos } = datos;

  if (!estado) {
    return (
      <Tarjeta>
        <p className="text-sm text-slate-500">
          El crédito todavía no se entrega: el calendario de pagos empieza con la entrega.
        </p>
      </Tarjeta>
    );
  }


  return (
    <Tarjeta>
      <dl className="mb-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
        <Cifra label="Abonado" detalle={`de ${formatearMoneda(estado.deuda_total)}`}>
          {formatearMoneda(estado.abonado)}
        </Cifra>
        <Cifra label="Multas cobradas">{formatearMoneda(estado.multas_cobradas)}</Cifra>
        <Cifra label="Fallos">{estado.fallos}</Cifra>
        <Cifra label="Fin estimado">{formatearFechaSolo(estado.fecha_fin_estimada) ?? "—"}</Cifra>
      </dl>

      {credito.fecha_liquidado && (
        <p className="mb-4 text-sm text-slate-600">
          Liquidado el {formatearFechaSolo(credito.fecha_liquidado, "larga")}.
        </p>
      )}

      {estado.excedente > 0 && (
        <div className="mb-4">
          <Alert variant="warning" title="Sobrepago">
            El cliente abonó {formatearMoneda(estado.excedente)} de más.
          </Alert>
        </div>
      )}

      <Pestanas
        etiqueta="Estado de cuenta"
        pestanas={[
          {
            id: "semanas",
            etiqueta: "Semana por semana",
            contenido: <TablaSemanas semanas={semanas} semanaActual={estado.semana_actual} />,
          },
          {
            id: "pagos",
            etiqueta: (
              <>
                Pagos <span className="ml-1 text-slate-500 tabular-nums">{pagos.length}</span>
              </>
            ),
            contenido: <TablaPagosCredito pagos={pagos} />,
          },
        ]}
      />
    </Tarjeta>
  );
}

function Cifra({
  label,
  detalle,
  children,
}: {
  label: string;
  detalle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900 tabular-nums">{children}</dd>
      {detalle && <dd className="text-xs text-slate-500 tabular-nums">{detalle}</dd>}
    </div>
  );
}

const COLUMNAS_SEMANAS: ColumnaTabla[] = [
  { titulo: "Semana", alinear: "der" },
  { titulo: "Corte" },
  { titulo: "Esperado acum.", alinear: "der" },
  { titulo: "Abonó", alinear: "der" },
  { titulo: "Abonado acum.", alinear: "der" },
  { titulo: "Multas", alinear: "der" },
  { titulo: "Resultado" },
];

function TablaSemanas({ semanas, semanaActual }: { semanas: SemanaEstado[]; semanaActual: number }) {
  if (semanas.length === 0) {
    return <p className="text-sm text-slate-500">Sin semanas que mostrar todavía.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <Tabla columnas={COLUMNAS_SEMANAS} anchoMinimo="min-w-[720px]">
        {semanas.map((s) => {
          const actual = s.semana === semanaActual;
          const debajo = s.cerrada && s.abonado_acumulado < s.esperado_acumulado;

          return (
            <Fila key={s.semana} className={actual ? "bg-sky-50" : undefined}>
              <Td numerico className="font-semibold text-slate-900">
                {actual && <span className="mr-2 text-xs font-medium text-sky-700">actual</span>}
                {s.semana}
              </Td>
              <Td className="whitespace-nowrap text-slate-600">
                {formatearFechaSolo(s.fecha_corte, "corta")}
              </Td>
              {/* Esperado en gris y abonado en negro: la comparación se lee sola. */}
              <Td numerico className="text-slate-500">
                {formatearMoneda(s.esperado_acumulado)}
              </Td>
              <Td numerico className="text-slate-700">
                {s.abonado_semana > 0 ? formatearMoneda(s.abonado_semana) : "—"}
              </Td>
              <Td numerico className={`font-medium ${debajo ? "text-red-700" : "text-slate-900"}`}>
                {formatearMoneda(s.abonado_acumulado)}
              </Td>
              <Td numerico className="text-slate-700">
                {s.multas_semana > 0 ? formatearMoneda(s.multas_semana) : "—"}
              </Td>
              <Td>
                {s.genero_fallo === null ? (
                  <span className="text-slate-500">{s.cerrada ? "Sin corte" : "Abierta"}</span>
                ) : s.genero_fallo ? (
                  <Badge variant="danger">Fallo</Badge>
                ) : (
                  <span className="text-slate-500">Sin fallo</span>
                )}
              </Td>
            </Fila>
          );
        })}
      </Tabla>
    </div>
  );
}

function Tarjeta({ children }: { children: ReactNode }) {
  return (
    <section
      aria-labelledby="titulo-estado-cuenta"
      className="rounded-xl border border-slate-200 bg-white p-4 lg:p-5"
    >
      <h2 id="titulo-estado-cuenta" className="mb-4 text-base font-semibold text-slate-900">
        Estado de cuenta
      </h2>
      {children}
    </section>
  );
}

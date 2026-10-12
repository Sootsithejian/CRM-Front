import { formatearMoneda } from "../../../shared/lib/formato";

type Monto = string | number | null | undefined;

interface DesgloseEntregaProps {
  monto: Monto;
  gastosAdmin: Monto;
  serviciosFunerarios: Monto;
  saldoAnterior: Monto;
  pagoAdelantado: Monto;
  montoEntregar: Monto;
}

/*  Lo que recibió el cliente, como recibo: el monto menos cada descuento.
    Es la misma resta que hace el backend al crear el crédito
    (creditos.routes.ts). Los descuentos en cero no se listan. El total
    es el monto_entregar guardado, no se recalcula aquí.  */
export function DesgloseEntrega({
  monto,
  gastosAdmin,
  serviciosFunerarios,
  saldoAnterior,
  pagoAdelantado,
  montoEntregar,
}: DesgloseEntregaProps) {
  const descuentos = [
    { label: "Gastos de administración", valor: Number(gastosAdmin) },
    { label: "Servicios funerarios", valor: Number(serviciosFunerarios) },
    { label: "Saldo anterior", valor: Number(saldoAnterior) },
    { label: "Pago adelantado", valor: Number(pagoAdelantado) },
  ].filter((d) => d.valor > 0);

  return (
    <div>
      <h3 className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Entrega
      </h3>
      <dl className="text-sm tabular-nums">
        <div className="flex items-baseline justify-between gap-4 py-2">
          <dt className="text-slate-700">Monto del crédito</dt>
          <dd className="font-medium text-slate-900">{formatearMoneda(monto)}</dd>
        </div>

        {descuentos.map((d) => (
          <div key={d.label} className="flex items-baseline justify-between gap-4 py-1">
            <dt className="text-slate-500">{d.label}</dt>
            <dd className="text-slate-600">−{formatearMoneda(d.valor)}</dd>
          </div>
        ))}

        <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-slate-300 pt-2.5">
          <dt className="font-semibold text-slate-900">Entregado al cliente</dt>
          <dd className="text-base font-semibold text-slate-900">
            {formatearMoneda(montoEntregar)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

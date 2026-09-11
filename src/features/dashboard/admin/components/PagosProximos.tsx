import { Badge } from "../../../../shared/ui";
import { PAGOS_PROXIMOS } from "../mocks";
import type { EstadoPago } from "../mocks";

const ESTADOS: Record<
EstadoPago,
    { label: string; variant: "warning" | "success" | "danger" }
    > = {
    proximo: { label: "Próximo", variant: "warning" },
    al_dia: { label: "Al día", variant: "success" },
    vencido: { label: "Vencido", variant: "danger" },
};

export function PagosProximos() {
    // TODO: conectar a endpoint real cuando exista el módulo de pagos
    const pagos = PAGOS_PROXIMOS;

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
            <h2 className="mb-4 text-base font-bold text-slate-900">
                Pagos Próximos
            </h2>

            {pagos.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                    No hay pagos programados.
                </p>
            ) : (
                <div className="-mx-1 overflow-x-auto">
                    <table className="w-full min-w-[420px] border-collapse px-1 text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/60">
                                <th className="px-3 py-2.5 text-left font-semibold text-slate-500">
                                    Cliente
                                </th>
                                <th className="px-3 py-2.5 text-left font-semibold text-slate-500">
                                    Fecha
                                </th>
                                <th className="px-3 py-2.5 text-right font-semibold text-slate-500">
                                    Monto
                                </th>
                                <th className="px-3 py-2.5 text-right font-semibold text-slate-500">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pagos.map((pago) => {
                                const estado = ESTADOS[pago.estado];
                                return (
                                    <tr key={pago.id}>
                                        <td className="px-3 py-3 font-semibold text-slate-900">
                                            {pago.cliente}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                                            {pago.fecha}
                                        </td>
                                        <td className="px-3 py-3 text-right font-bold whitespace-nowrap text-slate-900">
                                            {pago.monto}
                                        </td>
                                        <td className="px-3 py-3 text-right">
                                            <Badge variant={estado.variant}>{estado.label}</Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
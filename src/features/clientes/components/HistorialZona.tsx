import { useEffect, useState } from "react";

import { ArrowRight } from "lucide-react";

import { Spinner } from "../../../shared/ui";

import { esZonaEspecial } from "../../../shared/constants/zonas";

import { obtenerHistorialZona } from "../api/clientes.api";

import type { CambioZona } from "../types";

export function HistorialZona({ idCliente }: { idCliente: number }) {

    const [historial, setHistorial] = useState<CambioZona[]>([]);

    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        let cancelado = false;

        obtenerHistorialZona(idCliente)

            .then((datos) => {

                if (!cancelado) setHistorial(datos);

            })

            .catch(() => {

                // Sin historial la sección simplemente no aparece.

            })

            .finally(() => {

                if (!cancelado) setCargando(false);

            });

        return () => {

            cancelado = true;

        };

    }, [idCliente]);

    if (cargando) {

        return (
            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
                <Spinner centered />
            </section>

        );

    }

    // Cliente que nunca se ha movido: no vale la pena una sección vacía.

    if (historial.length === 0) return null;

    return (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
            <h2 className="mb-1 text-base font-bold text-slate-900">

                Historial de zona
            </h2>
            <p className="mb-5 text-sm text-slate-500">

                Movimientos registrados de zona y sector.
            </p>

            <ol className="flex flex-col">

                {historial.map((c, i) => (
                    <li

                        key={c.id}

                        className={`flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between ${i < historial.length - 1 ? "border-b border-slate-100" : "pb-0"

                            }`}
                    >
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <Ubicacion zona={c.zona_anterior} sector={c.sector_anterior} />
                                <ArrowRight size={14} className="text-slate-400" aria-hidden="true" />
                                <Ubicacion zona={c.zona_nueva} sector={c.sector_nuevo} destacada />
                            </div>

                            {c.motivo && (
                                <p className="mt-2 text-sm text-slate-600">{c.motivo}</p>

                            )}
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                            <p className="text-sm text-slate-500">{c.usuario}</p>
                            <p className="text-xs text-slate-400">

                                {new Date(c.fecha).toLocaleString("es-MX", {

                                    dateStyle: "medium",

                                    timeStyle: "short",

                                })}
                            </p>
                        </div>
                    </li>

                ))}
            </ol>
        </section>

    );

}

function Ubicacion({

    zona,

    sector,

    destacada = false,

}: {

    zona: string | null;

    sector: string | null;

    destacada?: boolean;

}) {

    if (!zona) {

        return <span className="text-sm text-slate-400">Sin asignar</span>;

    }

    const especial = esZonaEspecial(zona);

    return (
        <span

            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-semibold ${destacada && especial

                    ? "bg-amber-100 text-amber-800"

                    : destacada

                        ? "bg-slate-900 text-white"

                        : "bg-slate-100 text-slate-700"

                }`}
        >

            {zona}

            {sector ? `-${sector}` : ""}
        </span>

    );

}

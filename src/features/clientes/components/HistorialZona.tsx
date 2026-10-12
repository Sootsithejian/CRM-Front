import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { SeccionLateral, Spinner } from "../../../shared/ui";
import { esZonaEspecial } from "../../../shared/constants/zonas";
import { formatearFechaHora } from "../../../shared/lib/formato";
import { obtenerHistorialZona } from "../api/clientes.api";
import type { CambioZona } from "../types";

/*  Cambios de zona y sector del cliente. Es una sección del PanelLateral
    del detalle, así que cada cambio se apila en vertical. Sin cambios no
    renderiza nada, y si es lo único del panel el panel desaparece.  */
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
            <SeccionLateral titulo="Historial de zona">
                <Spinner centered />
            </SeccionLateral>
        );
    }

    // Cliente que nunca se ha movido: no vale la pena una sección vacía.
    if (historial.length === 0) return null;

    return (
        <SeccionLateral titulo="Historial de zona">
            <ol className="divide-y divide-slate-100">
                {historial.map((c) => (
                    <li key={c.id} className="py-2.5 first:pt-1 last:pb-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <Ubicacion zona={c.zona_anterior} sector={c.sector_anterior} />
                            <ArrowRight size={13} className="text-slate-500" aria-label="a" />
                            <Ubicacion zona={c.zona_nueva} sector={c.sector_nuevo} destacada />
                        </div>
                        {c.motivo && <p className="mt-1.5 text-sm text-slate-600">{c.motivo}</p>}
                        <p className="mt-1 text-xs text-slate-500">
                            {c.usuario} · <span className="tabular-nums">{formatearFechaHora(c.fecha)}</span>
                        </p>
                    </li>
                ))}
            </ol>
        </SeccionLateral>
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
        return <span className="text-sm text-slate-500">Sin asignar</span>;
    }

    const especial = esZonaEspecial(zona);

    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums ${
                destacada && especial
                    ? "bg-amber-100 text-amber-800"
                    : destacada
                      ? "bg-navy-800 text-white"
                      : "bg-slate-100 text-slate-700"
            }`}
        >
            {zona}
            {sector ? `-${sector}` : ""}
        </span>
    );
}

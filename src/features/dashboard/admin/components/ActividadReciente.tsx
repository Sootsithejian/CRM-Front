import { ACTIVIDAD_RECIENTE } from "../mocks";
import type { ActividadMock, TipoActividad } from "../mocks";

const COLOR_PUNTO: Record<TipoActividad, string> = {
    cliente_registrado: "bg-sky-500",
    credito_aprobado: "bg-green-500",
    pago_registrado: "bg-amber-500",
    info_actualizada: "bg-slate-400",
};

export function ActividadReciente() {
    // TODO: conectar a endpoint real cuando exista el módulo de auditoría
    const actividades = ACTIVIDAD_RECIENTE;

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
            <h2 className="mb-4 text-base font-bold text-slate-900">
                Actividad Reciente
            </h2>

            {actividades.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                    Sin actividad registrada.
                </p>
            ) : (
                <ul className="divide-y divide-slate-100">
                    {actividades.map((actividad, i) => (
                        <Fila
                            key={actividad.id}
                            actividad={actividad}
                            destacada={i === 0}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}

function Fila({
    actividad,
    destacada,
}: {
    actividad: ActividadMock;
    destacada: boolean;
}) {
    return (
        <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span
                className={`mt-1.5 size-2 shrink-0 rounded-full ${COLOR_PUNTO[actividad.tipo]}`}
                aria-hidden="true"
            />

            <div className="min-w-0">
                <p
                    className={
                        destacada
                            ? "text-lg leading-snug text-slate-900"
                            : "text-sm leading-snug text-slate-900"
                    }
                >
                    <span className="font-bold">{actividad.persona}</span>
                    <span className="text-slate-500"> — {actividad.descripcion}</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{actividad.hace}</p>
            </div>
        </li>
    );
}
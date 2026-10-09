import { Check } from "lucide-react";
 
const PASOS = [

  "Cliente",

  "Crédito",

  "Aval Principal",

  "Segundo Aval",

  "Confirmación",

];
 
export function PasosSolicitud({ pasoActual }: { pasoActual: number }) {

  return (
<nav

      aria-label="Progreso de la solicitud"

      className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-5 py-4"
>
<ol className="flex min-w-[720px] items-center gap-2">

        {PASOS.map((label, i) => {

          const numero = i + 1;

          const completado = numero < pasoActual;

          const activo = numero === pasoActual;
 
          return (
<li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
<span className="flex items-center gap-2 whitespace-nowrap">
<span

                  className={[

                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",

                    completado

                      ? "bg-green-100 text-green-700"

                      : activo

                        ? "bg-sky-100 text-primary-600"

                        : "bg-slate-100 text-slate-500",

                  ].join(" ")}

                  aria-current={activo ? "step" : undefined}
>

                  {completado ? <Check size={15} strokeWidth={3} /> : numero}
</span>
 
                <span

                  className={[

                    "text-sm font-semibold",

                    completado

                      ? "text-green-700"

                      : activo

                        ? "text-primary-600"

                        : "text-slate-500",

                  ].join(" ")}
>

                  {label}
</span>
</span>
 
              {i < PASOS.length - 1 && (
<span

                  className={`h-px flex-1 ${completado ? "bg-green-300" : "bg-slate-200"}`}

                  aria-hidden="true"

                />

              )}
</li>

          );

        })}
</ol>
</nav>

  );

}
 
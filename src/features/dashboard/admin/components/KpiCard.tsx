import { ArrowDown, ArrowUp } from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Skeleton } from "../../../../shared/ui";
 
type Tono = "green" | "sky" | "amber" | "red" | "violet";
 
const TONOS: Record<Tono, string> = {

  green: "bg-green-100 text-green-600",

  sky: "bg-sky-100 text-sky-600",

  amber: "bg-amber-100 text-amber-600",

  red: "bg-red-100 text-red-600",

  violet: "bg-violet-100 text-violet-600",

};
 
interface KpiCardProps {

  label: string;

  valor: string | null;

  icono: LucideIcon;

  tono: Tono;

  /** Variación porcentual. Omitir si no hay comparativo. */

  delta?: number;

  cargando?: boolean;

}
 
export function KpiCard({

  label,

  valor,

  icono: Icono,

  tono,

  delta,

  cargando = false,

}: KpiCardProps) {

  const positivo = delta !== undefined && delta >= 0;

  const FlechaDelta = positivo ? ArrowUp : ArrowDown;
 
  return (
<div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
<span

        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${TONOS[tono]}`}
>
<Icono size={22} strokeWidth={2} aria-hidden="true" />
</span>
 
      <div className="min-w-0">
<p className="text-sm text-slate-500">{label}</p>
 
        {cargando ? (
<Skeleton className="mt-2 h-7 w-24" />

        ) : (
<div className="flex flex-wrap items-baseline gap-2">
<p className="text-2xl font-bold text-slate-900">

              {valor ?? "—"}
</p>
 
            {delta !== undefined && (
<span

                className={`flex items-center gap-0.5 text-xs font-semibold ${

                  positivo ? "text-green-600" : "text-red-600"

                }`}
>
<FlechaDelta size={12} strokeWidth={3} aria-hidden="true" />

                {positivo ? "+" : ""}

                {delta}%
</span>

            )}
</div>

        )}
</div>
</div>

  );

}
 
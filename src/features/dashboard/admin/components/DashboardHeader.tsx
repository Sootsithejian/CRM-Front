import { fechaLarga, saludoPorHora } from "../lib/saludo";
 
interface DashboardHeaderProps {
  nombre: string;
}
 
export function DashboardHeader({ nombre }: DashboardHeaderProps) {
  const ahora = new Date();
 
  return (
<header className="mb-6">
<h1 className="text-xl font-bold text-slate-900 lg:text-2xl">
        {saludoPorHora(ahora)}, {nombre}
</h1>
<p className="mt-1 text-sm text-slate-500">{fechaLarga(ahora)}</p>
</header>
  );
}
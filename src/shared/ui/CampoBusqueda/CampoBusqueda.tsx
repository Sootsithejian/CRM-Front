import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

/*  Buscador de las barras de filtros. Reemplaza las cinco copias que
    había en los listados. Siempre compacto (44px en celular, 36px en
    escritorio) y con la etiqueta solo para lectores de pantalla: el
    placeholder ya dice qué se busca.  */
interface CampoBusquedaProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "onChange" | "value"> {
  etiqueta: string;
  valor: string;
  onCambiar: (valor: string) => void;
}

export function CampoBusqueda({
  etiqueta,
  valor,
  onCambiar,
  className,
  ...rest
}: CampoBusquedaProps) {
  const id = useId();

  return (
    <div className={`relative flex items-center ${className ?? ""}`}>
      <label htmlFor={id} className="sr-only">
        {etiqueta}
      </label>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 text-slate-500 lg:left-3"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-10 text-base text-slate-900 transition duration-150 placeholder:text-slate-500 hover:border-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/35 focus:outline-none lg:min-h-9 lg:pl-9 lg:text-sm"
        {...rest}
      />
    </div>
  );
}

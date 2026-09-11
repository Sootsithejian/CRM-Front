import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginacionProps {

    pagina: number;

    paginas: number;

    onCambiar: (pagina: number) => void;

}

/** Devuelve las páginas a mostrar, con "…" donde se colapsan. */

function calcularRango(actual: number, total: number): (number | "...")[] {

    if (total <= 7) {

        return Array.from({ length: total }, (_, i) => i + 1);

    }

    if (actual <= 4) return [1, 2, 3, 4, 5, "...", total];

    if (actual >= total - 3) {

        return [1, "...", total - 4, total - 3, total - 2, total - 1, total];

    }

    return [1, "...", actual - 1, actual, actual + 1, "...", total];

}

export function Paginacion({ pagina, paginas, onCambiar }: PaginacionProps) {

    if (paginas <= 1) return null;

    const rango = calcularRango(pagina, paginas);

    const claseBoton =

        "flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition duration-150 disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <nav className="flex items-center gap-1" aria-label="Paginación">
            <button

                type="button"

                onClick={() => onCambiar(pagina - 1)}

                disabled={pagina <= 1}

                className={`${claseBoton} border-slate-200 bg-white text-slate-600 hover:not-disabled:bg-slate-50`}

                aria-label="Página anterior"
            >
                <ChevronLeft size={16} />
            </button>

            {rango.map((p, i) =>

                p === "..." ? (
                    <span key={`gap-${i}`} className="px-1 text-sm text-slate-400">

                        …
                    </span>

                ) : (
                    <button

                        key={p}

                        type="button"

                        onClick={() => onCambiar(p)}

                        aria-current={p === pagina ? "page" : undefined}

                        className={

                            p === pagina

                                ? `${claseBoton} border-primary-500 bg-primary-500 text-white`

                                : `${claseBoton} border-slate-200 bg-white text-slate-600 hover:bg-slate-50`

                        }
                    >

                        {p}
                    </button>

                )

            )}

            <button

                type="button"

                onClick={() => onCambiar(pagina + 1)}

                disabled={pagina >= paginas}

                className={`${claseBoton} border-slate-200 bg-white text-slate-600 hover:not-disabled:bg-slate-50`}

                aria-label="Página siguiente"
            >
                <ChevronRight size={16} />
            </button>
        </nav>

    );

}

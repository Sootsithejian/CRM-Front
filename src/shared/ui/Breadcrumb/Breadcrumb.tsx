import { Link } from "react-router-dom";

import { ChevronRight } from "lucide-react";

interface Miga {

    label: string;

    ruta?: string;

}

export function Breadcrumb({ items }: { items: Miga[] }) {

    return (
        <nav aria-label="Ruta de navegación" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm">

                {items.map((item, i) => {

                    const ultimo = i === items.length - 1;

                    return (
                        <li key={item.label} className="flex items-center gap-1">

                            {item.ruta && !ultimo ? (
                                <Link to={item.ruta} className="text-slate-500 no-underline hover:text-slate-900 hover:underline">

                                    {item.label}
                                </Link>

                            ) : (
                                <span className={ultimo ? "font-semibold text-slate-900" : "text-slate-500"}>

                                    {item.label}
                                </span>

                            )}

                            {!ultimo && <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />}
                        </li>

                    );

                })}
            </ol>
        </nav>

    );

}

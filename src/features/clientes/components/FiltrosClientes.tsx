import { Search } from "lucide-react";

import { Button, Select } from "../../../shared/ui";

import { useCatalogos } from "../hooks/useCatalogos";

interface FiltrosProps {

    search: string;

    zona: string;

    sector: string;

    onSearch: (v: string) => void;

    onZona: (v: string) => void;

    onSector: (v: string) => void;

    onLimpiar: () => void;

}

export function FiltrosClientes({

    search,

    zona,

    sector,

    onSearch,

    onZona,

    onSector,

    onLimpiar,

}: FiltrosProps) {

    const { zonas, sectores } = useCatalogos();

    return (
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
                <div className="flex flex-col gap-2">
                    <label

                        className="text-sm font-medium text-slate-900"

                        htmlFor="busqueda-clientes"
                    >

                        Búsqueda rápida
                    </label>
                    <div className="relative flex items-center">
                        <Search

                            size={18}

                            className="pointer-events-none absolute left-4 text-slate-400"

                            aria-hidden="true"

                        />
                        <input

                            id="busqueda-clientes"

                            type="search"

                            value={search}

                            onChange={(e) => onSearch(e.target.value)}

                            placeholder="Buscar cliente por nombre, número de cliente, CURP o teléfono..."

                            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pr-4 pl-11 text-base text-slate-900 transition duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/35 focus:outline-none"

                        />
                    </div>
                </div>

                <Select

                    label="Zona"

                    value={zona}

                    onChange={(e) => onZona(e.target.value)}

                    placeholder="Todas las zonas"

                    opciones={zonas

                        .filter((z): z is string => Boolean(z))

                        .map((z) => ({ valor: z, etiqueta: z }))}

                />

                <Select

                    label="Sector"

                    value={sector}

                    onChange={(e) => onSector(e.target.value)}

                    placeholder="Todos los sectores"

                    opciones={sectores

                        .filter((s): s is string => Boolean(s))

                        .map((s) => ({ valor: s, etiqueta: s }))}

                />

                <div className="flex items-end gap-3">
                    <Button variant="secondary" onClick={onLimpiar}>

                        Limpiar
                    </Button>
                </div>
            </div>
        </section>

    );

}

import { Button, CampoBusqueda, Select } from "../../../shared/ui";
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
    const hayFiltros = Boolean(search || zona || sector);

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,1fr)_160px_160px_auto]">
            <CampoBusqueda
                className="col-span-2 lg:col-span-1"
                etiqueta="Buscar cliente"
                valor={search}
                onCambiar={onSearch}
                placeholder="Nombre, número de cliente, CURP o teléfono…"
            />

            <Select
                label="Zona"
                etiquetaOculta
                compacto
                value={zona}
                onChange={(e) => onZona(e.target.value)}
                placeholder="Todas las zonas"
                opciones={zonas
                    .filter((z): z is string => Boolean(z))
                    .map((z) => ({ valor: z, etiqueta: `Zona ${z}` }))}
            />

            <Select
                label="Sector"
                etiquetaOculta
                compacto
                value={sector}
                onChange={(e) => onSector(e.target.value)}
                placeholder="Todos los sectores"
                opciones={sectores
                    .filter((s): s is string => Boolean(s))
                    .map((s) => ({ valor: s, etiqueta: `Sector ${s}` }))}
            />

            {hayFiltros && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="col-span-2 justify-self-start lg:col-span-1 lg:self-center"
                    onClick={onLimpiar}
                >
                    Limpiar filtros
                </Button>
            )}
        </div>
    );
}

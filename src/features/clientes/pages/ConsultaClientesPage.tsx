import { useMemo, useState } from "react";

import { Alert, Breadcrumb, EncabezadoListado, PanelTabla, PieTabla } from "../../../shared/ui";

import { useDebounce } from "../../../shared/hooks/useDebounce";

import { useAuth } from "../../auth/hooks/useAuth";

import { ROLES } from "../../../shared/constants/roles";

import { FiltrosClientes } from "../components/FiltrosClientes";

import { TablaClientes } from "../components/TablaClientes";

import { useClientes } from "../hooks/useClientes";

const LIMITE = 25;

export function ConsultaClientesPage() {

    const { sesion } = useAuth();

    const [search, setSearch] = useState("");

    const [zona, setZona] = useState("");

    const [sector, setSector] = useState("");

    const [pagina, setPagina] = useState(1);

    const searchDiferido = useDebounce(search, 400);

    const filtros = useMemo(

        () => ({

            search: searchDiferido || undefined,

            zona: zona || undefined,

            sector: sector || undefined,

            pagina,

            limite: LIMITE,

        }),

        [searchDiferido, zona, sector, pagina]

    );

    const { clientes, total, paginas, cargando, error } = useClientes(filtros);

    /* Cualquier cambio de filtro vuelve a la página 1: si estás en la
  
       página 5 y filtras a 2 resultados, verías una tabla vacía. */

    const cambiarFiltro = (fn: (v: string) => void) => (valor: string) => {

        fn(valor);

        setPagina(1);

    };

    const limpiar = () => {

        setSearch("");

        setZona("");

        setSector("");

        setPagina(1);

    };

    const puedeEditar =

        sesion?.rol === ROLES.ADMINISTRADOR ||

        sesion?.rol === ROLES.GERENTE_ZONA ||

        sesion?.rol === ROLES.PROMOTOR;

    return (
        <>
            <Breadcrumb

                items={[{ label: "Inicio", ruta: "/inicio" }, { label: "Consulta de Clientes" }]}

            />

            <EncabezadoListado titulo="Clientes" total={cargando ? null : total} />

            {error && (
                <div className="mb-6">
                    <Alert variant="error" title="Error al cargar">
                        {error}
                    </Alert>
                </div>
            )}

            <PanelTabla
                filtros={
                    <FiltrosClientes
                        search={search}
                        zona={zona}
                        sector={sector}
                        onSearch={cambiarFiltro(setSearch)}
                        onZona={cambiarFiltro(setZona)}
                        onSector={cambiarFiltro(setSector)}
                        onLimpiar={limpiar}
                    />
                }
                pie={
                    !cargando && (
                        <PieTabla
                            pagina={pagina}
                            paginas={paginas}
                            total={total}
                            limite={LIMITE}
                            sustantivo="clientes"
                            onCambiar={setPagina}
                        />
                    )
                }
            >
                <TablaClientes
                    clientes={clientes}
                    cargando={cargando}
                    puedeEditar={puedeEditar}
                />
            </PanelTabla>
        </>

    );

}

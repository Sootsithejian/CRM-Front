import { useMemo, useState } from "react";

import { Alert, Breadcrumb, Paginacion } from "../../../shared/ui";

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

    const desde = total === 0 ? 0 : (pagina - 1) * LIMITE + 1;

    const hasta = Math.min(pagina * LIMITE, total);

    return (
        <>
            <Breadcrumb

                items={[{ label: "Inicio", ruta: "/inicio" }, { label: "Consulta de Clientes" }]}

            />

            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">

                    Consulta de Clientes
                </h1>
                <p className="mt-1 text-slate-500">

                    Busca, analiza y gestiona los expedientes y solicitudes de la cartera de

                    clientes.
                </p>
            </header>

            <FiltrosClientes

                search={search}

                zona={zona}

                sector={sector}

                onSearch={cambiarFiltro(setSearch)}

                onZona={cambiarFiltro(setZona)}

                onSector={cambiarFiltro(setSector)}

                onLimpiar={limpiar}

            />

            {error && (
                <div className="mb-6">
                    <Alert variant="error" title="Error al cargar">

                        {error}
                    </Alert>
                </div>

            )}

            <TablaClientes

                clientes={clientes}

                cargando={cargando}

                puedeEditar={puedeEditar}

            />

            {!cargando && total > 0 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row">
                    <p className="text-sm text-slate-500">

                        Mostrando <span className="font-semibold text-slate-900">{desde} - {hasta}</span>{" "}

                        de <span className="font-semibold text-slate-900">{total}</span> clientes

                        registrados
                    </p>
                    <Paginacion pagina={pagina} paginas={paginas} onCambiar={setPagina} />
                </div>

            )}
        </>

    );

}

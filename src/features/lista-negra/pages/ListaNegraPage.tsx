import { useMemo, useState } from "react";

import { Link } from "react-router-dom";


import {
    Alert,
    EncabezadoListado,
    CampoBusqueda,
    Breadcrumb,
    Button,
    Fila,
    PanelTabla,
    PieTabla,
    Select,
    Tabla,
    TablaCargando,
    TablaVacia,
    Td,
} from "../../../shared/ui";
import type { ColumnaTabla } from "../../../shared/ui";

import { useDebounce } from "../../../shared/hooks/useDebounce";

import { useAuth } from "../../auth/hooks/useAuth";

import { ROLES } from "../../../shared/constants/roles";

import { useListaNegra } from "../hooks/useListaNegra";

import { ModalRetirar } from "../components/ModalRetirar";

import type { RegistroListaNegra } from "../types";

const LIMITE = 25;

const COLUMNAS: ColumnaTabla[] = [
    { titulo: "Persona" },
    { titulo: "CURP" },
    { titulo: "Nº cliente", alinear: "der" },
    { titulo: "Motivo" },
    { titulo: "Registró" },
    { titulo: "Fecha" },
    { titulo: "Estado" },
    { titulo: "Acciones", alinear: "der", oculto: true },
];

export function ListaNegraPage() {

    const { sesion } = useAuth();

    const [search, setSearch] = useState("");

    const [activa, setActiva] = useState<"true" | "false">("true");

    const [pagina, setPagina] = useState(1);

    const [aRetirar, setARetirar] = useState<RegistroListaNegra | null>(null);

    const [exito, setExito] = useState<string | null>(null);

    const searchDiferido = useDebounce(search, 400);

    const filtros = useMemo(

        () => ({

            search: searchDiferido || undefined,

            activa,

            pagina,

            limite: LIMITE,

        }),

        [searchDiferido, activa, pagina]

    );

    const { registros, total, paginas, cargando, error, recargar } =

        useListaNegra(filtros);

    // Solo el administrador puede retirar (igual que el backend).

    const puedeRetirar = sesion?.rol === ROLES.ADMINISTRADOR;

    const alRetirar = () => {

        setARetirar(null);

        setExito("La persona fue retirada de la lista negra.");

        recargar();

    };

    return (
        <>
            <Breadcrumb

                items={[

                    { label: "Inicio", ruta: "/inicio" },

                    { label: "Clientes", ruta: "/clientes" },

                    { label: "Lista negra" },

                ]}

            />

            <EncabezadoListado titulo="Lista negra" total={cargando ? null : total} />

            {exito && (
                <div className="mb-6">
                    <Alert variant="success" onDismiss={() => setExito(null)}>

                        {exito}
                    </Alert>
                </div>

            )}

            {error && (
                <div className="mb-6">
                    <Alert variant="error" title="Error al cargar">
                        {error}
                    </Alert>
                </div>
            )}

            <PanelTabla
                filtros={
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_200px]">
                        <CampoBusqueda
                            etiqueta="Buscar en lista negra"
                            valor={search}
                            onCambiar={(v) => {
                                setSearch(v);
                                setPagina(1);
                            }}
                            placeholder="Nombre, CURP, número de cliente o teléfono…"
                        />
                        <Select
                            label="Estado"
                            etiquetaOculta
                            compacto
                            value={activa}
                            onChange={(e) => {
                                setActiva(e.target.value as "true" | "false");
                                setPagina(1);
                            }}
                            opciones={[
                                { valor: "true", etiqueta: "Vetos activos" },
                                { valor: "false", etiqueta: "Incluir histórico" },
                            ]}
                        />
                    </div>
                }
                pie={
                    !cargando && (
                        <PieTabla
                            pagina={pagina}
                            paginas={paginas}
                            total={total}
                            limite={LIMITE}
                            sustantivo="registros"
                            onCambiar={setPagina}
                        />
                    )
                }
            >
                {cargando ? (
                    <TablaCargando />
                ) : registros.length === 0 ? (
                    <TablaVacia titulo="Sin registros">
                        {search
                            ? "Ninguna persona coincide con la búsqueda."
                            : "No hay personas en lista negra."}
                    </TablaVacia>
                ) : (
                    <Tabla columnas={COLUMNAS} anchoMinimo="min-w-[960px]">
                        {registros.map((r) => (
                            <Fila key={r.id}>
                                <Td className="font-medium text-slate-900">{r.nombre}</Td>
                                <Td className="font-mono text-[13px] whitespace-nowrap text-slate-600">
                                    {r.curp ?? <span className="font-sans text-slate-500">—</span>}
                                </Td>
                                <Td numerico>
                                    {r.id_cliente ? (
                                        <Link
                                            to={`/clientes/${r.id_cliente}`}
                                            className="font-medium text-primary-700 hover:underline"
                                        >
                                            {r.numero_cliente}
                                        </Link>
                                    ) : (
                                        <span className="text-slate-500" title="Solo figura como aval">
                                            No es cliente
                                        </span>
                                    )}
                                </Td>
                                <Td className="max-w-xs text-slate-700">{r.motivo}</Td>
                                <Td className="whitespace-nowrap text-slate-600">{r.usuario_alta}</Td>
                                <Td className="whitespace-nowrap text-slate-600 tabular-nums">
                                    {new Date(r.fecha_alta).toLocaleDateString("es-MX", {
                                        dateStyle: "medium",
                                    })}
                                </Td>
                                <Td>
                                    {/* Toda la lista son vetos: el rojo en cada fila no
                                        distingue nada. */}
                                    {r.activa ? (
                                        <span className="text-slate-700">Activo</span>
                                    ) : (
                                        <span className="text-slate-500">Retirado</span>
                                    )}
                                </Td>
                                <Td alinear="der">
                                    {r.activa && puedeRetirar && (
                                        <Button size="sm" variant="secondary" onClick={() => setARetirar(r)}>
                                            Retirar
                                        </Button>
                                    )}
                                </Td>
                            </Fila>
                        ))}
                    </Tabla>
                )}
            </PanelTabla>

            <ModalRetirar

                registro={aRetirar}

                onCerrar={() => setARetirar(null)}

                onExito={alRetirar}

            />
        </>

    );

}

import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { Search } from "lucide-react";

import {

    Alert,

    Badge,

    Breadcrumb,

    Button,

    Paginacion,

    Select,

    Spinner,

} from "../../../shared/ui";

import { useDebounce } from "../../../shared/hooks/useDebounce";

import { useAuth } from "../../auth/hooks/useAuth";

import { ROLES } from "../../../shared/constants/roles";

import { useListaNegra } from "../hooks/useListaNegra";

import { ModalRetirar } from "../components/ModalRetirar";

import type { RegistroListaNegra } from "../types";

const LIMITE = 25;

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

    const desde = total === 0 ? 0 : (pagina - 1) * LIMITE + 1;

    const hasta = Math.min(pagina * LIMITE, total);

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

            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">

                    Lista negra
                </h1>
                <p className="mt-1 text-slate-500">

                    Personas vetadas para registrarse como cliente o como aval.
                </p>
            </header>

            {exito && (
                <div className="mb-6">
                    <Alert variant="success" onDismiss={() => setExito(null)}>

                        {exito}
                    </Alert>
                </div>

            )}

            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-900" htmlFor="buscar-ln">

                            Búsqueda rápida
                        </label>
                        <div className="relative flex items-center">
                            <Search

                                size={18}

                                className="pointer-events-none absolute left-4 text-slate-400"

                                aria-hidden="true"

                            />
                            <input

                                id="buscar-ln"

                                type="search"

                                value={search}

                                onChange={(e) => {

                                    setSearch(e.target.value);

                                    setPagina(1);

                                }}

                                placeholder="Buscar por nombre, CURP, número de cliente o teléfono…"

                                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pr-4 pl-11 text-base text-slate-900 transition duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/35 focus:outline-none"

                            />
                        </div>
                    </div>

                    <Select

                        label="Estado"

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
            </section>

            {error && (
                <div className="mb-6">
                    <Alert variant="error" title="Error al cargar">

                        {error}
                    </Alert>
                </div>

            )}

            {cargando ? (
                <div className="rounded-xl border border-slate-200 bg-white py-16">
                    <Spinner centered size="lg" />
                </div>

            ) : registros.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
                    <p className="font-medium text-slate-900">Sin registros</p>
                    <p className="mt-1 text-sm text-slate-500">

                        {search

                            ? "Ninguna persona coincide con la búsqueda."

                            : "No hay personas en lista negra."}
                    </p>
                </div>

            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full min-w-[860px] border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200">

                                {["Persona", "Nº Cliente", "Motivo", "Registró", "Estado", ""].map(

                                    (h, i) => (
                                        <th

                                            key={h || i}

                                            className={`px-5 py-3.5 text-xs font-semibold tracking-wide text-slate-500 uppercase ${i === 5 ? "text-right" : "text-left"

                                                }`}
                                        >

                                            {h}
                                        </th>

                                    )

                                )}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {registros.map((r) => (
                                <tr key={r.id} className="transition duration-150 hover:bg-slate-50">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-slate-900">{r.nombre}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">

                                            {r.curp ?? "Sin CURP"}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 whitespace-nowrap">

                                        {r.id_cliente ? (
                                            <Link

                                                to={`/clientes/${r.id_cliente}`}

                                                className="font-medium text-primary-600 hover:underline"
                                            >

                                                {r.numero_cliente}
                                            </Link>

                                        ) : (
                                            <span className="text-slate-400" title="Solo figura como aval">

                                                No es cliente
                                            </span>

                                        )}
                                    </td>

                                    <td className="max-w-xs px-5 py-4 text-slate-700">{r.motivo}</td>

                                    <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                                        <p>{r.usuario_alta}</p>
                                        <p className="text-xs text-slate-400">

                                            {new Date(r.fecha_alta).toLocaleDateString("es-MX", {

                                                dateStyle: "medium",

                                            })}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">

                                        {r.activa ? (
                                            <Badge variant="danger">Activo</Badge>

                                        ) : (
                                            <Badge variant="neutral">Retirado</Badge>

                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-right">

                                        {r.activa && puedeRetirar && (
                                            <Button size="sm" variant="secondary" onClick={() => setARetirar(r)}>

                                                Retirar
                                            </Button>

                                        )}
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>

            )}

            {!cargando && total > 0 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row">
                    <p className="text-sm text-slate-500">

                        Mostrando{" "}
                        <span className="font-semibold text-slate-900">{desde} - {hasta}</span> de{" "}
                        <span className="font-semibold text-slate-900">{total}</span> registros
                    </p>
                    <Paginacion pagina={pagina} paginas={paginas} onCambiar={setPagina} />
                </div>

            )}

            <ModalRetirar

                registro={aRetirar}

                onCerrar={() => setARetirar(null)}

                onExito={alRetirar}

            />
        </>

    );

}

import { useNavigate, useParams, useLocation } from "react-router-dom";

import { ChevronLeft } from "lucide-react";

import { Alert, Breadcrumb, Button, Spinner } from "../../../shared/ui";

import { useAuth } from "../../auth/hooks/useAuth";

import { ROLES } from "../../../shared/constants/roles";

import { useClienteDetalle } from "../hooks/useClienteDetalle";

import { useState } from "react";

import { ModalVetar } from "../../lista-negra/components/ModalVetar";

import { HistorialZona } from "../components/HistorialZona";

export function DetalleClientePage() {

    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const location = useLocation();
    
    const [vetando, setVetando] = useState(false);
    const [vetado, setVetado] = useState(false);

    const mensajeExito = 
    (vetado && "La persona fue agregada a la lista negra.") ||
    (location.state as { mensaje?: string } | null)?.mensaje;

    const { sesion } = useAuth();



    const { detalle, cargando, error, recargar } = useClienteDetalle(Number(id));

    const puedeVetar =
        sesion?.rol === ROLES.ADMINISTRADOR;

    const puedeEditar =

        sesion?.rol === ROLES.ADMINISTRADOR ||

        sesion?.rol === ROLES.GERENTE_ZONA ||

        sesion?.rol === ROLES.PROMOTOR;

    const migas = [

        { label: "Inicio", ruta: "/inicio" },

        { label: "Consulta de Clientes", ruta: "/clientes" },

        { label: "Detalle del Cliente" },

    ];

    if (cargando) {

        return (
            <>
                <Breadcrumb items={migas} />
                <div className="rounded-xl border border-slate-200 bg-white py-20">
                    <Spinner centered size="lg" />
                </div>
            </>

        );

    }

    if (error || !detalle) {

        return (
            <>
                <Breadcrumb items={migas} />
                <Alert variant="error" title="No se pudo abrir el cliente">

                    {error ?? "Error desconocido."}
                </Alert>
                <div className="mt-4">
                    <Button variant="secondary" onClick={() => navigate("/clientes")}>

                        Volver a la consulta
                    </Button>
                </div>
            </>

        );

    }

    const { cliente, persona, domicilios } = detalle;

    const dom = domicilios[0] ?? null;

    return (
        <>
            <Breadcrumb items={migas} />

            <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">

                        Detalle del Cliente
                    </h1>
                    <p className="mt-1 text-slate-500">

                        Información completa del cliente seleccionado
                    </p>
                </div>

                <Button variant="secondary" onClick={() => navigate("/clientes")}>
                    <ChevronLeft size={16} aria-hidden="true" />

                    Regresar
                </Button>
            </header>
            {mensajeExito && (
                <div className="mb-6">
                    <Alert variant="success">{mensajeExito}</Alert>
                </div>
            )}
            <section className="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                    <Campo label="En lista negra">
                        <span className="flex items-center gap-2">
                            <span

                                className={`size-2 rounded-full ${persona.en_lista_negra ? "bg-accent-500" : "bg-green-500"

                                    }`}

                                aria-hidden="true"

                            />

                            {persona.en_lista_negra ? "SÍ" : "NO"}
                        </span>
                    </Campo>

                    <Campo label="Número de cliente">{cliente.numero_cliente}</Campo>
                    <Campo label="Nombre del cliente">{persona.nombre}</Campo>

                    <Campo label="Zona">{cliente.zona}</Campo>
                    <Campo label="Sector">{cliente.sector}</Campo>
                    <Campo label="Teléfono">{persona.tel_principal}</Campo>

                    <Campo label="Calle">{dom?.calle}</Campo>
                    <Campo label="# Exterior">{dom?.numero_ext}</Campo>
                    <Campo label="Interior">{dom?.numero_int}</Campo>

                    <Campo label="Colonia">{dom?.colonia}</Campo>
                    <Campo label="CURP">{persona.curp}</Campo>
                    <Campo label="Alta">{cliente.usuario_alta}</Campo>
                </div>

                <div className="mt-2 border-t border-slate-100 pt-6">
                    <p className="mb-2 text-xs tracking-wide text-slate-400 uppercase">

                        Observaciones
                    </p>
                    <div className="min-h-12 rounded-lg bg-slate-50 px-4 py-3 text-slate-900">

                        {cliente.observaciones?.trim() || (
                            <span className="text-slate-400">Sin observaciones</span>

                        )}
                    </div>
                </div>
            </section>

            <HistorialZona idCliente={cliente.id}/>

            <div className="mt-6 flex flex-wrap gap-3">
                {!persona.en_lista_negra && (
                  <Button
                    onClick={() => navigate(`/creditos/solicitudes/nueva?cliente=${cliente.id}`)}>    
                      Nuevo Crédito
                </Button>
                )}
                <Button
                    variant="secondary"
                    disabled={!puedeEditar}
                    onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                >
                    Editar Datos
                </Button>
                {puedeVetar && !persona.en_lista_negra && (
                    <Button variant="danger" onClick={() => setVetando(true)}>
                        Agregar a lista negra
                    </Button>
                )}
                {persona.en_lista_negra && (
                    <Button
                    variant="secondary"
                    onClick={() => navigate("/clientes/lista-negra")}
                    >
                        Ver en lista negra
                    </Button>
                )}
            </div>
            <ModalVetar
                abierto={vetando}
                idPersona={persona.id}
                nombre={persona.nombre}
                onCerrar={() => setVetando(false)}
                onExito={() => {
                    setVetando(false);
                    setVetado(true);
                    recargar()
                }}
                />
        </>

    );

}

function Campo({

    label,

    children,

}: {

    label: string;

    children: React.ReactNode;

}) {

    const vacio =

        children === null || children === undefined || children === "";

    return (
        <div className="border-b border-slate-100 py-5">
            <p className="mb-1 text-xs tracking-wide text-slate-400 uppercase">

                {label}
            </p>
            <p className={vacio ? "text-slate-400" : "font-medium text-slate-900"}>

                {vacio ? "—" : children}
            </p>
        </div>

    );

}

import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";

import {
    Alert,
    Badge,
    Breadcrumb,
    Button,
    CabeceraDetalle,
    DataItem,
    DataList,
    DatoContexto,
    PanelLateral,
    SeccionLateral,
    Spinner,
} from "../../../shared/ui";
import { useAuth } from "../../auth/hooks/useAuth";
import { ROLES } from "../../../shared/constants/roles";
import { formatearFechaHora, formatearFechaSolo } from "../../../shared/lib/formato";
import { useClienteDetalle } from "../hooks/useClienteDetalle";
import { ModalVetar } from "../../lista-negra/components/ModalVetar";
import { HistorialZona } from "../components/HistorialZona";
import type { Domicilio } from "../types";

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

    const puedeVetar = sesion?.rol === ROLES.ADMINISTRADOR;
    const puedeEditar =
        sesion?.rol === ROLES.ADMINISTRADOR ||
        sesion?.rol === ROLES.GERENTE_ZONA ||
        sesion?.rol === ROLES.PROMOTOR;

    const migas = [
        { label: "Inicio", ruta: "/inicio" },
        { label: "Clientes", ruta: "/clientes" },
        { label: detalle ? detalle.persona.nombre : "Detalle del cliente" },
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

    const { cliente, persona, domicilios, avala_a } = detalle;
    const dom = domicilios[0] ?? null;
    const zonaSector = `${cliente.zona ?? "—"}-${cliente.sector ?? "—"}`;

    return (
        <>
            <Breadcrumb items={migas} />

            <CabeceraDetalle
                titulo={persona.nombre}
                insignias={persona.en_lista_negra && <Badge variant="danger">Lista negra</Badge>}
                contexto={[
                    <>
                        Cliente <DatoContexto>{cliente.numero_cliente}</DatoContexto>
                    </>,
                    <>
                        Zona <DatoContexto>{zonaSector}</DatoContexto>
                    </>,
                    persona.tel_principal && (
                        <>
                            Tel. <DatoContexto>{persona.tel_principal}</DatoContexto>
                        </>
                    ),
                ]}
                acciones={
                    <>
                        <Button
                            variant="secondary"
                            disabled={!puedeEditar}
                            onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                        >
                            <Pencil size={15} aria-hidden="true" />
                            Editar
                        </Button>
                        {!persona.en_lista_negra && (
                            <Button
                                disabled={!puedeEditar}
                                onClick={() =>
                                    navigate(`/creditos/solicitudes/nueva?cliente=${cliente.id}`)
                                }
                            >
                                <Plus size={16} aria-hidden="true" />
                                Nuevo crédito
                            </Button>
                        )}
                    </>
                }
            />

            {mensajeExito && (
                <div className="mb-6">
                    <Alert variant="success">{mensajeExito}</Alert>
                </div>
            )}

            {/* Lista negra: solo se dice cuando aplica, y con lo que hay que hacer. */}
            {persona.en_lista_negra && (
                <div className="mb-6">
                    <Alert variant="error" title="Persona en lista negra">
                        No puede recibir créditos ni ser aval.{" "}
                        <Link
                            to="/clientes/lista-negra"
                            className="font-medium text-red-800 underline"
                        >
                            Ver en lista negra
                        </Link>
                    </Alert>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
                <section
                    aria-label="Datos del cliente"
                    className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2 lg:p-5"
                >
                    <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                        <DataList titulo="Identidad" compacta>
                            <DataItem label="Nombre">{persona.nombre}</DataItem>
                            <DataItem label="CURP" mono>
                                {persona.curp}
                            </DataItem>
                            {persona.rfc && (
                                <DataItem label="RFC" mono>
                                    {persona.rfc}
                                </DataItem>
                            )}
                            <DataItem label="Nacimiento">
                                {formatearFechaSolo(persona.fecha_nac)}
                            </DataItem>
                            {persona.estado_civil && (
                                <DataItem label="Estado civil">{persona.estado_civil}</DataItem>
                            )}
                            {persona.ocupacion && (
                                <DataItem label="Ocupación">{persona.ocupacion}</DataItem>
                            )}
                        </DataList>

                        <DataList titulo="Domicilio" compacta>
                            <DataItem label="Calle">{calleCompleta(dom)}</DataItem>
                            <DataItem label="Colonia">{dom?.colonia}</DataItem>
                            {dom?.cp && <DataItem label="C.P.">{dom.cp}</DataItem>}
                            {dom?.municipio && (
                                <DataItem label="Municipio">{dom.municipio}</DataItem>
                            )}
                            {dom?.entre_calles && (
                                <DataItem label="Entre calles">{dom.entre_calles}</DataItem>
                            )}
                        </DataList>

                        <DataList titulo="Contacto" compacta>
                            <DataItem label="Teléfono">{persona.tel_principal}</DataItem>
                            {persona.tel_2 && <DataItem label="Teléfono 2">{persona.tel_2}</DataItem>}
                            {persona.tel_3 && <DataItem label="Teléfono 3">{persona.tel_3}</DataItem>}
                            {persona.email && <DataItem label="Correo">{persona.email}</DataItem>}
                        </DataList>

                        <DataList titulo="Operación" compacta>
                            <DataItem label="Nº de cliente">{cliente.numero_cliente}</DataItem>
                            <DataItem label="Zona y sector">{zonaSector}</DataItem>
                            <DataItem label="Alta">{formatearFechaHora(cliente.fecha_alta)}</DataItem>
                            <DataItem label="Dio de alta">{cliente.usuario_alta}</DataItem>
                        </DataList>
                    </div>

                    <div className="mt-6">
                        <h3 className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            Observaciones
                        </h3>
                        {cliente.observaciones?.trim() ? (
                            <p className="text-sm whitespace-pre-line text-slate-900">
                                {cliente.observaciones.trim()}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-500">Sin observaciones.</p>
                        )}
                    </div>
                </section>

                <div className="flex min-w-0 flex-col gap-6">
                    <PanelLateral etiqueta="Relaciones e historial">
                    {avala_a.length > 0 && (
                        <SeccionLateral titulo="Es aval de">
                            <ul className="divide-y divide-slate-100 text-sm">
                                {avala_a.map((a) => (
                                    <li
                                        key={a.id_relacion}
                                        className="flex items-baseline justify-between gap-3 py-1.5"
                                    >
                                        <Link
                                            to={`/clientes/${a.id_cliente}`}
                                            className="min-w-0 font-medium text-slate-900 hover:text-primary-700"
                                        >
                                            {a.nombre}
                                        </Link>
                                        <span className="shrink-0 text-xs text-slate-500">
                                            {a.parentesco ?? `Cliente ${a.numero_cliente}`}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </SeccionLateral>
                    )}

                    <HistorialZona idCliente={cliente.id} />
                    </PanelLateral>

                    {/* Acción destructiva: aparte a propósito, no dentro del panel. */}

                    {puedeVetar && !persona.en_lista_negra && (
                        <div className="rounded-xl border border-red-200 p-4">
                            <h2 className="text-sm font-semibold text-slate-900">Lista negra</h2>
                            <p className="mt-1 mb-3 text-sm text-slate-600">
                                Veta a la persona como cliente y como aval. Solo un administrador
                                puede retirarla después.
                            </p>
                            <Button variant="danger" size="sm" onClick={() => setVetando(true)}>
                                Agregar a lista negra
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <ModalVetar
                abierto={vetando}
                idPersona={persona.id}
                nombre={persona.nombre}
                onCerrar={() => setVetando(false)}
                onExito={() => {
                    setVetando(false);
                    setVetado(true);
                    recargar();
                }}
            />
        </>
    );
}

/** "Hidalgo 123 int. 4": la calle con sus números, en una sola línea. */
function calleCompleta(dom: Domicilio | null): string | null {
    if (!dom) return null;
    return [dom.calle, dom.numero_ext, dom.numero_int && `int. ${dom.numero_int}`]
        .filter(Boolean)
        .join(" ");
}

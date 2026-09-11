import { useState } from "react";

import { Alert, Button, Modal, Textarea } from "../../../shared/ui";

import { retirarDeListaNegra } from "../api/listaNegra.api";

import type { RegistroListaNegra } from "../types";

interface ModalRetirarProps {

    registro: RegistroListaNegra | null;

    onCerrar: () => void;

    onExito: () => void;

}

export function ModalRetirar({ registro, onCerrar, onExito }: ModalRetirarProps) {

    const [motivo, setMotivo] = useState("");

    const [enviando, setEnviando] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const cerrar = () => {

        setMotivo("");

        setError(null);

        onCerrar();

    };

    const confirmar = async () => {

        if (!registro) return;

        if (!motivo.trim()) {

            setError("Escribe el motivo de la baja.");

            return;

        }

        setEnviando(true);

        setError(null);

        try {

            await retirarDeListaNegra(registro.id, motivo.trim());

            setMotivo("");

            onExito();

        } catch (e: any) {

            setError(

                e?.response?.data?.message ??

                "No se pudo retirar de la lista negra. Intenta de nuevo."

            );

            setEnviando(false);

            return;

        }

        setEnviando(false);

    };

    return (
        <Modal

            abierto={registro !== null}

            titulo="Retirar de lista negra"

            descripcion={

                registro

                    ? `${registro.nombre} podrá volver a registrarse como cliente o aval.`

                    : undefined

            }

            onCerrar={cerrar}
        >

            {registro && (
                <>
                    <div className="mb-5 rounded-lg bg-slate-50 px-4 py-3 text-sm">
                        <p className="text-slate-500">Motivo del veto original</p>
                        <p className="mt-1 text-slate-900">{registro.motivo}</p>
                        <p className="mt-2 text-xs text-slate-400">

                            Registrado por {registro.usuario_alta} el{" "}

                            {new Date(registro.fecha_alta).toLocaleDateString("es-MX", {

                                dateStyle: "medium",

                            })}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4">
                            <Alert variant="error">{error}</Alert>
                        </div>

                    )}

                    <Textarea

                        label="Motivo de la baja"

                        required

                        rows={3}

                        value={motivo}

                        onChange={(e) => setMotivo(e.target.value)}

                        placeholder="Explica por qué se retira el veto…"

                        hint="Queda registrado en el historial junto con tu usuario."

                        disabled={enviando}

                    />

                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        <Button variant="secondary" onClick={cerrar} disabled={enviando}>

                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={confirmar} loading={enviando}>

                            Retirar de lista negra
                        </Button>
                    </div>
                </>

            )}
        </Modal>

    );

}

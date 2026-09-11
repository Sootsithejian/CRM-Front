import { useState } from "react";

import { Alert, Button, Modal, Textarea } from "../../../shared/ui";

import { agregarAListaNegra } from "../api/listaNegra.api";

interface ModalVetarProps {

    abierto: boolean;

    idPersona: number;

    nombre: string;

    onCerrar: () => void;

    onExito: () => void;

}

export function ModalVetar({

    abierto,

    idPersona,

    nombre,

    onCerrar,

    onExito,

}: ModalVetarProps) {

    const [motivo, setMotivo] = useState("");

    const [enviando, setEnviando] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const cerrar = () => {

        setMotivo("");

        setError(null);

        onCerrar();

    };

    const confirmar = async () => {

        if (!motivo.trim()) {

            setError("Escribe el motivo del veto.");

            return;

        }

        setEnviando(true);

        setError(null);

        try {

            await agregarAListaNegra({ id_persona: idPersona, motivo: motivo.trim() });

            setMotivo("");

            onExito();

        } catch (e: any) {

            setError(

                e?.response?.data?.message ??

                "No se pudo agregar a la lista negra. Intenta de nuevo."

            );

        } finally {

            setEnviando(false);

        }

    };

    return (
        <Modal

            abierto={abierto}

            titulo="Agregar a lista negra"

            descripcion={`${nombre} no podrá registrarse como cliente ni figurar como aval mientras el veto esté activo.`}

            onCerrar={cerrar}
        >

            {error && (
                <div className="mb-4">
                    <Alert variant="error">{error}</Alert>
                </div>

            )}

            <Textarea

                label="Motivo"

                required

                rows={3}

                value={motivo}

                onChange={(e) => setMotivo(e.target.value)}

                placeholder="Explica por qué se veta a esta persona…"

                hint="Queda registrado junto con tu usuario y la fecha."

                disabled={enviando}

            />

            <div className="mt-6 flex flex-wrap justify-end gap-3">
                <Button variant="secondary" onClick={cerrar} disabled={enviando}>

                    Cancelar
                </Button>
                <Button variant="danger" onClick={confirmar} loading={enviando}>

                    Agregar a lista negra
                </Button>
            </div>
        </Modal>

    );

}

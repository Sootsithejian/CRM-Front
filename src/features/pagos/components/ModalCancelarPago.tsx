import { useState } from "react";

import { Alert, Button, Modal, Textarea } from "../../../shared/ui";

import { mensajeDeError } from "../../../shared/api/client";

import { formatearFechaSolo, formatearMoneda } from "../../../shared/lib/formato";

import { cancelarPago } from "../api/pagos.api";

import { LARGO_OBSERVACIONES } from "../types";
import type { PagoDetalle, RespuestaCancelacionPago } from "../types";

interface ModalCancelarPagoProps {
  pago: PagoDetalle | null;
  onCerrar: () => void;
  onExito: (respuesta: RespuestaCancelacionPago) => void;
}

/** Solo administrador. Un pago no se borra: se cancela con motivo. */
export function ModalCancelarPago({ pago, onCerrar, onExito }: ModalCancelarPagoProps) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cerrar = () => {
    setMotivo("");
    setError(null);
    onCerrar();
  };

  const confirmar = async () => {
    if (!pago) return;

    if (!motivo.trim()) {
      setError("Escribe el motivo de la cancelación.");
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      const respuesta = await cancelarPago(pago.id, motivo.trim());
      setMotivo("");
      onExito(respuesta);
    } catch (e) {
      setError(mensajeDeError(e, "No se pudo cancelar el pago. Intenta de nuevo."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      abierto={pago !== null}
      titulo="Cancelar pago"
      descripcion={
        pago
          ? `${formatearMoneda(pago.monto)} del ${formatearFechaSolo(pago.fecha)} al crédito ${pago.numero_credito}`
          : undefined
      }
      onCerrar={cerrar}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-600">
          El pago deja de contar para el saldo. Si fue el que liquidó el crédito y sin él ya no
          alcanza, el crédito se reactiva. No se puede deshacer.
        </p>

        {pago?.corte?.estatus === "EJECUTADO" && (
          <Alert variant="warning">
            Este pago ya entró en el corte del {formatearFechaSolo(pago.corte.fecha_corte)}. Los
            fallos de ese corte no se recalculan; si el resultado cambia, hay que revertir el corte.
          </Alert>
        )}

        {error && <Alert variant="error">{error}</Alert>}

        <Textarea
          label="Motivo"
          required
          rows={3}
          maxLength={LARGO_OBSERVACIONES}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ej. Se capturó dos veces"
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={cerrar} disabled={enviando}>
            Volver
          </Button>
          <Button variant="danger" onClick={confirmar} loading={enviando}>
            Cancelar pago
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import { useState } from "react";
import { Alert, Button, Modal, Textarea } from "../../../shared/ui";
import { dictaminarSolicitud } from "../api/creditos.api";
import type { SolicitudListado } from "../types";
 
type Accion = "preaprobar" | "aprobar" | "rechazar";
 
const TEXTOS: Record<Accion, { titulo: string; boton: string; variante: "primary" | "danger" }> = {
  preaprobar: { titulo: "Preaprobar solicitud", boton: "Preaprobar", variante: "primary" },
  aprobar: { titulo: "Aprobar y generar crédito", boton: "Aprobar", variante: "primary" },
  rechazar: { titulo: "Rechazar solicitud", boton: "Rechazar", variante: "danger" },
};
 
interface ModalDictamenProps {
  solicitud: SolicitudListado | null;
  accion: Accion;
  onCerrar: () => void;
  onExito: (mensaje: string) => void;
}
 
export function ModalDictamen({
  solicitud,
  accion,
  onCerrar,
  onExito,
}: ModalDictamenProps) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const t = TEXTOS[accion];
  const esRechazo = accion === "rechazar";
 
  const cerrar = () => {
    setMotivo("");
    setError(null);
    onCerrar();
  };
 
  const confirmar = async () => {
    if (!solicitud) return;
 
    if (esRechazo && !motivo.trim()) {
      setError("Indica el motivo del rechazo.");
      return;
    }
 
    setEnviando(true);
    setError(null);
 
    try {
      const res = await dictaminarSolicitud(
        solicitud.id,
        accion,
        motivo.trim() || undefined
      );
      setMotivo("");
      onExito(
        res?.credito
          ? `Crédito ${res.credito.numero_credito} generado correctamente.`
          : res?.message ?? "Solicitud actualizada."
      );
    } catch (e: any) {
      setError(
        e?.response?.data?.message ??
          "No se pudo completar la acción. Intenta de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  };
 
  return (
<Modal
      abierto={solicitud !== null}
      titulo={t.titulo}
      descripcion={
        solicitud
          ? `Folio ${solicitud.folio} — ${solicitud.nombre}`
          : undefined
      }
      onCerrar={cerrar}
>
      {solicitud && (
<>
<div className="mb-5 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 px-4 py-3 text-sm">
<Dato label="Monto" valor={`$${Number(solicitud.monto).toLocaleString("es-MX")}`} />
<Dato label="Plazo" valor={`${solicitud.plazo} semanas`} />
<Dato label="Pago semanal" valor={`$${Number(solicitud.pago_fijo).toLocaleString("es-MX")}`} />
<Dato label="Recibe" valor={`$${Number(solicitud.monto_entregar).toLocaleString("es-MX")}`} />
</div>
 
          {accion === "aprobar" && (
<div className="mb-5">
<Alert variant="warning">
                Al aprobar se genera el crédito con su número definitivo. Esta
                acción no se puede deshacer desde aquí.
</Alert>
</div>
          )}
 
          {error && (
<div className="mb-4">
<Alert variant="error">{error}</Alert>
</div>
          )}
 
          <Textarea
            label={esRechazo ? "Motivo del rechazo" : "Comentario (opcional)"}
            required={esRechazo}
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={
              esRechazo
                ? "Explica por qué se rechaza…"
                : "Notas sobre esta decisión…"
            }
            disabled={enviando}
          />
 
          <div className="mt-6 flex flex-wrap justify-end gap-3">
<Button variant="secondary" onClick={cerrar} disabled={enviando}>
              Cancelar
</Button>
<Button variant={t.variante} onClick={confirmar} loading={enviando}>
              {t.boton}
</Button>
</div>
</>
      )}
</Modal>
  );
}
 
function Dato({ label, valor }: { label: string; valor: string }) {
  return (
<div>
<p className="text-xs text-slate-500">{label}</p>
<p className="font-semibold text-slate-900">{valor}</p>
</div>
  );
}
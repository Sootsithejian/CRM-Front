import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "../../../shared/ui";
import { abrirContrato, abrirTarjeton } from "../api/creditos.api";

interface BotonesImpresionProps {
  idCredito: number;
  numeroCredito: number;
}

/*  Tarjetón y contrato, como barra de acciones para la cabecera del
    crédito. "Abrir" va en una pestaña nueva; el ícono de descarga baja
    el PDF.  */
export function BotonesImpresion({
  idCredito,
  numeroCredito,
}: BotonesImpresionProps) {
  const [generando, setGenerando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ejecutar = async (clave: string, fn: () => Promise<void>) => {
    setGenerando(clave);
    setError(null);
    try {
      await fn();
    } catch {
      setError("No se pudo generar el documento. Intenta de nuevo.");
    } finally {
      setGenerando(null);
    }
  };

  const documentos = [
    { clave: "tarjeton", etiqueta: "Tarjetón", abrir: abrirTarjeton },
    { clave: "contrato", etiqueta: "Contrato", abrir: abrirContrato },
  ];

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        {documentos.map((d) => (
          <div key={d.clave} className="flex">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-r-none"
              loading={generando === d.clave}
              disabled={generando !== null}
              onClick={() =>
                ejecutar(d.clave, () => d.abrir(idCredito, numeroCredito))
              }
            >
              <Printer size={14} aria-hidden="true" />
              {d.etiqueta}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="-ml-px rounded-l-none px-2.5"
              loading={generando === `descarga-${d.clave}`}
              disabled={generando !== null}
              aria-label={`Descargar ${d.etiqueta.toLowerCase()}`}
              title={`Descargar ${d.etiqueta.toLowerCase()}`}
              onClick={() =>
                ejecutar(`descarga-${d.clave}`, () =>
                  d.abrir(idCredito, numeroCredito, true)
                )
              }
            >
              <Download size={14} aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

import { useState } from "react";

import { Download, Printer } from "lucide-react";

import { Alert, Button } from "../../../shared/ui";

import { abrirContrato, abrirTarjeton } from "../api/creditos.api";
 
interface BotonesImpresionProps {

  idCredito: number;

  numeroCredito: number;

}
 
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
 
  return (
<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-1 text-base font-bold text-slate-900">Documentos</h2>
<p className="mb-5 text-sm text-slate-500">

        Tarjetón de pagos y contrato para imprimir y recabar firmas.
</p>
 
      {error && (
<div className="mb-5">
<Alert variant="error" onDismiss={() => setError(null)}>

            {error}
</Alert>
</div>

      )}
 
      <div className="flex flex-wrap gap-3">
<Button

          loading={generando === "tarjeton"}

          disabled={generando !== null}

          onClick={() =>

            ejecutar("tarjeton", () => abrirTarjeton(idCredito, numeroCredito))

          }
>
<Printer size={16} aria-hidden="true" />

          Tarjetón de pagos
</Button>
 
        <Button

          variant="secondary"

          loading={generando === "contrato"}

          disabled={generando !== null}

          onClick={() =>

            ejecutar("contrato", () => abrirContrato(idCredito, numeroCredito))

          }
>
<Printer size={16} aria-hidden="true" />

          Contrato
</Button>
 
        <Button

          variant="ghost"

          disabled={generando !== null}

          onClick={() =>

            ejecutar("descarga-t", () =>

              abrirTarjeton(idCredito, numeroCredito, true)

            )

          }
>
<Download size={16} aria-hidden="true" />

          Descargar tarjetón
</Button>
 
        <Button

          variant="ghost"

          disabled={generando !== null}

          onClick={() =>

            ejecutar("descarga-c", () =>

              abrirContrato(idCredito, numeroCredito, true)

            )

          }
>
<Download size={16} aria-hidden="true" />

          Descargar contrato
</Button>
</div>
</section>

  );

}
 
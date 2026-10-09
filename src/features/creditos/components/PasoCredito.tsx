import { useEffect, useState } from "react";

import { Alert, Button, Input, Select, Spinner, FileInput} from "../../../shared/ui";

import { cotizar, listarPlazos, listarProductos } from "../api/creditos.api";


import type {

  Cotizacion,

  DatosCredito,

  DocumentosPersona,

  PlazoDisponible,

  ProductoCredito,

} from "../types";
 
interface PasoCreditoProps {
  datos: DatosCredito;
  documentos: DocumentosPersona;
  onCambiar: (datos: DatosCredito) => void;
  onCambiarDocs:(docs: DocumentosPersona) => void;
  onSiguiente: () => void;
  onAnterior: () => void;

}
 
export function PasoCredito({
  datos,
  documentos,
  onCambiar,
  onCambiarDocs,
  onSiguiente,
  onAnterior,

}: PasoCreditoProps) {

  const [plazos, setPlazos] = useState<PlazoDisponible[]>([]);

  const [productos, setProductos] = useState<ProductoCredito[]>([]);

  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);

  const [cargandoProductos, setCargandoProductos] = useState(false);

  const [error, setError] = useState<string | null>(null);
 
  // Catálogo de plazos.

  useEffect(() => {

    listarPlazos()

      .then(setPlazos)

      .catch(() => setError("No se pudo cargar el catálogo de productos."));

  }, []);
 
  // Al elegir plazo, se cargan sus montos.

  useEffect(() => {

    if (!datos.plazo) {

      setProductos([]);

      return;

    }
 
    let cancelado = false;

    setCargandoProductos(true);
 
    listarProductos(datos.plazo)

      .then((p) => {

        if (!cancelado) setProductos(p);

      })

      .catch(() => {

        if (!cancelado) setError("No se pudieron cargar los montos de ese plazo.");

      })

      .finally(() => {

        if (!cancelado) setCargandoProductos(false);

      });
 
    return () => {

      cancelado = true;

    };

  }, [datos.plazo]);
 
  // Cotización en vivo cada vez que cambia algo del cálculo.

  useEffect(() => {

    if (!datos.id_producto) {

      setCotizacion(null);

      return;

    }
 
    let cancelado = false;
 
    cotizar({

      id_producto: datos.id_producto,

      pago_adelantado: datos.pago_adelantado,

      saldo_anterior: datos.saldo_anterior,

    })

      .then((c) => {

        if (!cancelado) setCotizacion(c);

      })

      .catch(() => {

        if (!cancelado) setCotizacion(null);

      });
 
    return () => {

      cancelado = true;

    };

  }, [datos.id_producto, datos.pago_adelantado, datos.saldo_anterior]);
 
  const set = <K extends keyof DatosCredito>(campo: K, valor: DatosCredito[K]) =>

    onCambiar({ ...datos, [campo]: valor });
 
  const setGarantia = (

    orden: number,

    campo: "articulo" | "marca",

    valor: string

  ) => {

    const otras = datos.garantias.filter(

      (g) => !(g.propietario === "TITULAR" && g.orden === orden)

    );

    const actual = datos.garantias.find(

      (g) => g.propietario === "TITULAR" && g.orden === orden

    ) ?? { propietario: "TITULAR" as const, orden, articulo: "", marca: "" };
 
    onCambiar({

      ...datos,

      garantias: [...otras, { ...actual, [campo]: valor }].sort(

        (a, b) => a.orden - b.orden

      ),

    });

  };
 
  const garantia = (orden: number) =>

    datos.garantias.find((g) => g.propietario === "TITULAR" && g.orden === orden);
 
  const puedeContinuar = datos.id_producto !== null && datos.fecha_entrega !== "";
 
  return (
<>

      {error && (
<div className="mb-6">
<Alert variant="error" onDismiss={() => setError(null)}>

            {error}
</Alert>
</div>

      )}
 
      <section className="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Datos del Crédito</h2>
 
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
<Select

            label="Tipo de crédito"

            required

            value={datos.tipo}

            onChange={(e) => set("tipo", e.target.value)}

            opciones={[

              { valor: "NUEVO", etiqueta: "Nuevo" },

              { valor: "RENOVACION", etiqueta: "Renovación" },

              { valor: "REFINANCIAMIENTO", etiqueta: "Refinanciamiento" },

            ]}

          />
 
          <Input

            label="Saldo deudor anterior"

            value={`$${datos.saldo_anterior.toFixed(2)}`}

            readOnly

            hint="Se calcula del crédito anterior."

          />
 
          <Input

            label="Crédito anterior"

            placeholder="Ninguno"

            inputMode="numeric"

            value={datos.id_credito_anterior ?? ""}

            onChange={(e) =>

              set(

                "id_credito_anterior",

                e.target.value ? Number(e.target.value) : null

              )

            }

          />
 
          <Select

            label="Prórroga"

            required

            value={datos.prorroga ? "SI" : "NO"}

            onChange={(e) => set("prorroga", e.target.value === "SI")}

            opciones={[

              { valor: "NO", etiqueta: "No" },

              { valor: "SI", etiqueta: "Sí" },

            ]}

          />
 
          <Select

            label="Plazo"

            required

            placeholder="Selecciona el plazo"

            value={datos.plazo ?? ""}

            onChange={(e) => {

              const p = e.target.value ? Number(e.target.value) : null;

              onCambiar({ ...datos, plazo: p, id_producto: null });

            }}

            opciones={plazos.map((p) => ({

              valor: String(p.plazo),

              etiqueta: `${p.plazo} semanas`,

            }))}

          />
 
          <Select

            label="Monto solicitado"

            required

            placeholder={

              !datos.plazo

                ? "Primero elige el plazo"

                : cargandoProductos

                  ? "Cargando…"

                  : "Selecciona el monto"

            }

            disabled={!datos.plazo || cargandoProductos}

            value={datos.id_producto ?? ""}

            onChange={(e) =>

              set("id_producto", e.target.value ? Number(e.target.value) : null)

            }

            opciones={productos.map((p) => ({

              valor: String(p.id),

              etiqueta: `$${Number(p.monto).toLocaleString("es-MX")}`,

            }))}

          />
 
          <Input

            label="Pago fijo (semanal)"

            value={

              cotizacion

                ? `$${cotizacion.desglose.pago_semanal.toLocaleString("es-MX")}`

                : ""

            }

            readOnly

            placeholder="—"

            hint="Lo define el catálogo de productos."

          />
 
          <Select

            label="Apoyo económico"

            value={datos.apoyo_economico ? "SI" : "NO"}

            onChange={(e) => set("apoyo_economico", e.target.value === "SI")}

            opciones={[

              { valor: "NO", etiqueta: "No" },

              { valor: "SI", etiqueta: "Sí" },

            ]}

          />
 
          <Input

            label="Fecha de entrega"

            type="date"

            required

            value={datos.fecha_entrega}

            onChange={(e) => set("fecha_entrega", e.target.value)}

          />
 
          <Input

            label="Multas acumuladas"

            inputMode="decimal"

            value={datos.multas}

            onChange={(e) => set("multas", Number(e.target.value) || 0)}

          />
 
          <Input

            label="Pago adelantado"

            inputMode="decimal"

            placeholder="0.00"

            value={datos.pago_adelantado || ""}

            onChange={(e) => set("pago_adelantado", Number(e.target.value) || 0)}

          />
</div>
 
        {cotizacion && (
<div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-5">
<p className="mb-4 text-sm font-bold text-sky-900">

              Desglose del crédito
</p>
<dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
<Dato label="Monto" valor={cotizacion.desglose.monto} />
<Dato label="Gastos admin." valor={-cotizacion.desglose.gastos_admin} />
<Dato label="Saldo anterior" valor={-cotizacion.desglose.saldo_anterior} />
<Dato label="Pago adelantado" valor={-cotizacion.desglose.pago_adelantado} />
<Dato label="Recibe" valor={cotizacion.desglose.monto_entregar} destacado />
</dl>
<p className="mt-4 border-t border-sky-200 pt-3 text-sm text-sky-900">

              Pagará{" "}
<strong>

                ${cotizacion.desglose.pago_semanal.toLocaleString("es-MX")}
</strong>{" "}

              durante <strong>{cotizacion.desglose.plazo} semanas</strong>. Total:{" "}
<strong>

                ${cotizacion.desglose.total_a_pagar.toLocaleString("es-MX")}
</strong>

              .
</p>
</div>

        )}
</section>
 
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">

          Garantías del Solicitante
</h2>
 
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
<Input

            label="Garantía 1 — Artículo"

            placeholder="Ej. Pantalla LED 55 pulgadas"

            value={garantia(1)?.articulo ?? ""}

            onChange={(e) => setGarantia(1, "articulo", e.target.value)}

          />
<Input

            label="Garantía 1 — Marca"

            placeholder="Ej. Samsung"

            value={garantia(1)?.marca ?? ""}

            onChange={(e) => setGarantia(1, "marca", e.target.value)}

          />
<Input

            label="Garantía 2 — Artículo"

            placeholder="Ej. Motocicleta 125cc"

            value={garantia(2)?.articulo ?? ""}

            onChange={(e) => setGarantia(2, "articulo", e.target.value)}

          />
<Input

            label="Garantía 2 — Marca"

            placeholder="Ej. Italika"

            value={garantia(2)?.marca ?? ""}

            onChange={(e) => setGarantia(2, "marca", e.target.value)}

          />
</div>
</section>

<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Documentos</h2>
<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
<FileInput
            label="INE frente"
            archivo={documentos.ine_frente}
            onCambiar={(f) => onCambiarDocs({ ...documentos, ine_frente: f })}
          />
<FileInput
            label="INE reverso"
            archivo={documentos.ine_reverso}
            onCambiar={(f) => onCambiarDocs({ ...documentos, ine_reverso: f })}
          />
<FileInput
            label="Comprobante de domicilio"
            archivo={documentos.comprobante_domicilio}
            onCambiar={(f) =>
              onCambiarDocs({ ...documentos, comprobante_domicilio: f })
            }
          />
</div>
</section>
 
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
<Button variant="ghost" onClick={onAnterior}>

          Anterior
</Button>
<Button onClick={onSiguiente} disabled={!puedeContinuar}>

          Siguiente
</Button>
</div>
</>

  );

}
 
function Dato({

  label,

  valor,

  destacado = false,

}: {

  label: string;

  valor: number;

  destacado?: boolean;

}) {

  return (
<div>
<dt className="text-xs text-sky-700">{label}</dt>
<dd

        className={

          destacado

            ? "text-lg font-bold text-sky-900"

            : "text-sm font-medium text-sky-900"

        }
>

        {valor < 0 ? "−" : ""}${Math.abs(valor).toLocaleString("es-MX")}
</dd>
</div>

  );

}
 
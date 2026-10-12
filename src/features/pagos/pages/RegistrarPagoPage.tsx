import { useState } from "react";

import type { FormEvent } from "react";

import { Link, useSearchParams } from "react-router-dom";

import { Search } from "lucide-react";

import { Alert, Badge, Breadcrumb, Button, Input, Spinner } from "../../../shared/ui";

import { formatearMoneda } from "../../../shared/lib/formato";

import { useEstadoCuenta } from "../hooks/useEstadoCuenta";

import { CapturaPago } from "../components/CapturaPago";
import { ResumenEstadoCuenta } from "../components/ResumenEstadoCuenta";
import { TablaPagosCredito } from "../components/TablaPagosCredito";

import type { RespuestaRegistroPago } from "../types";

/*  Captura de un crédito a la vez. El número de crédito vive en la URL
    (?credito=N) para que el detalle del crédito pueda mandar directo
    aquí y para que recargar la página no pierda el crédito.

    Pendiente: la lista de cobranza (un ✓ por fila) cuando el backend
    tenga GET /cobranza. Ver PENDIENTES.md.  */
export function RegistrarPagoPage() {
  const [params, setParams] = useSearchParams();
  const enUrl = params.get("credito") ?? "";
  const numero = /^\d+$/.test(enUrl) ? Number(enUrl) : null;

  const [texto, setTexto] = useState(enUrl);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  const buscar = (e: FormEvent) => {
    e.preventDefault();
    const limpio = texto.trim();

    if (!/^\d+$/.test(limpio)) {
      setErrorBusqueda("Escribe el número de crédito (solo dígitos).");
      return;
    }

    setErrorBusqueda(null);
    setParams({ credito: limpio });
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Inicio", ruta: "/inicio" },
          { label: "Pagos", ruta: "/pagos" },
          { label: "Registrar pago" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Registrar pago</h1>
        <p className="mt-1 text-slate-500">
          Busca el crédito. Si el cliente pagó la cuota exacta, basta un clic.
        </p>
      </header>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <form onSubmit={buscar} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Número de crédito"
              inputMode="numeric"
              autoComplete="off"
              value={texto}
              onChange={(e) => setTexto(e.target.value.replace(/\D/g, ""))}
              error={errorBusqueda ?? undefined}
              placeholder="Ej. 120345"
            />
          </div>
          <Button type="submit" className={errorBusqueda ? "sm:mb-6" : undefined}>
            <Search size={16} aria-hidden="true" />
            Buscar
          </Button>
        </form>
      </section>

      {numero !== null && <PanelCredito key={numero} numero={numero} />}
    </>
  );
}

/*  Con key = número: al cambiar de crédito se monta de nuevo y el aviso
    de "pago registrado" del crédito anterior no se arrastra.  */
function PanelCredito({ numero }: { numero: number }) {
  const { datos, cargando, error, recargar } = useEstadoCuenta(numero, "numero");
  const [registro, setRegistro] = useState<RespuestaRegistroPago | null>(null);

  if (cargando) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-16">
        <Spinner centered size="lg" />
      </div>
    );
  }

  if (error || !datos) {
    return (
      <Alert variant="error" title="No se pudo abrir el crédito">
        {error ?? "Error desconocido."}
      </Alert>
    );
  }

  const { credito, estado_cuenta: estado, semanas, pagos } = datos;

  const alRegistrar = (r: RespuestaRegistroPago) => {
    setRegistro(r);
    recargar();
  };

  return (
    /* Orden del DOM = orden en celular: resumen, captura, pagos. En lg:
       la captura pasa a una columna lateral fija.  */
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-6 lg:col-start-1">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Crédito {credito.numero_credito}
                </h2>
                {credito.estatus !== "ENTREGADO" && (
                  <Badge variant="neutral">{credito.estatus}</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {credito.nombre_cliente} · Nº de cliente {credito.numero_cliente} · Zona{" "}
                {credito.zona ?? "—"}-{credito.sector ?? "—"}
              </p>
            </div>
            <Link
              to={`/creditos/${credito.id}`}
              className="text-sm font-semibold text-primary-600 hover:underline"
            >
              Ver crédito
            </Link>
          </div>

          {estado ? (
            <ResumenEstadoCuenta estado={estado} />
          ) : (
            <p className="text-sm text-slate-500">El crédito todavía no se entrega.</p>
          )}
        </section>


      <section className="rounded-xl border border-slate-200 bg-white p-6 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <h2 className="mb-4 text-base font-bold text-slate-900">Captura</h2>

        {registro && (
          <div className="mb-4">
            <Alert
              variant="success"
              title={registro.liquidado ? "Crédito liquidado" : "Pago registrado"}
              onDismiss={() => setRegistro(null)}
            >
              {formatearMoneda(registro.pago.monto)}
              {Number(registro.pago.multa) > 0 &&
                ` + multa de ${formatearMoneda(registro.pago.multa)}`}{" "}
              en la semana {registro.pago.semana}.
              {registro.excedente > 0 &&
                ` Excedente de ${formatearMoneda(registro.excedente)} anotado en observaciones.`}{" "}
              <Link to={`/pagos/${registro.pago.id}`} className="font-semibold underline">
                Ver pago
              </Link>
            </Alert>
          </div>
        )}

        {estado ? (
          <CapturaPago
            credito={credito}
            estado={estado}
            semanas={semanas}
            pagos={pagos}
            onRegistrado={alRegistrar}
          />
        ) : (
          <Alert variant="info">Los pagos se reciben a partir de la entrega del crédito.</Alert>
        )}
      </section>

      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-6 lg:col-start-1">
        <h2 className="mb-4 text-base font-bold text-slate-900">Pagos del crédito</h2>
        <TablaPagosCredito pagos={pagos} />
      </section>
    </div>
  );
}

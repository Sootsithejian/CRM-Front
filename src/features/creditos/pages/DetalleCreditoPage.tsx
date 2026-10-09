import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft, FileText } from "lucide-react";

import { Alert, Badge, Breadcrumb, Button, Spinner } from "../../../shared/ui";

import { useCreditoDetalle } from "../hooks/useCreditoDetalle";
import { BotonesImpresion } from "../components/BotonesImpresion";
 
const CAL: Record<string, "success" | "warning" | "danger"> = {

  BUENO: "success",

  REGULAR: "warning",

  MALO: "danger",

};
 
const DOCS: Record<string, string> = {

  INE_FRENTE: "INE frente",

  INE_REVERSO: "INE reverso",

  COMPROBANTE_DOMICILIO: "Comprobante de domicilio",

};
 
const DUENOS: Record<string, string> = {

  TITULAR: "Titular",

  AVAL_1: "Aval 1",

  AVAL_2: "Aval 2",

};
 
export function DetalleCreditoPage() {

  const { id } = useParams<{ id: string }>();

  const idNumerico = Number(id);

  const navigate = useNavigate();
 
  const { detalle, cargando, error } = useCreditoDetalle(idNumerico);
 
  const migas = [

    { label: "Inicio", ruta: "/inicio" },

    { label: "Créditos", ruta: "/creditos" },

    { label: "Detalle del Crédito" },

  ];
 
  if (Number.isNaN(idNumerico)) {

    return (
<>
<Breadcrumb items={migas} />
<Alert variant="error" title="Dirección inválida">

          El identificador del crédito no es válido.
</Alert>
</>

    );

  }
 
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
<Alert variant="error" title="No se pudo abrir el crédito">

          {error ?? "Error desconocido."}
</Alert>
<div className="mt-4">
<Button variant="secondary" onClick={() => navigate("/creditos")}>

            Volver a la consulta
</Button>
</div>
</>

    );

  }
 
  const { credito, cliente, avales, garantias, documentos, solicitud, movimientos } =

    detalle;
 
  const money = (v: any) =>

    `$${Number(v).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
 
  return (
<>
<Breadcrumb items={migas} />
 
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
<div>
<div className="flex flex-wrap items-center gap-3">
<h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">

              Crédito {credito.numero_credito}
</h1>
<Badge variant={CAL[credito.calificacion] ?? "neutral"}>

              {credito.calificacion}
</Badge>

            {credito.liquidado && <Badge variant="neutral">Liquidado</Badge>}

            {credito.demanda && <Badge variant="danger">En demanda</Badge>}
</div>
<p className="mt-1 text-slate-500">

            {cliente.nombre} — Nº de cliente {cliente.numero_cliente}
</p>
</div>
 
        <Button variant="secondary" onClick={() => navigate("/creditos")}>
<ChevronLeft size={16} aria-hidden="true" />

          Regresar
</Button>
<BotonesImpresion
    idCredito={credito.id}
    numeroCredito={credito.numero_credito}
/>
</header>
 
      {credito.fallos >= 2 && (
<div className="mb-6">
<Alert

            variant={credito.fallos >= 3 ? "error" : "warning"}

            title={

              credito.fallos >= 3

                ? "Cliente con mal historial"

                : "Estampa de morosidad"

            }
>

            {credito.fallos} fallos acumulados en la vida del crédito.

            {credito.fallos >= 3 &&

              " No aplica para incremento de monto en renovaciones."}
</Alert>
</div>

      )}
 
      <section className="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">

          Condiciones del crédito
</h2>
<div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
<Campo label="Monto" valor={money(credito.monto)} />
<Campo label="Plazo" valor={`${credito.plazo} semanas`} />
<Campo label="Pago semanal" valor={money(credito.pago_fijo)} />
<Campo label="Total a pagar" valor={money(credito.total_a_pagar)} />
 
          <Campo label="Gastos de administración" valor={money(credito.gastos_admin)} />
<Campo label="Servicios funerarios" valor={money(credito.servicios_funerarios)} />
<Campo label="Saldo anterior" valor={money(credito.saldo_anterior)} />
<Campo label="Pago adelantado" valor={money(credito.pago_adelantado)} />
 
          <Campo label="Entregado al cliente" valor={money(credito.monto_entregar)} />
<Campo label="Multas" valor={money(credito.multas)} />
<Campo

            label="Semanas adicionales"

            valor={

              credito.semanas_adicionales > 0

                ? `+${credito.semanas_adicionales}`

                : "Ninguna"

            }

          />
<Campo label="Zona / Sector" valor={`${credito.zona ?? "—"}-${credito.sector ?? "—"}`} />
 
          <Campo

            label="Fecha de inicio"

            valor={new Date(credito.fecha_inicio).toLocaleDateString("es-MX", {

              dateStyle: "medium",

            })}

          />
<Campo

            label="Fin estimado"

            valor={

              credito.fecha_fin_estimada

                ? new Date(credito.fecha_fin_estimada).toLocaleDateString("es-MX", {

                    dateStyle: "medium",

                  })

                : null

            }

          />
<Campo label="Prórroga" valor={credito.prorroga ? "Sí" : "No"} />
<Campo label="Capturó" valor={credito.usuario_alta} />
</div>
 
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">

          El saldo pendiente y el estado de cuenta se calcularán cuando exista el

          módulo de Pagos.
</div>
</section>
 
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Cliente</h2>
<div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
<Campo label="Nombre" valor={cliente.nombre} />
<Campo label="CURP" valor={cliente.curp} />
<Campo label="Teléfono" valor={cliente.telefono} />
<Campo

            label="Domicilio"

            valor={

              cliente.domicilio

                ? `${cliente.domicilio.calle} ${cliente.domicilio.numero_ext ?? ""}, ${cliente.domicilio.colonia ?? ""}`

                : null

            }

          />
</div>
<div className="mt-4">
<Button

            size="sm"

            variant="secondary"

            onClick={() => navigate(`/clientes/${cliente.id}`)}
>

            Ver ficha del cliente
</Button>
</div>
</section>
 
      {avales.length > 0 && (
<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">

            Avales ({avales.length})
</h2>
<div className="flex flex-col gap-5">

            {avales.map((a: any) => (
<div

                key={a.orden}

                className="rounded-lg border border-slate-200 p-4"
>
<p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">

                  Aval {a.orden}
</p>
<div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
<Campo label="Nombre" valor={a.nombre} />
<Campo label="CURP" valor={a.curp} />
<Campo label="Parentesco" valor={a.parentesco} />
<Campo label="Teléfono" valor={a.telefono} />
</div>
</div>

            ))}
</div>
</section>

      )}
 
      {garantias.length > 0 && (
<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Garantías</h2>
<ul className="divide-y divide-slate-100">

            {garantias.map((g: any) => (
<li key={g.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
<span className="font-medium text-slate-900">

                  {g.articulo}

                  {g.marca && <span className="text-slate-500"> · {g.marca}</span>}
</span>
<Badge variant="neutral">{DUENOS[g.propietario] ?? g.propietario}</Badge>
</li>

            ))}
</ul>
</section>

      )}
 
      {documentos.length > 0 && (
<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Documentos</h2>
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {documentos.map((d: any) => (
<div

                key={d.id}

                className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3"
>
<FileText size={18} className="shrink-0 text-slate-500" aria-hidden="true" />
<div className="min-w-0">
<p className="truncate text-sm font-medium text-slate-900">

                    {DOCS[d.tipo] ?? d.tipo}
</p>
<p className="text-xs text-slate-500">

                    {DUENOS[d.propietario] ?? d.propietario}
</p>
</div>
</div>

            ))}
</div>
<p className="mt-4 text-xs text-slate-500">

            Los archivos se sirven solo con sesión iniciada.
</p>
</section>

      )}
 
      {solicitud && (
<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">

            Origen de la solicitud
</h2>
<div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
<Campo label="Folio" valor={solicitud.folio} />
<Campo label="Capturó" valor={solicitud.usuario_captura} />
<Campo label="Preaprobó" valor={solicitud.usuario_preaprueba} />
<Campo label="Aprobó" valor={solicitud.usuario_aprueba} />
</div>
</section>

      )}
 
      {movimientos.length > 0 && (
<section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Movimientos</h2>
<ul className="divide-y divide-slate-100">

            {movimientos.map((m: any) => (
<li key={m.id} className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0">
<div className="min-w-0">
<p className="text-sm font-medium text-slate-900">{m.tipo}</p>

                  {m.descripcion && (
<p className="mt-0.5 text-sm text-slate-600">{m.descripcion}</p>

                  )}
</div>
<div className="shrink-0 text-right">
<p className="text-sm text-slate-500">{m.usuario}</p>
<p className="text-xs text-slate-400">

                    {new Date(m.fecha).toLocaleString("es-MX", {

                      dateStyle: "medium",

                      timeStyle: "short",

                    })}
</p>
</div>
</li>

            ))}
</ul>
</section>

      )}
</>

  );

}
 
function Campo({ label, valor }: { label: string; valor: React.ReactNode }) {

  const vacio = valor === null || valor === undefined || valor === "";

  return (
<div className="border-b border-slate-100 py-4">
<p className="mb-1 text-xs tracking-wide text-slate-400 uppercase">{label}</p>
<p className={vacio ? "text-slate-400" : "font-medium text-slate-900"}>

        {vacio ? "—" : valor}
</p>
</div>

  );

}
 
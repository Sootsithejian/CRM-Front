import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Search } from "lucide-react";

import { Alert, Button, Input, Spinner } from "../../../shared/ui";

import { listarClientes, obtenerCliente } from "../../clientes/api/clientes.api";

import type { ClienteSolicitud } from "../types";
 
interface PasoClienteProps {

  cliente: ClienteSolicitud | null;

  idClientePrevio?: string | null;

  onSeleccionar: (cliente: ClienteSolicitud | null) => void;

  onSiguiente: () => void;

  onCancelar: () => void;

}
 
export function PasoCliente({

  cliente,

  idClientePrevio,

  onSeleccionar,

  onSiguiente,

  onCancelar,

}: PasoClienteProps) {

  const [curp, setCurp] = useState("");

  const [buscando, setBuscando] = useState(false);

  const [error, setError] = useState<string | null>(null);
 
  // Si llegamos desde el detalle de un cliente, se precarga.

  useEffect(() => {

    if (!idClientePrevio || cliente) return;
 
    obtenerCliente(Number(idClientePrevio))

      .then((d) => {

        const dom = d.domicilios[0];

        onSeleccionar({

          id: d.cliente.id,

          numero_cliente: d.cliente.numero_cliente,

          nombre: d.persona.nombre,

          curp: d.persona.curp,

          telefono: d.persona.tel_principal,

          zona: d.cliente.zona,

          sector: d.cliente.sector,

          tipo_vivienda: dom?.tipo_vivienda ?? null,

          direccion: dom

            ? `${dom.calle} ${dom.numero_ext ?? ""}${dom.numero_int ? "-" + dom.numero_int : ""}, ${dom.colonia ?? ""}`

            : null,

          en_lista_negra: d.persona.en_lista_negra,

        });

      })

      .catch(() => setError("No se pudo cargar el cliente."));

  }, [idClientePrevio, cliente, onSeleccionar]);
 
  const buscar = async () => {

    const texto = curp.trim().toUpperCase();
 
    if (texto.length !== 18) {

      setError("La CURP debe tener 18 caracteres.");

      return;

    }
 
    setBuscando(true);

    setError(null);
 
    try {

      const { clientes } = await listarClientes({ search: texto, limite: 1 });
 
      if (clientes.length === 0) {

        setError(

          "No existe un cliente con esa CURP. Regístralo primero desde el módulo de Clientes."

        );

        return;

      }
 
      const detalle = await obtenerCliente(clientes[0].id);

      const dom = detalle.domicilios[0];
 
      onSeleccionar({

        id: detalle.cliente.id,

        numero_cliente: detalle.cliente.numero_cliente,

        nombre: detalle.persona.nombre,

        curp: detalle.persona.curp,

        telefono: detalle.persona.tel_principal,

        zona: detalle.cliente.zona,

        sector: detalle.cliente.sector,

        tipo_vivienda: dom?.tipo_vivienda ?? null,

        direccion: dom

          ? `${dom.calle} ${dom.numero_ext ?? ""}${dom.numero_int ? "-" + dom.numero_int : ""}, ${dom.colonia ?? ""}`

          : null,

        en_lista_negra: detalle.persona.en_lista_negra,

      });

    } catch {

      setError("Ocurrió un error al buscar. Intenta de nuevo.");

    } finally {

      setBuscando(false);

    }

  };
 
  // --- Sin cliente: pantalla de búsqueda ---

  if (!cliente) {

    return (
<div className="mx-auto max-w-lg">
<div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
<span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-sky-100 text-primary-500">
<Search size={26} aria-hidden="true" />
</span>
 
          <h2 className="mb-2 text-xl font-bold text-slate-900">Buscar Cliente</h2>
<p className="mb-6 text-sm text-slate-500">

            Ingresa la CURP del cliente para cargar su información y comenzar la

            solicitud de crédito.
</p>
 
          {error && (
<div className="mb-5 text-left">
<Alert variant="error" onDismiss={() => setError(null)}>

                {error}
</Alert>
</div>

          )}
 
          <div className="text-left">
<Input

              label="CURP del cliente"

              required

              maxLength={18}

              className="uppercase"

              placeholder="Ej. MAMS920412HDFRR04"

              value={curp}

              onChange={(e) => setCurp(e.target.value.toUpperCase())}

              onKeyDown={(e) => e.key === "Enter" && buscar()}

              disabled={buscando}

            />
</div>
 
          <div className="mt-5">
<Button fullWidth loading={buscando} onClick={buscar}>

              Buscar Cliente
</Button>
</div>
 
          <p className="mt-6 border-t border-slate-100 pt-5 text-left text-xs text-slate-500">

            El cliente debe estar registrado en el sistema. Si no existe,

            regístralo primero desde el módulo de Clientes.
</p>
</div>
 
        <p className="mt-6 text-center">
<Link

            to="/clientes/alta"

            className="text-sm font-semibold text-primary-600 hover:underline"
>

            ¿Cliente nuevo? Dar de alta primero →
</Link>
</p>
</div>

    );

  }
 
  // --- Con cliente: datos precargados ---

  return (
<>
<section className="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
<span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold tracking-wide text-primary-600 uppercase">

            Datos precargados (lectura)
</span>
<Button

            size="sm"

            variant="secondary"

            onClick={() => {

              onSeleccionar(null);

              setCurp("");

            }}
>

            Cambiar cliente
</Button>
</div>
 
        {cliente.en_lista_negra && (
<div className="mb-6">
<Alert variant="error" title="Cliente en lista negra">

              No se puede generar una solicitud para esta persona mientras el

              veto esté activo.
</Alert>
</div>

        )}
 
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
<Campo label="ID del cliente">{cliente.numero_cliente}</Campo>
<Campo label="Nombre completo">{cliente.nombre}</Campo>
<Campo label="CURP">{cliente.curp}</Campo>
<Campo label="Tipo de vivienda">{cliente.tipo_vivienda}</Campo>
<Campo label="Zona">{cliente.zona}</Campo>
<Campo label="Sector">{cliente.sector}</Campo>
<Campo label="Teléfono">{cliente.telefono}</Campo>
<div className="sm:col-span-2">
<Campo label="Dirección completa">{cliente.direccion}</Campo>
</div>
</div>
</section>
 
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
<Button variant="ghost" onClick={onCancelar}>

          Cancelar
</Button>
<Button onClick={onSiguiente} disabled={cliente.en_lista_negra}>

          Siguiente
</Button>
</div>
</>

  );

}
 
function Campo({ label, children }: { label: string; children: React.ReactNode }) {

  const vacio = children === null || children === undefined || children === "";

  return (
<div className="border-b border-slate-100 py-5">
<p className="mb-1 text-xs tracking-wide text-slate-400 uppercase">{label}</p>
<p className={vacio ? "text-slate-400" : "font-medium text-slate-900"}>

        {vacio ? "—" : children}
</p>
</div>

  );

}
 
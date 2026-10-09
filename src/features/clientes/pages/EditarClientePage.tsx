import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Alert, Breadcrumb, Button, Spinner } from "../../../shared/ui";

import { actualizarCliente } from "../api/clientes.api";

import { useClienteDetalle } from "../hooks/useClienteDetalle";

import { ClienteForm } from "../components/ClienteForm";

import type { ClienteFormValues } from "../components/ClienteForm";
 
export function EditarClientePage() {

  const { id } = useParams<{ id: string }>();

  const idNumerico = Number(id);

  const navigate = useNavigate();
 
  const { detalle, cargando, error } = useClienteDetalle(idNumerico);
 
  const [guardando, setGuardando] = useState(false);

  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);
 
  const migas = [

    { label: "Inicio", ruta: "/inicio" },

    { label: "Consulta de Clientes", ruta: "/clientes" },

    { label: "Editar Cliente" },

  ];
 
  const guardar = async (valores: ClienteFormValues) => {

    setGuardando(true);

    setErrorGuardar(null);
 
    try {

      await actualizarCliente(idNumerico, {

        persona: {

          nombre: valores.nombre,

          curp: valores.curp,

          fecha_nac: valores.fecha_nac || undefined,

          sexo: valores.sexo || undefined,

          ocupacion: valores.ocupacion || undefined,

          estado_civil: valores.estado_civil || undefined,

          tel_principal: valores.tel_principal || undefined,

          tel_2: valores.tel_2 || undefined,

        },

        domicilio: {

          calle: valores.calle,

          numero_ext: valores.numero_ext || undefined,

          numero_int: valores.numero_int || undefined,

          colonia: valores.colonia || undefined,

          cp: valores.cp || undefined,

          municipio: valores.municipio || undefined,

          entre_calles: valores.entre_calles || undefined,

        },

        cliente: {

          zona: valores.zona || undefined,

          sector: valores.sector || undefined,

          estatus: valores.estatus,

          observaciones: valores.observaciones || undefined,

        },
        motivo_cambio_zona: valores.motivo_cambio_zona || undefined,
      } as any);
 
      navigate(`/clientes/${idNumerico}`, {

        replace: true,

        state: { mensaje: "Los cambios se guardaron correctamente." },

      });
 
    } catch (e: any) {

      const status = e?.response?.status;

      setErrorGuardar(

        status === 409

          ? e?.response?.data?.message ?? "La CURP ya pertenece a otra persona."

          : status === 403

            ? "No tienes permiso para editar este cliente."

            : e?.response?.data?.message ??

              "No se pudieron guardar los cambios. Intenta de nuevo."

      );

      setGuardando(false);

    }

  };
 
  if (Number.isNaN(idNumerico)) {

    return (
<>
<Breadcrumb items={migas} />
<Alert variant="error" title="Dirección inválida">

          El identificador del cliente no es válido.
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
<Alert variant="error" title="No se pudo abrir el cliente">

          {error ?? "Error desconocido."}
</Alert>
<div className="mt-4">
<Button variant="secondary" onClick={() => navigate("/clientes")}>

            Volver a la consulta
</Button>
</div>
</>

    );

  }
 
  return (
<>
<Breadcrumb items={migas} />
 
      <header className="mb-6">
<h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">

          Editar Cliente
</h1>
<p className="mt-1 text-slate-500">

          Nº {detalle.cliente.numero_cliente} — {detalle.persona.nombre}
</p>
</header>
 
      {errorGuardar && (
<div className="mb-6">
<Alert

            variant="error"

            title="No se guardó"

            onDismiss={() => setErrorGuardar(null)}
>

            {errorGuardar}
</Alert>
</div>

      )}
 
      <ClienteForm

        modo="edicion"

        detalle={detalle}

        guardando={guardando}

        onGuardar={guardar}

        onCancelar={() => navigate(`/clientes/${idNumerico}`)}

      />
</>

  );

}
 
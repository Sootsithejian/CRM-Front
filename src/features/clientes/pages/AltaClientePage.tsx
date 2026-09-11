import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Alert, Breadcrumb } from "../../../shared/ui";

import { crearCliente } from "../api/clientes.api";

import { ClienteForm } from "../components/ClienteForm";

import type { ClienteFormValues } from "../components/ClienteForm";
 
export function AltaClientePage() {

  const navigate = useNavigate();

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState<string | null>(null);
 
  const guardar = async (valores: ClienteFormValues) => {

    setGuardando(true);

    setError(null);
 
    try {

      const respuesta = await crearCliente({

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

          observaciones: valores.observaciones || undefined,

        },

      } as any);
 
      const id = respuesta.cliente.id;

      const numero = respuesta.cliente.numero_cliente;
 
      navigate(id ? `/clientes/${id}` : "/clientes", {

        replace: true,

        state: {

          mensaje: `Cliente registrado con el número ${numero}.`,

        },

      });
 
    } catch (e: any) {

      const status = e?.response?.status;

      const msg = e?.response?.data?.message;
 
      setError(

        status === 409

          ? msg ?? "Esta CURP ya está registrada o la persona está en lista negra."

          : status === 400

            ? msg ?? "Revisa los datos capturados."

            : status === 403

              ? "No tienes permiso para registrar clientes."

              : "No se pudo registrar el cliente. Intenta de nuevo."

      );

      setGuardando(false);

    }

  };
 
  return (
<>
<Breadcrumb

        items={[

          { label: "Inicio", ruta: "/inicio" },

          { label: "Consulta de Clientes", ruta: "/clientes" },

          { label: "Alta de Cliente" },

        ]}

      />
 
      <header className="mb-6">
<h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">

          Alta de Cliente
</h1>
<p className="mt-1 text-slate-500">

          Captura los datos del nuevo cliente. El aval se registra al generar su

          primer crédito.
</p>
</header>
 
      {error && (
<div className="mb-6">
<Alert variant="error" title="No se registró" onDismiss={() => setError(null)}>

            {error}
</Alert>
</div>

      )}
 
      <ClienteForm

        modo="alta"

        guardando={guardando}

        onGuardar={guardar}

        onCancelar={() => navigate("/clientes")}

      />
</>

  );

}
 
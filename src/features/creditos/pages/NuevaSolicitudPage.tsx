import { act, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { Breadcrumb } from "../../../shared/ui";

import { PasosSolicitud } from "../components/PasosSolicitud";

import { PasoCliente } from "../components/PasoCliente";

import { PasoCredito } from "../components/PasoCredito";

import { PasoAval } from "../components/PasoAval";

import { crearSolicitud, subirDocumento } from "../api/creditos.api";

import { DOCS_VACIOS } from "../types";

import { PasoConfirmacion } from "../components/PasoConfirmacion";

import type { BorradorSolicitud, DocumentosPersona } from "../types";



const VACIO: BorradorSolicitud = {

  cliente: null,

  credito: {

    tipo: "NUEVO",

    id_producto: null,

    plazo: null,

    prorroga: false,

    apoyo_economico: false,

    pago_adelantado: 0,

    multas: 0,

    fecha_entrega: "",

    id_credito_anterior: null,

    saldo_anterior: 0,

    garantias: [],

  },

  aval1: null,

  aval2: null,

  observaciones: "",

  docsTitular: { ...DOCS_VACIOS},
  docsAval1: { ...DOCS_VACIOS},
  docsAval2: { ...DOCS_VACIOS},

};
 
export function NuevaSolicitudPage() {

  const navigate = useNavigate();

  const [params] = useSearchParams();
 
  const [paso, setPaso] = useState(1);

  const [borrador, setBorrador] = useState<BorradorSolicitud>(VACIO);
 

  const idClientePrevio = params.get("cliente");
 
  const actualizar = (cambios: Partial<BorradorSolicitud>) =>

    setBorrador((prev) => ({ ...prev, ...cambios }));


  const [enviando, setEnviando] = useState(false);

  const [error, setError] = useState<string | null>(null);
 
 const enviar = async () => {
    if (!borrador.cliente || !borrador.credito.id_producto) return;
 
    setEnviando(true);
    setError(null);
 
    const aAval = (a: typeof borrador.aval1) =>
      a && {
        curp: a.curp.trim().toUpperCase(),
        nombre: a.nombre.trim(),
        telefono: a.telefono,
        ocupacion: a.ocupacion,
        parentesco: a.parentesco,
      };
 
    try {
      const res = await crearSolicitud({
        id_cliente: borrador.cliente.id,
        id_producto: borrador.credito.id_producto,
        tipo: borrador.credito.tipo,
        pago_adelantado: borrador.credito.pago_adelantado,
        id_credito_anterior: borrador.credito.id_credito_anterior ?? undefined,
        observaciones: borrador.observaciones || undefined,
        avales: [aAval(borrador.aval1), aAval(borrador.aval2)].filter(
          Boolean
        ) as any,
      });
 
      const idSolicitud: number | undefined = res?.solicitud?.id;
      const folio = res?.solicitud?.folio ?? "";
 
      /*  Los documentos se suben DESPUÉS de crear la solicitud: antes
          no existe el id al que colgarlos  */
      let fallidos = 0;
 
      if (idSolicitud) {
        const pendientes: {
          propietario: "TITULAR" | "AVAL_1" | "AVAL_2";
          tipo: "INE_FRENTE" | "INE_REVERSO" | "COMPROBANTE_DOMICILIO";
          archivo: File;
        }[] = [];
 
        const agregar = (
          propietario: "TITULAR" | "AVAL_1" | "AVAL_2",
          docs: DocumentosPersona
        ) => {
          if (docs.ine_frente)
            pendientes.push({ propietario, tipo: "INE_FRENTE", archivo: docs.ine_frente });
          if (docs.ine_reverso)
            pendientes.push({ propietario, tipo: "INE_REVERSO", archivo: docs.ine_reverso });
          if (docs.comprobante_domicilio)
            pendientes.push({
              propietario,
              tipo: "COMPROBANTE_DOMICILIO",
              archivo: docs.comprobante_domicilio,
            });
        };
 
        agregar("TITULAR", borrador.docsTitular);
        if (borrador.aval1) agregar("AVAL_1", borrador.docsAval1);
        if (borrador.aval2) agregar("AVAL_2", borrador.docsAval2);
 
        for (const d of pendientes) {
          try {
            await subirDocumento(idSolicitud, d.propietario, d.tipo, d.archivo);
          } catch {
            fallidos++;
          }
        }
      }
 
      navigate("/creditos/solicitudes", {
        replace: true,
        state: {
          mensaje:
            fallidos > 0
              ? `Solicitud ${folio} registrada, pero ${fallidos} documento(s) no se pudieron subir. Cárgalos desde el detalle.`
              : `Solicitud ${folio} registrada correctamente.`,
        },
      });
    } catch (e: any) {
      setError(
        e?.response?.data?.message ??
          "No se pudo registrar la solicitud. Intenta de nuevo."
      );
      setEnviando(false);
    }
  };

  const hayCliente = borrador.cliente !== null;
 

 
 
  return (
    <>
      <Breadcrumb
        items={[          
            { label: "Inicio", ruta: "/inicio" },          
            { label: "Créditos", ruta: "/creditos" },          
            { label: "Nueva Solicitud" },        
          ]}      
        />       
        {hayCliente && (        
            <>          
              <header className="mb-6">            
                <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
                   Nueva Solicitud de Crédito            
                </h1>            
                <p className="mt-1 text-slate-500">
                Completa los pasos para registrar una nueva solicitud de crédito para el cliente.
                </p>          
                </header>           
                <PasosSolicitud pasoActual={paso} />        
                </>      
            )}       
            <div className={hayCliente ? "mt-6" : ""}>

        {paso === 1 && (
<PasoCliente

            cliente={borrador.cliente}

            idClientePrevio={idClientePrevio}

            onSeleccionar={(cliente) => actualizar({ cliente })}

            onSiguiente={() => setPaso(2)}

            onCancelar={() => navigate("/creditos")}

          />

        )}
 
        {paso === 2 && (
            <PasoCredito
                datos={borrador.credito}
                documentos={borrador.docsTitular}
                onCambiar={(credito) => actualizar ({ credito})}
                onCambiarDocs={(docsTitular) => actualizar({ docsTitular })}
                onSiguiente={() => setPaso(3)}
                onAnterior ={() => setPaso(1)}
                />
        )}

        {paso === 3 && (
            <PasoAval
                numero={1}
                datos={borrador.aval1}
                documentos={borrador.docsAval1}
                curpTitular={borrador.cliente?.curp ?? null}
                curpOtroAval={borrador.aval2?.curp.toUpperCase() ?? null}
                onCambiar={(aval1) => actualizar({ aval1 })}
                onCambiarDocs={(docsAval1) => actualizar ({docsAval1})}
                onSiguiente={() => setPaso(4)}
                onAnterior={() => setPaso(2)}
            />
        )}

        {paso === 4 && (
            <PasoAval
                numero={2}
                datos={borrador.aval2}
                documentos={borrador.docsAval2}
                curpTitular={borrador.cliente?.curp ?? null}
                curpOtroAval={borrador.aval1?.curp.toUpperCase() ?? null}
                onCambiar={(aval2) => actualizar({ aval2 })}
                onCambiarDocs={(docsAval2) => actualizar ({docsAval2})}
                onSiguiente={() => setPaso(5)}
                onAnterior={() => setPaso(3)}
            />
        )}

        {paso === 5 && (
            <PasoConfirmacion
                borrador={borrador}
                enviando={enviando}
                error={error}
                onObservaciones={(observaciones) => actualizar({observaciones})}
                onEnviar={enviar}
                onAnterior={() => setPaso(4)}
                onCancelar={() => navigate("/creditos")}
                onLimpiarError={() => setError(null)}     
            />
        )}
</div>
</>

  );

}
 
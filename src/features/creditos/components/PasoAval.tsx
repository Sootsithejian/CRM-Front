import { Button, Input, Select, FileInput } from "../../../shared/ui";

import type { DatosAval, DocumentosPersona } from "../types";
 
const PARENTESCOS = [

  "MADRE", "PADRE", "HIJO(A)", "HERMANO(A)", "ESPOSO(A)",

  "TÍO(A)", "PRIMO(A)", "SUEGRO(A)", "CUÑADO(A)", "AMISTAD", "VECINO(A)",

].map((p) => ({ valor: p, etiqueta: p }));
 
const TIPOS_VIVIENDA = ["PROPIA", "RENTADA", "FAMILIAR", "PRESTADA"].map((t) => ({

  valor: t,

  etiqueta: t.charAt(0) + t.slice(1).toLowerCase(),

}));
 
const CURP_REGEX = /^[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
 
const VACIO: DatosAval = {

  curp: "", nombre: "", parentesco: "", ocupacion: "",

  calle: "", numero_ext: "", numero_int: "", colonia: "", cp: "",

  tipo_vivienda: "", telefono: "", ciudad: "",

  garantias: [{ articulo: "", marca: "" }, { articulo: "", marca: "" }],

};
 
interface PasoAvalProps {

  /** 1 = aval principal (obligatorio), 2 = segundo aval (opcional). */

  numero: 1 | 2;
  datos: DatosAval | null;
  documentos: DocumentosPersona;
  curpTitular: string | null;
  curpOtroAval: string | null;
  onCambiar: (datos: DatosAval | null) => void;
  onCambiarDocs: (datos: DocumentosPersona) => void;
  onSiguiente: () => void;
  onAnterior: () => void;

}
 
export function PasoAval({

  numero,

  datos,

  documentos,

  curpTitular,

  curpOtroAval,

  onCambiar,

  onCambiarDocs,

  onSiguiente,

  onAnterior,

}: PasoAvalProps) {

  const aval = datos ?? VACIO;

  const esPrincipal = numero === 1;

  const titulo = esPrincipal ? "Aval Principal" : "Segundo Aval";
 
  const set = <K extends keyof DatosAval>(campo: K, valor: DatosAval[K]) =>

    onCambiar({ ...aval, [campo]: valor });
 
  const setGarantia = (i: number, campo: "articulo" | "marca", valor: string) => {

    const garantias = [...aval.garantias];

    garantias[i] = { ...garantias[i]!, [campo]: valor };

    onCambiar({ ...aval, garantias });

  };
 
  // --- Validación ---

  const curpLimpia = aval.curp.trim().toUpperCase();

  const vacio = !curpLimpia && !aval.nombre.trim();
 
  let errorCurp: string | undefined;

  if (curpLimpia) {

    if (curpLimpia.length !== 18) errorCurp = "La CURP debe tener 18 caracteres.";

    else if (!CURP_REGEX.test(curpLimpia)) errorCurp = "Formato de CURP inválido.";

    else if (curpLimpia === curpTitular) errorCurp = "El titular no puede ser su propio aval.";

    else if (curpLimpia === curpOtroAval) errorCurp = "Este aval ya fue capturado.";

  }
 
  const completo =

    !errorCurp &&

    curpLimpia.length === 18 &&

    aval.nombre.trim().length > 2 &&

    aval.parentesco !== "" &&

    aval.calle.trim() !== "" &&

    aval.telefono.trim().length === 10;
 
  // El segundo aval es opcional: se puede omitir si está vacío.

  const puedeContinuar = esPrincipal ? completo : vacio || completo;
 
  const omitir = () => {

    onCambiar(null);

    onSiguiente();

  };
 
  return (
<>
<section className="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
<h2 className="text-base font-bold text-slate-900">

            {titulo} — Datos Personales
</h2>

          {!esPrincipal && (
<span className="text-xs text-slate-500">Opcional</span>

          )}
</div>
 
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
<Input

            label="CURP"

            required={esPrincipal}

            maxLength={18}

            className="uppercase"

            placeholder="Clave Única de Registro"

            error={errorCurp}

            value={aval.curp}

            onChange={(e) => set("curp", e.target.value.toUpperCase())}

          />
<Input

            label="Nombre completo"

            required={esPrincipal}

            placeholder="Nombre(s) y Apellidos"

            value={aval.nombre}

            onChange={(e) => set("nombre", e.target.value)}

          />
<Select

            label="Parentesco"

            required={esPrincipal}

            placeholder="Selecciona parentesco"

            opciones={PARENTESCOS}

            value={aval.parentesco}

            onChange={(e) => set("parentesco", e.target.value)}

          />
<Input

            label="Ocupación"

            placeholder="Ej. Comerciante"

            value={aval.ocupacion}

            onChange={(e) => set("ocupacion", e.target.value)}

          />
</div>
</section>
 
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">

          Domicilio del {esPrincipal ? "Aval" : "Segundo Aval"}
</h2>
 
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
<Input

            label="Calle"

            required={esPrincipal}

            placeholder="Nombre de la vialidad"

            value={aval.calle}

            onChange={(e) => set("calle", e.target.value)}

          />
<Input

            label="Número exterior"

            required={esPrincipal}

            placeholder="Ej. 141"

            value={aval.numero_ext}

            onChange={(e) => set("numero_ext", e.target.value)}

          />
<Input

            label="Número interior"

            placeholder="Ej. Depto B"

            value={aval.numero_int ?? ""}

            onChange={(e) => set("numero_int", e.target.value)}

          />
<Input

            label="Colonia"

            required={esPrincipal}

            placeholder="Ej. Punta Dorada"

            value={aval.colonia}

            onChange={(e) => set("colonia", e.target.value)}

          />
<Input

            label="Código postal"

            inputMode="numeric"

            maxLength={5}

            placeholder="5 dígitos"

            value={aval.cp}

            onChange={(e) => set("cp", e.target.value)}

          />
<Select

            label="Tipo de vivienda"

            placeholder="Selecciona"

            opciones={TIPOS_VIVIENDA}

            value={aval.tipo_vivienda}

            onChange={(e) => set("tipo_vivienda", e.target.value)}

          />
<Input

            label="Teléfono"

            required={esPrincipal}

            inputMode="numeric"

            maxLength={10}

            placeholder="10 dígitos"

            value={aval.telefono}

            onChange={(e) => set("telefono", e.target.value)}

          />
<Input

            label="Ciudad / Municipio"

            placeholder="Ej. León"

            value={aval.ciudad}

            onChange={(e) => set("ciudad", e.target.value)}

          />
</div>
</section>
 
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">

          Garantías del {esPrincipal ? "Aval" : "Segundo Aval"}
</h2>
 
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
<Input

            label="Garantía 1 — Artículo"

            placeholder={esPrincipal ? "Ej. Refrigerador" : "Ej. Computadora"}

            value={aval.garantias[0]?.articulo ?? ""}

            onChange={(e) => setGarantia(0, "articulo", e.target.value)}

          />
<Input

            label="Garantía 1 — Marca"

            placeholder={esPrincipal ? "Ej. Whirlpool" : "Ej. Dell"}

            value={aval.garantias[0]?.marca ?? ""}

            onChange={(e) => setGarantia(0, "marca", e.target.value)}

          />
<Input

            label="Garantía 2 — Artículo"

            placeholder={esPrincipal ? "Ej. Lavadora" : "Ej. Microondas"}

            value={aval.garantias[1]?.articulo ?? ""}

            onChange={(e) => setGarantia(1, "articulo", e.target.value)}

          />
<Input

            label="Garantía 2 — Marca"

            placeholder="Ej. LG"

            value={aval.garantias[1]?.marca ?? ""}

            onChange={(e) => setGarantia(1, "marca", e.target.value)}

          />
</div>
</section>

       <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">

          Documentos del {esPrincipal ? "Aval" : "Segundo Aval"}
</h2>
<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
<FileInput

            label="INE frente"

            required={esPrincipal}

            archivo={documentos.ine_frente}

            onCambiar={(f) => onCambiarDocs({ ...documentos, ine_frente: f })}

          />
<FileInput

            label="INE reverso"

            required={esPrincipal}

            archivo={documentos.ine_reverso}

            onCambiar={(f) => onCambiarDocs({ ...documentos, ine_reverso: f })}

          />
<FileInput

            label="Comprobante de domicilio"

            required={esPrincipal}

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
 
        <div className="flex flex-wrap gap-3">

          {!esPrincipal && (
<Button variant="secondary" onClick={omitir}>

              Sin segundo aval
</Button>

          )}
<Button onClick={onSiguiente} disabled={!puedeContinuar}>

            Siguiente
</Button>
</div>
</div>
</>

  );

}
 
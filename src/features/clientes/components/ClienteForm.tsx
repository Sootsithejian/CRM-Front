import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Select, Textarea } from "../../../shared/ui";
import type { ClienteDetalle } from "../types";
 
const CURP_REGEX = /^[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
 
const esquema = z.object({
  nombre: z.string().trim().min(3, "El nombre es obligatorio."),
  curp: z
    .string()
    .trim()
    .toUpperCase()
    .length(18, "La CURP debe tener 18 caracteres.")
    .regex(CURP_REGEX, "La CURP no tiene un formato válido."),
  fecha_nac: z.string().optional(),
  sexo: z.string().optional(),
  ocupacion: z.string().trim().optional(),
  estado_civil: z.string().optional(),
  tel_principal: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos.")
    .or(z.literal("")),
  tel_2: z.string().trim().optional(),
  calle: z.string().trim().min(1, "La calle es obligatoria."),
  numero_ext: z.string().trim().optional(),
  numero_int: z.string().trim().optional(),
  colonia: z.string().trim().optional(),
  cp: z.string().trim().optional(),
  municipio: z.string().trim().optional(),
  entre_calles: z.string().trim().optional(),
  zona: z.string().trim().optional(),
  sector: z.string().trim().optional(),
  estatus: z.string(),
  observaciones: z.string().trim().optional(),
});
 
export type ClienteFormValues = z.infer<typeof esquema>;
 
const VACIO: ClienteFormValues = {
  nombre: "", curp: "", fecha_nac: "", sexo: "", ocupacion: "",
  estado_civil: "", tel_principal: "", tel_2: "", calle: "",
  numero_ext: "", numero_int: "", colonia: "", cp: "", municipio: "",
  entre_calles: "", zona: "", sector: "", estatus: "ACTIVO", observaciones: "",
};
 
function valoresDesde(detalle: ClienteDetalle): ClienteFormValues {
  const dom = detalle.domicilios[0];
  return {
    nombre: detalle.persona.nombre,
    curp: detalle.persona.curp ?? "",
    fecha_nac: detalle.persona.fecha_nac?.slice(0, 10) ?? "",
    sexo: detalle.persona.sexo ?? "",
    ocupacion: detalle.persona.ocupacion ?? "",
    estado_civil: detalle.persona.estado_civil ?? "",
    tel_principal: detalle.persona.tel_principal ?? "",
    tel_2: detalle.persona.tel_2 ?? "",
    calle: dom?.calle ?? "",
    numero_ext: dom?.numero_ext ?? "",
    numero_int: dom?.numero_int ?? "",
    colonia: dom?.colonia ?? "",
    cp: dom?.cp ?? "",
    municipio: dom?.municipio ?? "",
    entre_calles: dom?.entre_calles ?? "",
    zona: detalle.cliente.zona ?? "",
    sector: detalle.cliente.sector ?? "",
    estatus: detalle.cliente.estatus,
    observaciones: detalle.cliente.observaciones ?? "",
  };
}
 
interface ClienteFormProps {
  modo: "alta" | "edicion";
  /** Requerido en modo edición. */
  detalle?: ClienteDetalle;
  guardando: boolean;
  onGuardar: (valores: ClienteFormValues) => void;
  onCancelar: () => void;
}
 
export function ClienteForm({
  modo,
  detalle,
  guardando,
  onGuardar,
  onCancelar,
}: ClienteFormProps) {
  const esAlta = modo === "alta";
 
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(esquema),
    defaultValues: detalle ? valoresDesde(detalle) : VACIO,
  });
 
  return (
<form onSubmit={handleSubmit(onGuardar)} noValidate>
<section className="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Datos personales</h2>
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
<div className="sm:col-span-2">
<Input label="Nombre completo" required error={errors.nombre?.message} {...register("nombre")} />
</div>
<Input
            label="CURP"
            required
            maxLength={18}
            className="uppercase"
            placeholder="AAAA000000HAAAAA00"
            error={errors.curp?.message}
            {...register("curp")}
          />
<Input label="Fecha de nacimiento" type="date" {...register("fecha_nac")} />
<Select
            label="Sexo"
            placeholder="Sin especificar"
            opciones={[
              { valor: "MUJER", etiqueta: "Mujer" },
              { valor: "HOMBRE", etiqueta: "Hombre" },
            ]}
            {...register("sexo")}
          />
<Select
            label="Estado civil"
            placeholder="Sin especificar"
            opciones={[
              { valor: "SOLTERO", etiqueta: "Soltero(a)" },
              { valor: "CASADO", etiqueta: "Casado(a)" },
              { valor: "UNION LIBRE", etiqueta: "Unión libre" },
              { valor: "DIVORCIADO", etiqueta: "Divorciado(a)" },
              { valor: "VIUDO", etiqueta: "Viudo(a)" },
            ]}
            {...register("estado_civil")}
          />
<Input label="Ocupación" {...register("ocupacion")} />
<Input label="Teléfono principal" inputMode="numeric" maxLength={10} error={errors.tel_principal?.message} {...register("tel_principal")} />
<Input label="Teléfono alterno" inputMode="numeric" maxLength={10} {...register("tel_2")} />
</div>
</section>
 
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Domicilio</h2>
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
<div className="lg:col-span-2">
<Input label="Calle" required error={errors.calle?.message} {...register("calle")} />
</div>
<div className="grid grid-cols-2 gap-5">
<Input label="# Exterior" {...register("numero_ext")} />
<Input label="Interior" {...register("numero_int")} />
</div>
<Input label="Colonia" {...register("colonia")} />
<Input label="Código postal" inputMode="numeric" maxLength={5} {...register("cp")} />
<Input label="Municipio" {...register("municipio")} />
<div className="lg:col-span-3">
<Input label="Entre calles" {...register("entre_calles")} />
</div>
</div>
</section>
 
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
<h2 className="mb-5 text-base font-bold text-slate-900">Datos del cliente</h2>
 
        {esAlta && (
<p className="mb-5 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-800">
            El número de cliente lo asigna el sistema automáticamente al guardar.
</p>
        )}
 
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
<Input label="Zona" {...register("zona")} />
<Input label="Sector" {...register("sector")} />
          {!esAlta && (
<Select
              label="Estatus"
              opciones={[
                { valor: "ACTIVO", etiqueta: "Activo" },
                { valor: "INACTIVO", etiqueta: "Inactivo" },
                { valor: "BAJA", etiqueta: "Baja" },
              ]}
              {...register("estatus")}
            />
          )}
<div className="lg:col-span-3">
<Textarea label="Observaciones" rows={3} {...register("observaciones")} />
</div>
</div>
</section>
 
      <div className="mt-6 flex flex-wrap gap-3">
<Button type="submit" loading={guardando} disabled={!esAlta && !isDirty}>
          {esAlta ? "Registrar cliente" : "Guardar cambios"}
</Button>
<Button type="button" variant="secondary" onClick={onCancelar} disabled={guardando}>
          Cancelar
</Button>
</div>
</form>
  );
}
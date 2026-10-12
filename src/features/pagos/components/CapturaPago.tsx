import { useRef, useState } from "react";

import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { Alert, Button, Input, Select, Textarea } from "../../../shared/ui";

import { mensajeDeError } from "../../../shared/api/client";

import { formatearMoneda, hoyLocal } from "../../../shared/lib/formato";

import { registrarPago } from "../api/pagos.api";

import {
  LARGO_OBSERVACIONES,
  MAX_MULTAS_POR_CREDITO,
  OPCIONES_TIPO_PAGO,
  TIPOS_PAGO,
} from "../types";

import type {
  EncabezadoCredito,
  EstadoCuenta,
  Pago,
  PagoInput,
  RespuestaRegistroPago,
  SemanaEstado,
} from "../types";

/*  Captura con check (requisito del negocio): si el cliente pagó la
    cuota exacta, basta un clic; si pagó otra cantidad, captura manual.

    La cuota es min(pago_fijo, saldo): la última semana puede ser menor.
    El clic manda efectivo y fecha de hoy, que son los defectos del
    backend.

    El backend no tiene idempotencia: un doble clic serían dos pagos que
    solo el administrador puede cancelar. Por eso el candado con ref, que
    se activa antes de que React vuelva a pintar el botón deshabilitado.
*/

const CANTIDAD = /^\d+(\.\d{1,2})?$/;

const cantidad = z
  .string()
  .trim()
  .refine((v) => v === "" || CANTIDAD.test(v), "Escribe una cantidad válida (máximo dos decimales).");

const esquema = z
  .object({
    monto: cantidad,
    multa: cantidad,
    tipo: z.enum(TIPOS_PAGO),
    fecha: z
      .string()
      .min(1, "Indica la fecha del pago.")
      .refine((f) => f <= hoyLocal(), "La fecha del pago no puede ser futura."),
    observaciones: z
      .string()
      .trim()
      .max(LARGO_OBSERVACIONES, `Máximo ${LARGO_OBSERVACIONES} caracteres.`),
  })
  .refine((v) => Number(v.monto || 0) > 0 || Number(v.multa || 0) > 0, {
    message: "Indica el monto del abono o de la multa.",
    path: ["monto"],
  });

type FormValues = z.infer<typeof esquema>;

interface CapturaPagoProps {
  credito: EncabezadoCredito;
  estado: EstadoCuenta;
  semanas: SemanaEstado[];
  pagos: Pago[];
  onRegistrado: (respuesta: RespuestaRegistroPago) => void;
}

export function CapturaPago({ credito, estado, semanas, pagos, onRegistrado }: CapturaPagoProps) {
  const [manual, setManual] = useState(false);
  const [enviando, setEnviando] = useState<"rapido" | "manual" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const candado = useRef(false);

  const valoresIniciales: FormValues = {
    monto: "",
    multa: "",
    tipo: "EFE",
    fecha: hoyLocal(),
    observaciones: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(esquema),
    defaultValues: valoresIniciales,
  });

  const montoEscrito = useWatch({ control, name: "monto" });

  if (credito.estatus !== "ENTREGADO" || estado.saldo <= 0) {
    return (
      <Alert variant="info" title="Este crédito no recibe pagos">
        Solo se reciben pagos de créditos entregados con saldo pendiente. Estado actual:{" "}
        {credito.estatus}.
      </Alert>
    );
  }

  const cuota = Math.min(estado.pago_fijo, estado.saldo);
  const liquida = cuota >= estado.saldo;

  const abonadoSemana =
    semanas.find((s) => s.semana === estado.semana_actual)?.abonado_semana ?? 0;

  const multasUsadas = pagos.filter((p) => !p.cancelado && Number(p.multa) > 0).length;
  const sinMultas = multasUsadas >= MAX_MULTAS_POR_CREDITO;

  const enviar = async (payload: PagoInput, origen: "rapido" | "manual") => {
    if (candado.current) return;
    candado.current = true;
    setEnviando(origen);
    setError(null);

    try {
      const respuesta = await registrarPago(payload);
      reset({ ...valoresIniciales, fecha: hoyLocal() });
      setManual(false);
      onRegistrado(respuesta);
    } catch (e) {
      setError(mensajeDeError(e, "No se pudo registrar el pago. Intenta de nuevo."));
    } finally {
      candado.current = false;
      setEnviando(null);
    }
  };

  const pagarCuota = () => enviar({ id_credito: credito.id, monto: cuota }, "rapido");

  const pagarManual = (v: FormValues) =>
    enviar(
      {
        id_credito: credito.id,
        monto: Number(v.monto || 0),
        multa: v.multa ? Number(v.multa) : undefined,
        tipo: v.tipo,
        fecha: v.fecha,
        observaciones: v.observaciones || undefined,
      },
      "manual"
    );

  const montoManual = Number(montoEscrito || 0);
  const sobrepago = CANTIDAD.test(montoEscrito?.trim() ?? "") && montoManual > estado.saldo;

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="error" title="No se registró el pago" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {abonadoSemana > 0 && (
        <Alert variant="warning" title="Esta semana ya tiene abonos">
          En la semana {estado.semana_actual} ya se registraron {formatearMoneda(abonadoSemana)}.
          Revisa que no sea el mismo pago antes de capturarlo otra vez.
        </Alert>
      )}

      <div>
        <Button
          size="lg"
          fullWidth
          loading={enviando === "rapido"}
          disabled={enviando !== null}
          onClick={pagarCuota}
        >
          <Check size={20} aria-hidden="true" />
          Pagó {formatearMoneda(cuota)}
        </Button>
        <p className="mt-2 text-center text-xs text-slate-500">
          {liquida ? "Saldo restante: liquida el crédito" : "Cuota de la semana"} · efectivo · con
          fecha de hoy
        </p>
      </div>

      <button
        type="button"
        onClick={() => setManual((v) => !v)}
        aria-expanded={manual}
        className="mx-auto flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 transition duration-150 hover:bg-slate-100"
      >
        Pagó otra cantidad
        {manual ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
      </button>

      {manual && (
        <form
          onSubmit={(e) => handleSubmit(pagarManual)(e)}
          noValidate
          className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Abono"
              inputMode="decimal"
              placeholder="0.00"
              autoFocus
              error={errors.monto?.message}
              hint={sobrepago ? undefined : `Saldo: ${formatearMoneda(estado.saldo)}`}
              {...register("monto")}
            />

            <Input
              label="Multa"
              inputMode="decimal"
              placeholder="0.00"
              disabled={sinMultas}
              error={errors.multa?.message}
              hint={
                sinMultas
                  ? `Ya tiene el máximo de ${MAX_MULTAS_POR_CREDITO} multas`
                  : `${multasUsadas} de ${MAX_MULTAS_POR_CREDITO} multas cobradas. No reduce la deuda.`
              }
              {...register("multa")}
            />

            <Select
              label="Forma de pago"
              opciones={OPCIONES_TIPO_PAGO}
              error={errors.tipo?.message}
              {...register("tipo")}
            />

            <Input
              label="Fecha del pago"
              type="date"
              min={credito.fecha_inicio}
              max={hoyLocal()}
              error={errors.fecha?.message}
              {...register("fecha")}
            />
          </div>

          {sobrepago && (
            <Alert variant="warning" title="El abono supera el saldo">
              El saldo es de {formatearMoneda(estado.saldo)}. El crédito se liquidará y el excedente
              de {formatearMoneda(montoManual - estado.saldo)} quedará anotado en las observaciones.
            </Alert>
          )}

          <Textarea
            label="Observaciones"
            rows={2}
            maxLength={LARGO_OBSERVACIONES}
            error={errors.observaciones?.message}
            {...register("observaciones")}
          />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setManual(false)} disabled={enviando !== null}>
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={enviando === "manual"}
              disabled={enviando !== null}
            >
              Registrar pago
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

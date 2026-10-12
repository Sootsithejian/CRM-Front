import { useCallback, useEffect, useState } from "react";

import axios from "axios";

import { mensajeDeError } from "../../../shared/api/client";

import { obtenerEstadoCuenta } from "../api/pagos.api";

import type { RespuestaEstadoCuenta } from "../types";

/*  Estado de cuenta de un crédito. Con valor = null no carga nada (la
    pantalla de registro todavía no tiene número de crédito).

    `cargando` solo es true en la primera carga de cada crédito: al
    recargar después de un pago, los datos viejos se quedan en pantalla
    en vez de cambiar a un spinner.  */
export function useEstadoCuenta(valor: number | null, por: "id" | "numero" = "id") {
  const [datos, setDatos] = useState<RespuestaEstadoCuenta | null>(null);
  const [cargando, setCargando] = useState(valor !== null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(
    async (silencioso = false) => {
      if (valor === null) {
        setDatos(null);
        setCargando(false);
        setError(null);
        return;
      }

      if (!silencioso) {
        setCargando(true);
        setDatos(null);
      }
      setError(null);

      try {
        setDatos(await obtenerEstadoCuenta(valor, por));
      } catch (e) {
        setDatos(null);
        setError(
          axios.isAxiosError(e) && e.response?.status === 404
            ? "No existe un crédito con ese número."
            : mensajeDeError(e, "No se pudo cargar el estado de cuenta. Intenta de nuevo.")
        );
      } finally {
        setCargando(false);
      }
    },
    [valor, por]
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  const recargar = useCallback(() => cargar(true), [cargar]);

  return { datos, cargando, error, recargar };
}

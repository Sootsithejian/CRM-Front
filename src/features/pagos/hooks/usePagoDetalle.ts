import { useCallback, useEffect, useState } from "react";

import axios from "axios";

import { mensajeDeError } from "../../../shared/api/client";

import { obtenerPago } from "../api/pagos.api";

import type { PagoDetalle } from "../types";

export function usePagoDetalle(id: number) {
  const [pago, setPago] = useState<PagoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      setPago(await obtenerPago(id));
    } catch (e) {
      setError(
        axios.isAxiosError(e) && e.response?.status === 404
          ? "El pago no existe."
          : mensajeDeError(e, "No se pudo cargar el pago. Intenta de nuevo.")
      );
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    if (!Number.isNaN(id)) cargar();
  }, [id, cargar]);

  return { pago, cargando, error, recargar: cargar };
}

import { useCallback, useEffect, useState } from "react";

import { obtenerCredito } from "../api/creditos.api";
 
export function useCreditoDetalle(id: number) {

  const [detalle, setDetalle] = useState<any>(null);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<string | null>(null);
 
  const cargar = useCallback(async () => {

    setCargando(true);

    setError(null);

    try {

      setDetalle(await obtenerCredito(id));

    } catch (e: any) {

      setError(

        e?.response?.status === 404

          ? "El crédito no existe."

          : e?.response?.status === 403

            ? "No tienes permiso para ver este crédito."

            : "No se pudo cargar el crédito. Intenta de nuevo."

      );

    } finally {

      setCargando(false);

    }

  }, [id]);
 
  useEffect(() => {

    cargar();

  }, [cargar]);
 
  return { detalle, cargando, error, recargar: cargar };

}
 
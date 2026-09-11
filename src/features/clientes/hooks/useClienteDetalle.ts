import { useCallback, useEffect, useState } from "react";

import { obtenerCliente } from "../api/clientes.api";

import type { ClienteDetalle } from "../types";
 
export function useClienteDetalle(id: number) {

  const [detalle, setDetalle] = useState<ClienteDetalle | null>(null);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<string | null>(null);
 
  const cargar = useCallback(async () => {

    setCargando(true);

    setError(null);

    try {

      setDetalle(await obtenerCliente(id));

    } catch (e: any) {

      setError(

        e?.response?.status === 404

          ? "El cliente no existe o fue eliminado."

          : e?.response?.status === 403

            ? "No tienes permiso para ver este cliente."

            : "No se pudo cargar el cliente. Intenta de nuevo."

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
 
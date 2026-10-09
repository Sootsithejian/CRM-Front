import { useCallback, useEffect, useState } from "react";

import { listarCreditos } from "../api/creditos.api";

import type { CreditoListado, FiltrosCreditos } from "../types";
 
export function useCreditos(filtros: FiltrosCreditos) {

  const [creditos, setCreditos] = useState<CreditoListado[]>([]);

  const [total, setTotal] = useState(0);

  const [paginas, setPaginas] = useState(0);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<string | null>(null);
 
  const clave = JSON.stringify(filtros);
 
  const cargar = useCallback(async () => {

    setCargando(true);

    setError(null);

    try {

      const data = await listarCreditos(JSON.parse(clave));

      setCreditos(data.creditos);

      setTotal(data.total);

      setPaginas(data.paginas);

    } catch {

      setError("No se pudieron cargar los créditos. Intenta de nuevo.");

    } finally {

      setCargando(false);

    }

  }, [clave]);
 
  useEffect(() => {

    cargar();

  }, [cargar]);
 
  return { creditos, total, paginas, cargando, error, recargar: cargar };

}
 
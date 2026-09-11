import { useCallback, useEffect, useState } from "react";

import { listarListaNegra } from "../api/listaNegra.api";

import type { FiltrosListaNegra, RegistroListaNegra } from "../types";
 
export function useListaNegra(filtros: FiltrosListaNegra) {

  const [registros, setRegistros] = useState<RegistroListaNegra[]>([]);

  const [total, setTotal] = useState(0);

  const [paginas, setPaginas] = useState(0);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<string | null>(null);
 
  const clave = JSON.stringify(filtros);
 
  const cargar = useCallback(async () => {

    setCargando(true);

    setError(null);

    try {

      const data = await listarListaNegra(JSON.parse(clave));

      setRegistros(data.registros);

      setTotal(data.total);

      setPaginas(data.paginas);

    } catch {

      setError("No se pudo cargar la lista negra. Intenta de nuevo.");

    } finally {

      setCargando(false);

    }

  }, [clave]);
 
  useEffect(() => {

    cargar();

  }, [cargar]);
 
  return { registros, total, paginas, cargando, error, recargar: cargar };

}
 
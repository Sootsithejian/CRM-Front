import { useCallback, useEffect, useState } from "react";

import { mensajeDeError } from "../../../shared/api/client";

import { listarPagos } from "../api/pagos.api";

import type { FiltrosPagos, PagoListado } from "../types";

export function usePagos(filtros: FiltrosPagos) {
  const [pagos, setPagos] = useState<PagoListado[]>([]);
  const [total, setTotal] = useState(0);
  const [paginas, setPaginas] = useState(0);
  const [sumaMonto, setSumaMonto] = useState(0);
  const [sumaMultas, setSumaMultas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clave = JSON.stringify(filtros);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const data = await listarPagos(JSON.parse(clave));
      setPagos(data.pagos);
      setTotal(data.total);
      setPaginas(data.paginas);
      setSumaMonto(data.suma_monto);
      setSumaMultas(data.suma_multas);
    } catch (e) {
      // El backend explica los 400 (p. ej. rango de fechas invertido).
      setError(mensajeDeError(e, "No se pudieron cargar los pagos. Intenta de nuevo."));
    } finally {
      setCargando(false);
    }
  }, [clave]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { pagos, total, paginas, sumaMonto, sumaMultas, cargando, error, recargar: cargar };
}

import { useCallback, useEffect, useState } from "react";

import { listarClientes } from "../api/clientes.api";

import type { ClienteListado, FiltrosClientes } from "../types";
 
interface EstadoListado {

  clientes: ClienteListado[];

  total: number;

  pagina: number;

  paginas: number;

  cargando: boolean;

  error: string | null;

}
 
const ESTADO_INICIAL: EstadoListado = {

  clientes: [],

  total: 0,

  pagina: 1,

  paginas: 0,

  cargando: true,

  error: null

};
 
export function useClientes(filtros: FiltrosClientes) {

  const [estado, setEstado] = useState<EstadoListado>(ESTADO_INICIAL);
 
  // Serializar evita que el efecto se dispare en cada render por

  // recibir un objeto nuevo con el mismo contenido.

  const clave = JSON.stringify(filtros);
 
  const cargar = useCallback(async () => {

    setEstado((prev) => ({ ...prev, cargando: true, error: null }));
 
    try {

      const data = await listarClientes(JSON.parse(clave));

      setEstado({

        clientes: data.clientes,

        total: data.total,

        pagina: data.pagina,

        paginas: data.paginas,

        cargando: false,

        error: null

      });

    } catch {

      setEstado((prev) => ({

        ...prev,

        cargando: false,

        error: "No se pudieron cargar los clientes. Intenta de nuevo."

      }));

    }

  }, [clave]);
 
  useEffect(() => {

    cargar();

  }, [cargar]);
 
  return { ...estado, recargar: cargar };

}
 
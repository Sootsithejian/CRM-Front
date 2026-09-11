import { useEffect, useState } from "react";

import { contarUsuarios } from "../api/usuarios.api";

import type { ConteoUsuarios } from "../types";
 
interface EstadoConteo {

  conteo: ConteoUsuarios | null;

  cargando: boolean;

  error: boolean;

}
 
/** Conteo de usuarios desde GET /api/usuarios/conteo. */

export function useConteoUsuarios(): EstadoConteo {

  const [estado, setEstado] = useState<EstadoConteo>({

    conteo: null,

    cargando: true,

    error: false,

  });
 
  useEffect(() => {

    let cancelado = false;
 
    contarUsuarios()

      .then((conteo) => {

        if (cancelado) return;

        setEstado({ conteo, cargando: false, error: false });

      })

      .catch(() => {

        if (cancelado) return;

        setEstado({ conteo: null, cargando: false, error: true });

      });
 
    return () => {

      cancelado = true;

    };

  }, []);
 
  return estado;

}
 
import { useEffect, useState } from "react";

import { obtenerCatalogos } from "../api/clientes.api";

import type { Catalogos } from "../types";
 
export function useCatalogos() {

  const [catalogos, setCatalogos] = useState<Catalogos>({ zonas: [], sectores: [] });
 
  useEffect(() => {

    let cancelado = false;
 
    obtenerCatalogos()

      .then((data) => {

        if (!cancelado) setCatalogos(data);

      })

      .catch(() => {

        // Sin catálogos los selects quedan vacíos; no vale la pena

        // romper la pantalla por esto.

      });
 
    return () => {

      cancelado = true;

    };

  }, []);
 
  return catalogos;

}
 
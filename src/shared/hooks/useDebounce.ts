import { useEffect, useState } from "react";
 
/** Retrasa la propagación de un valor. Evita disparar un request por tecla. */
export function useDebounce<T>(valor: T, ms = 400): T {
  const [diferido, setDiferido] = useState(valor);
 
  useEffect(() => {
    const timer = setTimeout(() => setDiferido(valor), ms);
    return () => clearTimeout(timer);
  }, [valor, ms]);
 
  return diferido;
}
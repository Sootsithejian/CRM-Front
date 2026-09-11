import {

  createContext,

  useCallback,

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";

import type { ReactNode } from "react";

import { useNavigate } from "react-router-dom";

import { registrarManejadorDeSesionExpirada } from "../../../shared/api/client";

import * as authApi from "../api/auth.api";

import {

  borrarToken,

  decodificarSesion,

  guardarToken,

  recuperarSesion,

} from "../lib/session";

import type { Sesion, UsuarioPerfil } from "../types";
 
interface AuthContextValue {

  sesion: Sesion | null;

  perfil: UsuarioPerfil | null;

  cargandoPerfil: boolean;

  estaAutenticado: boolean;

  iniciarSesion: (token: string) => Sesion;

  cerrarSesion: () => void;

}
 
export const AuthContext = createContext<AuthContextValue | null>(null);
 
export function AuthProvider({ children }: { children: ReactNode }) {

  const navigate = useNavigate();
 
  // Lectura síncrona: evita el parpadeo de "no autenticado" al recargar.

  const [sesion, setSesion] = useState<Sesion | null>(() => recuperarSesion());

  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);

  const [cargandoPerfil, setCargandoPerfil] = useState(false);
 
  const cerrarSesion = useCallback(() => {

    borrarToken();

    setSesion(null);

    setPerfil(null);

    navigate("/login", { replace: true });

  }, [navigate]);
 
  const iniciarSesion = useCallback((token: string): Sesion => {

    const nueva = decodificarSesion(token);

    if (!nueva) {

      throw new Error("El token recibido no es válido.");

    }

    guardarToken(token);

    setSesion(nueva);

    return nueva;

  }, []);
 
  // El interceptor de axios necesita poder cerrar sesión sin recargar la página.

  useEffect(() => {

    registrarManejadorDeSesionExpirada(() => {

      setSesion(null);

      setPerfil(null);

      navigate("/login", { replace: true });

    });

  }, [navigate]);
 
  // Carga el perfil una sola vez por sesión.

  useEffect(() => {

    if (!sesion) {

      setPerfil(null);

      return;

    }
 
    let cancelado = false;

    setCargandoPerfil(true);
 
    authApi

      .obtenerPerfil()

      .then((datos) => {

        if (!cancelado) setPerfil(datos);

      })

      .catch(() => {

        // Un 401 aquí ya lo maneja el interceptor. Otros errores no deben

        // tumbar la sesión: la UI cae al dato del token.

      })

      .finally(() => {

        if (!cancelado) setCargandoPerfil(false);

      });
 
    return () => {

      cancelado = true;

    };

  }, [sesion]);
 
  // Cierre automático al expirar el token estando la pestaña abierta.

  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {

    window.clearTimeout(timeoutRef.current);

    if (!sesion) return;
 
    const restante = sesion.expiraEn - Date.now();

    if (restante <= 0) {

      cerrarSesion();

      return;

    }
 
    // setTimeout satura arriba de ~24.8 días; 8h entra sin problema.

    timeoutRef.current = window.setTimeout(cerrarSesion, restante);

    return () => window.clearTimeout(timeoutRef.current);

  }, [sesion, cerrarSesion]);
 
  const valor = useMemo<AuthContextValue>(

    () => ({

      sesion,

      perfil,

      cargandoPerfil,

      estaAutenticado: sesion !== null,

      iniciarSesion,

      cerrarSesion,

    }),

    [sesion, perfil, cargandoPerfil, iniciarSesion, cerrarSesion]

  );
 
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;

}
 
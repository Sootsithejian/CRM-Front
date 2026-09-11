import axios from "axios";

import type { LoginError } from "../types";
 
function parsearFecha(valor: unknown): Date | undefined {

  if (typeof valor !== "string") return undefined;

  const fecha = new Date(valor);

  return Number.isNaN(fecha.getTime()) ? undefined : fecha;

}
 
/** Traduce el error HTTP del backend a algo que el usuario entienda. */

export function mapearErrorDeLogin(error: unknown): LoginError {

  if (!axios.isAxiosError(error)) {

    return {

      variante: "error",

      titulo: "Error inesperado",

      detalle: "Ocurrió un problema al procesar tu solicitud. Intenta de nuevo.",

    };

  }
 
  // Sin respuesta: red caída, backend apagado o CORS mal configurado.

  if (!error.response) {

    const esTimeout = error.code === "ECONNABORTED";

    return {

      variante: "error",

      titulo: esTimeout ? "El servidor tardó demasiado" : "Sin conexión con el servidor",

      detalle: esTimeout

        ? "La solicitud excedió el tiempo de espera. Verifica tu conexión e intenta de nuevo."

        : "No pudimos contactar al servidor. Revisa tu conexión e intenta de nuevo.",

    };

  }
 
  const { status, data } = error.response;

  const cuerpo = (data ?? {}) as { message?: string; bloqueado_hasta?: string };
 
  switch (status) {

    case 400:

      return {

        variante: "error",

        titulo: "Datos incompletos",

        detalle: "Captura tu usuario y tu contraseña para continuar.",

      };
 
    case 401:

      return {

        variante: "error",

        titulo: "Credenciales incorrectas",

        detalle:

          "El usuario o la contraseña no coinciden. Tras 5 intentos fallidos la cuenta se bloquea 15 minutos.",

      };
 
    case 403:

      return {

        variante: "warning",

        titulo: "Cuenta inactiva",

        detalle:

          "Tu usuario está dado de baja. Contacta a un administrador para reactivarlo.",

      };
 
    case 423: {

      const bloqueadoHasta = parsearFecha(cuerpo.bloqueado_hasta);

      return {

        variante: "warning",

        titulo: "Cuenta bloqueada temporalmente",

        detalle: bloqueadoHasta

          ? `Por seguridad, tu cuenta está bloqueada. Podrás intentar de nuevo ${describirEspera(bloqueadoHasta)}.`

          : "Superaste el número de intentos permitidos. Tu cuenta quedó bloqueada durante 15 minutos.",

        bloqueadoHasta,

      };

    }
 
    case 429:

      return {

        variante: "warning",

        titulo: "Demasiados intentos",

        detalle:

          "Se registraron muchas solicitudes desde esta conexión. Espera unos minutos antes de volver a intentar.",

      };
 
    case 500:

      return {

        variante: "error",

        titulo: "Error del servidor",

        detalle:

          "No pudimos procesar el inicio de sesión. Intenta más tarde o avisa al área de sistemas.",

      };
 
    default:

      return {

        variante: "error",

        titulo: "No se pudo iniciar sesión",

        detalle:

          cuerpo.message?.trim() ||

          "Ocurrió un problema inesperado. Intenta de nuevo.",

      };

  }

}
 
/** "en 12 minutos (a las 14:35)" */

function describirEspera(hasta: Date): string {

  const minutos = Math.max(1, Math.ceil((hasta.getTime() - Date.now()) / 60000));

  const hora = hasta.toLocaleTimeString("es-MX", {

    hour: "2-digit",

    minute: "2-digit",

  });

  const unidad = minutos === 1 ? "minuto" : "minutos";

  return `en ${minutos} ${unidad} (a las ${hora})`;

}
 
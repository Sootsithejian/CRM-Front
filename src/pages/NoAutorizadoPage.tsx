import { Link } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";

import { Button, Card } from "../shared/ui";

import { ETIQUETA_ROL, rutaInicioDe } from "../shared/constants/roles";
 
export function NoAutorizadoPage() {

  const { sesion, cerrarSesion } = useAuth();
 
  return (
<div

      style={{

        minHeight: "100dvh",

        display: "grid",

        placeItems: "center",

        padding: "var(--space-4)",

      }}
>
<Card elevation="raised" style={{ maxWidth: "440px", textAlign: "center" }}>
<h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-3)" }}>

          Acceso restringido
</h1>
<p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-6)" }}>

          Tu rol

          {sesion ? ` (${ETIQUETA_ROL[sesion.rol]})` : ""} no tiene permiso para

          ver esta sección. Si crees que es un error, contacta a un

          administrador.
</p>
 
        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
<Link to={rutaInicioDe(sesion?.rol)}>
<Button>Volver al inicio</Button>
</Link>
<Button variant="secondary" onClick={cerrarSesion}>

            Cerrar sesión
</Button>
</div>
</Card>
</div>

  );

}
 
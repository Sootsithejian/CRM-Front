import { Link } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";

import { Button, Card } from "../shared/ui";

import { rutaInicioDe } from "../shared/constants/roles";
 
export function NotFoundPage() {

  const { sesion } = useAuth();

  const destino = sesion ? rutaInicioDe(sesion.rol) : "/login";
 
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

          Página no encontrada
</h1>
<p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-6)" }}>

          La dirección que abriste no existe.
</p>
<Link to={destino}>
<Button>{sesion ? "Volver al inicio" : "Ir al login"}</Button>
</Link>
</Card>
</div>

  );

}
 
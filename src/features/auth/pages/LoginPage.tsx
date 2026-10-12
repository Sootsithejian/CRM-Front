import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import logo from "../../../assets/logo-credimil.webp";
import { Alert, Button, Input } from "../../../shared/ui";
import { rutaInicioDe } from "../../../shared/constants/roles";
import { useAuth } from "../hooks/useAuth";
import * as authApi from "../api/auth.api";
import { mapearErrorDeLogin } from "../lib/loginErrors";
import type { LoginError } from "../types";

const esquema = z.object({
  usuario: z.string().trim().min(1, "Captura tu usuario."),
  password: z.string().min(1, "Captura tu contraseña."),
});

type FormValues = z.infer<typeof esquema>;

export function LoginPage() {
  const { sesion, iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorApi, setErrorApi] = useState<LoginError | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(esquema),
    defaultValues: { usuario: "", password: "" },
  });

  useEffect(() => {
    setFocus("usuario");
  }, [setFocus]);

  if (sesion) {
    return <Navigate to={rutaInicioDe(sesion.rol)} replace />;
  }

  const onSubmit = async (valores: FormValues) => {
    setErrorApi(null);
    try {
      const { token } = await authApi.login(valores);
      const nueva = iniciarSesion(token);

      const desde = (location.state as { desde?: { pathname: string } } | null)
        ?.desde?.pathname;

      navigate(desde ?? rutaInicioDe(nueva.rol), { replace: true });
    } catch (error) {
      setErrorApi(mapearErrorDeLogin(error));
    }
  };

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-none">
      <aside className="relative isolate flex flex-col gap-4 overflow-hidden bg-navy-800 px-5 py-5 text-white lg:justify-between lg:px-12 lg:py-12">
        {/* Retícula de 1px que se desvanece hacia abajo a la derecha */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_75%)] lg:block"
        />

        <img
          src={logo}
          alt="CrediMil Servicios"
          className="h-auto w-28 lg:w-36"
          width={320}
          height={200}
        />

        <div className="flex gap-3 lg:gap-5">
          {/* Único acento de marca de la pantalla */}
          <span
            aria-hidden="true"
            className="w-0.5 shrink-0 rounded-full bg-accent-500"
          />
          <p className="max-w-[40ch] text-sm leading-snug text-white/85 lg:max-w-[18ch] lg:text-3xl lg:leading-tight lg:font-semibold lg:tracking-tight lg:text-balance lg:text-white">
            Plataforma integral de gestión de créditos, clientes y pagos.
          </p>
        </div>
      </aside>

      <main className="flex flex-col bg-white px-5 py-8 lg:justify-center lg:px-16 lg:py-12">
        <div className="mx-auto w-full max-w-[360px]">
          <p className="mb-2 text-sm font-medium text-slate-500">
            Acceso al portal
          </p>
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">
            Bienvenido de nuevo
          </h1>
          <p className="mb-8 text-sm text-slate-500">
            Ingresa con tu usuario y contraseña de CrediMil.
          </p>

          {errorApi && (
            <div className="mb-5">
              <Alert
                variant={errorApi.variante}
                title={errorApi.titulo}
                onDismiss={() => setErrorApi(null)}
              >
                {errorApi.detalle}
              </Alert>
            </div>
          )}

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Input
              label="Usuario"
              placeholder="tu.usuario"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              disabled={isSubmitting}
              error={errors.usuario?.message}
              {...register("usuario")}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              revealable
              disabled={isSubmitting}
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              className="mt-2"
            >
              Ingresar
            </Button>
          </form>

          <p className="mt-12 border-t border-slate-200 pt-5 text-xs text-slate-500">
            © {new Date().getFullYear()} CrediMil Servicios
          </p>
        </div>
      </main>
    </div>
  );
}

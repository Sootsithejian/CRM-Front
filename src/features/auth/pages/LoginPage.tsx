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
<aside className="flex flex-col items-center justify-center gap-3 bg-navy-800 px-4 py-6 text-center text-white lg:gap-4 lg:px-6 lg:py-8">
<img

          src={logo}

          alt="CrediMil Servicios"

          className="h-auto w-[min(220px,60%)] lg:w-[min(320px,70%)]"

          width={320}

          height={200}

        />
<span

          className="h-0.5 w-10 rounded-full bg-white/90 lg:w-14"

          aria-hidden="true"

        />
<p className="max-w-[34ch] text-sm font-semibold leading-normal lg:max-w-[22ch] lg:text-lg">

          Plataforma integral de gestión de créditos, clientes y pagos.
</p>
</aside>
 
      <main className="flex flex-col justify-center bg-white px-5 py-10 lg:px-10 lg:py-12">
<div className="mx-auto w-full max-w-[420px]">
<p className="mb-2 text-sm font-bold text-accent-500">

            Acceso al Portal
</p>
<h1 className="mb-2 text-3xl text-slate-900">Bienvenido de nuevo</h1>
<p className="mb-8 text-base text-slate-500">

            Ingresa tus credenciales para acceder al panel administrativo.
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

              size="lg"

              fullWidth

              loading={isSubmitting}

              className="mt-3"
>

              Ingresar
</Button>
</form>
 
          <p className="mt-12 text-center text-xs text-slate-400">

            © {new Date().getFullYear()} CrediMil Servicios. Todos los derechos

            reservados.
</p>
</div>
</main>
</div>

  );

}
 
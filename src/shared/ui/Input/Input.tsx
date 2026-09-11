import { forwardRef, useId, useState } from "react";

import type { InputHTMLAttributes } from "react";
 
const INPUT_BASE =

  "w-full min-h-11 px-4 rounded-lg border bg-white text-base text-slate-900 " +

  "placeholder:text-slate-400 transition duration-150 focus:outline-none " +

  "disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed";
 
const INPUT_NORMAL =

  "border-slate-300 hover:not-disabled:read-write:border-slate-400 " +

  "focus:border-primary-500 focus:ring-3 focus:ring-primary-500/35";
 
const INPUT_ERROR =

  "border-accent-500 hover:border-accent-500 " +

  "focus:border-accent-500 focus:ring-3 focus:ring-accent-100";
 
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {

  label?: string;

  error?: string;

  hint?: string;

  /** Muestra el botón de ojo para alternar visibilidad (solo type="password") */

  revealable?: boolean;

}
 
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(

  {

    label,

    error,

    hint,

    revealable = false,

    required,

    type = "text",

    className,

    ...rest

  },

  ref

) {

  const id = useId();

  const [revealed, setRevealed] = useState(false);
 
  const hasAction = revealable && type === "password";

  const resolvedType = hasAction && revealed ? "text" : type;
 
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
 
  const inputClases = [

    INPUT_BASE,

    error ? INPUT_ERROR : INPUT_NORMAL,

    hasAction && "pr-12",

    className,

  ]

    .filter(Boolean)

    .join(" ");
 
  return (
<div className="flex flex-col gap-2">

      {label && (
<label className="text-sm font-medium text-slate-900" htmlFor={id}>

          {label}

          {required && (
<span className="ml-1 text-accent-500" aria-hidden="true">

              *
</span>

          )}
</label>

      )}
 
      <div className="relative flex items-center">
<input

          ref={ref}

          id={id}

          type={resolvedType}

          required={required}

          aria-invalid={error ? true : undefined}

          aria-describedby={messageId}

          className={inputClases}

          {...rest}

        />
 
        {hasAction && (
<button

            type="button"

            className="absolute right-2 flex size-8 items-center justify-center rounded text-slate-500 transition duration-150 hover:bg-slate-100 hover:text-slate-900"

            onClick={() => setRevealed((v) => !v)}

            aria-label={revealed ? "Ocultar contraseña" : "Mostrar contraseña"}

            tabIndex={-1}
>

            {revealed ? <EyeOffIcon /> : <EyeIcon />}
</button>

        )}
</div>
 
      {error ? (
<span

          id={messageId}

          className="text-xs leading-normal font-medium text-accent-600"
>

          {error}
</span>

      ) : hint ? (
<span id={messageId} className="text-xs leading-normal text-slate-500">

          {hint}
</span>

      ) : null}
</div>

  );

});
 
function EyeIcon() {

  return (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
<circle cx="12" cy="12" r="3" />
</svg>

  );

}
 
function EyeOffIcon() {

  return (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M10.7 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.4 4.2M6.6 6.6A17.6 17.6 0 0 0 2 12s3.6 7 10 7a10.7 10.7 0 0 0 5.4-1.4" />
<path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
<path d="m2 2 20 20" />
</svg>

  );

}
 
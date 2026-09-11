import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Spinner } from "../Spinner/Spinner";
 
type Variant = "primary" | "secondary" | "ghost" | "danger";

type Size = "sm" | "md" | "lg";
 
const BASE =

  "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent " +

  "text-center leading-none font-semibold whitespace-nowrap " +

  "transition duration-150 disabled:cursor-not-allowed disabled:opacity-55";
 
const VARIANTES: Record<Variant, string> = {

  primary:

    "bg-primary-500 text-white hover:not-disabled:bg-primary-600 active:not-disabled:bg-primary-700",

  secondary:

    "bg-white border-slate-300 text-slate-900 hover:not-disabled:bg-slate-50 hover:not-disabled:border-slate-400 active:not-disabled:bg-slate-100",

  ghost:

    "bg-transparent text-slate-500 hover:not-disabled:bg-slate-100 hover:not-disabled:text-slate-900",

  danger:

    "bg-accent-500 text-white hover:not-disabled:bg-accent-600 active:not-disabled:bg-accent-700",

};
 
const TAMAÑOS: Record<Size, string> = {

  sm: "min-h-9 px-4 text-xs",

  md: "min-h-11 px-5 text-sm",

  lg: "min-h-13 px-6 text-base",

};
 
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

  variant?: Variant;

  size?: Size;

  fullWidth?: boolean;

  loading?: boolean;

  children: ReactNode;

}
 
export function Button({

  variant = "primary",

  size = "md",

  fullWidth = false,

  loading = false,

  disabled,

  children,

  className,

  type = "button",

  ...rest

}: ButtonProps) {

  const clases = [

    BASE,

    VARIANTES[variant],

    TAMAÑOS[size],

    fullWidth && "w-full",

    loading && "relative",

    className,

  ]

    .filter(Boolean)

    .join(" ");
 
  return (
<button

      type={type}

      className={clases}

      disabled={disabled || loading}

      aria-busy={loading || undefined}

      {...rest}
>
<span className={`inline-flex items-center gap-2 ${loading ? "invisible" : ""}`}>

        {children}
</span>

      {loading && (
<span className="absolute inset-0 flex items-center justify-center">
<Spinner size="sm" label={null} />
</span>

      )}
</button>

  );

}
 
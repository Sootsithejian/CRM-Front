import type { HTMLAttributes, ReactNode } from "react";
 
type Elevation = "flat" | "raised" | "floating";
 
const ELEVACIONES: Record<Elevation, string> = {

  flat: "shadow-none",

  raised: "shadow-md",

  floating: "shadow-xl",

};
 
interface CardProps extends HTMLAttributes<HTMLDivElement> {

  elevation?: Elevation;

  padded?: boolean;

  title?: string;

  subtitle?: string;

  children: ReactNode;

}
 
export function Card({

  elevation = "flat",

  padded = true,

  title,

  subtitle,

  children,

  className,

  ...rest

}: CardProps) {

  const clases = [

    "bg-white border border-slate-200 rounded-xl",

    ELEVACIONES[elevation],

    padded && "p-6 md:p-8",

    className,

  ]

    .filter(Boolean)

    .join(" ");
 
  return (
<div className={clases} {...rest}>

      {(title || subtitle) && (
<div className="mb-6 flex flex-col gap-1">

          {title && (
<h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          )}

          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
</div>

      )}

      {children}
</div>

  );

}
 
import type { ReactNode } from "react";
 
type AlertVariant = "error" | "warning" | "success" | "info";
 
const VARIANTES: Record<AlertVariant, string> = {

  error: "bg-red-50 border-red-200 text-red-800",

  warning: "bg-amber-50 border-amber-200 text-amber-800",

  success: "bg-green-50 border-green-200 text-green-800",

  info: "bg-sky-50 border-sky-200 text-sky-800",

};
 
interface AlertProps {

  variant?: AlertVariant;

  title?: string;

  children: ReactNode;

  onDismiss?: () => void;

}
 
export function Alert({

  variant = "info",

  title,

  children,

  onDismiss,

}: AlertProps) {

  return (
<div

      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-normal ${VARIANTES[variant]}`}

      role={variant === "error" ? "alert" : "status"}
>
<span className="mt-px shrink-0" aria-hidden="true">
<AlertIcon variant={variant} />
</span>
 
      <div className="min-w-0 flex-1">

        {title && <div className="mb-1 font-semibold">{title}</div>}
<div>{children}</div>
</div>
 
      {onDismiss && (
<button

          type="button"

          className="flex size-5 shrink-0 items-center justify-center rounded text-current opacity-60 transition duration-150 hover:opacity-100"

          onClick={onDismiss}

          aria-label="Cerrar aviso"
>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
<path d="M18 6 6 18M6 6l12 12" />
</svg>
</button>

      )}
</div>

  );

}
 
function AlertIcon({ variant }: { variant: AlertVariant }) {

  const common = {

    width: 18,

    height: 18,

    viewBox: "0 0 24 24",

    fill: "none",

    stroke: "currentColor",

    strokeWidth: 2,

    strokeLinecap: "round" as const,

    strokeLinejoin: "round" as const,

  };
 
  if (variant === "success") {

    return (
<svg {...common}>
<circle cx="12" cy="12" r="10" />
<path d="m8.5 12.5 2.5 2.5 4.5-5" />
</svg>

    );

  }
 
  if (variant === "error" || variant === "warning") {

    return (
<svg {...common}>
<circle cx="12" cy="12" r="10" />
<path d="M12 7v6" />
<path d="M12 16.5h.01" />
</svg>

    );

  }
 
  return (
<svg {...common}>
<circle cx="12" cy="12" r="10" />
<path d="M12 16v-5" />
<path d="M12 8h.01" />
</svg>

  );

}
 
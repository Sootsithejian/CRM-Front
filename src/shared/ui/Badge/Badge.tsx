import type {ReactNode} from "react";

type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";

const VARIANTES: Record<BadgeVariant, string> = {
    neutral: "bg-slate-100 text-slate-700",
    info: "bg-sky-100 text-sky-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
};

interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
}

export function Badge({variant = "neutral", children}: BadgeProps) {
    return (
        <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${VARIANTES[variant]}`}
        >
          {children}
        </span>
    );
}
type SpinnerSize = "sm"| "md" | "lg" ;

const TAMAÑOS:  Record<SpinnerSize, string> = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-10 border-[3px]"
}

interface SpinnerProps {
    size?: SpinnerSize;
    centered?: boolean;
    label?: string | null;
}

export function Spinner({
    size = "md",
    centered = false,
    label = "Cargando",

}: SpinnerProps) {
    const spinner = (
        <span
          className={`inline-block shrink-0 animate-spin rounded-full border-solid border-current border-r-transparent ${TAMAÑOS[size]}`}
          role={label ?? undefined}
          aria-label={label ?? undefined}
          aria-hidden={label ? undefined: true}
          />
    );

    if (!centered) return spinner;

    return <div className="flex items-center justify-center p-8">{spinner}</div>
}
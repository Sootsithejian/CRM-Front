interface SkeletonProps {
    className?: string;
}

export function Skeleton({className="h-4 w-full"}: SkeletonProps) {
    return (
        <span
        className={`block animate-pulse rounded bg-slate-200 ${className}`}
        aria-hidden="true"
        />
    );
}
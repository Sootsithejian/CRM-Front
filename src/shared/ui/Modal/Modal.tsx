import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

import { X } from "lucide-react";

interface ModalProps {

    abierto: boolean;

    titulo: string;

    descripcion?: string;

    children: ReactNode;

    onCerrar: () => void;

}

export function Modal({

    abierto,

    titulo,

    descripcion,

    children,

    onCerrar,

}: ModalProps) {

    const panelRef = useRef<HTMLDivElement>(null);

    // Cerrar con Escape.

    useEffect(() => {

        if (!abierto) return;

        const alPresionar = (e: KeyboardEvent) => {

            if (e.key === "Escape") onCerrar();

        };

        window.addEventListener("keydown", alPresionar);

        return () => window.removeEventListener("keydown", alPresionar);

    }, [abierto, onCerrar]);

    // Bloquear scroll del fondo.

    useEffect(() => {

        document.body.style.overflow = abierto ? "hidden" : "";

        return () => {

            document.body.style.overflow = "";

        };

    }, [abierto]);

    // Mover el foco al panel al abrir, para que el teclado entre al diálogo.

    useEffect(() => {

        if (abierto) panelRef.current?.focus();

    }, [abierto]);

    if (!abierto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button

                type="button"

                className="absolute inset-0 bg-slate-900/50"

                onClick={onCerrar}

                aria-label="Cerrar"

                tabIndex={-1}

            />

            <div

                ref={panelRef}

                role="dialog"

                aria-modal="true"

                aria-labelledby="modal-titulo"

                tabIndex={-1}

                className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl focus:outline-none"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 id="modal-titulo" className="text-lg font-bold text-slate-900">

                            {titulo}
                        </h2>

                        {descripcion && (
                            <p className="mt-1 text-sm text-slate-500">{descripcion}</p>

                        )}
                    </div>

                    <button

                        type="button"

                        onClick={onCerrar}

                        aria-label="Cerrar"

                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition duration-150 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                {children}
            </div>
        </div>

    );

}

import { forwardRef, useId } from "react";

import type { SelectHTMLAttributes } from "react";

import { ChevronDown } from "lucide-react";

interface OpcionSelect {

    valor: string;

    etiqueta: string;

}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {

    label?: string;

    error?: string;

    opciones: OpcionSelect[];

    /** Opción vacía inicial, p. ej. "Todas las zonas". */

    placeholder?: string;

}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(

    { label, error, opciones, placeholder, required, className, ...rest },

    ref

) {

    const id = useId();

    return (
        <div className="flex flex-col gap-2">

            {label && (
                <label className="text-sm font-medium text-slate-900" htmlFor={id}>

                    {label}

                    {required && <span className="ml-1 text-accent-500" aria-hidden="true">*</span>}
                </label>

            )}

            <div className="relative flex items-center">
                <select

                    ref={ref}

                    id={id}

                    required={required}

                    aria-invalid={error ? true : undefined}

                    className={`w-full min-h-11 appearance-none rounded-lg border bg-white py-0 pr-10 pl-4 text-base text-slate-900 transition duration-150 focus:outline-none focus:ring-3 disabled:cursor-not-allowed disabled:bg-slate-100 ${error

                            ? "border-accent-500 focus:border-accent-500 focus:ring-accent-100"

                            : "border-slate-300 hover:not-disabled:border-slate-400 focus:border-primary-500 focus:ring-primary-500/35"

                        } ${className ?? ""}`}

                    {...rest}
                >

                    {placeholder && <option value="">{placeholder}</option>}

                    {opciones.map((o) => (
                        <option key={o.valor} value={o.valor}>

                            {o.etiqueta}
                        </option>

                    ))}
                </select>

                <ChevronDown

                    size={18}

                    className="pointer-events-none absolute right-3 text-slate-500"

                    aria-hidden="true"

                />
            </div>

            {error && (
                <span className="text-xs font-medium text-accent-600">{error}</span>

            )}
        </div>

    );

});

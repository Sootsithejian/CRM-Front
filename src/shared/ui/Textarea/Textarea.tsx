import { forwardRef, useId } from "react";

import type { TextareaHTMLAttributes } from "react";

interface TextareaProps

    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {

    label?: string;

    error?: string;

    hint?: string;

}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(

    function Textarea({ label, error, hint, required, className, ...rest }, ref) {

        const id = useId();

        const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

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

                <textarea

                    ref={ref}

                    id={id}

                    required={required}

                    aria-invalid={error ? true : undefined}

                    aria-describedby={messageId}

                    className={`w-full resize-y rounded-lg border bg-white px-4 py-3 text-base text-slate-900 transition duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-3 disabled:cursor-not-allowed disabled:bg-slate-100 ${error

                            ? "border-accent-500 focus:border-accent-500 focus:ring-accent-100"

                            : "border-slate-300 hover:not-disabled:border-slate-400 focus:border-primary-500 focus:ring-primary-500/35"

                        } ${className ?? ""}`}

                    {...rest}

                />

                {error ? (
                    <span id={messageId} className="text-xs font-medium text-accent-600">

                        {error}
                    </span>

                ) : hint ? (
                    <span id={messageId} className="text-xs text-slate-500">

                        {hint}
                    </span>

                ) : null}
            </div>

        );

    }

);

import { useRef, useState } from "react";

import { FileText, UploadCloud, X } from "lucide-react";
 
const MIMES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const MAX = 10 * 1024 * 1024;
 
interface FileInputProps {

  label: string;

  required?: boolean;

  archivo: File | null;

  onCambiar: (archivo: File | null) => void;

  disabled?: boolean;

}
 
export function FileInput({

  label,

  required = false,

  archivo,

  onCambiar,

  disabled = false,

}: FileInputProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
 
  const elegir = (f: File | null) => {

    setError(null);

    if (!f) return onCambiar(null);
 
    if (!MIMES.includes(f.type)) {

      setError("Formato no admitido. Usa JPG, PNG, WEBP o PDF.");

      return;

    }

    if (f.size > MAX) {

      setError("El archivo excede 10 MB.");

      return;

    }

    onCambiar(f);

  };
 
  const quitar = () => {

    onCambiar(null);

    setError(null);

    if (inputRef.current) inputRef.current.value = "";

  };
 
  return (
<div className="flex flex-col gap-2">
<p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">

        {label}

        {required && <span className="ml-1 text-accent-500">*</span>}
</p>
 
      {archivo ? (
<div className="flex items-center gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
<FileText size={20} className="shrink-0 text-primary-600" aria-hidden="true" />
<div className="min-w-0 flex-1">
<p className="truncate text-sm font-medium text-slate-900">

              {archivo.name}
</p>
<p className="text-xs text-slate-500">

              {(archivo.size / 1024).toFixed(0)} KB
</p>
</div>
<button

            type="button"

            onClick={quitar}

            disabled={disabled}

            aria-label={`Quitar ${label}`}

            className="flex size-7 shrink-0 items-center justify-center rounded text-slate-500 transition duration-150 hover:bg-white hover:text-slate-900 disabled:opacity-40"
>
<X size={16} aria-hidden="true" />
</button>
</div>

      ) : (
<button

          type="button"

          onClick={() => inputRef.current?.click()}

          disabled={disabled}

          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 transition duration-150 hover:border-primary-500 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
>
<UploadCloud size={24} className="text-slate-500" aria-hidden="true" />
<span className="text-sm font-medium text-slate-700">Subir archivo</span>
<span className="text-xs text-slate-400">

            Formatos admitidos: PDF, JPG, PNG
</span>
</button>

      )}
 
      <input

        ref={inputRef}

        type="file"

        className="hidden"

        accept=".jpg,.jpeg,.png,.webp,.pdf"

        onChange={(e) => elegir(e.target.files?.[0] ?? null)}

      />
 
      {error && (
<span className="text-xs font-medium text-accent-600">{error}</span>

      )}
</div>

  );

}
 
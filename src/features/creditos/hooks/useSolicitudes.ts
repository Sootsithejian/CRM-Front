import { useCallback, useEffect, useState } from "react";
import { listarSolicitudes } from "../api/creditos.api";
import type { FiltrosSolicitudes, SolicitudListado} from "../types";

export function useSolicitudes(filtros: FiltrosSolicitudes) {
    const [solicitudes, setSolicitudes] = useState<SolicitudListado[]>([]);
    const [total, setTotal] = useState(0);
    const [paginas, setPaginas] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clave = JSON.stringify(filtros);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await listarSolicitudes(JSON.parse(clave));
            setSolicitudes(data.solicitudes);
            setTotal(data.total);
            setPaginas(data.paginas);
        } catch {
            setError("Ocurrió un error al cargar las solicitudes.");
        } finally {
            setCargando(false);
        }
    }, [clave]);

    useEffect(() => {
        cargar();
    } , [cargar]);
    
    return {solicitudes, total, paginas, cargando, error, recargar: cargar};
}
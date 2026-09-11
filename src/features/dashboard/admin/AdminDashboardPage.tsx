import { useAuth } from "../../auth/hooks/useAuth";

import { AccionesRapidas } from "./components/AccionesRapidas";

import { ActividadReciente } from "./components/ActividadReciente";

import { DashboardHeader } from "./components/DashboardHeader";

import { FilaKpis } from "./components/FilaKpis";

import {GraficaCreditos} from "./components/GraficaCreditos"

import {PagosProximos} from "./components/PagosProximos";

export function AdminDashboardPage() {

    const { sesion, perfil } = useAuth();

    const nombre = perfil?.nombre?.trim().split(" ")[0] || sesion?.usuario || "";

    return (
        <>
            <DashboardHeader nombre={nombre} />
            <FilaKpis />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <AccionesRapidas />
                <ActividadReciente />
                <GraficaCreditos />
                <PagosProximos/>
            </div>
        </>

    );

}

import { CreditCard, DollarSign, UserCheck, Users } from "lucide-react";

import { useConteoUsuarios } from "../../../usuarios/hooks/useConteoUsuarios";

import { KpiCard } from "./KpiCard";

import { KPI_CLIENTES, KPI_CREDITOS_ACTIVOS, KPI_INGRESOS } from "../mocks";
 
export function FilaKpis() {

  const { conteo, cargando } = useConteoUsuarios();
 
  return (
<section

      aria-label="Indicadores"

      className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
>

      {/* TODO: conectar a endpoint real cuando exista el módulo de clientes */}
<KpiCard

        label="Clientes Registrados"

        valor={KPI_CLIENTES.valor}

        delta={KPI_CLIENTES.delta}

        icono={Users}

        tono="green"

      />
 
      {/* TODO: conectar a endpoint real cuando exista el módulo de créditos */}
<KpiCard

        label="Créditos Activos"

        valor={KPI_CREDITOS_ACTIVOS.valor}

        delta={KPI_CREDITOS_ACTIVOS.delta}

        icono={CreditCard}

        tono="sky"

      />
 
      {/* TODO: conectar a endpoint real cuando exista el módulo de pagos */}
<KpiCard

        label="Ingresos registrados"

        valor={KPI_INGRESOS.valor}

        delta={KPI_INGRESOS.delta}

        icono={DollarSign}

        tono="amber"

      />
 
      {/* Dato real: GET /api/usuarios/conteo */}
<KpiCard

        label="Usuarios Activos"

        valor={conteo ? String(conteo.activos) : null}

        icono={UserCheck}

        tono="violet"

        cargando={cargando}

      />
</section>

  );

}
 
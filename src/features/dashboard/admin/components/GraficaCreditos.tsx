import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    ResponsiveContainer,
    XAxis,
} from "recharts";
import { CREDITOS_YTD } from "../mocks";

/** Etiqueta en cápsula oscura sobre cada barra. */
function EtiquetaMonto(props: {
    x?: number;
    y?: number;
    width?: number;
    value?: number;
}) {
    const { x = 0, y = 0, width = 0, value = 0 } = props;
    const texto = `$${value}k`;
    const anchoCaja = texto.length * 7 + 12;
    const cx = x + width / 2;

    return (
        <g>
            <rect
                x={cx - anchoCaja / 2}
                y={y - 26}
                width={anchoCaja}
                height={20}
                rx={5}
                className="fill-slate-800"
            />
            <text
                x={cx}
                y={y - 12}
                textAnchor="middle"
                className="fill-white text-[11px] font-semibold"
            >
                {texto}
            </text>
        </g>
    );
}

export function GraficaCreditos() {
    // TODO: conectar a endpoint real cuando exista el módulo de créditos
    const datos = CREDITOS_YTD;

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-bold text-slate-900">
                    Créditos Otorgados (YTD)
                </h2>
                <span className="text-xs text-slate-400">
                    Valores expresados en miles (MXN)
                </span>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={datos}
                        margin={{ top: 36, right: 8, bottom: 8, left: 8 }}
                        barCategoryGap="35%"
                    >
                        <XAxis
                            dataKey="mes"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            dy={8}
                        />
                        <Bar dataKey="monto" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                            {datos.map((punto) => (
                                <Cell key={punto.mes} className="fill-primary-500" />
                            ))}
                            <LabelList dataKey="monto" content={<EtiquetaMonto />} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
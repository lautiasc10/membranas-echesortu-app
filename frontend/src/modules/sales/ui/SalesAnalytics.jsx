import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function SalesAnalytics({ sales }) {
    const analyticsData = useMemo(() => {
        if (!sales || sales.length === 0) return [];

        // Agrupar por mes-año
        const groups = {};

        sales.forEach(s => {
            const date = new Date(s.createdAt);
            if (isNaN(date.getTime())) return;

            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    label: date.toLocaleString('es-AR', { month: 'short', year: '2-digit' }),
                    total: 0,
                    count: 0
                };
            }
            groups[key].total += Number(s.total || 0);
            groups[key].count += 1;
        });

        // Convertir a array y ordenar por fecha
        return Object.values(groups).sort((a, b) => a.key.localeCompare(b.key));
    }, [sales]);

    const maxTotal = useMemo(() => {
        if (analyticsData.length === 0) return 0;
        return Math.max(...analyticsData.map(d => d.total));
    }, [analyticsData]);

    const stats = useMemo(() => {
        if (analyticsData.length < 2) return { delta: 0, current: analyticsData[0]?.total || 0 };

        const current = analyticsData[analyticsData.length - 1].total;
        const previous = analyticsData[analyticsData.length - 2].total;
        const delta = previous === 0 ? 100 : ((current - previous) / previous) * 100;

        return { delta, current };
    }, [analyticsData]);

    const money = (v) => Number(v || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

    if (analyticsData.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <Calendar className="size-8 text-slate-400" />
                </div>
                <CardTitle>Sin datos suficientes</CardTitle>
                <CardDescription>Cargá algunas ventas para ver la comparativa mensual.</CardDescription>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Resumen Superior */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-emerald-600 text-white border-none shadow-lg shadow-emerald-200">
                    <CardHeader className="pb-2">
                        <p className="text-xs font-bold uppercase opacity-80 tracking-wider">Ventas Mes Actual</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-black">{money(stats.current)}</p>
                            <div className={`flex items-center gap-1 text-sm font-bold p-1 rounded ${stats.delta >= 0 ? 'bg-white/20' : 'bg-red-400/20'}`}>
                                {stats.delta >= 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                                {Math.abs(stats.delta).toFixed(1)}%
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Promedio Mensual</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black text-slate-800">
                            {money(analyticsData.reduce((acc, d) => acc + d.total, 0) / analyticsData.length)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Acumulado</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black text-slate-800">
                            {money(analyticsData.reduce((acc, d) => acc + d.total, 0))}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico de Barras */}
            <Card className="border-none shadow-sm overflow-hidden bg-slate-50/50">
                <CardHeader className="flex flex-row items-center justify-between pb-8">
                    <div>
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <BarChart3 className="size-5 text-emerald-600" />
                            Comparativa de Facturación
                        </CardTitle>
                        <CardDescription>Evolución de ventas totales mes a mes.</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter bg-white">
                        <TrendingUp className="size-3 mr-1 text-emerald-500" /> Tendencia Histórica
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full flex items-end gap-2 md:gap-4 px-2">
                        {analyticsData.map((d, idx) => {
                            const height = maxTotal > 0 ? (d.total / maxTotal) * 100 : 0;
                            const isLast = idx === analyticsData.length - 1;

                            return (
                                <div key={d.key} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                    {/* Tooltip on Hover */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        <div className="bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded shadow-xl whitespace-nowrap">
                                            <div className="text-emerald-400 mb-0.5">{d.label}</div>
                                            <div className="text-sm">{money(d.total)}</div>
                                            <div className="opacity-60 font-medium">{d.count} operaciones</div>
                                        </div>
                                        <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                                    </div>

                                    {/* Barra */}
                                    <div className="w-full relative flex flex-col justify-end h-full">
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-700 ease-out cursor-pointer hover:brightness-110 shadow-sm
                        ${isLast ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 'bg-slate-300 hover:bg-emerald-500/40'}
                      `}
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                        />
                                    </div>

                                    {/* Label inferior */}
                                    <div className={`mt-3 text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center
                    ${isLast ? 'text-emerald-700' : 'text-slate-500'}
                  `}>
                                        {d.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Badge({ children, className, variant = "default" }) {
    const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
    const variants = {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "text-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    };
    return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
}

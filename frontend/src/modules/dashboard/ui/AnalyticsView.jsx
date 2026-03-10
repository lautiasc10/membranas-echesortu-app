import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, ArrowLeft, DollarSign, Users, ShoppingCart, Activity } from "lucide-react";

function money(v) {
    return Number(v || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function PremiumChart({ title, description, data, dataKey, color, isMoney, icon: Icon }) {
    const max = Math.max(...data.map((d) => d[dataKey]), 1);

    // Using CSS variables from index.css for consistency
    const colorMap = {
        amber: "from-orange-600/80 to-amber-500/80 hover:from-orange-500 hover:to-amber-400 shadow-orange-500/10",
        blue: "from-slate-700/80 to-slate-600/80 hover:from-slate-600 hover:to-slate-500 shadow-slate-500/10",
        slate: "from-slate-800/80 to-slate-700/80 hover:from-slate-700 hover:to-slate-600 shadow-slate-900/10",
    };
    const barColor = colorMap[color] || colorMap.amber;

    const isBarcode = data.length > 6;

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-card overflow-hidden group">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-primary/5 text-primary`}>
                        <Icon className="size-4" />
                    </div>
                    <div className="text-right">
                        <CardTitle className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">{title}</CardTitle>
                        <p className="text-[10px] text-muted-foreground">{description}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground italic">
                        Esperando datos históricos...
                    </div>
                ) : (
                    <div className="h-[200px] w-full flex items-end gap-1 px-1 pt-8">
                        {data.map((d, idx) => {
                            const val = d[dataKey];
                            const height = (val / max) * 100;
                            const isLast = idx === data.length - 1;

                            return (
                                <div key={d.key} className="flex-1 flex flex-col items-center group/item relative h-full justify-end">
                                    {/* Professional Tooltip */}
                                    <div className="absolute bottom-full mb-3 opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/item:translate-y-0 pointer-events-none z-30">
                                        <div className="bg-foreground text-background text-[10px] font-medium py-1.5 px-2.5 rounded shadow-lg whitespace-nowrap border border-border/10">
                                            <div className="opacity-70 text-[7px] mb-0.5">{d.label}</div>
                                            <div className="text-xs font-semibold">{isMoney ? money(val) : val}</div>
                                        </div>
                                    </div>

                                    {/* Bar */}
                                    <div
                                        className={`w-full rounded-t-sm transition-all duration-400 ease-out cursor-pointer bg-gradient-to-t ${isLast ? barColor : "from-muted to-muted/50 hover:" + barColor}`}
                                        style={{ height: `${Math.max(height, 4)}%` }}
                                    />

                                    {/* Label */}
                                    {(!isBarcode || idx % 2 === 0 || isLast) && (
                                        <div className="mt-2 text-[7px] font-medium text-muted-foreground uppercase tracking-widest truncate w-full text-center">
                                            {d.label}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function AnalyticsView({ vm, onBack }) {
    const stats = vm.monthlyStats || [];
    const latest = stats[stats.length - 1] || {};
    const previous = stats[stats.length - 2] || {};

    const growth = latest.clientCount !== undefined && previous.clientCount !== undefined
        ? previous.clientCount === 0
            ? (latest.clientCount > 0 ? 100 : 0)
            : Math.round(((latest.clientCount - previous.clientCount) / previous.clientCount) * 100)
        : 0;

    const ticket = latest.revenue && latest.salesCount
        ? latest.revenue / latest.salesCount
        : 0;

    const efficiency = latest.profit && latest.revenue
        ? Math.round((latest.profit / latest.revenue) * 100)
        : 0;

    return (
        <div className="space-y-6 pb-10 min-h-screen">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                        <Activity className="size-3" />
                        Intelligence Panel
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">Estadísticas Avanzadas</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">Análisis profundo del rendimiento operativo y comercial.</p>
                </div>
                <Button
                    variant="outline"
                    className="rounded-lg shadow-sm bg-card hover:bg-muted transition-all gap-2 px-5 h-10 text-xs font-semibold"
                    onClick={onBack}
                >
                    <ArrowLeft className="size-3.5" />
                    Regresar al Panel
                </Button>
            </div>

            {/* Grid of Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PremiumChart
                    title="Clientes Registrados"
                    description="Evolución de registros"
                    data={stats}
                    dataKey="clientCount"
                    color="amber"
                    icon={Users}
                />
                <PremiumChart
                    title="Cantidad de Ventas"
                    description="Volumen mensual"
                    data={stats}
                    dataKey="salesCount"
                    color="blue"
                    icon={ShoppingCart}
                />
                <PremiumChart
                    title="Ganancias Totales"
                    description="Utilidad neta mensual"
                    data={stats}
                    dataKey="profit"
                    color="amber"
                    isMoney
                    icon={TrendingUp}
                />
            </div>

            {/* Strategic Insights - Professional Dark Mode */}
            <Card className="border-none shadow-lg bg-sidebar text-sidebar-foreground overflow-hidden relative rounded-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                    <BarChart3 className="size-48" />
                </div>
                <CardHeader className="pb-0 pt-6 px-8">
                    <CardTitle className="text-xs font-semibold tracking-widest uppercase text-sidebar-foreground/50">Resumen Estratégico</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-accent">
                            <TrendingUp className="size-3" />
                            <p className="text-[9px] font-bold uppercase tracking-widest">Tasa de Crecimiento</p>
                        </div>
                        <p className={`text-4xl font-semibold tracking-tight ${growth >= 0 ? 'text-sidebar-foreground' : 'text-red-400'}`}>
                            {growth >= 0 ? '+' : ''}{growth}%
                        </p>
                        <p className="text-[10px] text-sidebar-foreground/50 leading-relaxed uppercase font-medium tracking-tight">Crecimiento vs mes anterior</p>
                    </div>

                    <div className="space-y-2 border-y md:border-y-0 md:border-x border-sidebar-border/50 py-6 md:py-0 md:px-10">
                        <div className="flex items-center gap-2 text-primary-foreground/70">
                            <DollarSign className="size-3" />
                            <p className="text-[9px] font-bold uppercase tracking-widest">Ticket Promedio</p>
                        </div>
                        <p className="text-4xl font-semibold tracking-tight">{money(ticket)}</p>
                        <p className="text-[10px] text-sidebar-foreground/50 leading-relaxed uppercase font-medium tracking-tight">Valor promedio facturado</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-accent">
                            <Activity className="size-3" />
                            <p className="text-[9px] font-bold uppercase tracking-widest">Eficiencia</p>
                        </div>
                        <p className="text-4xl font-semibold tracking-tight">{efficiency}%</p>
                        <p className="text-[10px] text-sidebar-foreground/50 leading-relaxed uppercase font-medium tracking-tight">Rentabilidad neta</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

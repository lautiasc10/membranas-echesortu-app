import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, Download, BarChart3, ChevronRight } from "lucide-react";

function formatDate(d) {
  if (!d) return "-";
  return d.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function money(v) {
  return Number(v || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function StatusBadge({ level, label }) {
  const map = {
    danger: "bg-red-500 text-white border-red-600",
    warning: "bg-orange-500 text-white border-orange-600",
    ok: "bg-emerald-500 text-white border-emerald-600",
    info: "bg-blue-500 text-white border-blue-600",
  };
  return <span className={`inline-flex items-center justify-center rounded-sm border px-1.5 h-3.5 text-[7px] font-black uppercase leading-none ${map[level] || map.ok}`}>{label}</span>;
}

export function DashboardView({ loading, error, vm, onGoToAnalytics, onExport, onViewInventory, onViewSales }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{vm.header.title}</h1>
          <p className="text-muted-foreground text-sm">{vm.header.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent">
            <Calendar className="size-3" />
            Últimos 30 días
          </div>
          <div className="h-4 w-px bg-border mx-1 hidden md:block" />
          <Button
            variant="outline"
            className="gap-2 bg-card hover:bg-muted transition-all text-xs font-semibold h-9"
            onClick={onGoToAnalytics}
          >
            <BarChart3 className="size-3.5" />
            Estadísticas
          </Button>
          <Button variant="ghost" className="gap-2 text-xs font-semibold h-9" onClick={onExport}>
            <Download className="size-3.5" />
            Exportar
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-20 text-sm text-muted-foreground animate-pulse">
          Cargando inteligencia de negocio...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vm.metrics.map((m) => {
              const colorMap = {
                emerald: "bg-emerald-500",
                blue: "bg-primary",
                amber: "bg-amber-500",
                violet: "bg-violet-500",
              };
              const barColor = colorMap[m.color] || "bg-primary";

              return (
                <Card key={m.key} className="shadow-sm border-none bg-card hover:shadow-md transition-all">
                  <CardHeader className="pb-3 px-6 pt-6">
                    <CardTitle className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">
                      {m.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="text-3xl font-semibold tracking-tight">{m.value}</div>
                    <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full w-2/3 ${barColor} opacity-80`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Alerts */}
            <Card className="border-none shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  <CardTitle className="text-sm font-semibold">Alertas Críticas</CardTitle>
                </div>
                <Button variant="ghost" className="text-primary text-[10px] font-bold h-7 gap-1" onClick={onViewInventory}>
                  Inventario <ChevronRight className="size-3" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-1 p-0 flex-1">
                {vm.alerts.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground font-medium italic opacity-60">Operación óptima. Sin alertas de stock.</p>
                  </div>
                ) : (
                  vm.alerts.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between px-6 py-2.5 hover:bg-muted/20 cursor-pointer transition-colors border-b border-border/20 last:border-none"
                      onClick={onViewInventory}
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm tracking-tight">{a.title}</p>
                        {a.variantLabel && (
                          <div className="flex items-center gap-2">
                            <p className="text-[8px] font-bold text-primary/70 uppercase tracking-widest bg-primary/5 px-1 py-0.5 rounded leading-none">
                              {a.variantLabel}
                            </p>
                            <p className="text-[9px] text-muted-foreground">{a.subtitle}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <StatusBadge level={a.status.level} label={a.status.label} />
                        <p className="text-[10px] font-bold tabular-nums">
                          <span className={a.status.level === "danger" ? "text-red-500" : "text-amber-500"}>
                            {a.current}
                          </span>{" "}
                          <span className="text-muted-foreground/60 font-medium text-[9px]">/ {a.min}</span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                <CardTitle className="text-sm font-semibold">Productos más vendidos</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {vm.performance.ranking.length > 0 ? (
                    vm.performance.ranking.map((item) => (
                      <div
                        key={item.variantId}
                        className="group relative rounded-xl border border-border bg-card p-3 transition-all hover:bg-muted/50 hover:shadow-sm flex flex-col items-center text-center"
                      >
                        <div className="size-10 sm:size-12 rounded-lg bg-muted border border-border overflow-hidden mb-3 shadow-sm shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center text-[8px] text-muted-foreground uppercase font-bold tracking-tighter px-1">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="w-full min-w-0 space-y-1">
                          <p className="font-bold text-[11px] leading-tight truncate px-1">
                            {item.name}
                          </p>
                          <p className="text-[9px] font-medium text-muted-foreground truncate uppercase tracking-tight">
                            {item.variantLabel || "Estándar"}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border/50 w-full flex items-center justify-between px-1">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-sm font-black text-foreground">{item.qty}</span>
                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">u.</span>
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground/80 tabular-nums">
                            {item.revenue.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center border border-dashed rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Sin datos de rendimiento</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sales */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 px-6 py-5">
              <CardTitle className="text-sm font-semibold">Historial de Ventas Recientes</CardTitle>
              <Button variant="ghost" className="text-primary text-[10px] font-bold h-7 gap-1" onClick={onViewSales}>
                Ver Todo <ChevronRight className="size-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border/30">
                    <TableHead className="hidden sm:table-cell text-[10px] font-bold uppercase tracking-wider px-6">ID Operación</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Cliente / Cuenta</TableHead>
                    <TableHead className="hidden sm:table-cell text-[10px] font-bold uppercase tracking-wider">Fecha / Hora</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider px-6">Total Bruto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vm.recentSales.slice(0, 5).map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/20 border-border/30">
                      <TableCell className="hidden sm:table-cell font-mono text-[10px] text-muted-foreground px-6 py-4">
                        #{String(s.id).padStart(3, "0")}
                      </TableCell>
                      <TableCell className="font-medium text-sm py-4">{s.clientName}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground py-4">
                        {formatDate(s.date)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground text-sm tabular-nums px-6 py-4">
                        {Number(s.total ?? 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {vm.recentSales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-12">
                        No se han procesado transacciones en este intervalo.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )
      }
    </div >
  );
}

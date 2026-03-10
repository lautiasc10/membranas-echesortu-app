import { useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Calendar, ArrowRight } from "lucide-react";

export function ClientHistoryDialog({ open, onOpenChange, client, sales }) {
    const clientSales = useMemo(() => {
        if (!client || !sales) return [];
        return sales
            .filter((s) => (s.clientId ?? s.ClientId) === client.id)
            .sort((a, b) => new Date(b.createdAt ?? b.Date) - new Date(a.createdAt ?? a.Date));
    }, [client, sales]);

    const money = (v) =>
        Number(v || 0).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        });

    const formatDate = (x) => {
        if (!x) return "—";
        const d = new Date(x);
        if (isNaN(d.getTime())) return String(x);
        return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingBag className="size-5 text-emerald-600" />
                        Historial de Compras: {client?.name}
                    </DialogTitle>
                    <DialogDescription>
                        Listado cronológico de todas las operaciones realizadas por el cliente.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {clientSales.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed">
                            <Calendar className="size-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground font-medium">Este cliente aún no registra compras.</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Fecha</TableHead>
                                        <TableHead>ID Venta</TableHead>
                                        <TableHead className="text-center">Items</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientSales.map((s) => (
                                        <TableRow key={s.id} className="hover:bg-slate-50/50">
                                            <TableCell className="text-xs font-medium text-slate-600">
                                                {formatDate(s.createdAt ?? s.Date)}
                                            </TableCell>
                                            <TableCell className="font-mono text-[10px] text-muted-foreground">
                                                #{String(s.id).padStart(5, "0")}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="text-[10px] py-0 h-5">
                                                    {s.itemsCount ?? s.details?.length ?? 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-emerald-700">
                                                {money(s.total ?? s.Total)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

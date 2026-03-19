import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Search } from "lucide-react";
import { quotesRepository } from "../data/quotes.repository";

const currency = (n) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(n ?? 0);

export function QuoteForm({ quoteId, variants, onSubmit, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [clientCity, setClientCity] = useState("");
    const [workLocation, setWorkLocation] = useState("");
    const [details, setDetails] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (quoteId) {
            loadQuote(quoteId);
        } else {
            // Init with some empty rows like the Excel
            setDetails([{ id: Date.now(), productName: "", quantity: 1, unitPrice: 0 }]);
        }
    }, [quoteId]);

    async function loadQuote(id) {
        try {
            setLoading(true);
            const q = await quotesRepository.readQuote(id);
            setClientName(q.clientName || "");
            setClientAddress(q.clientAddress || "");
            setClientCity(q.clientCity || "");
            setWorkLocation(q.workLocation || "");
            setDetails(
                q.details.map((d) => ({
                    id: d.id, // Keep the old ID or generate a temp one if needed
                    productName: d.productName || "",
                    quantity: d.quantity || 1,
                    unitPrice: d.unitPrice || 0,
                }))
            );
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const filteredVariants = useMemo(() => {
        if (!searchQuery) return [];
        const lower = searchQuery.toLowerCase();
        return variants.filter(
            (v) =>
                v.productName?.toLowerCase().includes(lower) ||
                v.color?.toLowerCase().includes(lower)
        ).slice(0, 10);
    }, [searchQuery, variants]);

    const addDetail = () => {
        setDetails([...details, { id: Date.now(), productName: "", quantity: 1, unitPrice: 0 }]);
    };

    const removeDetail = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const updateDetail = (index, field, value) => {
        const newDetails = [...details];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setDetails(newDetails);
    };

    const selectVariant = (index, variant) => {
        const newDetails = [...details];
        const name = `${variant.productName} ${variant.color || ""} ${variant.size || ""}`.trim();
        newDetails[index] = {
            ...newDetails[index],
            productName: name,
            unitPrice: variant.salePrice || 0,
        };
        setDetails(newDetails);
        setSearchQuery("");
    };

    const total = details.reduce((acc, d) => acc + (d.quantity || 0) * (d.unitPrice || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            clientName,
            clientAddress,
            clientCity,
            workLocation,
            details: details.map((d) => ({
                productName: d.productName,
                quantity: Number(d.quantity),
                unitPrice: Number(d.unitPrice),
            })),
        };
        onSubmit(payload);
    };

    if (loading) return <div className="p-4 text-center">Cargando...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Client Info Section */}
            <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border/50">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Cliente</Label>
                        <Input
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Nombre completo o empresa"
                            className="bg-background shadow-none border-border/60 focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Domicilio</Label>
                        <Input
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            placeholder="Ej: San Juan 3451"
                            className="bg-background shadow-none border-border/60 focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Ciudad</Label>
                        <Input
                            value={clientCity}
                            onChange={(e) => setClientCity(e.target.value)}
                            placeholder="Ej: Rosario - Santa Fe"
                            className="bg-background shadow-none border-border/60 focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Ubicación de la obra</Label>
                        <Input
                            value={workLocation}
                            onChange={(e) => setWorkLocation(e.target.value)}
                            placeholder="Dirección donde se realiza el trabajo"
                            className="bg-background shadow-none border-border/60 focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg ring-1 ring-primary/20">
                            <Plus className="size-4" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Productos y Servicios</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative flex-1 sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar en inventario..."
                                className="pl-9 bg-muted/20 border-border/40 text-sm h-9 shadow-none focus:bg-background transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {filteredVariants.length > 0 && (
                                <div className="absolute top-11 left-0 right-0 z-50 bg-popover text-popover-foreground border border-border shadow-xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {filteredVariants.map((v) => (
                                        <div
                                            key={v.id}
                                            className="p-3 text-sm hover:bg-muted cursor-pointer font-medium flex items-center justify-between border-b last:border-0 border-border/50"
                                            onClick={() => {
                                                const emptyIndex = details.findIndex((d) => !d.productName);
                                                if (emptyIndex !== -1) {
                                                    selectVariant(emptyIndex, v);
                                                } else {
                                                    const name = `${v.productName} ${v.color || ""} ${v.size || ""}`.trim();
                                                    setDetails([...details, { id: Date.now(), productName: name, quantity: 1, unitPrice: v.salePrice || 0 }]);
                                                    setSearchQuery("");
                                                }
                                            }}
                                        >
                                            <span className="truncate mr-2">{v.productName} {v.color}</span>
                                            <span className="text-xs font-bold bg-primary/5 px-2 py-0.5 rounded text-primary shrink-0">{currency(v.salePrice)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addDetail} className="h-9 font-semibold hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
                            <Plus className="size-4 mr-1.5" />
                            Fila Libre
                        </Button>
                    </div>
                </div>

                {/* Items List - Mobile Cards / Desktop Table */}
                <div className="border rounded-2xl overflow-hidden bg-background shadow-sm">
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader className="bg-muted/50 border-b border-border/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[45%] text-[10px] font-bold uppercase tracking-widest py-4">Descripción del Producto</TableHead>
                                    <TableHead className="w-[15%] text-[10px] font-bold uppercase tracking-widest py-4 text-center">Cant.</TableHead>
                                    <TableHead className="w-[20%] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Precio Unit.</TableHead>
                                    <TableHead className="w-[20%] text-[10px] font-bold uppercase tracking-widest py-4 text-right pr-6">Total</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {details.map((d, index) => (
                                    <TableRow key={d.id} className="group hover:bg-muted/20 transition-colors">
                                        <TableCell className="p-3">
                                            <Input
                                                required
                                                className="h-10 shadow-none border-transparent focus:border-border/50 group-hover:bg-background transition-colors font-medium"
                                                value={d.productName}
                                                onChange={(e) => updateDetail(index, "productName", e.target.value)}
                                                placeholder="Ej: Membrana Asfáltica 4mm"
                                            />
                                        </TableCell>
                                        <TableCell className="p-3">
                                            <Input
                                                type="number"
                                                required
                                                min={1}
                                                className="h-10 shadow-none border-transparent focus:border-border/50 group-hover:bg-background transition-colors text-center font-semibold"
                                                value={d.quantity}
                                                onChange={(e) => updateDetail(index, "quantity", Number(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell className="p-3">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                                <Input
                                                    type="number"
                                                    required
                                                    min={0}
                                                    step="0.01"
                                                    className="h-10 pl-6 shadow-none border-transparent focus:border-border/50 group-hover:bg-background transition-colors text-right font-semibold"
                                                    value={d.unitPrice}
                                                    onChange={(e) => updateDetail(index, "unitPrice", Number(e.target.value))}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-3 text-right font-bold text-primary pr-6">
                                            {currency((d.quantity || 0) * (d.unitPrice || 0))}
                                        </TableCell>
                                        <TableCell className="p-3 text-center">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                                                onClick={() => removeDetail(index)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View - Cards */}
                    <div className="md:hidden divide-y divide-border/50">
                        {details.map((d, index) => (
                            <div key={d.id} className="p-4 space-y-4 bg-muted/5 relative group">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 size-8 text-muted-foreground/50 hover:text-destructive"
                                    onClick={() => removeDetail(index)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>

                                <div className="space-y-1 pr-8">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Producto</Label>
                                    <Input
                                        required
                                        className="shadow-none border-border/40 h-10 bg-background font-medium"
                                        value={d.productName}
                                        onChange={(e) => updateDetail(index, "productName", e.target.value)}
                                        placeholder="Descripción"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cant.</Label>
                                        <Input
                                            type="number"
                                            required
                                            min={1}
                                            className="shadow-none h-10 border-border/40 bg-background text-center font-bold"
                                            value={d.quantity}
                                            onChange={(e) => updateDetail(index, "quantity", Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Precio Unit.</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                            <Input
                                                type="number"
                                                required
                                                min={0}
                                                step="0.01"
                                                className="shadow-none h-10 pl-6 border-border/40 bg-background text-right font-bold"
                                                value={d.unitPrice}
                                                onChange={(e) => updateDetail(index, "unitPrice", Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                    <span className="text-xs font-semibold text-muted-foreground">Total Item</span>
                                    <span className="text-base font-black text-primary">{currency((d.quantity || 0) * (d.unitPrice || 0))}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Row */}
                    <div className="bg-primary/5 px-6 py-6 border-t border-primary/10 flex flex-nowrap items-center justify-between">
                        <div className="hidden sm:block">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Total del Presupuesto</span>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="sm:hidden text-xs font-bold uppercase tracking-widest text-primary/60">TOTAL</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">
                                {currency(total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
                <Button variant="ghost" type="button" onClick={onCancel} className="font-semibold text-muted-foreground hover:text-foreground">
                    Cancelar
                </Button>
                <Button type="submit" className="h-11 px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="size-4 mr-2" />
                    Guardar Presupuesto
                </Button>
            </div>
        </form>
    );
}

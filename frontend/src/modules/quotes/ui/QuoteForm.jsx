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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Cliente</Label>
                    <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nombre del cliente" />
                </div>
                <div className="space-y-1">
                    <Label>Domicilio</Label>
                    <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Ej: San Juan 3451" />
                </div>
                <div className="space-y-1">
                    <Label>Ciudad</Label>
                    <Input value={clientCity} onChange={(e) => setClientCity(e.target.value)} placeholder="Ej: Rosario - Santa Fe" />
                </div>
                <div className="space-y-1">
                    <Label>Ubicación de la obra</Label>
                    <Input value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} placeholder="Dirección de la obra" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Productos</Label>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar en inventario..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {filteredVariants.length > 0 && (
                                <div className="absolute top-11 left-0 right-0 z-50 bg-popover text-popover-foreground border shadow-md rounded-md">
                                    {filteredVariants.map((v) => (
                                        <div
                                            key={v.id}
                                            className="p-2 text-sm hover:bg-muted cursor-pointer font-medium"
                                            onClick={() => {
                                                // If there is an empty row, use it, else add new row
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
                                            {v.productName} {v.color} - {currency(v.salePrice)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addDetail}>
                            <Plus className="size-4 mr-1" />
                            Fila Libre
                        </Button>
                    </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[50%]">PRODUCTO</TableHead>
                                <TableHead className="w-[15%]">CANTIDAD</TableHead>
                                <TableHead className="w-[20%]">PRECIO UNITARIO</TableHead>
                                <TableHead className="w-[20%]">PRECIO TOTAL</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {details.map((d, index) => (
                                <TableRow key={d.id}>
                                    <TableCell className="p-2">
                                        <Input
                                            required
                                            className="h-8 shadow-none"
                                            value={d.productName}
                                            onChange={(e) => updateDetail(index, "productName", e.target.value)}
                                            placeholder="Descripción del producto"
                                        />
                                    </TableCell>
                                    <TableCell className="p-2">
                                        <Input
                                            type="number"
                                            required
                                            min={1}
                                            className="h-8 shadow-none text-right"
                                            value={d.quantity}
                                            onChange={(e) => updateDetail(index, "quantity", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="p-2">
                                        <Input
                                            type="number"
                                            required
                                            min={0}
                                            step="0.01"
                                            className="h-8 shadow-none text-right"
                                            value={d.unitPrice}
                                            onChange={(e) => updateDetail(index, "unitPrice", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="p-2 text-right font-medium">
                                        {currency((d.quantity || 0) * (d.unitPrice || 0))}
                                    </TableCell>
                                    <TableCell className="p-2 text-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeDetail(index)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableCell colSpan={3} className="text-right font-bold py-3 text-lg">
                                    TOTAL
                                </TableCell>
                                <TableCell className="text-right font-bold py-3 text-lg text-primary">
                                    {currency(total)}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit">Guardar Presupuesto</Button>
            </div>
        </form>
    );
}

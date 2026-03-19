import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "../../../shared/ui/DeleteConfirmDialog";
import { Plus, Pencil, Trash2, Tag, Image as ImageIcon, CalendarDays, Box, CheckCircle, XCircle } from "lucide-react";
import { Pagination } from "../../../shared/ui/Pagination";
import { baseUrl } from "../../../services/apiClient";
import { OfferFormDialog } from "./OfferFormDialog";

export function AdminOffersView({
    loading,
    error,
    items,
    products,
    totalCount,
    page,
    totalPages,
    onPrev,
    onNext,
    onGoPage,
    onDelete,
    onCreate,
    onEdit,
    onToggleActive,
    createOpen,
    onCreateOpenChange,
    editId,
    onEditIdChange,
    editOffer,
    productQuery,
    onProductQueryChange,
    onCreateSubmit,
    onEditSubmit
}) {
    const [deleteId, setDeleteId] = useState(null);

    const money = (v) =>
        Number(v || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${baseUrl}${url}`;
    };

    const isOfferValid = (startDate, endDate) => {
        const now = new Date();
        return new Date(startDate) <= now && new Date(endDate) >= now;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl text-foreground">
                        Ofertas y Promociones
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 font-medium italic opacity-80">
                        Administrá descuentos a productos y promociones especiales temporales.
                    </p>
                </div>
                <Button className="gap-2" onClick={onCreate}>
                    <Plus className="size-4" />
                    Nueva Oferta
                </Button>
            </div>

            <Card className="overflow-hidden border-none shadow-sm">
                <CardContent className="p-0">
                    {loading && <div className="p-12 text-center text-sm text-muted-foreground">Cargando promociones...</div>}
                    {error && <div className="p-12 text-center text-sm text-red-600 font-bold">{error}</div>}
                    {!loading && !error && (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-border/60">
                                            <TableHead className="w-[80px]">Tipo</TableHead>
                                            <TableHead>Oferta / Beneficio</TableHead>
                                            <TableHead>Vigencia</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((o) => {
                                            const isValid = isOfferValid(o.startDate, o.endDate);
                                            const displayStatus = o.isActive && isValid ? "Vigente" : o.isActive && !isValid ? "Vencida" : "Apagada";
                                            return (
                                                <TableRow key={o.id} className="group hover:bg-slate-50/50">
                                                    <TableCell className="text-center">
                                                        {o.type === 1 ? (
                                                            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-none px-2 py-1"><Box className="size-3 mr-1" /> Prod</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-none px-2 py-1"><Tag className="size-3 mr-1" /> Promo</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            {o.type === 2 && (
                                                                <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                                    {o.customImageUrl ? <img src={getImageUrl(o.customImageUrl)} alt={o.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="size-4" /></div>}
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="font-bold text-sm truncate">{o.title}</span>
                                                                {o.type === 1 ? (
                                                                    <div className="text-[10px] text-muted-foreground mt-0.5 flex gap-2">
                                                                        {o.product?.name && <span className="font-semibold">{o.product.name} {o.productVariant?.color} {o.productVariant?.size} {o.productVariant?.weight}</span>}
                                                                        {o.discountPercentage && <span className="text-green-600 font-bold">-{o.discountPercentage}%</span>}
                                                                        {o.promoPrice && <span className="text-blue-600 font-bold">{money(o.promoPrice)}</span>}
                                                                    </div>
                                                                ) : <span className="text-[10px] text-muted-foreground truncate">{o.description}</span>}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="flex items-center gap-1 text-muted-foreground"><CalendarDays className="size-3" /> {new Date(o.startDate).toLocaleDateString("es-AR")}</span>
                                                            <span className="flex items-center gap-1 text-foreground font-medium">Hasta {new Date(o.endDate).toLocaleDateString("es-AR")}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleActive(o.id)}>
                                                            {displayStatus === "Vigente" ? <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none gap-1 pointer-events-none"><CheckCircle className="size-3" /> Activa</Badge> : displayStatus === "Vencida" ? <Badge variant="outline" className="text-red-700 border-dashed gap-1 pointer-events-none"><XCircle className="size-3 text-red-500" /> Vencida</Badge> : <Badge variant="outline" className="text-muted-foreground gap-1 pointer-events-none"><XCircle className="size-3" /> Pausada</Badge>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="inline-flex items-center gap-0.5">
                                                            <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(o.id)}><Pencil className="size-3.5" /></Button>
                                                            <Button variant="ghost" size="icon" className="size-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteId(o.id)}><Trash2 className="size-3.5" /></Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">No hay promociones configuradas.</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <p className="text-xs text-muted-foreground">Mostrando {items.length} de {totalCount}</p>
                                <Pagination page={page} totalPages={totalPages} onPrev={onPrev} onNext={onNext} onGoPage={onGoPage} />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <DeleteConfirmDialog
                open={deleteId != null}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Eliminar Oferta"
                description="¿Estás seguro de que querés borrar esta promoción? Esta acción es irreversible."
                onConfirm={async () => {
                    const id = deleteId;
                    setDeleteId(null);
                    try {
                        await onDelete(id);
                    } catch (e) {
                        console.error(e);
                    }
                }}
            />

            <OfferFormDialog open={createOpen} onOpenChange={onCreateOpenChange} products={products} productQuery={productQuery} onProductQueryChange={onProductQueryChange} onSubmit={onCreateSubmit} />
            <OfferFormDialog open={editId != null} onOpenChange={(v) => !v && onEditIdChange(null)} offer={editOffer} products={products} productQuery={productQuery} onProductQueryChange={onProductQueryChange} onSubmit={onEditSubmit} />
        </div>
    );
}
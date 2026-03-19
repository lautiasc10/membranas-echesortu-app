import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Image as ImageIcon } from "lucide-react";

export function OfferFormDialog({ open, onOpenChange, offer, products, productQuery, onProductQueryChange, onSubmit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState(1);
    const [productId, setProductId] = useState("");
    const [productVariantId, setProductVariantId] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [promoPrice, setPromoPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [customImage, setCustomImage] = useState(null);

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const fileRef = useRef(null);

    const isEdit = !!offer;

    useEffect(() => {
        if (open) {
            setTitle(offer?.title || "");
            setDescription(offer?.description || "");
            setType(offer?.type || 1);
            setProductId(offer?.productId?.toString() || "");
            setProductVariantId(offer?.productVariantId?.toString() || "");
            setDiscountPercentage(offer?.discountPercentage?.toString() || "");
            setPromoPrice(offer?.promoPrice?.toString() || "");
            setStartDate(offer?.startDate ? offer.startDate.split("T")[0] : "");
            setEndDate(offer?.endDate ? offer.endDate.split("T")[0] : "");
            setIsActive(offer ? offer.isActive : true);
            setCustomImage(null);
            setErrors({});
            onProductQueryChange("");

            if (fileRef.current) fileRef.current.value = "";
        }
        if (!open) setSaving(false);
    }, [open, offer, onProductQueryChange]);

    const validate = () => {
        const newErrors = {};
        if (title.trim().length < 3) newErrors.title = "Título requerido (mín. 3).";
        if (!startDate) newErrors.startDate = "Fecha de inicio requerida.";
        if (!endDate) newErrors.endDate = "Fecha de fin requerida.";

        if (type === 1) {
            if (!isEdit && (!productId || !productVariantId)) {
                newErrors.productId = "Debe seleccionar una variante de producto.";
            }
            if (!discountPercentage && !promoPrice) {
                newErrors.values = "Debe especificar descuento o precio fijo.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            setSaving(true);
            const payload = {
                title: title.trim(),
                description: description.trim(),
                type: Number(type),
                startDate: startDate || null,
                endDate: endDate || null,
                isActive,
                productId: isEdit ? offer?.productId ?? null : type === 1 && productId ? Number(productId) : null,
                productVariantId: isEdit ? offer?.productVariantId ?? null : type === 1 && productVariantId ? Number(productVariantId) : null,
                discountPercentage: type === 1 && discountPercentage !== "" ? Number(discountPercentage) : null,
                promoPrice: type === 1 && promoPrice !== "" ? Number(promoPrice) : null,
                customImageUrl: Number(type) === 2 ? offer?.customImageUrl ?? null : null,
                _imageFile: customImage
            };
            if (offer) await onSubmit(offer.id, payload);
            else await onSubmit(payload);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar Oferta" : "Nueva Oferta"}</DialogTitle>
                    <DialogDescription>Creá una promoción sobre un producto específico o una publicidad genérica.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={`text-sm font-medium ${errors.title ? "text-red-500" : ""}`}>Título Promocional</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Oferta Imperdible" />
                            {errors.title && <p className="text-[10px] text-red-500 uppercase">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de Oferta</label>
                            <Select value={type.toString()} onValueChange={(v) => setType(Number(v))} disabled={isEdit}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Sobre Producto Específico</SelectItem>
                                    <SelectItem value="2">Promoción Genérica (Custom)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción</label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles y condiciones..." rows={2} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={`text-sm font-medium ${errors.startDate ? "text-red-500" : ""}`}>Fecha Inicio</label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            {errors.startDate && <p className="text-[10px] text-red-500 uppercase">{errors.startDate}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className={`text-sm font-medium ${errors.endDate ? "text-red-500" : ""}`}>Fecha Fin</label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            {errors.endDate && <p className="text-[10px] text-red-500 uppercase">{errors.endDate}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-border/50">
                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                        <label className="text-sm font-medium">Activa al Público</label>
                    </div>

                    {type === 1 && !isEdit && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                            <div className="space-y-4">
                                <label className={`text-sm font-medium ${errors.productId ? "text-red-500" : ""}`}>Producto Asociado</label>
                                <div className="relative">
                                    <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input className="pl-9" placeholder="Buscar producto, marca, categoría..." value={productQuery} onChange={(e) => onProductQueryChange(e.target.value)} />
                                </div>
                                <select
                                    className={`w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none ${errors.productId ? "border-red-500" : ""}`}
                                    value={productVariantId}
                                    onChange={(e) => {
                                        const vId = e.target.value;
                                        setProductVariantId(vId);
                                        const parentProd = products.find((p) => p.variants?.some((v) => v.id.toString() === vId));
                                        if (parentProd) setProductId(parentProd.id.toString());
                                    }}
                                >
                                    <option value="">Seleccioná una variante del producto...</option>
                                    {products.flatMap((p) => (p.variants || []).map((v) => (
                                        <option key={v.id} value={v.id.toString()}>
                                            {p.name} {p.brand ? `· ${p.brand}` : ""} - {v.color || ""} {v.size || ""} {v.weight || ""} | Stock: {v.stock ?? 0}
                                        </option>
                                    )))}
                                </select>
                                {errors.productId && <p className="text-[10px] text-red-500 uppercase">{errors.productId}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">% de Descuento</label>
                                    <Input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} placeholder="Ej: 15" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Precio Fijo Promocional ($)</label>
                                    <Input type="number" value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} placeholder="Ej: 10500" />
                                </div>
                            </div>
                            {errors.values && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.values}</p>}
                        </div>
                    )}

                    {type === 1 && isEdit && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                            <div>
                                <label className="text-sm font-medium">Producto asociado</label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {offer?.product?.name || "Producto"}{" "}
                                    {offer?.productVariant?.color || ""}{" "}
                                    {offer?.productVariant?.size || ""}{" "}
                                    {offer?.productVariant?.weight || ""}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">% de Descuento</label>
                                    <Input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} placeholder="Ej: 15" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Precio Fijo Promocional ($)</label>
                                    <Input type="number" value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} placeholder="Ej: 10500" />
                                </div>
                            </div>
                            {errors.values && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.values}</p>}
                        </div>
                    )}

                    {type === 2 && (
                        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2 text-orange-800"><ImageIcon className="size-4" /> Flyer / Imagen Promocional</label>
                                <Input type="file" accept="image/*" ref={fileRef} className="bg-white" onChange={(e) => setCustomImage(e.target.files?.[0] ?? null)} />
                                {offer?.customImageUrl && !customImage && <p className="text-xs text-green-600 font-medium mt-1">✓ Flyer ya asignado. Seleccioná otro para reemplazarlo.</p>}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
                    <Button disabled={saving} onClick={handleSave}>{saving ? "Guardando..." : "Guardar Oferta"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

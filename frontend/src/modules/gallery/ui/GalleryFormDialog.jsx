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
import { Image as ImageIcon } from "lucide-react";

export function GalleryFormDialog({ open, onOpenChange, project, onSubmit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [workDate, setWorkDate] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const [orderIndex, setOrderIndex] = useState(0);

    const [beforeImage, setBeforeImage] = useState(null);
    const [afterImage, setAfterImage] = useState(null);

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const fileBeforeRef = useRef(null);
    const fileAfterRef = useRef(null);

    const isEdit = !!project;

    useEffect(() => {
        if (open) {
            setTitle(project?.title || "");
            setDescription(project?.description || "");
            setWorkDate(project?.workDate ? project.workDate.split("T")[0] : "");
            setIsVisible(project ? project.isVisible : true);
            setOrderIndex(project?.orderIndex || 0);
            setBeforeImage(null);
            setAfterImage(null);
            setErrors({});

            if (fileBeforeRef.current) fileBeforeRef.current.value = "";
            if (fileAfterRef.current) fileAfterRef.current.value = "";
        }
        if (!open) setSaving(false);
    }, [open, project]);

    const validate = () => {
        const newErrors = {};
        if (title.trim().length < 3) newErrors.title = "Título requerido (mín. 3 caracteres).";
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
                isVisible,
                orderIndex: Number(orderIndex),
                workDate: workDate || null,
                beforeImageUrl: project?.beforeImageUrl ?? null,
                afterImageUrl: project?.afterImageUrl ?? null,
                _beforeImage: beforeImage,
                _afterImage: afterImage
            };
            await onSubmit(payload);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar Proyecto de Galería" : "Nuevo Proyecto de Galería"}</DialogTitle>
                    <DialogDescription>Completá los datos del proyecto y subí las fotos de Antes y Después.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 px-1">
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${errors.title ? "text-red-500" : ""}`}>Título</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Terraza Central Echesortu" />
                        {errors.title && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción</label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles sobre el trabajo realizado..." rows={3} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fecha de Trabajo</label>
                            <Input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Orden Visual</label>
                            <Input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-border/50">
                        <Switch checked={isVisible} onCheckedChange={setIsVisible} />
                        <label className="text-sm font-medium">Publicación Visible al Público</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">Imagen "Antes" <ImageIcon className="size-3" /></label>
                            <Input type="file" accept="image/*" ref={fileBeforeRef} onChange={(e) => setBeforeImage(e.target.files?.[0] ?? null)} />
                            {project?.beforeImageUrl && !beforeImage && <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-sm mt-1">✓ Imagen existente</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">Imagen "Después" <ImageIcon className="size-3" /></label>
                            <Input type="file" accept="image/*" ref={fileAfterRef} onChange={(e) => setAfterImage(e.target.files?.[0] ?? null)} />
                            {project?.afterImageUrl && !afterImage && <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-sm mt-1">✓ Imagen existente</p>}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
                    <Button disabled={saving} onClick={handleSave}>{saving ? "Guardando..." : "Guardar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

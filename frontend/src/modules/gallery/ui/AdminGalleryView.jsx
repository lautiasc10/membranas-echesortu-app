import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "../../../shared/ui/DeleteConfirmDialog";
import { Plus, Pencil, Trash2, LayoutList, CheckCircle, XCircle } from "lucide-react";
import { Pagination } from "../../../shared/ui/Pagination";
import { baseUrl } from "../../../services/apiClient";
import { GalleryFormDialog } from "./GalleryFormDialog";

export function AdminGalleryView({
    loading,
    error,
    items,
    totalCount,
    page,
    totalPages,
    onPrev,
    onNext,
    onGoPage,
    onDelete,
    onCreate,
    onEdit,
    onToggleVisibility,
    createOpen,
    onCreateOpenChange,
    editId,
    onEditIdChange,
    editProject,
    onCreateSubmit,
    onEditSubmit
}) {
    const [deleteId, setDeleteId] = useState(null);

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${baseUrl}${url}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl text-foreground">Gestión de Galería</h1>
                    <p className="text-sm text-muted-foreground mt-1 font-medium italic opacity-80">
                        Añadí, editá y organizá los proyectos del catálogo público.
                    </p>
                </div>
                <Button className="gap-2" onClick={onCreate}>
                    <Plus className="size-4" />
                    Nuevo Proyecto
                </Button>
            </div>

            <Card className="overflow-hidden border-none shadow-sm">
                <CardContent className="p-0">
                    {loading && <div className="p-12 text-center text-sm text-muted-foreground">Cargando galería...</div>}
                    {error && <div className="p-12 text-center text-sm text-red-600 font-bold">{error}</div>}
                    {!loading && !error && (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-border/60">
                                            <TableHead className="w-[80px]">Orden</TableHead>
                                            <TableHead>Proyecto</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Visibilidad</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((p) => (
                                            <TableRow key={p.id} className="group hover:bg-slate-50/50">
                                                <TableCell className="font-bold text-center">
                                                    <span className="bg-slate-100 rounded text-xs px-2 py-1">{p.orderIndex}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-md bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                            {p.afterImageUrl ? <img src={getImageUrl(p.afterImageUrl)} alt={p.title} className="w-full h-full object-cover" /> : p.beforeImageUrl ? <img src={getImageUrl(p.beforeImageUrl)} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><LayoutList className="size-5" /></div>}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-bold text-sm truncate">{p.title}</span>
                                                            <span className="text-[10px] text-muted-foreground truncate">{p.description}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">{p.workDate ? new Date(p.workDate).toLocaleDateString("es-AR") : "-"}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleVisibility(p.id)}>
                                                        {p.isVisible ? <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none gap-1 pointer-events-none"><CheckCircle className="size-3" /> Visible</Badge> : <Badge variant="outline" className="text-muted-foreground border-dashed gap-1 pointer-events-none"><XCircle className="size-3" /> Oculto</Badge>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="inline-flex items-center gap-0.5 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(p.id)}><Pencil className="size-3.5" /></Button>
                                                        <Button variant="ghost" size="icon" className="size-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteId(p.id)}><Trash2 className="size-3.5" /></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">No hay proyectos publicados.</TableCell></TableRow>}
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
                title="Eliminar proyecto"
                description="¿Estás seguro de que querés borrar este proyecto de la galería? Las fotos se eliminarán del servidor (Cloudinary). Esta acción es irreversible."
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

            <GalleryFormDialog open={createOpen} onOpenChange={onCreateOpenChange} onSubmit={onCreateSubmit} />
            <GalleryFormDialog open={editId != null} onOpenChange={(v) => !v && onEditIdChange(null)} project={editProject} onSubmit={(payload) => onEditSubmit(editId, payload)} />
        </div>
    );
}
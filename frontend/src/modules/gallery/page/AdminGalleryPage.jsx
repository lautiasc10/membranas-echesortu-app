import { useEffect, useState } from "react";
import { toast } from "sonner";
import { galleryRepository } from "../data/gallery.repository";
import { AdminGalleryView } from "../ui/AdminGalleryView";
import { usePagination } from "../../../shared/hooks/usePagination";

export function AdminGalleryPage() {
    const [raw, setRaw] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendTotalCount, setBackendTotalCount] = useState(0);
    const [backendTotalPages, setBackendTotalPages] = useState(1);

    const { page, pageSize, setPage } = usePagination(10);

    const [createOpen, setCreateOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    async function load() {
        try {
            setLoading(true);
            setError(null);

            const resp = await galleryRepository.listPaged({ page, pageSize, onlyVisible: false });

            setRaw(resp.data ?? []);
            setBackendTotalCount(resp.totalCount ?? 0);
            setBackendTotalPages(resp.totalPages ?? 1);
        } catch (e) {
            setError(e?.message ?? "Error cargando la galería");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    const editProject = editId ? raw.find((p) => p.id === editId) ?? null : null;

    async function onDelete(id) {
        const prev = raw;
        setRaw((r) => r.filter((p) => p.id !== id));

        try {
            await galleryRepository.remove(id);
            toast.success(`Proyecto #${id} eliminado`);
            load();
        } catch (e) {
            setRaw(prev);
            toast.error(e?.message ?? "No se pudo eliminar el proyecto");
        }
    }

    async function onCreateSubmit(formData) {
        try {
            await galleryRepository.create(formData);
            toast.success("Proyecto creado con éxito");
            setCreateOpen(false);
            load();
        } catch (e) {
            toast.error(e?.message ?? "No se pudo crear el proyecto");
            throw e;
        }
    }

    async function onEditSubmit(id, formData) {
        try {
            await galleryRepository.update(id, formData);
            toast.success("Proyecto actualizado");
            setEditId(null);
            load();
        } catch (e) {
            toast.error(e?.message ?? "No se pudo actualizar el proyecto");
            throw e;
        }
    }

    async function onToggleVisibility(id) {
        const project = raw.find((p) => p.id === id);
        if (!project) return;

        const prev = raw;
        setRaw((r) =>
            r.map((p) => (p.id === id ? { ...p, isVisible: !p.isVisible } : p))
        );

        try {
            const payload = {
                title: project.title,
                description: project.description || "",
                workDate: project.workDate,
                isVisible: !project.isVisible,
                orderIndex: project.orderIndex || 0,
                beforeImageUrl: project.beforeImageUrl,
                afterImageUrl: project.afterImageUrl
            };

            await galleryRepository.update(id, payload);
            toast.success(`Proyecto ${!project.isVisible ? "visible" : "ocultado"}`);
        } catch (e) {
            setRaw(prev);
            toast.error(e?.message ?? "Error al cambiar visibilidad");
        }
    }

    return (
        <AdminGalleryView
            loading={loading}
            error={error}
            items={raw}
            totalCount={backendTotalCount}
            page={page}
            totalPages={backendTotalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(backendTotalPages, p + 1))}
            onGoPage={(p) => setPage(p)}
            onDelete={onDelete}
            onCreate={() => setCreateOpen(true)}
            onEdit={(id) => setEditId(id)}
            onToggleVisibility={onToggleVisibility}
            createOpen={createOpen}
            onCreateOpenChange={setCreateOpen}
            editId={editId}
            onEditIdChange={setEditId}
            editProject={editProject}
            onCreateSubmit={onCreateSubmit}
            onEditSubmit={onEditSubmit}
        />
    );
}
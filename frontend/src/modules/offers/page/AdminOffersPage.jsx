import { useEffect, useState } from "react";
import { toast } from "sonner";
import { offersRepository } from "../data/offers.repository";
import { AdminOffersView } from "../ui/AdminOffersView";
import { usePagination } from "../../../shared/hooks/usePagination";
import { getPagedProducts } from "../../../services/products.api";

export function AdminOffersPage() {
    const [raw, setRaw] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendTotalCount, setBackendTotalCount] = useState(0);
    const [backendTotalPages, setBackendTotalPages] = useState(1);

    const { page, pageSize, setPage } = usePagination(10);

    const [productQuery, setProductQuery] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    async function load() {
        try {
            setLoading(true);
            setError(null);

            const resp = await offersRepository.listPaged({ page, pageSize, onlyActive: false });

            setRaw(resp.data ?? []);
            setBackendTotalCount(resp.totalCount ?? 0);
            setBackendTotalPages(resp.totalPages ?? 1);
        } catch (e) {
            setError(e?.message ?? "Error cargando las ofertas");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await getPagedProducts({ page: 1, pageSize: 50, search: productQuery });
                setProducts(res.data || []);
            } catch (err) {
                console.error("Error al buscar productos:", err);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [productQuery]);

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    const editOffer = editId ? raw.find((o) => o.id === editId) ?? null : null;

    async function onDelete(id) {
        const prev = raw;
        setRaw((r) => r.filter((o) => o.id !== id));

        try {
            await offersRepository.remove(id);
            toast.success(`Oferta/Promoción #${id} eliminada`);
            load();
        } catch (e) {
            setRaw(prev);
            toast.error(e?.message ?? "No se pudo eliminar la oferta");
        }
    }

    async function onCreateSubmit(formData) {
        try {
            await offersRepository.create(formData);
            toast.success("Oferta creada con éxito");
            setCreateOpen(false);
            load();
        } catch (e) {
            toast.error(e?.message ?? "No se pudo crear la oferta");
            throw e;
        }
    }

    async function onEditSubmit(id, formData) {
        try {
            await offersRepository.update(id, formData);
            toast.success("Oferta actualizada");
            setEditId(null);
            load();
        } catch (e) {
            toast.error(e?.message ?? "No se pudo actualizar la oferta");
            throw e;
        }
    }

    async function onToggleActive(id) {
        const offer = raw.find((o) => o.id === id);
        if (!offer) return;

        const prev = raw;
        setRaw((r) =>
            r.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
        );

        try {
            const payload = {
                title: offer.title,
                description: offer.description || "",
                startDate: offer.startDate,
                endDate: offer.endDate,
                isActive: !offer.isActive,
                discountPercentage: offer.discountPercentage,
                promoPrice: offer.promoPrice,
                customImageUrl: offer.customImageUrl
            };

            await offersRepository.update(id, payload);
            toast.success(`Oferta ${!offer.isActive ? "activada" : "desactivada"}`);
            load();
        } catch (e) {
            setRaw(prev);
            toast.error(e?.message ?? "Error al cambiar estado activo");
        }
    }

    return (
        <AdminOffersView
            loading={loading}
            error={error}
            items={raw}
            products={products}
            totalCount={backendTotalCount}
            page={page}
            totalPages={backendTotalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(backendTotalPages, p + 1))}
            onGoPage={(p) => setPage(p)}
            onDelete={onDelete}
            onCreate={() => setCreateOpen(true)}
            onEdit={(id) => setEditId(id)}
            onToggleActive={onToggleActive}
            createOpen={createOpen}
            onCreateOpenChange={setCreateOpen}
            editId={editId}
            onEditIdChange={setEditId}
            editOffer={editOffer}
            productQuery={productQuery}
            onProductQueryChange={setProductQuery}
            onCreateSubmit={onCreateSubmit}
            onEditSubmit={onEditSubmit}
        />
    );
}
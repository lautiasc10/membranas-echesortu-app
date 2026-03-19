// src/modules/sales/pages/SalesPage.jsx
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { salesRepository } from "../data/sales.repository";
import {
  mapSales,
  mapClients,
  mapVariants,
  saleToCart,
  computeCartTotals,
} from "../domain/sales.mapper";

import { usePagination } from "../../../shared/hooks/usePagination";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Plus, Trash2, Pencil, Search, BarChart3, List } from "lucide-react";

import { Pagination } from "../../../shared/ui/Pagination";
import { SaleCreateView } from "../ui/SaleCreateView";
import { DeleteConfirmDialog } from "../../../shared/ui/DeleteConfirmDialog";

function currency(n) {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n ?? 0);
  } catch {
    return `$${n ?? 0}`;
  }
}

function formatDate(x) {
  if (!x) return "—";
  const d = new Date(x);
  if (Number.isNaN(d.getTime())) return String(x);
  return d.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
}

export default function SalesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rawSales, setRawSales] = useState([]);
  const [rawClients, setRawClients] = useState([]);
  const [rawVariants, setRawVariants] = useState([]);

  const [backendTotalCount, setBackendTotalCount] = useState(0);
  const [backendTotalPages, setBackendTotalPages] = useState(1);

  // Hook genérico de paginación server-side
  const { page, pageSize, query, onQueryChange, setPage } = usePagination(10);

  // modal create/edit
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);

  // form state
  const [clientId, setClientId] = useState(null);
  const [variantQuery, setVariantQuery] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);

  // modal crear cliente (SaleCreateView lo usa)
  const [createClientOpen, setCreateClientOpen] = useState(false);

  async function loadList() {
    try {
      setLoading(true);
      setError(null);

      // ✅ Cargamos ventas paginadas y clientes para cruzar los nombres
      const [salesResp, clients] = await Promise.all([
        salesRepository.listSalesPaged({ page, pageSize, search: query }),
        salesRepository.listClients(),
      ]);

      setRawSales(salesResp.data ?? []);
      setBackendTotalCount(salesResp.totalCount ?? 0);
      setBackendTotalPages(salesResp.totalPages ?? 1);
      setRawClients(clients ?? []);
    } catch (e) {
      setError(e?.message ?? "Error cargando ventas");
    } finally {
      setLoading(false);
    }
  }

  async function loadFormData() {
    const [clients, variants] = await Promise.all([
      salesRepository.listClients(),
      salesRepository.listAllVariants({ pageSize: 500 }),
    ]);
    setRawClients(clients ?? []);
    setRawVariants(variants ?? []);
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, query]);

  const clients = useMemo(() => mapClients(rawClients), [rawClients]);
  const variants = useMemo(() => mapVariants(rawVariants), [rawVariants]);

  const clientsById = useMemo(() => {
    const m = new Map();
    for (const c of clients) m.set(Number(c.id), c);
    return m;
  }, [clients]);

  // ✅ Ventas mapeadas + join a clientes -> nombre real
  const sales = useMemo(() => {
    const mapped = mapSales(rawSales);
    return mapped.map((s) => {
      // prioridad:
      // 1) clientName si viene del backend
      // 2) buscar por clientId en clientes
      // 3) mostrador
      const fromBackend = s.clientName?.trim();
      if (fromBackend) return { ...s, clientName: fromBackend };

      const cid = s.clientId;
      if (cid == null) return { ...s, clientName: "Mostrador" };

      const c = clientsById.get(Number(cid));
      return { ...s, clientName: c?.name?.trim() ? c.name : "Mostrador" };
    });
  }, [rawSales, clientsById]);

  const filtered = sales; // Ya viene filtrado y paginado por el backend

  const variantsIndex = useMemo(() => {
    const m = new Map();
    for (const v of variants) m.set(Number(v.id), v);
    return m;
  }, [variants]);

  const filteredVariants = useMemo(() => {
    const qq = variantQuery.trim().toLowerCase();
    if (!qq) return variants.slice(0, 200);
    return variants
      .filter((v) =>
        [v.label, v.productName, v.brand, v.category]
          .filter(Boolean)
          .some((x) => String(x).toLowerCase().includes(qq))
      )
      .slice(0, 200);
  }, [variants, variantQuery]);

  const totals = useMemo(() => computeCartTotals(cart), [cart]);

  function resetForm() {
    setClientId(null);
    setVariantQuery("");
    setSelectedVariantId(null);
    setQty(1);
    setCart([]);
  }

  function openCreate() {
    setMode("create");
    setEditingId(null);
    resetForm();
    setOpen(true);
  }

  async function openEdit(id) {
    try {
      setMode("edit");
      setEditingId(id);

      if (rawVariants.length === 0) {
        await loadFormData();
      }

      const sale = await salesRepository.readSale(id);

      setClientId(sale?.clientId ?? sale?.client?.id ?? null);

      const nextCart = saleToCart(sale, variantsIndex);
      setCart(nextCart);

      setVariantQuery("");
      setSelectedVariantId(null);
      setQty(1);

      setOpen(true);
    } catch (e) {
      toast.error(e?.message ?? "No se pudo abrir la venta");
    }
  }

  function addToCart() {
    const selected = variants.find((v) => v.id === selectedVariantId) ?? null;
    if (!selected) return toast.error("Seleccioná un producto/variante");

    const qn = Number(qty);
    if (!Number.isFinite(qn) || qn <= 0) return toast.error("Cantidad inválida");

    if (selected.stock && qn > selected.stock) return toast.error("No hay stock suficiente");

    setCart((prev) => {
      const idx = prev.findIndex((x) => x.variantId === selected.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qn };
        return next;
      }
      return [
        ...prev,
        {
          variantId: selected.id,
          label: selected.label,       // ✅ nombre + variante + marca
          unitPrice: selected.salePrice,
          quantity: qn,
        },
      ];
    });

    // ✅ limpiar UI al agregar
    setVariantQuery("");
    setSelectedVariantId(null);
    setQty(1);

    toast.success("Agregado al carrito");
  }

  function removeItem(variantId) {
    setCart((prev) => prev.filter((x) => x.variantId !== variantId));
  }

  function setItemQty(variantId, quantity) {
    const qn = Number(quantity);
    if (!Number.isFinite(qn) || qn <= 0) return;
    setCart((prev) => prev.map((x) => (x.variantId === variantId ? { ...x, quantity: qn } : x)));
  }

  function clearCart() {
    setCart([]);
  }

  async function onCreateGuestClient(values) {
    try {
      const payload = { name: values.name?.trim(), email: values.email?.trim() || null };
      const created = await salesRepository.createGuestClient(payload);
      setRawClients((prev) => [created, ...prev]);
      setClientId(created.id);
      toast.success("Cliente creado y seleccionado");
      setCreateClientOpen(false);
    } catch (e) {
      toast.error(e?.message ?? "No se pudo crear el cliente");
      throw e;
    }
  }

  async function onSubmitSale() {
    if (cart.length === 0) return toast.error("El carrito está vacío");

    const payload = {
      clientId: clientId ?? null,
      details: cart.map((x) => ({
        productVariantId: x.variantId,
        quantity: Number(x.quantity),
      })),
    };

    try {
      if (mode === "create") {
        const created = await salesRepository.createSale(payload);
        toast.success(`Venta creada #${created?.id ?? ""}`);
      } else {
        await salesRepository.updateSale(editingId, payload);
        toast.success(`Venta actualizada #${editingId}`);
      }

      setOpen(false);
      resetForm();
      await loadList();
    } catch (e) {
      toast.error(e?.message ?? "No se pudo guardar la venta");
    }
  }

  async function onDeleteSale(id) {
    setSaleToDelete(id);
  }

  async function confirmDelete() {
    if (!saleToDelete) return;
    try {
      await salesRepository.deleteSale(saleToDelete);
      toast.success("Venta eliminada");
      setSaleToDelete(null);
      await loadList();
    } catch (e) {
      toast.error(e?.message ?? "No se pudo eliminar");
    }
  }

  // ✅ al abrir modal, garantizamos data del form
  useEffect(() => {
    if (!open) return;
    if (rawClients.length === 0 || rawVariants.length === 0) {
      loadFormData().catch(() => { });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Ventas</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium italic opacity-80">
            Listado, edición y eliminación de ventas del sistema.
          </p>
        </div>

        <Button className="gap-2" onClick={openCreate}>
          <Plus className="size-4" />
          Añadir Venta
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Listado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              className="pl-9"
              placeholder="Buscar por #ID, nombre de cliente o DNI..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </div>

          {loading && <div className="text-sm text-muted-foreground">Cargando...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {!loading && !error && (
            <>
              <div className="overflow-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="border-b bg-transparent text-muted-foreground uppercase font-black tracking-widest text-[10px]">
                    <tr>
                      <th className="hidden sm:table-cell px-6 py-3 text-left w-[80px]">ID</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Fecha</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Cliente</th>
                      <th className="hidden lg:table-cell px-6 py-3 text-center">Items</th>
                      <th className="px-4 sm:px-6 py-3 text-right">Total</th>
                      <th className="px-4 sm:px-6 py-3 text-right w-[80px] sm:w-[100px]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td className="p-3 text-muted-foreground" colSpan={6}>
                          No hay ventas para mostrar.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((s) => (
                        <tr key={s.id} className="group border-t hover:bg-slate-50/50 transition-colors">
                          <td className="hidden sm:table-cell px-6 py-3 font-mono text-[10px] text-muted-foreground">#{String(s.id).padStart(3, "0")}</td>
                          <td className="px-4 sm:px-6 py-3 text-[11px] sm:text-sm text-muted-foreground leading-tight">{formatDate(s.createdAt)}</td>
                          <td className="px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm tracking-tight truncate max-w-[100px] sm:max-w-none">{s.clientName}</td>
                          <td className="hidden lg:table-cell px-6 py-3 text-center">
                            <Badge variant="outline" className="font-black border-border/60 text-foreground bg-transparent">{s.itemsCount}</Badge>
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-right font-bold text-foreground text-xs sm:text-sm">{currency(s.total)}</td>
                          <td className="px-4 sm:px-6 py-3">
                            <div className="flex justify-end gap-0.5 sm:gap-1">
                              <Button variant="ghost" size="icon" className="size-7 sm:size-8" onClick={() => openEdit(s.id)} title="Editar">
                                <Pencil className="size-3 sm:size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 sm:size-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => onDeleteSale(s.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="size-3 sm:size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t mt-4">
                <p className="text-xs text-muted-foreground">
                  Mostrando {filtered.length} de {backendTotalCount} resultados
                </p>
                <Pagination page={page} totalPages={backendTotalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(backendTotalPages, p + 1))} onGoPage={(p) => setPage(p)} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* MODAL: crear/editar */}
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Nueva venta" : `Editar venta #${editingId}`}
            </DialogTitle>
            <DialogDescription>
              {mode === "create" ? "Cargá la venta y confirmá." : "Modificá la venta y guardá los cambios."}
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="pr-1">
            <SaleCreateView
              loading={false}
              error={null}
              clients={clients}
              clientId={clientId}
              onClientChange={setClientId}
              onOpenCreateClient={() => setCreateClientOpen(true)}
              createClientOpen={createClientOpen}
              onCreateClientOpenChange={setCreateClientOpen}
              onCreateClientSubmit={onCreateGuestClient}
              variants={filteredVariants}
              variantQuery={variantQuery}
              onVariantQueryChange={setVariantQuery}
              selectedVariantId={selectedVariantId}
              onSelectVariant={setSelectedVariantId}
              qty={qty}
              onQtyChange={setQty}
              onAddToCart={addToCart}
              cart={cart}
              totals={totals}
              onRemoveItem={removeItem}
              onSetItemQty={setItemQty}
              onClearCart={clearCart}
              onSubmitSale={onSubmitSale}
            />
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={saleToDelete != null}
        onOpenChange={(v) => !v && setSaleToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar venta"
        description="¿Seguro querés eliminar esta venta? Esta acción no se puede deshacer."
      />
    </div >
  );
}
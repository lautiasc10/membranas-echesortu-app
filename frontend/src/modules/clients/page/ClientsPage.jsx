import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { clientsRepository } from "../data/clients.repository";
import { mapClients } from "../domain/clients.mapper";
import { ClientsView } from "../ui/ClientsView";
import { useAuth } from "../../../shared/context/AuthContext";
import { usePagination } from "../../../shared/hooks/usePagination";

export function ClientsPage() {
  const [raw, setRaw] = useState([]);
  const [salesRaw, setSalesRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendTotalCount, setBackendTotalCount] = useState(0);
  const [backendTotalPages, setBackendTotalPages] = useState(1);
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const { page, pageSize, query, onQueryChange, setPage } = usePagination(10);
  const [tab, setTab] = useState("all");

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);

  // Edit dialog
  const [editId, setEditId] = useState(null);

  // History dialog
  const [historyClientId, setHistoryClientId] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [clientsResp, salesData] = await Promise.all([
        clientsRepository.listPaged({ page, pageSize, search: query }),
        clientsRepository.listSales()
      ]);
      setRaw(clientsResp.data ?? []);
      setBackendTotalCount(clientsResp.totalCount ?? 0);
      setBackendTotalPages(clientsResp.totalPages ?? 1);
      setSalesRaw(salesData ?? []);
    } catch (e) {
      setError(e?.message ?? "Error cargando datos de clientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, query]); // Re-fetch only on pagination/search changes

  const clients = useMemo(() => {
    const base = mapClients(raw);

    // Agregamos estadísticas de compras
    return base.map(c => {
      const clientSales = (salesRaw ?? []).filter(s => (s.clientId ?? s.ClientId) === c.id);
      const totalSpent = clientSales.reduce((acc, s) => acc + Number(s.total ?? s.Total ?? 0), 0);

      return {
        ...c,
        totalSales: clientSales.length,
        totalSpent
      };
    });
  }, [raw, salesRaw]);

  const topStats = useMemo(() => {
    if (!clients.length) return null;

    const byCount = [...clients].sort((a, b) => b.totalSales - a.totalSales)[0];
    const bySpent = [...clients].sort((a, b) => b.totalSpent - a.totalSpent)[0];

    return {
      topCount: byCount?.totalSales > 0 ? byCount : null,
      topSpent: bySpent?.totalSpent > 0 ? bySpent : null,
    };
  }, [clients]);

  const filtered = useMemo(() => {
    // Ya no filtramos localmente el query porque lo hace el backend, pero mantenemos tab si se quiere
    let base = clients;

    if (tab === "guest") base = base.filter((c) => c.isGuest);
    if (tab === "registered") base = base.filter((c) => !c.isGuest);

    return base;
  }, [clients, tab]);

  const editClient = useMemo(() => {
    if (editId == null) return null;
    return clients.find((c) => c.id === editId) ?? null;
  }, [clients, editId]);

  async function onDelete(id) {
    const prev = raw;
    setRaw((r) => r.filter((c) => c.id !== id));

    try {
      await clientsRepository.remove(id);
      toast.success(`Cliente #${id} eliminado`);
    } catch (e) {
      setRaw(prev);
      toast.error(e?.message ?? "No se pudo eliminar el cliente");
      throw e;
    }
  }

  async function onCreateSubmit(values) {
    // values: { name, email? }
    try {
      const payload = {
        name: values.name?.trim(),
        email: values.email?.trim() || null,
      };

      const created = await clientsRepository.create(payload);

      // Optimistic insert
      setRaw((prev) => [created, ...prev]);

      toast.success("Cliente creado");
      setCreateOpen(false);
      setPage(1);
      setQuery("");
    } catch (e) {
      toast.error(e?.message ?? "No se pudo crear el cliente");
      throw e;
    }
  }

  function buildPatch(original, next) {
    // PATCH solo con lo que cambió
    const patch = {};

    const nName = (next.name ?? "").trim();
    const nPhone = (next.phoneNumber ?? "").trim();
    const nEmail = (next.email ?? "").trim();

    const oName = (original.name ?? "").trim();
    const oPhone = (original.phoneNumber ?? "").trim();
    const oEmail = (original.email ?? "").trim();

    if (nName && nName !== oName) patch.name = nName;

    // para phone/email permitimos borrar mandando ""
    // si querés NO permitir borrar, cambiá la lógica
    if (nPhone !== oPhone) patch.phoneNumber = nPhone === "" ? "" : nPhone;
    if (nEmail !== oEmail) patch.email = nEmail === "" ? "" : nEmail;

    return patch;
  }

  async function onEditSubmit(values) {
    // values: { id, name, phoneNumber, email }
    const id = values.id;
    const original = clients.find((c) => c.id === id);
    if (!original) return;

    const patch = buildPatch(original, values);

    if (Object.keys(patch).length === 0) {
      toast.message("No hay cambios para guardar");
      setEditId(null);
      return;
    }

    // Optimistic update
    const prev = raw;
    setRaw((r) =>
      r.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );

    try {
      const updated = await clientsRepository.update(id, patch);

      // Aseguramos estado con respuesta del backend
      setRaw((r) => r.map((c) => (c.id === id ? updated : c)));

      toast.success("Cliente actualizado");
      setEditId(null);
    } catch (e) {
      setRaw(prev);
      toast.error(e?.message ?? "No se pudo actualizar el cliente");
      throw e;
    }
  }

  async function onRoleChange(id, newRole) {
    const prev = raw;
    // Optimistic update
    setRaw((r) =>
      r.map((c) => (c.id === id ? { ...c, role: newRole } : c))
    );

    try {
      const updated = await clientsRepository.update(id, { role: newRole });
      setRaw((r) => r.map((c) => (c.id === id ? updated : c)));
      toast.success(`Rol actualizado a "${newRole}"`);
    } catch (e) {
      setRaw(prev);
      toast.error(e?.message ?? "No se pudo actualizar el rol");
    }
  }

  return (
    <ClientsView
      loading={loading}
      error={error}
      tab={tab}
      onTabChange={(t) => {
        setTab(t);
        setPage(1);
      }}
      query={query}
      onQueryChange={onQueryChange}
      items={filtered}
      totalCount={backendTotalCount}
      page={page}
      totalPages={backendTotalPages}
      topStats={topStats}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => Math.min(backendTotalPages, p + 1))}
      onGoPage={(p) => setPage(p)}
      onDelete={onDelete}
      onCreate={() => setCreateOpen(true)}
      onEdit={(id) => setEditId(id)}
      onViewSales={(id) => setHistoryClientId(id)}
      historyClientId={historyClientId}
      onHistoryClose={() => setHistoryClientId(null)}
      sales={salesRaw}
      createOpen={createOpen}
      onCreateOpenChange={setCreateOpen}
      editId={editId}
      onEditIdChange={setEditId}
      editClient={editClient}
      onCreateSubmit={onCreateSubmit}
      onEditSubmit={onEditSubmit}
      onRoleChange={onRoleChange}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
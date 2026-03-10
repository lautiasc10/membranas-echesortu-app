import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, ShoppingCart, Search, TrendingUp, Award, Shield } from "lucide-react";
import { ClientHistoryDialog } from "./ClientHistoryDialog";
import { Pagination } from "../../../shared/ui/Pagination";

function Avatar({ initials }) {
  return (
    <div className="size-8 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-xs font-bold text-slate-600">
      {initials}
    </div>
  );
}



function CreateClientDialog({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setSaving(false);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors = {};
    if (name.trim().length < 2) newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email inválido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await onSubmit({ name, email });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro rápido de cliente</DialogTitle>
          <DialogDescription>
            Este cliente se crea como <b>mostrador</b> (sin contraseña). Podés editarlo después.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${errors.name ? "text-red-500" : ""}`}>Nombre</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
              placeholder="Ej: Juan Pérez"
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.name}</p>}
            {!errors.name && <p className="text-xs text-muted-foreground">Mínimo 2 caracteres.</p>}
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${errors.email ? "text-red-500" : ""}`}>Email (opcional)</label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: null }));
              }}
              placeholder="cliente@mail.com"
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.email}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Guardando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditClientDialog({ open, onOpenChange, client, onSubmit }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && client) {
      setName(client.name ?? "");
      setPhoneNumber(client.phoneNumber ?? "");
      setEmail(client.email ?? "");
      setSaving(false);
      setErrors({});
    }
    if (!open) {
      setSaving(false);
      setErrors({});
    }
  }, [open, client]);

  const validate = () => {
    const newErrors = {};
    if (name.trim().length < 2) newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email inválido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await onSubmit({
        id: client.id,
        name,
        phoneNumber,
        email,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onOpenChange(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar cliente #{client?.id}</DialogTitle>
          <DialogDescription>
            {client?.isGuest ? (
              <>Cliente de mostrador (sin login).</>
            ) : (
              <>Cliente registrado.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${errors.name ? "text-red-500" : ""}`}>Nombre</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Teléfono</label>
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+54 341 ..." />
            <p className="text-xs text-muted-foreground">
              Si lo dejás vacío, se borra (PATCH).
            </p>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${errors.email ? "text-red-500" : ""}`}>Email</label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: null }));
              }}
              placeholder="cliente@mail.com"
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.email}</p>}
            {!errors.email && (
              <p className="text-xs text-muted-foreground">
                Si lo dejás vacío, se borra (PATCH).
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ClientsView({
  loading,
  error,
  tab,
  onTabChange,
  query,
  onQueryChange,
  items,
  totalCount,
  page,
  totalPages,
  onPrev,
  onNext,
  onGoPage,

  onCreate,
  onEdit,
  onViewSales,
  onDelete,
  onRoleChange,
  isSuperAdmin,

  createOpen,
  onCreateOpenChange,
  editId,
  onEditIdChange,
  editClient,

  onCreateSubmit,
  onEditSubmit,
  topStats,
  historyClientId,
  onHistoryClose,
  sales
}) {
  const [deleteId, setDeleteId] = useState(null);

  const money = (v) => Number(v || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Directorio de Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium italic opacity-80">
            Base de datos centralizada e inteligencia de consumo.
          </p>
        </div>

        <Button className="gap-2" onClick={onCreate}>
          <Plus className="size-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Summary Cards */}
      {!loading && topStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-orange-500 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-foreground">
                <ShoppingCart className="size-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cliente con más compras</span>
              </div>
            </CardHeader>
            <CardContent>
              {topStats.topCount ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black">{topStats.topCount.name}</p>
                    <p className="text-xs text-muted-foreground">ID #{String(topStats.topCount.id).padStart(3, "0")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-600">{topStats.topCount.totalSales}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Ventas totales</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos suficientes</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-foreground">
                <TrendingUp className="size-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Mayor gasto acumulado</span>
              </div>
            </CardHeader>
            <CardContent>
              {topStats.topSpent ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black">{topStats.topSpent.name}</p>
                    <p className="text-xs text-muted-foreground">ID #{String(topStats.topSpent.id).padStart(3, "0")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-green-600">{money(topStats.topSpent.totalSpent)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Inversión total</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos suficientes</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs + Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs value={tab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              Todos
              <span className="ml-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                {totalCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="guest">Mostrador</TabsTrigger>
            <TabsTrigger value="registered">Registrados</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-[360px]">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Buscar por nombre, mail o ID..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-none shadow-sm">
        <CardContent className="p-0">
          {loading && <div className="p-12 text-center text-sm text-muted-foreground">Cargando base de datos de clientes...</div>}
          {error && <div className="p-12 text-center text-sm text-red-600 font-bold">{error}</div>}

          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/60">
                      <TableHead className="hidden sm:table-cell text-[10px] font-bold uppercase tracking-wider px-6 w-[80px]">ID</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-wider px-4 sm:px-6">Nombre / Contacto</TableHead>
                      <TableHead className="hidden sm:table-cell text-[10px] font-bold uppercase tracking-wider text-center">Ventas</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right px-4">Inversión Total</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-wider w-[100px] sm:w-[120px]">Estado</TableHead>
                      {isSuperAdmin && (
                        <TableHead className="hidden md:table-cell text-[10px] font-bold uppercase tracking-wider w-[120px]">Rol</TableHead>
                      )}
                      <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right px-4 sm:px-6">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {items.map((c) => (
                      <TableRow key={c.id} className="group hover:bg-slate-50/50 border-border/30">
                        <TableCell className="hidden sm:table-cell font-mono text-[10px] text-muted-foreground px-6 py-4">
                          #{String(c.id).padStart(3, "0")}
                        </TableCell>

                        <TableCell className="px-4 sm:px-6">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar initials={c.initials} />
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{c.name}</span>
                              <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{c.email || c.phoneNumber || "S/D"}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell text-center">
                          <Badge variant="outline" className="font-black border-border/60 text-foreground bg-transparent">
                            {c.totalSales}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right font-bold text-foreground text-xs sm:text-sm px-4">
                          {money(c.totalSpent)}
                        </TableCell>

                        <TableCell className="px-2">
                          {c.isGuest ? (
                            <span className="font-bold text-[11px] sm:text-sm">Mostrador</span>
                          ) : (
                            <span className="font-bold text-[11px] sm:text-sm">Registrado</span>
                          )}
                        </TableCell>

                        {isSuperAdmin && (
                          <TableCell className="hidden md:table-cell px-2">
                            <Select
                              value={c.role}
                              onValueChange={(value) => onRoleChange(c.id, value)}
                            >
                              <SelectTrigger className="h-7 w-[100px] text-[11px] font-bold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  <span className="flex items-center gap-1.5">
                                    <Shield className="size-3 text-orange-500" />
                                    Admin
                                  </span>
                                </SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="guest">Guest</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        )}

                        <TableCell className="text-right px-4 sm:px-6">
                          <div className="inline-flex items-center gap-0.5 sm:gap-1 transition-opacity">
                            <Button variant="ghost" size="icon" className="size-7 sm:size-8" onClick={() => onEdit(c.id)} title="Editar">
                              <Pencil className="size-3 sm:size-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 sm:size-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteId(c.id)}
                              title="Eliminar"
                            >
                              <Trash2 className="size-3 sm:size-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 sm:h-8 px-2 sm:px-3 gap-1.5 text-[9px] sm:text-[10px] font-bold"
                              onClick={() => onViewSales(c.id)}
                              title="Ver historial de ventas"
                            >
                              <ShoppingCart className="size-3" />
                              <span className="hidden xs:inline">Historial</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={isSuperAdmin ? 7 : 6} className="text-center text-sm text-muted-foreground py-10">
                          No hay clientes para mostrar.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-xs text-muted-foreground">
                  Mostrando {items.length} de {totalCount} resultados
                </p>
                <Pagination page={page} totalPages={totalPages} onPrev={onPrev} onNext={onNext} onGoPage={onGoPage} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm */}
      <AlertDialog open={deleteId != null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Seguro que querés eliminar este cliente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const id = deleteId;
                setDeleteId(null);
                try {
                  await onDelete(id);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create dialog */}
      <CreateClientDialog
        open={createOpen}
        onOpenChange={onCreateOpenChange}
        onSubmit={onCreateSubmit}
      />

      {/* Edit dialog */}
      <EditClientDialog
        open={editId != null}
        onOpenChange={(v) => !v && onEditIdChange(null)}
        client={editClient}
        onSubmit={onEditSubmit}
      />

      {/* History dialog */}
      <ClientHistoryDialog
        open={historyClientId != null}
        onOpenChange={(v) => !v && onHistoryClose()}
        client={items.find(i => i.id === historyClientId)}
        sales={sales}
      />
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Search, ShoppingCart } from "lucide-react";

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
          <DialogTitle>Nuevo cliente (mostrador)</DialogTitle>
          <DialogDescription>
            Se crea sin contraseña. Podés asociarlo a la venta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className={errors.name ? "text-red-500" : ""}>Nombre</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
              placeholder="Ej: Juan Pérez"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label className={errors.email ? "text-red-500" : ""}>Email (opcional)</Label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: null }));
              }}
              placeholder="cliente@mail.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.email}</p>}
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

export function SaleCreateView({
  loading,
  error,

  clients,
  clientId,
  onClientChange,
  onOpenCreateClient,

  createClientOpen,
  onCreateClientOpenChange,
  onCreateClientSubmit,

  variants,
  variantQuery,
  onVariantQueryChange,
  selectedVariantId,
  onSelectVariant,
  qty,
  onQtyChange,
  onAddToCart,

  cart,
  totals,
  onRemoveItem,
  onSetItemQty,
  onClearCart,
  onSubmitSale,
}) {
  const selectedClient = useMemo(
    () => clients.find((c) => c.id === clientId) ?? null,
    [clients, clientId]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Crear Venta</h1>
          <p className="text-muted-foreground mt-1">
            Seleccioná cliente (opcional), agregá productos y confirmá.
          </p>
        </div>

        <Button className="gap-2" onClick={onSubmitSale}>
          <ShoppingCart className="size-4" />
          Confirmar venta
        </Button>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Cargando...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cliente */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cliente (opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col md:flex-row gap-3 md:items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Seleccionar cliente</Label>
                    <select
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                      value={clientId ?? ""}
                      onChange={(e) => onClientChange(e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">Sin cliente (Mostrador)</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          #{c.id} · {c.name} {c.isGuest ? "(Mostrador)" : ""}
                        </option>
                      ))}
                    </select>
                    {selectedClient && (
                      <div className="text-xs text-muted-foreground">
                        {selectedClient.email ? selectedClient.email : "—"}{" "}
                        {selectedClient.phoneNumber ? `· ${selectedClient.phoneNumber}` : ""}
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="gap-2" onClick={onOpenCreateClient}>
                    <Plus className="size-4" />
                    Nuevo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Producto / Variante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar producto, marca, categoría..."
                    value={variantQuery}
                    onChange={(e) => onVariantQueryChange(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Seleccionar variante</Label>
                    <select
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                      value={selectedVariantId ?? ""}
                      onChange={(e) => onSelectVariant(e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">Elegí una variante...</option>
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.productName}
                          {v.variantName ? ` · ${v.variantName}` : ""}
                          {v.brand ? ` · ${v.brand}` : ""}
                          {" | "}
                          {currency(v.salePrice)} | Stock: {v.stock ?? 0}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Mostrando {variants.length} resultados (máx. 50). Refiná con búsqueda.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Cantidad</Label>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => onQtyChange(e.target.value)}
                        className={qty <= 0 ? "border-red-500" : ""}
                      />
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
                        onClick={() => {
                          if (!selectedVariantId) {
                            alert("Por favor, seleccioná una variante primero.");
                            return;
                          }
                          if (qty <= 0) {
                            alert("La cantidad debe ser mayor a 0.");
                            return;
                          }
                          onAddToCart();
                        }}
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carrito (lista editable) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Carrito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cart.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No agregaste productos todavía.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((it) => (
                      <div
                        key={it.variantId}
                        className="flex flex-col md:flex-row md:items-center gap-3 border rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <div className="font-semibold">{it.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {currency(it.unitPrice)} c/u
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            className="w-[90px]"
                            value={it.quantity}
                            onChange={(e) => onSetItemQty(it.variantId, e.target.value)}
                          />
                          <Badge variant="secondary">
                            {currency(it.quantity * it.unitPrice)}
                          </Badge>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItem(it.variantId)}
                            title="Quitar"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-end">
                      <Button variant="outline" onClick={onClearCart}>
                        Vaciar carrito
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{currency(totals.subtotal)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-black">{currency(totals.total)}</span>
                </div>

                <Button className="w-full mt-2 gap-2" onClick={onSubmitSale} disabled={cart.length === 0}>
                  <ShoppingCart className="size-4" />
                  Confirmar venta
                </Button>

                <p className="text-xs text-muted-foreground">
                  Si no seleccionás cliente, se guarda como venta de mostrador (backend asigna Consumidor Final).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Crear cliente */}
      <CreateClientDialog
        open={createClientOpen}
        onOpenChange={onCreateClientOpenChange}
        onSubmit={onCreateClientSubmit}
      />
    </div>
  );
}
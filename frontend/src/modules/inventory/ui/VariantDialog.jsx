import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

function toNum(v) {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

export function VariantDialog({
  open,
  variantId,
  busy,
  onClose,
  onLoadVariant,
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);

  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open || !variantId) return;

    (async () => {
      try {
        setLoading(true);
        const v = await onLoadVariant(variantId);

        setSalePrice(String(v?.salePrice ?? v?.SalePrice ?? 0));
        setPurchasePrice(String(v?.purchasePrice ?? v?.PurchasePrice ?? 0));
        setCurrentStock(String(v?.currentStock ?? v?.CurrentStock ?? 0));
        setMinimumStock(String(v?.minimumStock ?? v?.MinimumStock ?? 0));
        setErrors({});
      } finally {
        setLoading(false);
      }
    })();
  }, [open, variantId, onLoadVariant]);

  const validate = () => {
    const newErrors = {};
    if (salePrice && Number(salePrice) < 0) newErrors.salePrice = "No puede ser negativo.";
    if (purchasePrice && Number(purchasePrice) < 0) newErrors.purchasePrice = "No puede ser negativo.";
    if (currentStock && Number(currentStock) < 0) newErrors.currentStock = "No puede ser negativo.";
    if (minimumStock && Number(minimumStock) < 0) newErrors.minimumStock = "No puede ser negativo.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSave() {
    if (!validate()) return;

    const payload = {
      salePrice: toNum(salePrice),
      purchasePrice: toNum(purchasePrice),
      currentStock: Math.trunc(toNum(currentStock)),
      minimumStock: Math.trunc(toNum(minimumStock)),
    };

    await onSubmit(variantId, payload);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Editar variante</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-sm text-muted-foreground">Cargando variante...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className={errors.salePrice ? "text-red-500" : ""}>Precio venta</Label>
              <Input
                value={salePrice}
                onChange={(e) => {
                  setSalePrice(e.target.value);
                  if (errors.salePrice) setErrors(prev => ({ ...prev, salePrice: null }));
                }}
                className={errors.salePrice ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.salePrice && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.salePrice}</p>}
            </div>

            <div className="space-y-1">
              <Label className={errors.purchasePrice ? "text-red-500" : ""}>Precio compra</Label>
              <Input
                value={purchasePrice}
                onChange={(e) => {
                  setPurchasePrice(e.target.value);
                  if (errors.purchasePrice) setErrors(prev => ({ ...prev, purchasePrice: null }));
                }}
                className={errors.purchasePrice ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.purchasePrice && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.purchasePrice}</p>}
            </div>

            <div className="space-y-1">
              <Label className={errors.currentStock ? "text-red-500" : ""}>Stock actual</Label>
              <Input
                value={currentStock}
                onChange={(e) => {
                  setCurrentStock(e.target.value);
                  if (errors.currentStock) setErrors(prev => ({ ...prev, currentStock: null }));
                }}
                className={errors.currentStock ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.currentStock && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.currentStock}</p>}
            </div>

            <div className="space-y-1">
              <Label className={errors.minimumStock ? "text-red-500" : ""}>Stock mínimo</Label>
              <Input
                value={minimumStock}
                onChange={(e) => {
                  setMinimumStock(e.target.value);
                  if (errors.minimumStock) setErrors(prev => ({ ...prev, minimumStock: null }));
                }}
                className={errors.minimumStock ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.minimumStock && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.minimumStock}</p>}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={busy || loading}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
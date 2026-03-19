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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export function ProductDialog({
  open,
  mode, // "create" | "edit"
  initial, // { productId, name, description, brandId, categoryId }
  busy,
  onClose,
  onSubmit,
  onUploadImage,
  brandOptions = [],     // [{id,name}]
  categoryOptions = [],  // [{id,name}]
  onCreateBrand,
  onCreateCategory,
}) {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Lista de variantes (usado solo en creación)
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (!open) return;

    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");

    setBrandId(
      initial?.brandId !== undefined && initial?.brandId !== null
        ? String(initial.brandId)
        : ""
    );
    setCategoryId(
      initial?.categoryId !== undefined && initial?.categoryId !== null
        ? String(initial.categoryId)
        : ""
    );

    setFile(null);
    setErrors({});

    // Inicializar con una variante vacía si es creación
    if (!isEdit) {
      setVariants([
        { salePrice: "", purchasePrice: "", currentStock: "", minimumStock: "", color: "", size: "", weight: "" }
      ]);
    } else {
      setVariants([]);
    }
  }, [open, initial, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (name.trim().length < 2) newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    if (!brandId) newErrors.brandId = "Debes elegir una marca.";
    if (!categoryId) newErrors.categoryId = "Debes elegir una categoría.";

    // Validar variantes en creación
    if (!isEdit) {
      const variantErrors = variants.map((v, i) => {
        const err = {};
        if (v.salePrice && Number(v.salePrice) < 0) err.salePrice = "No puede ser negativo.";
        if (v.purchasePrice && Number(v.purchasePrice) < 0) err.purchasePrice = "No puede ser negativo.";
        if (v.currentStock && Number(v.currentStock) < 0) err.currentStock = "No puede ser negativo.";
        if (v.minimumStock && Number(v.minimumStock) < 0) err.minimumStock = "No puede ser negativo.";
        return Object.keys(err).length > 0 ? err : null;
      });
      if (variantErrors.some(v => v !== null)) newErrors.variants = variantErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addVariant = () => {
    setVariants([...variants, { salePrice: "", purchasePrice: "", currentStock: "", minimumStock: "", color: "", size: "", weight: "" }]);
  };

  const removeVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx, field, val) => {
    const next = [...variants];
    next[idx] = { ...next[idx], [field]: val };
    setVariants(next);
  };

  async function handleSave() {
    if (!validate()) return;

    const payload = {
      Name: name.trim(),
      Description: description.trim() || null,
      CategoryId: Number(categoryId),
      BrandId: Number(brandId),
      ImageUrl: null,
      // Lista de variantes mapeada
      Variants: variants.map(v => ({
        SalePrice: Number(v.salePrice || 0),
        PurchasePrice: Number(v.purchasePrice || 0),
        CurrentStock: v.currentStock ? Number(v.currentStock) : 0,
        MinimumStock: v.minimumStock ? Number(v.minimumStock) : 0,
        Color: v.color.trim() || null,
        Size: v.size.trim() || null,
        Weight: v.weight.trim() || null,
      }))
    };

    const res = await onSubmit(payload);

    if (!isEdit && file && (res?.id ?? res?.Id)) {
      await onUploadImage(file, res?.id ?? res?.Id);
    }

    onClose();
  }

  async function handleUploadEditOnly() {
    if (!file) return;
    await onUploadImage(file);
    setFile(null);
  }

  function handleAddBrand() {
    const name = window.prompt("Nueva Marca:");
    if (name) onCreateBrand?.(name);
  }

  function handleAddCategory() {
    const name = window.prompt("Nueva Categoría:");
    if (name) onCreateCategory?.(name);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar producto" : "Crear producto"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className={errors.name ? "text-red-500" : ""}>Nombre</Label>
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

              <div className="space-y-1">
                <Label>Descripción (opcional)</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <Label className={errors.brandId ? "text-red-500" : ""}>Marca</Label>
                  <Button variant="ghost" size="sm" className="h-4 text-xs px-2 font-bold text-blue-600" onClick={handleAddBrand} disabled={busy}>
                    + Nueva
                  </Button>
                </div>
                <Select
                  value={brandId}
                  onValueChange={(v) => {
                    setBrandId(v);
                    if (errors.brandId) setErrors(prev => ({ ...prev, brandId: null }));
                  }}
                >
                  <SelectTrigger className={errors.brandId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Elegí marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandOptions.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brandId && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.brandId}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <Label className={errors.categoryId ? "text-red-500" : ""}>Categoría</Label>
                  <Button variant="ghost" size="sm" className="h-4 text-xs px-2 font-bold text-blue-600" onClick={handleAddCategory} disabled={busy}>
                    + Nueva
                  </Button>
                </div>
                <Select
                  value={categoryId}
                  onValueChange={(v) => {
                    setCategoryId(v);
                    if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: null }));
                  }}
                >
                  <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Elegí categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.categoryId}</p>}
              </div>
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-6 pt-4 border-t mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-black text-blue-700 uppercase tracking-wider">Variantes del producto</h3>
                <Button type="button" size="sm" onClick={addVariant} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="size-4" />
                  Agregar otra variante
                </Button>
              </div>

              <div className="space-y-8">
                {variants.map((v, idx) => (
                  <div key={idx} className="relative p-4 border rounded-xl bg-slate-50/50 space-y-4 border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Variante #{idx + 1}</span>
                      {variants.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeVariant(idx)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className={`text-xs ${errors.variants?.[idx]?.salePrice ? "text-red-500" : ""}`}>Precio Venta</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={v.salePrice}
                          onChange={(e) => updateVariant(idx, "salePrice", e.target.value)}
                          className={errors.variants?.[idx]?.salePrice ? "border-red-500" : ""}
                        />
                        {errors.variants?.[idx]?.salePrice && <p className="text-[9px] font-bold text-red-500 uppercase">{errors.variants[idx].salePrice}</p>}
                      </div>
                      <div className="space-y-1">
                        <Label className={`text-xs ${errors.variants?.[idx]?.purchasePrice ? "text-red-500" : ""}`}>Precio Compra (Costo)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={v.purchasePrice}
                          onChange={(e) => updateVariant(idx, "purchasePrice", e.target.value)}
                          className={errors.variants?.[idx]?.purchasePrice ? "border-red-500" : ""}
                        />
                        {errors.variants?.[idx]?.purchasePrice && <p className="text-[9px] font-bold text-red-500 uppercase">{errors.variants[idx].purchasePrice}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className={`text-xs ${errors.variants?.[idx]?.currentStock ? "text-red-500" : ""}`}>Stock Actual</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={v.currentStock}
                          onChange={(e) => updateVariant(idx, "currentStock", e.target.value)}
                          className={errors.variants?.[idx]?.currentStock ? "border-red-500" : ""}
                        />
                        {errors.variants?.[idx]?.currentStock && <p className="text-[9px] font-bold text-red-500 uppercase">{errors.variants[idx].currentStock}</p>}
                      </div>
                      <div className="space-y-1">
                        <Label className={`text-xs ${errors.variants?.[idx]?.minimumStock ? "text-red-500" : ""}`}>Stock Mínimo</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={v.minimumStock}
                          onChange={(e) => updateVariant(idx, "minimumStock", e.target.value)}
                          className={errors.variants?.[idx]?.minimumStock ? "border-red-500" : ""}
                        />
                        {errors.variants?.[idx]?.minimumStock && <p className="text-[9px] font-bold text-red-500 uppercase">{errors.variants[idx].minimumStock}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Color</Label>
                        <Input
                          placeholder="Ej: Rojo"
                          value={v.color}
                          onChange={(e) => updateVariant(idx, "color", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Talle</Label>
                        <Input
                          placeholder="Ej: XL"
                          value={v.size}
                          onChange={(e) => updateVariant(idx, "size", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Peso</Label>
                        <Input
                          placeholder="Ej: 10kg"
                          value={v.weight}
                          onChange={(e) => updateVariant(idx, "weight", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1 pt-4 border-t">
            <Label>Imagen (opcional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            {isEdit && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleUploadEditOnly}
                  disabled={busy || !file}
                >
                  Subir/Reemplazar imagen
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={busy}>
            {isEdit ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
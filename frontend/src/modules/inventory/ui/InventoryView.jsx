import { useMemo, useState } from "react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { Pagination } from "../../../shared/ui/Pagination";

function money(n) {
  return Number(n ?? 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function stockLabel(current, min) {
  const c = Number(current ?? 0);
  const m = Number(min ?? 0);
  if (m > 0 && c <= 0) return { text: "SIN STOCK", tone: "danger" };
  if (m > 0 && c <= m) return { text: "BAJO STOCK", tone: "warning" };
  return { text: "EN STOCK", tone: "ok" };
}

function StockPill({ currentStock, minimumStock }) {
  const s = stockLabel(currentStock, minimumStock);
  const cls =
    s.tone === "danger"
      ? "bg-red-100 text-red-700"
      : s.tone === "warning"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{s.text}</span>;
}



function ProductCard({ item, onEditProduct, onDeleteProduct, onEditVariant }) {
  const [selectedId, setSelectedId] = useState(item.variants[0]?.id ?? null);

  const selected = useMemo(
    () => item.variants.find((v) => v.id === selectedId) ?? item.variants[0],
    [item.variants, selectedId]
  );


  const img = selected?.imageUrl || item.imageUrl;

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="aspect-[4/3] bg-white flex items-center justify-center p-2">
          {img ? (
            <img src={img} alt={item.name} className="h-full w-full object-contain" />
          ) : (
            <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">
              Sin imagen
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest bg-primary/90 text-primary-foreground border-none backdrop-blur-sm px-2 py-0.5 shadow-lg pointer-events-none">
            {item.category || "General"}
          </Badge>
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => onEditProduct(item.productId)} title="Editar producto">
            <Pencil className="size-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => onDeleteProduct(item.productId)} title="Eliminar producto">
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="absolute bottom-3 right-3">
          <StockPill currentStock={selected?.currentStock} minimumStock={selected?.minimumStock} />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase">{item.brand || "Marca"}</p>
          <h3 className="text-base font-black leading-tight">{item.name}</h3>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground font-semibold uppercase">
            Variante seleccionada
          </p>

          <Select value={String(selectedId ?? "")} onValueChange={(v) => setSelectedId(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Elegí variante" />
            </SelectTrigger>
            <SelectContent>
              {item.variants.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <p className="text-[11px] text-muted-foreground">Precio Venta</p>
            <p className="font-black">{money(selected?.salePrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Stock Actual</p>
            <p className="font-black">{selected?.currentStock ?? 0} <span className="text-xs text-muted-foreground">uds</span></p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => onEditVariant(selected?.id)} disabled={!selected?.id}>
            Editar Var.
          </Button>
          <Button variant="outline" size="icon" onClick={() => onEditProduct(item.productId)} title="Editar">
            <Pencil className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function InventoryView({
  loading,
  error,
  items,
  totalCount,
  page,
  totalPages,

  categories,
  brands,
  filters,
  onSearchChange,
  onBrandChange,
  onCategoryChange,
  onSortChange,
  onClearFilters,

  onPrev,
  onNext,
  onGoPage,

  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onEditVariant,
}) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Gestión de Inventario</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium italic opacity-80">
            Administra productos, sus variantes y niveles de stock actualizados.
          </p>
        </div>

        <Button className="gap-2" onClick={onAddProduct}>
          <Plus className="size-4" />
          Añadir Producto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                className="pl-9"
                placeholder="Buscar producto..."
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <Select value={filters.brand} onValueChange={onBrandChange}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b === "all" ? "Todas las marcas" : b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "all" ? "Todas las categorías" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Prioridad de marca</SelectItem>
                <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Resultados: <span className="font-semibold">{totalCount}</span>
            </p>

            <Button variant="outline" size="sm" className="gap-2" onClick={onClearFilters}>
              <X className="size-4" />
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading && (
          <div className="col-span-full text-sm text-muted-foreground p-4">
            Cargando inventario...
          </div>
        )}

        {error && (
          <div className="col-span-full text-sm text-red-600 p-4">{error}</div>
        )}

        {!loading && !error && items.map((p) => (
          <ProductCard
            key={p.productId}
            item={p}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            onEditVariant={onEditVariant}
          />
        ))}

        {!loading && !error && items.length === 0 && (
          <div className="col-span-full text-sm text-muted-foreground p-4">
            No hay productos para mostrar con esos filtros.
          </div>
        )}
      </div>

      {/* Footer pagination */}
      {!loading && !error && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            Mostrando {(page - 1) * 8 + 1}-{Math.min(page * 8, totalCount)} de {totalCount} productos
          </p>
          <Pagination page={page} totalPages={totalPages} onPrev={onPrev} onNext={onNext} onGoPage={onGoPage} />
        </div>
      )}
    </div>
  );
}
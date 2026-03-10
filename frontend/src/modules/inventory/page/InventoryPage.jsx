import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryView } from "../ui/InventoryView";

import { ProductDialog } from "../ui/ProductDialog";
import { VariantDialog } from "../ui/VariantDialog";
import { ConfirmDialog } from "../ui/ConfirmDialog";

import { getPagedProducts, getProductById, deleteProduct } from "../../../services/products.api";
import { brandsApi } from "../../../services/brands.api";
import { categoriesApi } from "../../../services/categories.api";
import { useInventoryCrud } from "../hooks/useInventoryCrud";

const PAGE_SIZE_PRODUCTS = 8;

export default function InventoryPage() {
  const queryClient = useQueryClient();

  // Filters from UI
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("priority");

  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productDialogMode, setProductDialogMode] = useState("create");
  const [productSelected, setProductSelected] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState(null);

  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [variantSelectedId, setVariantSelectedId] = useState(null);

  const [busy, setBusy] = useState(false);

  // Queries
  const { data: brandsRaw = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsApi.getAll(),
  });

  const { data: categoriesRaw = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const {
    data: pagedData,
    isLoading: loadingProducts,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ["products", page, search, brand, category, sort],
    queryFn: () =>
      getPagedProducts({ page, pageSize: PAGE_SIZE_PRODUCTS, search, brand, category, sort }),
  });

  // Re-use logic for actions
  const crud = useInventoryCrud({
    onRefresh: () => {
      // Invalidate relevant queries when data changes
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mappings
  const categoryOptions = useMemo(() => {
    return (categoriesRaw ?? [])
      .map((c) => ({ id: c.id, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesRaw]);

  const brandOptions = useMemo(() => {
    return (brandsRaw ?? [])
      .map((b) => ({ id: b.id, name: b.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brandsRaw]);

  const items = useMemo(() => {
    if (!pagedData || !pagedData.data) return [];
    return pagedData.data.map((dto) => {
      // Map variants to match what InventoryView expects
      const mappedVariants = (dto.variants ?? []).map((v) => {
        const parts = [v.weight, v.color, v.size].filter(Boolean);
        return {
          id: v.id,
          label: parts.length > 0 ? parts.join(" - ") : `Variante #\${v.id}`,
          salePrice: Number(v.salePrice || 0),
          purchasePrice: Number(v.purchasePrice || 0),
          currentStock: Number(v.currentStock || 0),
          minimumStock: Number(v.minimumStock || 0),
          imageUrl: v.imageUrl || null,
        };
      });

      // Maintain order
      mappedVariants.sort((a, b) => a.salePrice - b.salePrice);

      return {
        productId: dto.productId,
        name: dto.name || "",
        description: dto.description || "",
        imageUrl: dto.imageUrl || (mappedVariants[0]?.imageUrl ?? null),
        brandId: dto.brandId || null,
        categoryId: dto.categoryId || null,
        brand: dto.brand || "",
        category: dto.category || "",
        variants: mappedVariants,
      };
    });
  }, [pagedData]);

  const totalCount = pagedData?.totalCount ?? 0;
  const totalPages = pagedData?.totalPages ?? 1;

  // Derive filters explicitly from standard queries, though it could be from backend distinct too.
  // Using global options for now so filters cover all possible brands/categories
  const categoriesFilter = useMemo(() => {
    return ["all", ...categoryOptions.map((c) => c.name)];
  }, [categoryOptions]);

  const brandsFilter = useMemo(() => {
    return ["all", ...brandOptions.map((b) => b.name)];
  }, [brandOptions]);

  const errorMsg = isError ? (fetchError?.message ?? "Error cargando inventario") : null;

  // Handlers
  function clearFilters() {
    setSearch("");
    setBrand("all");
    setCategory("all");
    setSort("priority");
    setPage(1);
  }

  function handleFilterChange(setter) {
    return (val) => {
      setter(val);
      setPage(1);
    };
  }

  function handleAddProduct() {
    setProductDialogMode("create");
    setProductSelected(null);
    setProductDialogOpen(true);
  }

  async function handleEditProduct(productId) {
    try {
      setBusy(true);
      const dto = await getProductById(productId);
      setProductDialogMode("edit");
      setProductSelected({
        productId: dto?.id ?? productId,
        name: dto?.name ?? "",
        description: dto?.description ?? "",
        brandId: dto?.brandId ?? null,
        categoryId: dto?.categoryId ?? null,
      });
      setProductDialogOpen(true);
    } catch (e) {
      console.error(e);
      // Fallback UI handled gracefully or via toaster in a real app
    } finally {
      setBusy(false);
    }
  }

  function handleDeleteProduct(productId) {
    setDeleteSelected(productId);
    setConfirmOpen(true);
  }

  async function submitProduct(payload) {
    try {
      setBusy(true);
      if (productDialogMode === "create") {
        return await crud.create(payload);
      }
      return await crud.update(productSelected?.productId, payload);
    } finally {
      setBusy(false);
    }
  }

  async function uploadProductImg(file, createdIdOptional) {
    try {
      setBusy(true);
      const id = createdIdOptional ?? productSelected?.productId;
      if (!id) return;
      await crud.uploadImage(id, file);
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteSelected) return;
    try {
      setBusy(true);
      await deleteProduct(deleteSelected);
      setConfirmOpen(false);
      setDeleteSelected(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } finally {
      setBusy(false);
    }
  }

  function handleEditVariant(variantId) {
    if (!variantId) return;
    setVariantSelectedId(variantId);
    setVariantDialogOpen(true);
  }

  async function loadVariant(id) {
    return crud.getVariant(id);
  }

  async function submitVariant(id, payload) {
    try {
      setBusy(true);
      await crud.updateVar(id, payload);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateBrand(name) {
    if (!name) return;
    try {
      setBusy(true);
      await brandsApi.create({ name });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateCategory(name) {
    if (!name) return;
    try {
      setBusy(true);
      await categoriesApi.create({ name });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <InventoryView
        loading={loadingProducts}
        error={errorMsg}
        items={items}
        totalCount={totalCount}
        page={page}
        totalPages={totalPages}
        categories={categoriesFilter}
        brands={brandsFilter}
        filters={{ search, brand, category, sort }}
        onSearchChange={handleFilterChange(setSearch)}
        onBrandChange={handleFilterChange(setBrand)}
        onCategoryChange={handleFilterChange(setCategory)}
        onSortChange={handleFilterChange(setSort)}
        onClearFilters={clearFilters}
        onPrev={() => {
          setPage((p) => Math.max(1, p - 1));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNext={() => {
          setPage((p) => Math.min(totalPages, p + 1));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onGoPage={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onEditVariant={handleEditVariant}
      />

      <ProductDialog
        open={productDialogOpen}
        mode={productDialogMode}
        initial={productSelected}
        busy={busy}
        onClose={() => setProductDialogOpen(false)}
        onSubmit={submitProduct}
        onUploadImage={(file, createdId) => uploadProductImg(file, createdId)}
        brandOptions={brandOptions}
        categoryOptions={categoryOptions}
        onCreateBrand={handleCreateBrand}
        onCreateCategory={handleCreateCategory}
      />

      <VariantDialog
        open={variantDialogOpen}
        variantId={variantSelectedId}
        busy={busy}
        onClose={() => {
          setVariantDialogOpen(false);
          setVariantSelectedId(null);
        }}
        onLoadVariant={loadVariant}
        onSubmit={submitVariant}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
        description="¿Seguro querés eliminar este producto? Esta acción no se puede deshacer."
        busy={busy}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteSelected(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
// src/modules/sales/domain/sales.mapper.js

function toNum(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

export function mapVariants(variants = []) {
  const mapped = variants.map((v) => {
    const id = v.id ?? v.Id ?? v.variantId ?? v.productVariantId;

    const productName =
      v.productName ??
      v.ProductName ??
      v.product?.name ??
      v.product?.Name ??
      v.name ??
      v.Name ??
      "Producto";

    const brand =
      v.brandName ??
      v.BrandName ??
      v.brand?.name ??
      v.brand?.Name ??
      v.brand ??
      "";

    const category =
      v.categoryName ??
      v.CategoryName ??
      v.category?.name ??
      v.category?.Name ??
      v.category ??
      "";

    // ✅ TU DTO (PascalCase)
    const weight = (v.weight ?? v.Weight ?? "").toString().trim(); // "20kg" o "20"
    const size = (v.size ?? v.Size ?? "").toString().trim();       // "18lts" / "4L" / "XL"
    const color = (v.color ?? v.Color ?? "").toString().trim();    // "Negro"

    const variantParts = [];
    if (weight) variantParts.push(weight);
    if (size) variantParts.push(size);
    if (color) variantParts.push(color);

    const variantName = variantParts.join(" · ");

    const salePrice = toNum(v.salePrice ?? v.SalePrice ?? v.price ?? v.Price);

    const stock = toNum(
      v.currentStock ??
        v.CurrentStock ??
        v.stock ??
        v.Stock ??
        v.availableStock ??
        v.AvailableStock
    );

    // Label: Producto · Variante · Marca
    const labelParts = [productName];
    if (variantName) labelParts.push(variantName);
    if (brand) labelParts.push(brand);

    const label = labelParts.join(" · ");

    return {
      id: Number(id),
      label,
      productName,
      variantName,
      brand,
      category,
      salePrice,
      stock,
      raw: v,
    };
  });

  mapped.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  return mapped;
}

export function mapClients(clients = []) {
  return clients.map((c) => ({
    id: Number(c.id ?? c.Id),
    name: c.name ?? c.Name ?? "",
    email: c.email ?? c.Email ?? "",
    phoneNumber: c.phoneNumber ?? c.PhoneNumber ?? "",
    isGuest: !!(c.isGuest ?? c.IsGuest),
  }));
}

// ✅ ESTE EXPORT ES EL QUE TE ESTÁ FALTANDO
export function computeCartTotals(items = []) {
  const subtotal = items.reduce(
    (acc, it) => acc + toNum(it.quantity) * toNum(it.unitPrice),
    0
  );
  return {
    subtotal,
    total: subtotal,
  };
}

export function mapSales(sales = []) {
  return sales.map((s) => {
    const id = Number(s.id ?? s.saleId ?? s.Id);

    const createdAt =
      s.createdAt ?? s.created_at ?? s.date ?? s.createdOn ?? s.CreatedAt ?? null;

    const clientId =
      s.clientId ?? s.client_id ?? s.client?.id ?? s.ClientId ?? null;

    const itemsCount = toNum(
      s.itemsCount ?? s.items_count ?? s.details?.length ?? s.ItemsCount ?? 0
    );

    const total = toNum(
      s.total ?? s.Total ?? s.subtotal ?? s.Subtotal ?? 0
    );

    const clientName =
      s.clientName ?? s.ClientName ?? s.client?.name ?? s.client?.Name ?? null;

    return {
      id,
      createdAt,
      clientId: clientId == null ? null : Number(clientId),
      clientName,
      itemsCount,
      total,
      raw: s,
    };
  });
}

export function saleToCart(sale, variantsIndex = new Map()) {
  const details = sale?.details ?? sale?.Details ?? [];

  return details.map((d) => {
    const variantId = Number(d.productVariantId ?? d.variantId ?? d.ProductVariantId);
    const qty = toNum(d.quantity ?? d.Quantity, 1);

    const v = variantsIndex.get(variantId);

    const unitPrice = toNum(d.unitPrice ?? d.price ?? d.UnitPrice ?? v?.salePrice ?? 0);

    return {
      variantId,
      label: v?.label ?? `Variante #${variantId}`,
      unitPrice,
      quantity: qty,
    };
  });
}
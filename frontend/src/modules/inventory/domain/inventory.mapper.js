const brandPriority = ["Megaflex", "KoverTech", "Recuplast", "Intech"];

function toInt(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;

  // soporta "12", " 12 ", "12.0"
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;

  return Math.trunc(n);
}

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  return n;
}

function buildVariantLabel(v) {
  const weight = v.weight ?? v.Weight;
  const color = v.color ?? v.Color;
  const size = v.size ?? v.Size;

  const parts = [];
  if (weight) parts.push(weight);
  if (color) parts.push(color);
  if (size) parts.push(size);

  return parts.length ? parts.join(" - ") : `Variante #${v.id ?? v.Id}`;
}

function getStockFields(v) {
  const current = v.currentStock ?? v.CurrentStock;
  const min = v.minimumStock ?? v.MinimumStock;

  return {
    currentStock: toInt(current, 0),
    minimumStock: toInt(min, 0),
  };
}

export function mapVariantsToProducts(variants = []) {
  const byProduct = new Map();

  for (const v of variants) {
    const productId = v.productId ?? v.ProductId;
    if (!productId) continue;

    const productName = v.productName ?? v.ProductName ?? "";
    const brandName = v.brandName ?? v.BrandName ?? "";
    const categoryName = v.categoryName ?? v.CategoryName ?? "";

    const productImage = v.imageUrl ?? v.ImageUrl ?? null;

    if (!byProduct.has(productId)) {
      byProduct.set(productId, {
        productId,
        name: productName,
        brand: brandName,
        category: categoryName,
        imageUrl: productImage,
        variants: [],
      });
    }

    const item = byProduct.get(productId);

    const { currentStock, minimumStock } = getStockFields(v);

    item.variants.push({
      id: v.id ?? v.Id,
      label: buildVariantLabel(v),
      salePrice: toNumber(v.salePrice ?? v.SalePrice, 0),
      purchasePrice: toNumber(v.purchasePrice ?? v.PurchasePrice, 0),
      currentStock,
      minimumStock,
      imageUrl: v.imageUrl ?? v.ImageUrl ?? null,
    });

    // si el producto no tenía imagen, tomamos la primera disponible
    if (!item.imageUrl && productImage) item.imageUrl = productImage;
  }

  // orden interno de variantes (por precio venta)
  const products = Array.from(byProduct.values());
  for (const p of products) {
    p.variants.sort((a, b) => a.salePrice - b.salePrice);
  }

  return products;
}

export function getBrandPriorityIndex(brand) {
  const i = brandPriority.findIndex(
    (b) => (brand ?? "").toLowerCase() === b.toLowerCase()
  );
  return i === -1 ? 999 : i;
}
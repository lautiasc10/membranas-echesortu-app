function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

function toDate(x) {
  if (!x) return null;
  let str = String(x);
  // Si no tiene Z ni offset, asumimos que es UTC porque viene del backend (SQLite no lo guarda)
  if (!str.endsWith("Z") && !str.includes("+") && !str.includes("-")) {
    str += "Z";
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function isWithinLastDays(date, days) {
  if (!date) return false;
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - days);
  // Quitamos d <= now para evitar problemas de desfase de segundos/clocks
  return date >= from;
}

function money(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function sum(arr) {
  return arr.reduce((acc, x) => acc + Number(x ?? 0), 0);
}

function getSaleDetails(sale) {
  return pick(sale, "details", "Details") ?? [];
}

function getSaleDate(sale) {
  return pick(sale, "date", "Date");
}

function getSaleTotal(sale) {
  return Number(pick(sale, "total", "Total") ?? 0);
}

function getSaleClientId(sale) {
  return Number(pick(sale, "clientId", "ClientId") ?? 0);
}

function getSaleProfit(sale) {
  const details = getSaleDetails(sale);
  if (!details.length) return 0;
  return sum(details.map((d) => pick(d, "profit", "Profit")));
}

/**
 * IMPORTANTE:
 * - Si CurrentStock viene 0, siempre queremos alerta "Sin stock"
 * - Si MinimumStock no está configurado (0/null), no alertamos por "bajo stock"
 */
function stockStatus(current, min) {
  const c = Number(current ?? 0);
  const m = Number(min ?? 0);

  if (c <= 0) return { level: "danger", label: "Sin stock" };
  if (m <= 0) return { level: "ok", label: "OK" };
  if (c <= m) return { level: "warning", label: "Bajo stock" };
  return { level: "ok", label: "OK" };
}

function getVariantId(v) {
  return pick(v, "id", "Id");
}
function getVariantProductName(v) {
  return pick(v, "productName", "ProductName") ?? "";
}
function getVariantBrandName(v) {
  return pick(v, "brandName", "BrandName") ?? "";
}
function getVariantCategoryName(v) {
  return pick(v, "categoryName", "CategoryName") ?? "";
}
function getVariantCurrentStock(v) {
  return pick(v, "currentStock", "CurrentStock");
}
function getVariantMinimumStock(v) {
  return pick(v, "minimumStock", "MinimumStock");
}
function getVariantImageUrl(v) {
  return pick(v, "imageUrl", "ImageUrl") ?? null;
}
function getVariantColor(v) {
  return pick(v, "color", "Color") ?? null;
}
function getVariantSize(v) {
  return pick(v, "size", "Size") ?? null;
}
function getVariantWeight(v) {
  return pick(v, "weight", "Weight") ?? null;
}

function getVariantLabel(v) {
  const parts = [
    getVariantColor(v) ? `Color: ${getVariantColor(v)}` : null,
    getVariantSize(v) ? `Talle: ${getVariantSize(v)}` : null,
    getVariantWeight(v) ? `Peso: ${getVariantWeight(v)}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

export function mapDashboard({ clients, sales, variants }, days = 30) {
  const salesWithDate = (sales ?? []).map((s) => ({
    ...s,
    _dateObj: toDate(getSaleDate(s)),
  }));

  const periodSales = salesWithDate.filter((s) => isWithinLastDays(s._dateObj, days));

  const periodSalesTotal = sum(periodSales.map(getSaleTotal));
  const periodSalesCount = periodSales.length;
  const periodProfitTotal = sum(periodSales.map(getSaleProfit));

  // Alertas de stock
  const alerts = (variants ?? [])
    .map((v) => {
      const current = getVariantCurrentStock(v) ?? 0;
      const min = getVariantMinimumStock(v) ?? 0;
      const st = stockStatus(current, min);

      return {
        id: getVariantId(v),
        title: getVariantProductName(v),
        variantLabel: getVariantLabel(v),
        subtitle: `${getVariantBrandName(v)} · ${getVariantCategoryName(v)}`,
        current,
        min,
        status: st,
      };
    })
    .filter((x) => x.status.level !== "ok")
    .slice(0, 5); // Aumentamos un poco el límite de alertas visibles

  // Ranking de ventas por variante (periodo)
  const byVariant = new Map(); // id -> { qty, revenue }
  for (const sale of periodSales) {
    const details = getSaleDetails(sale);

    for (const d of details) {
      const variantId = Number(pick(d, "productVariantId", "ProductVariantId") ?? 0);
      const qty = Number(pick(d, "quantity", "Quantity") ?? 0);
      const subtotal = Number(pick(d, "subtotal", "Subtotal") ?? 0);

      const prev = byVariant.get(variantId) || { qty: 0, revenue: 0 };
      byVariant.set(variantId, {
        qty: prev.qty + qty,
        revenue: prev.revenue + subtotal,
      });
    }
  }

  const variantsById = new Map((variants ?? []).map((v) => [Number(getVariantId(v)), v]));

  const ranking = Array.from(byVariant.entries()).map(([variantId, info]) => {
    const v = variantsById.get(Number(variantId));
    return {
      variantId,
      qty: info.qty,
      revenue: info.revenue,
      name: v ? getVariantProductName(v) : `Variante #${variantId}`,
      variantLabel: v ? getVariantLabel(v) : null,
      imageUrl: v ? getVariantImageUrl(v) : null,
    };
  });

  ranking.sort((a, b) => b.qty - a.qty);

  const top = ranking[0] ?? null;
  const low = ranking.length ? ranking[ranking.length - 1] : null;

  // Últimas ventas
  const recentSales = [...salesWithDate]
    .filter((s) => s._dateObj)
    .sort((a, b) => b._dateObj - a._dateObj)
    .slice(0, 6)
    .map((s) => ({
      id: pick(s, "id", "Id"),
      date: s._dateObj,
      clientId: getSaleClientId(s),
      total: getSaleTotal(s),
      status: "Completada",
    }));

  // Mapa de clientes para mostrar nombre en tabla (si existe)
  const clientsWithDate = (clients ?? []).map((c) => ({
    ...c,
    _registrationDate: toDate(pick(c, "registrationDate", "RegistrationDate")),
  }));

  const clientsById = new Map(clientsWithDate.map((c) => [Number(pick(c, "id", "Id")), c]));
  for (const rs of recentSales) {
    const c = clientsById.get(Number(rs.clientId));
    rs.clientName = pick(c, "name", "Name") ?? `Cliente #${rs.clientId}`;
  }

  // Métricas mensuales (Comparativa)
  const monthlyGroups = {}; // "YYYY-MM" -> { label, salesCount, revenue, profit, clientCount }

  // Agrupar Ventas
  for (const s of salesWithDate) {
    if (!s._dateObj) continue;
    const key = `${s._dateObj.getFullYear()}-${String(s._dateObj.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyGroups[key]) {
      monthlyGroups[key] = {
        key,
        label: s._dateObj.toLocaleString("es-AR", { month: "short", year: "2-digit" }),
        salesCount: 0,
        revenue: 0,
        profit: 0,
        clientCount: 0,
      };
    }
    monthlyGroups[key].salesCount += 1;
    monthlyGroups[key].revenue += getSaleTotal(s);
    monthlyGroups[key].profit += getSaleProfit(s);
  }

  // Agrupar Clientes (Registros)
  for (const c of clientsWithDate) {
    if (!c._registrationDate || c.isGuest || c.IsGuest) continue;
    const key = `${c._registrationDate.getFullYear()}-${String(c._registrationDate.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyGroups[key]) {
      monthlyGroups[key] = {
        key,
        label: c._registrationDate.toLocaleString("es-AR", { month: "short", year: "2-digit" }),
        salesCount: 0,
        revenue: 0,
        profit: 0,
        clientCount: 0,
      };
    }
    monthlyGroups[key].clientCount += 1;
  }

  const monthlyStats = Object.values(monthlyGroups).sort((a, b) => a.key.localeCompare(b.key));

  return {
    header: {
      title: "Panel de Control Principal",
      subtitle: "Resumen ejecutivo de métricas de Clientes, Ventas y Stock",
      rangeLabel: `Últimos ${days} días`,
    },
    metrics: [
      {
        key: "clients",
        title: "Clientes registrados",
        value: String(clientsWithDate.filter((c) => !c.isGuest && !c.IsGuest).length),
        deltaLabel: "+",
        color: "emerald",
      },
      {
        key: "sales",
        title: "Ventas del mes",
        value: `${periodSalesCount}`,
        deltaLabel: "",
        color: "blue",
      },
      {
        key: "profit",
        title: "Ganancia estimada",
        value: money(periodProfitTotal),
        deltaLabel: "",
        color: "amber",
      },
    ],
    alerts,
    performance: {
      top,
      low,
      ranking: ranking.slice(0, 4)
    },
    recentSales,
    monthlyStats, // Nueva propiedad
  };
}
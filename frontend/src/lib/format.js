// src/lib/format.js
export const formatCurrency = (n, currency = "ARS") => {
    const value = Number(n ?? 0);
    return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(value);
  };
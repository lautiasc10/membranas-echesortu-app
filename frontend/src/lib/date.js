export const toDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const inLastNDays = (date, days = 30) => {
  const d = toDate(date);
  if (!d) return false;
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - days);
  return d >= from && d <= now;
};

export const formatShortDate = (date) => {
  const d = toDate(date);
  if (!d) return "—";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
};
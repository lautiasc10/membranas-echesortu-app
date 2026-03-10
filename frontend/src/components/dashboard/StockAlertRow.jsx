export default function StockAlertRow({ item }) {
  const critical = item.severity === "critical";

  const base = "flex items-center justify-between p-4 rounded-lg border";
  const cls = critical
    ? "bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/15"
    : "bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/15";

  return (
    <div className={`${base} ${cls}`}>
      <div className="flex flex-col">
        <span className="text-sm font-bold">{item.name}</span>
        <span className="text-xs text-slate-500">SKU: {item.sku}</span>
      </div>

      <div className="text-right">
        <p
          className={`text-xs font-medium ${
            critical ? "text-red-600" : "text-amber-600"
          }`}
        >
          {item.label}
        </p>
        <p className="text-sm font-black">
          <span className={critical ? "text-red-600" : "text-amber-600"}>
            {item.current}
          </span>{" "}
          / {item.min}
        </p>
      </div>
    </div>
  );
}
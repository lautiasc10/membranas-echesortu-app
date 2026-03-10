import { Card, CardContent } from "@/components/ui/card";

export default function MetricCard({
  title,
  value,
  delta,
  deltaType,
  icon: Icon,
  progress
}) {
  const deltaClass =
    deltaType === "down"
      ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
      : "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300";

  return (
    <Card className="border-emerald-500/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-600">
            <Icon className="size-5" />
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-full ${deltaClass}`}
          >
            {delta ?? "—"}
          </span>
        </div>

        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-black mt-1">{value}</p>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full"
            style={{ width: `${progress ?? 0}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
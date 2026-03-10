import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardRepository } from "../data/dashboard.repository";
import { mapDashboard } from "../domain/dashboard.mapper";
import { DashboardView } from "../ui/DashboardView";
import { AnalyticsView } from "../ui/AnalyticsView";

export function DashboardPage() {
  const navigate = useNavigate();
  const [raw, setRaw] = useState({ clients: [], sales: [], variants: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("main"); // "main" | "analytics"

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardRepository.getDashboardRaw();
        if (!alive) return;
        setRaw(data);
      } catch (e) {
        if (!alive) return;
        setError(e?.message ?? "Error cargando dashboard");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => { alive = false; };
  }, []);

  const vm = useMemo(() => mapDashboard(raw, 30), [raw]);

  if (view === "analytics") {
    return <AnalyticsView vm={vm} onBack={() => setView("main")} />;
  }

  return (
    <DashboardView
      loading={loading}
      error={error}
      vm={vm}
      onGoToAnalytics={() => setView("analytics")}
      onExport={() => { }}
      onViewInventory={() => navigate("/admin/inventory")}
      onViewSales={() => navigate("/admin/sales")}
    />
  );
}
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardRepository } from "../data/dashboard.repository";
import { mapDashboard } from "../domain/dashboard.mapper";
import logo from "@/img/logo-membrana.png";

const money = (v) =>
    Number(v || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export function DashboardPrintPage() {
    const navigate = useNavigate();
    const [raw, setRaw] = useState({ clients: [], sales: [], variants: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const query = new URLSearchParams(window.location.search);
    const monthParam = query.get("month");

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await dashboardRepository.getDashboardRaw();
                setRaw(data);
            } catch (e) {
                setError("No se pudo cargar la información para el reporte.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const vm = useMemo(() => mapDashboard(raw, monthParam), [raw, monthParam]);

    useEffect(() => {
        if (!loading && !error && vm.metrics.length > 0) {
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [loading, error, vm]);

    if (loading) return <div className="p-10 font-sans text-xl italic text-gray-500">Generando reporte ejecutivo...</div>;
    if (error) return <div className="p-10 font-sans text-xl text-red-600">{error}</div>;

    return (
        <div className="bg-white text-black min-h-screen font-sans p-0 sm:p-8 print:p-0">
            {/* Botones de control (ocultos al imprimir) */}
            <div className="print:hidden mb-8 flex gap-4 max-w-[210mm] mx-auto">
                <button
                    onClick={() => window.print()}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-orange-700 transition-colors"
                >
                    Imprimir / Guardar PDF
                </button>
                <button
                    onClick={() => navigate("/admin")}
                    className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                    Volver al Panel
                </button>
            </div>

            <div className="max-w-[210mm] mx-auto bg-white p-10 border border-gray-100 shadow-sm print:shadow-none print:border-none">

                {/* Cabecera del Reporte */}
                <div className="flex justify-between items-start border-b-2 border-orange-500 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter text-gray-900">MEMBRANAS <span className="text-orange-500">ECHESORTU</span></h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Reporte Ejecutivo de Gestión</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-400">FECHA DE EMISIÓN</p>
                        <p className="text-sm font-black text-gray-800">{formatDate(new Date())}</p>
                        <p className="text-[10px] text-orange-600 font-bold mt-1 uppercase">Periodo: {vm.header.rangeLabel}</p>
                    </div>
                </div>

                {/* Resumen de Métricas Clave */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                    {vm.metrics.map(m => (
                        <div key={m.key} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 italic">
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">{m.title}</p>
                            <p className="text-2xl font-black text-gray-900 tracking-tight">{m.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-10">
                    {/* Columna Izquierda: Alertas y Ranking */}
                    <div className="space-y-10">
                        {/* Alertas Críticas */}
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] border-l-4 border-red-500 pl-3 mb-4 text-gray-800">Alertas de Stock</h2>
                            <div className="space-y-3">
                                {vm.alerts.length > 0 ? vm.alerts.map(a => (
                                    <div key={a.id} className="border-b border-gray-100 pb-2">
                                        <p className="text-xs font-bold text-gray-900">{a.title}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[10px] text-gray-500 uppercase font-medium">{a.variantLabel || "Estándar"}</span>
                                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${a.status.level === 'danger' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                STOCK: {a.current}
                                            </span>
                                        </div>
                                    </div>
                                )) : <p className="text-xs text-gray-400 italic">No hay alertas críticas en este periodo.</p>}
                            </div>
                        </div>

                        {/* Top Ventas */}
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] border-l-4 border-blue-500 pl-3 mb-4 text-gray-800">Productos Destacados</h2>
                            <div className="space-y-4">
                                {vm.performance.ranking.map((item, idx) => (
                                    <div key={item.variantId} className="flex items-center gap-3">
                                        <span className="text-lg font-black text-gray-200 leading-none">0{idx + 1}</span>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-900 leading-tight">{item.name}</p>
                                            <p className="text-[10px] text-gray-500">{item.variantLabel || "Versión Única"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900">{item.qty} u.</p>
                                            <p className="text-[9px] font-bold text-blue-600">{money(item.revenue)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Ventas Recientes */}
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] border-l-4 border-orange-500 pl-3 mb-4 text-gray-800">Últimos Movimientos</h2>
                        <div className="space-y-3">
                            {vm.recentSales.map(s => (
                                <div key={s.id} className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-xs font-bold text-gray-900">{s.clientName}</p>
                                        <span className="text-[10px] font-black tabular-nums">{money(s.total)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">OP #{String(s.id).padStart(3, '0')}</p>
                                        <p className="text-[9px] text-gray-400">{formatDate(s.date).split(',')[0]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer del PDF */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-end">
                    <div>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-relaxed">
                            Sistema de Gestión Integral<br />
                            Membranas Echesortu v1.0
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="h-12 w-32 border-b border-gray-200 mb-2 mx-auto"></div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Firma Responsable</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

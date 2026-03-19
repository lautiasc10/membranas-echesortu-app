import { useState, useEffect } from "react";
import { LandingHeader } from "../../landing/ui/LandingHeader";
import { LandingFooter } from "../../landing/ui/LandingFooter";
import { galleryRepository } from "../data/gallery.repository";
import { baseUrl } from "../../../services/apiClient";
import { LayoutList } from "lucide-react";

export function GalleryPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        galleryRepository.listPaged({ page: 1, pageSize: 50, onlyVisible: true })
            .then(res => {
                // Ordenar por OrderIndex
                const sorted = (res.data || []).sort((a, b) => a.orderIndex - b.orderIndex);
                setProjects(sorted);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${baseUrl}${url}`;
    };

    return (
        <div className="font-[Manrope] text-gray-900 bg-white min-h-screen flex flex-col">
            <LandingHeader />

            {/* ─── Hero ─── */}
            <section className="pt-28 pb-10 px-6 md:px-10 max-w-[1400px] mx-auto w-full">
                <p className="text-orange-500 uppercase font-bold tracking-wider text-sm mb-3">Nuestros Trabajos</p>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Galería de Proyectos</h1>
                <p className="text-gray-500 text-base max-w-2xl">
                    Explora nuestra trayectoria en soluciones de impermeabilización. Calidad garantizada en cada obra residencial e industrial.
                </p>
            </section>

            {/* ─── Category Tabs (Removed because backend has no Category yet) ─── */}
            <section className="px-6 md:px-10 max-w-[1400px] mx-auto w-full mb-10">
                <div className="flex gap-1 border-b border-gray-200">
                    <button className="px-5 py-3 text-sm font-semibold transition-all relative text-orange-500">
                        Todos los Proyectos
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500 rounded-t-full" />
                    </button>
                </div>
            </section>

            {/* ─── Projects Grid ─── */}
            <section className="px-6 md:px-10 max-w-[1400px] mx-auto w-full flex-1 mb-16">
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-5xl mb-4">📸</div>
                        <p className="text-gray-400 text-lg">Próximamente estaremos publicando nuestras obras.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {projects.map((project) => {
                            const before = getImageUrl(project.beforeImageUrl);
                            const after = getImageUrl(project.afterImageUrl);
                            // If it only has one image, we can adapt the layout
                            const hasBoth = before && after;
                            const hasAny = before || after;

                            return (
                                <div
                                    key={project.id}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
                                >
                                    {/* Before / After Images */}
                                    <div className={`grid ${hasBoth ? "grid-cols-2" : "grid-cols-1"} h-56 md:h-72 bg-slate-100`}>
                                        {before && (
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={before}
                                                    alt={`${project.title} — Antes`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {hasBoth && <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-lg">Antes</span>}
                                            </div>
                                        )}
                                        {after && (
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={after}
                                                    alt={`${project.title} — Después`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {hasBoth && <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-lg">Después</span>}
                                            </div>
                                        )}
                                        {!hasAny && (
                                            <div className="flex w-full h-full items-center justify-center text-slate-300">
                                                <LayoutList className="size-10" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Info */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-bold">{project.title}</h3>
                                            {project.workDate && (
                                                <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">
                                                    {new Date(project.workDate).getFullYear()}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-5 leading-relaxed flex-1 whitespace-pre-wrap">{project.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            <LandingFooter />
        </div>
    );
}

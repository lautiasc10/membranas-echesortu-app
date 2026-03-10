import { useState } from "react";
import { LandingHeader } from "../../landing/ui/LandingHeader";
import { LandingFooter } from "../../landing/ui/LandingFooter";

import terrazaAntes from "../../../img/gallery-terraza-antes.png";
import terrazaDespues from "../../../img/gallery-terraza-despues.png";
import naveAntes from "../../../img/gallery-nave-antes.png";
import naveDespues from "../../../img/gallery-nave-despues.png";
import residenciaAntes from "../../../img/gallery-residencia-antes.png";
import residenciaDespues from "../../../img/gallery-residencia-despues.png";
import comercialAntes from "../../../img/gallery-comercial-antes.png";
import comercialDespues from "../../../img/gallery-comercial-despues.png";

const PROJECTS = [
    {
        id: 1,
        title: "Terraza Central Echesortu",
        category: "Residencial",
        description: "Tratamiento integral de filtraciones críticas con remoción de material suelto y aplicación de triple capa de membrana líquida reforzada.",
        before: terrazaAntes,
        after: terrazaDespues,
    },
    {
        id: 2,
        title: "Nave Industrial San Lorenzo",
        category: "Industrial",
        description: "Recubrimiento de alta reflectancia térmica en 2500m² de cubiertas metálicas para reducción de temperatura y sellado de tornillería.",
        before: naveAntes,
        after: naveDespues,
    },
    {
        id: 3,
        title: "Residencia Fisherton",
        category: "Residencial",
        description: "Tratamiento antihumedad de cimientos y muros exteriores con terminación de pintura elástica de alta densidad.",
        before: residenciaAntes,
        after: residenciaDespues,
    },
    {
        id: 4,
        title: "Centro Comercial Funes",
        category: "Industrial",
        description: "Impermeabilización de grandes superficies con membrana asfáltica soldada y terminación de aluminio reflectivo.",
        before: comercialAntes,
        after: comercialDespues,
    },
];

const TABS = ["Todos los Proyectos", "Residencial", "Industrial"];

export function GalleryPage() {
    const [activeTab, setActiveTab] = useState("Todos los Proyectos");

    const filtered = activeTab === "Todos los Proyectos"
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === activeTab);

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

            {/* ─── Category Tabs ─── */}
            <section className="px-6 md:px-10 max-w-[1400px] mx-auto w-full mb-10">
                <div className="flex gap-1 border-b border-gray-200">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 text-sm font-semibold transition-all relative ${activeTab === tab
                                ? "text-orange-500"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* ─── Projects Grid ─── */}
            <section className="px-6 md:px-10 max-w-[1400px] mx-auto w-full flex-1 mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filtered.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Before / After Images */}
                            <div className="grid grid-cols-2 h-56 md:h-72">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={project.before}
                                        alt={`${project.title} — Antes`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-lg">
                                        Antes
                                    </span>
                                </div>
                                <div className="relative overflow-hidden">
                                    <img
                                        src={project.after}
                                        alt={`${project.title} — Después`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-lg">
                                        Después
                                    </span>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold">{project.title}</h3>
                                    <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">
                                        {project.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-5 leading-relaxed">{project.description}</p>
                                <button className="text-sm font-bold text-orange-500 border-2 border-orange-500 rounded-xl px-5 py-2.5 hover:bg-orange-500 hover:text-white transition-all duration-200 flex items-center gap-2">
                                    Ver Detalles del Proyecto
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}

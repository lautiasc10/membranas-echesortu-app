import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LandingHeader } from "../ui/LandingHeader";
import { LandingFooter } from "../ui/LandingFooter";
import { getTopSellingProducts } from "../../../services/products.api";
import { baseUrl } from "../../../services/apiClient";
import logoMembrana from "../../../img/logo-membrana.png";
import logoMegaflex from "../../../img/logo-megaflex.png";
import logoKartonsec from "../../../img/logo-kartonsec.png";
import heroImg from "../../../img/hero-impermeabilizacion.png";
import { useCart } from "../../../shared/context/CartContext";

export function LandingPage() {
    const { toggleCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTopSellingProducts(6)
            .then(setProducts)
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const getImageUrl = (product) => {
        if (!product.imageUrl) return null;
        if (product.imageUrl.startsWith("http")) return product.imageUrl;
        return `${baseUrl}${product.imageUrl}`;
    };

    return (
        <div className="font-[Manrope] text-gray-900 bg-white overflow-x-hidden">
            <LandingHeader />

            {/* ─── Hero Section ─── */}
            <section className="pt-40 pb-24 px-6 md:px-10 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center" id="inicio">
                <div>
                    <div className="text-orange-500 uppercase font-bold tracking-wider text-sm mb-3">
                        Empresa de Impermeabilización
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] mb-6 break-words">
                        Soluciones Profesionales de{" "}
                        <span className="text-orange-500">Impermeabilización</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
                        Protegemos sus estructuras de la humedad con calidad y confianza en Rosario.
                        Brindamos tranquilidad y durabilidad para su hogar o empresa.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            to="/catalogo"
                            className="px-7 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
                        >
                            Ver Productos
                        </Link>
                    </div>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img
                        src={heroImg}
                        alt="Impermeabilización en Rosario"
                        className="w-full block object-cover"
                    />
                </div>
            </section>

            {/* ─── Trust Marks / Logos ─── */}
            <div className="py-16 border-y border-gray-100 bg-gray-50/50">
                <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-wrap justify-center items-center gap-16 md:gap-28">
                    <img src={logoMegaflex} className="h-16 md:h-20" alt="Megaflex" />
                    <img src={logoKartonsec} className="h-16 md:h-20" alt="Kartonsec" />
                </div>
            </div>

            {/* ─── Products Section ─── */}
            <section className="py-24 px-6 md:px-10 max-w-[1400px] mx-auto" id="productos">
                <h2 className="text-4xl font-extrabold text-center mb-16">
                    Productos Más Vendidos
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-center text-gray-400 py-20">No hay productos disponibles.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-gray-50 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 group"
                            >
                                <div className="h-48 bg-white rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                                    {getImageUrl(product) ? (
                                        <img
                                            src={getImageUrl(product)}
                                            alt={product.name}
                                            className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <span className="text-orange-400 text-3xl">📦</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    {product.brandName && (
                                        <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                            {product.brandName}
                                        </span>
                                    )}
                                    {product.categoryName && (
                                        <span className="text-xs font-medium text-gray-400">
                                            {product.categoryName}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                                    {product.description || "Producto de alta calidad para impermeabilización profesional."}
                                </p>
                                <button className="text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors">
                                    Ver detalles →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ─── Ofertas Section ─── */}
            <section className="py-24 px-6 md:px-10 bg-gradient-to-br from-orange-500 to-orange-600" id="ofertas">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="text-white">
                        <div className="uppercase font-bold tracking-wider text-sm mb-3 text-orange-200">
                            Ofertas Exclusivas
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            Aprovechá nuestras promociones de temporada
                        </h2>
                        <p className="text-orange-100 text-lg leading-relaxed mb-10">
                            Descuentos especiales en membranas, impermeabilizantes y geotextiles.
                            Consultanos por nuestros combos de colocación con material incluido.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/ofertas"
                                className="px-7 py-3 bg-white text-orange-600 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors text-center"
                            >
                                Ver Ofertas
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 space-y-6">
                            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🏷️</div>
                                <div>
                                    <div className="font-bold text-white">Membranas Asfálticas</div>
                                    <div className="text-orange-200 text-sm">Hasta 20% OFF en rollos de 10m²</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🔥</div>
                                <div>
                                    <div className="font-bold text-white">Combo Impermeabilización</div>
                                    <div className="text-orange-200 text-sm">Material + colocación con garantía</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">⭐</div>
                                <div>
                                    <div className="font-bold text-white">Geotextiles por Mayor</div>
                                    <div className="text-orange-200 text-sm">Precios especiales a partir de 5 unidades</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}

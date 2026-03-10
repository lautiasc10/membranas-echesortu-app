import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { LandingHeader } from "../../landing/ui/LandingHeader";
import { LandingFooter } from "../../landing/ui/LandingFooter";
import { getAllProducts } from "../../../services/products.api";
import { getVariantsByProduct } from "../../../services/variants.api";
import { brandsApi } from "../../../services/brands.api";
import { categoriesApi } from "../../../services/categories.api";
import { baseUrl } from "../../../services/apiClient";
import { useAuth } from "../../../shared/context/AuthContext";
import { useCart } from "../../../shared/context/CartContext";
import { toast } from "sonner";

export function OffersPage() {
    const { user, logout } = useAuth();
    const { toggleCart } = useCart();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllProducts(), brandsApi.getAll()])
            .then(([prods, brnds]) => {
                setProducts(prods);
                setBrands(brnds);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Simulate offers: pick first 8 products and assign random discounts
    const offers = useMemo(() => {
        const discounts = [10, 15, 20, 25, 30];
        return products.slice(0, 8).map((p, i) => ({
            ...p,
            discount: discounts[i % discounts.length],
        }));
    }, [products]);

    return (
        <div className="font-[Manrope] text-gray-900 bg-white min-h-screen flex flex-col">
            <LandingHeader />

            {/* ─── Hero ─── */}
            <section className="pt-28 pb-10 px-6 md:px-10 max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p className="text-orange-500 uppercase font-bold tracking-wider text-sm mb-3">🔥 Ofertas Exclusivas</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Ofertas del Mes</h1>
                        <p className="text-gray-500 text-base">
                            Precios especiales en productos seleccionados. Disponible solo para clientes registrados.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            ✓
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-bold">Sesión activa</p>
                            <p className="text-xs text-green-500">{user?.email || user?.name || "Cliente"}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Offers Grid ─── */}
            <section className="px-6 md:px-10 max-w-[1400px] mx-auto w-full flex-1 mb-16">
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-400 text-lg">No hay ofertas disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {offers.map((product) => (
                            <OfferCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* ─── CTA ─── */}
            <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-6 md:px-10">
                <div className="max-w-[1400px] mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-3">¿Necesitás un presupuesto personalizado?</h2>
                    <p className="text-orange-100 mb-6 max-w-xl mx-auto">
                        Contactanos y te armamos una oferta a medida para tu proyecto de impermeabilización.
                    </p>
                    <button
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            toggleCart();
                        }}
                        className="inline-block bg-white text-orange-500 font-bold text-sm px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
                    >
                        Solicitar Presupuesto
                    </button>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}

function OfferCard({ product }) {
    const { addToCart } = useCart();
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loadingV, setLoadingV] = useState(true);

    useEffect(() => {
        getVariantsByProduct(product.id)
            .then((v) => {
                setVariants(v);
                if (v.length > 0) setSelectedVariant(v[0]);
            })
            .catch(() => { })
            .finally(() => setLoadingV(false));
    }, [product.id]);

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${baseUrl}${url}`;
    };

    const displayImage = selectedVariant?.imageUrl
        ? getImageUrl(selectedVariant.imageUrl)
        : getImageUrl(product.imageUrl);

    const price = selectedVariant?.salePrice || 0;
    const discountedPrice = Math.round(price * (1 - product.discount / 100));

    const variantLabel = (v) => {
        const parts = [];
        if (v.weight) parts.push(v.weight);
        if (v.size) parts.push(v.size);
        if (v.color) parts.push(v.color);
        return parts.length > 0 ? parts.join(" — ") : `Variante ${v.id}`;
    };

    const handleAdd = () => {
        addToCart(product, selectedVariant, true);
        toast.success("Oferta agregada a la cotización");
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative">
            {/* Discount badge */}
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full z-10 shadow-lg shadow-red-500/30">
                -{product.discount}%
            </div>

            <div className="h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={product.name}
                        className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                        <span className="text-orange-400 text-2xl">📦</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                {product.brandName && !["sin marca", "otros"].includes(product.brandName.toLowerCase()) && (
                    <span className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-1">
                        {product.brandName}
                    </span>
                )}
                <h3 className="text-sm font-bold mb-2 leading-snug line-clamp-2">{product.name}</h3>

                {/* Variant selector */}
                {!loadingV && variants.length > 1 && (
                    <select
                        value={selectedVariant?.id || ""}
                        onChange={(e) => {
                            const v = variants.find((v) => v.id === Number(e.target.value));
                            setSelectedVariant(v);
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/30 mb-3 cursor-pointer"
                    >
                        {variants.map((v) => (
                            <option key={v.id} value={v.id}>{variantLabel(v)}</option>
                        ))}
                    </select>
                )}

                {/* Prices */}
                {!loadingV && price > 0 && (
                    <div className="mb-3 mt-auto">
                        <span className="text-gray-400 text-sm line-through mr-2">
                            ${price.toLocaleString("es-AR")}
                        </span>
                        <span className="text-xl font-extrabold text-green-600">
                            ${discountedPrice.toLocaleString("es-AR")}
                        </span>
                    </div>
                )}

                <button
                    onClick={handleAdd}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    Añadir a la consulta
                </button>
            </div>
        </div>
    );
}

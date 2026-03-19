import { useState, useEffect, useMemo } from "react";
import { LandingHeader } from "../../landing/ui/LandingHeader";
import { LandingFooter } from "../../landing/ui/LandingFooter";
import { getAllProducts } from "../../../services/products.api";
import { getVariantsByProduct } from "../../../services/variants.api";
import { brandsApi } from "../../../services/brands.api";
import { categoriesApi } from "../../../services/categories.api";
import { baseUrl } from "../../../services/apiClient";
import { useCart } from "../../../shared/context/CartContext";
import { toast } from "sonner";

const PRODUCTS_PER_PAGE = 6;

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loadingVariants, setLoadingVariants] = useState(true);

    useEffect(() => {
        getVariantsByProduct(product.id)
            .then((v) => {
                setVariants(v);
                if (v.length > 0) setSelectedVariant(v[0]);
            })
            .catch(() => { })
            .finally(() => setLoadingVariants(false));
    }, [product.id]);

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${baseUrl}${url}`;
    };

    const displayImage = selectedVariant?.imageUrl
        ? getImageUrl(selectedVariant.imageUrl)
        : getImageUrl(product.imageUrl);

    const variantLabel = (v) => {
        const parts = [];
        if (v.weight) parts.push(v.weight);
        if (v.size) parts.push(v.size);
        if (v.color) parts.push(v.color);
        return parts.length > 0 ? parts.join(" — ") : `Variante ${v.id}`;
    };

    const price = selectedVariant?.salePrice;

    const handleAdd = () => {
        addToCart(product, selectedVariant);
        toast.success("Producto agregado a la cotización");
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="h-56 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={product.name}
                        className="h-full w-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center">
                        <span className="text-orange-400 text-3xl">📦</span>
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    {product.brandName && !["sin marca", "otros"].includes(product.brandName.toLowerCase()) && (
                        <span className="text-[11px] font-bold uppercase text-orange-500 tracking-wider">
                            {product.brandName}
                        </span>
                    )}
                    {product.categoryName && product.categoryName.toLowerCase() !== "otros" && (
                        <span className="text-[11px] text-gray-400">
                            {product.brandName && !["sin marca", "otros"].includes(product.brandName.toLowerCase()) ? "· " : ""}{product.categoryName}
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold mb-2 leading-snug">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                    {product.description || "Producto de alta calidad para impermeabilización profesional."}
                </p>

                {/* Variant selector */}
                {!loadingVariants && variants.length > 1 && (
                    <div className="mb-4">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Variante</label>
                        <select
                            value={selectedVariant?.id || ""}
                            onChange={(e) => {
                                const v = variants.find((v) => v.id === Number(e.target.value));
                                setSelectedVariant(v);
                            }}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all cursor-pointer"
                        >
                            {variants.map((v) => (
                                <option key={v.id} value={v.id}>{variantLabel(v)}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Price */}
                {!loadingVariants && price != null && (
                    <div className="mb-4">
                        <span className="text-2xl font-extrabold text-gray-900">
                            ${price.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">/unidad</span>
                    </div>
                )}

                <button
                    onClick={handleAdd}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-auto cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    Añadir a la consulta
                </button>
            </div>
        </div>
    );
}

export function CatalogPage() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("name-asc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        Promise.all([getAllProducts(), brandsApi.getAll(), categoriesApi.getAll()])
            .then(([prods, brnds, cats]) => {
                setProducts(prods);
                // Filter out "Sin Marca" and "Otros" from brand dropdown
                const hiddenBrands = ["sin marca", "otros"];
                setBrands(brnds.filter((b) => !hiddenBrands.includes(b.name?.toLowerCase())));
                setCategories(cats);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        let result = [...products];

        if (selectedBrand) {
            result = result.filter((p) => p.brandId === Number(selectedBrand));
        }
        if (selectedCategory) {
            result = result.filter((p) => p.categoryId === Number(selectedCategory));
        }

        switch (sortBy) {
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        return result;
    }, [products, selectedBrand, selectedCategory, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
    const paginated = filtered.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedBrand, selectedCategory, sortBy]);

    const clearFilters = () => {
        setSelectedBrand("");
        setSelectedCategory("");
        setSortBy("name-asc");
    };

    return (
        <div className="font-[Manrope] text-gray-900 bg-white min-h-screen flex flex-col">
            <LandingHeader />

            {/* ─── Hero ─── */}
            <section className="pt-28 pb-10 px-6 md:px-10 max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Nuestros Productos</h1>
                        <p className="text-gray-500 text-base">
                            Soluciones profesionales para impermeabilización y construcción.
                        </p>
                    </div>
                    <div className="text-sm text-gray-400">
                        Catálogo &gt; <span className="text-gray-600 font-medium">Todos los productos</span>
                    </div>
                </div>
            </section>

            {/* ─── Filters ─── */}
            <section className="px-6 md:px-10 max-w-[1400px] mx-auto w-full mb-8">
                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2">Marca</label>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Todas las marcas</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2">Categoría</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2">Ordenar por</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="name-asc">Nombre: A → Z</option>
                                <option value="name-desc">Nombre: Z → A</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full md:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors px-4 py-2.5 rounded-xl"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M7 12h10" /><path d="M10 18h4" /></svg>
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Product Grid ─── */}
            <section className="px-6 md:px-10 max-w-[1400px] mx-auto w-full flex-1 mb-12">
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-gray-400 text-lg">No se encontraron productos con los filtros seleccionados.</p>
                        <button onClick={clearFilters} className="mt-4 text-orange-500 font-semibold hover:underline">
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginated.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                        >
                            ‹
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${currentPage === page
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                                    : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                        >
                            ›
                        </button>
                    </div>
                )}
            </section>

            <LandingFooter />
        </div>
    );
}

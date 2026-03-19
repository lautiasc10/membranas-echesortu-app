import { useState, useEffect } from "react";
import { useCart } from "../../../shared/context/CartContext";
import { getVariantsByProduct } from "../../../services/variants.api";
import { baseUrl } from "../../../services/apiClient";
import { toast } from "sonner";
import { Image as ImageIcon, MessageCircle } from "lucide-react";

export function OfferCard({ offer }) {
    const { addToCart, toggleCart } = useCart();
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loadingV, setLoadingV] = useState(true);

    const isProduct = offer.type === 1;
    const isCustom = offer.type === 2;
    const product = offer.product;

    useEffect(() => {
        if (isProduct && product?.id) {
            if (offer.productVariant) {
                setVariants([offer.productVariant]);
                setSelectedVariant(offer.productVariant);
                setLoadingV(false);
            } else {
                getVariantsByProduct(product.id)
                    .then((v) => {
                        setVariants(v);
                        if (v.length > 0) setSelectedVariant(v[0]);
                    })
                    .catch(() => { })
                    .finally(() => setLoadingV(false));
            }
        } else {
            setLoadingV(false);
        }
    }, [isProduct, product, offer.productVariant]);

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${baseUrl}${url}`;
    };

    let displayImage = null;
    if (isCustom) {
        displayImage = getImageUrl(offer.customImageUrl);
    } else if (isProduct) {
        displayImage = selectedVariant?.imageUrl
            ? getImageUrl(selectedVariant.imageUrl)
            : getImageUrl(product?.imageUrl);
    }

    let price = selectedVariant?.salePrice || 0;
    let finalPrice = price;
    if (isProduct && price > 0) {
        if (offer.discountPercentage) {
            finalPrice = Math.round(price * (1 - offer.discountPercentage / 100));
        } else if (offer.promoPrice) {
            finalPrice = offer.promoPrice;
        }
    }

    const variantLabel = (v) => {
        const parts = [];
        if (v.weight) parts.push(v.weight);
        if (v.size) parts.push(v.size);
        if (v.color) parts.push(v.color);
        return parts.length > 0 ? parts.join(" — ") : `Variante ${v.id}`;
    };

    const handleAdd = () => {
        if (!isProduct || !product) return;
        let cartProduct = { ...product };
        if (offer.discountPercentage) cartProduct.discount = offer.discountPercentage;
        else if (offer.promoPrice && price > 0) {
            cartProduct.discount = Math.round((1 - offer.promoPrice / price) * 100);
        }
        addToCart(cartProduct, selectedVariant, true);
        toast.success("Producto en oferta agregado a la consulta");
    };

    if (isCustom) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative min-h-[380px]">
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-lg z-10">
                    Novedad
                </div>
                <div className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {displayImage ? (
                        <img src={displayImage} alt={offer.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="text-slate-300"><ImageIcon className="size-10" /></div>
                    )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-black mb-2 leading-snug">{offer.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 whitespace-pre-wrap flex-1">{offer.description}</p>
                    <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); toggleCart(); }} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center mt-auto">
                        Quiero saber más
                    </button>
                </div>
            </div>
        );
    }

    if (isProduct && product) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative min-h-[380px]">
                {offer.discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full z-10 shadow-lg shadow-red-500/30">-{offer.discountPercentage}%</div>
                )}
                {offer.promoPrice > 0 && !offer.discountPercentage && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full z-10 shadow-lg shadow-red-500/30">OFERTA</div>
                )}
                <div className="h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {displayImage ? (
                        <img src={displayImage} alt={product.name} className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center"><span className="text-orange-400 text-2xl">📦</span></div>
                    )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-1">{offer.title}</span>
                    <h3 className="text-sm font-bold mb-2 leading-snug line-clamp-2">{product.name}</h3>
                    {offer.description && offer.description !== offer.title && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{offer.description}</p>}
                    {!loadingV && variants.length > 1 && (
                        <select
                            value={selectedVariant?.id || ""}
                            onChange={(e) => setSelectedVariant(variants.find((v) => v.id === Number(e.target.value)))}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/30 mb-3 cursor-pointer"
                        >
                            {variants.map((v) => (<option key={v.id} value={v.id}>{variantLabel(v)}</option>))}
                        </select>
                    )}
                    {!loadingV && price > 0 && (
                        <div className="mb-3 mt-auto">
                            <span className="text-gray-400 text-sm line-through mr-2">${price.toLocaleString("es-AR")}</span>
                            <span className="text-xl font-extrabold text-green-600">${finalPrice.toLocaleString("es-AR")}</span>
                        </div>
                    )}
                    <button onClick={handleAdd} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-auto cursor-pointer">
                        <MessageCircle className="size-3.5" /> Añadir a la consulta
                    </button>
                </div>
            </div>
        );
    }
    return null;
}

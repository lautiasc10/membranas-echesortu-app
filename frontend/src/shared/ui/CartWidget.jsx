import { ShoppingBag } from "lucide-react";
import { useCart } from "../../shared/context/CartContext";

export function CartWidget() {
    const { cartCount, toggleCart, isCartOpen } = useCart();

    // Si el carrito ya está abierto visualmente a la derecha, podemos ocultar la burbuja (opcional)
    if (isCartOpen) return null;

    // Solo mostramos el widget si hay productos
    if (cartCount === 0) return null;

    return (
        <button
            onClick={toggleCart}
            className="fixed bottom-6 right-6 z-40 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-2xl shadow-orange-500/40 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center group"
            aria-label="Ver consulta"
        >
            <div className="relative">
                <ShoppingBag className="size-6" />
                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-orange-500 group-hover:border-orange-600">
                    {cartCount > 9 ? "9+" : cartCount}
                </span>
            </div>
        </button>
    );
}

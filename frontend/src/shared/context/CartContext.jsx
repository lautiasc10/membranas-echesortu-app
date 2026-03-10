import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem("cart_items");
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("cart_items", JSON.stringify(items));
    }, [items]);

    // Escuchar evento global de logout para vaciar carrito
    useEffect(() => {
        const handleClearCart = () => setItems([]);
        window.addEventListener("cart:clear", handleClearCart);
        return () => window.removeEventListener("cart:clear", handleClearCart);
    }, []);

    const addToCart = (product, variantOption = null, isOffer = false) => {
        setItems(prev => {
            // Verificar si el producto (y su variante específica) y su estado de oferta ya está en el carrito
            const existingIndex = prev.findIndex(item =>
                item.product.id === product.id &&
                item.variant?.id === variantOption?.id &&
                item.isOffer === isOffer
            );

            if (existingIndex >= 0) {
                // Si existe, aumentar cantidad
                const newItems = [...prev];
                newItems[existingIndex].quantity += 1;
                return newItems;
            } else {
                // Si no, agregarlo nuevo
                return [...prev, { product, variant: variantOption, quantity: 1, id: Date.now(), isOffer }];
            }
        });

        // Abrir el carrito automáticamente al añadir un item
        setIsCartOpen(true);
    };

    const removeFromCart = (itemId) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            toggleCart,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

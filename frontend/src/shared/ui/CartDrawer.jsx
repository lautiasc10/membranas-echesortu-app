import { useState, useEffect } from "react";
import { useCart } from "../../shared/context/CartContext";
import { useAuth } from "../../shared/context/AuthContext";
import { X, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CartDrawer() {
    const { items, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [customerName, setCustomerName] = useState("");

    // Si el usuario está logueado, usar su nombre
    useEffect(() => {
        if (isAuthenticated && user?.name) {
            setCustomerName(user.name);
        } else {
            setCustomerName("");
        }
    }, [isAuthenticated, user]);

    // Ocultar si está cerrado
    if (!isCartOpen) return null;

    const currency = (n) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(n ?? 0);

    const total = items.reduce((acc, item) => acc + (item.quantity * (item.variant?.salePrice || item.product.salePrice || 0)), 0);

    const handleWhatsApp = () => {
        if (!customerName.trim()) {
            alert("Por favor, ingresá tu nombre para enviar la consulta.");
            return;
        }

        const phone = "5493413761473"; // Número de Lauti para pruebas
        let text = `¡Hola! Soy *${customerName.trim()}*.\nQuería consultar por los siguientes productos:\n\n`;

        items.forEach((item, index) => {
            const variantText = item.variant
                ? ` [${[item.variant.weight, item.variant.size, item.variant.color].filter(Boolean).join(" - ")}]`
                : "";

            const promoText = item.isOffer ? " 🎁 *(Promoción)*" : "";
            text += `${index + 1}. *${item.quantity}x* ${item.product.name}${variantText}${promoText}\n`;
        });

        text += `\nAguardo sus comentarios. ¡Gracias!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');

        // Opcional: limpiar carrito luego de enviar
        // clearCart();
    };

    return (
        <>
            {/* Overlay oscuro para cerrar al hacer clic afuera */}
            <div
                className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
                onClick={toggleCart}
            />

            {/* Panel lateral derecho */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col transform transition-transform duration-300">

                {/* Cabecera */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-orange-500 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        📋 Consulta Expresa
                    </h2>
                    <button onClick={toggleCart} className="p-2 hover:bg-orange-600 rounded-full transition-colors">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 text-center">
                            <span className="text-5xl">🛒</span>
                            <p className="text-lg font-medium">No hay productos en tu consulta.</p>
                            <p className="text-sm px-4">Recorré el catálogo y añadí productos para cotizar rápidamente por WhatsApp.</p>
                            <Button variant="outline" onClick={toggleCart} className="mt-4">
                                Volver al catálogo
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => {
                            const price = item.variant?.salePrice || item.product.salePrice || 0;
                            return (
                                <div key={item.id} className="flex gap-4 p-4 border rounded-xl bg-gray-50/50">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 leading-tight mb-1">
                                            {item.product.name}
                                            {item.isOffer && (
                                                <span className="ml-2 inline-block bg-orange-100 text-orange-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md align-middle">
                                                    🎁 OFERTA
                                                </span>
                                            )}
                                        </h4>
                                        {item.variant && (
                                            <p className="text-xs text-orange-600 font-semibold mb-2">
                                                {[item.variant.weight, item.variant.size, item.variant.color].filter(Boolean).join(" • ")}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border rounded-lg bg-white overflow-hidden shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                            <div className="font-bold text-gray-900 border-l pl-3">
                                                {currency(price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors self-start p-1"
                                    >
                                        <Trash2 className="size-5" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Resumen y envío */}
                {items.length > 0 && (
                    <div className="p-6 border-t bg-gray-50 flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 font-medium">Subtotal referencial:</span>
                            <span className="text-xl font-bold text-gray-900">{currency(total)}</span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                Tu Nombre o Empresa <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Ej: Juan Pérez"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="bg-white border-gray-300 focus-visible:ring-orange-500"
                            />
                            {!isAuthenticated && (
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Si tenés cuenta, iniciá sesión para cargar tus datos automáticamente.
                                </p>
                            )}
                        </div>

                        <Button
                            className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-6 text-lg shadow-lg shadow-green-500/30 gap-2 mt-2"
                            onClick={handleWhatsApp}
                        >
                            <MessageCircle className="size-5" />
                            Consultar por WhatsApp
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

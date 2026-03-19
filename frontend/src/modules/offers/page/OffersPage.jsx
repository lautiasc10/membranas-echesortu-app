import { useState, useEffect } from "react";
import { LandingHeader } from "../../landing/ui/LandingHeader";
import { LandingFooter } from "../../landing/ui/LandingFooter";
import { offersRepository } from "../data/offers.repository";
import { useAuth } from "../../../shared/context/AuthContext";
import { useCart } from "../../../shared/context/CartContext";
import { OfferCard } from "../ui/OfferCard";

export function OffersPage() {
    const { user } = useAuth();
    const { toggleCart } = useCart();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        offersRepository.getActive()
            .then(data => setOffers(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="font-[Manrope] text-gray-900 bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <section className="pt-28 pb-10 px-6 md:px-10 max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p className="text-orange-500 uppercase font-bold tracking-wider text-sm mb-3">🔥 Ofertas Exclusivas</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Ofertas del Mes</h1>
                        <p className="text-gray-500 text-base">
                            Precios especiales en productos seleccionados y promociones vigentes.
                        </p>
                    </div>
                    {user && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                            <div>
                                <p className="text-xs text-green-600 font-bold">Sesión activa</p>
                                <p className="text-xs text-green-500">{user.email || user.name || "Cliente"}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

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
                        {offers.map((offer) => (
                            <OfferCard key={offer.id} offer={offer} />
                        ))}
                    </div>
                )}
            </section>

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

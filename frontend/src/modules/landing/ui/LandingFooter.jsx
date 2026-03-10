import logoMembrana from "../../../img/logo-membrana.png";

export function LandingFooter() {
    return (
        <footer className="bg-[#151515] text-white py-20 px-6 md:px-10">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 border-b border-white/10 pb-16 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <img src={logoMembrana} alt="Logo" className="h-8 w-8 object-contain" />
                        <span className="text-xl font-black">MEMBRANAS</span>
                    </div>
                    <p className="text-gray-500 text-sm max-w-xs mb-6">
                        Especialistas en impermeabilización y protección de ambientes contra la humedad y filtraciones.
                    </p>
                    {/* Social Media */}
                    <div className="flex gap-4">
                        <a
                            href="https://www.instagram.com/membranasechesortu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-white/10 transition-all"
                            aria-label="Instagram"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                        </a>
                        <a
                            href="https://www.facebook.com/membranasechesortu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-white/10 transition-all"
                            aria-label="Facebook"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-base">Enlaces Rápidos</h4>
                    <ul className="space-y-3">
                        <li><a href="/" className="text-gray-400 text-sm hover:text-white transition-colors">Home</a></li>
                        <li><a href="/catalogo" className="text-gray-400 text-sm hover:text-white transition-colors">Catálogo de Productos</a></li>
                        <li><a href="/#ofertas" className="text-gray-400 text-sm hover:text-white transition-colors">Ofertas</a></li>
                        <li><a href="/#contacto" className="text-gray-400 text-sm hover:text-white transition-colors">Solicitar Cotización</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-base">Productos Destacados</h4>
                    <ul className="space-y-3">
                        <li><a href="/catalogo" className="text-gray-400 text-sm hover:text-white transition-colors">Membranas Asfálticas</a></li>
                        <li><a href="/catalogo" className="text-gray-400 text-sm hover:text-white transition-colors">Impermeabilizantes Líquidos</a></li>
                        <li><a href="/catalogo" className="text-gray-400 text-sm hover:text-white transition-colors">Geotextiles</a></li>
                        <li><a href="/catalogo" className="text-gray-400 text-sm hover:text-white transition-colors">Pinturas Especiales</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-base">Contacto</h4>
                    <ul className="space-y-4 mb-6">
                        <li className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <span className="text-gray-400 text-sm">San Juan 3451, Rosario</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                            <a href="https://www.instagram.com/membranasechesortu" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">@membranasechesortu</a>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            <a href="https://www.facebook.com/membranasechesortu" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">/membranasechesortu</a>
                        </li>
                    </ul>
                    <h4 className="font-bold mb-3 text-sm">Recibir Información</h4>
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                        <input
                            type="email"
                            placeholder="Tu Email"
                            className="bg-transparent border-none p-2 text-sm w-full outline-none text-white placeholder-gray-500"
                        />
                        <button className="bg-orange-500 text-white p-2 px-4 rounded-md font-bold text-xs hover:bg-orange-600 transition-colors shrink-0">
                            →
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest gap-4">
                <p>© 2026 MEMBRANAS ECHESORTU. TODOS LOS DERECHOS RESERVADOS.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-gray-400 transition-colors">Privacidad</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Términos</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    );
}

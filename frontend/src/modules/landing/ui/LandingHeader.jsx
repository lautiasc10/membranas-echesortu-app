import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoMembrana from "../../../img/logo-membrana.png";
import { useAuth } from "../../../shared/context/AuthContext";
import { toast } from "sonner";

export function LandingHeader() {
    const { isAuthenticated, user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Sesión cerrada correctamente");
        navigate("/");
    };

    const isAdmin = user?.role === "admin" || user?.role === "superadmin";

    const navLinks = [
        { href: "/#inicio", label: "Inicio", isLink: false },
        { to: "/catalogo", label: "Catálogo", isLink: true },
        { to: "/galeria", label: "Galería", isLink: true },
        { to: "/ofertas", label: "Ofertas", isLink: true },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm">
            <div className="h-20 flex items-center justify-between px-6 md:px-10">
                <Link to="/" className="flex items-center gap-3">
                    <img src={logoMembrana} alt="Membranas Echesortu" className="h-10 w-10 object-contain" />
                    <span className="text-lg font-bold tracking-tight">
                        <span className="text-gray-800">MEMBRANAS</span>{" "}
                        <span className="text-orange-500">ECHESORTU</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex gap-8">
                    {navLinks.map((link) =>
                        link.isLink ? (
                            <Link key={link.label} to={link.to} className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">{link.label}</Link>
                        ) : (
                            <a key={link.label} href={link.href} className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">{link.label}</a>
                        )
                    )}
                </nav>

                <div className="flex gap-3 items-center">
                    {isAuthenticated ? (
                        <>
                            <span className="text-xs text-gray-400 hidden xl:inline">
                                Hola, <span className="font-semibold text-gray-600">{user?.name ? user.name.split(" ")[0] : (user?.email || "Cliente")}</span>
                            </span>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors hidden md:inline-block"
                                >
                                    Ir al Panel
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors hidden sm:inline-block cursor-pointer"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/registro"
                                className="px-5 py-2 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors hidden md:inline-block"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}

                    {/* Hamburger button — mobile only */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ml-1"
                        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {menuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <nav className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
                    {navLinks.map((link) =>
                        link.isLink ? (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className="text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-lg transition-colors"
                            >
                                {link.label}
                            </a>
                        )
                    )}
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-2 text-center px-5 py-3 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                                >
                                    Ir al Panel
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="mt-2 text-center px-5 py-3 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/registro"
                            onClick={() => setMenuOpen(false)}
                            className="mt-2 text-center px-5 py-3 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                        >
                            Registrarse
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
}

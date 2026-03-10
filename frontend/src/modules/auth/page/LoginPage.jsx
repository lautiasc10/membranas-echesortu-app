import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../../services/auth.api";
import { useAuth } from "../../../shared/context/AuthContext";
import logoMembrana from "../../../img/logo-membrana.png";

export function LoginPage() {
    const navigate = useNavigate();
    const { loginStore } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) {
            setError("Completá todos los campos.");
            return;
        }
        try {
            setLoading(true);
            const data = await login(form);
            // El backend devuelve LoginDto record: { "Token", "Name", "Email", "Role" }
            const userRole = data.Role || data.role;
            const userToken = data.Token || data.token;
            const userRefreshToken = data.RefreshToken || data.refreshToken;
            const userName = data.Name || data.name;

            loginStore(userToken, userRefreshToken, { email: form.email, name: userName, role: userRole }, rememberMe);

            // Si es admin o superadmin, ir al panel de admin
            if (userRole === "admin" || userRole === "superadmin") {
                navigate("/admin", { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            const msg = err?.message || "";
            if (msg.includes("INVALID_EMAIL_OR_PASSWORD")) {
                setError("Email o contraseña incorrectos.");
            } else {
                setError("Error al iniciar sesión. Intentá de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-[Manrope] min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-10">
                    <img src={logoMembrana} alt="Logo" className="h-12 w-12 object-contain" />
                    <span className="text-2xl font-black tracking-tight">
                        <span className="text-orange-500">MEMBRANAS</span>{" "}
                        <span className="text-gray-800">ECHESORTU</span>
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-8 md:p-10 border border-gray-100">
                    <h1 className="text-2xl font-extrabold mb-2">Iniciar Sesión</h1>
                    <p className="text-gray-400 text-sm mb-8">Ingresá con tu cuenta para acceder a ofertas exclusivas.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="tu@email.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <div
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${rememberMe
                                    ? "bg-orange-500 border-orange-500"
                                    : "border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                {rememberMe && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                )}
                            </div>
                            <span className="text-sm text-gray-500">Mantener sesión iniciada</span>
                        </label>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        ¿No tenés cuenta?{" "}
                        <Link to="/registro" className="text-orange-500 font-semibold hover:underline">
                            Registrate
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-300 mt-8">
                    <Link to="/" className="hover:text-gray-400 transition-colors">← Volver al Inicio</Link>
                </p>
            </div>
        </div>
    );
}

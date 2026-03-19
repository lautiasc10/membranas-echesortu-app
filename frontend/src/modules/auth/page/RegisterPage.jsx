import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerClient, login } from "../../../services/auth.api";
import { useAuth } from "../../../shared/context/AuthContext";
import logoMembrana from "../../../img/logo-membrana.png";

export function RegisterPage() {
    const navigate = useNavigate();
    const { loginStore } = useAuth();
    const [form, setForm] = useState({ name: "", phoneNumber: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.name || !form.phoneNumber || !form.email || !form.password) {
            setError("Completá todos los campos.");
            return;
        }
        if (form.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (!/[A-Z]/.test(form.password)) {
            setError("La contraseña debe tener al menos una letra mayúscula.");
            return;
        }
        try {
            setLoading(true);
            await registerClient(form);
            // Auto-login after register
            await login({ email: form.email, password: form.password });

            loginStore({ email: form.email, name: form.name });
            navigate("/ofertas");
        } catch (err) {
            const msg = err?.message || "";
            if (msg.includes("EMAIL_ALREADY_EXISTS")) {
                setError("Ya existe una cuenta con ese email.");
            } else {
                setError(msg || "Error al registrarse. Intentá de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-[Manrope] min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 flex items-center justify-center px-4 py-12">
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
                    <h1 className="text-2xl font-extrabold mb-2">Crear Cuenta</h1>
                    <p className="text-gray-400 text-sm mb-8">Registrate para acceder a ofertas exclusivas y cotizaciones.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2">Nombre</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Tu nombre completo"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2">Teléfono</label>
                            <input
                                type="tel"
                                value={form.phoneNumber}
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                placeholder="+54 341 1234567"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                            />
                        </div>
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
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Mínimo 8 caracteres, una mayúscula"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                            />
                        </div>

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
                                "Crear Cuenta"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        ¿Ya tenés cuenta?{" "}
                        <Link to="/login" className="text-orange-500 font-semibold hover:underline">
                            Iniciá Sesión
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

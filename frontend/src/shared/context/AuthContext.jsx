import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logoutApi } from "../../services/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifySession = async () => {
            try {
                const userData = await getMe();
                if (isMounted) setUser(userData);
            } catch {
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setLoadingAuth(false);
            }
        };

        verifySession();

        const handleLogoutEvent = () => logout();
        window.addEventListener("auth:logout", handleLogoutEvent);
        return () => {
            isMounted = false;
            window.removeEventListener("auth:logout", handleLogoutEvent);
        };
    }, []);

    const isAuthenticated = !!user;

    function loginStore(userData) {
        setUser(userData || null);
    }

    async function logout() {
        try {
            await logoutApi();
        } catch { } // Call backend to clear the HttpOnly cookies, ignoring non-200 responses

        setUser(null);
        window.dispatchEvent(new Event("cart:clear"));
    }

    if (loadingAuth) return <div className="p-8 text-center text-gray-500">Cargando sesión...</div>;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loginStore, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token"));
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
        return saved ? JSON.parse(saved) : null;
    });

    const isAuthenticated = !!token;

    function loginStore(tokenValue, refreshTokenValue, userData, rememberMe = true) {
        if (rememberMe) {
            localStorage.setItem("auth_token", tokenValue);
            if (refreshTokenValue) localStorage.setItem("refresh_token", refreshTokenValue);
            if (userData) localStorage.setItem("auth_user", JSON.stringify(userData));
        } else {
            sessionStorage.setItem("auth_token", tokenValue);
            if (refreshTokenValue) sessionStorage.setItem("refresh_token", refreshTokenValue);
            if (userData) sessionStorage.setItem("auth_user", JSON.stringify(userData));
        }
        setToken(tokenValue);
        setUser(userData || null);
    }

    function logout() {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("auth_user");
        setToken(null);
        setUser(null);

        // Disparar evento para que el CartContext escuche y borre el carrito
        window.dispatchEvent(new Event("cart:clear"));
    }

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, loginStore, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

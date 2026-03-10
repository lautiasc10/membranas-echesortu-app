const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

const errorMessages = {
    PRODUCT_NOT_FOUND: "Producto no encontrado",
    INVALID_SALE_PRICE: "Precio de venta inválido",
    INVALID_PURCHASE_PRICE: "Precio de compra inválido",
    INVALID_STOCK: "Stock inválido",
};

export const handleResponse = async (res) => {
    let data = null;
    try {
        data = await res.json();
    } catch { }

    if (!res.ok) {
        const code = data?.message || `HTTP_${res.status}`;
        const message = errorMessages[code] || code;
        throw { message, status: res.status, details: data };
    }

    return data;
};

/**
 * Fetch wrapper que agrega el token JWT automáticamente.
 * Lee el token de localStorage y lo envía como Authorization: Bearer <token>.
 * Usar para todos los endpoints que requieran autenticación.
 */
let isRefreshing = false;
let refreshPromise = null;

export const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    const getHeaders = (t) => ({
        ...options.headers,
        ...(t ? { "Authorization": `Bearer ${t}` } : {})
    });

    let res = await fetch(url, { ...options, headers: getHeaders(token) });

    // Si explota por token vencido (401), intentamos refrescar la sesión silenciosamente
    if (res.status === 401) {
        const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");

        if (!refreshToken) return res; // No hay cómo refrescar, devuelvo el 401 original

        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = fetch(`${baseUrl}/api/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken })
            }).then(async refreshRes => {
                if (!refreshRes.ok) throw new Error("Refresh failed");
                const data = await refreshRes.json();
                const newToken = data.Token || data.token;
                const newRefresh = data.RefreshToken || data.refreshToken;

                // Actualizar donde sea que estuviese guardado el token original (Local o Session)
                if (localStorage.getItem("refresh_token")) {
                    localStorage.setItem("auth_token", newToken);
                    localStorage.setItem("refresh_token", newRefresh);
                } else if (sessionStorage.getItem("refresh_token")) {
                    sessionStorage.setItem("auth_token", newToken);
                    sessionStorage.setItem("refresh_token", newRefresh);
                }
                return newToken;
            }).catch(err => {
                // Si el refresh falla (ej: pasaron 7 días), limpiamos credenciales y forzamos re-login
                localStorage.removeItem("auth_token");
                localStorage.removeItem("refresh_token");
                sessionStorage.removeItem("auth_token");
                sessionStorage.removeItem("refresh_token");
                window.location.href = "/login";
                throw err;
            }).finally(() => {
                isRefreshing = false;
            });
        }

        try {
            const newToken = await refreshPromise;
            // Reintentar la petición original con el nuevo token mágico
            res = await fetch(url, { ...options, headers: getHeaders(newToken) });
        } catch {
            return res; // Devolver el 401 si todo falló
        }
    }

    return res;
};

export { baseUrl };

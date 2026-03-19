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
    // 1. Agregar explícitamente el envío de cookies a cada request
    const fetchOptions = {
        ...options,
        credentials: "include", // <-- VITAL para que viaje la cookie HTTPOnly
        headers: {
            ...options.headers,
            "Accept": "application/json"
        }
    };

    let res = await fetch(url, fetchOptions);

    // 2. Si explota por token vencido (401), intentamos refrescar la sesión silenciosamente usando la refresh_cookie
    if (res.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = fetch(`${baseUrl}/api/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include" // <-- VITAL porque el refresh token viaja en cookie
            }).then(async refreshRes => {
                if (!refreshRes.ok) throw new Error("Refresh failed");
                return true;
            }).catch(err => {
                // Si el refresh falla (ej: expiró la sesión o token corrupto), matamos la sesión
                window.dispatchEvent(new Event("auth:logout"));
                throw err;
            }).finally(() => {
                isRefreshing = false;
            });
        }

        try {
            await refreshPromise;
            // Reintentar la petición original ahora que hay cookies renovadas
            res = await fetch(url, fetchOptions);
        } catch {
            return res; // Devolver el 401 si todo falló
        }
    }

    return res;
};

export { baseUrl };

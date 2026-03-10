import { baseUrl, handleResponse, authFetch } from "./apiClient";

export const getQuotes = async () => {
    const res = await authFetch(`${baseUrl}/api/quotes`);
    return handleResponse(res);
};

export const getQuoteById = async (id) => {
    const res = await authFetch(`${baseUrl}/api/quotes/${id}`);
    return handleResponse(res);
};

export const createQuote = async (payload) => {
    const res = await authFetch(`${baseUrl}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const updateQuote = async (id, payload) => {
    const res = await authFetch(`${baseUrl}/api/quotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const deleteQuote = async (id) => {
    const res = await authFetch(`${baseUrl}/api/quotes/${id}`, {
        method: "DELETE",
    });
    return handleResponse(res);
};

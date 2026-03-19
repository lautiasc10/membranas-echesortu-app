import { baseUrl, handleResponse, authFetch } from "./apiClient";

export const getPagedOffers = async ({ page = 1, pageSize = 10, onlyActive = false }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    params.append("onlyActive", onlyActive);

    const res = await fetch(`${baseUrl}/api/Offer?${params.toString()}`);
    return handleResponse(res);
};

export const getActiveOffers = async () => {
    const res = await fetch(`${baseUrl}/api/Offer/active`);
    return handleResponse(res);
};

export const getOfferById = async (id) => {
    const res = await fetch(`${baseUrl}/api/Offer/${id}`);
    return handleResponse(res);
};

export const createOffer = async (payload) => {
    const res = await authFetch(`${baseUrl}/api/Offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const updateOffer = async (id, payload) => {
    const res = await authFetch(`${baseUrl}/api/Offer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return handleResponse(res);
};

export const uploadOfferImage = async (id, file) => {
    const formData = new FormData();
    formData.append("Image", file);

    const res = await authFetch(`${baseUrl}/api/Offer/${id}/image`, {
        method: "POST",
        body: formData,
    });
    return handleResponse(res);
};

export const deleteOffer = async (id) => {
    const res = await authFetch(`${baseUrl}/api/Offer/${id}`, {
        method: "DELETE",
    });
    return handleResponse(res);
};
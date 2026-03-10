import { baseUrl, handleResponse, authFetch } from "./apiClient";

export const getAllVariants = async (page = 1, pageSize = 50) => {
    const res = await fetch(
        `${baseUrl}/api/product-variants/paged-by-brand?page=${page}&pageSize=${pageSize}`
    );
    return handleResponse(res);
};

export const getVariantsAll = async () => {
    const res = await fetch(`${baseUrl}/api/product-variants/all`);
    return handleResponse(res);
};

export const getVariantById = async (id) => {
    const res = await fetch(`${baseUrl}/api/product-variants/${id}`);
    return handleResponse(res);
};

export const getVariantsByProduct = async (productId) => {
    const res = await fetch(
        `${baseUrl}/api/product-variants/by-product/${productId}`
    );
    return handleResponse(res);
};

export const createVariant = async (payload) => {
    const res = await authFetch(`${baseUrl}/api/product-variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const updateVariant = async (id, payload) => {
    const res = await authFetch(`${baseUrl}/api/product-variants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const deleteVariant = async (id) => {
    const res = await authFetch(`${baseUrl}/api/product-variants/${id}`, {
        method: "DELETE",
    });
    return handleResponse(res);
};

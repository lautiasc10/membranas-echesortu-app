import { baseUrl, handleResponse, authFetch } from "./apiClient";

export const getAllProducts = async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    return handleResponse(res);
};

export const getTopSellingProducts = async (count = 6) => {
    const res = await fetch(`${baseUrl}/api/products/top-selling?count=${count}`);
    return handleResponse(res);
};

export const getPagedProducts = async ({ page = 1, pageSize = 8, search, brand, category, sort }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    if (search) params.append("search", search);
    if (brand && brand !== "all") params.append("brand", brand);
    if (category && category !== "all") params.append("category", category);
    if (sort) params.append("sort", sort);

    const res = await fetch(`${baseUrl}/api/products/paged?${params.toString()}`);
    return handleResponse(res);
};

export const getProductById = async (id) => {
    const res = await fetch(`${baseUrl}/api/products/${id}`);
    return handleResponse(res);
};

export const createProduct = async (payload) => {
    const res = await authFetch(`${baseUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const updateProduct = async (id, payload) => {
    const res = await authFetch(`${baseUrl}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const deleteProduct = async (id) => {
    const res = await authFetch(`${baseUrl}/api/products/${id}`, {
        method: "DELETE",
    });
    return handleResponse(res);
};

export const uploadProductImage = async (productId, file) => {
    const fd = new FormData();
    fd.append("Image", file);

    const res = await authFetch(`${baseUrl}/api/products/${productId}/image`, {
        method: "POST",
        body: fd,
    });

    return handleResponse(res);
};

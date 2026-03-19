import { baseUrl, handleResponse, authFetch } from "./apiClient";

export const getPagedGallery = async ({ page = 1, pageSize = 10, onlyVisible = true }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    params.append("onlyVisible", onlyVisible);

    // Get publico
    const res = await fetch(`${baseUrl}/api/Gallery?${params.toString()}`);
    return handleResponse(res);
};

export const getGalleryById = async (id) => {
    const res = await fetch(`${baseUrl}/api/Gallery/${id}`);
    return handleResponse(res);
};

export const createGalleryProject = async (payload) => {
    const res = await authFetch(`${baseUrl}/api/Gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const updateGalleryProject = async (id, payload) => {
    const res = await authFetch(`${baseUrl}/api/Gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const uploadGalleryBeforeImage = async (id, file) => {
    const formData = new FormData();
    formData.append("Image", file);
    const res = await authFetch(`${baseUrl}/api/Gallery/${id}/before-image`, {
        method: "POST",
        body: formData,
    });
    return handleResponse(res);
};

export const uploadGalleryAfterImage = async (id, file) => {
    const formData = new FormData();
    formData.append("Image", file);
    const res = await authFetch(`${baseUrl}/api/Gallery/${id}/after-image`, {
        method: "POST",
        body: formData,
    });
    return handleResponse(res);
};

export const deleteGalleryProject = async (id) => {
    const res = await authFetch(`${baseUrl}/api/Gallery/${id}`, {
        method: "DELETE",
    });
    return handleResponse(res);
};

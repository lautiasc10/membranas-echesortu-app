import { baseUrl, handleResponse, authFetch } from "./apiClient";

export const getClients = async () => {
    const res = await authFetch(`${baseUrl}/api/clients`);
    return handleResponse(res);
};

export const getPagedClients = async ({ page = 1, pageSize = 10, search, sort }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);

    const res = await authFetch(`${baseUrl}/api/clients/paged?${params.toString()}`);
    return handleResponse(res);
};

export const getClientById = async (id) => {
    const res = await authFetch(`${baseUrl}/api/clients/${id}`);
    return handleResponse(res);
};

export const createClient = async (payload) => {
    const res = await authFetch(`${baseUrl}/api/clients/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const updateClient = async (id, payload) => {
    const res = await authFetch(`${baseUrl}/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const deleteClient = async (id) => {
    const res = await authFetch(`${baseUrl}/api/clients/${id}`, {
        method: "DELETE",
    });
    return handleResponse(res);
};

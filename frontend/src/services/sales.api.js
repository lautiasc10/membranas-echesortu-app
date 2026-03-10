import { baseUrl, handleResponse, authFetch } from "./apiClient";

export const getSales = async () => {
    const res = await authFetch(`${baseUrl}/api/sales`);
    return handleResponse(res);
};

export const getPagedSales = async ({ page = 1, pageSize = 10, search, status, fromDate, toDate, sort }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (sort) params.append("sort", sort);

    const res = await authFetch(`${baseUrl}/api/sales/paged?${params.toString()}`);
    return handleResponse(res);
};

export const getSaleById = async (id) => {
    const res = await authFetch(`${baseUrl}/api/sales/${id}`);
    return handleResponse(res);
};

export const createSale = async (payload) => {
    const res = await authFetch(`${baseUrl}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const updateSale = async (id, payload) => {
    const res = await authFetch(`${baseUrl}/api/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
};

export const deleteSale = async (id) => {
    const res = await authFetch(`${baseUrl}/api/sales/${id}`, {
        method: "DELETE",
    });
    return handleResponse(res);
};

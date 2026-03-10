import { baseUrl, handleResponse, authFetch } from './apiClient';

export const categoriesApi = {
    getAll: async () => {
        const response = await fetch(`${baseUrl}/api/categories`);
        return handleResponse(response);
    },

    create: async (categoryData) => {
        const response = await authFetch(`${baseUrl}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData),
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await authFetch(`${baseUrl}/api/categories/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    }
};

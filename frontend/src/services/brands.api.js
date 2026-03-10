import { baseUrl, handleResponse, authFetch } from './apiClient';

export const brandsApi = {
    getAll: async () => {
        const response = await fetch(`${baseUrl}/api/brands`);
        return handleResponse(response);
    },

    create: async (brandData) => {
        const response = await authFetch(`${baseUrl}/api/brands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(brandData),
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await authFetch(`${baseUrl}/api/brands/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    }
};

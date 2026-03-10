import { baseUrl, handleResponse } from "./apiClient";

export const login = async (data) => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
};

export const registerClient = async (data) => {
    const res = await fetch(`${baseUrl}/api/auth/register-client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse(res);
};

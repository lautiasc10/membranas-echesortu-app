import { baseUrl, handleResponse, authFetch } from "./apiClient";

export const login = async (data) => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Require cookies so set-cookie headers are processed
        body: JSON.stringify(data),
    });
    return handleResponse(res);
};

export const getMe = async () => {
    const res = await authFetch(`${baseUrl}/api/auth/me`, { method: "GET" });
    return handleResponse(res);
};

export const logoutApi = async () => {
    const res = await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
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

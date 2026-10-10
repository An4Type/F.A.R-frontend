import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
if (!apiUrl) {
    throw new Error(
        "Missing API_URL. Copy .env.example to .env, set API_URL, and restart the dev server."
    );
}

export const api = axios.create({
    baseURL: apiUrl,
});

interface ApiAuthHandlers {
    getToken: () => string | null;
    onUnauthorized: () => void;
}

// As the logic of the auth is placed in features and the api is basically a lib,
// we need to provide a way to configure the api with the auth logic. This is done
// by providing a configureApiAuth function that is called in the auth feature.
let authHandlers: ApiAuthHandlers | null = null;

export function configureApiAuth(handlers: ApiAuthHandlers) {
    authHandlers = handlers;
}

api.interceptors.request.use((config) => {
    const token = authHandlers?.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const hadAuthHeader = Boolean(error.config?.headers?.Authorization);
        if (error.response?.status === 401 && hadAuthHeader) {
            authHandlers?.onUnauthorized();
        }
        return Promise.reject(error);
    }
);

import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Bearer token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('skitech_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Logic for handling unauthorized errors (e.g., redirect to login or refresh token)
            console.warn('Unauthorized! Redirecting to login or clearing session...');
            // localStorage.removeItem('skitech_token');
            // window.location.href = '/account';
        }
        return Promise.reject(error);
    }
);

export default apiClient;

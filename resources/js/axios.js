import axios from 'axios';

// Create axios instance with base URL
const instance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor for API calls
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const response = await axios.post('/api/auth/refresh');
                const { token } = response.data;

                localStorage.setItem('token', token);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
            } catch (error) {
                // If refresh token fails, redirect to login
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default instance; 
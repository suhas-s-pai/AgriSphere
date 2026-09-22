import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AgriSphere API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.warn('Backend server is currently offline or unreachable.');
    return { status: 'offline', message: 'Backend unreachable' };
  }
};

export default apiClient;


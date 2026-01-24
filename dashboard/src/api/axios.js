import axios from 'axios';

const attachInterceptors = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('AccessToken');
      console.log("This is token", token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Don't set Content-Type for FormData - let the browser set it with boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  return apiInstance;
};

const healthService = attachInterceptors(axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://82.29.167.144:5001/api', 
  // baseURL:`http://localhost:5000/api`, 
  headers: { 'Content-Type': 'application/json' }
}));

export { healthService };

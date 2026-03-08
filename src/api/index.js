import axios from 'axios';
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});
// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Handle auth errors
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// Auth
export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};
export const register = async (email, password, name, role) => {
    const response = await api.post('/register', { email, password, name, role });
    return response.data;
};
export const getMe = async () => {
    const response = await api.get('/me');
    return response.data;
};
// Dashboard
export const getDashboard = async () => {
    const response = await api.get('/dashboard');
    return response.data;
};
// Customers
export const getCustomers = async (params) => {
    const response = await api.get('/customers', { params });
    return response.data;
};
export const getCustomer = async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};
export const createCustomer = async (data) => {
    const response = await api.post('/customers', data);
    return response.data;
};
export const updateCustomer = async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
};
export const deleteCustomer = async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};
// Tags
export const getTags = async () => {
    const response = await api.get('/tags');
    return response.data;
};
export const createTag = async (data) => {
    const response = await api.post('/tags', data);
    return response.data;
};
export const updateTag = async (id, data) => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data;
};
export const deleteTag = async (id) => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
};
export const addTagToCustomer = async (customerId, tagId) => {
    const response = await api.post(`/customers/${customerId}/tags/${tagId}`);
    return response.data;
};
export const removeTagFromCustomer = async (customerId, tagId) => {
    const response = await api.delete(`/customers/${customerId}/tags/${tagId}`);
    return response.data;
};
// Groups
export const getGroups = async () => {
    const response = await api.get('/groups');
    return response.data;
};
export const createGroup = async (data) => {
    const response = await api.post('/groups', data);
    return response.data;
};
export const updateGroup = async (id, data) => {
    const response = await api.put(`/groups/${id}`, data);
    return response.data;
};
export const deleteGroup = async (id) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
};
// Follow-ups
export const getFollowUps = async (customerId) => {
    const response = await api.get(`/customers/${customerId}/followups`);
    return response.data;
};
export const createFollowUp = async (customerId, data) => {
    const response = await api.post(`/customers/${customerId}/followups`, data);
    return response.data;
};
export const updateFollowUp = async (id, data) => {
    const response = await api.put(`/followups/${id}`, data);
    return response.data;
};
export const deleteFollowUp = async (id) => {
    const response = await api.delete(`/followups/${id}`);
    return response.data;
};
export default api;

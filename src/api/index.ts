import axios from 'axios';
import type { User, Customer, Tag, CustomerGroup, FollowUp, DashboardData, PaginatedResponse } from '../types';

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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, name: string, role?: string) => {
  const response = await api.post('/register', { email, password, name, role });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get<User>('/me');
  return response.data;
};

// Dashboard
export const getDashboard = async () => {
  const response = await api.get<DashboardData>('/dashboard');
  return response.data;
};

// Customers
export const getCustomers = async (params?: {
  search?: string;
  level?: string;
  source?: string;
  industry?: string;
  groupId?: string;
  tagId?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get<PaginatedResponse<Customer>>('/customers', { params });
  return response.data;
};

export const getCustomer = async (id: number) => {
  const response = await api.get<Customer>(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (data: Partial<Customer>) => {
  const response = await api.post<Customer>('/customers', data);
  return response.data;
};

export const updateCustomer = async (id: number, data: Partial<Customer>) => {
  const response = await api.put<Customer>(`/customers/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id: number) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

// Tags
export const getTags = async () => {
  const response = await api.get<Tag[]>('/tags');
  return response.data;
};

export const createTag = async (data: Partial<Tag>) => {
  const response = await api.post<Tag>('/tags', data);
  return response.data;
};

export const updateTag = async (id: number, data: Partial<Tag>) => {
  const response = await api.put<Tag>(`/tags/${id}`, data);
  return response.data;
};

export const deleteTag = async (id: number) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};

export const addTagToCustomer = async (customerId: number, tagId: number) => {
  const response = await api.post(`/customers/${customerId}/tags/${tagId}`);
  return response.data;
};

export const removeTagFromCustomer = async (customerId: number, tagId: number) => {
  const response = await api.delete(`/customers/${customerId}/tags/${tagId}`);
  return response.data;
};

// Groups
export const getGroups = async () => {
  const response = await api.get<CustomerGroup[]>('/groups');
  return response.data;
};

export const createGroup = async (data: Partial<CustomerGroup>) => {
  const response = await api.post<CustomerGroup>('/groups', data);
  return response.data;
};

export const updateGroup = async (id: number, data: Partial<CustomerGroup>) => {
  const response = await api.put<CustomerGroup>(`/groups/${id}`, data);
  return response.data;
};

export const deleteGroup = async (id: number) => {
  const response = await api.delete(`/groups/${id}`);
  return response.data;
};

// Follow-ups
export const getFollowUps = async (customerId: number) => {
  const response = await api.get<FollowUp[]>(`/customers/${customerId}/followups`);
  return response.data;
};

export const createFollowUp = async (customerId: number, data: Partial<FollowUp>) => {
  const response = await api.post<FollowUp>(`/customers/${customerId}/followups`, data);
  return response.data;
};

export const updateFollowUp = async (id: number, data: Partial<FollowUp>) => {
  const response = await api.put<FollowUp>(`/followups/${id}`, data);
  return response.data;
};

export const deleteFollowUp = async (id: number) => {
  const response = await api.delete(`/followups/${id}`);
  return response.data;
};

export default api;

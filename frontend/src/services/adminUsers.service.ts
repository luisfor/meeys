import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = Cookies.get('meys_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const adminUsersService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/admin/users`, getAuthHeaders());
    return response.data;
  },
  create: async (data: any) => {
    const response = await axios.post(`${API_URL}/admin/users`, data, getAuthHeaders());
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await axios.patch(`${API_URL}/admin/users/${id}`, data, getAuthHeaders());
    return response.data;
  },
  toggleStatus: async (id: string) => {
    const response = await axios.patch(`${API_URL}/admin/users/${id}/toggle`, {}, getAuthHeaders());
    return response.data;
  },
  remove: async (id: string) => {
    const response = await axios.delete(`${API_URL}/admin/users/${id}`, getAuthHeaders());
    return response.data;
  },
  getDeleted: async () => {
    const response = await axios.get(`${API_URL}/admin/users/deleted`, getAuthHeaders());
    return response.data;
  },
  restore: async (id: string) => {
    const response = await axios.patch(`${API_URL}/admin/users/${id}/restore`, {}, getAuthHeaders());
    return response.data;
  },
};


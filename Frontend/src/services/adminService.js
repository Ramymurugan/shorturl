const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const adminService = {
  getUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return data.users;
  },

  getUrls: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/urls`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch URLs');
    return data.urls;
  },

  getStats: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch system stats');
    return data.stats;
  },

  getPendingRequests: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/requests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch pending admin requests');
    return data.requests;
  },

  approveRequest: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/requests/${userId}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to approve request');
    return data;
  },

  rejectRequest: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/requests/${userId}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to reject request');
    return data;
  }
};

export default adminService;

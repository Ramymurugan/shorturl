const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },

  register: async (name, email, password, role) => {
    const body = { name, email, password };
    if (role) body.role = role;

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    
    // Save token if approved admin or normal user
    const shouldSaveToken = data.token && 
      (!data.user || 
       data.user.role !== 'admin' || 
       data.user.adminRequestStatus === 'approved');

    if (shouldSaveToken) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      localStorage.removeItem('token');
      throw new Error(data.message || 'Session expired');
    }
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  requestPromotion: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/auth/request-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update password');
    return data;
  }
};

export default authService;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const urlService = {
  shorten: async (originalUrl, customCode, expiresAt) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const body = { originalUrl };
    if (customCode) body.customCode = customCode;
    if (expiresAt) body.expiresAt = expiresAt;

    const response = await fetch(`${API_URL}/url/shorten`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to shorten URL');
    return data.url;
  },

  getMyUrls: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/url/my-urls`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch URLs');
    return data.urls;
  },

  deleteUrl: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/url/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete URL');
    return data;
  },

  updateUrl: async (id, originalUrl) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/url/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ originalUrl })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update URL');
    return data.url;
  },

  bulkShorten: async (urls) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/url/bulk-shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ urls })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to process bulk URLs');
    return data.results;
  }
};

export default urlService;

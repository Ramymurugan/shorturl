const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const analyticsService = {
  getUrlAnalytics: async (urlId) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/analytics/${urlId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch analytics');
    return data.stats;
  },

  getPublicAnalytics: async (shortCode) => {
    const response = await fetch(`${API_URL}/analytics/public/${shortCode}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch public analytics');
    return data;
  }
};

export default analyticsService;

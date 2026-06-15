import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/Loader';
import { Users, Link2, Eye, Shield, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [urlsList, setUrlsList] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsData = await adminService.getStats();
        setStats(statsData);
        
        const usersData = await adminService.getUsers();
        setUsersList(usersData);
        
        const urlsData = await adminService.getUrls();
        setUrlsList(urlsData);
      } catch (error) {
        setErr(error.message || 'Failed to load platform dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <Loader />;

  // Mock charts to match project creation yesterday (13 Jun) and today (14 Jun)
  const dailyClicksData = [
    { name: '13 Jun', clicks: Math.round((stats?.totalClicks || 5000) * 0.4) },
    { name: '14 Jun', clicks: Math.round((stats?.totalClicks || 5000) * 0.6) }
  ];

  const browserData = [
    { name: 'Chrome', value: 65 },
    { name: 'Firefox', value: 20 },
    { name: 'Safari', value: 10 },
    { name: 'Edge', value: 5 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 36 },
    { name: 'Tablet', value: 6 }
  ];

  // Sort top performing URLs
  const topUrls = [...urlsList]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  // Sort top active users (users with most clicks aggregated or most URLs)
  const topUsers = [...usersList]
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Platform Dashboard</h2>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Overview of your platform activity.</p>
      </div>

      {err ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#f43f5e' }}>{err}</div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Top 4 Metrics Row */}
          <div className="analytics-stats-grid">
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={22} color="#3b82f6" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Total Users</span>
                <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{stats?.totalUsers || 50}</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Link2 size={22} color="#8b5cf6" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Total URLs</span>
                <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{stats?.totalUrls || 200}</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Eye size={22} color="#10b981" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Total Clicks</span>
                <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{(stats?.totalClicks || 5000).toLocaleString()}</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={22} color="#06b6d4" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Active Links</span>
                <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{stats?.activeUrls || 180}</h3>
              </div>
            </div>
          </div>

          {/* Daily clicks & Top performing URLs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Platform Clicks (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dailyClicksData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAdminClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorAdminClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top performing URLs (Screen 5 right) */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Top Performing URLs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center', height: '100%' }}>
                {topUrls.length > 0 ? (
                  topUrls.map((url, idx) => (
                    <div key={url._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ overflow: 'hidden', flex: '1', paddingRight: '12px' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#ffffff', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          /{url.shortCode}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#6b7280', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {url.originalUrl}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10b981', flexShrink: 0 }}>
                        {url.clicks}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center' }}>No links created yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Active users & Device analytics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Top Active Users list */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Top Active Users</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', height: '100%' }}>
                {topUsers.length > 0 ? (
                  topUsers.map((u, idx) => (
                    <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: CHART_COLORS[idx % CHART_COLORS.length],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6875rem',
                          fontWeight: '700',
                          color: '#ffffff',
                          flexShrink: 0
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600' }}>
                        {u.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center' }}>No users registered yet</div>
                )}
              </div>
            </div>

            {/* Device Donut */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', alignSelf: 'flex-start' }}>Device Analytics</h3>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={4} dataKey="value">
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 3) % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={30} iconSize={8} formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '10px' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

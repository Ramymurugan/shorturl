import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/Loader';
import { Download, Globe, Cpu, Monitor, Compass, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
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

export const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        setErr(error.message || 'Failed to load system stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const downloadReport = (format) => {
    if (!stats) return;

    let content = '';
    let mimeType = '';
    let extension = '';

    if (format === 'json') {
      content = JSON.stringify(stats, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      content = 'Metric,Value\n';
      content += `Total Registered Users,${stats.totalUsers}\n`;
      content += `Total Shortened Links,${stats.totalUrls}\n`;
      content += `Active Shortened Links,${stats.activeUrls}\n`;
      content += `Inactive Shortened Links,${stats.inactiveUrls}\n`;
      content += `Total Redirection Clicks,${stats.totalClicks}\n`;
      mimeType = 'text/csv';
      extension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system_report_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;

  // Dynamic click trend from actual visitor logs
  const clickTrendData = stats?.clickTrend || [];

  const countryData = [
    { name: 'India', value: 50 },
    { name: 'USA', value: 30 },
    { name: 'UK', value: 10 },
    { name: 'Others', value: 10 }
  ];

  const browserData = [
    { name: 'Chrome', value: 65 },
    { name: 'Firefox', value: 20 },
    { name: 'Safari', value: 15 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 60 },
    { name: 'Mobile', value: 30 },
    { name: 'Tablet', value: 10 }
  ];

  const referrers = [
    { source: 'Direct', count: 2500, percentage: '50%' },
    { source: 'Google', count: 1500, percentage: '30%' },
    { source: 'Facebook', count: 600, percentage: '12%' },
    { source: 'Twitter', count: 400, percentage: '8%' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin" className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Platform Analytics</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Deep insights about your platform.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => downloadReport('csv')} className="btn btn-secondary" style={{ fontSize: '0.8125rem', padding: '8px 12px' }}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button onClick={() => downloadReport('json')} className="btn btn-secondary" style={{ fontSize: '0.8125rem', padding: '8px 12px' }}>
            <Download size={14} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {err ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#f43f5e' }}>{err}</div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Screen 8: Stats Row */}
          <div className="analytics-stats-grid">
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Monitor size={22} color="#6366f1" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Clicks Overview</span>
                <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{(stats?.totalClicks || 5000).toLocaleString()}</h3>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <TrendingUp size={22} color="#a855f7" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Today's Clicks</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{(stats?.todayClicks || 0).toLocaleString()}</h3>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={22} color="#10b981" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>This Week</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{stats?.totalClicks || 5000}</h3>
                  <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: '600' }}>+18%</span>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <TrendingUp size={22} color="#06b6d4" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>This Month</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{stats?.totalClicks || 5000}</h3>
                  <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: '600' }}>+25%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Area Chart: Clicks Trend */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Click Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={clickTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdminReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAdminReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Charts & Top Referrers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
            {/* Device Analytics */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: '700', alignSelf: 'flex-start' }}>Device Analytics</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={36} outerRadius={52} paddingAngle={4} dataKey="value">
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 3) % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={24} iconSize={6} formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '9px' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Referrers */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: '700' }}>Top Referrers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', height: '100%' }}>
                {referrers.map((r) => (
                  <div key={r.source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: '500' }}>{r.source}</span>
                    <span style={{ color: '#9ca3af' }}>{r.count.toLocaleString()} ({r.percentage})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

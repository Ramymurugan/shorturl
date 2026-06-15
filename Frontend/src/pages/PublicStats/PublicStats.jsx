import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import analyticsService from '../../services/analyticsService';
import Loader from '../../components/Loader';
import {
  Eye,
  Clock,
  Globe,
  Monitor,
  Calendar,
  ExternalLink,
  Lock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { formatDate } from '../../utils/formatDate';

const CHART_COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

export const PublicStats = () => {
  const { shortCode } = useParams();
  const [stats, setStats] = useState(null);
  const [urlDetails, setUrlDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const data = await analyticsService.getPublicAnalytics(shortCode);
        setStats(data.stats);
        setUrlDetails(data.url);
      } catch (error) {
        setErr(error.message || 'Failed to load public analytics for this link.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStats();
  }, [shortCode]);

  if (loading) return <Loader fullPage />;

  if (err) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#f43f5e', maxWidth: '480px', width: '100%' }}>
          <Lock size={48} style={{ marginBottom: '16px', opacity: '0.8' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>Analytics Unavailable</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{err}</p>
        </div>
        <Link to="/login" className="btn btn-primary">Return to Login</Link>
      </div>
    );
  }

  const getChartData = (obj) => {
    if (!obj || Object.keys(obj).length === 0) return [];
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
  };

  const devicesData = getChartData(stats?.devices);
  const countriesData = getChartData(stats?.countries);
  const dailyTrendData = stats?.dailyTrend || [];
  const weeklyTrendData = stats?.weeklyTrend || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Public Link Statistics</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Open performance insights for this shortened link.</p>
        </div>
      </div>

      {/* Selected Link Details */}
      {urlDetails && (
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Destination URL</span>
            <a href={urlDetails.originalUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', textDecoration: 'none' }}>
              <span style={{ wordBreak: 'break-all' }}>{urlDetails.originalUrl}</span>
              <ExternalLink size={14} color="#6366f1" style={{ flexShrink: 0 }} />
            </a>

            <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Short URL</span>
                <a href={urlDetails.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9375rem', color: '#6366f1', fontWeight: '600', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  {urlDetails.shortUrl}
                </a>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Created Date</span>
                <span style={{ fontSize: '0.9375rem', color: '#ffffff', display: 'block', marginTop: '2px', fontWeight: '500' }}>
                  {formatDate(urlDetails.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="analytics-stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={22} color="#6366f1" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Total Clicks</span>
            <h3 style={{ fontSize: '1.625rem', fontWeight: '700', margin: '0' }}>{stats?.totalClicks}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} color="#a855f7" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Last Visited</span>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '700', margin: '0', color: '#ffffff', marginTop: '4px' }}>
              {stats?.recentVisits && stats.recentVisits.length > 0
                ? formatDate(stats.recentVisits[0].timestamp)
                : 'No visits logged yet'}
            </h3>
          </div>
        </div>
      </div>

      {/* Area and Bar Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Daily Click Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicksPublic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorClicksPublic)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Weekly Click Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
              <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Device Analytics Donut */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', alignSelf: 'flex-start' }}>Device Analytics</h3>
          {devicesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={devicesData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {devicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconSize={10} formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '11px' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: '#6b7280', padding: '60px 0', fontSize: '0.875rem' }}>No data recorded</div>
          )}
        </div>

        {/* Country Analytics Donut */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', alignSelf: 'flex-start' }}>Country Analytics</h3>
          {countriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={countriesData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {countriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 3) % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconSize={10} formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '11px' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: '#6b7280', padding: '60px 0', fontSize: '0.875rem' }}>No data recorded</div>
          )}
        </div>
      </div>

      {/* Recent Visit History Table */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Recent Visit History</h3>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Detailed tracking logs for recent clicks.</p>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <th style={{ padding: '16px' }}>Timestamp</th>
                <th style={{ padding: '16px' }}>Browser</th>
                <th style={{ padding: '16px' }}>Device</th>
                <th style={{ padding: '16px' }}>OS</th>
                <th style={{ padding: '16px' }}>Referrer</th>
                <th style={{ padding: '16px' }}>Country</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentVisits && stats.recentVisits.length > 0 ? (
                stats.recentVisits.map((log) => (
                  <tr key={log._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="#6b7280" />
                      <span>{formatDate(log.timestamp)}</span>
                    </td>
                    <td style={{ padding: '16px' }}>{log.browser}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${log.device === 'Mobile' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {log.device}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{log.os}</td>
                    <td style={{ padding: '16px', color: '#6366f1', fontWeight: '500' }}>{log.referrer}</td>
                    <td style={{ padding: '16px' }}>{log.country || 'Unknown'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                    No clicks logged yet for this link.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublicStats;

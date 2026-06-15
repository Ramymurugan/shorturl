import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import urlService from '../../services/urlService';
import analyticsService from '../../services/analyticsService';
import Loader from '../../components/Loader';
import {
  ArrowLeft,
  Eye,
  Calendar,
  Monitor,
  Globe,
  Compass,
  Clock,
  ArrowRight,
  TrendingUp,
  Search,
  ExternalLink,
  ChevronDown
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
import './Analytics.css';

const CHART_COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

export const Analytics = () => {
  const { urlId } = useParams();
  const navigate = useNavigate();

  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState(urlId || '');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingStats, setFetchingStats] = useState(false);
  const [err, setErr] = useState('');

  // Fetch all user URLs to populate dropdown selector
  useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        const data = await urlService.getMyUrls();
        setUrls(data);
        if (data.length > 0 && !urlId) {
          // If no specific URL is in params, default to first URL
          setSelectedUrlId(data[0].id);
          navigate(`/analytics/${data[0].id}`, { replace: true });
        }
      } catch (error) {
        console.error('Failed to load links:', error);
      }
    };
    fetchUserUrls();
  }, [urlId, navigate]);

  // Fetch specific analytics stats when selectedUrlId changes
  useEffect(() => {
    if (!selectedUrlId) return;

    const fetchStats = async () => {
      setFetchingStats(true);
      setErr('');
      try {
        const data = await analyticsService.getUrlAnalytics(selectedUrlId);
        setStats(data);
      } catch (error) {
        setErr(error.message || 'Failed to load link analytics');
      } finally {
        setFetchingStats(false);
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedUrlId]);

  const handleLinkChange = (e) => {
    const newId = e.target.value;
    setSelectedUrlId(newId);
    navigate(`/analytics/${newId}`);
  };

  const getSelectedUrlDetails = () => {
    return urls.find(u => u.id === selectedUrlId);
  };

  if (loading) return <Loader fullPage />;

  const activeUrlDetails = getSelectedUrlDetails();

  // Parse charts data
  const getChartData = (obj) => {
    if (!obj || Object.keys(obj).length === 0) return [];
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
  };

  const browsersData = getChartData(stats?.browsers);
  const devicesData = getChartData(stats?.devices);
  const osData = getChartData(stats?.os);
  const referrersData = getChartData(stats?.referrers);
  const countriesData = getChartData(stats?.countries);

  // Dynamic Trend details showing clicks computed from actual visitor logs
  const dailyTrendData = stats?.dailyTrend || [];
  const weeklyTrendData = stats?.weeklyTrend || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header with selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/my-links" className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Analytics Overview</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Detailed performance insights for your short link.</p>
          </div>
        </div>

        {urls.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500' }}>Select Link:</span>
            <div style={{ position: 'relative' }}>
              <select
                className="form-select"
                style={{ minWidth: '220px', padding: '10px 40px 10px 16px', fontSize: '0.875rem' }}
                value={selectedUrlId}
                onChange={handleLinkChange}
              >
                {urls.map(u => (
                  <option key={u.id} value={u.id}>
                    /{u.shortCode} - {u.originalUrl.substring(0, 20)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {err ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#f43f5e' }}>{err}</div>
      ) : fetchingStats ? (
        <Loader />
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Screen 3: Selected Link Details */}
          {activeUrlDetails && (
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Selected Link</span>
                <a href={activeUrlDetails.originalUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', textDecoration: 'none' }}>
                  <span>{activeUrlDetails.originalUrl}</span>
                  <ExternalLink size={14} color="#6366f1" />
                </a>

                <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Short URL</span>
                    <a href={activeUrlDetails.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9375rem', color: '#6366f1', fontWeight: '600', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                      {activeUrlDetails.shortUrl}
                    </a>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Created Date</span>
                    <span style={{ fontSize: '0.9375rem', color: '#ffffff', display: 'block', marginTop: '2px', fontWeight: '500' }}>
                      {formatDate(activeUrlDetails.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {activeUrlDetails.qrCode && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>QR Code</span>
                  <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px' }}>
                    <img src={activeUrlDetails.qrCode} alt="QR Thumbnail" style={{ width: '64px', height: '64px', display: 'block' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Screen 3: Stat Cards */}
          <div className="analytics-stats-grid">
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

          {/* Screen 3: Area and Bar Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Daily Click Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
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

          {/* Screen 3: Donut Charts Grid */}
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

          {/* Screen 3: Recent Visit History Table */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Recent Visit History</h3>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Detailed tracking logs for individual clicks.</p>
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
                    <th style={{ padding: '16px' }}>IP Address</th>
                    <th style={{ padding: '16px' }}>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentVisits.length > 0 ? (
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
                        <td style={{ padding: '16px', fontFamily: 'monospace', color: '#9ca3af' }}>{log.ipAddress}</td>
                        <td style={{ padding: '16px' }}>{log.country || 'Unknown'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                        No clicks logged yet for this link.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

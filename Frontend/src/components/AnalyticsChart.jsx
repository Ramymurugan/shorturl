import React, { useState } from 'react';
import {
  ResponsiveContainer,
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
import { Monitor, Globe, Compass, Cpu } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

export const AnalyticsChart = ({ stats }) => {
  const [activeTab, setActiveTab] = useState('browsers');

  if (!stats) return null;

  const getChartData = (obj) => {
    if (!obj || Object.keys(obj).length === 0) return [];
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
  };

  const browsersData = getChartData(stats.browsers);
  const devicesData = getChartData(stats.devices);
  const osData = getChartData(stats.os);
  const referrersData = getChartData(stats.referrers);

  const renderActiveChart = () => {
    switch (activeTab) {
      case 'browsers':
        return browsersData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={browsersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {browsersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No browser data recorded.</div>
        );

      case 'devices':
        return devicesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={devicesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {devicesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No device data recorded.</div>
        );

      case 'os':
        return osData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={osData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {osData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No OS data recorded.</div>
        );

      case 'referrers':
        return referrersData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={referrersData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                dataKey="value"
              >
                {referrersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No referrer data recorded.</div>
        );

      default:
        return null;
    }
  };

  const getTabStyle = (tabId) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: activeTab === tabId ? '#ffffff' : '#9ca3af',
    background: activeTab === tabId ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    border: '1px solid',
    borderColor: activeTab === tabId ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
    transition: 'all 0.2s'
  });

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '2px' }}>Click Distribution</h3>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Understand where your visitors are coming from.</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', gap: '4px' }}>
          <button onClick={() => setActiveTab('browsers')} style={getTabStyle('browsers')}>
            <Globe size={14} />
            <span>Browsers</span>
          </button>
          <button onClick={() => setActiveTab('devices')} style={getTabStyle('devices')}>
            <Monitor size={14} />
            <span>Devices</span>
          </button>
          <button onClick={() => setActiveTab('os')} style={getTabStyle('os')}>
            <Cpu size={14} />
            <span>OS</span>
          </button>
          <button onClick={() => setActiveTab('referrers')} style={getTabStyle('referrers')}>
            <Compass size={14} />
            <span>Referrers</span>
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'center', minHeight: '330px', alignItems: 'center' }}>
        {renderActiveChart()}
      </div>
    </div>
  );
};

export default AnalyticsChart;

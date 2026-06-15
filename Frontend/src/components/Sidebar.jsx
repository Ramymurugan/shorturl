import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, Link2, Settings, ShieldAlert, Users, HelpCircle, FileText, CheckSquare, BarChart2, QrCode, User } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: isActive ? '#ffffff' : '#9ca3af',
    background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    border: '1px solid',
    borderColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
    transition: 'all var(--transition-fast)',
    marginBottom: '8px'
  });

  return (
    <aside style={{
      width: '240px',
      background: 'rgba(13, 17, 30, 0.45)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh - 70px)',
      position: 'sticky',
      top: '70px',
      overflowY: 'auto'
    }}>
      <div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          color: '#6b7280',
          letterSpacing: '0.05em',
          display: 'block',
          marginBottom: '16px',
          paddingLeft: '16px'
        }}>
          Menu
        </span>
        <NavLink to="/dashboard" style={linkStyle}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/my-links" style={linkStyle}>
          <Link2 size={18} />
          <span>My Links</span>
        </NavLink>
        <NavLink to="/analytics" style={linkStyle}>
          <BarChart2 size={18} />
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/qr-codes" style={linkStyle}>
          <QrCode size={18} />
          <span>QR Codes</span>
        </NavLink>
        <NavLink to="/settings" style={linkStyle}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        {isAdmin && (
          <div style={{ marginTop: '24px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              color: '#6b7280',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '16px',
              paddingLeft: '16px'
            }}>
              Admin Panel
            </span>
            <NavLink to="/admin" end style={linkStyle}>
              <ShieldAlert size={18} />
              <span>Admin Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" style={linkStyle}>
              <Users size={18} />
              <span>Users</span>
            </NavLink>
            <NavLink to="/admin/requests" style={linkStyle}>
              <CheckSquare size={18} />
              <span>Admin Requests</span>
            </NavLink>
            <NavLink to="/admin/urls" style={linkStyle}>
              <Link2 size={18} />
              <span>System URLs</span>
            </NavLink>
            <NavLink to="/admin/reports" style={linkStyle}>
              <FileText size={18} />
              <span>Reports</span>
            </NavLink>
          </div>
        )}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center'
      }}>
        <HelpCircle size={20} color="#9ca3af" style={{ marginBottom: '8px', display: 'inline-block' }} />
        <h5 style={{ fontSize: '0.8125rem', fontWeight: '600', marginBottom: '4px' }}>Need Help?</h5>
        <p style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>Contact support at support@smartlink.com</p>
      </div>
    </aside>
  );
};

export default Sidebar;

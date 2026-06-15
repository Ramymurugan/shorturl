import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LogOut, Link2, User as UserIcon, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, authenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      height: '70px',
      background: 'rgba(17, 24, 39, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: '0',
      zIndex: '100',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
        }}>
          <Link2 color="#ffffff" size={20} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em' }}>
          Smart<span className="text-gradient">Link</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {authenticated ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {user.role === 'admin' ? <Shield size={16} color="#8b5cf6" /> : <UserIcon size={16} color="#3b82f6" />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: '500', color: '#ffffff' }}>{user.name}</span>
                <span style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'capitalize' }}>{user.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.8125rem', height: '36px' }}
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>Log in</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

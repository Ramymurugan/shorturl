import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { User as UserIcon, Mail, Lock, AlertCircle, CheckCircle2, Link2, Eye, EyeOff } from 'lucide-react';
import '../../assets/styles/auth.css';
import './Register.css';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requestAdmin, setRequestAdmin] = useState(false);
  const [err, setErr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const role = requestAdmin ? 'admin' : 'user';
      const data = await register(name, email, password, role);

      if (role === 'admin' && data.user && data.user.adminRequestStatus === 'pending') {
        navigate('/login', {
          state: {
            successMessage: 'Account registered successfully! Your administrator request is pending approval. Please sign in.'
          }
        });
      } else {
        navigate('/login', {
          state: {
            successMessage: 'Account registered successfully! Please sign in.'
          }
        });
      }
    } catch (error) {
      setErr(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card animate-fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)'
            }}>
              <Link2 color="#ffffff" size={18} />
            </div>
            <span className="register-header-glow">Smart<span className="text-gradient">Link</span></span>
          </div>
          <p className="auth-subtitle">Create an account to start shortening URLs</p>
        </div>

        {err && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{err}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-success" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontWeight: '600' }}>Admin Request Queued</span>
            </div>
            <p style={{ margin: '0', fontSize: '0.75rem', lineHeight: '1.4' }}>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={16} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="name"
                type="text"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-checkbox-group">
            <input
              id="requestAdmin"
              type="checkbox"
              className="auth-checkbox"
              checked={requestAdmin}
              onChange={(e) => setRequestAdmin(e.target.checked)}
            />
            <label htmlFor="requestAdmin" className="form-label" style={{ cursor: 'pointer', userSelect: 'none', margin: '0' }}>
              Register as Administrator
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '12px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

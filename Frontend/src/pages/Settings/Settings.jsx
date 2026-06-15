import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import {
  User as UserIcon,
  Shield,
  ShieldAlert,
  Mail,
  AlertCircle,
  CheckCircle2,
  Lock,
  Bell,
  Sliders,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';
import './Settings.css';

export const Settings = () => {
  const { user, reloadUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [timeZone, setTimeZone] = useState('(GMT+05:30) India Standard Time');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Notification Settings state
  const [emailAlerts, setEmailAlerts] = useState(() => {
    const saved = localStorage.getItem('pref_email_alerts');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [weeklyDigest, setWeeklyDigest] = useState(() => {
    const saved = localStorage.getItem('pref_weekly_digest');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [securityAlerts, setSecurityAlerts] = useState(() => {
    const saved = localStorage.getItem('pref_security_alerts');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Preferences state
  const [autoCopy, setAutoCopy] = useState(() => {
    const saved = localStorage.getItem('pref_auto_copy');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [expiryTerm, setExpiryTerm] = useState(() => {
    return localStorage.getItem('pref_expiry_term') || 'never';
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulate save or handle it in client
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErr(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccess('');

    if (newPassword.length < 6) {
      setErr('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr('New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErr(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setLoading(true);

    try {
      localStorage.setItem('pref_email_alerts', JSON.stringify(emailAlerts));
      localStorage.setItem('pref_weekly_digest', JSON.stringify(weeklyDigest));
      localStorage.setItem('pref_security_alerts', JSON.stringify(securityAlerts));
      setSuccess('Notification settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErr('Failed to save notification settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setLoading(true);

    try {
      localStorage.setItem('pref_auto_copy', JSON.stringify(autoCopy));
      localStorage.setItem('pref_expiry_term', expiryTerm);
      setSuccess('Preferences saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErr('Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  const getSubLinkStyle = (tabId) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    color: activeSubTab === tabId ? '#ffffff' : '#9ca3af',
    background: activeSubTab === tabId ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    borderLeft: activeSubTab === tabId ? '3px solid #6366f1' : '3px solid transparent',
    transition: 'all 0.2s',
    marginBottom: '4px'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Settings</h2>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Manage your account and preferences.</p>
      </div>

      {/* Screen 9: 2-Column Settings Layout */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 3fr', alignItems: 'flex-start' }}>
        {/* Left Subtabs */}
        <div className="glass-card" style={{ padding: '16px 12px' }}>
          <button onClick={() => setActiveSubTab('profile')} style={getSubLinkStyle('profile')}>
            <UserIcon size={16} />
            <span>Profile Settings</span>
          </button>
          <button onClick={() => setActiveSubTab('password')} style={getSubLinkStyle('password')}>
            <Lock size={16} />
            <span>Change Password</span>
          </button>
          <button onClick={() => setActiveSubTab('notifications')} style={getSubLinkStyle('notifications')}>
            <Bell size={16} />
            <span>Notification Settings</span>
          </button>
          <button onClick={() => setActiveSubTab('preferences')} style={getSubLinkStyle('preferences')}>
            <Sliders size={16} />
            <span>Preferences</span>
          </button>
        </div>

        {/* Right Form Card */}
        {activeSubTab === 'profile' && (
          <div className="glass-card animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Form Column */}
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Profile Settings</h3>
                <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Update your profile information.</p>
              </div>

              {success && (
                <div className="auth-success" style={{ margin: '0 0 20px 0' }}>
                  <CheckCircle2 size={16} />
                  <span>{success}</span>
                </div>
              )}

              {err && (
                <div className="auth-error" style={{ margin: '0 0 20px 0' }}>
                  <AlertCircle size={16} />
                  <span>{err}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ margin: '0' }}>
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: '0' }}>
                  <label className="form-label" htmlFor="emailAddress">Email Address</label>
                  <input
                    id="emailAddress"
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: '0' }}>
                  <label className="form-label" htmlFor="timeZone">Time Zone</label>
                  <select
                    id="timeZone"
                    className="form-select"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                  >
                    <option value="(GMT+05:30) India Standard Time">(GMT+05:30) India Standard Time</option>
                    <option value="(GMT+00:00) Greenwich Mean Time">(GMT+00:00) UTC / GMT</option>
                    <option value="(GMT-05:00) Eastern Standard Time">(GMT-05:00) Eastern Time</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: '0' }}>
                  <label className="form-label" htmlFor="language">Language</label>
                  <select
                    id="language"
                    className="form-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '10px 24px', fontWeight: '600' }}
                  disabled={loading}
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Profile Photo Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '32px' }}>
              <span style={{ fontSize: '0.8125rem', color: '#9ca3af', fontWeight: '500' }}>Profile Picture</span>
              
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#6366f1',
                  border: 'none',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                  Update Photo
                </button>
                <p style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: '8px', lineHeight: '1.4' }}>
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'password' && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px 32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Change Password</h3>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Ensure your account is using a long, random password to stay secure.</p>
            </div>

            {success && (
              <div className="auth-success" style={{ margin: '0 0 20px 0' }}>
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {err && (
              <div className="auth-error" style={{ margin: '0 0 20px 0' }}>
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
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
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
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
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
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
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', padding: '10px 24px', fontWeight: '600', marginTop: '8px' }}
                disabled={loading}
              >
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeSubTab === 'notifications' && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px 32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Notification Settings</h3>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Configure when and how you want to be notified.</p>
            </div>

            {success && (
              <div className="auth-success" style={{ margin: '0 0 20px 0' }}>
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {err && (
              <div className="auth-error" style={{ margin: '0 0 20px 0' }}>
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    style={{ marginTop: '4px', cursor: 'pointer', accentColor: '#6366f1' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#ffffff' }}>Email Alerts</span>
                    <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '2px' }}>Receive an email notification instantly whenever one of your short links is clicked.</p>
                  </div>
                </label>

                <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    style={{ marginTop: '4px', cursor: 'pointer', accentColor: '#6366f1' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#ffffff' }}>Weekly Analytics Digest</span>
                    <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '2px' }}>Get a weekly summary report of your link performance metrics straight to your inbox.</p>
                  </div>
                </label>

                <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={securityAlerts}
                    onChange={(e) => setSecurityAlerts(e.target.checked)}
                    style={{ marginTop: '4px', cursor: 'pointer', accentColor: '#6366f1' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#ffffff' }}>Security Notifications</span>
                    <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '2px' }}>Receive alerts for account activity, including new logins and administrator status updates.</p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', padding: '10px 24px', fontWeight: '600', marginTop: '8px' }}
                disabled={loading}
              >
                Save Preferences
              </button>
            </form>
          </div>
        )}

        {activeSubTab === 'preferences' && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px 32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Preferences</h3>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Customize your default shortener parameters and experience.</p>
            </div>

            {success && (
              <div className="auth-success" style={{ margin: '0 0 20px 0' }}>
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {err && (
              <div className="auth-error" style={{ margin: '0 0 20px 0' }}>
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px' }}>
              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label" htmlFor="expiryTerm">Default Link Expiration</label>
                <select
                  id="expiryTerm"
                  className="form-select"
                  value={expiryTerm}
                  onChange={(e) => setExpiryTerm(e.target.value)}
                >
                  <option value="never">Never Expire</option>
                  <option value="1day">1 Day</option>
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                </select>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>This sets the pre-selected duration value in your link creation form.</p>
              </div>

              <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start', marginTop: '8px' }}>
                <input
                  type="checkbox"
                  checked={autoCopy}
                  onChange={(e) => setAutoCopy(e.target.checked)}
                  style={{ marginTop: '4px', cursor: 'pointer', accentColor: '#6366f1' }}
                />
                <div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#ffffff' }}>Auto-Copy to Clipboard</span>
                  <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '2px' }}>Automatically copy short URLs to your clipboard as soon as they are successfully generated.</p>
                </div>
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', padding: '10px 24px', fontWeight: '600', marginTop: '8px' }}
                disabled={loading}
              >
                Save Preferences
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

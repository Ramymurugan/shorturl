import React, { useState, useEffect } from 'react';
import urlService from '../../services/urlService';
import URLCard from '../../components/URLCard';
import QRCodeCard from '../../components/QRCodeCard';
import Loader from '../../components/Loader';
import { Link2, AlertCircle, RefreshCw } from 'lucide-react';
import './MyLinks.css';

export const MyLinks = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [activeQrUrl, setActiveQrUrl] = useState(null);

  const fetchUrls = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await urlService.getMyUrls();
      setUrls(data);
    } catch (error) {
      setErr(error.message || 'Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shortened URL? This action cannot be undone.')) {
      return;
    }
    
    try {
      await urlService.deleteUrl(id);
      setUrls(urls.filter(u => u.id !== id));
    } catch (error) {
      alert(error.message || 'Failed to delete URL');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>My Shortened Links</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Manage, share, and track all your active short redirects.</p>
        </div>
        <button onClick={fetchUrls} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8125rem', height: '36px' }} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin-slow' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {err && (
        <div className="auth-error" style={{ margin: '0' }}>
          <AlertCircle size={16} />
          <span>{err}</span>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : urls.length > 0 ? (
        <div className="links-grid animate-fade-in">
          {urls.map(url => (
            <URLCard
              key={url.id}
              url={url}
              onDelete={handleDelete}
              onShowQr={(u) => setActiveQrUrl(u)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', gap: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Link2 size={30} color="#6b7280" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>No shortened links found</h4>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', maxWidth: '360px' }}>Shorten your first destination address on the dashboard to see it listed here.</p>
          </div>
        </div>
      )}

      {/* QR Code Modal Display */}
      {activeQrUrl && (
        <QRCodeCard
          url={activeQrUrl}
          onClose={() => setActiveQrUrl(null)}
        />
      )}
    </div>
  );
};

export default MyLinks;

import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import urlService from '../../services/urlService';
import Loader from '../../components/Loader';
import QRCodeCard from '../../components/QRCodeCard';
import { ExternalLink, Link2, Calendar, ArrowLeft, Trash2, Copy, Check, QrCode, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { copyToClipboard } from '../../utils/copyToClipboard';

export const URLs = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [activeQrUrl, setActiveQrUrl] = useState(null);

  const fetchUrls = async () => {
    try {
      const data = await adminService.getUrls();
      setUrls(data);
    } catch (error) {
      setErr(error.message || 'Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await urlService.deleteUrl(id);
      setUrls(urls.filter(u => u._id !== id));
    } catch (error) {
      alert(error.message || 'Failed to delete URL');
    }
  };

  const handleCopyLink = async (id, linkText) => {
    const success = await copyToClipboard(linkText);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/admin" className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>URLs Management</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>View and manage all shortened links active on the platform.</p>
        </div>
      </div>

      {err ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#f43f5e' }}>{err}</div>
      ) : (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <th style={{ padding: '16px' }}>User Name</th>
                  <th style={{ padding: '16px' }}>Original URL</th>
                  <th style={{ padding: '16px' }}>Short URL</th>
                  <th style={{ padding: '16px' }}>Clicks</th>
                  <th style={{ padding: '16px' }}>Created Date</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.length > 0 ? (
                  urls.map((u) => {
                    const shortUrl = u.shortUrl || `${import.meta.env.VITE_BASE_URL}/${u.shortCode}`;
                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px', fontWeight: '600', color: '#ffffff' }}>
                          {u.owner ? u.owner.name : <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Anonymous</span>}
                        </td>
                        <td style={{ padding: '16px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <a href={u.originalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span>{u.originalUrl}</span>
                          </a>
                        </td>
                        <td style={{ padding: '16px', color: '#6366f1', fontWeight: '600' }}>
                          <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>
                            /{u.shortCode}
                          </a>
                        </td>
                        <td style={{ padding: '16px', fontWeight: '700', color: '#10b981' }}>{u.clicks}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#6b7280" />
                            <span>{formatDate(u.createdAt).split(',')[0]}</span>
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleCopyLink(u._id, shortUrl)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 8px', height: '30px' }}
                            >
                              {copiedId === u._id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            </button>
                            <a
                              href={shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary"
                              style={{ padding: '6px 8px', height: '30px', display: 'inline-flex', alignItems: 'center' }}
                            >
                              <ExternalLink size={14} />
                            </a>
                            <button
                              onClick={() => setActiveQrUrl(u)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 8px', height: '30px' }}
                            >
                              <QrCode size={14} />
                            </button>
                            <Link
                              to={`/analytics/${u._id}`}
                              className="btn btn-secondary"
                              style={{ padding: '6px 8px', height: '30px', display: 'inline-flex', alignItems: 'center' }}
                            >
                              <BarChart2 size={14} color="#a855f7" />
                            </Link>
                            <button
                              onClick={() => handleDelete(u._id)}
                              className="btn btn-danger"
                              style={{ padding: '6px 8px', height: '30px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                      No shortened links found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Code Modal Display */}
      {activeQrUrl && (
        <QRCodeCard
          url={{
            shortCode: activeQrUrl.shortCode,
            shortUrl: activeQrUrl.shortUrl || `${import.meta.env.VITE_BASE_URL}/${activeQrUrl.shortCode}`,
            qrCode: activeQrUrl.qrCode
          }}
          onClose={() => setActiveQrUrl(null)}
        />
      )}
    </div>
  );
};

export default URLs;

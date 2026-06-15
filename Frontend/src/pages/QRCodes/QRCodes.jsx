import React, { useState, useEffect } from 'react';
import urlService from '../../services/urlService';
import Loader from '../../components/Loader';
import QRCodeCard from '../../components/QRCodeCard';
import { QrCode, Download, Eye, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import './QRCodes.css';

export const QRCodes = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [activeQrUrl, setActiveQrUrl] = useState(null);

  const fetchUrls = async () => {
    try {
      const data = await urlService.getMyUrls();
      setUrls(data);
    } catch (error) {
      setErr(error.message || 'Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const downloadQR = (url) => {
    const link = document.createElement('a');
    link.href = url.qrCode;
    link.download = `qrcode_${url.shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shortened URL and its QR Code?')) return;
    try {
      await urlService.deleteUrl(id);
      setUrls(urls.filter(u => u.id !== id));
    } catch (error) {
      alert(error.message || 'Failed to delete URL');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>QR Codes</h2>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Manage and download QR codes for your shortened links.</p>
      </div>

      {err && (
        <div className="auth-error" style={{ margin: '0' }}>
          <AlertCircle size={16} />
          <span>{err}</span>
        </div>
      )}

      {urls.length > 0 ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* QR Code Cards Grid */}
          <div className="qr-grid">
            {urls.map(url => (
              <div key={url.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px', gap: '12px' }}>
                <div className="qr-box-white">
                  <img src={url.qrCode} alt="QR" style={{ width: '120px', height: '120px', display: 'block' }} />
                </div>
                <div style={{ width: '100%' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    /{url.shortCode}
                  </h4>
                  <span style={{ fontSize: '0.6875rem', color: '#6b7280', display: 'block', marginTop: '2px' }}>
                    Created: {formatDate(url.createdAt).split(',')[0]}
                  </span>
                </div>
                <button
                  onClick={() => downloadQR(url)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '6px 12px', fontSize: '0.75rem', gap: '6px' }}
                >
                  <Download size={12} />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>

          {/* Bottom List of QR Codes */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>All QR Codes</h3>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Tabular metadata index of your generated codes.</p>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <th style={{ padding: '16px' }}>Short Link</th>
                    <th style={{ padding: '16px' }}>Created Date</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px', color: '#6366f1', fontWeight: '600' }}>{u.shortUrl}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#6b7280" />
                          <span>{formatDate(u.createdAt)}</span>
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setActiveQrUrl(u)}
                            className="btn btn-secondary"
                            title="View Large"
                            style={{ padding: '6px 8px', height: '30px' }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => downloadQR(u)}
                            className="btn btn-secondary"
                            title="Download PNG"
                            style={{ padding: '6px 8px', height: '30px' }}
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="btn btn-danger"
                            title="Delete"
                            style={{ padding: '6px 8px', height: '30px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={30} color="#6b7280" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>No QR codes found</h4>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', maxWidth: '360px' }}>Shortened links will automatically generate QR codes and list them here.</p>
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

export default QRCodes;

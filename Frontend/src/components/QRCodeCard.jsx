import React from 'react';
import { Download, X } from 'lucide-react';

export const QRCodeCard = ({ url, onClose }) => {
  if (!url || !url.qrCode) return null;

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = url.qrCode;
    link.download = `qrcode_${url.shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(5, 8, 16, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '90%',
        maxWidth: '380px',
        padding: '32px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 0 50px rgba(0, 0, 0, 0.8), var(--shadow-glow)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>QR Code</h3>
        <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '24px' }}>Scan this code to go to the shortened link directly.</p>

        <div style={{
          background: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          display: 'inline-block',
          marginBottom: '24px',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
        }}>
          <img
            src={url.qrCode}
            alt={`QR Code for ${url.shortCode}`}
            style={{ width: '200px', height: '200px', display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={downloadQR} className="btn btn-primary" style={{ width: '100%' }}>
            <Download size={16} />
            <span>Download QR Code</span>
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeCard;

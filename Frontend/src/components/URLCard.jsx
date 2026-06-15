import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, BarChart2, QrCode, Trash2, Calendar, ExternalLink } from 'lucide-react';
import { copyToClipboard } from '../utils/copyToClipboard';
import { formatDate } from '../utils/formatDate';

export const URLCard = ({ url, onDelete, onShowQr }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(url.shortUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ overflow: 'hidden', flex: '1' }}>
          <h4 style={{
            fontSize: '0.875rem',
            color: '#9ca3af',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '4px'
          }}>
            Original Target
          </h4>
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#ffffff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{url.originalUrl}</span>
            <ExternalLink size={14} color="#3b82f6" style={{ flexShrink: 0 }} />
          </a>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Clicks</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{url.clicks}</span>
        </div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <a
          href={url.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.9375rem',
            fontWeight: '600',
            color: '#3b82f6',
            textDecoration: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {url.shortUrl}
        </a>
        <button
          onClick={handleCopy}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', height: '32px', minWidth: '85px', fontSize: '0.75rem', gap: '4px', flexShrink: 0 }}
        >
          {copied ? (
            <>
              <Check size={14} color="#10b981" />
              <span style={{ color: '#10b981' }}>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '16px',
        marginTop: '8px',
        fontSize: '0.8125rem',
        color: '#9ca3af'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
          <Calendar size={14} />
          <span>{formatDate(url.createdAt)}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {onShowQr && (
            <button
              onClick={() => onShowQr(url)}
              className="btn btn-secondary"
              title="Show QR Code"
              style={{ padding: '6px 10px', height: '32px' }}
            >
              <QrCode size={16} />
            </button>
          )}
          <Link
            to={`/analytics/${url.id}`}
            className="btn btn-secondary"
            title="View Analytics"
            style={{ padding: '6px 10px', height: '32px' }}
          >
            <BarChart2 size={16} color="#8b5cf6" />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(url.id)}
              className="btn btn-danger"
              title="Delete Link"
              style={{ padding: '6px 10px', height: '32px' }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLCard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import urlService from '../../services/urlService';
import URLCard from '../../components/URLCard';
import QRCodeCard from '../../components/QRCodeCard';
import Loader from '../../components/Loader';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { formatDate } from '../../utils/formatDate';
import {
  PlusCircle,
  Link2,
  AlertCircle,
  Sparkles,
  Layers,
  MousePointerClick,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  BarChart2,
  Trash2,
  Edit,
  Globe,
  X,
  Upload,
  FileText
} from 'lucide-react';
import './Dashboard.css';

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const urlIndex = headers.indexOf('originalUrl');
  const codeIndex = headers.indexOf('customCode');
  const expiryIndex = headers.indexOf('expiresAt');
  
  if (urlIndex === -1) {
    throw new Error('CSV must contain an "originalUrl" header column.');
  }
  
  const urls = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const row = [];
    let insideQuote = false;
    let currentVal = '';
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(currentVal.trim().replace(/^["']|["']$/g, ''));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    row.push(currentVal.trim().replace(/^["']|["']$/g, ''));
    
    if (row[urlIndex]) {
      urls.push({
        originalUrl: row[urlIndex],
        customCode: (codeIndex !== -1 && row[codeIndex]) ? row[codeIndex] : undefined,
        expiresAt: (expiryIndex !== -1 && row[expiryIndex]) ? row[expiryIndex] : undefined
      });
    }
  }
  return urls;
};

export const Dashboard = () => {
  const { user } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [err, setErr] = useState('');
  const [urls, setUrls] = useState([]);
  const [createdUrl, setCreatedUrl] = useState(null);
  const [activeQrUrl, setActiveQrUrl] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [bannerCopied, setBannerCopied] = useState(false);

  // States for Edit URL
  const [editingUrl, setEditingUrl] = useState(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // States for Copy Stats
  const [copiedStatsId, setCopiedStatsId] = useState(null);
  const [bannerStatsCopied, setBannerStatsCopied] = useState(false);

  // States for Bulk Shorten
  const [shortenMode, setShortenMode] = useState('single'); // 'single' or 'bulk'
  const [csvFile, setCsvFile] = useState(null);
  const [parsedUrls, setParsedUrls] = useState([]);
  const [bulkReport, setBulkReport] = useState(null);

  const fetchUrls = async () => {
    try {
      const data = await urlService.getMyUrls();
      setUrls(data);
    } catch (error) {
      console.error('Failed to load links:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    setErr('');
    setCreatedUrl(null);
    setLoading(true);

    try {
      const url = await urlService.shorten(originalUrl, customCode, expiryDate);
      setCreatedUrl(url);
      setUrls([url, ...urls]); // Prepend to list
      setOriginalUrl('');
      setCustomCode('');
      setExpiryDate('');
    } catch (error) {
      setErr(error.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shortened URL?')) return;
    try {
      await urlService.deleteUrl(id);
      setUrls(urls.filter(u => u.id !== id));
      if (createdUrl && createdUrl.id === id) setCreatedUrl(null);
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

  const handleCopyBannerLink = async (linkText) => {
    const success = await copyToClipboard(linkText);
    if (success) {
      setBannerCopied(true);
      setTimeout(() => setBannerCopied(false), 2000);
    }
  };

  const handleCopyStatsLink = async (id, shortCode) => {
    const statsUrl = `${window.location.origin}/stats/${shortCode}`;
    const success = await copyToClipboard(statsUrl);
    if (success) {
      setCopiedStatsId(id);
      setTimeout(() => setCopiedStatsId(null), 2000);
    }
  };

  const handleCopyBannerStatsLink = async (shortCode) => {
    const statsUrl = `${window.location.origin}/stats/${shortCode}`;
    const success = await copyToClipboard(statsUrl);
    if (success) {
      setBannerStatsCopied(true);
      setTimeout(() => setBannerStatsCopied(false), 2000);
    }
  };

  const handleEditClick = (url) => {
    setEditingUrl(url);
    setEditOriginalUrl(url.originalUrl);
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const updatedUrl = await urlService.updateUrl(editingUrl.id, editOriginalUrl);
      // Update local state lists
      setUrls(urls.map(u => u.id === editingUrl.id ? { ...u, originalUrl: updatedUrl.originalUrl, qrCode: updatedUrl.qrCode } : u));
      if (createdUrl && createdUrl.id === editingUrl.id) {
        setCreatedUrl({ ...createdUrl, originalUrl: updatedUrl.originalUrl, qrCode: updatedUrl.qrCode });
      }
      setEditingUrl(null);
    } catch (error) {
      setEditError(error.message || 'Failed to update URL');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);
    setErr('');
    setBulkReport(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const urls = parseCSV(text);
        setParsedUrls(urls);
      } catch (error) {
        setErr(error.message || 'Failed to parse CSV file');
        setCsvFile(null);
        setParsedUrls([]);
      }
    };
    reader.readAsText(file);
  };

  const handleCsvDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setErr('Please upload a valid CSV file.');
      return;
    }
    setCsvFile(file);
    setErr('');
    setBulkReport(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const urls = parseCSV(text);
        setParsedUrls(urls);
      } catch (error) {
        setErr(error.message || 'Failed to parse CSV file');
        setCsvFile(null);
        setParsedUrls([]);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkShorten = async (e) => {
    e.preventDefault();
    if (parsedUrls.length === 0) return;
    
    setErr('');
    setLoading(true);
    setBulkReport(null);

    try {
      const results = await urlService.bulkShorten(parsedUrls);
      
      const successfulUrls = results.filter(r => r.success).map(r => r.url);
      const failedCount = results.filter(r => !r.success).length;
      const successCount = successfulUrls.length;

      setBulkReport({
        results,
        successCount,
        failureCount: failedCount
      });

      // Update links list in UI
      setUrls([...successfulUrls, ...urls]);
      
      // Reset file upload state
      setCsvFile(null);
      setParsedUrls([]);
    } catch (error) {
      setErr(error.message || 'Failed to shorten URLs in bulk');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,originalUrl,customCode,expiresAt\nhttps://example.com/one,alias-one,2026-12-31\nhttps://example.com/two,,";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bulk_shorten_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute stats
  const totalUrlsCreated = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);
  const activeRedirects = urls.filter(u => u.isActive).length;
  const todayClicks = urls.reduce((sum, u) => sum + (u.todayClicks || 0), 0);

  if (fetching) return <Loader fullPage />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>
            Welcome Back, {user?.name} 👋
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Here's what's happening with your links today.</p>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in">
          <div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Total Links Created</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '4px' }}>{totalUrlsCreated}</h3>
          </div>
          <div className="stat-card-icon">
            <Layers size={20} color="#6366f1" />
          </div>
        </div>

        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Total Clicks</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '4px' }}>{totalClicks.toLocaleString()}</h3>
          </div>
          <div className="stat-card-icon" style={{ background: 'rgba(168, 85, 247, 0.08)', borderColor: 'rgba(168, 85, 247, 0.15)' }}>
            <MousePointerClick size={20} color="#a855f7" />
          </div>
        </div>

        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Today's Clicks</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '4px' }}>{todayClicks}</h3>
            </div>
          </div>
          <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
            <Activity size={20} color="#10b981" />
          </div>
        </div>

        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Active Links</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '4px' }}>{activeRedirects}</h3>
          </div>
          <div className="stat-card-icon" style={{ background: 'rgba(6, 182, 212, 0.08)', borderColor: 'rgba(6, 182, 212, 0.15)' }}>
            <Activity size={20} color="#06b6d4" />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Shortener Box */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Create Short Link</h3>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Paste your destination URL or upload a batch of URLs.</p>
            </div>
            
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => { setShortenMode('single'); setErr(''); }}
                style={{
                  background: shortenMode === 'single' ? '#6366f1' : 'transparent',
                  color: shortenMode === 'single' ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  transition: 'all 0.2s'
                }}
              >
                Single Link
              </button>
              <button
                type="button"
                onClick={() => { setShortenMode('bulk'); setErr(''); }}
                style={{
                  background: shortenMode === 'bulk' ? '#6366f1' : 'transparent',
                  color: shortenMode === 'bulk' ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  transition: 'all 0.2s'
                }}
              >
                Bulk CSV
              </button>
            </div>
          </div>

          {err && (
            <div className="auth-error" style={{ margin: '0' }}>
              <AlertCircle size={16} />
              <span>{err}</span>
            </div>
          )}

          {shortenMode === 'single' ? (
            <form onSubmit={handleShorten} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label" htmlFor="originalUrl">Destination URL</label>
                <div style={{ position: 'relative' }}>
                  <Link2 size={16} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="originalUrl"
                    type="url"
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                    placeholder="https://example.com/very-long-url-path..."
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: '0' }}>
                  <label className="form-label" htmlFor="customCode">Custom Alias (Optional)</label>
                  <input
                    id="customCode"
                    type="text"
                    className="form-input"
                    placeholder="e.g. my-promo"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  />
                </div>

                <div className="form-group" style={{ margin: '0' }}>
                  <label className="form-label" htmlFor="expiryDate">Expiry Date (Optional)</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} color="#6b7280" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      id="expiryDate"
                      type="date"
                      className="form-input"
                      style={{ paddingRight: '44px' }}
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px', gap: '8px', fontSize: '0.9375rem', fontWeight: '600' }}
                disabled={loading}
              >
                <PlusCircle size={18} />
                <span>{loading ? 'Generating...' : 'Generate Link'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulkShorten} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  border: '2px dashed rgba(99, 102, 241, 0.25)',
                  borderRadius: '12px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(99, 102, 241, 0.02)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCsvDrop}
                onClick={() => document.getElementById('csvFileInput').click()}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)'}
              >
                <Upload size={32} color="#6366f1" style={{ marginBottom: '12px', opacity: 0.8 }} />
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                  {csvFile ? csvFile.name : 'Click or Drag CSV here'}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {csvFile ? `(${(csvFile.size / 1024).toFixed(2)} KB) - ${parsedUrls.length} links found` : 'Must contain a header row with an "originalUrl" column.'}
                </p>
                <input
                  id="csvFileInput"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.75rem', gap: '6px' }}
                >
                  Download CSV Template
                </button>
                
                {csvFile && (
                  <button
                    type="button"
                    onClick={() => { setCsvFile(null); setParsedUrls([]); setErr(''); }}
                    style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Remove File
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px', gap: '8px', fontSize: '0.9375rem', fontWeight: '600', marginTop: '8px' }}
                disabled={loading || parsedUrls.length === 0}
              >
                <PlusCircle size={18} />
                <span>{loading ? 'Processing Batch...' : `Shorten ${parsedUrls.length || ''} Links`}</span>
              </button>
            </form>
          )}
        </div>

        {/* Dynamic Success Banner Display (Screen 2 Layout!) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {bulkReport ? (
            <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Bulk Shortening Report</h4>
                <button
                  type="button"
                  onClick={() => setBulkReport(null)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  Clear Report
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ flex: '1', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Success</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', margin: '4px 0 0 0' }}>{bulkReport.successCount}</h3>
                </div>
                <div style={{ flex: '1', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Failed</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f43f5e', margin: '4px 0 0 0' }}>{bulkReport.failureCount}</h3>
                </div>
              </div>

              <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                {bulkReport.results.map((res, index) => (
                  <div key={index} style={{ padding: '10px', borderRadius: '8px', background: res.success ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)', border: res.success ? '1px solid rgba(16, 185, 129, 0.1)' : '1px solid rgba(244, 63, 94, 0.1)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                        {res.originalUrl}
                      </span>
                      <span className={`badge ${res.success ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '9px', padding: '1px 4px' }}>
                        {res.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    {res.success ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                        <a href={res.url.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>
                          /{res.url.shortCode}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(res.url.id, res.url.shortUrl)}
                          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                        >
                          {copiedId === res.url.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>{res.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : createdUrl ? (
            <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderColor: 'rgba(16, 185, 129, 0.3)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '10px', padding: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <Check size={16} />
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Short link created successfully!</span>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: '1', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Original URL</span>
                  <p style={{ fontSize: '0.875rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{createdUrl.originalUrl}</p>

                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginTop: '12px' }}>Short URL</span>
                  <a href={createdUrl.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9375rem', color: '#6366f1', fontWeight: '700', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                    {createdUrl.shortUrl}
                  </a>
                </div>

                <div style={{ background: '#ffffff', padding: '8px', borderRadius: '8px', flexShrink: '0', alignSelf: 'center' }}>
                  <img src={createdUrl.qrCode} alt="QR Code" style={{ width: '80px', height: '80px', display: 'block' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleCopyBannerLink(createdUrl.shortUrl)}
                  className="btn btn-primary"
                  style={{ flex: '1', minWidth: '80px', padding: '8px', fontSize: '0.8125rem' }}
                >
                  {bannerCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{bannerCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => handleCopyBannerStatsLink(createdUrl.shortCode)}
                  className="btn btn-secondary"
                  style={{ flex: '1', minWidth: '100px', padding: '8px', fontSize: '0.8125rem' }}
                >
                  {bannerStatsCopied ? <Check size={14} color="#10b981" /> : <Globe size={14} color="#6366f1" />}
                  <span>{bannerStatsCopied ? 'Copied Stats' : 'Copy Stats'}</span>
                </button>
                <a
                  href={createdUrl.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: '1', minWidth: '70px', padding: '8px', fontSize: '0.8125rem' }}
                >
                  <ExternalLink size={14} />
                  <span>Open</span>
                </a>
                <button
                  onClick={() => setActiveQrUrl(createdUrl)}
                  className="btn btn-secondary"
                  style={{ flex: '1', minWidth: '90px', padding: '8px', fontSize: '0.8125rem' }}
                >
                  <QrCode size={14} />
                  <span>QR Code</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#a855f7" />
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Custom Dashboard Branding</h4>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: '1.6' }}>
                Generate QR Codes instantly for target URLs. All visits are tracked and OS, device, browser, and referrer aggregates are computed dynamically.
              </p>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280' }}>Platform Integrity</span>
                <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>Status Operational</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen 1 Bottom: My Links Audit Table */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>My Links</h3>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Review and manage recent shortened redirects.</p>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <th style={{ padding: '16px' }}>Original URL</th>
                <th style={{ padding: '16px' }}>Short URL</th>
                <th style={{ padding: '16px' }}>Created Date</th>
                <th style={{ padding: '16px' }}>Total Clicks</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.length > 0 ? (
                urls.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={u.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>{u.originalUrl}</span>
                      </a>
                    </td>
                    <td style={{ padding: '16px', color: '#6366f1', fontWeight: '600' }}>
                      <a href={u.shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>
                        /{u.shortCode}
                      </a>
                    </td>
                    <td style={{ padding: '16px' }}>{formatDate(u.createdAt)}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#10b981' }}>{u.clicks}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleCopyLink(u.id, u.shortUrl)}
                          className="btn btn-secondary"
                          title="Copy Link"
                          style={{ padding: '6px 8px', height: '30px' }}
                        >
                          {copiedId === u.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopyStatsLink(u.id, u.shortCode)}
                          className="btn btn-secondary"
                          title="Copy Stats Link"
                          style={{ padding: '6px 8px', height: '30px' }}
                        >
                          {copiedStatsId === u.id ? <Check size={14} color="#10b981" /> : <Globe size={14} color="#6366f1" />}
                        </button>
                        <a
                          href={u.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          title="Open Link"
                          style={{ padding: '6px 8px', height: '30px', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => setActiveQrUrl(u)}
                          className="btn btn-secondary"
                          title="QR Code"
                          style={{ padding: '6px 8px', height: '30px' }}
                        >
                          <QrCode size={14} />
                        </button>
                        <button
                          onClick={() => handleEditClick(u)}
                          className="btn btn-secondary"
                          title="Edit Link"
                          style={{ padding: '6px 8px', height: '30px' }}
                        >
                          <Edit size={14} />
                        </button>
                        <Link
                          to={`/analytics/${u.id}`}
                          className="btn btn-secondary"
                          title="Analytics"
                          style={{ padding: '6px 8px', height: '30px', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <BarChart2 size={14} color="#a855f7" />
                        </Link>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="btn btn-danger"
                          title="Delete Link"
                          style={{ padding: '6px 8px', height: '30px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                    No shortened links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal Display */}
      {activeQrUrl && (
        <QRCodeCard
          url={activeQrUrl}
          onClose={() => setActiveQrUrl(null)}
        />
      )}

      {/* Edit URL Modal Display */}
      {editingUrl && (
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
            maxWidth: '480px',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 0 50px rgba(0, 0, 0, 0.8), var(--shadow-glow)'
          }}>
            <button
              onClick={() => setEditingUrl(null)}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Edit Destination URL</h3>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '24px' }}>
              Update the original redirect destination for short alias <strong style={{ color: '#6366f1' }}>/{editingUrl.shortCode}</strong>.
            </p>

            {editError && (
              <div className="auth-error" style={{ marginBottom: '16px' }}>
                <AlertCircle size={16} />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label" htmlFor="editOriginalUrl">Original URL</label>
                <div style={{ position: 'relative' }}>
                  <Link2 size={16} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="editOriginalUrl"
                    type="url"
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                    placeholder="https://example.com/very-long-url-path..."
                    value={editOriginalUrl}
                    onChange={(e) => setEditOriginalUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: '1', padding: '10px', fontWeight: '600' }}
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUrl(null)}
                  className="btn btn-secondary"
                  style={{ flex: '1', padding: '10px', fontWeight: '600' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

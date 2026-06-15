import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/Loader';
import { Check, X, ShieldAlert, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

export const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await adminService.getPendingRequests();
      setRequests(data);
    } catch (error) {
      setErr(error.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveRequest(id);
      setRequests(requests.filter(r => r._id !== id));
      alert('Request approved successfully! User promoted to administrator.');
    } catch (error) {
      alert(error.message || 'Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectRequest(id);
      setRequests(requests.filter(r => r._id !== id));
      alert('Request rejected successfully.');
    } catch (error) {
      alert(error.message || 'Failed to reject request');
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Administrator Requests</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Review pending promotion requests from regular users.</p>
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
                  <th style={{ padding: '16px' }}>Name</th>
                  <th style={{ padding: '16px' }}>Email</th>
                  <th style={{ padding: '16px' }}>Requested On</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((r) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px', fontWeight: '500' }}>{r.name}</td>
                      <td style={{ padding: '16px' }}>{r.email}</td>
                      <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} color="#6b7280" />
                        <span>{formatDate(r.updatedAt)}</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleApprove(r._id)}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#10b981', boxShadow: 'none' }}
                          >
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(r._id)}
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <ShieldAlert size={24} color="#6b7280" style={{ display: 'inline-block' }} />
                        <span>No pending promotion requests.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;

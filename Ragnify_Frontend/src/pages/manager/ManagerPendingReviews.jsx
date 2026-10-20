import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { useToast } from '../../context/ToastContext';
import { 
  FaClipboardCheck, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaClock, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaTimes, 
  FaCommentDots, 
  FaEye 
} from 'react-icons/fa';

const DEFAULT_REVIEWS_DATA = [
  {
    id: 'REV-101',
    assignee: 'Ananya Roy',
    type: 'Intern',
    item: 'Design System Implementation Pull Request #42',
    category: 'Code Deliverable',
    deadline: '2026-10-14',
    priority: 'HIGH',
    status: 'PENDING',
    submissionUrl: 'https://github.com/enterprise/ragnify-frontend/pull/42',
    notes: 'Responsive UI components for dark mode and intern clock-in buttons completed.',
    feedback: ''
  },
  {
    id: 'REV-102',
    assignee: 'Rohan Gupta',
    type: 'Intern',
    item: 'Groq Whisper Audio Transcription Benchmarking Docs',
    category: 'Research / AI',
    deadline: '2026-10-15',
    priority: 'HIGH',
    status: 'PENDING',
    submissionUrl: 'https://docs.enterprise.internal/ai/whisper-benchmarks',
    notes: 'Latency comparison tests between local Whisper and Groq Whisper cloud endpoint.',
    feedback: ''
  },
  {
    id: 'REV-103',
    assignee: 'Rahul Verma',
    type: 'Employee',
    item: 'ChromaDB Cosine Distance Vector Indexing Module',
    category: 'Architecture / Sprint',
    deadline: '2026-10-12',
    priority: 'HIGH',
    status: 'APPROVED',
    submissionUrl: 'https://github.com/enterprise/enterprise-backend/pull/88',
    notes: 'Indexing pipelines tested with 5,000 PDF documents with sub-second retrieval.',
    feedback: 'Excellent optimization on semantic chunking. Merged into staging branch.'
  },
  {
    id: 'REV-104',
    assignee: 'Neha Kapoor',
    type: 'Employee',
    item: 'Multi-Role Protected Routing & Session Guard',
    category: 'Security / Frontend',
    deadline: '2026-10-09',
    priority: 'MEDIUM',
    status: 'APPROVED',
    submissionUrl: 'https://github.com/enterprise/ragnify-frontend/pull/39',
    notes: 'Role access guards verified for HR, Manager, Employee, and Intern routes.',
    feedback: 'Approved and verified. Clean integration.'
  }
];

export function ManagerPendingReviews() {
  const { showToast } = useToast();
  
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('ragnify_manager_pending_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_REVIEWS_DATA;
  });

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'NEEDS_REVISION'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedReview, setSelectedReview] = useState(null); // For inspect/review modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');

  // New Review Form State
  const [newReview, setNewReview] = useState({
    assignee: '',
    type: 'Intern',
    item: '',
    category: 'Code Deliverable',
    deadline: new Date().toISOString().split('T')[0],
    priority: 'HIGH',
    submissionUrl: '',
    notes: ''
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ragnify_manager_pending_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Handle Approve
  const handleApprove = (id, feedback = '') => {
    setReviews(prev => prev.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        status: 'APPROVED',
        feedback: feedback || r.feedback || 'Approved and signed off by Manager Vikram Mehta.'
      };
    }));
    setSelectedReview(null);
    setFeedbackInput('');
    showToast('Deliverable approved & signed off successfully!', 'success');
  };

  // Handle Request Revision
  const handleRequestRevision = (id, feedback) => {
    if (!feedback || !feedback.trim()) {
      showToast('Please provide feedback explaining the revision needed.', 'error');
      return;
    }
    setReviews(prev => prev.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        status: 'NEEDS_REVISION',
        feedback: feedback.trim()
      };
    }));
    setSelectedReview(null);
    setFeedbackInput('');
    showToast('Revision requested. Notification dispatched to assignee.', 'warning');
  };

  // Delete review
  const handleDeleteReview = (id) => {
    if (!window.confirm('Are you sure you want to remove this review item?')) return;
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review item deleted.', 'info');
  };

  // Submit new review item
  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.assignee.trim() || !newReview.item.trim()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const created = {
      id: 'REV-' + String(Date.now()).slice(-3),
      assignee: newReview.assignee,
      type: newReview.type,
      item: newReview.item,
      category: newReview.category,
      deadline: newReview.deadline,
      priority: newReview.priority,
      status: 'PENDING',
      submissionUrl: newReview.submissionUrl || 'Internal Repository Submission',
      notes: newReview.notes || 'Awaiting initial managerial audit.',
      feedback: ''
    };

    setReviews(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewReview({
      assignee: '',
      type: 'Intern',
      item: '',
      category: 'Code Deliverable',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'HIGH',
      submissionUrl: '',
      notes: ''
    });
    showToast(`Created review record for ${created.assignee}!`, 'success');
  };

  // Metrics
  const pendingCount = reviews.filter(r => r.status === 'PENDING').length;
  const approvedCount = reviews.filter(r => r.status === 'APPROVED').length;
  const revisionCount = reviews.filter(r => r.status === 'NEEDS_REVISION').length;

  // Filtered reviews
  const filteredReviews = reviews.filter(r => {
    const matchesTab = activeTab === 'ALL' || r.status === activeTab;
    const matchesSearch = r.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <MainLayout title="Pending Reviews">
      <div className="fade-in">
        <PageHeader
          title="Deliverable & Performance Review Queue"
          subtitle="Audit team submissions, sign off on code deliverables, and provide structured feedback"
          actions={
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus size={12} /> Add Deliverable to Review
            </button>
          }
        />

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <FaClock size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting Manager Audit</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{pendingCount}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <FaCheckCircle size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approved & Signed Off</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{approvedCount}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <FaExclamationTriangle size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revisions Requested</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{revisionCount}</div>
            </div>
          </div>
        </div>

        {/* Tab Filter & Search */}
        <div className="card" style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'ALL', label: 'All Reviews' },
              { id: 'PENDING', label: 'Pending Only' },
              { id: 'APPROVED', label: 'Approved' },
              { id: 'NEEDS_REVISION', label: 'Needs Revision' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`btn-secondary ${activeTab === tab.id ? 'active' : ''}`}
                style={{
                  fontSize: '0.8125rem',
                  padding: '6px 14px',
                  backgroundColor: activeTab === tab.id ? 'var(--primary-color, #2563eb)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  borderColor: activeTab === tab.id ? 'var(--primary-color, #2563eb)' : 'var(--border-color)'
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search deliverable or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Reviews Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assignee & Cohort</th>
                  <th>Deliverable Title & Category</th>
                  <th>Target Deadline</th>
                  <th>Priority</th>
                  <th>Review Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No deliverable reviews match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{r.assignee}</div>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '1px 6px', 
                          borderRadius: '10px',
                          backgroundColor: r.type === 'Intern' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: r.type === 'Intern' ? '#60a5fa' : '#34d399',
                          fontWeight: '600'
                        }}>
                          {r.type}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{r.item}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.category} • {r.id}</div>
                        {r.feedback && (
                          <div className="text-xs" style={{ color: '#10b981', marginTop: '4px', fontStyle: 'italic' }}>
                            Feedback: "{r.feedback}"
                          </div>
                        )}
                      </td>

                      <td>{r.deadline}</td>

                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: r.priority === 'HIGH' ? '#ef4444' : '#f59e0b'
                        }}>
                          {r.priority}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={r.status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-action"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => {
                              setSelectedReview(r);
                              setFeedbackInput(r.feedback || '');
                            }}
                            title="Inspect submission and submit feedback"
                          >
                            <FaEye size={11} /> Review
                          </button>

                          {r.status === 'PENDING' && (
                            <button
                              className="btn-action"
                              style={{ 
                                color: 'var(--status-success)', 
                                backgroundColor: 'var(--status-success-subtle)', 
                                borderColor: 'var(--status-success-border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => handleApprove(r.id)}
                            >
                              <FaCheckCircle size={11} /> Quick Sign-Off
                            </button>
                          )}

                          <button
                            className="btn-action"
                            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            onClick={() => handleDeleteReview(r.id)}
                            title="Delete"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Detailed Review & Audit */}
        {selectedReview && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '580px', width: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  Deliverable Review Audit: {selectedReview.id}
                </h3>
                <button 
                  onClick={() => setSelectedReview(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedReview.item}</span>
                    <StatusBadge status={selectedReview.status} />
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Assignee: <strong>{selectedReview.assignee}</strong> ({selectedReview.type}) • Category: {selectedReview.category}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Submission Notes: {selectedReview.notes}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Submission Reference / Repository URL:
                  </label>
                  <div style={{ 
                    padding: '8px 12px', 
                    backgroundColor: 'rgba(255,255,255,0.05)', 
                    borderRadius: '6px', 
                    fontSize: '0.85rem',
                    color: '#60a5fa',
                    wordBreak: 'break-all'
                  }}>
                    {selectedReview.submissionUrl}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Manager Feedback & Review Notes:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter approval praise or specific changes required for revision..."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setSelectedReview(null)}
                  >
                    Close
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-action"
                      style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleRequestRevision(selectedReview.id, feedbackInput)}
                    >
                      <FaTimesCircle size={12} /> Request Changes
                    </button>

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ backgroundColor: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleApprove(selectedReview.id, feedbackInput)}
                    >
                      <FaCheckCircle size={12} /> Approve & Sign Off
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Deliverable */}
        {isAddModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Add Deliverable to Review Queue</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleAddReviewSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Assignee Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={newReview.assignee}
                      onChange={(e) => setNewReview({ ...newReview, assignee: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        Cohort
                      </label>
                      <select
                        value={newReview.type}
                        onChange={(e) => setNewReview({ ...newReview, type: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                      >
                        <option value="Intern" style={{ background: '#1e293b' }}>Intern</option>
                        <option value="Employee" style={{ background: '#1e293b' }}>Employee</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        Category
                      </label>
                      <select
                        value={newReview.category}
                        onChange={(e) => setNewReview({ ...newReview, category: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                      >
                        <option value="Code Deliverable" style={{ background: '#1e293b' }}>Code Deliverable</option>
                        <option value="Architecture / Sprint" style={{ background: '#1e293b' }}>Architecture / Sprint</option>
                        <option value="Research / AI" style={{ background: '#1e293b' }}>Research / AI</option>
                        <option value="Documentation" style={{ background: '#1e293b' }}>Documentation</option>
                        <option value="Attendance & Shift" style={{ background: '#1e293b' }}>Attendance & Shift</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Deliverable Item Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vector Store Retrieval Benchmarking PR #50"
                      value={newReview.item}
                      onChange={(e) => setNewReview({ ...newReview, item: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        Target Deadline
                      </label>
                      <input
                        type="date"
                        value={newReview.deadline}
                        onChange={(e) => setNewReview({ ...newReview, deadline: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        Priority
                      </label>
                      <select
                        value={newReview.priority}
                        onChange={(e) => setNewReview({ ...newReview, priority: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                      >
                        <option value="HIGH" style={{ background: '#1e293b' }}>HIGH</option>
                        <option value="MEDIUM" style={{ background: '#1e293b' }}>MEDIUM</option>
                        <option value="LOW" style={{ background: '#1e293b' }}>LOW</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Submission Link / PR Reference
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={newReview.submissionUrl}
                      onChange={(e) => setNewReview({ ...newReview, submissionUrl: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Add to Review Queue
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ManagerPendingReviews;

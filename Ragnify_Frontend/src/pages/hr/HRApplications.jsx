import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge, EmptyState } from '../../components/common/StatCard';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { onboardingService, offerLetterService } from '../../api/onboardingService';
import { useToast } from '../../context/ToastContext';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaRedo, 
  FaEye, 
  FaFileAlt, 
  FaTimes, 
  FaDownload, 
  FaUserTie, 
  FaUserGraduate, 
  FaUsers,
  FaFilePdf,
  FaCheck,
  FaFileSignature
} from 'react-icons/fa';

export function HRApplications() {
  const [applications, setApplications] = useState([]);
  const [typeSlicer, setTypeSlicer] = useState('ALL'); // 'ALL' | 'EMPLOYEE' | 'INTERN'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const { showToast } = useToast();
  useEffect(() => {
    onboardingService.getApplications().then(setApplications);
  }, []);

  const filtered = applications.filter(a => {
    // Role Type Slicer
    if (typeSlicer === 'EMPLOYEE' && a.type?.toLowerCase() !== 'employee') return false;
    if (typeSlicer === 'INTERN' && a.type?.toLowerCase() !== 'intern') return false;

    // Status Filter
    if (statusFilter !== 'ALL' && a.status.toUpperCase() !== statusFilter) return false;

    return true;
  });

  const employeeCount = applications.filter(a => a.type?.toLowerCase() === 'employee').length;
  const internCount = applications.filter(a => a.type?.toLowerCase() === 'intern').length;

  const handleUpdateStatus = async (status) => {
    if (!selectedApp) return;
    try {
      if (status === 'REJECTED') {
        const confirmed = window.confirm(
          `Are you sure you want to reject application ${selectedApp.id} (${selectedApp.applicantName})?\n\nThis application and all associated compliance documents will be automatically and permanently deleted from the system.`
        );
        if (!confirmed) return;

        await onboardingService.updateApplicationStatus(selectedApp.id, 'REJECTED', 'Rejected by HR Operations');
        setApplications(prev => prev.filter(a => a.id !== selectedApp.id));
        setSelectedApp(null);
        setIsModalOpen(false);
        showToast(`Application ${selectedApp.id} (${selectedApp.applicantName}) rejected and automatically deleted.`, 'info');
        return;
      }

      await onboardingService.updateApplicationStatus(selectedApp.id, status, 'Reviewed by HR Operations');
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status } : a));
      setSelectedApp(prev => ({ ...prev, status }));
      showToast(`Application ${selectedApp.id} status updated to ${status}`, 'success');
      setIsModalOpen(false);
    } catch (err) {
      showToast('Status update failed.', 'error');
    }
  };

  const handleDirectReject = async (app) => {
    if (!app) return;
    const confirmed = window.confirm(
      `Are you sure you want to reject application ${app.id} (${app.applicantName})?\n\nThis application and all associated compliance documents will be automatically and permanently deleted from the system.`
    );
    if (!confirmed) return;

    try {
      await onboardingService.updateApplicationStatus(app.id, 'REJECTED', 'Rejected by HR Operations');
      setApplications(prev => prev.filter(a => a.id !== app.id));
      if (selectedApp?.id === app.id) {
        setSelectedApp(null);
        setIsModalOpen(false);
      }
      showToast(`Application ${app.id} (${app.applicantName}) rejected and automatically deleted.`, 'info');
    } catch (err) {
      showToast('Failed to reject and delete application.', 'error');
    }
  };

  const handleViewDocument = (doc) => {
    const candidateId = selectedApp?.id || 'CAND-001';
    const fileName = doc.fileName || doc.filename || `${candidateId}_${doc.name}`;
    setPreviewDoc({
      ...doc,
      candidateId: candidateId,
      fileName: fileName,
      fileUrl: doc.fileUrl || `/documents/view/${fileName}`,
      candidateName: selectedApp?.applicantName,
      type: selectedApp?.type
    });
    showToast(`Opening original ${doc.label || doc.documentType} for ${selectedApp?.applicantName}...`, 'info');
  };

  const handleGenerateOfferLetter = async () => {
    if (!selectedApp) return;
    try {
      showToast(`Generating official offer letter PDF for ${selectedApp.applicantName}...`, 'info');
      const result = await offerLetterService.generateOfferLetter({
        candidateId: selectedApp.id,
        applicationId: selectedApp.id,
        candidateName: selectedApp.applicantName,
        candidateEmail: selectedApp.email,
        role: selectedApp.role,
        type: selectedApp.type,
        department: selectedApp.department || 'AI & Data Science',
        stipendSalary: selectedApp.type === 'Intern' ? '₹25,000 / mo' : '₹12,00,000 / yr',
        reportingManager: 'Dr. Rajesh Khanna, Head of AI'
      });
      showToast(`Offer letter successfully generated for ${selectedApp.applicantName}!`, 'success');
      setPreviewDoc({
        label: 'Employment Offer Letter',
        documentType: 'Official Offer Letter',
        fileName: result.file || `${selectedApp.id}_Offer_Letter.pdf`,
        fileUrl: result.fileUrl || `/static/documents/${result.file}`,
        candidateName: selectedApp.applicantName,
        type: selectedApp.type,
        status: 'ISSUED'
      });
    } catch (err) {
      showToast('Offer letter generation failed.', 'error');
    }
  };

  return (
    <MainLayout title="Applications">
      <div className="fade-in">
        <PageHeader
          title="Onboarding Candidate Applications"
          subtitle="Review candidate submissions, inspect verified compliance documents, and approve workforce induction"
        />

        {/* TOP CANDIDATE TYPE SLICER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Slicer Tabs */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)'
          }}>
            <button
              onClick={() => setTypeSlicer('ALL')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'ALL' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <FaUsers size={13} />
              All Applications ({applications.length})
            </button>

            <button
              onClick={() => setTypeSlicer('EMPLOYEE')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'EMPLOYEE' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'EMPLOYEE' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <FaUserTie size={13} />
              Employee Applications ({employeeCount})
            </button>

            <button
              onClick={() => setTypeSlicer('INTERN')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'INTERN' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'INTERN' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <FaUserGraduate size={13} />
              Intern Applications ({internCount})
            </button>
          </div>

          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: '1px solid',
                  cursor: 'pointer',
                  backgroundColor: statusFilter === tab ? 'var(--brand-primary-subtle)' : 'var(--bg-surface)',
                  color: statusFilter === tab ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderColor: statusFilter === tab ? 'var(--brand-primary)' : 'var(--border-default)',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Type</th>
                  <th>Applied Role</th>
                  <th>Education / Experience</th>
                  <th>Applied Date</th>
                  <th>Resume Match Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '32px' }}>
                      {statusFilter === 'REJECTED' ? (
                        <EmptyState
                          title="No Rejected Applications"
                          message="Policy in effect: Rejected applications and compliance documents are automatically and permanently deleted upon rejection."
                        />
                      ) : (
                        <EmptyState
                          title="No applications match this filter"
                          message="Adjust the employee/intern slicer or status filter to view candidates."
                        />
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{app.applicantName}</div>
                        <div className="text-xs">{app.email} • {app.phone}</div>
                      </td>
                      <td>
                        <span className={`badge ${app.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                          {app.type}
                        </span>
                      </td>
                      <td><strong>{app.role}</strong></td>
                      <td>{app.college ? `${app.college} (${app.cgpa || app.degree})` : app.experienceYears}</td>
                      <td>{app.appliedDate}</td>
                      <td>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 9px',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: '800',
                            backgroundColor: (app.resumeScore || 0) >= 70 ? 'rgba(16, 185, 129, 0.12)' : (app.resumeScore || 0) >= 50 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: (app.resumeScore || 0) >= 70 ? '#10b981' : (app.resumeScore || 0) >= 50 ? '#d97706' : '#ef4444',
                            border: `1px solid ${(app.resumeScore || 0) >= 70 ? 'rgba(16, 185, 129, 0.3)' : (app.resumeScore || 0) >= 50 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                          }}>
                            <span>{app.resumeScore != null ? app.resumeScore : 0}%</span>
                            <span style={{ fontSize: '0.66rem', fontWeight: '600', opacity: 0.85 }}>
                              ({(app.matchedKeywords && app.matchedKeywords.length) || 0}/{(app.departmentKeywords && app.departmentKeywords.length) || 6})
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: '600',
                            color: (app.resumeScore || 0) >= 70 ? '#059669' : (app.resumeScore || 0) >= 50 ? '#d97706' : '#ef4444',
                            paddingLeft: '4px'
                          }}>
                            {(app.resumeScore || 0) >= 70 ? '✓ High Match' : (app.resumeScore || 0) >= 50 ? '⚡ Moderate' : '⚠️ Low Match'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            className="btn-action"
                            onClick={() => {
                              setSelectedApp(app);
                              setIsModalOpen(true);
                            }}
                          >
                            <FaEye size={11} /> Review
                          </button>
                          <button
                            className="btn-action"
                            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            onClick={() => handleDirectReject(app)}
                            title="Reject & Auto-Delete Application"
                          >
                            <FaTimesCircle size={11} /> Reject
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

        {/* APPLICATION REVIEW MODAL WITH VERIFIED DOCUMENTS LIST */}
        {isModalOpen && selectedApp && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-card" style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Reviewing {selectedApp.applicantName}</h3>
                    <span className={`badge ${selectedApp.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                      {selectedApp.type}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Application ID: {selectedApp.id} • Role: {selectedApp.role} • Dept: {selectedApp.department}
                  </span>
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="modal-body">
                {/* Candidate Overview Card */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px', padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Email</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{selectedApp.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Phone</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{selectedApp.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Current Status</div>
                    <div style={{ marginTop: '2px' }}><StatusBadge status={selectedApp.status} /></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Institution / College</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{selectedApp.college || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Applied Date</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{selectedApp.appliedDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Department</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{selectedApp.department}</div>
                  </div>
                </div>

                {/* RESUME ATS KEYWORD SCAN & MATCHING SCORE CARD */}
                <div style={{
                  marginBottom: '20px',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: (selectedApp.resumeScore || 0) >= 70 ? 'rgba(16, 185, 129, 0.05)' : (selectedApp.resumeScore || 0) >= 50 ? 'rgba(245, 158, 11, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  border: `1.5px solid ${(selectedApp.resumeScore || 0) >= 70 ? 'rgba(16, 185, 129, 0.35)' : (selectedApp.resumeScore || 0) >= 50 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`
                }}>
                  {/* Header with Circular Score and Recommendation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: (selectedApp.resumeScore || 0) >= 70 ? '#10b981' : (selectedApp.resumeScore || 0) >= 50 ? '#d97706' : '#ef4444',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '1.05rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {selectedApp.resumeScore || 0}%
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                          Resume ATS Keyword Match Score: {selectedApp.resumeScore || 0}%
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Department Competencies: <strong>{selectedApp.scannedDepartment || selectedApp.department}</strong> ({selectedApp.matchedKeywords?.length || 0} of {selectedApp.departmentKeywords?.length || 6} core keywords matched)
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: (selectedApp.resumeScore || 0) >= 70 ? 'rgba(16, 185, 129, 0.15)' : (selectedApp.resumeScore || 0) >= 50 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: (selectedApp.resumeScore || 0) >= 70 ? '#10b981' : (selectedApp.resumeScore || 0) >= 50 ? '#d97706' : '#ef4444',
                      border: `1px solid ${(selectedApp.resumeScore || 0) >= 70 ? 'rgba(16, 185, 129, 0.3)' : (selectedApp.resumeScore || 0) >= 50 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {(selectedApp.resumeScore || 0) >= 70 ? '✓ High Match' : (selectedApp.resumeScore || 0) >= 50 ? '⚡ Moderate Match' : '⚠️ Low Match'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--border-default)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '14px'
                  }}>
                    <div style={{
                      width: `${selectedApp.resumeScore || 0}%`,
                      height: '100%',
                      backgroundColor: (selectedApp.resumeScore || 0) >= 70 ? '#10b981' : (selectedApp.resumeScore || 0) >= 50 ? '#d97706' : '#ef4444',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>

                  {/* Keywords Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaCheckCircle size={11} /> Matched Keywords ({selectedApp.matchedKeywords?.length || 0}):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {selectedApp.matchedKeywords && selectedApp.matchedKeywords.length > 0 ? (
                          selectedApp.matchedKeywords.map((kw, i) => (
                            <span key={i} style={{
                              fontSize: '0.72rem',
                              fontWeight: '600',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#059669',
                              border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}>
                              ✓ {kw}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>No department keywords found in resume</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ef4444', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaTimesCircle size={11} /> Missing Keywords ({selectedApp.missingKeywords?.length || 0}):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {selectedApp.missingKeywords && selectedApp.missingKeywords.length > 0 ? (
                          selectedApp.missingKeywords.map((kw, i) => (
                            <span key={i} style={{
                              fontSize: '0.72rem',
                              fontWeight: '600',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: '#dc2626',
                              border: '1px solid rgba(239, 68, 68, 0.25)'
                            }}>
                              ✗ {kw}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>✓ 100% Core Keywords Present!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation banner for HR Action */}
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    color: (selectedApp.resumeScore || 0) >= 70 ? '#047857' : (selectedApp.resumeScore || 0) >= 50 ? '#b45309' : '#b91c1c',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    backgroundColor: (selectedApp.resumeScore || 0) >= 70 ? 'rgba(16, 185, 129, 0.12)' : (selectedApp.resumeScore || 0) >= 50 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    <span>
                      💡 <strong>HR Decision Advisory:</strong> {selectedApp.atsRecommendation || ((selectedApp.resumeScore || 0) >= 70 ? 'Candidate exhibits strong competency match. Recommended for approval.' : 'Review candidate missing keywords before approving or rejecting.')}
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>
                      Decision criteria: &ge;70% Approve | &lt;50% High Risk of Mismatch
                    </span>
                  </div>
                </div>

                {/* DOCUMENT VERIFICATION LIST - ONLY AUTHENTIC UPLOADED DOCUMENTS */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>
                      Original Uploaded Documents ({(selectedApp.documents && selectedApp.documents.length) || 0})
                    </h4>
                    <span className="badge badge-success">Official Candidate Uploads</span>
                  </div>

                  {(!selectedApp.documents || selectedApp.documents.length === 0) ? (
                    <div style={{
                      padding: '28px 20px',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '8px',
                      border: '1px dashed var(--border-default)',
                      color: 'var(--text-secondary)'
                    }}>
                      <FaFileAlt size={26} color="var(--brand-primary)" style={{ marginBottom: '10px', opacity: 0.8 }} />
                      <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        No Documents Attached Yet
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                        This candidate has not attached any compliance documents during registration.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedApp.documents.map((doc, idx) => {
                        const candidateDocFileName = doc.fileName || doc.filename || `${selectedApp.id}_${doc.name}`;
                        return (
                          <div
                            key={doc.id || doc.key || idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              backgroundColor: 'var(--bg-surface)',
                              borderRadius: '6px',
                              border: '1px solid var(--border-default)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <FaFilePdf color="var(--brand-primary)" size={14} />
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                  {idx + 1}. {doc.label || doc.documentType} <span style={{ fontWeight: '400', color: 'var(--text-muted)', fontSize: '0.75rem' }}>({doc.name || candidateDocFileName})</span>
                                </div>
                                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {doc.category || 'Compliance Document'} • {doc.size || '1.4 MB'}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <StatusBadge status={doc.status || "PENDING"} />

                              <button
                                className="btn-action"
                                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                onClick={() => handleViewDocument(doc)}
                                title={`View ${doc.label || doc.documentType}`}
                              >
                                <FaEye size={11} /> View
                              </button>

                              <button
                                className="btn-action"
                                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                onClick={() => {
                                  const downloadUrl = doc.fileUrl ? (doc.fileUrl.startsWith('http') ? doc.fileUrl : `http://127.0.0.1:8000${doc.fileUrl}`) : `http://127.0.0.1:8000/documents/download/${candidateDocFileName}`;
                                  window.open(downloadUrl, '_blank');
                                  showToast(`Downloading ${candidateDocFileName}...`, 'success');
                                }}
                                title={`Download ${doc.label || doc.documentType}`}
                              >
                                <FaDownload size={11} /> Download
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => handleUpdateStatus('RE_UPLOAD_REQUESTED')}
                  >
                    <FaRedo size={12} /> Request Document Re-upload
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleUpdateStatus('REJECTED')}
                    title="Reject candidate and automatically delete application from the system"
                  >
                    <FaTimesCircle size={12} /> Reject & Delete Automatically
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-secondary"
                    style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
                    onClick={handleGenerateOfferLetter}
                    title="Auto-generate and preview official corporate offer letter"
                  >
                    <FaFileSignature size={12} /> Generate Offer Letter
                  </button>

                  {selectedApp.status !== 'APPROVED' && (
                    <button
                      className="btn-primary"
                      onClick={() => handleUpdateStatus('APPROVED')}
                    >
                      <FaCheckCircle size={12} /> Approve Candidate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT PREVIEW MODAL */}
        {previewDoc && (
          <DocumentViewerModal
            doc={previewDoc}
            candidateName={previewDoc.candidateName || selectedApp?.applicantName}
            candidateType={previewDoc.type || selectedApp?.type}
            onClose={() => setPreviewDoc(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default HRApplications;

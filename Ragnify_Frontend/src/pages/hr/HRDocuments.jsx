import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge, EmptyState } from '../../components/common/StatCard';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { documentService } from '../../api/onboardingService';
import { useToast } from '../../context/ToastContext';
import { 
  FaFileAlt, 
  FaCheck, 
  FaTimes, 
  FaDownload, 
  FaEye, 
  FaSearch, 
  FaUserTie, 
  FaUserGraduate, 
  FaUsers,
  FaFilePdf,
  FaFolderOpen
} from 'react-icons/fa';

export function HRDocuments() {
  const [documents, setDocuments] = useState([]);
  const [typeSlicer, setTypeSlicer] = useState('ALL'); // 'ALL' | 'EMPLOYEE' | 'INTERN'
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [previewDoc, setPreviewDoc] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    documentService.getDocuments().then(setDocuments);
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await documentService.verifyDocument(id, status, 'Verified by HR Operations');
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, status, verifiedBy: 'Priya Sharma (HR)' } : d));
      showToast(`Document marked as ${status}`, 'success');
    } catch (err) {
      showToast('Verification failed.', 'error');
    }
  };

  const handleView = (doc) => {
    setPreviewDoc(doc);
    showToast(`Viewing ${doc.documentType} (${doc.candidateName})...`, 'info');
  };

  const filtered = documents.filter(d => {
    // Role Type Slicer
    if (typeSlicer === 'EMPLOYEE' && d.type?.toLowerCase() !== 'employee') return false;
    if (typeSlicer === 'INTERN' && d.type?.toLowerCase() !== 'intern') return false;

    // Status Filter
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;

    // Search by candidate name or file name
    if (searchName.trim()) {
      const q = searchName.toLowerCase().trim();
      const matchCandidate = d.candidateName?.toLowerCase().includes(q);
      const matchDocType = d.documentType?.toLowerCase().includes(q);
      const matchFileName = d.fileName?.toLowerCase().includes(q);
      const matchEmail = d.candidateEmail?.toLowerCase().includes(q);
      if (!matchCandidate && !matchDocType && !matchFileName && !matchEmail) return false;
    }

    return true;
  });

  const employeeDocCount = documents.filter(d => d.type?.toLowerCase() === 'employee').length;
  const internDocCount = documents.filter(d => d.type?.toLowerCase() === 'intern').length;

  // Extract unique candidates for quick suggestions
  const uniqueCandidates = Array.from(new Set(documents.map(d => `${d.candidateName} (${d.type})`)));

  return (
    <MainLayout title="Documents">
      <div className="fade-in">
        <PageHeader
          title="Document Verification & Compliance Hub"
          subtitle="Audit essential candidate credentials (Resume, Identity Proof, PAN, Degree, Offer Letter, Relieving Docs, Certificate)"
        />

        {/* TOP TOOLBAR: ROLE SLICER + CANDIDATE NAME SEARCH + STATUS FILTER */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            
            {/* Slicer: All vs Employee vs Intern Documents */}
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
                All Documents ({documents.length})
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
                Employee Documents ({employeeDocCount})
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
                Intern Documents ({internDocCount})
              </button>
            </div>

            {/* Status Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="text-xs" style={{ fontWeight: '600' }}>Status:</span>
              <select
                className="form-select"
                style={{ width: '160px', height: '36px', fontSize: '0.8125rem' }}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All States</option>
                <option value="VERIFIED">Verified</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          {/* TYPE / SEARCH OPTION FOR CANDIDATE NAME */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              position: 'relative',
              flex: 1,
              maxWidth: '540px'
            }}>
              <FaSearch style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '13px'
              }} />
              <input
                type="text"
                className="form-input"
                placeholder="Type name of employee or intern to see their essential documents (e.g. Aarav, Ishita, Rohan)..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                style={{
                  paddingLeft: '38px',
                  height: '40px',
                  fontSize: '0.875rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {searchName && (
              <button
                className="btn-secondary"
                style={{ height: '40px', padding: '0 14px' }}
                onClick={() => setSearchName('')}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* DOCUMENTS TABLE */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role Type</th>
                  <th>Document Type</th>
                  <th>File Name</th>
                  <th>Category</th>
                  <th>Uploaded Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '36px' }}>
                      <EmptyState 
                        title="No documents match your query" 
                        message="Try adjusting the employee/intern slicer or typing a different candidate name in the search box." 
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map(doc => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{doc.candidateName}</div>
                        <div className="text-xs">{doc.candidateEmail}</div>
                      </td>
                      <td>
                        <span className={`badge ${doc.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                          {doc.type}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaFilePdf size={13} color="var(--brand-primary)" />
                          <strong>{doc.documentType}</strong>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8125rem' }}>
                          <span>{doc.fileName}</span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>({doc.fileSize})</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{doc.category}</span>
                      </td>
                      <td>{doc.uploadedDate}</td>
                      <td>
                        <StatusBadge status={doc.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn-action"
                            onClick={() => handleView(doc)}
                            title="View Document"
                          >
                            <FaEye size={11} /> View
                          </button>

                          <button
                            className="btn-action"
                            onClick={() => showToast(`Downloading ${doc.fileName}...`, 'success')}
                            title="Download Document"
                          >
                            <FaDownload size={11} /> Download
                          </button>

                          {doc.status !== 'VERIFIED' && (
                            <button
                              className="btn-action"
                              style={{ color: 'var(--status-success)', borderColor: 'var(--status-success-border)', backgroundColor: 'var(--status-success-subtle)' }}
                              onClick={() => handleVerify(doc.id, 'VERIFIED')}
                              title="Mark as Verified"
                            >
                              <FaCheck size={11} /> Verify
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DOCUMENT PREVIEW MODAL */}
        {previewDoc && (
          <DocumentViewerModal
            doc={previewDoc}
            candidateName={previewDoc.candidateName}
            candidateType={previewDoc.type}
            onClose={() => setPreviewDoc(null)}
            onVerify={() => {
              handleVerify(previewDoc.id, 'VERIFIED');
              setPreviewDoc(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default HRDocuments;

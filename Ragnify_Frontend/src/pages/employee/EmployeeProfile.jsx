import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { documentService } from '../../api/onboardingService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  FaUser, 
  FaFolderOpen, 
  FaFileContract, 
  FaDownload, 
  FaEye, 
  FaCheckCircle, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaShieldAlt,
  FaUpload,
  FaFilePdf
} from 'react-icons/fa';

export function EmployeeProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const [documents, setDocuments] = useState([
    { id: 'DOC-EMP-01', name: 'Resume / CV', fileName: 'CAND-001_Resume.pdf', documentType: 'Resume / CV', category: 'Career Profile', size: '1.2 MB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-02', name: 'Identity Proof (Aadhaar)', fileName: 'CAND-001_Identity_Proof.pdf', documentType: 'Identity Proof (Aadhaar)', category: 'Identity & KYC', size: '1.4 MB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-03', name: 'PAN Card Proof', fileName: 'CAND-001_PAN_Proof.pdf', documentType: 'PAN Card Proof', category: 'Tax & Compliance', size: '680 KB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-04', name: 'Degree Certificate', fileName: 'CAND-001_Degree_Certificate.pdf', documentType: 'Degree Certificate', category: 'Academic & Credentials', size: '2.4 MB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-05', name: 'Previous Employment Documents', fileName: 'CAND-001_Previous_Employment_Docs.pdf', documentType: 'Previous Employment Documents', category: 'Corporate & Tenure', size: '4.2 MB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-06', name: 'Offer Letter', fileName: 'CAND-001_Offer_Letter.pdf', documentType: 'Offer Letter', category: 'Corporate & Tenure', size: '1.8 MB', date: '2024-03-01', status: 'VERIFIED' }
  ]);

  useEffect(() => {
    documentService.getDocuments({ role: 'EMPLOYEE', user_id: 'CAND-001' }).then(res => {
      if (Array.isArray(res) && res.length > 0) {
        setDocuments(res);
      }
    }).catch(() => {});
  }, []);

  const backendBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'RV';

  return (
    <MainLayout title="My Profile">
      <div className="fade-in">
        <PageHeader
          title="My Profile & Documents"
          subtitle="Manage your personal profile records, verified documents, and employment agreements"
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => showToast('Profile details are up-to-date with HR Master Database.', 'info')}
              >
                Sync with HR Records
              </button>
            </div>
          }
        />

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '24px',
          paddingBottom: '2px'
        }}>
          <button
            onClick={() => handleTabChange('profile')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: activeTab === 'profile' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'profile' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <FaUser size={13} />
            Personal Profile
          </button>

          <button
            onClick={() => handleTabChange('documents')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: activeTab === 'documents' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'documents' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <FaFolderOpen size={13} />
            My Documents ({documents.length})
          </button>

          <button
            onClick={() => handleTabChange('offer-letter')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: activeTab === 'offer-letter' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'offer-letter' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <FaFileContract size={13} />
            Offer Letter
          </button>
        </div>

        {/* TAB 1: PERSONAL PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Left Card: Summary */}
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary-subtle)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '800',
                margin: '0 auto 16px'
              }}>
                {initials}
              </div>

              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '4px' }}>
                {user?.name || 'Rahul Verma'}
              </h2>
              <div className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {user?.designation || 'Senior ML Engineer'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                <StatusBadge status="ACTIVE" />
                <span className="badge badge-info">Full-Time</span>
              </div>

              <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-default)', paddingTop: '16px', fontSize: '0.8125rem' }}>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <FaBriefcase size={12} />
                  <span>AI & Data Science Division</span>
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <FaMapMarkerAlt size={12} />
                  <span>Bangalore HQ (Hybrid)</span>
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <FaCalendarAlt size={12} />
                  <span>Joined March 15, 2024</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <FaShieldAlt size={12} />
                  <span>Emp ID: <strong>EMP-101</strong></span>
                </div>
              </div>
            </div>

            {/* Right Card: Detailed Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '18px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                  Contact & Communication Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Work Email</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--brand-primary)' }}>{user?.email || 'rahul.verma@ragnify.com'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Personal Email</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>rahul.v.work@gmail.com</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Mobile Number</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>+91 98765 43210</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Emergency Contact</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>+91 98450 11223 (Spouse)</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '18px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                  Organizational Placement & Hierarchy
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Department</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>AI & Data Science</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Reporting Manager</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Vikram Mehta (VP Engineering)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Cost Center</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>CC-ENG-AI-2026</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Timezone / Base</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>IST (UTC+5:30) • Bangalore</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Verified Corporate & Identity Documents</h3>
                <span className="text-xs">All records stored securely in AES-256 encrypted storage compliance</span>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => showToast('Document upload dialog will open. Supported: PDF, PNG up to 10MB.', 'info')}
              >
                <FaUpload size={12} /> Upload New Document
              </button>
            </div>

            <div className="table-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Category</th>
                      <th>File Size</th>
                      <th>Uploaded On</th>
                      <th>Verification</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => {
                      const docName = doc.name || doc.documentType || 'Document';
                      const fName = doc.fileName || doc.filename || `${doc.name || 'document'}.pdf`;
                      return (
                        <tr key={doc.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <FaFilePdf size={14} color="var(--brand-primary)" />
                              <strong>{docName}</strong>
                            </div>
                          </td>
                          <td><span className="badge badge-info">{doc.category || 'Compliance'}</span></td>
                          <td>{doc.size || doc.fileSize || '1.4 MB'}</td>
                          <td>{doc.date || doc.uploadedDate || '2024-03-15'}</td>
                          <td><StatusBadge status={doc.status || 'VERIFIED'} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                className="btn-action" 
                                title="Preview Document"
                                onClick={() => {
                                  setPreviewDoc({
                                    ...doc,
                                    candidateId: 'CAND-001',
                                    candidateName: user?.name || 'Rahul Verma',
                                    type: 'Employee',
                                    fileName: fName,
                                    fileUrl: doc.fileUrl || `/documents/view/${fName}`
                                  });
                                  showToast(`Opening ${docName}...`, 'info');
                                }}
                              >
                                <FaEye size={11} /> View
                              </button>
                              <button 
                                className="btn-action" 
                                title="Download File"
                                onClick={() => {
                                  window.open(`${backendBase}/documents/download/${fName}`, '_blank');
                                  showToast(`Downloading ${docName}...`, 'success');
                                }}
                              >
                                <FaDownload size={11} /> Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OFFER LETTER */}
        {activeTab === 'offer-letter' && (
          <div className="fade-in" style={{ maxWidth: '800px' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Official Employment Agreement & Offer Letter</h3>
                    <StatusBadge status="COUNTERSIGNED" />
                  </div>
                  <span className="text-xs">Document Ref: RAG-OFFER-2024-0315 • Issued by RAGNIFY HR Operations</span>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={() => showToast('Generating signed PDF for download...', 'success')}
                >
                  <FaDownload size={12} /> Download Official PDF
                </button>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Designation Offered</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--brand-primary)' }}>Senior ML Engineer</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Effective Start Date</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>March 15, 2024</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Compensation Band</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Tier-1 Enterprise Tech</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px' }}>
                  This official document confirms your terms of employment with <strong>RAGNIFY Workspace Technologies Inc.</strong> It includes comprehensive clauses regarding intellectual property rights, non-disclosure covenants, standard benefits, health insurance policies, and annual performance appraisal structures.
                </p>
                <p style={{ margin: 0 }}>
                  Digitally signed and cryptographically verified on March 01, 2024.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--brand-primary-subtle)', borderRadius: '6px' }}>
                <FaCheckCircle color="var(--brand-primary)" size={16} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--brand-primary)', fontWeight: '600' }}>
                  Digital signature verified with SHA-256 organization certificate. Valid in perpetuity.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT PREVIEW MODAL */}
        {previewDoc && (
          <DocumentViewerModal
            doc={previewDoc}
            candidateName={previewDoc.candidateName || user?.name || 'Employee'}
            candidateType="Employee"
            onClose={() => setPreviewDoc(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default EmployeeProfile;

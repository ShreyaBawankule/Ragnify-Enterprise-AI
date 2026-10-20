import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { OfficialCertificateCard, CertificatePreviewModal } from '../../components/common/CertificatePreviewModal';
import OfferLetterPreviewModal, { OfficialOfferLetterCard } from '../../components/common/OfferLetterPreviewModal';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { documentService } from '../../api/onboardingService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  FaIdCard, 
  FaCheckCircle, 
  FaHistory, 
  FaAward, 
  FaDownload, 
  FaBuilding, 
  FaUserCheck, 
  FaCalendarCheck, 
  FaShieldAlt,
  FaFileContract,
  FaLaptopCode,
  FaMedal,
  FaEye,
  FaFileAlt,
  FaFileUpload,
  FaSearch,
  FaTimes,
  FaPlus
} from 'react-icons/fa';

export function EmployeeEmployment() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || (location.pathname.includes('documents') ? 'documents' : 'job-details');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [previewCert, setPreviewCert] = useState(null);
  const [previewOffer, setPreviewOffer] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [docSearch, setDocSearch] = useState('');
  const [uploadDocModalOpen, setUploadDocModalOpen] = useState(false);
  const [newDocType, setNewDocType] = useState('Degree Certificate');
  const [newDocFile, setNewDocFile] = useState(null);

  const [employeeDocs, setEmployeeDocs] = useState([
    { id: 'DOC-EMP-01', name: 'Resume_CV.pdf', fileName: 'CAND-001_Resume.pdf', documentType: 'Resume / CV', category: 'Academic & Credentials', size: '1.2 MB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-02', name: 'Identity_Proof_Aadhaar.pdf', fileName: 'CAND-001_Identity_Proof.pdf', documentType: 'Identity Proof (Aadhaar)', category: 'Identity & Government KYC', size: '1.4 MB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-03', name: 'PAN_Card_Proof.pdf', fileName: 'CAND-001_PAN_Proof.pdf', documentType: 'PAN Card Proof', category: 'Identity & Government KYC', size: '680 KB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-04', name: 'Degree_Certificate.pdf', fileName: 'CAND-001_Degree_Certificate.pdf', documentType: 'Degree Certificate', category: 'Academic & Credentials', size: '2.4 MB', date: '2024-03-15', status: 'VERIFIED' },
    { id: 'DOC-EMP-05', name: 'Official_Offer_Letter.pdf', fileName: 'CAND-001_Offer_Letter.pdf', documentType: 'Offer Letter', category: 'Corporate & Tenure', size: '1.8 MB', date: '2024-03-01', status: 'VERIFIED' },
    { id: 'DOC-EMP-06', name: 'Previous_Employment_Docs.pdf', fileName: 'CAND-001_Previous_Employment_Docs.pdf', documentType: 'Previous Employment Documents', category: 'Corporate & Tenure', size: '2.1 MB', date: '2024-03-15', status: 'VERIFIED' }
  ]);

  useEffect(() => {
    documentService.getDocuments({ role: 'EMPLOYEE', user_id: 'CAND-001' }).then(res => {
      if (Array.isArray(res) && res.length > 0) {
        setEmployeeDocs(res);
      }
    }).catch(() => {});
  }, []);
  const backendBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const empOfferData = {
    id: 'OFR-EMP-014',
    applicationId: 'CAND-001',
    candidateName: user?.name || 'Rahul Verma',
    candidateEmail: user?.email || 'rahul.verma@ragnify.com',
    role: user?.designation || 'Senior ML Engineer',
    type: 'Employee',
    department: user?.department || 'AI & Data Science',
    stipendSalary: '₹14,50,000 / yr',
    reportingManager: 'Vikram Mehta, Engineering Director',
    joiningDate: '2024-03-15',
    generatedDate: '2024-03-01',
    status: 'COUNTERSIGNED',
    fileUrl: '/offer-letters/download/CAND-001'
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const onboardingSteps = [
    { id: 1, title: 'Identity & Government KYC Verification', desc: 'Aadhaar, PAN & Address verification completed by Compliance', date: 'March 15, 2024', status: 'COMPLETED' },
    { id: 2, title: 'Employment Agreement & Countersigned Offer', desc: 'Digital contract signed with IP assignment covenants', date: 'March 15, 2024', status: 'COMPLETED' },
    { id: 3, title: 'IT Asset Provisioning & NDA Acknowledgement', desc: 'Secure workstation, VPN access & 2FA security setup', date: 'March 16, 2024', status: 'COMPLETED' },
    { id: 4, title: 'Direct Deposit & Payroll Setup', desc: 'Salary bank accounts and tax deduction structures registered', date: 'March 18, 2024', status: 'COMPLETED' },
    { id: 5, title: '30-Day Manager Alignment Check-In', desc: 'Goal setting and team integration review with Vikram Mehta', date: 'April 15, 2024', status: 'COMPLETED' }
  ];

  const certificates = [
    {
      id: 'CERT-AI-01',
      title: 'Senior AI Engineer — Certificate of Excellence',
      issuer: 'RAGNIFY Enterprise AI & Engineering Council',
      date: 'January 2026',
      description: 'Awarded in recognition of exceptional contributions in deploying RAG-assisted knowledge copilot systems across enterprise clients.',
      badge: 'Gold Distinction'
    },
    {
      id: 'CERT-SEC-02',
      title: 'Enterprise Data Privacy & Security Compliance',
      issuer: 'RAGNIFY CyberSec Standards Group',
      date: 'August 2025',
      description: 'Certification for maintaining zero-vulnerability security hygiene in production LLM pipeline integrations.',
      badge: 'Certified'
    }
  ];

  return (
    <MainLayout title="Employment Details">
      <div className="fade-in">
        <PageHeader
          title="Employment & Organization Records"
          subtitle="Contract terms, official offer letter, onboarding progress, tenure milestones, and verified certificates"
          actions={
            <button
              type="button"
              className="btn-primary"
              onClick={() => setPreviewOffer(empOfferData)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}
            >
              <FaFileContract size={13} /> View Official Offer Letter
            </button>
          }
        />

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '24px',
          paddingBottom: '2px',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => handleTabChange('job-details')}
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
              color: activeTab === 'job-details' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'job-details' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <FaIdCard size={13} />
            Job & Role Details
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
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <FaFileContract size={13} />
            Official Offer Letter
          </button>

          <button
            onClick={() => handleTabChange('onboarding')}
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
              color: activeTab === 'onboarding' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'onboarding' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <FaCheckCircle size={13} />
            Onboarding Status (100%)
          </button>

          <button
            onClick={() => handleTabChange('tenure')}
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
              color: activeTab === 'tenure' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'tenure' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <FaHistory size={13} />
            Tenure & Milestones
          </button>

          <button
            onClick={() => handleTabChange('certificates')}
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
              color: activeTab === 'certificates' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'certificates' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <FaAward size={13} />
            Certificates & Credentials ({certificates.length})
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
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <FaFileAlt size={13} />
            Verified Application Documents ({employeeDocs.length})
          </button>
        </div>

        {/* TAB 1: JOB & ROLE DETAILS */}
        {activeTab === 'job-details' && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '960px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '18px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                Position & Hierarchy
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Job Title</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--brand-primary)' }}>Senior ML Engineer</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Employment Type</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Full-Time Permanent</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Band / Level</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>L5 Senior IC</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Confirmation Status</div>
                  <div><StatusBadge status="CONFIRMED" /></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Direct Supervisor</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Vikram Mehta</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Manager Role</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Engineering Director</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '18px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                Department & Operations
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Department</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>AI & Data Science</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Division / Unit</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Core R&D Platform</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Cost Center</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>CC-ENG-AI-2026</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Work Model</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Hybrid (Bangalore HQ)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Payroll Cycle</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Monthly (Last Working Day)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Probation Completed</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Sept 15, 2024</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ONBOARDING STATUS */}
        {activeTab === 'onboarding' && (
          <div className="fade-in" style={{ maxWidth: '780px' }}>
            <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--brand-primary-subtle)', borderColor: 'var(--brand-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaCheckCircle color="var(--brand-primary)" size={24} />
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '800', color: 'var(--brand-primary)' }}>Onboarding 100% Completed</h4>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>All compliance checkpoints, security disclosures, and contracts verified.</span>
                  </div>
                </div>
                <StatusBadge status="ONBOARDED" />
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px' }}>Onboarding Verification Milestones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {onboardingSteps.map((step) => (
                  <div 
                    key={step.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '14px 16px', 
                      backgroundColor: 'var(--bg-surface-subtle)', 
                      borderRadius: '8px',
                      border: '1px solid var(--border-default)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.875rem', marginBottom: '2px' }}>
                        ✅ {step.id}. {step.title}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {step.desc} • Verified on {step.date}
                      </div>
                    </div>
                    <span className="badge badge-success">COMPLETED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TENURE */}
        {activeTab === 'tenure' && (
          <div className="fade-in" style={{ maxWidth: '720px' }}>
            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 4px' }}>2.5 Years of Service</h3>
                  <span className="text-xs">Joined RAGNIFY Workspace on March 15, 2024</span>
                </div>
                <span className="badge badge-info">Veteran Contributor</span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: '600' }}>
                  <span>Progress toward 3-Year Milestone</span>
                  <span>83% (6 Months Remaining)</span>
                </div>
                <div style={{ height: '10px', backgroundColor: 'var(--border-default)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: '83%', height: '100%', backgroundColor: 'var(--brand-primary)', borderRadius: '5px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.8125rem', textAlign: 'center' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px' }}>
                  <span className="text-xs" style={{ display: 'block', marginBottom: '4px' }}>Joining Date</span>
                  <strong>15 Mar 2024</strong>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px' }}>
                  <span className="text-xs" style={{ display: 'block', marginBottom: '4px' }}>Days Active</span>
                  <strong>935 Days</strong>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px' }}>
                  <span className="text-xs" style={{ display: 'block', marginBottom: '4px' }}>Next Milestone</span>
                  <strong>15 Mar 2027</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CERTIFICATES */}
        {activeTab === 'certificates' && (() => {
          const empOfficialCert = {
            id: 'CERT-9904',
            candidateId: 'EMP-2026-014',
            candidateName: user?.name || 'Rahul Verma',
            type: 'Employee',
            certificateType: 'Probation Confirmation & Service Award',
            role: user?.designation || 'Senior ML Engineer',
            department: user?.department || 'AI & Data Science',
            mentorName: 'Vikram Mehta',
            internshipPeriod: 'Mar 15, 2024 – Sep 15, 2024 (6 Months Probation)',
            certificateStatus: 'AVAILABLE',
            issueDate: '2024-09-16'
          };
          return (
            <div className="fade-in" style={{ maxWidth: '940px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div
                style={{
                  padding: '24px 18px',
                  borderRadius: '12px',
                  backgroundColor: '#0F172A',
                  backgroundImage: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                }}
              >
                <OfficialCertificateCard cert={empOfficialCert} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {certificates.map((cert) => (
                  <div key={cert.id} className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--brand-primary-subtle)',
                          color: 'var(--brand-primary)'
                        }}>
                          <FaMedal size={20} />
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: '800' }}>{cert.title}</h4>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Issued by {cert.issuer} • {cert.date}
                          </span>
                        </div>
                      </div>

                      <span className="badge badge-success">{cert.badge}</span>
                    </div>

                    <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      {cert.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => setPreviewCert(empOfficialCert)}
                      >
                        <FaEye size={11} /> Preview Credential
                      </button>
                      <button 
                        className="btn-action" 
                        onClick={() => {
                          window.open(`${backendBase}/certificates/download/CERT-9904`, '_blank');
                          showToast(`Downloading ${cert.title} (PDF)...`, 'success');
                        }}
                      >
                        <FaDownload size={11} /> Download Verified Certificate (PDF)
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {previewCert && (
                <CertificatePreviewModal
                  cert={previewCert}
                  onClose={() => setPreviewCert(null)}
                  onDownload={() => window.open(`${backendBase}/certificates/download/CERT-9904`, '_blank')}
                />
              )}
            </div>
          );
        })()}

        {/* TAB 5: OFFICIAL OFFER LETTER */}
        {activeTab === 'offer-letter' && (
          <div className="fade-in" style={{ maxWidth: '940px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                padding: '24px 18px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0B1528 0%, #16284C 100%)',
                border: '1px solid rgba(197, 155, 39, 0.45)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '18px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(197, 155, 39, 0.25)'
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#F5E6B3'
                    }}
                  >
                    Countersigned Employment Agreement &bull; SHA-256 Verified
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Official Executive Offer of Appointment &mdash; {empOfferData.candidateName}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewOffer(empOfferData)}
                    style={{
                      padding: '7px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: '1px solid rgba(197, 155, 39, 0.5)',
                      background: 'rgba(197, 155, 39, 0.16)',
                      color: '#F5E6B3',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaEye size={12} /> Full-Screen &amp; PDF Stream
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open(`${backendBase}/offer-letters/download/CAND-001`, '_blank')}
                    style={{
                      padding: '7px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #C59B27 0%, #A67C1E 100%)',
                      color: '#0B1528',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaDownload size={12} /> Download Official PDF
                  </button>
                </div>
              </div>

              <OfficialOfferLetterCard offer={empOfferData} />
            </div>
          </div>
        )}

        {/* TAB 6: VERIFIED APPLICATION DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '420px', position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', fontSize: '13px' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search application documents..."
                  value={docSearch}
                  onChange={e => setDocSearch(e.target.value)}
                  style={{ paddingLeft: '34px', height: '36px', fontSize: '0.8125rem', width: '100%' }}
                />
                {docSearch && (
                  <button className="btn-secondary" style={{ padding: '0 8px', height: '36px' }} onClick={() => setDocSearch('')}>
                    <FaTimes size={11} />
                  </button>
                )}
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setUploadDocModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', padding: '8px 14px' }}
              >
                <FaPlus size={11} /> Upload Additional Document
              </button>
            </div>

            <div className="table-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Category</th>
                      <th>File Name</th>
                      <th>File Size</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeDocs
                      .filter(d => {
                        if (!docSearch) return true;
                        const q = docSearch.toLowerCase();
                        return (d.documentType || '').toLowerCase().includes(q) || 
                               (d.name || '').toLowerCase().includes(q) || 
                               (d.fileName || '').toLowerCase().includes(q);
                      })
                      .map((d, idx) => {
                        const fName = d.fileName || d.filename || `${d.name || 'document'}.pdf`;
                        return (
                          <tr key={d.id || idx}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaFileAlt color="var(--brand-primary)" size={13} />
                                <strong>{d.documentType || d.name}</strong>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-info">{d.category || 'Compliance'}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{fName}</span>
                            </td>
                            <td>{d.size || d.fileSize || '1.4 MB'}</td>
                            <td>
                              <StatusBadge status={d.status || 'VERIFIED'} />
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  className="btn-action"
                                  onClick={() => setPreviewDoc({
                                    ...d,
                                    candidateId: 'CAND-001',
                                    candidateName: user?.name || 'Rahul Verma',
                                    type: 'Employee',
                                    fileName: fName,
                                    fileUrl: d.fileUrl || `/documents/view/${fName}`
                                  })}
                                  title="View Document"
                                >
                                  <FaEye size={11} /> View
                                </button>
                                <button
                                  type="button"
                                  className="btn-action"
                                  onClick={() => {
                                    window.open(`${backendBase}/documents/download/${fName}`, '_blank');
                                    showToast(`Downloading ${d.documentType || d.name}...`, 'success');
                                  }}
                                  title="Download Document"
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

        <OfferLetterPreviewModal
          isOpen={Boolean(previewOffer)}
          onClose={() => setPreviewOffer(null)}
          offer={previewOffer}
        />

        {previewDoc && (
          <DocumentViewerModal
            doc={previewDoc}
            candidateName={user?.name || 'Rahul Verma'}
            candidateType="Employee"
            onClose={() => setPreviewDoc(null)}
          />
        )}

        {uploadDocModalOpen && (
          <div className="modal-overlay" onClick={() => setUploadDocModalOpen(false)} style={{ zIndex: 9999 }}>
            <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Upload Additional Document</h3>
                <button className="btn-icon" onClick={() => setUploadDocModalOpen(false)}><FaTimes /></button>
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                if (!newDocFile) {
                  showToast('Please select a file to attach.', 'error');
                  return;
                }
                const newDocObj = {
                  id: `DOC-EMP-UP-${Date.now()}`,
                  name: newDocFile.name,
                  fileName: `CAND-001_${newDocFile.name}`,
                  documentType: newDocType,
                  category: newDocType.includes('Degree') || newDocType.includes('Resume') ? 'Academic & Credentials' : (newDocType.includes('Proof') ? 'Identity & Government KYC' : 'Corporate & Tenure'),
                  size: `${(newDocFile.size / (1024 * 1024)).toFixed(1)} MB`,
                  date: new Date().toISOString().split('T')[0],
                  status: 'VERIFIED'
                };
                setEmployeeDocs(prev => [newDocObj, ...prev]);
                setUploadDocModalOpen(false);
                setNewDocFile(null);
                showToast(`${newDocType} attached & verified successfully!`, 'success');
              }}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Document Classification</label>
                  <select className="form-select" value={newDocType} onChange={e => setNewDocType(e.target.value)}>
                    <option>Degree Certificate</option>
                    <option>Resume / CV</option>
                    <option>Identity Proof (Aadhaar)</option>
                    <option>PAN Card Proof</option>
                    <option>Previous Employment Documents</option>
                    <option>Professional Certification</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label">Select File (PDF, PNG, JPG)</label>
                  <input
                    type="file"
                    className="form-input"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={e => setNewDocFile(e.target.files[0])}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setUploadDocModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <FaFileUpload size={12} /> Confirm Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Retain named legacy exports for backwards compatibility
export { EmployeeEmployment as default };
export const EmployeeOnboarding = EmployeeEmployment;
export const EmployeeDocuments = EmployeeEmployment;
export const EmployeeOfferLetter = EmployeeEmployment;
export const EmployeeTenure = EmployeeEmployment;
export const EmployeeCertificate = EmployeeEmployment;

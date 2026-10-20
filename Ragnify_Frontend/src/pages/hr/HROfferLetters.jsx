import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge, EmptyState } from '../../components/common/StatCard';
import OfferLetterPreviewModal, { OfficialOfferLetterCard } from '../../components/common/OfferLetterPreviewModal';
import { offerLetterService, onboardingService } from '../../api/onboardingService';
import { useToast } from '../../context/ToastContext';
import { 
  FaFileSignature, 
  FaDownload, 
  FaEye, 
  FaPlus, 
  FaTimes, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner,
  FaUserCheck,
  FaUserClock,
  FaUsers,
  FaUserTie,
  FaUserGraduate
} from 'react-icons/fa';

export function HROfferLetters() {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [previewOffer, setPreviewOffer] = useState(null);
  const [activeShowcaseOffer, setActiveShowcaseOffer] = useState(null);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [candidateSlicer, setCandidateSlicer] = useState('ALL'); // 'ALL' | 'APPROVED' | 'EMPLOYEE' | 'INTERN'
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    candidateId: '',
    candidateName: '',
    candidateEmail: '',
    type: 'Employee',
    role: 'Senior Machine Learning Engineer',
    department: 'AI & Data Science',
    stipendSalary: '₹14,50,000 / yr',
    joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reportingManager: 'Dr. Rajesh Khanna, Head of AI',
    applicationStatus: ''
  });

  useEffect(() => {
    Promise.all([
      offerLetterService.getOfferLetters(),
      onboardingService.getApplications()
    ]).then(([offersData, appsData]) => {
      const list = offersData || [];
      setOffers(list);
      if (list.length > 0) {
        setActiveShowcaseOffer(list[0]);
      }
      setApplications(appsData || []);
    });
  }, []);

  // When candidate is selected from the dropdown, autofill all information
  const handleCandidateSelect = (appId) => {
    setSelectedCandidateId(appId);
    if (!appId) {
      setFormData(prev => ({ ...prev, candidateId: '', candidateName: '', candidateEmail: '', applicationStatus: '' }));
      return;
    }
    const app = applications.find(a => a.id === appId);
    if (app) {
      const isIntern = app.type?.toLowerCase() === 'intern';
      setFormData({
        candidateId: app.id,
        candidateName: app.applicantName || '',
        candidateEmail: app.email || `${app.id.toLowerCase()}@ragnify.com`,
        type: isIntern ? 'Intern' : 'Employee',
        role: app.role || (isIntern ? 'Data Science & AI Intern' : 'Senior Machine Learning Engineer'),
        department: app.department || 'AI & Data Science',
        stipendSalary: isIntern ? '₹30,000 / mo' : '₹14,50,000 / yr',
        joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reportingManager: 'Dr. Rajesh Khanna, Head of AI',
        applicationStatus: app.status || 'PENDING'
      });
      showToast(`Selected ${app.applicantName} (${app.status === 'APPROVED' ? 'Approved' : app.status}). Info autofilled!`, 'info');
    }
  };

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      stipendSalary: newType === 'Intern' ? '₹30,000 / mo' : '₹14,50,000 / yr',
      role: newType === 'Intern' ? 'Data Science & AI Intern' : 'Senior Machine Learning Engineer'
    }));
  };

  const handleDownloadPdf = (offer) => {
    const backendBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const candKey = offer.applicationId || offer.id || 'CAND-001';
    const fileName = offer.file || `${candKey}_Official_Offer_Letter.pdf`;
    const fullUrl = `${backendBase}/offer-letters/download/${candKey}`;

    const a = document.createElement('a');
    a.href = fullUrl;
    a.setAttribute('download', fileName);
    a.setAttribute('target', '_blank');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloading official executive PDF (${fileName})...`, 'success');
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.candidateName.trim()) {
      showToast('Please select or enter candidate name.', 'error');
      return;
    }
    setGenerating(true);
    try {
      const generatedCandidateId = formData.candidateId || `CAND-${Date.now().toString().slice(-4)}`;
      const result = await offerLetterService.generateOfferLetter({
        ...formData,
        candidateId: generatedCandidateId,
        applicationId: generatedCandidateId
      });

      // Update state
      setOffers(prev => [result, ...prev.filter(o => o.id !== result.id)]);
      setActiveShowcaseOffer(result);
      showToast(`Official executive offer letter generated for ${formData.candidateName}!`, 'success');
      setIsGenerateModalOpen(false);

      // Open Executive Offer Letter Preview Modal directly
      setPreviewOffer(result);
    } catch (err) {
      showToast('Failed to generate offer letter.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Filter candidates for the modal dropdown
  const modalCandidatesFiltered = applications.filter(app => {
    if (candidateSlicer === 'APPROVED') return app.status === 'APPROVED';
    if (candidateSlicer === 'EMPLOYEE') return app.type?.toLowerCase() === 'employee';
    if (candidateSlicer === 'INTERN') return app.type?.toLowerCase() === 'intern';
    return true;
  });

  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const employeeCount = applications.filter(a => a.type?.toLowerCase() === 'employee').length;
  const internCount = applications.filter(a => a.type?.toLowerCase() === 'intern').length;

  return (
    <MainLayout title="Offer Letters">
      <div className="fade-in">
        <PageHeader
          title="Executive Offer Letters & Appointment Agreements"
          subtitle="Generate, preview, and audit formal SHA-256 verified corporate offer letters"
          actions={
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowLivePreview(prev => !prev)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaEye size={12} /> {showLivePreview ? 'Hide Letterhead Preview' : 'Show Letterhead Preview'}
              </button>
              <button className="btn-primary" onClick={() => setIsGenerateModalOpen(true)}>
                <FaPlus size={12} /> Generate New Offer Letter
              </button>
            </div>
          }
        />

        {/* LIVE EXECUTIVE OFFER LETTER SHOWCASE */}
        {showLivePreview && activeShowcaseOffer && (
          <div
            style={{
              marginBottom: '26px',
              background: 'linear-gradient(135deg, #0B1528 0%, #16284C 100%)',
              borderRadius: '14px',
              border: '1px solid rgba(197, 155, 39, 0.45)',
              padding: '22px 24px',
              boxShadow: '0 20px 50px -15px rgba(15, 23, 42, 0.35)'
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
                paddingBottom: '14px',
                borderBottom: '1px solid rgba(197, 155, 39, 0.25)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: 'rgba(197, 155, 39, 0.2)',
                      color: '#F5E6B3',
                      border: '1px solid rgba(197, 155, 39, 0.45)'
                    }}
                  >
                    Live Corporate Letterhead Preview
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Click any candidate row below to inspect their formal offer letter
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {activeShowcaseOffer.candidateName} &mdash; {activeShowcaseOffer.role} ({activeShowcaseOffer.department})
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setPreviewOffer(activeShowcaseOffer)}
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
                  <FaEye size={12} /> Full-Screen Preview &amp; PDF Stream
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(activeShowcaseOffer)}
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

            <OfficialOfferLetterCard offer={activeShowcaseOffer} compact />
          </div>
        )}

        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Type</th>
                  <th>Designation / Role</th>
                  <th>Department</th>
                  <th>Compensation / Stipend</th>
                  <th>Application Approval</th>
                  <th>Joining Date</th>
                  <th>Generated Date</th>
                  <th>Offer Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ padding: '32px' }}>
                      <EmptyState title="No offer letters issued" message="Offer letters will appear here once generated for approved candidates." />
                    </td>
                  </tr>
                ) : (
                  offers.map(offer => {
                    const matchedApp = applications.find(a => 
                      a.id === offer.applicationId || 
                      a.applicantName?.toLowerCase() === offer.candidateName?.toLowerCase() ||
                      a.email?.toLowerCase() === offer.candidateEmail?.toLowerCase()
                    );
                    const isApproved = matchedApp 
                      ? (matchedApp.status?.toUpperCase() === 'APPROVED' || matchedApp.status?.toUpperCase() === 'COMPLETED')
                      : (offer.isApproved || offer.applicationApproval === 'APPROVED');
                    const isSelectedRow = activeShowcaseOffer?.id === offer.id;

                    return (
                      <tr
                        key={offer.id}
                        onClick={() => setActiveShowcaseOffer(offer)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelectedRow ? 'var(--brand-primary-subtle)' : undefined
                        }}
                      >
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{offer.candidateName}</div>
                          <div className="text-xs">{offer.candidateEmail}</div>
                        </td>
                        <td>
                          <span className={`badge ${offer.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                            {offer.type}
                          </span>
                        </td>
                        <td>{offer.role}</td>
                        <td>{offer.department}</td>
                        <td><strong>{offer.stipendSalary}</strong></td>
                        <td>
                          {isApproved ? (
                            <span 
                              className="badge" 
                              style={{ 
                                backgroundColor: '#DCFCE7', 
                                color: '#15803D', 
                                border: '1px solid #86EFAC', 
                                fontWeight: '700', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '5px',
                                padding: '4px 8px'
                              }}
                            >
                              <FaCheckCircle size={12} color="#16A34A" /> Approved
                            </span>
                          ) : (
                            <span 
                              className="badge" 
                              style={{ 
                                backgroundColor: '#FEE2E2', 
                                color: '#B91C1C', 
                                border: '1px solid #FCA5A5', 
                                fontWeight: '700', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '5px',
                                padding: '4px 8px'
                              }}
                            >
                              <FaTimesCircle size={12} color="#DC2626" /> Not Approved
                            </span>
                          )}
                        </td>
                        <td>{offer.joiningDate}</td>
                        <td>{offer.generatedDate}</td>
                        <td>
                          <StatusBadge status={offer.status} />
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn-action"
                              style={{ 
                                color: 'var(--brand-primary)', 
                                borderColor: 'var(--brand-primary)', 
                                backgroundColor: 'var(--brand-primary-subtle)',
                                fontWeight: '700' 
                              }}
                              onClick={() => {
                                setActiveShowcaseOffer(offer);
                                setPreviewOffer(offer);
                              }}
                              title="Preview Executive Offer Letter & Official PDF"
                            >
                              <FaEye size={11} /> Preview Offer
                            </button>
                            <button
                              className="btn-action"
                              onClick={() => handleDownloadPdf(offer)}
                              title="Download Official Offer Letter PDF"
                            >
                              <FaDownload size={11} /> Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GENERATE NEW OFFER LETTER MODAL */}
        {isGenerateModalOpen && (
          <div className="modal-overlay" onClick={() => setIsGenerateModalOpen(false)}>
            <div className="modal-card" style={{ maxWidth: '660px', width: '94vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header" style={{ flexShrink: 0 }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Generate Digital Offer Letter</h3>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Auto-generate enterprise PDF agreement with cryptographic certificate & company seal
                  </span>
                </div>
                <button onClick={() => setIsGenerateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleGenerateSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div className="modal-body custom-scrollbar-thin" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '62vh', overflowY: 'auto' }}>
                  
                  {/* CANDIDATE SLICER & AUTOFILL DROPDOWN */}
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        Select Applicant to Autofill Details
                      </label>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {approvedCount} Approved • {applications.length} Total Applicants
                      </span>
                    </div>

                    {/* Filter Slicer Buttons */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setCandidateSlicer('APPROVED')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          borderRadius: '4px',
                          border: '1px solid',
                          cursor: 'pointer',
                          backgroundColor: candidateSlicer === 'APPROVED' ? '#DCFCE7' : 'var(--bg-surface)',
                          borderColor: candidateSlicer === 'APPROVED' ? '#16A34A' : 'var(--border-default)',
                          color: candidateSlicer === 'APPROVED' ? '#15803D' : 'var(--text-secondary)'
                        }}
                      >
                        <FaCheckCircle size={10} style={{ marginRight: '4px' }} /> Approved Candidates ({approvedCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCandidateSlicer('ALL')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          borderRadius: '4px',
                          border: '1px solid',
                          cursor: 'pointer',
                          backgroundColor: candidateSlicer === 'ALL' ? 'var(--brand-primary-subtle)' : 'var(--bg-surface)',
                          borderColor: candidateSlicer === 'ALL' ? 'var(--brand-primary)' : 'var(--border-default)',
                          color: candidateSlicer === 'ALL' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        All Applicants ({applications.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCandidateSlicer('EMPLOYEE')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          borderRadius: '4px',
                          border: '1px solid',
                          cursor: 'pointer',
                          backgroundColor: candidateSlicer === 'EMPLOYEE' ? 'var(--brand-primary-subtle)' : 'var(--bg-surface)',
                          borderColor: candidateSlicer === 'EMPLOYEE' ? 'var(--brand-primary)' : 'var(--border-default)',
                          color: candidateSlicer === 'EMPLOYEE' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        Employees ({employeeCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCandidateSlicer('INTERN')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          borderRadius: '4px',
                          border: '1px solid',
                          cursor: 'pointer',
                          backgroundColor: candidateSlicer === 'INTERN' ? 'var(--brand-primary-subtle)' : 'var(--bg-surface)',
                          borderColor: candidateSlicer === 'INTERN' ? 'var(--brand-primary)' : 'var(--border-default)',
                          color: candidateSlicer === 'INTERN' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        Interns ({internCount})
                      </button>
                    </div>

                    {/* Select Dropdown */}
                    <select
                      className="input-text"
                      style={{ width: '100%', fontWeight: '600' }}
                      value={selectedCandidateId}
                      onChange={e => handleCandidateSelect(e.target.value)}
                    >
                      <option value="">-- Choose an applicant to populate details --</option>
                      {modalCandidatesFiltered.map(app => (
                        <option key={app.id} value={app.id}>
                          {app.status === 'APPROVED' ? '✅ [APPROVED]' : `⏳ [${app.status}]`} {app.applicantName} — {app.type} ({app.role})
                        </option>
                      ))}
                    </select>

                    {/* Live Status Notification */}
                    {formData.applicationStatus && (
                      <div style={{ marginTop: '10px' }}>
                        {formData.applicationStatus === 'APPROVED' ? (
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#DCFCE7',
                            border: '1px solid #86EFAC',
                            borderRadius: '6px',
                            color: '#15803D',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <FaCheckCircle size={14} color="#16A34A" />
                            <span>Application Approved by HR Operations. All credentials verified & ready for offer issuance!</span>
                          </div>
                        ) : (
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FCD34D',
                            borderRadius: '6px',
                            color: '#92400E',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <FaTimesCircle size={14} color="#D97706" />
                            <span>Note: Candidate application status is <strong>{formData.applicationStatus}</strong> (Not Approved yet).</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Candidate Type Toggle */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                      Candidate Classification
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleTypeChange('Employee')}
                        style={{
                          flex: 1,
                          padding: '8px 14px',
                          borderRadius: '6px',
                          border: '1px solid',
                          fontWeight: '700',
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          backgroundColor: formData.type === 'Employee' ? 'var(--brand-primary-subtle)' : 'var(--bg-surface-subtle)',
                          borderColor: formData.type === 'Employee' ? 'var(--brand-primary)' : 'var(--border-default)',
                          color: formData.type === 'Employee' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        Full-Time Employee
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeChange('Intern')}
                        style={{
                          flex: 1,
                          padding: '8px 14px',
                          borderRadius: '6px',
                          border: '1px solid',
                          fontWeight: '700',
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          backgroundColor: formData.type === 'Intern' ? 'var(--brand-primary-subtle)' : 'var(--bg-surface-subtle)',
                          borderColor: formData.type === 'Intern' ? 'var(--brand-primary)' : 'var(--border-default)',
                          color: formData.type === 'Intern' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        Internship Candidate
                      </button>
                    </div>
                  </div>

                  {/* Candidate Name & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                        Candidate Full Name *
                      </label>
                      <input
                        type="text"
                        className="input-text"
                        style={{ width: '100%' }}
                        value={formData.candidateName}
                        onChange={e => setFormData({ ...formData, candidateName: e.target.value })}
                        placeholder="e.g. Rohan Deshmukh"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                        Official / Personal Email *
                      </label>
                      <input
                        type="email"
                        className="input-text"
                        style={{ width: '100%' }}
                        value={formData.candidateEmail}
                        onChange={e => setFormData({ ...formData, candidateEmail: e.target.value })}
                        placeholder="e.g. rohan.deshmukh@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Designation & Department */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                        Designation / Role Title *
                      </label>
                      <input
                        type="text"
                        className="input-text"
                        style={{ width: '100%' }}
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Senior Machine Learning Engineer"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                        Department *
                      </label>
                      <select
                        className="input-text"
                        style={{ width: '100%' }}
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="AI & Data Science">AI & Data Science</option>
                        <option value="Core Engineering">Core Engineering</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                        <option value="HR & People Operations">HR & People Operations</option>
                      </select>
                    </div>
                  </div>

                  {/* Compensation & Joining Date */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                        {formData.type === 'Employee' ? 'Annual CTC Compensation *' : 'Monthly Stipend *'}
                      </label>
                      <input
                        type="text"
                        className="input-text"
                        style={{ width: '100%' }}
                        value={formData.stipendSalary}
                        onChange={e => setFormData({ ...formData, stipendSalary: e.target.value })}
                        placeholder={formData.type === 'Employee' ? '₹14,50,000 / yr' : '₹30,000 / mo'}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                        Effective Joining Date *
                      </label>
                      <input
                        type="date"
                        className="input-text"
                        style={{ width: '100%' }}
                        value={formData.joiningDate}
                        onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Reporting Manager */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                      Reporting Manager & Title
                    </label>
                    <input
                      type="text"
                      className="input-text"
                      style={{ width: '100%' }}
                      value={formData.reportingManager}
                      onChange={e => setFormData({ ...formData, reportingManager: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Khanna, Head of AI"
                    />
                  </div>

                  <div style={{ padding: '10px 14px', backgroundColor: 'var(--brand-primary-subtle)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaCheckCircle size={14} />
                    <span>PDF will be generated with organizational SHA-256 seal and stored in compliance repository.</span>
                  </div>
                </div>

                <div className="modal-footer" style={{ justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsGenerateModalOpen(false)}
                    disabled={generating}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={generating}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    {generating ? (
                      <>
                        <FaSpinner className="spin" size={13} />
                        Generating Official PDF...
                      </>
                    ) : (
                      <>
                        <FaFileSignature size={13} />
                        Generate & Issue Offer Letter
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EXECUTIVE OFFER LETTER PREVIEW MODAL */}
        <OfferLetterPreviewModal
          isOpen={Boolean(previewOffer)}
          onClose={() => setPreviewOffer(null)}
          offer={previewOffer}
        />
      </div>
    </MainLayout>
  );
}

export default HROfferLetters;

import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard, StatusBadge, EmptyState } from '../../components/common/StatCard';
import { CertificatePreviewModal, OfficialCertificateCard } from '../../components/common/CertificatePreviewModal';
import { certificateService } from '../../api/onboardingService';
import { useToast } from '../../context/ToastContext';
import { 
  FaAward, 
  FaDownload, 
  FaCheckCircle, 
  FaLock, 
  FaUsers, 
  FaUserGraduate, 
  FaUserTie, 
  FaEye, 
  FaSearch,
  FaInfoCircle,
  FaUnlockAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

export function HRCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'INTERN' | 'EMPLOYEE'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'UPCOMING' | 'LOCKED'
  const [searchQuery, setSearchQuery] = useState('');
  const [previewCert, setPreviewCert] = useState(null);
  const [selectedShowcaseId, setSelectedShowcaseId] = useState(null);
  const [showInlinePreview, setShowInlinePreview] = useState(true);
  const { showToast } = useToast();

  const backendBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    certificateService.getCertificates().then(data => {
      // Normalize any legacy fields so no column is ever blank
      const normalized = (data || []).map(c => ({
        ...c,
        id: c.id || `CERT-${c.candidateId || '001'}`,
        candidateId: c.candidateId || (c.id ? c.id.replace('CERT-', '') : 'CAND-001'),
        candidateName: c.candidateName || c.internName || 'Candidate',
        candidateEmail: c.candidateEmail || c.email || 'candidate@ragnify.com',
        type: c.type || 'Intern',
        certificateType: c.certificateType || (c.type === 'Employee' ? 'Probation Confirmation & Service Award' : 'Internship Completion Certificate'),
        role: c.role || 'Software Engineering Intern',
        department: c.department || 'Engineering',
        mentorName: c.mentorName || 'Vikram Mehta',
        internshipPeriod: c.internshipPeriod || c.tenureDuration || 'Aug 01, 2026 – Oct 31, 2026 (3 Months)',
        progress: c.progress !== undefined ? c.progress : (c.status === 'AVAILABLE' || c.certificateStatus === 'AVAILABLE' ? 100 : 75),
        tenureStatus: c.tenureStatus || (c.status === 'AVAILABLE' || c.certificateStatus === 'AVAILABLE' ? 'COMPLETED' : 'IN_PROGRESS'),
        certificateStatus: c.certificateStatus || c.status || 'UPCOMING',
        issueDate: c.issueDate && c.issueDate !== '-' ? c.issueDate : 'Pending HR Sign-Off',
        fileUrl: c.fileUrl || `/certificates/download/${c.id || c.candidateId}`
      }));
      setCertificates(normalized);
      if (normalized.length > 0) {
        const firstAvailable = normalized.find(c => c.certificateStatus === 'AVAILABLE') || normalized[0];
        setSelectedShowcaseId(firstAvailable.id);
      }
    });
  }, []);

  const handleIssue = async (cert) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await certificateService.issueCertificate(cert.id);
      const updatedFields = {
        certificateStatus: 'AVAILABLE',
        status: 'AVAILABLE',
        tenureStatus: 'COMPLETED',
        progress: 100,
        daysCompleted: 92,
        totalDays: 92,
        hrApproved: true,
        internAccessGranted: true,
        issueDate: todayStr
      };
      setCertificates(prev => prev.map(c => c.id === cert.id ? { ...c, ...updatedFields } : c));
      if (previewCert && previewCert.id === cert.id) {
        setPreviewCert(prev => ({ ...prev, ...updatedFields }));
      }
      showToast(`Approved! ${cert.candidateName} can now view & download their official certificate in their portal.`, 'success');
    } catch (err) {
      showToast('Certificate approval failed.', 'error');
    }
  };

  const handleRevoke = async (cert) => {
    try {
      await certificateService.revokeCertificate(cert.id);
      const updatedFields = {
        certificateStatus: 'LOCKED',
        status: 'LOCKED',
        tenureStatus: 'IN_PROGRESS',
        progress: 74,
        daysCompleted: 68,
        totalDays: 92,
        hrApproved: false,
        internAccessGranted: false,
        issueDate: 'Awaiting Completion & HR Approval'
      };
      setCertificates(prev => prev.map(c => c.id === cert.id ? { ...c, ...updatedFields } : c));
      if (previewCert && previewCert.id === cert.id) {
        setPreviewCert(prev => ({ ...prev, ...updatedFields }));
      }
      showToast(`Certificate access locked for ${cert.candidateName}. Intern portal view & download restricted.`, 'info');
    } catch (err) {
      showToast('Failed to lock certificate access.', 'error');
    }
  };

  const handlePreview = (cert) => {
    setSelectedShowcaseId(cert.id);
    setPreviewCert(cert);
  };

  const handleDownload = (cert) => {
    const url = `${backendBase}/certificates/download/${cert.id}`;
    window.open(url, '_blank');
    showToast(`Downloading official certificate PDF for ${cert.candidateName}...`, 'success');
  };

  const filtered = certificates.filter(c => {
    if (typeFilter !== 'ALL' && c.type?.toUpperCase() !== typeFilter) return false;
    if (statusFilter !== 'ALL' && c.certificateStatus?.toUpperCase() !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.candidateName?.toLowerCase().includes(q);
      const matchRole = c.role?.toLowerCase().includes(q);
      const matchId = c.candidateId?.toLowerCase().includes(q);
      const matchDept = c.department?.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchId && !matchDept) return false;
    }
    return true;
  });

  const internCertificates = certificates.filter(c => c.type?.toUpperCase() === 'INTERN');
  const totalCount = certificates.length;
  const issuedCount = certificates.filter(c => c.certificateStatus === 'AVAILABLE').length;
  const upcomingCount = certificates.filter(c => c.certificateStatus === 'UPCOMING').length;
  const lockedCount = certificates.filter(c => c.certificateStatus === 'LOCKED').length;

  return (
    <MainLayout title="Certificates">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <PageHeader
          title="Milestone & Completion Certificates"
          subtitle="Audit internship tenures & employee probation periods, approve completion requirements, and control Intern portal certificate access"
        />

        {/* PURPOSE EXPLANATION & WORKFLOW GUIDE BANNER */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderLeft: '4px solid var(--brand-primary)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
            <FaInfoCircle color="var(--brand-primary)" />
            <span>Purpose of the HR Certificates Hub &amp; Intern Self-Service Access Gate</span>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Interns <strong>cannot see or download</strong> their Completion Certificate while their internship is in progress or unapproved. Once an intern completes their tenure and HR clicks <strong>Approve &amp; Grant Intern Access</strong> in the module below, the signed Royal Navy &amp; Gold PDF Certificate is immediately unlocked in the Intern&apos;s self-service portal for direct download.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '4px' }}>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px', fontSize: '0.78rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>1. LOCKED (Hidden from Intern):</strong> Internship is still in progress or awaiting HR approval. Intern cannot view or download the certificate.
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px', fontSize: '0.78rem' }}>
              <strong style={{ color: 'var(--status-warning, #D97706)' }}>2. UPCOMING (Ready for HR Sign-Off):</strong> Tenure completed; awaiting HR verification to click <em>Approve &amp; Grant Access</em>.
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px', fontSize: '0.78rem' }}>
              <strong style={{ color: 'var(--status-success, #10B981)' }}>3. AVAILABLE (Approved &amp; Unlocked):</strong> HR has approved completion. The Intern can now view and download their official PDF certificate on their own.
            </div>
          </div>
        </div>

        {/* 4 KPI SUMMARY CARDS */}
        <div className="kpi-cards-grid">
          <StatCard
            title="Total Tracked Personnel"
            value={totalCount}
            icon={<FaUsers />}
            change="Interns & Employees"
            subtitle="Registered for Certification"
          />
          <StatCard
            title="Approved & Unlocked"
            value={issuedCount}
            icon={<FaCheckCircle />}
            change="Intern Can Download"
            subtitle="Verified PDF Certificates"
          />
          <StatCard
            title="Ready for Approval"
            value={upcomingCount}
            icon={<FaAward />}
            change="Action Required"
            subtitle="Awaiting HR Sign-Off"
          />
          <StatCard
            title="Locked (Hidden in Portal)"
            value={lockedCount}
            icon={<FaLock />}
            change="Restricted Access"
            subtitle="Completing Tenure / Unapproved"
          />
        </div>

        {/* DEDICATED INTERN CERTIFICATE APPROVAL & SELF-SERVICE ACCESS CONTROL MODULE */}
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            border: '1px solid rgba(197, 155, 39, 0.45)',
            boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.12)'
          }}
        >
          <div
            style={{
              padding: '16px 22px',
              background: 'linear-gradient(135deg, #0B1528 0%, #16284C 100%)',
              borderBottom: '2px solid #C59B27',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(197, 155, 39, 0.18)',
                  border: '1px solid rgba(197, 155, 39, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F5E6B3'
                }}
              >
                <FaUserGraduate size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#FFFFFF' }}>
                    Intern Certificate Approval &amp; Portal Access Control Module
                  </h3>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 9px',
                      borderRadius: '999px',
                      background: 'rgba(197, 155, 39, 0.22)',
                      color: '#F5E6B3',
                      border: '1px solid rgba(197, 155, 39, 0.45)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}
                  >
                    HR Authorization Gate
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '2px' }}>
                  Approve internship completion here so interns can view and download their official certificate from their own Intern Portal
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.76rem', color: '#CBD5E1', fontWeight: 600 }}>
                Unlocked Interns:{' '}
                <strong style={{ color: '#34D399' }}>
                  {internCertificates.filter(i => i.certificateStatus === 'AVAILABLE').length} / {internCertificates.length}
                </strong>
              </span>
            </div>
          </div>

          <div style={{ padding: '18px 22px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '14px', backgroundColor: 'var(--bg-surface)' }}>
            {internCertificates.map(intern => {
              const isApproved = intern.certificateStatus === 'AVAILABLE';
              const isPortalUser = intern.candidateId === 'INT-201' || intern.candidateName?.toLowerCase() === 'ananya roy';
              return (
                <div
                  key={intern.id}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '10px',
                    border: isApproved
                      ? '1.5px solid #10B981'
                      : isPortalUser
                      ? '1.5px solid var(--brand-primary)'
                      : '1px solid var(--border-default)',
                    backgroundColor: isApproved ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-surface-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {intern.candidateName}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-primary)', background: 'var(--brand-primary-subtle)', padding: '1px 6px', borderRadius: '4px' }}>
                            {intern.candidateId}
                          </span>
                          {isPortalUser && (
                            <span style={{ fontSize: '0.64rem', fontWeight: 800, background: '#DBEAFE', color: '#1D4ED8', padding: '1px 6px', borderRadius: '999px' }}>
                              Active Intern Account
                            </span>
                          )}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {intern.role} &bull; {intern.department}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap',
                          backgroundColor: isApproved ? '#DCFCE7' : '#FEF3C7',
                          color: isApproved ? '#15803D' : '#B45309',
                          border: isApproved ? '1px solid #86EFAC' : '1px solid #FDE68A'
                        }}
                      >
                        {isApproved ? <FaCheckCircle size={10} /> : <FaLock size={10} />}
                        {isApproved ? 'INTERN ACCESS UNLOCKED' : 'LOCKED FOR INTERN'}
                      </span>
                    </div>

                    {/* Tenure completion bar */}
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Internship Tenure: <strong style={{ color: 'var(--text-primary)' }}>{intern.tenureStatus === 'COMPLETED' ? '100% Completed' : `${intern.progress}% In Progress`}</strong>
                        </span>
                        <span style={{ color: isApproved ? '#059669' : 'var(--brand-primary)' }}>
                          {isApproved ? '92 / 92 Days' : `${intern.daysCompleted || Math.round(92 * (intern.progress || 74) / 100)} / 92 Days`}
                        </span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${isApproved ? 100 : intern.progress}%`,
                            height: '100%',
                            backgroundColor: isApproved ? '#10B981' : 'var(--brand-primary)',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Module Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-default)', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-action"
                      style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                      onClick={() => handlePreview(intern)}
                    >
                      <FaEye size={11} /> Inspect Certificate
                    </button>

                    {!isApproved ? (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          border: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onClick={() => handleIssue(intern)}
                      >
                        <FaUnlockAlt size={11} /> Approve &amp; Grant Intern Access
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn-action"
                          style={{ padding: '5px 10px', fontSize: '0.74rem', color: '#059669', borderColor: '#A7F3D0', backgroundColor: '#ECFDF5', fontWeight: 700 }}
                          onClick={() => handleDownload(intern)}
                        >
                          <FaDownload size={11} /> PDF
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.73rem', color: '#DC2626', borderColor: '#FECACA' }}
                          onClick={() => handleRevoke(intern)}
                          title="Lock certificate so intern cannot view or download it"
                        >
                          <FaLock size={10} /> Lock Access
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 18px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)'
        }}>
          {/* Category Slicer */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: '6px' }}>
            {[
              { key: 'ALL', label: `All (${totalCount})`, icon: <FaUsers size={12} /> },
              { key: 'INTERN', label: 'Intern Certificates', icon: <FaUserGraduate size={12} /> },
              { key: 'EMPLOYEE', label: 'Employee Probation', icon: <FaUserTie size={12} /> }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setTypeFilter(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: typeFilter === tab.key ? 'var(--brand-primary)' : 'transparent',
                  color: typeFilter === tab.key ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Status & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'AVAILABLE', 'UPCOMING', 'LOCKED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    borderRadius: '4px',
                    border: '1px solid',
                    cursor: 'pointer',
                    backgroundColor: statusFilter === st ? 'var(--brand-primary-subtle, #EFF6FF)' : 'var(--bg-surface)',
                    color: statusFilter === st ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    borderColor: statusFilter === st ? 'var(--brand-primary)' : 'var(--border-default)'
                  }}
                >
                  {st === 'ALL' ? 'All States' : st}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '220px' }}>
              <FaSearch size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search candidate, ID, role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '30px', height: '34px', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </div>

        {/* CERTIFICATES DATA TABLE */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate &amp; ID</th>
                  <th>Category &amp; Certificate</th>
                  <th>Designation &amp; Dept</th>
                  <th>Tenure Period &amp; Progress</th>
                  <th>Tenure State</th>
                  <th>Portal Access Status</th>
                  <th>Issue Date</th>
                  <th>HR Approval &amp; Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '32px' }}>
                      <EmptyState title="No matching certificate records" message="Try adjusting your category or status filter." />
                    </td>
                  </tr>
                ) : (
                  filtered.map(cert => (
                    <tr key={cert.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{cert.candidateName}</div>
                        <div className="text-xs">{cert.candidateEmail} • <strong>{cert.candidateId}</strong></div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span className={`badge ${cert.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                            {cert.type}
                          </span>
                        </div>
                        <div className="text-xs" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {cert.certificateType}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cert.role}</div>
                        <div className="text-xs">{cert.department} • Mentor: {cert.mentorName}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>
                          {cert.internshipPeriod}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '90px', height: '6px', backgroundColor: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${cert.progress}%`,
                              height: '100%',
                              backgroundColor: cert.progress === 100 ? 'var(--status-success)' : 'var(--brand-primary)',
                              borderRadius: '3px'
                            }} />
                          </div>
                          <span className="text-xs" style={{ fontWeight: '700' }}>{cert.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={cert.tenureStatus} />
                      </td>
                      <td>
                        <StatusBadge status={cert.certificateStatus} />
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', fontWeight: cert.certificateStatus === 'AVAILABLE' ? '700' : '500', color: cert.certificateStatus === 'AVAILABLE' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {cert.issueDate}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            className="btn-action"
                            style={{ padding: '4px 9px', fontSize: '0.75rem' }}
                            onClick={() => handlePreview(cert)}
                            title="Preview official executive certificate"
                          >
                            <FaEye size={11} /> Preview
                          </button>

                          {cert.certificateStatus === 'AVAILABLE' ? (
                            <>
                              <button
                                className="btn-action"
                                style={{ padding: '4px 9px', fontSize: '0.75rem' }}
                                onClick={() => handleDownload(cert)}
                                title="Download verified PDF certificate"
                              >
                                <FaDownload size={11} /> PDF
                              </button>
                              <button
                                className="btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#DC2626', borderColor: '#FECACA' }}
                                onClick={() => handleRevoke(cert)}
                                title="Revoke & lock portal access"
                              >
                                <FaLock size={10} /> Lock
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn-primary"
                              style={{ padding: '5px 10px', fontSize: '0.75rem', gap: '5px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', border: 'none' }}
                              onClick={() => handleIssue(cert)}
                              title="Approve internship completion and unlock certificate in Intern portal"
                            >
                              <FaUnlockAlt size={11} /> Approve &amp; Unlock
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

        {/* LIVE EXECUTIVE CERTIFICATE DESIGN SHOWCASE */}
        {certificates.length > 0 && (
          <div
            className="card"
            style={{
              padding: 0,
              overflow: 'hidden',
              border: '1px solid var(--border-default)'
            }}
          >
            <div
              style={{
                padding: '14px 20px',
                borderBottom: showInlinePreview ? '1px solid var(--border-default)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaAward size={18} color="#C5A059" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Official Executive Certificate Live Preview
                  </h3>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Inspect the Royal Navy &amp; Gold embossed credential before or after issuing to candidates
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <select
                  className="form-select"
                  value={selectedShowcaseId || ''}
                  onChange={e => setSelectedShowcaseId(e.target.value)}
                  style={{ height: '34px', fontSize: '0.8rem', minWidth: '240px', padding: '4px 10px' }}
                >
                  {certificates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.candidateName} — {c.role} ({c.certificateStatus})
                    </option>
                  ))}
                </select>

                {(() => {
                  const activeCert = certificates.find(c => c.id === selectedShowcaseId) || certificates[0];
                  return activeCert ? (
                    <>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.76rem', gap: '6px' }}
                        onClick={() => handlePreview(activeCert)}
                      >
                        <FaEye size={11} /> Full-Screen / PDF View
                      </button>
                      <button
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.76rem', gap: '6px' }}
                        onClick={() => handleDownload(activeCert)}
                      >
                        <FaDownload size={11} /> Download Official PDF
                      </button>
                    </>
                  ) : null;
                })()}

                <button
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  onClick={() => setShowInlinePreview(prev => !prev)}
                  title={showInlinePreview ? 'Collapse preview' : 'Expand preview'}
                >
                  {showInlinePreview ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                </button>
              </div>
            </div>

            {showInlinePreview && (
              <div
                style={{
                  padding: '28px 20px',
                  backgroundColor: '#0F172A',
                  backgroundImage: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)'
                }}
              >
                <OfficialCertificateCard
                  cert={certificates.find(c => c.id === selectedShowcaseId) || certificates[0]}
                />
              </div>
            )}
          </div>
        )}

        {/* INTERACTIVE EXECUTIVE CERTIFICATE PREVIEW MODAL */}
        {previewCert && (
          <CertificatePreviewModal
            cert={previewCert}
            onClose={() => setPreviewCert(null)}
            onIssue={handleIssue}
            onDownload={handleDownload}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default HRCertificates;


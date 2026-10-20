import React, { useState } from 'react';
import {
  FaTimes,
  FaDownload,
  FaAward,
  FaCheckCircle,
  FaShieldAlt,
  FaFilePdf,
  FaEye,
  FaPrint,
  FaLock,
  FaUnlockAlt
} from 'react-icons/fa';

/**
 * Reusable Executive-Grade Visual Certificate Component
 * Used in both the HR Certificate Preview Modal and the Intern/Employee Certificate Portal.
 */
export function OfficialCertificateCard({ cert, compact = false }) {
  if (!cert) return null;

  const isIntern = (cert.type || 'Intern').toLowerCase() === 'intern';
  const isAvailable = (cert.certificateStatus || cert.status) === 'AVAILABLE';
  const candidateName = cert.candidateName || cert.internName || 'Ananya Roy';
  const candidateId = cert.candidateId || (cert.id ? cert.id.replace('CERT-', '') : 'INT-201');
  const certId = cert.id?.startsWith('CERT-') ? cert.id : `CERT-${candidateId}`;
  const role = cert.role || (isIntern ? 'Frontend Development Intern' : 'Senior Software Engineer');
  const department = cert.department || 'Engineering & Product Innovation';
  const mentorName = cert.mentorName || 'Vikram Mehta';
  const tenurePeriod = cert.internshipPeriod || cert.tenureDuration || 'Aug 01, 2026 – Oct 31, 2026 (3 Months)';
  const issueDate = isAvailable && cert.issueDate && !cert.issueDate.includes('Pending') && !cert.issueDate.includes('Ready')
    ? cert.issueDate
    : new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });

  return (
    <div
      className="official-certificate-paper"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '880px',
        margin: '0 auto',
        backgroundColor: '#FDFBF7',
        backgroundImage: 'radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FDFBF7 65%, #F5EFE0 100%)',
        color: '#0A192F',
        padding: compact ? '16px' : '22px',
        borderRadius: '6px',
        boxShadow: '0 20px 50px rgba(10, 25, 47, 0.35), 0 0 0 1px rgba(197, 160, 89, 0.4)',
        userSelect: 'none',
        overflow: 'hidden',
        fontFamily: "'Georgia', 'Times New Roman', serif"
      }}
    >
      {/* OUTER HEAVY ROYAL NAVY ARCHITECTURAL FRAME */}
      <div
        style={{
          position: 'relative',
          border: '8px solid #0A192F',
          padding: '6px',
          backgroundColor: 'transparent'
        }}
      >
        {/* INNER BURNISHED GOLD DOUBLE FRAME */}
        <div
          style={{
            position: 'relative',
            border: '2px solid #C5A059',
            padding: '4px'
          }}
        >
          <div
            style={{
              position: 'relative',
              border: '1px solid rgba(197, 160, 89, 0.65)',
              padding: compact ? '24px 28px 22px' : '34px 44px 28px',
              textAlign: 'center',
              overflow: 'hidden'
            }}
          >
            {/* 4 CORNER ORNAMENTAL FLOURISHES */}
            {[
              { top: '8px', left: '8px', borderTop: '3px solid #0A192F', borderLeft: '3px solid #0A192F' },
              { top: '8px', right: '8px', borderTop: '3px solid #0A192F', borderRight: '3px solid #0A192F' },
              { bottom: '8px', left: '8px', borderBottom: '3px solid #0A192F', borderLeft: '3px solid #0A192F' },
              { bottom: '8px', right: '8px', borderBottom: '3px solid #0A192F', borderRight: '3px solid #0A192F' }
            ].map((cornerStyle, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '28px',
                  height: '28px',
                  pointerEvents: 'none',
                  ...cornerStyle
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#C5A059',
                    margin: '4px'
                  }}
                />
              </div>
            ))}

            {/* SUBTLE CENTER WATERMARK CREST */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '18rem',
                fontWeight: '900',
                color: 'rgba(10, 25, 47, 0.025)',
                pointerEvents: 'none',
                lineHeight: 1,
                zIndex: 0
              }}
            >
              R
            </div>

            {/* DRAFT WATERMARK RIBBON IF NOT YET ISSUED */}
            {!isAvailable && (
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  color: '#92400E',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  fontFamily: "'Inter', sans-serif",
                  padding: '4px 10px',
                  borderRadius: '4px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FaLock size={10} /> Preview Mode ({cert.certificateStatus || 'Pending HR Sign-Off'})
              </div>
            )}

            {/* TOP EXECUTIVE CREST & ORGANIZATION HEADER */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#0A192F',
                  border: '2px solid #C5A059',
                  boxShadow: '0 4px 12px rgba(10, 25, 47, 0.25), inset 0 0 0 3px #0A192F, inset 0 0 0 4px rgba(197, 160, 89, 0.5)',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C5A059',
                  fontSize: '1.35rem',
                  fontWeight: '900',
                  letterSpacing: '0.05em'
                }}
              >
                R
              </div>

              <div
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                  fontSize: compact ? '0.95rem' : '1.1rem',
                  fontWeight: '900',
                  letterSpacing: '0.22em',
                  color: '#0A192F',
                  textTransform: 'uppercase'
                }}
              >
                RAGNIFY ENTERPRISE TECHNOLOGIES
              </div>

              <div
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  letterSpacing: '0.18em',
                  color: '#9A7B38',
                  textTransform: 'uppercase',
                  marginTop: '3px'
                }}
              >
                Official Human Resources &amp; Workforce Credential Registry
              </div>

              {/* ORNAMENTAL GOLD DIVIDER WITH DIAMOND */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  margin: '10px auto 14px',
                  maxWidth: '320px'
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #C5A059)' }} />
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    backgroundColor: '#C5A059',
                    transform: 'rotate(45deg)'
                  }}
                />
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #C5A059)' }} />
              </div>

              {/* MAIN CERTIFICATE TITLE */}
              <h1
                style={{
                  margin: '0 0 8px',
                  fontSize: compact ? '1.75rem' : '2.25rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  color: '#0A192F',
                  textTransform: 'uppercase',
                  fontFamily: "'Georgia', 'Times New Roman', serif"
                }}
              >
                {isIntern ? 'Certificate of Completion' : 'Certificate of Excellence'}
              </h1>

              {/* SUBTITLE PILL BANNER */}
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#0A192F',
                  color: '#F3E5AB',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '5px 18px',
                  borderRadius: '999px',
                  border: '1px solid #C5A059',
                  marginBottom: '18px'
                }}
              >
                {isIntern
                  ? 'Internship Tenure & Technical Excellence Award'
                  : 'Probation Confirmation & Milestone Achievement'}
              </div>

              {/* PRESENTATION TEXT */}
              <div
                style={{
                  fontSize: '0.98rem',
                  fontStyle: 'italic',
                  color: '#475569',
                  marginBottom: '8px'
                }}
              >
                This official credential is proudly presented to
              </div>

              {/* RECIPIENT NAME */}
              <div
                style={{
                  fontSize: compact ? '1.9rem' : '2.45rem',
                  fontWeight: '700',
                  fontStyle: 'italic',
                  color: '#1E3A8A',
                  letterSpacing: '0.02em',
                  lineHeight: 1.15,
                  marginBottom: '6px',
                  fontFamily: "'Georgia', 'Times New Roman', serif"
                }}
              >
                {candidateName}
              </div>

              {/* DOUBLE GOLD LINE UNDER NAME */}
              <div style={{ maxWidth: '380px', margin: '0 auto 18px' }}>
                <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C5A059, transparent)', marginBottom: '2px' }} />
                <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.6), transparent)' }} />
              </div>

              {/* CITATION PARAGRAPH */}
              <p
                style={{
                  maxWidth: '670px',
                  margin: '0 auto 20px',
                  fontSize: compact ? '0.9rem' : '0.98rem',
                  lineHeight: '1.68',
                  color: '#334155'
                }}
              >
                {isIntern ? (
                  <>
                    for successfully completing the comprehensive internship tenure as{' '}
                    <strong style={{ color: '#0A192F' }}>{role}</strong> within the{' '}
                    <strong style={{ color: '#0A192F' }}>{department}</strong> Department at{' '}
                    <strong>Ragnify Enterprise Technologies</strong> ({tenurePeriod}). Under the technical mentorship of{' '}
                    <strong style={{ color: '#0A192F' }}>{mentorName}</strong>, the candidate demonstrated exceptional
                    engineering rigor, strong problem-solving aptitude, and steadfast commitment to production deliverables.
                  </>
                ) : (
                  <>
                    for successfully completing the enterprise probation and milestone evaluation as{' '}
                    <strong style={{ color: '#0A192F' }}>{role}</strong> within the{' '}
                    <strong style={{ color: '#0A192F' }}>{department}</strong> Department at{' '}
                    <strong>Ragnify Enterprise Technologies</strong> ({tenurePeriod}). Reporting to{' '}
                    <strong style={{ color: '#0A192F' }}>{mentorName}</strong>, the candidate consistently exceeded core
                    architectural, delivery, and organizational compliance benchmarks with distinction.
                  </>
                )}
              </p>

              {/* 3 VERIFIED METADATA PILLARS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  maxWidth: '660px',
                  margin: '0 auto 26px',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {[
                  { label: 'DESIGNATION / ROLE', value: role },
                  { label: 'DEPARTMENT', value: department },
                  { label: 'VERIFIED TENURE PERIOD', value: tenurePeriod }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      border: '1px solid #E2E8F0',
                      borderTop: '2px solid #C5A059',
                      borderRadius: '6px',
                      padding: '8px 10px'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: '800',
                        letterSpacing: '0.08em',
                        color: '#64748B',
                        marginBottom: '3px'
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        color: '#0A192F',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={item.value}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* SIGNATURES & EMBOSSED GOLD SEAL FOOTER */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: '20px',
                  maxWidth: '720px',
                  margin: '0 auto 18px',
                  paddingTop: '6px'
                }}
              >
                {/* LEFT SIGNATURE: HR HEAD */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                      fontStyle: 'italic',
                      fontWeight: '700',
                      fontSize: '1.35rem',
                      color: '#1E3A8A',
                      marginBottom: '4px',
                      letterSpacing: '0.02em'
                    }}
                  >
                    Priya Sharma
                  </div>
                  <div style={{ height: '1px', backgroundColor: '#0A192F', width: '80%', margin: '0 auto 6px' }} />
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      letterSpacing: '0.08em',
                      color: '#0A192F'
                    }}
                  >
                    PRIYA SHARMA
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.68rem',
                      color: '#64748B',
                      fontWeight: '600'
                    }}
                  >
                    Head of People &amp; HR Operations
                  </div>
                </div>

                {/* CENTER EMBOSSED GOLD SEAL WITH RIBBONS */}
                <div style={{ position: 'relative', width: '96px', height: '104px', display: 'flex', justifyContent: 'center' }}>
                  {/* Twin Hanging Ribbons SVG */}
                  <svg
                    width="96"
                    height="104"
                    viewBox="0 0 96 104"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  >
                    {/* Left Navy Ribbon */}
                    <polygon points="34,62 20,100 32,92 40,102 45,62" fill="#0A192F" />
                    {/* Right Gold Ribbon */}
                    <polygon points="62,62 76,100 64,92 56,102 51,62" fill="#9A7B38" />
                    {/* Outer Gold Rosette Circle */}
                    <circle cx="48" cy="42" r="36" fill="#C5A059" stroke="#9A7B38" strokeWidth="2" strokeDasharray="4,2" />
                    <circle cx="48" cy="42" r="30" fill="#0A192F" stroke="#F3E5AB" strokeWidth="1.5" />
                    <circle cx="48" cy="42" r="25" fill="none" stroke="#C5A059" strokeWidth="0.8" strokeDasharray="2,2" />
                  </svg>
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '60px',
                      height: '60px',
                      marginTop: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Inter', sans-serif",
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.42rem', fontWeight: '800', color: '#F3E5AB', letterSpacing: '0.08em' }}>
                      RAGNIFY HR
                    </span>
                    <FaAward size={15} color="#C5A059" style={{ margin: '2px 0' }} />
                    <span style={{ fontSize: '0.48rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.08em' }}>
                      VERIFIED
                    </span>
                    <span style={{ fontSize: '0.4rem', fontWeight: '700', color: '#C5A059' }}>
                      SEAL • 2026
                    </span>
                  </div>
                </div>

                {/* RIGHT SIGNATURE: ENGINEERING MANAGER / MENTOR */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                      fontStyle: 'italic',
                      fontWeight: '700',
                      fontSize: '1.35rem',
                      color: '#1E3A8A',
                      marginBottom: '4px',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {mentorName}
                  </div>
                  <div style={{ height: '1px', backgroundColor: '#0A192F', width: '80%', margin: '0 auto 6px' }} />
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      letterSpacing: '0.08em',
                      color: '#0A192F',
                      textTransform: 'uppercase'
                    }}
                  >
                    {mentorName}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.68rem',
                      color: '#64748B',
                      fontWeight: '600'
                    }}
                  >
                    Engineering Manager &amp; Mentor
                  </div>
                </div>
              </div>

              {/* BOTTOM CRYPTOGRAPHIC REGISTRY METADATA BAR */}
              <div
                style={{
                  borderTop: '1px solid rgba(197, 160, 89, 0.45)',
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.68rem',
                  color: '#64748B',
                  fontWeight: '600'
                }}
              >
                <div>
                  Certificate No: <strong style={{ color: '#0A192F' }}>{certId}</strong> &nbsp;|&nbsp; Candidate ID:{' '}
                  <strong style={{ color: '#0A192F' }}>{candidateId}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: isAvailable ? '#059669' : '#B45309', fontWeight: '700' }}>
                  <FaShieldAlt size={11} />
                  {isAvailable ? 'CRYPTOGRAPHICALLY VERIFIED & ISSUED' : 'OFFICIAL TEMPLATE PREVIEW'}
                </div>
                <div>
                  Date of Issuance: <strong style={{ color: '#0A192F' }}>{issueDate}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive Modal for Previewing, Printing, Issuing, and Downloading Official Certificates
 */
export function CertificatePreviewModal({ cert, onClose, onIssue, onDownload }) {
  const [viewMode, setViewMode] = useState('DESIGN'); // 'DESIGN' | 'PDF'
  if (!cert) return null;

  const backendBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  const certId = cert.id || `CERT-${cert.candidateId || 'INT-201'}`;
  const pdfUrl = `${backendBase}/certificates/download/${certId}`;
  const isAvailable = (cert.certificateStatus || cert.status) === 'AVAILABLE';

  const handlePrint = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '980px',
          width: '95vw',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '12px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
            >
              <FaAward />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {cert.certificateType || 'Official Completion Certificate'}
                </h3>
                <span className={`badge ${isAvailable ? 'badge-success' : 'badge-warning'}`}>
                  {isAvailable ? 'ISSUED & VERIFIED' : cert.certificateStatus || 'PREVIEW'}
                </span>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Recipient: <strong>{cert.candidateName}</strong> ({cert.candidateId}) • Role: <strong>{cert.role}</strong>
              </div>
            </div>
          </div>

          {/* VIEW MODE SWITCHER & CLOSE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '3px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)'
              }}
            >
              <button
                onClick={() => setViewMode('DESIGN')}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: viewMode === 'DESIGN' ? 'var(--brand-primary)' : 'transparent',
                  color: viewMode === 'DESIGN' ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                <FaEye size={11} /> Executive View
              </button>
              <button
                onClick={() => setViewMode('PDF')}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: viewMode === 'PDF' ? 'var(--brand-primary)' : 'transparent',
                  color: viewMode === 'PDF' ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                <FaFilePdf size={11} /> Official PDF Stream
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Close certificate viewer"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#0F172A',
            backgroundImage: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
            padding: '24px'
          }}
        >
          {viewMode === 'DESIGN' ? (
            <OfficialCertificateCard cert={cert} />
          ) : (
            <iframe
              src={pdfUrl}
              title={`Certificate PDF - ${cert.candidateName}`}
              width="100%"
              height="560px"
              style={{
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
              }}
            />
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <FaShieldAlt color="#10B981" />
            <span>Authenticated by Ragnify Enterprise HR Credential Engine • Tamper-Evident Seal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isAvailable && onIssue && (
              <button
                className="btn-primary"
                onClick={() => onIssue(cert)}
                style={{
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  backgroundColor: '#10B981',
                  borderColor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FaCheckCircle size={12} /> Approve &amp; Issue Certificate Now
              </button>
            )}

            <button
              className="btn-secondary"
              onClick={handlePrint}
              style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaPrint size={12} /> Open Printable PDF
            </button>

            <button
              className="btn-primary"
              onClick={() => (onDownload ? onDownload(cert) : handlePrint())}
              style={{ padding: '7px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaDownload size={12} /> Download Official PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificatePreviewModal;

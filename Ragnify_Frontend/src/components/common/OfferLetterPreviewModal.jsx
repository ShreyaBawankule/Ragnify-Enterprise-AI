import React, { useState } from 'react';
import {
  FaTimes as X,
  FaDownload as Download,
  FaPrint as Printer,
  FaShieldAlt as ShieldCheck,
  FaFileAlt as FileText,
  FaStar as Sparkles,
  FaExternalLinkAlt as ExternalLink,
  FaCheckCircle as CheckCircle2,
  FaBuilding as Building2,
  FaEnvelope as Mail,
  FaCalendarAlt as Calendar,
  FaBriefcase as Briefcase
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Reusable Formal Corporate Offer Letter Component (A4 Executive Letterhead)
 */
export const OfficialOfferLetterCard = ({ offer = {}, compact = false }) => {
  const candidateName = offer.candidateName || offer.name || 'Ananya Sharma';
  const candidateId = offer.applicationId || offer.candidateId || offer.id || 'CAND-001';
  const candidateEmail = offer.candidateEmail || offer.email || `${String(candidateId).toLowerCase()}@ragnify.com`;
  const role = offer.role || offer.designation || 'Senior AI Engineer';
  const department = offer.department || 'AI & Data Science';
  const type = offer.type || (String(role).toLowerCase().includes('intern') ? 'Intern' : 'Employee');
  const isIntern = String(type).toLowerCase() === 'intern' || String(role).toLowerCase().includes('intern');
  const compensation = offer.stipendSalary || offer.compensation || (isIntern ? '₹25,000 / mo' : '₹12,00,000 / yr');
  const reportingManager = offer.reportingManager || 'Dr. Rajesh Khanna, Head of AI';
  const joiningDate = offer.joiningDate || '2026-06-15';
  const generatedDate = offer.generatedDate || '2026-06-01';
  const status = offer.status || 'ISSUED';
  const isSigned = String(status).toUpperCase() === 'COUNTERSIGNED' || String(status).toUpperCase() === 'ACCEPTED';
  const refNo = `RAG/HR/2026/${candidateId}`;

  return (
    <div
      className="official-offer-letter-canvas"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: compact ? '780px' : '860px',
        margin: '0 auto',
        background: '#FFFFFF',
        borderRadius: '10px',
        padding: compact ? '12px' : '16px',
        boxShadow: '0 24px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08)',
        color: '#0F172A',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Outer Subtle Double Frame */}
      <div
        style={{
          position: 'relative',
          border: '1px solid #CBD5E1',
          borderRadius: '6px',
          padding: '3px',
          background: '#FFFFFF'
        }}
      >
        <div
          style={{
            position: 'relative',
            border: '1.5px solid rgba(197, 155, 39, 0.55)',
            borderRadius: '4px',
            overflow: 'hidden',
            background: '#FFFFFF'
          }}
        >
          {/* Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '54%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-26deg)',
              fontSize: compact ? '3.4rem' : '4.4rem',
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 800,
              color: 'rgba(15, 23, 42, 0.028)',
              letterSpacing: '0.18em',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            RAGNIFY OFFICIAL
          </div>

          {/* 1. Executive Royal Navy & Gold Corporate Letterhead Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0B1528 0%, #16284C 100%)',
              borderBottom: '4px solid #C59B27',
              padding: compact ? '20px 24px' : '26px 34px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Left Brand Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: compact ? '48px' : '54px',
                  height: compact ? '48px' : '54px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #1E293B 0%, #0B1528 100%)',
                  border: '2px solid #C59B27',
                  boxShadow: '0 0 0 3px rgba(197, 155, 39, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <span
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: compact ? '1.35rem' : '1.55rem',
                    fontWeight: 800,
                    color: '#F5E6B3'
                  }}
                >
                  R
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: compact ? '1.05rem' : '1.22rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '0.04em'
                  }}
                >
                  RAGNIFY ENTERPRISE TECHNOLOGIES INC.
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#F5E6B3',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginTop: '3px'
                  }}
                >
                  Global People Operations &bull; Executive Talent Acquisition Division
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: '#94A3B8',
                    marginTop: '5px',
                    lineHeight: 1.4
                  }}
                >
                  Prestige Tech Park, Outer Ring Road, Bengaluru 560103 &nbsp;|&nbsp; CIN: U72900KA2026PLC184920
                </div>
              </div>
            </div>

            {/* Right Document Control Box */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(197, 155, 39, 0.55)',
                borderRadius: '8px',
                padding: '10px 14px',
                minWidth: '215px',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: '#F5E6B3',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}
              >
                Document Classification
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={13} style={{ color: '#C59B27' }} /> CONFIDENTIAL OFFER
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginTop: '4px'
                }}
              >
                REF: {refNo}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '1px' }}>
                ISSUED: {generatedDate}
              </div>
            </div>
          </div>

          {/* Main Letter Body Container */}
          <div
            style={{
              padding: compact ? '22px 26px' : '30px 38px',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* 2. Recipient & Dossier Metadata Grid */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '20px',
                flexWrap: 'wrap',
                paddingBottom: '18px',
                borderBottom: '1px solid #E2E8F0',
                marginBottom: '18px'
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#A67C1E',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  Addressed To Recipient
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  {candidateName}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '3px' }}>
                  Official Email: <strong style={{ color: '#1E293B' }}>{candidateEmail}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                  Assigned Practice: <strong style={{ color: '#1E293B' }}>{department} Division</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#A67C1E',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  Appointment Dossier Metadata
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                  Candidate ID: <span style={{ fontFamily: 'monospace', color: '#2563EB' }}>{candidateId}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '3px' }}>
                  Employment Track:{' '}
                  <strong style={{ color: '#0F172A' }}>
                    {isIntern ? 'Stipendiary Internship Cohort' : 'Full-Time Executive Cadre (FTE)'}
                  </strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                  Effective Joining Date: <strong style={{ color: '#059669' }}>{joiningDate}</strong>
                </div>
              </div>
            </div>

            {/* 3. Formal Subject Line Box */}
            <div
              style={{
                background: '#FDFBF7',
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #C59B27',
                borderRadius: '4px',
                padding: '10px 16px',
                marginBottom: '18px'
              }}
            >
              <div
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  color: '#0B1528',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                SUBJECT: FORMAL LETTER OF OFFER &amp;{' '}
                {isIntern ? 'INTERNSHIP APPOINTMENT' : 'FULL-TIME EMPLOYMENT APPOINTMENT'} &mdash; {role}
              </div>
            </div>

            {/* 4. Salutation & Opening Narrative */}
            <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.65, marginBottom: '20px' }}>
              <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Dear {candidateName},
              </p>
              <p style={{ margin: 0 }}>
                Congratulations! Subsequent to our executive evaluation panels and technical assessments,{' '}
                <strong style={{ color: '#0F172A' }}>RAGNIFY Enterprise Technologies Inc.</strong> (&ldquo;the
                Company&rdquo;) is delighted to extend this formal Offer of{' '}
                {isIntern ? 'Internship' : 'Appointment'} for the position of{' '}
                <strong style={{ color: '#0B1528' }}>{role}</strong> within our{' '}
                <strong style={{ color: '#0B1528' }}>{department}</strong> division, effective{' '}
                <strong style={{ color: '#0F172A' }}>{joiningDate}</strong>. Your analytical rigor, engineering
                craftsmanship, and alignment with our core leadership principles stood out strongly across our
                selection benchmarks.
              </p>
            </div>

            {/* 5. Section 01: Executive Appointment & Remuneration Schedule Table */}
            <div style={{ marginBottom: '22px' }}>
              <div
                style={{
                  background: '#0B1528',
                  color: '#F5E6B3',
                  padding: '7px 14px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px'
                }}
              >
                <span>SECTION 01 &bull; EXECUTIVE APPOINTMENT &amp; REMUNERATION SCHEDULE (ANNEXURE A)</span>
                <span style={{ color: '#94A3B8', fontSize: '0.65rem' }}>VERIFIED BY HR GOVERNANCE</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  border: '1px solid #CBD5E1',
                  borderTop: 'none',
                  borderBottomLeftRadius: '4px',
                  borderBottomRightRadius: '4px',
                  overflow: 'hidden',
                  fontSize: '0.79rem'
                }}
              >
                {[
                  { label: 'Designated Role / Title', value: role, highlight: true },
                  { label: 'Department & Practice', value: `${department} Division` },
                  {
                    label: 'Appointment Classification',
                    value: isIntern ? 'Stipendiary Internship' : 'Full-Time Permanent (FTE)'
                  },
                  { label: 'Reporting Authority', value: reportingManager },
                  { label: 'Effective Joining Date', value: joiningDate },
                  { label: 'Work Location & Mode', value: 'Bengaluru HQ (Hybrid - 3 Days/Wk)' },
                  {
                    label: isIntern ? 'Approved Monthly Stipend' : 'Approved Total Annual CTC',
                    value: compensation,
                    emerald: true
                  },
                  {
                    label: 'Probation / Tenure Evaluation',
                    value: isIntern ? 'Duration of Internship Cohort' : '90 Days Executive Probation'
                  },
                  { label: 'Executive Medical Insurance', value: '₹5,00,000 Floating Group Cover' },
                  { label: 'Standard Working Schedule', value: '40 Hours / Week (Mon – Fri)' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44% 56%',
                      borderBottom: idx < 8 ? '1px solid #E2E8F0' : 'none',
                      borderRight: idx % 2 === 0 ? '1px solid #E2E8F0' : 'none',
                      background: Math.floor(idx / 2) % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 12px',
                        background: '#F1F5F9',
                        fontWeight: 700,
                        color: '#1E293B',
                        borderRight: '1px solid #E2E8F0',
                        fontSize: '0.74rem'
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        padding: '8px 12px',
                        fontWeight: item.emerald || item.highlight ? 800 : 600,
                        color: item.emerald ? '#059669' : item.highlight ? '#0B1528' : '#334155',
                        fontSize: '0.77rem'
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Section 02: Terms of Appointment, Covenants & Statutory Compliance */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  background: '#0B1528',
                  color: '#F5E6B3',
                  padding: '7px 14px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  marginBottom: '12px'
                }}
              >
                SECTION 02 &bull; TERMS OF APPOINTMENT, COVENANTS &amp; STATUTORY COMPLIANCE
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.78rem', lineHeight: 1.55, color: '#334155' }}>
                <div>
                  <strong style={{ color: '#0B1528' }}>01. Duties &amp; Professional Ethics:</strong> You shall
                  devote your full professional time, attention, and technical craft to the initiatives of RAGNIFY
                  Enterprise Technologies Inc. and adhere strictly to our Enterprise Code of Conduct &amp; InfoSec
                  Governance Policies.
                </div>
                <div>
                  <strong style={{ color: '#0B1528' }}>02. Intellectual Property &amp; Confidentiality (NDA):</strong>{' '}
                  All source code, AI/ML models, RAG architectures, proprietary datasets, and technical artifacts
                  conceived or authored during your tenure shall remain the exclusive intellectual property of the
                  Company.
                </div>
                <div>
                  <strong style={{ color: '#0B1528' }}>03. Background &amp; KYC Credential Verification:</strong> This
                  appointment remains contingent upon satisfactory verification of your submitted identity documents
                  (PAN/Aadhaar), academic transcripts, and prior employment clearances by HR Compliance.
                </div>
                <div>
                  <strong style={{ color: '#0B1528' }}>04. Notice Period &amp; Separation Governance:</strong>{' '}
                  {isIntern
                    ? 'Either party may terminate this internship arrangement with 15 calendar days written notice.'
                    : 'Following the 90-day probation period (15-day notice), a formal notice period of 60 calendar days applies to either party.'}
                </div>
                <div>
                  <strong style={{ color: '#0B1528' }}>05. Offer Validity &amp; Digital Acceptance:</strong> Please
                  countersign and return a copy of this Offer Letter within <strong>15 calendar days</strong> from the
                  date of issuance, failing which this offer shall stand automatically withdrawn unless extended in
                  writing.
                </div>
              </div>
            </div>

            {/* 7. Section 03: Dual Signatures & Official HR Seal */}
            <div
              style={{
                borderTop: '1.5px solid #C59B27',
                paddingTop: '20px',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1.15fr',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              {/* Left: Authorized HR Signatory */}
              <div>
                <div
                  style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    color: '#64748B',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}
                >
                  For RAGNIFY Enterprise Technologies Inc.
                </div>
                <div
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontStyle: 'italic',
                    fontWeight: 700,
                    fontSize: '1.35rem',
                    color: '#16284C',
                    marginBottom: '4px'
                  }}
                >
                  Priya Sharma
                </div>
                <div style={{ width: '175px', height: '1px', background: '#94A3B8', marginBottom: '6px' }} />
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>Priya Sharma</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                  VP &mdash; Human Resources &amp; People Operations
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Authorized Executive Signatory</div>
              </div>

              {/* Center: Official Gold & Navy Corporate Seal */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    background: '#FDFBF7',
                    border: '2px solid #C59B27',
                    boxShadow: 'inset 0 0 0 3px #FFFFFF, inset 0 0 0 4px rgba(197, 155, 39, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '6px'
                  }}
                >
                  <div style={{ fontSize: '0.45rem', fontWeight: 800, color: '#0B1528', letterSpacing: '0.06em' }}>
                    RAGNIFY TECHNOLOGIES
                  </div>
                  <div
                    style={{
                      fontSize: '0.54rem',
                      fontWeight: 900,
                      color: '#A67C1E',
                      margin: '3px 0',
                      letterSpacing: '0.05em'
                    }}
                  >
                    OFFICIAL HR SEAL
                  </div>
                  <div
                    style={{
                      fontSize: '0.48rem',
                      fontWeight: 800,
                      color: '#059669',
                      background: '#ECFDF5',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      border: '1px solid #A7F3D0'
                    }}
                  >
                    VERIFIED
                  </div>
                  <div style={{ fontSize: '0.44rem', fontFamily: 'monospace', color: '#64748B', marginTop: '2px' }}>
                    {candidateId}
                  </div>
                </div>
              </div>

              {/* Right: Candidate Acceptance & Counter-Signature Box */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: isSigned ? '1.5px solid #A7F3D0' : '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#0B1528',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Candidate Acceptance &amp; Declaration
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: isSigned ? '#ECFDF5' : '#FEF3C7',
                      color: isSigned ? '#059669' : '#B45309',
                      border: isSigned ? '1px solid #A7F3D0' : '1px solid #FDE68A'
                    }}
                  >
                    {isSigned ? 'COUNTERSIGNED' : 'AWAITING SIGNATURE'}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#475569', marginBottom: '10px' }}>
                  I hereby accept the appointment terms &amp; covenants set forth in this Official Offer Letter.
                </div>

                {isSigned ? (
                  <div
                    style={{
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                      fontStyle: 'italic',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#059669',
                      borderBottom: '1px solid #CBD5E1',
                      paddingBottom: '4px',
                      marginBottom: '6px'
                    }}
                  >
                    {candidateName}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontStyle: 'italic',
                      color: '#94A3B8',
                      borderBottom: '1px dashed #CBD5E1',
                      paddingBottom: '6px',
                      marginBottom: '6px'
                    }}
                  >
                    Candidate Signature: ___________________________
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    color: '#334155',
                    fontWeight: 600
                  }}
                >
                  <span>Name: {candidateName}</span>
                  <span>Date: {isSigned ? generatedDate : '____/____/2026'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 8. Bottom Security Verification Strip */}
          <div
            style={{
              background: '#0B1528',
              padding: '8px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '0.68rem',
              color: '#94A3B8'
            }}
          >
            <span style={{ fontFamily: 'monospace', color: '#F5E6B3', fontWeight: 700 }}>
              SHA-256 DIGITAL SIGNATURE VERIFIED &bull; DOC-ID: {refNo}
            </span>
            <span>Page 1 of 1 &bull; RAGNIFY Automated HR Onboarding Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Full-Screen Executive Modal for Previewing, Printing & Downloading Offer Letters
 */
const OfferLetterPreviewModal = ({ isOpen, onClose, offer }) => {
  const [viewMode, setViewMode] = useState('letterhead'); // 'letterhead' | 'pdf'

  if (!isOpen || !offer) return null;

  const candidateId = offer.applicationId || offer.candidateId || offer.id || 'CAND-001';
  const pdfEndpoint = offer.fileUrl?.startsWith('http')
    ? offer.fileUrl
    : `${API_BASE}${offer.fileUrl || `/offer-letters/download/${candidateId}`}`;

  const handlePrint = () => {
    window.open(pdfEndpoint, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          maxHeight: '93vh',
          background: 'var(--bg-card, #0F172A)',
          border: '1px solid var(--border-color, #1E293B)',
          borderRadius: '16px',
          boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.65)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Action Bar */}
        <div
          style={{
            padding: '14px 22px',
            background: 'linear-gradient(90deg, #0B1528 0%, #16284C 100%)',
            borderBottom: '1px solid rgba(197, 155, 39, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(197, 155, 39, 0.16)',
                border: '1px solid rgba(197, 155, 39, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F5E6B3'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Official Executive Offer Letter &mdash; {offer.candidateName}
                </h3>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(16, 185, 129, 0.18)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.35)'
                  }}
                >
                  SHA-256 Verified
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                Ref: RAG/HR/2026/{candidateId} &bull; {offer.role} ({offer.department})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('letterhead')}
                style={{
                  padding: '5px 11px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: viewMode === 'letterhead' ? '#C59B27' : 'transparent',
                  color: viewMode === 'letterhead' ? '#0B1528' : '#CBD5E1'
                }}
              >
                <Sparkles size={13} /> Executive Letterhead
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pdf')}
                style={{
                  padding: '5px 11px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: viewMode === 'pdf' ? '#C59B27' : 'transparent',
                  color: viewMode === 'pdf' ? '#0B1528' : '#CBD5E1'
                }}
              >
                <FileText size={13} /> Official PDF Stream
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '7px 12px',
                fontSize: '0.76rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#F8FAFC',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={14} /> Print / Open PDF
            </button>

            <a
              href={pdfEndpoint}
              download={`${candidateId}_Official_Offer_Letter.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '7px 14px',
                fontSize: '0.76rem',
                fontWeight: 700,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #C59B27 0%, #A67C1E 100%)',
                color: '#0B1528',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} /> Download PDF
            </a>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: viewMode === 'letterhead' ? '28px 24px' : '0',
            background:
              viewMode === 'letterhead'
                ? 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)'
                : '#0F172A'
          }}
        >
          {viewMode === 'letterhead' ? (
            <OfficialOfferLetterCard offer={offer} />
          ) : (
            <iframe
              src={pdfEndpoint}
              title={`Offer Letter PDF - ${offer.candidateName}`}
              style={{
                width: '100%',
                height: '76vh',
                border: 'none',
                background: '#FFFFFF'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferLetterPreviewModal;

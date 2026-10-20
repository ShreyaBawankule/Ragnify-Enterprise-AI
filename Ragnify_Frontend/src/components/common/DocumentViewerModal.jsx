import React, { useState } from 'react';
import { 
  FaTimes, 
  FaExternalLinkAlt, 
  FaDownload, 
  FaCheck, 
  FaFilePdf, 
  FaImage, 
  FaShieldAlt,
  FaFileAlt
} from 'react-icons/fa';
import { StatusBadge } from './StatCard';

export function DocumentViewerModal({ doc, candidateName, candidateType, onClose, onVerify }) {
  if (!doc) return null;

  const [loadError, setLoadError] = useState(false);
  const backendBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Construct Document URL
  const rawFileName = doc.fileName || doc.filename || `${doc.candidateId || (candidateType === 'Intern' || doc.type === 'Intern' ? 'INT-201' : 'CAND-001')}_${doc.name || 'Resume'}.pdf`;
  const cleanFileName = rawFileName.endsWith('.pdf') || rawFileName.endsWith('.png') || rawFileName.endsWith('.jpg') || rawFileName.endsWith('.jpeg') 
    ? rawFileName 
    : `${rawFileName}.pdf`;
  const isImage = cleanFileName.toLowerCase().endsWith('.jpg') || cleanFileName.toLowerCase().endsWith('.jpeg') || cleanFileName.toLowerCase().endsWith('.png');
  
  const fullDocumentUrl = doc.fileUrl && doc.fileUrl.startsWith('http') 
    ? doc.fileUrl 
    : `${backendBase}/documents/view/${cleanFileName}`;

  const docTitle = doc.documentType || doc.label || doc.name || cleanFileName;
  const applicant = candidateName || doc.candidateName || 'Candidate';
  const roleType = candidateType || doc.type || 'Employee';

  const handleOpenNewTab = () => {
    window.open(fullDocumentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: '920px', 
          width: '94vw', 
          maxHeight: '92vh', 
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
            padding: '16px 20px', 
            borderBottom: '1px solid var(--border-default)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                backgroundColor: isImage ? '#FEF3C7' : '#EFF6FF', 
                color: isImage ? '#D97706' : '#2563EB',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0
              }}
            >
              {isImage ? <FaImage /> : <FaFilePdf />}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {docTitle}
                </h3>
                <span className={`badge ${roleType.toLowerCase() === 'intern' ? 'badge-primary' : 'badge-neutral'}`}>
                  {roleType}
                </span>
                <StatusBadge status={doc.status || 'VERIFIED'} />
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Candidate: <strong>{applicant}</strong> • File: <code>{rawFileName}</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn-secondary"
              onClick={handleOpenNewTab}
              title="Open original document in full browser tab"
              style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '6px' }}
            >
              <FaExternalLinkAlt size={11} /> Open in New Tab
            </button>

            <button 
              onClick={onClose} 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--text-muted)', 
                padding: '6px', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close viewer"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* MODAL BODY: DOCUMENT EMBEDDED VIEWER */}
        <div 
          style={{ 
            flex: 1, 
            minHeight: '480px', 
            maxHeight: '62vh', 
            overflowY: 'auto', 
            backgroundColor: '#1E293B', 
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isImage ? (
            <img 
              src={fullDocumentUrl} 
              alt={docTitle}
              onError={() => setLoadError(true)}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '560px', 
                objectFit: 'contain', 
                borderRadius: '6px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                backgroundColor: '#FFFFFF'
              }} 
            />
          ) : !loadError ? (
            <iframe
              src={fullDocumentUrl}
              title={docTitle}
              width="100%"
              height="560px"
              onError={() => setLoadError(true)}
              style={{ 
                border: 'none', 
                borderRadius: '6px', 
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)' 
              }}
            />
          ) : (
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                padding: '40px 30px', 
                borderRadius: '10px', 
                textAlign: 'center', 
                maxWidth: '520px',
                width: '100%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <FaFileAlt size={42} color="var(--brand-primary)" style={{ marginBottom: '14px' }} />
              <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: '700' }}>{docTitle}</h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Original verification document for <strong>{applicant}</strong> stored securely in HR records repository.
              </p>
              <button className="btn-primary" onClick={handleOpenNewTab} style={{ margin: '0 auto' }}>
                <FaExternalLinkAlt size={11} /> Open Original Document File
              </button>
            </div>
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
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <FaShieldAlt color="var(--status-success)" />
            <span>Encrypted Compliance Document • Verified by HR Operations</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-secondary" 
              onClick={() => {
                window.open(`${backendBase}/documents/download/${cleanFileName}`, '_blank');
              }}
              style={{ padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <FaDownload size={11} /> Download Document
            </button>

            <button className="btn-secondary" onClick={onClose} style={{ padding: '7px 14px' }}>
              Close
            </button>

            {onVerify && doc.status !== 'VERIFIED' && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  onVerify(doc.id || doc.key, 'VERIFIED');
                  onClose();
                }}
                style={{ padding: '7px 16px' }}
              >
                <FaCheck size={12} /> Mark Verified
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentViewerModal;

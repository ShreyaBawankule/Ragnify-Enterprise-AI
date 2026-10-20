import React from 'react';
import { FaFilePdf, FaFilePowerpoint, FaDownload, FaFileAlt } from 'react-icons/fa';

export function FormattedChatMessage({ 
  text, 
  downloadUrl, 
  fileType, 
  fileName, 
  suggestedActions = [], 
  onActionClick 
}) {
  if (!text) return null;

  // Resolve backend URL
  const backendBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  const fullDownloadUrl = downloadUrl 
    ? (downloadUrl.startsWith('http') ? downloadUrl : `${backendBase}${downloadUrl}`)
    : null;

  // Helper to parse inline markdown (bold, italic, code, interactive clickable actions)
  const renderInline = (str) => {
    // Replace [👉 action] or **bold** or *italic* or `code`
    const parts = str.split(/(\[👉\s*[^\]]+\]|\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('[👉') && part.endsWith(']')) {
        const actionLabel = part.slice(1, -1).replace(/^👉\s*/, '').trim();
        return (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onActionClick) onActionClick(actionLabel);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 9px',
              margin: '2px 4px',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: '700',
              backgroundColor: 'rgba(37, 99, 235, 0.09)',
              color: 'var(--brand-primary, #2563EB)',
              border: '1.5px solid rgba(37, 99, 235, 0.35)',
              cursor: 'pointer',
              verticalAlign: 'middle',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--brand-primary, #2563EB)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.09)';
              e.currentTarget.style.color = 'var(--brand-primary, #2563EB)';
            }}
            title={`Click to read: ${actionLabel}`}
          >
            <span>👉</span>
            <span>{actionLabel}</span>
          </button>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'inherit', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code 
            key={i} 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.06)', 
              padding: '2px 5px', 
              borderRadius: '4px', 
              fontSize: '0.85em',
              fontFamily: 'monospace' 
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Split lines into blocks
  const lines = text.split('\n');
  const renderedElements = [];
  let currentList = [];
  let listType = null; // 'ul' | 'ol'
  let inCodeBlock = false;
  let codeBlockLines = [];
  let codeBlockLang = '';

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ul') {
        renderedElements.push(
          <ul key={`list-${renderedElements.length}`} style={{ margin: '6px 0 10px 18px', padding: 0 }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px', lineHeight: '1.5' }}>
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
      } else if (listType === 'ol') {
        renderedElements.push(
          <ol key={`list-${renderedElements.length}`} style={{ margin: '6px 0 10px 18px', padding: 0 }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px', lineHeight: '1.5' }}>
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Code and Workflow Diagram Blocks (```...```)
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        flushList();
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockLines = [];
        return;
      } else {
        inCodeBlock = false;
        const codeContent = codeBlockLines.join('\n');
        const isDiagram = codeBlockLang.toLowerCase().includes('mermaid') || codeBlockLang.toLowerCase().includes('flow') || codeContent.includes('-->') || codeContent.includes('->');
        renderedElements.push(
          <div 
            key={`code-${idx}`} 
            style={{ 
              margin: '12px 0', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              border: '1.5px solid #334155', 
              backgroundColor: '#0B1528', 
              color: '#F8FAFC',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', backgroundColor: '#16284C', borderBottom: '1px solid #334155', fontSize: '0.75rem', fontWeight: 700, color: '#C59B27' }}>
              <span>{isDiagram ? '📊 Interactive Process Workflow Diagram' : (codeBlockLang.toUpperCase() || 'CODE / DIAGRAM')}</span>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{codeBlockLang || 'text'}</span>
            </div>
            <pre style={{ margin: 0, padding: '12px 14px', overflowX: 'auto', fontSize: '0.82rem', fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.45', color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
              {codeContent}
            </pre>
          </div>
        );
        codeBlockLines = [];
        return;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    if (!trimmed) {
      flushList();
      renderedElements.push(<div key={`br-${idx}`} style={{ height: '6px' }} />);
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      renderedElements.push(
        <h4 key={idx} style={{ margin: '12px 0 6px', fontSize: '0.98rem', fontWeight: '700', color: 'inherit' }}>
          {renderInline(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      renderedElements.push(
        <h3 key={idx} style={{ margin: '14px 0 8px', fontSize: '1.05rem', fontWeight: '800', color: 'inherit' }}>
          {renderInline(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList();
      renderedElements.push(
        <h2 key={idx} style={{ margin: '16px 0 8px', fontSize: '1.15rem', fontWeight: '800', color: 'inherit' }}>
          {renderInline(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      // Unordered list item
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      const content = trimmed.replace(/^[-*•]\s+/, '');
      currentList.push(content);
    } else if (/^\d+\.\s+/.test(trimmed)) {
      // Ordered list item
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      const content = trimmed.replace(/^\d+\.\s+/, '');
      currentList.push(content);
    } else if (trimmed.startsWith('💡') || trimmed.startsWith('📌') || trimmed.startsWith('> ')) {
      // Callout box
      flushList();
      const calloutText = trimmed.startsWith('> ') ? trimmed.slice(2) : trimmed;
      renderedElements.push(
        <div 
          key={idx} 
          style={{ 
            backgroundColor: 'rgba(79, 70, 229, 0.08)', 
            borderLeft: '3px solid #4F46E5', 
            padding: '8px 12px', 
            borderRadius: '0 6px 6px 0', 
            margin: '8px 0',
            fontSize: '0.86rem' 
          }}
        >
          {renderInline(calloutText)}
        </div>
      );
    } else {
      flushList();
      renderedElements.push(
        <p key={idx} style={{ margin: '0 0 6px', lineHeight: '1.55' }}>
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return (
    <div className="formatted-chat-message">
      {renderedElements}

      {/* Render Download Card if available */}
      {fullDownloadUrl && (
        <div 
          style={{
            marginTop: '14px',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: fileType === 'pptx' ? '#FFF7ED' : '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: fileType === 'pptx' ? '#EA580C' : '#DC2626',
                fontSize: '20px',
                flexShrink: 0
              }}
            >
              {fileType === 'pptx' ? <FaFilePowerpoint /> : <FaFilePdf />}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fileName || (fileType === 'pptx' ? 'Enterprise_Presentation.pptx' : 'Policy_Report.pdf')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {fileType === 'pptx' ? 'PowerPoint Presentation Deck (.pptx)' : 'Official PDF Document (.pdf)'}
              </div>
            </div>
          </div>

          <a
            href={fullDownloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: '600',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <FaDownload size={12} />
            <span>Download {fileType === 'pptx' ? 'PPT' : 'PDF'}</span>
          </a>
        </div>
      )}

      {/* Quick Interactive Action Pills Row */}
      {suggestedActions && suggestedActions.length > 0 && onActionClick && (
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed rgba(226, 232, 240, 0.8)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💡 Interactive Options (Click to view policy notification):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestedActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onActionClick(action);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  backgroundColor: '#F8FAFC',
                  color: '#1E293B',
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--brand-primary, #2563EB)';
                  e.currentTarget.style.borderColor = 'var(--brand-primary, #2563EB)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(37, 99, 235, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.color = '#1E293B';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                }}
              >
                <span>👉</span>
                <span>{action}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default FormattedChatMessage;

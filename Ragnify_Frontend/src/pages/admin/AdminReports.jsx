import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { useToast } from '../../context/ToastContext';
import {
  FaFileAlt,
  FaFileCsv,
  FaPrint,
  FaShieldAlt,
  FaRobot,
  FaServer,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaChevronDown
} from 'react-icons/fa';

const SECURITY_AUDIT_LOGS = [
  { id: 'LOG-8801', timestamp: '2026-10-12 11:45:22', user: 'System Admin', role: 'ADMIN', ip: '192.168.1.10', event: 'Role Permissions Modified', resource: '/admin/settings', severity: 'INFO', status: 'SUCCESS' },
  { id: 'LOG-8802', timestamp: '2026-10-12 11:32:05', user: 'Vikram Mehta', role: 'MANAGER', ip: '192.168.1.24', event: 'Sprint Task Assigned', resource: '/manager/tasks', severity: 'INFO', status: 'SUCCESS' },
  { id: 'LOG-8803', timestamp: '2026-10-12 11:15:40', user: 'Ananya Roy', role: 'INTERN', ip: '192.168.1.45', event: 'Daily Clock-In Shift Started', resource: '/intern/working-time', severity: 'INFO', status: 'SUCCESS' },
  { id: 'LOG-8804', timestamp: '2026-10-12 10:50:18', user: 'Rahul Verma', role: 'EMPLOYEE', ip: '192.168.1.18', event: 'RAG Assistant Document Query', resource: '/employee/rag-assistant', severity: 'INFO', status: 'SUCCESS' },
  { id: 'LOG-8805', timestamp: '2026-10-12 10:22:33', user: 'Priya Sharma', role: 'HR', ip: '192.168.1.15', event: 'Offer Letter Signed & Dispatched', resource: '/hr/offer-letters', severity: 'INFO', status: 'SUCCESS' },
  { id: 'LOG-8806', timestamp: '2026-10-12 09:15:02', user: 'Unknown IP', role: 'GUEST', ip: '203.0.113.195', event: 'Failed Authentication Attempt', resource: '/api/auth/token', severity: 'WARNING', status: 'BLOCKED' },
  { id: 'LOG-8807', timestamp: '2026-10-12 08:30:11', user: 'System Worker', role: 'SERVICE', ip: '127.0.0.1', event: 'Database Health Check Routine', resource: 'PostgreSQL /db/health', severity: 'INFO', status: 'SUCCESS' }
];

const AI_USAGE_METRICS = [
  { id: 'INF-401', timestamp: '2026-10-12 11:40', model: 'Groq Whisper-Large-v3', endpoint: '/api/transcribe', tokens: 1840, latency: '420ms', user: 'Vikram Mehta', outcome: 'Transcribed' },
  { id: 'INF-402', timestamp: '2026-10-12 11:22', model: 'GPT-OSS-70B (Groq)', endpoint: '/api/rag/chat', tokens: 920, latency: '310ms', user: 'Rahul Verma', outcome: 'Grounded in ChromaDB' },
  { id: 'INF-403', timestamp: '2026-10-12 10:55', model: 'GPT-OSS-70B (Groq)', endpoint: '/api/copilot/generate-pdf', tokens: 2450, latency: '750ms', user: 'Priya Sharma', outcome: 'PDF Synthesized' },
  { id: 'INF-404', timestamp: '2026-10-12 10:14', model: 'ChromaDB Cosine Indexer', endpoint: '/api/vector/index', tokens: 3200, latency: '190ms', user: 'System Worker', outcome: 'Indexed 12 Docs' },
  { id: 'INF-405', timestamp: '2026-10-12 09:48', model: 'GPT-OSS-70B (Groq)', endpoint: '/api/rag/chat', tokens: 680, latency: '280ms', user: 'Ananya Roy', outcome: 'Policy Retrieved' }
];

export function AdminReports() {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState('SECURITY_AUDIT'); // 'SECURITY_AUDIT' | 'AI_METRICS'
  const [filterSeverity, setFilterSeverity] = useState('ALL'); // 'ALL' | 'INFO' | 'WARNING'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Security Logs
  const filteredLogs = useMemo(() => {
    return SECURITY_AUDIT_LOGS.filter(item => {
      const matchesSeverity = filterSeverity === 'ALL' || item.severity === filterSeverity;
      const matchesSearch = item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.resource.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [filterSeverity, searchQuery]);

  // Filter AI Metrics
  const filteredAI = useMemo(() => {
    return AI_USAGE_METRICS.filter(item => {
      return item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    if (selectedReport === 'SECURITY_AUDIT') {
      const headers = ['Log ID', 'Timestamp', 'User', 'Role', 'IP Address', 'Event', 'Resource', 'Severity', 'Status'];
      const rows = filteredLogs.map(l => [l.id, l.timestamp, l.user, l.role, l.ip, l.event, l.resource, l.severity, l.status]);
      downloadCSV('Platform_Security_Access_Audit_Log.csv', rows, headers);
    } else {
      const headers = ['Inference ID', 'Timestamp', 'Model', 'Endpoint', 'Tokens Consumed', 'Latency', 'Invoking User', 'Outcome'];
      const rows = filteredAI.map(a => [a.id, a.timestamp, a.model, a.endpoint, a.tokens, a.latency, a.user, a.outcome]);
      downloadCSV('AI_Model_Inference_Metrics_Report.csv', rows, headers);
    }
    showToast('Exported audit report (CSV) successfully!', 'success');
  };

  const downloadCSV = (filename, data, headers) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print / Save PDF
  const handlePrintPDF = () => {
    showToast('Preparing formatted audit report view for printing...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // State for single Download button with format slicer dropdown
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setDownloadMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <MainLayout title="Admin Reports">
      <div className="fade-in">
        <PageHeader
          title="Platform Governance & Infrastructure Reports"
          subtitle="Audit platform security logs, inspect AI inference consumption, and export compliance records"
          actions={
            <div ref={downloadRef} style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                className="btn-primary" 
                onClick={() => setDownloadMenuOpen(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <FaDownload size={13} />
                <span>Download Report</span>
                <FaChevronDown 
                  size={11} 
                  style={{ 
                    transform: downloadMenuOpen ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 0.2s ease',
                    opacity: 0.85
                  }} 
                />
              </button>

              {/* Slicer Dropdown Menu for Download Formats */}
              {downloadMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  backgroundColor: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-default, #e2e8f0)',
                  borderRadius: 'var(--radius-md, 8px)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  minWidth: '220px',
                  zIndex: 100,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{
                    padding: '6px 10px 4px 10px',
                    fontSize: '0.6875rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted, #94a3b8)',
                    letterSpacing: '0.05em'
                  }}>
                    Select Download Format
                  </div>

                  {/* CSV Slicer Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadMenuOpen(false);
                      handleExportCSV();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary, #1e293b)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover, rgba(0,0,0,0.05))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      flexShrink: 0
                    }}>
                      <FaFileCsv size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.8125rem' }}>Export as CSV</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #64748b)' }}>Spreadsheet file (.csv)</div>
                    </div>
                  </button>

                  {/* PDF Slicer Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadMenuOpen(false);
                      handlePrintPDF();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary, #1e293b)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover, rgba(0,0,0,0.05))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3b82f6',
                      flexShrink: 0
                    }}>
                      <FaPrint size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.8125rem' }}>Print / Save as PDF</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #64748b)' }}>Document format (.pdf)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          }
        />

        {/* Top KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <FaShieldAlt size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audit Events Logged</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>1,842 Total</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <FaServer size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>API & Service Uptime</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>99.98% Online</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <FaRobot size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Inferences Today</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>1,420 Queries</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <FaCheckCircle size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compliance Health</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>100% Verified</div>
            </div>
          </div>
        </div>

        {/* Tab Selector & Filter Controls */}
        <div className="card" style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn-secondary ${selectedReport === 'SECURITY_AUDIT' ? 'active' : ''}`}
              style={{
                fontSize: '0.8125rem',
                padding: '8px 16px',
                backgroundColor: selectedReport === 'SECURITY_AUDIT' ? 'var(--primary-color, #2563eb)' : 'transparent',
                color: selectedReport === 'SECURITY_AUDIT' ? '#fff' : 'var(--text-secondary)',
                borderColor: selectedReport === 'SECURITY_AUDIT' ? 'var(--primary-color, #2563eb)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => setSelectedReport('SECURITY_AUDIT')}
            >
              <FaShieldAlt size={12} /> Security & Access Audit Log
            </button>

            <button
              className={`btn-secondary ${selectedReport === 'AI_METRICS' ? 'active' : ''}`}
              style={{
                fontSize: '0.8125rem',
                padding: '8px 16px',
                backgroundColor: selectedReport === 'AI_METRICS' ? 'var(--primary-color, #2563eb)' : 'transparent',
                color: selectedReport === 'AI_METRICS' ? '#fff' : 'var(--text-secondary)',
                borderColor: selectedReport === 'AI_METRICS' ? 'var(--primary-color, #2563eb)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => setSelectedReport('AI_METRICS')}
            >
              <FaRobot size={12} /> AI Inference & Latency Report
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {selectedReport === 'SECURITY_AUDIT' && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {['ALL', 'INFO', 'WARNING'].map(s => (
                  <button
                    key={s}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: `1px solid ${filterSeverity === s ? 'var(--primary-color, #2563eb)' : 'var(--border-color)'}`,
                      backgroundColor: filterSeverity === s ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                      color: filterSeverity === s ? '#60a5fa' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setFilterSeverity(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div style={{ position: 'relative', minWidth: '220px' }}>
              <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={12} />
              <input
                type="text"
                placeholder="Search audit records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Report Content */}
        {selectedReport === 'SECURITY_AUDIT' ? (
          <div className="table-card">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Platform Access & Security Event Stream
                </h3>
                <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Auditing {filteredLogs.length} recent system events with cryptographic verification
                </div>
              </div>
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaCheckCircle size={10} /> Tamper-Proof Audit
              </span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp & ID</th>
                    <th>User & Role</th>
                    <th>IP Address</th>
                    <th>Event Description</th>
                    <th>Target Resource</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(l => (
                    <tr key={l.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{l.timestamp}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{l.id}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{l.user}</div>
                        <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{l.role}</span>
                      </td>
                      <td><code>{l.ip}</code></td>
                      <td>{l.event}</td>
                      <td><code>{l.resource}</code></td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: l.severity === 'WARNING' ? '#f59e0b' : '#3b82f6'
                        }}>
                          {l.severity}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={l.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-card">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  AI Model Inference Consumption & Grounding Telemetry
                </h3>
                <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Monitored executions across Groq LLM clusters and ChromaDB Vector Store
                </div>
              </div>
              <span className="badge badge-neutral">Real-time Telemetry</span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Inference ID</th>
                    <th>Timestamp</th>
                    <th>Model Cluster</th>
                    <th>Endpoint</th>
                    <th>Tokens</th>
                    <th>Latency</th>
                    <th>Invoking User</th>
                    <th>Retrieval Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAI.map(a => (
                    <tr key={a.id}>
                      <td><strong>{a.id}</strong></td>
                      <td>{a.timestamp}</td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#8b5cf6' }}>{a.model}</div>
                      </td>
                      <td><code>{a.endpoint}</code></td>
                      <td><strong>{a.tokens}</strong></td>
                      <td><span style={{ color: '#10b981', fontWeight: '700' }}>{a.latency}</span></td>
                      <td>{a.user}</td>
                      <td>
                        <span className="badge badge-neutral">{a.outcome}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminReports;

import React, { useState, useRef, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { ragService } from '../../api/ragService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FormattedChatMessage } from '../../components/common/FormattedChatMessage';
import { 
  FaBookOpen, 
  FaPaperPlane, 
  FaFileUpload, 
  FaFileAlt, 
  FaCheckCircle, 
  FaPlus, 
  FaComments, 
  FaCopy, 
  FaCheck, 
  FaTrashAlt, 
  FaPaperclip,
  FaShieldAlt,
  FaLock,
  FaDatabase
} from 'react-icons/fa';
import '../../styles/ai.css';

export function RAGAssistantPage() {
  const { user } = useAuth();
  const userRole = (user?.role || 'EMPLOYEE').toUpperCase();
  const userName = user?.name || 'Rahul Verma';
  const userEmail = user?.email || '';

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [sidebarTab, setSidebarTab] = useState('docs'); // Show live ChromaDB docs & RBAC tiers readily
  const [uploadTier, setUploadTier] = useState('COMPANY_INTERNAL');

  const feedRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

  const [activeChatId, setActiveChatId] = useState(1);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Enterprise Policy & RBAC Session', date: 'Active' },
    { id: 2, title: 'Equipment allowance inquiry', date: 'Yesterday' },
    { id: 3, title: 'Annual leave & holiday policy', date: '3 days ago' }
  ]);

  const [kbSummary, setKbSummary] = useState({
    total_documents: 0,
    accessible_documents_count: 0,
    total_chunks: 0,
    documents: []
  });
  const [uploading, setUploading] = useState(false);

  const getDefaultRoleActions = (role) => {
    const r = (role || 'EMPLOYEE').toUpperCase();
    if (r === 'INTERN') {
      return [
        'Internship Stipend Policy',
        '92-Day Tenure Roadmap',
        'Intern Leave & Attendance',
        '3-Stage Certificate Unlock',
        'PPO Conversion Criteria',
        'Engineering & Coding Standards'
      ];
    }
    if (r === 'MANAGER') {
      return [
        'Performance Appraisal & Bonus Rubric',
        '45-Day PIP Protocol',
        'Squad Discretionary Budget',
        'Annual Leave Policy',
        'Equipment Allowance Policy (₹5,500)'
      ];
    }
    if (r === 'HR' || r === 'ADMIN') {
      return [
        'Annual Leave Policy',
        'Equipment Allowance Policy (₹5,500)',
        'L1–L4 Salary & ESOP Bands',
        'Severance & Termination Protocol',
        'Internship Program Governance',
        'Generate Policy PDF Report'
      ];
    }
    return [
      'Annual Leave Policy',
      'Sick & Emergency Leave Policy',
      'Equipment Allowance Policy (₹5,500)',
      'Health Insurance & Medical Coverage',
      'Hybrid & Remote Work (WFH) Guidelines',
      'Generate Leave Policy PDF'
    ];
  };

  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      sender: 'ai',
      text: `Hello **${userName}**! How can I help you today? What would you like to know?`,
      sources: [`Clearance: ${userRole}`],
      suggestedActions: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const loadKnowledgeInventory = async () => {
    const data = await ragService.getDocuments(userRole);
    if (data && Array.isArray(data.documents)) {
      setKbSummary(data);
    }
  };

  useEffect(() => {
    loadKnowledgeInventory();
  }, [userRole]);

  const getRolePromptStarters = () => {
    if (userRole === 'HR' || userRole === 'ADMIN') {
      return [
        {
          title: 'L1–L4 Salary & ESOP Grids',
          desc: 'Query HR Master Compensation & Equity bands',
          query: 'What are the 2026 L1 to L4 salary bands, ESOP units, and severance rules?'
        },
        {
          title: 'ChromaDB Document Inventory',
          desc: 'List all indexed PDFs, chunks & RBAC tiers',
          query: 'How many documents are stored in ChromaDB and what are their RBAC access tiers?'
        },
        {
          title: 'Generate Leave Policy PDF',
          desc: 'Download formal PDF report on employee leaves',
          query: 'Generate a PDF report for company leave and attendance policy'
        },
        {
          title: 'Manager Appraisal Rubric',
          desc: 'Inspect 1–5 rating scale, bonus pool & PIP rules',
          query: 'What is the manager performance appraisal rating scale, bonus pool, and 45-day PIP protocol?'
        }
      ];
    }

    if (userRole === 'MANAGER') {
      return [
        {
          title: 'Manager Appraisal & PIP Playbook',
          desc: '1–5 rating bonus pool, squad budget & PIP rules',
          query: 'What is our manager appraisal rating bonus rubric, ₹1,50,000 squad budget, and 45-day PIP protocol?'
        },
        {
          title: 'Team Workload & Progress',
          desc: 'Check live team task completion & optimal load',
          query: 'What are the workload balancing thresholds and my team’s current task completion status?'
        },
        {
          title: 'Employee Leave & Benefits',
          desc: '18 casual leaves, 12 sick leaves & ₹5,500 allowance',
          query: 'Summarize the full-time employee leave policy, equipment allowance, and health insurance.'
        },
        {
          title: 'Generate Onboarding PPT',
          desc: 'Build a slide deck for engineering & onboarding',
          query: 'Create a PowerPoint presentation deck on engineering architecture and sprint guidelines'
        }
      ];
    }

    // Default: EMPLOYEE
    return [
      {
        title: 'Leave & Holiday Entitlements',
        desc: '18 casual leaves, 12 sick leaves & 10 holidays',
        query: 'What is the full-time annual paid leave, sick leave, and carry-forward policy?'
      },
      {
        title: 'Equipment & Health Benefits',
        desc: '₹5,500 tech stipend, ₹5L insurance & hybrid work',
        query: 'How much is the equipment allowance, health insurance coverage, and learning budget?'
      },
      {
        title: 'My Personal Tasks & Profile',
        desc: 'Check your own isolated tasks & progress',
        query: 'What are my personal assigned tasks and my profile details?'
      },
      {
        title: 'Generate Policy PDF Report',
        desc: 'Download formal report for leave & benefits',
        query: 'Generate a PDF report for full-time employee leave and benefits policy'
      }
    ];
  };

  const promptStarters = getRolePromptStarters();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, loading]);

  const handleStartNewChat = () => {
    const newId = Date.now();
    const newChat = { id: newId, title: 'New RAG Session', date: 'Just now' };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Hello **${userName}**! How can I help you today? What would you like to know?`,
        sources: [`Clearance: ${userRole}`],
        suggestedActions: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || query).trim();
    if (!text || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), sender: 'user', text, timestamp: timeStr };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setQuery('');
    setLoading(true);

    if (messages.length <= 1) {
      setChatHistory(prev => prev.map(chat => 
        chat.id === activeChatId ? { ...chat, title: text.slice(0, 30) + (text.length > 30 ? '...' : '') } : chat
      ));
    }

    try {
      const response = await ragService.chat(text, userRole, userName, userEmail, messages);
      let actions = response.suggested_actions || [];
      if (!actions || actions.length === 0) {
        // Fallback: extract [👉 ...] if present in answer
        const matches = (response.answer || '').match(/\[👉\s*([^\]]+)\]/g);
        if (matches) {
          actions = [...new Set(matches.map(m => m.replace(/\[👉\s*|\]/g, '').trim()))];
        }
      }
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.answer || response.response || 'No response returned.',
        sources: response.sources || ['RAGNIFY Knowledge Retrieval'],
        downloadUrl: response.download_url,
        fileType: response.file_type,
        fileName: response.file_name,
        suggestedActions: actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      showToast('Error querying knowledge base.', 'error');
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I encountered an issue connecting to the RAG service. Please verify that backend services are active.',
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (userRole === 'INTERN') {
      showToast('Intern accounts are not permitted to upload documents to the Company RAG Vault.', 'error');
      return;
    }

    setUploading(true);
    try {
      const result = await ragService.uploadDocument(file, uploadTier, userRole);
      showToast(`"${file.name}" indexed (${result.chunks_added || 12} chunks • Tier: ${uploadTier})!`, 'success');
      await loadKnowledgeInventory();
      setSidebarTab('docs');
    } catch (err) {
      showToast('Failed to upload document.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Hello **${userName}**! How can I help you today? What would you like to know?`,
        sources: [`Clearance: ${userRole}`],
        suggestedActions: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const getTierBadgeStyle = (tier) => {
    switch (tier) {
      case 'HR_CONFIDENTIAL':
        return { bg: 'rgba(220, 38, 38, 0.12)', color: '#EF4444', label: 'HR & ADMIN ONLY' };
      case 'MANAGER_RESTRICTED':
        return { bg: 'rgba(217, 119, 6, 0.12)', color: '#F59E0B', label: 'MANAGER & HR' };
      case 'COMPANY_INTERNAL':
        return { bg: 'rgba(37, 99, 235, 0.12)', color: '#3B82F6', label: 'COMPANY / FTE' };
      default:
        return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', label: 'INTERN & ALL' };
    }
  };

  return (
    <MainLayout title="RAG Assistant">
      <div className="ai-module-container fade-in">
        <div className="chatgpt-container">
          
          {/* LEFT SIDEBAR: CHROMADB INVENTORY & CHAT SESSIONS */}
          <div className="chatgpt-sidebar">
            <button className="new-chat-btn" onClick={handleStartNewChat}>
              <FaPlus size={13} />
              <span>New Knowledge Chat</span>
            </button>

            {/* Sidebar Tab Switcher */}
            <div className="sidebar-tab-switcher">
              <button 
                className={`sidebar-tab-btn ${sidebarTab === 'docs' ? 'active' : ''}`}
                onClick={() => setSidebarTab('docs')}
              >
                <FaDatabase size={11} />
                <span>ChromaDB ({kbSummary.total_documents || kbSummary.documents.length})</span>
              </button>
              <button 
                className={`sidebar-tab-btn ${sidebarTab === 'chats' ? 'active' : ''}`}
                onClick={() => setSidebarTab('chats')}
              >
                <FaComments size={12} />
                <span>History</span>
              </button>
            </div>

            {/* Tab 1: Recent Chat History */}
            {sidebarTab === 'chats' && (
              <div className="sidebar-scroll-area">
                <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '4px 8px' }}>
                  Recent Conversations
                </div>
                {chatHistory.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                    onClick={() => setActiveChatId(chat.id)}
                  >
                    <FaComments size={12} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chat.title}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Live ChromaDB Indexed Documents with RBAC Badges */}
            {sidebarTab === 'docs' && (
              <div className="sidebar-scroll-area">
                <div style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.72rem',
                  marginBottom: '4px'
                }}>
                  <div style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>ChromaDB Vector Vault</span>
                    <span style={{ color: 'var(--brand-primary)' }}>{kbSummary.total_chunks} Chunks</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Unlocked for <strong>{userRole}</strong>: <strong>{kbSummary.accessible_documents_count}</strong> of <strong>{kbSummary.total_documents}</strong> Docs
                  </div>
                </div>

                {kbSummary.documents.map((doc, idx) => {
                  const badge = getTierBadgeStyle(doc.access_tier);
                  return (
                    <div
                      key={idx}
                      className="doc-item-card"
                      style={{
                        opacity: doc.accessible ? 1 : 0.65,
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaFileAlt style={{ color: doc.accessible ? 'var(--brand-primary)' : 'var(--text-muted)', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.77rem',
                              fontWeight: '700',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: 'var(--text-primary)'
                            }}
                            title={doc.name}
                          >
                            {doc.name}
                          </div>
                          <div className="text-xs" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {doc.chunks} vector chunks • {doc.size || '1.5 MB'}
                          </div>
                        </div>
                        {doc.accessible ? (
                          <FaCheckCircle title="Unlocked for your role" style={{ color: 'var(--status-success)', fontSize: '13px', flexShrink: 0 }} />
                        ) : (
                          <FaLock title={`Restricted (${badge.label})`} style={{ color: 'var(--status-warning)', fontSize: '12px', flexShrink: 0 }} />
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: '800',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            letterSpacing: '0.04em'
                          }}
                        >
                          {badge.label}
                        </span>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: doc.accessible ? 'var(--status-success)' : 'var(--status-warning)' }}>
                          {doc.accessible ? 'Accessible' : 'Restricted'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload PDF action inside sidebar with Access Tier selector for HR/Manager/Admin */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(userRole === 'HR' || userRole === 'ADMIN' || userRole === 'MANAGER') && (
                <select
                  className="form-select"
                  value={uploadTier}
                  onChange={e => setUploadTier(e.target.value)}
                  style={{ height: '30px', fontSize: '0.72rem', padding: '2px 8px' }}
                  title="Select RBAC Access Tier for uploaded PDF"
                >
                  <option value="COMPANY_INTERNAL">Tier: Company / Employee (No Interns)</option>
                  <option value="MANAGER_RESTRICTED">Tier: Manager &amp; HR Only</option>
                  <option value="HR_CONFIDENTIAL">Tier: HR &amp; Admin Confidential</option>
                  <option value="INTERN_PUBLIC">Tier: Intern &amp; All Staff</option>
                </select>
              )}
              <label className="btn-secondary" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', boxSizing: 'border-box' }}>
                <FaFileUpload size={12} />
                <span>{uploading ? 'Indexing into ChromaDB...' : 'Upload PDF to Vault'}</span>
                <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* RIGHT SIDE: CHATGPT MAIN AREA */}
          <div className="chatgpt-main">
            
            {/* Header */}
            <div className="chatgpt-header">
              <div className="chatgpt-header-title">
                <div className="chatgpt-badge-avatar">
                  <FaBookOpen size={16} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>RAGNIFY Knowledge Vault (RAG)</h3>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--brand-primary-subtle)',
                        color: 'var(--brand-primary)',
                        border: '1px solid var(--brand-primary-border)'
                      }}
                    >
                      <FaShieldAlt size={10} /> Clearance: {userRole} • Individual Privacy Active
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Role-filtered ChromaDB retrieval ({kbSummary.accessible_documents_count}/{kbSummary.total_documents} docs unlocked) + Instant PDF/PPT Synthesis
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  className="chat-action-btn" 
                  onClick={clearChat} 
                  title="Clear current conversation"
                >
                  <FaTrashAlt size={11} /> Clear Chat
                </button>
              </div>
            </div>

            {/* Message Feed Scroll Area */}
            <div 
              className="chatgpt-messages-feed" 
              ref={feedRef}
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-row ${msg.sender}`}>
                  <div className={`chat-avatar ${msg.sender}`}>
                    {msg.sender === 'ai' ? <FaBookOpen size={14} /> : (userName?.[0] || 'U')}
                  </div>

                  <div className="chat-content-wrap">
                    <div className="chat-bubble-chatgpt">
                      {msg.sender === 'ai' ? (
                        <FormattedChatMessage 
                          text={msg.text} 
                          downloadUrl={msg.downloadUrl}
                          fileType={msg.fileType}
                          fileName={msg.fileName}
                          suggestedActions={msg.suggestedActions}
                          onActionClick={(actionText) => handleSend(actionText)}
                        />
                      ) : (
                        msg.text
                      )}

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="chat-sources-container">
                          {msg.sources.map((src, i) => (
                            <span key={i} className="chat-source-badge">
                              <FaFileAlt size={10} /> {src}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="chat-meta-bar" style={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                      <button 
                        className="chat-action-btn"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <><FaCheck size={10} color="green" /> Copied</> : <><FaCopy size={10} /> Copy</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-row ai">
                  <div className="chat-avatar ai">
                    <FaBookOpen size={14} />
                  </div>
                  <div className="chat-content-wrap">
                    <div className="chat-bubble-chatgpt">
                      <div className="chatgpt-typing-indicator">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                          Verifying {userRole} RBAC clearance &amp; synthesizing ChromaDB vectors...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Capsule Input Bar */}
            <div className="chatgpt-input-container">
              <div className="chatgpt-input-capsule">
                <label className="chatgpt-icon-btn" title="Upload new PDF document to ChromaDB" style={{ cursor: 'pointer', margin: 0 }}>
                  <FaPaperclip size={15} />
                  <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>

                <textarea
                  className="chatgpt-textarea"
                  placeholder={`Ask a policy question as ${userName} (${userRole}) or request a PDF/PPT report...`}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={loading}
                />

                <button 
                  className="chatgpt-send-btn"
                  onClick={() => handleSend()}
                  disabled={loading || !query.trim()}
                  title="Send message"
                >
                  <FaPaperPlane />
                </button>
              </div>

              <div className="chatgpt-disclaimer">
                RBAC &amp; Privacy Guard Active: Company data restricted to Employee/Manager/HR/Admin • Manager &amp; HR docs isolated • Individual employee records private.
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default RAGAssistantPage;

import React, { useState, useRef, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { aiAssistantService } from '../../api/aiAssistantService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FormattedChatMessage } from '../../components/common/FormattedChatMessage';
import { 
  FaRobot, 
  FaPaperPlane, 
  FaPlus, 
  FaComments, 
  FaCopy, 
  FaCheck, 
  FaTrashAlt, 
  FaBolt,
  FaFileAlt,
  FaShieldAlt,
  FaLock,
  FaMicrophone,
  FaMicrophoneSlash,
  FaProjectDiagram
} from 'react-icons/fa';
import '../../styles/ai.css';

export function AIAssistantPage() {
  const { user } = useAuth();
  const userRole = (user?.role || 'EMPLOYEE').toUpperCase();
  const userName = user?.name || (userRole === 'INTERN' ? 'Ananya Roy' : 'Rahul Verma');
  const userEmail = user?.email || '';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const feedRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

  const [activeChatId, setActiveChatId] = useState(1);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: `${userRole} Copilot Session`, date: 'Active' },
    { id: 2, title: 'Leave Policy PDF Report', date: 'Yesterday' },
    { id: 3, title: 'Onboarding Deck PPT', date: '3 days ago' }
  ]);

  const getRoleScopeDescription = () => {
    switch (userRole) {
      case 'INTERN':
        return 'Restricted to Intern Handbook (₹30,000/mo stipend, 92-day tenure), Coding Standards & your own personal tasks. Internal Company/Employee/HR data is blocked.';
      case 'EMPLOYEE':
        return 'Unlocked for Company Employee Handbook, Leave/Benefits, IT Security & your own personal tasks/profile. Manager Playbooks, HR Salary Grids & other employees’ data are blocked.';
      case 'MANAGER':
        return 'Unlocked for Company Policies, Manager Leadership & Appraisal Playbook (PIP, bonus rubric, ₹1.5L squad budget) & your team’s workload.';
      default:
        return 'Full HR & Admin governance clearance across all 6 enterprise handbooks, L1–L4 salary grids, onboarding applications & workforce analytics.';
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello **${userName}**! I am your **RAGNIFY Enterprise AI Copilot**.\n\n- **Active Clearance:** \`${userRole}\`\n- **Security & Privacy Scope:** ${getRoleScopeDescription()}\n- **Document Synthesis:** Ask me any question or request a **PDF report / PowerPoint (.pptx) presentation**!`,
      sources: [`Clearance: ${userRole}`, 'Individual Privacy Guard'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const getRolePrompts = () => {
    if (userRole === 'INTERN') {
      return [
        {
          title: 'My Internship Stipend & Tenure',
          desc: 'Check ₹30,000/month stipend, 92-day tenure & leave rules',
          query: 'What is my monthly internship stipend, 92-day tenure rule, and intern leave entitlement?'
        },
        {
          title: 'Certificate Unlock & PPO Rules',
          desc: '3-stage certificate clearance & full-time PPO criteria',
          query: 'How does my Internship Completion Certificate get unlocked and what are the PPO conversion rules?'
        },
        {
          title: 'My Personal Tasks & Progress',
          desc: 'View your own assigned internship tasks & mentor',
          query: 'What are my assigned internship tasks, my mentor name, and my current tenure progress?'
        },
        {
          title: 'Create Intern Roadmap PPT',
          desc: 'Generate a slide deck on internship & coding guidelines',
          query: 'Create a PowerPoint presentation deck on RAGNIFY internship guidelines and engineering standards'
        },
        {
          title: 'Intern Clearance Workflow Diagram',
          desc: 'Visual flowchart for 92-day milestones & certificate unlock',
          query: 'Give me the complete step-by-step workflow diagram and flowchart for intern onboarding, 92-day milestone tracking, and certificate unlock clearance.'
        }
      ];
    }

    if (userRole === 'MANAGER') {
      return [
        {
          title: 'Manager Appraisal & PIP Rubric',
          desc: '1–5 rating bonus pool, 45-day PIP & ₹1.5L squad budget',
          query: 'What is our manager performance appraisal bonus rubric, 45-day PIP protocol, and squad budget?'
        },
        {
          title: 'Team Workload & Task Progress',
          desc: 'Inspect live team task completion & optimal load rules',
          query: 'Show my team’s live task completion progress and our workload balancing thresholds.'
        },
        {
          title: 'HR & Manager Broadcasts',
          desc: 'Search live company announcements & updates',
          query: 'What notifications and announcements did HR and managers send recently?'
        },
        {
          title: 'Generate Manager Playbook PDF',
          desc: 'Download formal PDF report on manager governance',
          query: 'Generate a PDF report for the engineering manager leadership and appraisal playbook'
        },
        {
          title: 'Appraisal & PIP Workflow Diagram',
          desc: 'Visual flowchart for reviews, 45-day PIP & ratings',
          query: 'Give me the complete workflow diagram and process flowchart for performance appraisal ratings, merit bonus allocation, and the 45-day PIP protocol.'
        }
      ];
    }

    if (userRole === 'HR' || userRole === 'ADMIN') {
      return [
        {
          title: 'L1–L4 Salary & ESOP Master Grid',
          desc: 'Inspect HR confidential salary bands & severance rules',
          query: 'What are the 2026 L1 to L4 compensation bands, ESOP equity allocations, and severance rules?'
        },
        {
          title: 'Live Workforce & Onboarding Status',
          desc: 'Summary of employees, interns & pending applications',
          query: 'Give me a live summary of our employees, interns, and onboarding application statuses.'
        },
        {
          title: 'Generate Compensation PDF',
          desc: 'Download formal PDF report for HR policies & leave',
          query: 'Generate a PDF report for company leave and attendance policy'
        },
        {
          title: 'Create Onboarding PPT Deck',
          desc: 'Generate presentation deck on onboarding governance',
          query: 'Create a PowerPoint presentation deck for employee onboarding and document verification guidelines'
        },
        {
          title: 'Onboarding & Verification Workflow Diagram',
          desc: 'Visual flowchart for candidate screening & document audit',
          query: 'Give me the complete end-to-end workflow diagram and flowchart for HR candidate onboarding, document verification (Aadhaar/PAN/Degree), and offer letter issuance.'
        }
      ];
    }

    // Default: EMPLOYEE
    return [
      {
        title: 'My Personal Tasks & Profile',
        desc: 'Check your own isolated tasks, role & leave balance',
        query: 'What are my personal assigned tasks, my department, and my leave entitlements?'
      },
      {
        title: 'Equipment & Health Benefits',
        desc: '₹5,500 allowance, ₹5L family insurance & ₹25k learning',
        query: 'What is the equipment allowance amount, health insurance coverage, and annual learning budget?'
      },
      {
        title: 'Generate Policy PDF Report',
        desc: 'Create downloadable PDF report for leave rules',
        query: 'Generate a PDF report for company leave and attendance policy'
      },
      {
        title: 'Create Onboarding PPT',
        desc: 'Generate presentation deck on hybrid work & benefits',
        query: 'Create a PowerPoint presentation deck for employee benefits and hybrid work guidelines'
      },
      {
        title: 'Leave & Expense Claim Workflow Diagram',
        desc: 'Step-by-step flowchart for leave approvals & allowances',
        query: 'Give me the workflow diagram and step-by-step process flowchart for applying for casual/sick leave and claiming the ₹5,500 equipment reimbursement.'
      }
    ];
  };

  const promptStarters = getRolePrompts();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, loading]);

  // Voice Speech-to-Text Recognition Hook
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Voice recognition notice:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          showToast('Microphone access denied. Please enable microphone permission in browser settings.', 'error');
        } else if (event.error !== 'no-speech') {
          showToast(`Voice error: ${event.error}`, 'error');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.', 'error');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      showToast('Voice input stopped.', 'info');
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        showToast('Listening... Speak now into your microphone 🎙️', 'info');
      } catch (err) {
        console.warn('Recognition start exception:', err);
      }
    }
  };

  const handleStartNewChat = () => {
    const newId = Date.now();
    const newChat = { id: newId, title: 'New Conversation', date: 'Just now' };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Hello **${userName}** (\`${userRole}\` clearance)! How can I assist you with your authorized policies, personal tasks, or PDF/PPT reports today?`,
        sources: [`Clearance: ${userRole}`],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), sender: 'user', text, timestamp: timeStr };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (messages.length <= 1) {
      setChatHistory(prev => prev.map(chat => 
        chat.id === activeChatId ? { ...chat, title: text.slice(0, 30) + (text.length > 30 ? '...' : '') } : chat
      ));
    }

    try {
      const response = await aiAssistantService.chat(text, userRole, userName, userEmail, messages);
      let actions = response.suggested_actions || [];
      if (!actions || actions.length === 0) {
        const matches = (response.answer || '').match(/\[👉\s*([^\]]+)\]/g);
        if (matches) {
          actions = [...new Set(matches.map(m => m.replace(/\[👉\s*|\]/g, '').trim()))];
        }
      }
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.answer || response.response || 'No response generated.',
        sources: response.sources || ['RAGNIFY AI'],
        downloadUrl: response.download_url,
        fileType: response.file_type,
        fileName: response.file_name,
        suggestedActions: actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      showToast('AI response failed. Please try again.', 'error');
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I could not complete the generation. Please verify backend connectivity.',
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

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Conversation cleared. Ready to assist **${userName}** (\`${userRole}\` clearance).`,
        sources: ['RAGNIFY AI'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <MainLayout title="AI Assistant">
      <div className="ai-module-container fade-in">
        <div className="chatgpt-container">
          
          {/* LEFT SIDEBAR: CHAT SESSIONS & RBAC GOVERNANCE MATRIX */}
          <div className="chatgpt-sidebar">
            <button className="new-chat-btn" onClick={handleStartNewChat}>
              <FaPlus size={13} />
              <span>New AI Session</span>
            </button>

            <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '6px 8px 2px' }}>
              Chatting History
            </div>

            <div className="sidebar-scroll-area">
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

            {/* Role & Privacy Governance Card */}
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '10px',
              border: '1px solid var(--border-default)',
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaShieldAlt color="var(--brand-primary)" size={13} />
                  <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>RBAC &amp; Privacy Guard</strong>
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>{userRole}</span>
              </div>
              <div className="text-xs" style={{ fontSize: '0.7rem', lineHeight: '1.45', color: 'var(--text-secondary)' }}>
                {getRoleScopeDescription()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.68rem', color: 'var(--status-success)', fontWeight: '700', marginTop: '2px' }}>
                <FaLock size={10} /> Individual Employee Privacy Isolated
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CHATGPT MAIN AREA */}
          <div className="chatgpt-main">
            
            {/* Header */}
            <div className="chatgpt-header">
              <div className="chatgpt-header-title">
                <div className="chatgpt-badge-avatar">
                  <FaRobot size={16} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>RAGNIFY AI Enterprise Co-Pilot</h3>
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
                      <FaBolt size={10} /> Identity: {userName} ({userRole})
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Trained on ChromaDB &amp; Live PostgreSQL • Enforces Role Clearance &amp; Per-Employee Privacy
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  className="chat-action-btn" 
                  onClick={clearChat} 
                  title="Clear conversation"
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
              {messages.length === 1 && (
                <div className="chatgpt-hero-container">
                  <div className="chatgpt-hero-icon">
                    <FaRobot />
                  </div>
                  <div>
                    <h2 className="chatgpt-hero-title">How can I help you today, {userName.split(' ')[0]}?</h2>
                    <p className="chatgpt-hero-subtitle">
                      Ask about your authorized <strong>{userRole}</strong> policies, your personal tasks &amp; working hours, or generate a publication-ready PDF report / PPT presentation.
                    </p>
                  </div>

                  <div className="chatgpt-prompts-grid">
                    {promptStarters.map((p, idx) => (
                      <div 
                        key={idx} 
                        className="prompt-starter-card"
                        onClick={() => handleSend(p.query)}
                      >
                        <div className="prompt-starter-title">⚡ {p.title}</div>
                        <div className="prompt-starter-desc">{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`chat-row ${msg.sender}`}>
                  <div className={`chat-avatar ${msg.sender}`}>
                    {msg.sender === 'ai' ? <FaRobot size={14} /> : (userName?.[0] || 'U')}
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
                        title="Copy text"
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
                    <FaRobot size={14} />
                  </div>
                  <div className="chat-content-wrap">
                    <div className="chat-bubble-chatgpt">
                      <div className="chatgpt-typing-indicator">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                          Checking {userRole} clearance &amp; synthesizing response for {userName}...
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
                <textarea
                  className="chatgpt-textarea"
                  placeholder={isListening ? "🎙️ Listening to your voice... Speak now into microphone..." : `Ask ${userRole} Copilot, request a workflow diagram, or generate PDF/PPT...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={loading}
                />

                <button 
                  type="button"
                  className={`chatgpt-mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={handleToggleListen}
                  title={isListening ? "Stop listening" : "Click to speak with voice via microphone"}
                  disabled={loading}
                >
                  {isListening ? <FaMicrophoneSlash size={15} /> : <FaMicrophone size={15} />}
                </button>

                <button 
                  className="chatgpt-send-btn"
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  title="Send message"
                >
                  <FaPaperPlane />
                </button>
              </div>

              <div className="chatgpt-disclaimer">
                RAGNIFY Enterprise SaaS Copilot • Strict RBAC ({userRole}) &amp; Individual Employee Privacy Protection Active.
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AIAssistantPage;

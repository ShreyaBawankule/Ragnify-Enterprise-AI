import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../api/notificationService';
import { 
  FaBell, FaCheck, FaInfoCircle, FaTasks, FaFileAlt, FaCheckCircle, 
  FaReply, FaPaperPlane, FaUserShield, FaUserTie, FaUserGraduate, 
  FaUsers, FaSearch, FaRobot, FaComments, FaBullhorn, FaTimes, FaCommentDots
} from 'react-icons/fa';

export function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, HR, MANAGER, UNREAD
  const [searchQuery, setSearchQuery] = useState('');

  // Composer Modal / Form state for HR & Manager
  const [showComposer, setShowComposer] = useState(false);
  const [composerData, setComposerData] = useState({
    title: '',
    message: '',
    target_role: 'All',
    target_name: 'All Workforce',
    type: 'announcement'
  });
  const [sending, setSending] = useState(false);

  // Reply state: active reply box per notification ID
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [submittingReply, setSubmittingReply] = useState({});

  const userRole = user?.role?.toUpperCase() || 'EMPLOYEE';
  const isHrOrManager = userRole === 'HR' || userRole === 'MANAGER' || userRole === 'ADMIN';

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(userRole);
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [userRole]);

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleMarkSingleRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!composerData.title.trim() || !composerData.message.trim()) return;

    setSending(true);
    try {
      const payload = {
        sender_name: user?.name || (userRole === 'HR' ? 'Priya Sharma (HR)' : 'Vikram Mehta (Manager)'),
        sender_role: user?.role || (userRole === 'HR' ? 'HR' : 'Manager'),
        sender_email: user?.email || (userRole === 'HR' ? 'hr@ragnify.com' : 'manager@ragnify.com'),
        target_role: composerData.target_role,
        target_name: composerData.target_name,
        title: composerData.title,
        message: composerData.message,
        type: composerData.type
      };

      const result = await notificationService.sendNotification(payload);
      if (result) {
        setNotifications(prev => [result, ...prev]);
        setShowComposer(false);
        setComposerData({
          title: '',
          message: '',
          target_role: 'All',
          target_name: 'All Workforce',
          type: 'announcement'
        });
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    } finally {
      setSending(false);
    }
  };

  const handleSendReply = async (notifId) => {
    const text = replyText[notifId];
    if (!text || !text.trim()) return;

    setSubmittingReply(prev => ({ ...prev, [notifId]: true }));
    try {
      const payload = {
        sender_name: user?.name || (userRole === 'HR' ? 'HR Operations' : userRole === 'MANAGER' ? 'Team Lead' : 'Team Member'),
        sender_role: user?.role || 'Employee',
        sender_email: user?.email || 'user@ragnify.com',
        message: text.trim()
      };

      const replyResult = await notificationService.replyToNotification(notifId, payload);

      setNotifications(prev => prev.map(n => {
        if (n.id === notifId || n.notification_id === notifId) {
          const currentReplies = n.replies || [];
          return {
            ...n,
            replies: [...currentReplies, replyResult]
          };
        }
        return n;
      }));

      // Reset reply input
      setReplyText(prev => ({ ...prev, [notifId]: '' }));
      setActiveReplyId(null);
    } catch (err) {
      console.error('Failed to submit reply:', err);
    } finally {
      setSubmittingReply(prev => ({ ...prev, [notifId]: false }));
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter(n => {
    // Strict Intern Constraint: Intern can ONLY see notifications sent by Manager specifically to Interns,
    // and CANNOT see any notifications related to employees.
    if (userRole === 'INTERN') {
      const isFromManager = n.sender_role?.toUpperCase().includes('MANAGER');
      const isTargetingIntern = (n.target_role?.toUpperCase() === 'INTERN') || (n.target_name || '').toLowerCase().includes('intern');
      const isTargetingEmployee = (n.target_role?.toUpperCase() === 'EMPLOYEE') || (n.target_name || '').toLowerCase().includes('employee');

      if (isTargetingEmployee) return false;
      if (!isFromManager || !isTargetingIntern) return false;
    }

    // Role filter
    if (filter === 'HR' && n.sender_role?.toUpperCase() !== 'HR') return false;
    if (filter === 'MANAGER' && n.sender_role?.toUpperCase() !== 'MANAGER') return false;
    if (filter === 'UNREAD' && !n.unread) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title?.toLowerCase().includes(q);
      const matchMsg = (n.desc || n.message || '').toLowerCase().includes(q);
      const matchSender = n.sender_name?.toLowerCase().includes(q);
      const matchTarget = n.target_name?.toLowerCase().includes(q);
      const matchReplies = (n.replies || []).some(r => r.message?.toLowerCase().includes(q) || r.sender_name?.toLowerCase().includes(q));
      if (!matchTitle && !matchMsg && !matchSender && !matchTarget && !matchReplies) return false;
    }

    return true;
  });

  const getSenderBadge = (role) => {
    switch (role?.toUpperCase()) {
      case 'HR':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', icon: <FaUserShield /> };
      case 'MANAGER':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: <FaUserTie /> };
      case 'INTERN':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: <FaUserGraduate /> };
      default:
        return { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', icon: <FaUsers /> };
    }
  };

  return (
    <MainLayout title="Notifications & Team Communications">
      <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
        <PageHeader
          title={userRole === 'INTERN' ? "Manager Broadcasts & Intern Notices" : "Notifications & Enterprise Chat"}
          subtitle={userRole === 'INTERN' 
            ? "Direct supervisory announcements and milestone alerts from your Engineering Manager"
            : "Real-time announcements, manager broadcasts, threaded replies, and AI-searchable notices"
          }
          actions={
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className="btn-secondary" 
                onClick={() => navigate(`/${userRole.toLowerCase()}/ai-assistant`)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderColor: 'rgba(99, 102, 241, 0.3)' }}
                title="Search notifications with AI Assistant"
              >
                <FaRobot size={14} /> Search with AI Assistant
              </button>

              {isHrOrManager && (
                <button 
                  className="btn-primary" 
                  onClick={() => setShowComposer(!showComposer)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FaBullhorn size={13} /> {userRole === 'HR' ? 'Send HR Notification' : 'Broadcast Message'}
                </button>
              )}

              <button className="btn-secondary" onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaCheck size={12} /> Mark All Read
              </button>
            </div>
          }
        />

        {/* AI Assistant Quick Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              <FaRobot />
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Ask AI Assistant to Search Enterprise Communications
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Query all HR notices, manager broadcasts, and intern alerts via natural language (e.g. <i>"What are the recent HR announcements?"</i>)
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/${userRole.toLowerCase()}/ai-assistant`)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '8px' }}
          >
            Launch AI Assistant &rarr;
          </button>
        </div>

        {/* Composer Card for HR & Manager */}
        {showComposer && (
          <div className="card" style={{ marginBottom: '24px', border: '1px solid var(--brand-primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaBullhorn style={{ color: 'var(--brand-primary)', fontSize: '1.2rem' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
                  {userRole === 'HR' ? 'Compose HR Corporate Announcement / Notice' : 'Broadcast Message to Team Members'}
                </h3>
              </div>
              <button 
                onClick={() => setShowComposer(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '16px' }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSendNotification}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Target Audience
                  </label>
                  <select
                    className="input-field"
                    value={composerData.target_role}
                    onChange={(e) => {
                      const val = e.target.value;
                      let name = 'All Workforce';
                      if (val === 'Manager') name = 'All Engineering & Product Managers';
                      if (val === 'Employee') name = 'All Full-Time Employees';
                      if (val === 'Intern') name = 'All Active Internship Candidates';
                      setComposerData(prev => ({ ...prev, target_role: val, target_name: name }));
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-surface-subtle)' }}
                  >
                    <option value="All">All Workforce (Managers, Employees & Interns)</option>
                    <option value="Manager">Managers Only</option>
                    <option value="Employee">Employees Only</option>
                    <option value="Intern">Interns Only</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Notification Category
                  </label>
                  <select
                    className="input-field"
                    value={composerData.type}
                    onChange={(e) => setComposerData(prev => ({ ...prev, type: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-surface-subtle)' }}
                  >
                    <option value="announcement">Official Announcement</option>
                    <option value="chat">Team Update & Message</option>
                    <option value="onboarding">Onboarding / Compliance Alert</option>
                    <option value="task">Sprint / Task Directive</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Notification Subject / Title
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Q4 Hybrid Work Policy Update or Sprint Review Schedule"
                  value={composerData.title}
                  onChange={(e) => setComposerData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-surface-subtle)' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Message Content
                </label>
                <textarea
                  rows={4}
                  className="input-field"
                  placeholder="Write clear instructions, policy details, or announcement message for all target recipients..."
                  value={composerData.message}
                  onChange={(e) => setComposerData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-surface-subtle)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowComposer(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={sending}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FaPaperPlane size={13} /> {sending ? 'Broadcasting...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(userRole === 'INTERN' ? [
              { id: 'ALL', label: 'All Intern Notices' },
              { id: 'MANAGER', label: 'Manager Broadcasts' },
              { id: 'UNREAD', label: 'Unread' }
            ] : [
              { id: 'ALL', label: 'All Messages' },
              { id: 'HR', label: 'HR Announcements' },
              { id: 'MANAGER', label: 'Manager Broadcasts' },
              { id: 'UNREAD', label: 'Unread' }
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: filter === tab.id ? '700' : '500',
                  background: filter === tab.id ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                  color: filter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  border: filter === tab.id ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '13px' }} />
            <input
              type="text"
              placeholder="Search notifications & replies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 34px',
                borderRadius: '20px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.84rem'
              }}
            />
          </div>
        </div>

        {/* Notification List */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            Loading communications and broadcast feeds...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
            <FaBell style={{ fontSize: '32px', opacity: 0.4, marginBottom: '12px' }} />
            <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              No Notifications Found
            </div>
            <div className="text-sm">
              {searchQuery ? 'No notifications or messages match your search term.' : 'You have no active alerts or messages in this filter view.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredNotifications.map(n => {
              const badge = getSenderBadge(n.sender_role);
              const replies = n.replies || [];
              const isReplyOpen = activeReplyId === (n.id || n.notification_id);
              const notifId = n.id || n.notification_id;

              return (
                <div
                  key={notifId}
                  className="card"
                  style={{
                    padding: '18px 20px',
                    borderLeft: n.unread ? '4px solid var(--brand-primary)' : '4px solid transparent',
                    background: n.unread ? 'rgba(99, 102, 241, 0.03)' : 'var(--bg-surface)',
                    transition: 'box-shadow 0.2s ease',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {/* Sender Avatar Badge */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: badge.bg,
                        color: badge.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        fontWeight: '700'
                      }}>
                        {badge.icon}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                            {n.sender_name}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            background: badge.bg,
                            color: badge.color,
                            textTransform: 'uppercase'
                          }}>
                            {n.sender_role || 'Staff'}
                          </span>

                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            &bull; Target: <strong>{n.target_name || n.target_role || 'All'}</strong>
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {n.time || 'Recently'}
                        </span>
                      </div>
                    </div>

                    {n.unread && (
                      <button
                        onClick={() => handleMarkSingleRead(notifId)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-surface)',
                          color: 'var(--brand-primary)',
                          cursor: 'pointer'
                        }}
                        title="Mark as read"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>

                  {/* Title & Body */}
                  <div style={{ marginLeft: '48px', marginBottom: '14px' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {n.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                      {n.desc || n.message}
                    </p>
                  </div>

                  {/* Card Action Bar */}
                  <div style={{ marginLeft: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setActiveReplyId(isReplyOpen ? null : notifId);
                        }}
                        style={{
                          fontSize: '0.8rem',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: isReplyOpen ? 'var(--brand-primary-subtle)' : 'transparent',
                          color: isReplyOpen ? 'var(--brand-primary)' : 'var(--text-primary)',
                          borderColor: isReplyOpen ? 'var(--brand-primary)' : 'var(--border-subtle)'
                        }}
                      >
                        <FaReply size={11} /> Reply to Notification
                      </button>

                      {replies.length > 0 && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaCommentDots /> {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                      )}
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      ID: {notifId}
                    </span>
                  </div>

                  {/* Threaded Replies Section */}
                  {replies.length > 0 && (
                    <div style={{
                      marginLeft: '48px',
                      marginTop: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                        Discussion Thread ({replies.length})
                      </div>

                      {replies.map((r, idx) => {
                        const replyBadge = getSenderBadge(r.sender_role);
                        return (
                          <div key={r.id || idx} style={{
                            padding: '8px 12px',
                            background: 'var(--bg-surface)',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: '600', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                                  {r.sender_name}
                                </span>
                                <span style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  background: replyBadge.bg,
                                  color: replyBadge.color
                                }}>
                                  {r.sender_role}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                {r.time || 'Recently'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              {r.message}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Inline Reply Input Box */}
                  {isReplyOpen && (
                    <div style={{
                      marginLeft: '48px',
                      marginTop: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--brand-primary)',
                      animation: 'fadeIn 0.2s ease-in-out'
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>
                        Replying as {user?.name || (userRole === 'HR' ? 'HR Staff' : userRole === 'MANAGER' ? 'Manager' : 'Employee')}:
                      </div>
                      <textarea
                        rows={2}
                        className="input-field"
                        placeholder="Write your response, acknowledgment, or question regarding this notice..."
                        value={replyText[notifId] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [notifId]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          background: 'var(--bg-surface)',
                          fontSize: '0.85rem',
                          marginBottom: '8px'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                          onClick={() => setActiveReplyId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          disabled={submittingReply[notifId]}
                          style={{ fontSize: '0.78rem', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          onClick={() => handleSendReply(notifId)}
                        >
                          <FaPaperPlane size={10} /> {submittingReply[notifId] ? 'Sending...' : 'Post Reply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export function NotFoundPage() {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--brand-primary)', marginBottom: '8px' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Page Not Found</h2>
        <p className="text-sm" style={{ marginBottom: '20px' }}>The requested resource does not exist or has been relocated.</p>
        <a href="/" className="btn-primary" style={{ display: 'inline-flex' }}>Return to Workspace</a>
      </div>
    </div>
  );
}

export default NotificationsPage;

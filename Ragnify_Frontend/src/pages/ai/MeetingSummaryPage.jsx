import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge, EmptyState } from '../../components/common/StatCard';
import { meetingService } from '../../api/meetingService';
import { useToast } from '../../context/ToastContext';
import { 
  FaMicrophone, 
  FaCloudUploadAlt, 
  FaFileAudio, 
  FaCheckCircle, 
  FaClipboardList, 
  FaUsers, 
  FaCalendarAlt, 
  FaClock, 
  FaSearch, 
  FaEye, 
  FaTimes, 
  FaCopy, 
  FaDownload, 
  FaLightbulb, 
  FaListUl, 
  FaUserTie, 
  FaComments,
  FaFileAlt,
  FaPlus,
  FaFilter,
  FaArrowRight
} from 'react-icons/fa';
import '../../styles/ai.css';

export function MeetingSummaryPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('archive'); // 'archive' | 'upload'
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'SPRINT' | 'REVIEW' | 'HR'
  
  // Upload & processing state
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [transcriptTab, setTranscriptTab] = useState('english'); // 'english' | 'original'
  const { showToast } = useToast();

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await meetingService.getMeetingHistory();
      setMeetings(data || []);
      // If there are meetings, set the latest one as previewable default if needed
      if (data && data.length > 0 && !selectedMeeting) {
        // keep selectedMeeting null until user clicks or opens
      }
    } catch (err) {
      showToast('Could not load meeting archive.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.endsWith('.mp3') && !selected.name.endsWith('.wav')) {
        showToast('Please upload an MP3 or WAV audio file.', 'error');
        return;
      }
      setFile(selected);
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      showToast('Please select an audio recording first.', 'error');
      return;
    }

    setProcessing(true);
    try {
      const data = await meetingService.summarizeAudio(file);
      
      // Construct clean record
      const newRecord = {
        ...data,
        id: data.meeting_id || `MTG-${Date.now().toString().slice(-4)}`,
        title: data.meeting_title || file.name,
        meeting_title: data.meeting_title || file.name,
        date: data.meeting_date || new Date().toISOString().split('T')[0],
        meeting_date: data.meeting_date || new Date().toISOString().split('T')[0],
        short_summary: (data.summary || '').slice(0, 180) + '...'
      };

      // Prepend to stored meetings list
      setMeetings(prev => [newRecord, ...prev.filter(m => m.id !== newRecord.id)]);
      setSelectedMeeting(newRecord);
      setActiveTab('archive');
      setFile(null);
      showToast('Meeting processed, summarized & saved to archive!', 'success');
    } catch (err) {
      showToast('Failed to process meeting audio.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopySummary = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Meeting summary copied to clipboard!', 'success');
  };

  const handleDownloadNotes = (meeting) => {
    const content = `=====================================================
RAGNIFY ENTERPRISE MEETING SUMMARY
=====================================================
Title: ${meeting.title || meeting.meeting_title}
Meeting ID: ${meeting.meeting_id || meeting.id}
Date: ${meeting.date || meeting.meeting_date}
Duration: ${meeting.duration || '45 mins'}
Organizer: ${meeting.organizer || 'Team Lead'}
Participants: ${meeting.participants || 'N/A'}

-----------------------------------------------------
EXECUTIVE SUMMARY:
-----------------------------------------------------
${meeting.summary}

-----------------------------------------------------
AGENDA & OBJECTIVES:
-----------------------------------------------------
${meeting.agenda || 'N/A'}

-----------------------------------------------------
KEY DECISIONS & OUTCOMES:
-----------------------------------------------------
${meeting.decisions || 'N/A'}

-----------------------------------------------------
ASSIGNED ACTION ITEMS:
-----------------------------------------------------
${meeting.action_items || 'N/A'}

-----------------------------------------------------
AUDIO TRANSCRIPTION LOG:
-----------------------------------------------------
${meeting.transcript || 'N/A'}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(meeting.meeting_id || 'Meeting')}_Summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${meeting.meeting_id || 'Meeting'} summary notes.`, 'success');
  };

  // Filtered Meetings
  const filteredMeetings = meetings.filter(m => {
    const title = (m.title || m.meeting_title || '').toLowerCase();
    const organizer = (m.organizer || '').toLowerCase();
    const participants = (m.participants || '').toLowerCase();
    const agenda = (m.agenda || '').toLowerCase();
    const summary = (m.summary || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      if (!title.includes(q) && !organizer.includes(q) && !participants.includes(q) && !agenda.includes(q) && !summary.includes(q)) {
        return false;
      }
    }

    if (categoryFilter === 'SPRINT') {
      if (!title.includes('sprint') && !agenda.includes('sprint') && !title.includes('planning')) return false;
    } else if (categoryFilter === 'REVIEW') {
      if (!title.includes('review') && !title.includes('sync') && !title.includes('demo')) return false;
    } else if (categoryFilter === 'HR') {
      if (!title.includes('hr') && !title.includes('policy') && !title.includes('workload')) return false;
    }

    return true;
  });

  return (
    <MainLayout title="Meeting Summary">
      <div className="fade-in">
        <PageHeader
          title="Meeting Intelligence & Knowledge Hub"
          subtitle="All corporate meeting recordings transcribed, synthesized into executive summaries, and archived for cross-team alignment"
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={activeTab === 'archive' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('archive')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaClipboardList size={12} /> Stored Summaries ({meetings.length})
              </button>
              <button 
                className={activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('upload')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaPlus size={12} /> Summarize New Recording
              </button>
            </div>
          }
        />

        {/* TOP STATS CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--brand-primary-subtle)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <FaClipboardList />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL ARCHIVED MEETINGS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{meetings.length}</div>
            </div>
          </div>

          <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <FaClock />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>AVERAGE DURATION</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>52 Mins</div>
            </div>
          </div>

          <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <FaCheckCircle />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>DECISIONS & OUTCOMES</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>34 Logged</div>
            </div>
          </div>

          <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <FaMicrophone />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>WHISPER AI TRANSCRIBED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>100% Automated</div>
            </div>
          </div>
        </div>

        {/* TAB 1: STORED MEETING SUMMARIES ARCHIVE */}
        {activeTab === 'archive' && (
          <div className="fade-in">
            {/* SEARCH & SLICER TOOLBAR */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {/* Slicer Tabs */}
              <div style={{
                display: 'inline-flex',
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                flexWrap: 'wrap',
                gap: '4px'
              }}>
                <button
                  onClick={() => setCategoryFilter('ALL')}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: categoryFilter === 'ALL' ? 'var(--brand-primary)' : 'transparent',
                    color: categoryFilter === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  All Meetings ({meetings.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('SPRINT')}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: categoryFilter === 'SPRINT' ? 'var(--brand-primary)' : 'transparent',
                    color: categoryFilter === 'SPRINT' ? '#FFFFFF' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Sprint & Architecture
                </button>
                <button
                  onClick={() => setCategoryFilter('REVIEW')}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: categoryFilter === 'REVIEW' ? 'var(--brand-primary)' : 'transparent',
                    color: categoryFilter === 'REVIEW' ? '#FFFFFF' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Reviews & Demos
                </button>
                <button
                  onClick={() => setCategoryFilter('HR')}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: categoryFilter === 'HR' ? 'var(--brand-primary)' : 'transparent',
                    color: categoryFilter === 'HR' ? '#FFFFFF' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  HR & Operations
                </button>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', minWidth: '280px', flex: '1', maxWidth: '400px' }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={13} />
                <input
                  type="text"
                  className="input-text"
                  style={{ width: '100%', paddingLeft: '34px', height: '36px', fontSize: '0.8125rem' }}
                  placeholder="Search by topic, speaker, organizer, summary..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* MEETINGS LIST */}
            {filteredMeetings.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <EmptyState 
                  title="No Meeting Summaries Found" 
                  message="No stored meetings match your current search or category filter." 
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredMeetings.map((mtg, idx) => {
                  const mTitle = mtg.title || mtg.meeting_title || `Meeting ${mtg.meeting_id}`;
                  const mDate = mtg.date || mtg.meeting_date || '2026-09-28';
                  const mDuration = mtg.duration || '45 mins';
                  const mOrganizer = mtg.organizer || 'Team Lead';
                  const mParticipants = mtg.participants || 'Engineering Team';
                  const mSummary = mtg.summary || mtg.short_summary || 'Executive summary synthesized by AI Co-Pilot.';

                  return (
                    <div 
                      key={mtg.id || mtg.meeting_id || idx}
                      className="card" 
                      style={{
                        padding: '20px',
                        border: '1px solid var(--border-default)',
                        borderLeft: '4px solid var(--brand-primary)',
                        transition: 'all 0.15s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedMeeting(mtg)}
                    >
                      {/* Meeting Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span className="badge badge-primary" style={{ fontWeight: '800' }}>
                              {mtg.meeting_id || mtg.id || `MTG${idx+1}`}
                            </span>
                            <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', border: '1px solid rgba(59, 130, 246, 0.25)', fontWeight: '700', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              🌐 {mtg.detected_language || 'Hindi & English (Hinglish)'}
                            </span>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {mTitle}
                            </h3>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <FaCalendarAlt size={11} color="var(--brand-primary)" /> {mDate}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <FaClock size={11} color="var(--brand-primary)" /> {mDuration}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <FaUserTie size={11} color="var(--brand-primary)" /> Organizer: <strong>{mOrganizer}</strong>
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn-action"
                            style={{ 
                              color: 'var(--brand-primary)', 
                              borderColor: 'var(--brand-primary)', 
                              backgroundColor: 'var(--brand-primary-subtle)',
                              fontWeight: '700' 
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMeeting(mtg);
                            }}
                          >
                            <FaEye size={11} /> View Full Intelligence
                          </button>

                          <button
                            className="btn-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadNotes(mtg);
                            }}
                            title="Download Notes & Action Items"
                          >
                            <FaDownload size={11} />
                          </button>
                        </div>
                      </div>

                      {/* ⭐ HIGHLIGHTED SHORT EXECUTIVE SUMMARY BOX */}
                      <div style={{
                        backgroundColor: 'var(--bg-surface-subtle)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--brand-primary)', marginBottom: '4px' }}>
                          <FaLightbulb size={12} />
                          <span>EXECUTIVE SUMMARY (KEY TAKEAWAY):</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.55', color: 'var(--text-primary)' }}>
                          {mSummary}
                        </p>
                      </div>

                      {/* Quick Meta Badges: Decisions + Action Items Preview */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.8125rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <FaUsers size={12} />
                          <span>Participants: <strong>{mParticipants}</strong></span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {mtg.decisions && (
                            <span className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
                              ✅ Decisions Logged
                            </span>
                          )}
                          {mtg.action_items && (
                            <span className="badge badge-info" style={{ fontSize: '0.725rem' }}>
                              📋 Action Items Assigned
                            </span>
                          )}
                          <span style={{ color: 'var(--brand-primary)', fontWeight: '700', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            Read Full Transcript <FaArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPLOAD & SUMMARIZE NEW AUDIO */}
        {activeTab === 'upload' && (
          <div className="fade-in card" style={{ padding: '32px 24px', maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--brand-primary-subtle)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 12px' }}>
                <FaMicrophone />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-primary)' }}>
                Transcribe & Summarize Audio Recording
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
                Upload any team meeting recording (MP3 / WAV). Groq Whisper will transcribe speaker audio, and GPT-OSS will synthesize an executive summary, decisions, and action items.
              </p>
            </div>

            <div className="audio-dropzone-box" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}>
              <FaCloudUploadAlt size={42} style={{ color: 'var(--brand-primary)', marginBottom: '8px' }} />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {file ? file.name : 'Select Meeting Recording (MP3 or WAV)'}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Audio Ready for Processing` : 'Supported file formats: .mp3, .wav (up to 50MB)'}
                </div>
              </div>

              <label className="btn-secondary" style={{ cursor: 'pointer', padding: '9px 20px', marginTop: '6px' }}>
                <FaFileAudio size={13} />
                <span>{file ? 'Choose Different Audio File' : 'Browse Files on Computer'}</span>
                <input
                  type="file"
                  accept=".mp3,.wav"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  disabled={processing}
                />
              </label>
            </div>

            {file && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setFile(null)}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSummarize}
                  disabled={processing}
                  style={{ padding: '10px 28px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {processing ? (
                    <>Transcribing with Whisper Large-v3 & GPT-OSS...</>
                  ) : (
                    <>
                      <FaCheckCircle size={13} /> Generate & Save Meeting Summary
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* FULL MEETING INTELLIGENCE DETAIL MODAL */}
        {selectedMeeting && (
          <div className="modal-overlay" onClick={() => setSelectedMeeting(null)}>
            <div 
              className="modal-card" 
              style={{ 
                maxWidth: '880px', 
                width: '94vw', 
                maxHeight: '92vh', 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden' 
              }} 
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary" style={{ fontWeight: '800' }}>
                      {selectedMeeting.meeting_id || selectedMeeting.id}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                      {selectedMeeting.title || selectedMeeting.meeting_title}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span><FaCalendarAlt size={11} /> {selectedMeeting.date || selectedMeeting.meeting_date}</span>
                    <span><FaClock size={11} /> {selectedMeeting.duration || '45 mins'}</span>
                    <span><FaUserTie size={11} /> Organizer: <strong>{selectedMeeting.organizer || 'Team Lead'}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => handleCopySummary(selectedMeeting.summary)}
                    title="Copy Executive Summary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <FaCopy size={11} /> Copy
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => handleDownloadNotes(selectedMeeting)}
                    title="Download Complete Meeting Notes"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <FaDownload size={11} /> Download
                  </button>

                  <button 
                    onClick={() => setSelectedMeeting(null)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px' }}
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body with Scroll Line */}
              <div 
                className="modal-body custom-scrollbar-thin" 
                style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px',
                  maxHeight: '72vh'
                }}
              >
                {/* 0. Multilingual Meeting Intelligence Banner */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}>🌐</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#065F46' }}>
                        Detected Language: {selectedMeeting.detected_language || 'Hindi & English (Hinglish)'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                        Audio Classification: {selectedMeeting.audio_type || 'Multilingual Enterprise Speech / Meeting'}
                      </div>
                    </div>
                  </div>
                  <span className="badge" style={{ backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: '800', fontSize: '0.72rem' }}>
                    ✓ 100% Executive English Intelligence
                  </span>
                </div>

                {/* 1. Executive Summary Box */}
                <div style={{
                  backgroundColor: 'var(--brand-primary-subtle)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--brand-primary-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)', fontWeight: '800', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <FaLightbulb size={14} />
                    <span>EXECUTIVE SUMMARY (IN ENGLISH)</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.925rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                    {selectedMeeting.summary}
                  </p>
                </div>

                {/* 1.1 Key Points & Takeaways (if present) */}
                {selectedMeeting.key_points && Array.isArray(selectedMeeting.key_points) && selectedMeeting.key_points.length > 0 && (
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaClipboardList size={12} color="var(--brand-primary)" />
                      <span>KEY STRATEGIC TAKEAWAYS (ENGLISH)</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {selectedMeeting.key_points.map((pt, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. Agenda & Participants Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaListUl size={12} color="var(--brand-primary)" />
                      <span>AGENDA & KEY TOPICS</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      {selectedMeeting.agenda || 'Sprint alignment, technical constraints, and milestone tracking.'}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaUsers size={12} color="var(--brand-primary)" />
                      <span>ATTENDEES & PARTICIPANTS</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      {selectedMeeting.participants || 'Engineering Team & Leadership'}
                    </div>
                  </div>
                </div>

                {/* 3. Key Decisions & Action Items 2-Column */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                  {/* Key Decisions */}
                  <div style={{ backgroundColor: 'var(--bg-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaCheckCircle size={13} color="#16A34A" />
                      <span>KEY DECISIONS & OUTCOMES</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                      {typeof selectedMeeting.decisions === 'string'
                        ? selectedMeeting.decisions
                        : Array.isArray(selectedMeeting.decisions)
                          ? selectedMeeting.decisions.map((d, i) => (
                              <div key={i} style={{ marginBottom: '4px' }}>
                                • {typeof d === 'object' ? (d.decision || d.title || JSON.stringify(d)) : d}
                              </div>
                            ))
                          : 'Decisions confirmed and documented in team sprint tracker.'}
                    </div>
                  </div>

                  {/* Assigned Action Items */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--brand-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaClipboardList size={13} color="var(--brand-primary)" />
                      <span>ASSIGNED ACTION ITEMS & OWNERS</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                      {typeof selectedMeeting.action_items === 'string'
                        ? selectedMeeting.action_items
                        : Array.isArray(selectedMeeting.action_items)
                          ? selectedMeeting.action_items.map((a, i) => (
                              <div key={i} style={{ marginBottom: '4px' }}>
                                • {typeof a === 'object' ? `${a.task || a.action || 'Task'} — Owner: ${a.owner || 'Assigned'}${a.due_date ? ` [Due: ${a.due_date}]` : ''}` : a}
                              </div>
                            ))
                          : 'Action items assigned across respective engineering pods.'}
                    </div>
                  </div>
                </div>

                {/* 4. Transcribed Audio Log with Dual-Language Switcher */}
                {selectedMeeting.transcript && (
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaComments size={12} color="var(--brand-primary)" />
                        <span>TRANSCRIBED AUDIO LOG & TRANSLATION</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-default)',
                            backgroundColor: transcriptTab === 'english' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                            color: transcriptTab === 'english' ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                          onClick={() => setTranscriptTab('english')}
                        >
                          English Translation
                        </button>
                        <button
                          type="button"
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-default)',
                            backgroundColor: transcriptTab === 'original' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                            color: transcriptTab === 'original' ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                          onClick={() => setTranscriptTab('original')}
                        >
                          Original Audio ({selectedMeeting.detected_language ? selectedMeeting.detected_language.split(' ')[0] : 'Spoken'})
                        </button>
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: 'var(--bg-surface)',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8125rem',
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      maxHeight: '180px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-line'
                    }}>
                      {transcriptTab === 'english'
                        ? (selectedMeeting.english_transcript || selectedMeeting.transcript)
                        : (selectedMeeting.original_transcript || selectedMeeting.transcript)
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer" style={{ padding: '12px 20px', borderTop: '1px solid var(--border-default)', flexShrink: 0, justifyContent: 'space-between' }}>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Stored in PostgreSQL Master DB • Audio: <code>{selectedMeeting.audio_filename || 'Standard Transcript'}</code>
                </span>
                <button className="btn-primary" onClick={() => setSelectedMeeting(null)}>
                  Close Intelligence View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MeetingSummaryPage;

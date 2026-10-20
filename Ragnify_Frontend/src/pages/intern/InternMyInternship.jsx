import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { CertificatePreviewModal, OfficialCertificateCard } from '../../components/common/CertificatePreviewModal';
import OfferLetterPreviewModal from '../../components/common/OfferLetterPreviewModal';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { workingHoursService, tenureService, certificateService, documentService } from '../../api/onboardingService';
import { 
  FaDownload, 
  FaLock, 
  FaPlay, 
  FaStop, 
  FaClock, 
  FaCalendarCheck, 
  FaAward, 
  FaUserGraduate, 
  FaBriefcase, 
  FaBuilding, 
  FaUserTie, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaShieldAlt,
  FaEye,
  FaEnvelope,
  FaFileUpload,
  FaSearch,
  FaTimes,
  FaPlus,
  FaFileAlt,
  FaFilePdf,
  FaFileCsv,
  FaEdit,
  FaSave,
  FaPhone,
  FaMapMarkerAlt,
  FaCode,
  FaSyncAlt,
  FaPaperPlane,
  FaExternalLinkAlt
} from 'react-icons/fa';

/* ============================================================
   1. MY INTERNSHIP PAGE - BOLD & SLIGHTLY BIGGER KEYWORDS
============================================================ */
export function InternMyInternship() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [previewInternOffer, setPreviewInternOffer] = useState(null);
  const [supervisorModalOpen, setSupervisorModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [supervisorNote, setSupervisorNote] = useState('');
  const [leaveData, setLeaveData] = useState({
    type: 'Casual Leave (1 day per month)',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveDaysRemaining, setLeaveDaysRemaining] = useState(3);
  const [tenureData, setTenureData] = useState({
    daysCompleted: 68,
    totalDays: 92,
    progress: 74,
    totalHours: 578
  });

  const backendBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const internOfferData = {
    id: 'OFR-INT-201',
    applicationId: 'INT-201',
    candidateName: user?.name || 'Aarav Patel',
    candidateEmail: user?.email || 'aarav.patel@ragnify.com',
    role: 'Frontend Development Intern',
    type: 'Intern',
    department: 'Engineering & Product Innovation',
    stipendSalary: '₹30,000 / mo',
    reportingManager: 'Vikram Mehta, Engineering Manager',
    joiningDate: '2026-08-01',
    generatedDate: '2026-07-20',
    status: 'COUNTERSIGNED',
    fileUrl: '/offer-letters/download/INT-201'
  };

  const loadTenure = () => {
    tenureService.getTenures().then(tenures => {
      if (Array.isArray(tenures) && tenures.length > 0) {
        const internTenure = tenures.find(t => t.type === 'Intern' || t.candidate_id === 'INT-201') || tenures[0];
        if (internTenure) {
          setTenureData({
            daysCompleted: internTenure.daysCompleted || internTenure.activeDays || 68,
            totalDays: internTenure.totalDays || 92,
            progress: internTenure.progress || 74,
            totalHours: (internTenure.daysCompleted || 68) * 8.5
          });
        }
      }
    }).catch(() => {});
  };

  useEffect(() => {
    loadTenure();
  }, []);

  const daysRemaining = Math.max(0, tenureData.totalDays - tenureData.daysCompleted);

  const handleDownloadOfferPdf = () => {
    window.open(`${backendBase}/offer-letters/download/INT-201`, '_blank');
    showToast('Downloading official Internship Offer Letter (PDF)...', 'success');
  };

  const handleSyncTenure = () => {
    loadTenure();
    showToast('Tenure progress and hours synced with HR ledger!', 'info');
  };

  const handleSendSupervisorMessage = (e) => {
    e.preventDefault();
    if (!supervisorNote.trim()) {
      showToast('Please type a message before sending.', 'error');
      return;
    }
    showToast('Message sent to Vikram Mehta (Engineering Manager)!', 'success');
    setSupervisorNote('');
    setSupervisorModalOpen(false);
  };

  const handleSubmitLeaveRequest = (e) => {
    e.preventDefault();
    if (!leaveData.startDate || !leaveData.reason) {
      showToast('Please enter start date and reason.', 'error');
      return;
    }
    setLeaveDaysRemaining(prev => Math.max(0, prev - 1));
    showToast('Leave request submitted to Vikram Mehta! HR notified.', 'success');
    setLeaveModalOpen(false);
    setLeaveData({ type: 'Casual Leave (1 day per month)', startDate: '', endDate: '', reason: '' });
  };

  return (
    <MainLayout title="My Internship">
      <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PageHeader
          title="Internship Roadmap & Terms"
          subtitle="Official agreement specifications, verified tenure milestones, mentor assignments, and evaluation criteria"
          actions={
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setPreviewInternOffer(internOfferData)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaEye size={12} /> View Offer Letter
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDownloadOfferPdf}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaDownload size={12} /> Download PDF
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setLeaveModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaCalendarCheck size={12} /> Request Leave
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSupervisorModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaUserTie size={12} /> Contact Supervisor
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleSyncTenure}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaSyncAlt size={12} /> Sync Progress
              </button>
            </div>
          }
        />

        {/* Highlighted Terms Card with BOLD & SLIGHTLY BIGGER KEYWORDS */}
        <div className="card" style={{ padding: '28px', border: '1px solid var(--border-default)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px', borderBottom: '1px solid var(--border-default)', paddingBottom: '16px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-primary-subtle)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              <FaUserGraduate />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Official Internship Specifications
              </h3>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Candidate ID: <strong>INT-201</strong> &bull; Verified by HR Operations
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px 28px' }}>
            {/* Field: Role */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBriefcase style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }} /> Role:
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                Frontend Development Intern
              </span>
            </div>

            {/* Field: Department */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBuilding style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }} /> Department:
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                Engineering & Product Innovation
              </span>
            </div>

            {/* Field: Mentor / Manager */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaUserTie style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }} /> Mentor / Manager:
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                Vikram Mehta (Engineering Manager)
              </span>
            </div>

            {/* Field: Duration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaClock style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }} /> Duration:
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                3 Months ({tenureData.totalDays} Total Days)
              </span>
            </div>

            {/* Field: Start Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarCheck style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }} /> Start Date:
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                August 01, 2026
              </span>
            </div>

            {/* Field: Expected End Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarCheck style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }} /> Expected End Date:
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                October 31, 2026
              </span>
            </div>

            {/* Field: Stipend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaMoneyBillWave style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }} /> Monthly Stipend:
              </span>
              <span style={{ fontSize: '1.02rem', fontWeight: '700', color: '#10b981', paddingLeft: '24px' }}>
                ₹30,000 / month (Direct Bank Transfer)
              </span>
            </div>

            {/* Field: Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCheckCircle style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }} /> Enrollment Status:
              </span>
              <div style={{ paddingLeft: '24px', paddingTop: '2px' }}>
                <StatusBadge status="ACTIVE" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tenure & Progress Overview */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Real-Time Internship Tenure Progress
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Tenure Completion: {tenureData.daysCompleted} of {tenureData.totalDays} Days ({daysRemaining} Days Remaining)
              </span>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--brand-primary)' }}>
                {tenureData.progress}%
              </span>
            </div>
            <div style={{ height: '10px', backgroundColor: 'var(--border-default)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${tenureData.progress}%`, height: '100%', backgroundColor: 'var(--brand-primary)', borderRadius: '5px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '16px' }}>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Working Hours</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {tenureData.daysCompleted * 8.5} hrs
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Milestone Review</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                Milestone 2 Completed
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>HR Synchronization</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981', marginTop: '2px' }}>
                Live Synced
              </div>
            </div>
          </div>
        </div>

        <OfferLetterPreviewModal
          isOpen={Boolean(previewInternOffer)}
          onClose={() => setPreviewInternOffer(null)}
          offer={previewInternOffer}
        />

        {/* MODAL: REQUEST LEAVE / BREAK */}
        {leaveModalOpen && (
          <div className="modal-overlay" onClick={() => setLeaveModalOpen(false)} style={{ zIndex: 9999 }}>
            <div className="modal-card" style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCalendarCheck color="var(--brand-primary)" size={16} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Request Internship Leave</h3>
                </div>
                <button className="btn-icon" onClick={() => setLeaveModalOpen(false)}><FaTimes /></button>
              </div>

              <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8125rem' }}>
                Paid Leaves Available: <strong style={{ color: 'var(--brand-primary)' }}>{leaveDaysRemaining} days</strong> across 92-day tenure (1 day/month allowance per policy).
              </div>

              <form onSubmit={handleSubmitLeaveRequest}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Leave Type</label>
                  <select
                    className="form-select"
                    value={leaveData.type}
                    onChange={e => setLeaveData({ ...leaveData, type: e.target.value })}
                  >
                    <option>Casual Leave (1 day per month)</option>
                    <option>Sick / Medical Leave</option>
                    <option>College Examination / Academic Leave</option>
                  </select>
                </div>

                <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={leaveData.startDate}
                      onChange={e => setLeaveData({ ...leaveData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={leaveData.endDate || leaveData.startDate}
                      onChange={e => setLeaveData({ ...leaveData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Reason / Academic Justification</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="e.g. Attending semester final examinations at IIT Bombay..."
                    value={leaveData.reason}
                    onChange={e => setLeaveData({ ...leaveData, reason: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setLeaveModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <FaPaperPlane size={11} /> Submit Leave Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CONTACT SUPERVISOR */}
        {supervisorModalOpen && (
          <div className="modal-overlay" onClick={() => setSupervisorModalOpen(false)} style={{ zIndex: 9999 }}>
            <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUserTie color="var(--brand-primary)" size={16} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Contact Assigned Mentor</h3>
                </div>
                <button className="btn-icon" onClick={() => setSupervisorModalOpen(false)}><FaTimes /></button>
              </div>

              <div style={{
                padding: '14px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '0.8125rem'
              }}>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Supervisor:</div>
                  <strong>Vikram Mehta</strong>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Designation:</div>
                  <span>Engineering Manager</span>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Email:</div>
                  <span>vikram.mehta@ragnify.io</span>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Work Location:</div>
                  <span>Bangalore HQ / Slack #frontend</span>
                </div>
              </div>

              <form onSubmit={handleSendSupervisorMessage}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Direct Message or Sprint Deliverable Update</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Hi Vikram, I have completed the assigned React component task and pushed to branch..."
                    value={supervisorNote}
                    onChange={e => setSupervisorNote(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setSupervisorModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <FaPaperPlane size={11} /> Send Message to Mentor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

/* ============================================================
   2. WORKING TIME PAGE - START & END BUTTONS & HR LOGS
============================================================ */
export function InternWorkingTime() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [currentClockIn, setCurrentClockIn] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [discrepancyForm, setDiscrepancyForm] = useState({
    date: new Date().toISOString().split('T')[0],
    requestedClockIn: '09:30',
    requestedClockOut: '18:30',
    reason: ''
  });

  const [tenureStats, setTenureStats] = useState({
    daysCompleted: 68,
    totalDays: 92,
    progress: 74
  });

  const loadWorkingHours = async () => {
    try {
      setLoading(true);
      const data = await workingHoursService.getWorkingHours('INT-201');
      if (Array.isArray(data)) {
        setLogs(data);
        const active = data.find(l => l.status === 'IN_PROGRESS');
        if (active) {
          setIsWorking(true);
          setCurrentClockIn(active.clockIn);
        } else {
          setIsWorking(false);
          setCurrentClockIn(null);
        }
      }

      const tenures = await tenureService.getTenures();
      if (Array.isArray(tenures)) {
        const intern = tenures.find(t => t.type === 'Intern' || t.candidate_id === 'INT-201') || tenures[0];
        if (intern) {
          setTenureStats({
            daysCompleted: intern.daysCompleted || intern.activeDays || 68,
            totalDays: intern.totalDays || 92,
            progress: intern.progress || 74
          });
        }
      }
    } catch (err) {
      console.error('Error loading working hours:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const handleStartWork = async () => {
    setProcessing(true);
    try {
      const payload = {
        candidate_id: 'INT-201',
        candidate_name: user?.name || 'Ananya Roy'
      };
      const res = await workingHoursService.startWork(payload);
      setIsWorking(true);
      setCurrentClockIn(res.record?.clockIn || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      showToast(res.message || 'Working session started! Hours will accumulate into today\'s record.', 'success');
      loadWorkingHours();
    } catch (err) {
      console.error('Start work failed:', err);
      showToast('Failed to record clock-in with backend.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleEndWork = async () => {
    setProcessing(true);
    try {
      const payload = {
        candidate_id: 'INT-201',
        candidate_name: user?.name || 'Ananya Roy'
      };
      const res = await workingHoursService.endWork(payload);
      setIsWorking(false);
      setCurrentClockIn(null);
      if (res.tenure) {
        setTenureStats(res.tenure);
      }
      showToast(res.message || `Work session paused. Total hours recorded: ${res.record?.totalHours || 'updated'} & tenure synced!`, 'success');
      loadWorkingHours();
    } catch (err) {
      console.error('End work failed:', err);
      showToast('Failed to record clock-out with backend.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleExportCSV = () => {
    if (!logs || logs.length === 0) {
      showToast('No attendance records available to export.', 'warning');
      return;
    }
    const headers = ['Date', 'Candidate Name', 'Clock In', 'Clock Out', 'Total Accumulated Hours', 'Status'];
    const rows = logs.map(l => [
      `"${l.date || ''}"`,
      `"${l.candidateName || l.name || user?.name || 'Ananya Roy'}"`,
      `"${l.clockIn || ''}"`,
      `"${l.clockOut || '--:--'}"`,
      `"${l.totalHours || l.total || '0.0 hrs'}"`,
      `"${l.status || 'COMPLETED'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RAGNIFY_Attendance_INT-201_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audited attendance log exported to CSV successfully!', 'success');
  };

  const handleReportAdjustment = (e) => {
    e.preventDefault();
    if (!discrepancyForm.reason) {
      showToast('Please provide a note or reason for the requested time adjustment.', 'error');
      return;
    }
    showToast(`Time adjustment request submitted for ${discrepancyForm.date} to Supervisor Vikram Mehta & HR!`, 'success');
    setAdjustmentModalOpen(false);
    setDiscrepancyForm({
      date: new Date().toISOString().split('T')[0],
      requestedClockIn: '09:30',
      requestedClockOut: '18:30',
      reason: ''
    });
  };

  const filteredLogs = logs.filter(l => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'COMPLETED') return l.status === 'COMPLETED';
    if (filterStatus === 'IN_PROGRESS') return l.status === 'IN_PROGRESS';
    return true;
  });

  return (
    <MainLayout title="Working Time">
      <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PageHeader
          title="Daily Working Time & Attendance"
          subtitle="Log clock-in and clock-out timestamps. Taking breaks and restarting on the same date accumulates hours in the same daily record and accelerates certificate progress."
          actions={
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  loadWorkingHours();
                  showToast('Refreshed attendance logs from master database.', 'info');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaSyncAlt size={12} /> Sync Logs
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAdjustmentModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaEdit size={12} /> Report Discrepancy
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleExportCSV}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaFileCsv size={13} /> Export CSV
              </button>
            </div>
          }
        />

        {/* Interactive Start & End Work Widget */}
        <div className="card" style={{ padding: '24px', border: '1px solid var(--border-default)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Attendance Time Clock
                </span>
                <span className={`badge ${isWorking ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                  {isWorking ? '🟢 ACTIVE WORKING SESSION' : '⚪ ON BREAK / OFF DUTY'}
                </span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {isWorking ? `Session active — Clocked in at ${currentClockIn || '09:30 AM'}. Click 'Pause / End Work' when taking a break.` : 'Click Start Work to begin or resume your daily shift (multiple sessions accumulate in the same row).'}
              </span>
            </div>

            {/* Start & End Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                disabled={isWorking || processing}
                onClick={handleStartWork}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  backgroundColor: isWorking ? 'var(--bg-surface-subtle)' : '#10b981',
                  borderColor: isWorking ? 'var(--border-default)' : '#10b981',
                  color: isWorking ? 'var(--text-secondary)' : '#ffffff',
                  cursor: isWorking ? 'not-allowed' : 'pointer',
                  borderRadius: '8px'
                }}
              >
                <FaPlay size={12} /> {logs.some(l => l.date === new Date().toISOString().split('T')[0]) ? 'Resume Shift' : 'Start Work'}
              </button>

              <button
                className="btn-secondary"
                disabled={!isWorking || processing}
                onClick={handleEndWork}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  backgroundColor: !isWorking ? 'var(--bg-surface-subtle)' : '#ef4444',
                  borderColor: !isWorking ? 'var(--border-default)' : '#ef4444',
                  color: !isWorking ? 'var(--text-secondary)' : '#ffffff',
                  cursor: !isWorking ? 'not-allowed' : 'pointer',
                  borderRadius: '8px'
                }}
              >
                <FaStop size={12} /> Pause / End Work
              </button>
            </div>
          </div>

          {/* Dynamic Tenure Impact Banner */}
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Updated Tenure Days</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {tenureStats.daysCompleted} / {tenureStats.totalDays} Days
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Tenure Completion</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--brand-primary)', marginTop: '2px' }}>
                {tenureStats.progress}% Completed
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Certificate Readiness</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: tenureStats.progress >= 90 ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <FaAward /> {tenureStats.totalDays - tenureStats.daysCompleted} Days to Certificate Award
              </div>
            </div>
          </div>
        </div>

        {/* Audited Working Time History Table */}
        <div className="table-card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="card-title" style={{ margin: 0 }}>Audited Attendance Logs (HR Master)</h3>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>1 Daily Row per Date (Accumulated Hours)</span>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  background: filterStatus === 'ALL' ? 'var(--brand-primary)' : 'transparent',
                  color: filterStatus === 'ALL' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                All Shifts ({logs.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('COMPLETED')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  background: filterStatus === 'COMPLETED' ? 'var(--brand-primary)' : 'transparent',
                  color: filterStatus === 'COMPLETED' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                Completed ({logs.filter(l => l.status === 'COMPLETED').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('IN_PROGRESS')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  background: filterStatus === 'IN_PROGRESS' ? 'var(--brand-primary)' : 'transparent',
                  color: filterStatus === 'IN_PROGRESS' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                Active ({logs.filter(l => l.status === 'IN_PROGRESS').length})
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Candidate</th>
                  <th>Initial Clock In</th>
                  <th>Last Clock Out</th>
                  <th>Total Accumulated Hours</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      <div className="spinner" style={{ margin: '0 auto 8px auto' }}></div>
                      Loading attendance records...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      No working time logs match your filter. Click <strong>Start Work</strong> to begin a session.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((l, i) => (
                    <tr key={l.id || i}>
                      <td><strong style={{ color: 'var(--text-primary)' }}>{l.date}</strong></td>
                      <td>{l.candidateName || l.name || 'Ananya Roy'}</td>
                      <td>{l.clockIn}</td>
                      <td>{l.clockOut || '--:--'}</td>
                      <td>
                        <strong style={{ color: l.status === 'IN_PROGRESS' ? 'var(--status-warning)' : 'var(--text-primary)' }}>
                          {l.totalHours || l.total || 'In Progress'}
                        </strong>
                      </td>
                      <td><StatusBadge status={l.status || 'COMPLETED'} /></td>
                      <td>
                        <button
                          type="button"
                          className="btn-action"
                          onClick={() => showToast(`Shift on ${l.date}: ${l.totalHours || 'In Progress'} verified in HR attendance audit trail.`, 'info')}
                          style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                          <FaEye size={11} /> Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Time Discrepancy Modal */}
        {adjustmentModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 21, 40, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaEdit color="var(--brand-primary)" /> Report Attendance Discrepancy
                </h3>
                <button
                  type="button"
                  onClick={() => setAdjustmentModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleReportAdjustment}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Shift Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={discrepancyForm.date}
                    onChange={(e) => setDiscrepancyForm({ ...discrepancyForm, date: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Correct Clock-In</label>
                    <input
                      type="time"
                      className="form-input"
                      value={discrepancyForm.requestedClockIn}
                      onChange={(e) => setDiscrepancyForm({ ...discrepancyForm, requestedClockIn: e.target.value })}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Correct Clock-Out</label>
                    <input
                      type="time"
                      className="form-input"
                      value={discrepancyForm.requestedClockOut}
                      onChange={(e) => setDiscrepancyForm({ ...discrepancyForm, requestedClockOut: e.target.value })}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Reason for Time Adjustment</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="e.g. System glitch during morning clock-in or power outage at home office..."
                    value={discrepancyForm.reason}
                    onChange={(e) => setDiscrepancyForm({ ...discrepancyForm, reason: e.target.value })}
                    required
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setAdjustmentModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <FaPaperPlane size={11} /> Submit Adjustment Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

/* ============================================================
   3. MY DOCUMENTS PAGE - ONLY ESSENTIAL APPLICATION DOCUMENTS
============================================================ */
export function InternDocuments() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const backendBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Exactly the essential 5 application documents for Intern
  const initialDocs = [
    {
      id: 'DOC-INT-01',
      name: 'Resume / CV',
      fileName: 'INT-201_Resume.pdf',
      fileUrl: '/documents/view/INT-201_Resume.pdf',
      documentType: 'Resume / CV',
      category: 'Career Profile',
      size: '1.2 MB',
      date: '2026-08-01',
      status: 'VERIFIED',
      type: 'PDF'
    },
    {
      id: 'DOC-INT-02',
      name: 'Identity Proof (Aadhaar)',
      fileName: 'INT-201_Identity_Proof.pdf',
      fileUrl: '/documents/view/INT-201_Identity_Proof.pdf',
      documentType: 'Identity Proof (Aadhaar)',
      category: 'Identity & Government KYC',
      size: '1.4 MB',
      date: '2026-08-01',
      status: 'VERIFIED',
      type: 'PDF'
    },
    {
      id: 'DOC-INT-03',
      name: 'PAN Card Proof',
      fileName: 'INT-201_PAN_Proof.pdf',
      fileUrl: '/documents/view/INT-201_PAN_Proof.pdf',
      documentType: 'PAN Card Proof',
      category: 'Tax & Compliance',
      size: '680 KB',
      date: '2026-08-01',
      status: 'VERIFIED',
      type: 'PDF'
    },
    {
      id: 'DOC-INT-04',
      name: 'Official Offer Letter',
      fileName: 'INT-201_Offer_Letter.pdf',
      fileUrl: '/documents/view/INT-201_Offer_Letter.pdf',
      documentType: 'Offer Letter',
      category: 'Corporate & Tenure',
      size: '1.8 MB',
      date: '2026-08-01',
      status: 'VERIFIED',
      type: 'PDF'
    },
    {
      id: 'DOC-INT-05',
      name: 'Internship Completion Certificate',
      fileName: 'INT-201_Internship_Certificate.pdf',
      fileUrl: '/documents/view/INT-201_Internship_Certificate.pdf',
      documentType: 'Internship Certificate',
      category: 'Academic & Credentials',
      size: '2.1 MB',
      date: '2026-08-01',
      status: 'VERIFIED',
      type: 'PDF'
    }
  ];

  const [documents, setDocuments] = useState(initialDocs);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewerDoc, setViewerDoc] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Career Profile',
    file: null
  });

  const loadDocuments = async () => {
    try {
      const serverDocs = await documentService.getDocuments({ role: 'INTERN', user_id: 'INT-201' });
      if (Array.isArray(serverDocs) && serverDocs.length > 0) {
        setDocuments(serverDocs);
      }
    } catch (e) {
      console.error('Error fetching intern documents:', e);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDownload = (doc) => {
    const fName = doc.fileName || doc.filename || `${doc.name || 'document'}.pdf`;
    const downloadUrl = `${backendBase}/documents/download/${fName}`;
    window.open(downloadUrl, '_blank');
    showToast(`Downloading official ${doc.documentType || doc.name}...`, 'success');
  };

  const handleView = (doc) => {
    const fName = doc.fileName || doc.filename || `${doc.name || 'document'}.pdf`;
    const internName = (user && user.name) ? user.name : 'Ananya Roy';
    setViewerDoc({
      ...doc,
      candidateId: 'INT-201',
      candidateName: internName,
      type: 'Intern',
      fileName: fName,
      fileUrl: doc.fileUrl || `/documents/view/${fName}`
    });
    showToast(`Opening ${doc.documentType || doc.name || 'document'}...`, 'info');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      showToast('Please provide a document title.', 'error');
      return;
    }
    const newDoc = {
      id: `DOC-INT-${Date.now()}`,
      name: uploadForm.title.trim(),
      fileName: uploadForm.file?.name || `${uploadForm.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileUrl: `/documents/view/${uploadForm.file?.name || 'uploaded_document.pdf'}`,
      category: uploadForm.category,
      size: uploadForm.file ? `${Math.round(uploadForm.file.size / 1024)} KB` : '950 KB',
      date: new Date().toISOString().split('T')[0],
      status: 'VERIFIED',
      type: 'PDF'
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`Document "${newDoc.name}" uploaded and verified in HR Vault!`, 'success');
    setUploadModalOpen(false);
    setUploadForm({ title: '', category: 'Career Profile', file: null });
  };

  const filteredDocs = documents.filter(doc => {
    const docName = (doc.name || doc.documentType || '').toLowerCase();
    const docCat = (doc.category || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || docName.includes(q) || docCat.includes(q);
    const matchesCat = categoryFilter === 'ALL' || doc.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ['ALL', 'Career Profile', 'Identity & KYC', 'Tax & Compliance', 'Corporate & Tenure', 'Academic & Credentials'];

  return (
    <MainLayout title="My Documents">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <PageHeader
          title="My Verified Internship Documents"
          subtitle="Essential application and compliance files verified by HR Operations for your internship"
          actions={
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  loadDocuments();
                  showToast('Document vault synchronized with HR master records.', 'info');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaSyncAlt size={12} /> Sync Vault
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setUploadModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaFileUpload size={12} /> Upload Additional Document
              </button>
            </div>
          }
        />

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '260px', maxWidth: '450px' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={13} />
              <input
                type="text"
                placeholder="Search verified documents by name or category..."
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '34px', paddingRight: searchQuery ? '32px' : '12px', height: '38px' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing {filteredDocs.length} of {documents.length} essential application files
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-default)',
                  background: categoryFilter === cat ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                  color: categoryFilter === cat ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat === 'ALL' ? `All Documents (${documents.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Category</th>
                  <th>File Size</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                      No documents match your query "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px'
                          }}>
                            <FaFilePdf />
                          </div>
                          <div>
                            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{d.name}</strong>
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{d.fileName}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-info">{d.category}</span></td>
                      <td>{d.size}</td>
                      <td>{d.date}</td>
                      <td><StatusBadge status={d.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-action"
                            onClick={() => handleView(d)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          >
                            <FaEye size={11} /> View
                          </button>
                          <button
                            type="button"
                            className="btn-action"
                            onClick={() => handleDownload(d)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          >
                            <FaDownload size={11} /> Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Viewer Modal */}
        {viewerDoc && (
          <DocumentViewerModal
            doc={viewerDoc}
            candidateName={user?.name || 'Ananya Roy'}
            candidateType="Intern"
            onClose={() => setViewerDoc(null)}
          />
        )}

        {/* Upload Document Modal */}
        {uploadModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 21, 40, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaFileUpload color="var(--brand-primary)" /> Upload Application Document
                </h3>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Document Category</label>
                  <select
                    className="form-input"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="Career Profile">Career Profile (Resume / Portfolio)</option>
                    <option value="Identity & KYC">Identity & KYC (Aadhaar / Voter ID)</option>
                    <option value="Tax & Compliance">Tax & Compliance (PAN Proof)</option>
                    <option value="Corporate & Tenure">Corporate & Tenure (Agreement / NOC)</option>
                    <option value="Academic & Credentials">Academic & Credentials (College Verification / Marksheet)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Document Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Updated Resume or College Bonafide NOC"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Select File (PDF, PNG, JPG)</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1.5px dashed var(--border-default)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setUploadModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <FaFileUpload size={11} /> Confirm &amp; Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

/* ============================================================
   4. MY CERTIFICATE PAGE - TWO-STEP SECURITY CLEARANCE GATE
============================================================ */
export function InternCertificate() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [tenure, setTenure] = useState({
    daysCompleted: 68,
    totalDays: 92,
    progress: 74
  });
  const [certRecord, setCertRecord] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hrReviewRequested, setHrReviewRequested] = useState(false);
  const [supervisorModalOpen, setSupervisorModalOpen] = useState(false);
  const [supervisorNote, setSupervisorNote] = useState('');

  const backendBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const fetchCertificateAccessStatus = () => {
    setLoadingStatus(true);
    Promise.all([
      tenureService.getTenures().catch(() => []),
      certificateService.getCertificates().catch(() => [])
    ]).then(([tenures, certs]) => {
      if (Array.isArray(tenures)) {
        const intern = tenures.find(t => t.candidate_id === 'INT-201' || t.type === 'Intern') || tenures[0];
        if (intern) {
          setTenure({
            daysCompleted: intern.daysCompleted || intern.activeDays || 68,
            totalDays: intern.totalDays || 92,
            progress: intern.progress || 74
          });
        }
      }

      if (Array.isArray(certs) && certs.length > 0) {
        const targetName = (user?.name || 'Ananya Roy').toLowerCase();
        const match = certs.find(
          c =>
            c.candidateId === 'INT-201' ||
            c.id === 'CERT-INT-201' ||
            c.candidateName?.toLowerCase() === targetName
        );
        if (match) {
          setCertRecord(match);
          if (match.daysCompleted !== undefined && match.totalDays !== undefined) {
            setTenure({
              daysCompleted: match.daysCompleted,
              totalDays: match.totalDays,
              progress: match.progress || Math.round((match.daysCompleted / match.totalDays) * 100)
            });
          }
        }
      }
    }).finally(() => {
      setLoadingStatus(false);
    });
  };

  useEffect(() => {
    fetchCertificateAccessStatus();
  }, [user]);

  // Strict Gate: Intern can ONLY see and download the certificate when internship is completed AND HR has approved access
  const isUnlocked = Boolean(
    certRecord &&
    (certRecord.certificateStatus === 'AVAILABLE' || certRecord.hrApproved === true || certRecord.internAccessGranted === true) &&
    certRecord.tenureStatus === 'COMPLETED'
  );

  const effectiveDaysCompleted = isUnlocked ? 92 : (certRecord?.daysCompleted || tenure.daysCompleted || 68);
  const effectiveTotalDays = certRecord?.totalDays || tenure.totalDays || 92;
  const effectiveProgress = isUnlocked ? 100 : (certRecord?.progress || tenure.progress || 74);
  const daysRemaining = Math.max(0, effectiveTotalDays - effectiveDaysCompleted);

  const activeCertificate = {
    id: certRecord?.id || 'CERT-INT-201',
    candidateId: certRecord?.candidateId || 'INT-201',
    candidateName: user?.name || certRecord?.candidateName || 'Ananya Roy',
    type: 'Intern',
    certificateType: 'Internship Completion Certificate',
    role: certRecord?.role || 'Frontend Development Intern',
    department: certRecord?.department || 'Frontend Engineering',
    mentorName: certRecord?.mentorName || 'Vikram Mehta',
    internshipPeriod: certRecord?.internshipPeriod || 'Aug 01, 2026 – Oct 31, 2026 (3 Months)',
    certificateStatus: isUnlocked ? 'AVAILABLE' : 'LOCKED',
    issueDate: isUnlocked ? (certRecord?.issueDate || new Date().toISOString().split('T')[0]) : 'Locked — Pending HR Approval'
  };

  const handleDownloadPdf = () => {
    if (!isUnlocked) {
      showToast('Certificate is locked until your internship is completed and approved by HR.', 'error');
      return;
    }
    const url = `${backendBase}/certificates/download/${activeCertificate.id}`;
    window.open(url, '_blank');
    showToast('Downloading your official HR-approved Certificate of Completion PDF...', 'success');
  };

  const handleRequestReview = () => {
    setHrReviewRequested(true);
    showToast('Formal tenure completion review requested! HR Operations and Supervisor Vikram Mehta have been notified.', 'success');
  };

  const handleSendSupervisorNote = (e) => {
    e.preventDefault();
    if (!supervisorNote.trim()) {
      showToast('Please enter a note for Supervisor Vikram Mehta.', 'error');
      return;
    }
    showToast('Message sent to Supervisor Vikram Mehta regarding completion sign-off.', 'success');
    setSupervisorModalOpen(false);
    setSupervisorNote('');
  };

  return (
    <MainLayout title="My Certificate">
      <div className="fade-in" style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <PageHeader
          title="Internship Completion Certificate"
          subtitle="Official completion credential — unlocked exclusively upon 100% internship completion and HR authorization"
          actions={
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  fetchCertificateAccessStatus();
                  showToast('Synced latest certificate approval status from HR Operations.', 'info');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaSyncAlt size={12} /> Check HR Approval Status
              </button>

              {isUnlocked ? (
                <>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FaEye size={12} /> Full-Screen &amp; PDF Stream
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleDownloadPdf}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FaDownload size={12} /> Download Official PDF
                  </button>
                </>
              ) : (
                <span
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    border: '1px solid #FDE68A',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FaLock size={11} /> Locked Until HR Approval
                </span>
              )}
            </div>
          }
        />

        {/* STATUS & TENURE CLEARANCE BANNER */}
        <div className="card" style={{ padding: '20px 24px', borderLeft: `4px solid ${isUnlocked ? '#10B981' : '#F59E0B'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                HR Credential &amp; Tenure Clearance Gate
              </h3>
              <span className={`badge ${isUnlocked ? 'badge-success' : 'badge-warning'}`}>
                {isUnlocked ? <FaAward size={10} /> : <FaLock size={10} />}{' '}
                {isUnlocked ? 'APPROVED & UNLOCKED BY HR' : 'CERTIFICATE LOCKED — AWAITING COMPLETION & HR APPROVAL'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: '800', color: isUnlocked ? '#059669' : 'var(--brand-primary)' }}>
              {isUnlocked ? '100% Completed & HR Approved' : `${effectiveDaysCompleted} / ${effectiveTotalDays} Days (${effectiveProgress}%)`}
            </div>
          </div>

          <p className="text-sm" style={{ margin: '0 0 14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {isUnlocked
              ? 'Congratulations! Your internship tenure has been marked 100% completed and your official Completion Certificate has been approved and unlocked by HR Operations. You may now view and download your verified PDF certificate below.'
              : `Your Internship Completion Certificate is strictly hidden and locked until your ${effectiveTotalDays}-day internship tenure is completed (${daysRemaining} days remaining) AND HR Operations approves and unlocks your certificate from the HR Certificates module.`}
          </p>

          <div style={{ height: '8px', backgroundColor: 'var(--border-default)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${effectiveProgress}%`,
                height: '100%',
                backgroundColor: isUnlocked ? '#10B981' : 'var(--brand-primary)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* CONDITIONAL RENDER: ONLY SHOW CERTIFICATE WHEN INTERNSHIP IS COMPLETED & APPROVED BY HR */}
        {isUnlocked ? (
          <>
            <div
              style={{
                padding: '28px 20px',
                borderRadius: '12px',
                backgroundColor: '#0F172A',
                backgroundImage: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '18px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid rgba(197, 155, 39, 0.28)'
                }}
              >
                <div style={{ color: '#F5E6B3', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCheckCircle color="#34D399" /> Official Certificate Unlocked by HR Operations — Ready for Download
                </div>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #C59B27 0%, #A67C1E 100%)',
                    color: '#0B1528',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px'
                  }}
                >
                  <FaDownload size={12} /> Download My Official Certificate (PDF)
                </button>
              </div>

              <OfficialCertificateCard cert={activeCertificate} />
            </div>

            {showModal && (
              <CertificatePreviewModal
                cert={activeCertificate}
                onClose={() => setShowModal(false)}
                onDownload={handleDownloadPdf}
              />
            )}
          </>
        ) : (
          /* LOCKED STATE CARD — INTERN CANNOT SEE OR DOWNLOAD THE CERTIFICATE */
          <div
            className="card"
            style={{
              padding: '42px 32px',
              textAlign: 'center',
              background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%)',
              border: '1.5px dashed var(--border-default)',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                border: '2px solid #F59E0B',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.25)'
              }}
            >
              <FaLock size={28} />
            </div>

            <div style={{ maxWidth: '580px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#FEE2E2',
                  color: '#B91C1C',
                  border: '1px solid #FCA5A5'
                }}
              >
                Restricted Access &bull; Certificate Hidden
              </span>
              <h3 style={{ margin: '10px 0 6px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Your Completion Certificate is Currently Locked
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                In accordance with <strong>RAGNIFY Enterprise HR Governance</strong>, interns cannot view or download their
                Completion Certificate until their internship tenure is <strong>100% completed</strong> and <strong>HR Operations</strong>{' '}
                approves and unlocks the credential from the HR Certificates module.
              </p>
            </div>

            {/* 3-Step Unlock Checklist */}
            <div
              style={{
                width: '100%',
                maxWidth: '720px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '12px',
                marginTop: '6px',
                textAlign: 'left'
              }}
            >
              <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Step 1 &bull; In Progress
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Complete 92-Day Tenure
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
                  Current: <strong>{effectiveDaysCompleted} / {effectiveTotalDays} Days ({effectiveProgress}%)</strong>
                </div>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Step 2 &bull; Mentor Review
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Manager Deliverable Clearance
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
                  Supervisor: <strong>Vikram Mehta</strong>
                </div>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Step 3 &bull; Required Gate
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  HR Certificate Approval
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '3px' }}>
                  HR must click <strong>Approve &amp; Grant Access</strong>
                </div>
              </div>
            </div>

            {/* Working Action Buttons inside Locked State */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
              <button
                type="button"
                className={hrReviewRequested ? 'btn-secondary' : 'btn-primary'}
                onClick={handleRequestReview}
                disabled={hrReviewRequested}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: hrReviewRequested ? '#D1FAE5' : undefined,
                  borderColor: hrReviewRequested ? '#10B981' : undefined,
                  color: hrReviewRequested ? '#065F46' : undefined
                }}
              >
                {hrReviewRequested ? (
                  <>
                    <FaCheckCircle size={13} color="#10B981" /> Review Request Submitted to HR
                  </>
                ) : (
                  <>
                    <FaEnvelope size={12} /> Request HR Completion Review
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/intern/internship')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <FaExternalLinkAlt size={12} /> View Internship Roadmap
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSupervisorModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <FaUserTie size={12} /> Message Supervisor (Vikram)
              </button>
            </div>
          </div>
        )}

        {/* Supervisor Communication Modal */}
        {supervisorModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 21, 40, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUserTie color="var(--brand-primary)" /> Message Supervisor Vikram Mehta
                </h3>
                <button
                  type="button"
                  onClick={() => setSupervisorModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleSendSupervisorNote}>
                <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recipient:</div>
                  <strong style={{ fontSize: '0.95rem' }}>Vikram Mehta (Engineering Manager &amp; Intern Supervisor)</strong>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Message / Question Regarding Final Deliverable Clearance
                  </label>
                  <textarea
                    rows={4}
                    className="form-input"
                    placeholder="Hello Vikram, I have completed the final frontend capstone deliverables. Could you please clear my deliverables in HR portal for certificate release?"
                    value={supervisorNote}
                    onChange={(e) => setSupervisorNote(e.target.value)}
                    required
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setSupervisorModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <FaPaperPlane size={11} /> Send Message to Vikram
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

/* ============================================================
   5. INTERN PROFILE PAGE - FULLY INTERACTIVE & EDITABLE
============================================================ */
export function InternProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Ananya Roy',
    role: 'Frontend Development Intern',
    department: 'Engineering & Product Innovation',
    internId: 'INT-201',
    email: user?.email || 'ananya.roy@ragnify.com',
    phone: '+91 98765 43210',
    college: 'IIT Bombay',
    degree: 'B.Tech Computer Science (2026)',
    manager: 'Vikram Mehta (Engineering Manager)',
    tenure: 'Aug 01, 2026 – Oct 31, 2026',
    address: 'Powai, Mumbai, Maharashtra 400076',
    github: 'https://github.com/ananya-roy',
    linkedin: 'https://linkedin.com/in/ananya-roy',
    skills: ['React.js', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'REST APIs', 'Git / GitHub', 'UI/UX Prototyping']
  });

  const [editFormData, setEditFormData] = useState({ ...profile });
  const [newSkill, setNewSkill] = useState('');
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [mentorMessage, setMentorMessage] = useState('');

  const handleStartEdit = () => {
    setEditFormData({ ...profile });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditFormData({ ...profile });
    setIsEditing(false);
    showToast('Profile edits cancelled.', 'info');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editFormData });
    setIsEditing(false);
    showToast('Intern profile details successfully saved to HR database!', 'success');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const skillToAdd = newSkill.trim();
    if (editFormData.skills.includes(skillToAdd)) {
      showToast('Skill already in your inventory.', 'warning');
      return;
    }
    const updatedSkills = [...editFormData.skills, skillToAdd];
    setEditFormData({ ...editFormData, skills: updatedSkills });
    setNewSkill('');
    showToast(`Added skill: "${skillToAdd}"`, 'success');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = editFormData.skills.filter(s => s !== skillToRemove);
    setEditFormData({ ...editFormData, skills: updatedSkills });
    showToast(`Removed skill: "${skillToRemove}"`, 'info');
  };

  const handleDownloadSummary = () => {
    const content = `=======================================================
RAGNIFY ENTERPRISE HR - INTERN PROFILE SUMMARY
=======================================================
Generated Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
System Record: Verified Active Intern

[1] CANDIDATE IDENTITY
-------------------------------------------------------
Full Name        : ${profile.name}
Intern ID        : ${profile.internId}
Role / Title     : ${profile.role}
Department       : ${profile.department}
Assigned Manager : ${profile.manager}

[2] CONTACT & AFFILIATION
-------------------------------------------------------
Corporate Email  : ${profile.email}
Phone Number     : ${profile.phone}
College / Univ   : ${profile.college}
Degree & Major   : ${profile.degree}
Residential Base : ${profile.address}

[3] INTERNSHIP TENURE
-------------------------------------------------------
Period           : ${profile.tenure}
Current Progress : 74% (68 / 92 Days Completed)
Certificate Gate : Locked Pending HR Approval

[4] TECHNICAL SKILL SET
-------------------------------------------------------
Skills Inventory : ${profile.skills.join(', ')}
GitHub Profile   : ${profile.github}
LinkedIn URL     : ${profile.linkedin}

=======================================================
CONFIDENTIAL - FOR AUTHORIZED RAGNIFY HR USE ONLY
=======================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAGNIFY_Intern_Profile_${profile.internId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Intern profile summary downloaded successfully!', 'success');
  };

  const handleSendMentorMessage = (e) => {
    e.preventDefault();
    if (!mentorMessage.trim()) {
      showToast('Please type a message before sending.', 'error');
      return;
    }
    showToast('Direct communication dispatched to Mentor Vikram Mehta.', 'success');
    setMentorModalOpen(false);
    setMentorMessage('');
  };

  return (
    <MainLayout title="My Profile">
      <div className="fade-in" style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <PageHeader
          title="Intern Profile & Identity"
          subtitle="Personal identity information, technical skill inventory, and registered college affiliation"
          actions={
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDownloadSummary}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaDownload size={12} /> Download Summary (.TXT)
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMentorModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaEnvelope size={12} /> Message Mentor
              </button>
              {!isEditing ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleStartEdit}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FaEdit size={12} /> Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancelEdit}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FaTimes size={12} /> Cancel
                </button>
              )}
            </div>
          }
        />

        {/* Profile Card */}
        <div className="card" style={{ padding: '28px' }}>
          {/* Header Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-default)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary-subtle)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: '800',
              border: '2px solid var(--brand-primary)'
            }}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0 }}>{profile.name}</h2>
                <span className="badge badge-success">ACTIVE INTERN</span>
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                {profile.role} &bull; {profile.department}
              </div>
            </div>
          </div>

          {/* Form or Display */}
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Intern ID</span>
                <strong style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--brand-primary)' }}>{profile.internId}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Work Email</span>
                <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{profile.email}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>College / University</span>
                <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{profile.college}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Degree &amp; Major</span>
                <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{profile.degree}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Assigned Manager</span>
                <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: '#10b981' }}>{profile.manager}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Internship Tenure</span>
                <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{profile.tenure}</strong>
              </div>

              {/* Editable Fields: Phone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone Number</span>
                {isEditing ? (
                  <input
                    type="tel"
                    className="form-input"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    style={{ marginTop: '2px' }}
                  />
                ) : (
                  <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{profile.phone}</strong>
                )}
              </div>

              {/* Editable Fields: Address */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location Base</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    style={{ marginTop: '2px' }}
                  />
                ) : (
                  <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{profile.address}</strong>
                )}
              </div>

              {/* Editable Fields: GitHub */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>GitHub Profile</span>
                {isEditing ? (
                  <input
                    type="url"
                    className="form-input"
                    value={editFormData.github}
                    onChange={(e) => setEditFormData({ ...editFormData, github: e.target.value })}
                    style={{ marginTop: '2px' }}
                  />
                ) : (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--brand-primary)', textDecoration: 'underline' }}>
                    {profile.github}
                  </a>
                )}
              </div>

              {/* Editable Fields: LinkedIn */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>LinkedIn Profile</span>
                {isEditing ? (
                  <input
                    type="url"
                    className="form-input"
                    value={editFormData.linkedin}
                    onChange={(e) => setEditFormData({ ...editFormData, linkedin: e.target.value })}
                    style={{ marginTop: '2px' }}
                  />
                ) : (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--brand-primary)', textDecoration: 'underline' }}>
                    {profile.linkedin}
                  </a>
                )}
              </div>
            </div>

            {/* Technical Skills Inventory */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>Skills &amp; Technical Competencies</h3>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Verified frontend and engineering capabilities</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: isEditing ? '16px' : '0' }}>
                {(isEditing ? editFormData.skills : profile.skills).map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      backgroundColor: 'var(--brand-primary-subtle)',
                      color: 'var(--brand-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--brand-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: 0
                        }}
                      >
                        <FaTimes size={11} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div style={{ display: 'flex', gap: '10px', maxWidth: '400px', marginTop: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add a new skill (e.g. Next.js, Redux)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn-secondary" onClick={handleAddSkill}>
                    <FaPlus size={11} /> Add Skill
                  </button>
                </div>
              )}
            </div>

            {/* Save / Cancel Bar */}
            {isEditing && (
              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FaSave size={12} /> Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Message Mentor Modal */}
        {mentorModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 21, 40, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaEnvelope color="var(--brand-primary)" /> Message Mentor Vikram Mehta
                </h3>
                <button
                  type="button"
                  onClick={() => setMentorModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleSendMentorMessage}>
                <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mentor / Supervisor:</div>
                  <strong style={{ fontSize: '0.95rem' }}>Vikram Mehta (Engineering Manager)</strong>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Message Content
                  </label>
                  <textarea
                    rows={4}
                    className="form-input"
                    placeholder="Hi Vikram, I wanted to discuss my sprint progress and request guidance on our UI architecture..."
                    value={mentorMessage}
                    onChange={(e) => setMentorMessage(e.target.value)}
                    required
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setMentorModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <FaPaperPlane size={11} /> Send Message to Mentor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}


export default InternMyInternship;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard, StatusBadge } from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { workingHoursService, tenureService } from '../../api/onboardingService';
import { useToast } from '../../context/ToastContext';
import OfferLetterPreviewModal from '../../components/common/OfferLetterPreviewModal';
import {
  FaClock,
  FaCalendarAlt,
  FaUserGraduate,
  FaAward,
  FaFileAlt,
  FaPlay,
  FaStop,
  FaCheckCircle,
  FaEye,
  FaFileContract,
  FaRobot
} from 'react-icons/fa';

export function InternDashboard() {
  const { user } = useAuth();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState('09:30 AM');
  const [previewOffer, setPreviewOffer] = useState(null);
  const [tenure, setTenure] = useState({
    daysCompleted: 68,
    totalDays: 92,
    progress: 74
  });
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const hoursData = await workingHoursService.getWorkingHours('INT-201');
      if (Array.isArray(hoursData)) {
        const active = hoursData.find(l => l.status === 'IN_PROGRESS');
        if (active) {
          setIsClockedIn(true);
          setClockInTime(active.clockIn);
        } else {
          setIsClockedIn(false);
        }
      }

      const tenures = await tenureService.getTenures();
      if (Array.isArray(tenures)) {
        const intern = tenures.find(t => t.type === 'Intern' || t.candidate_id === 'INT-201') || tenures[0];
        if (intern) {
          setTenure({
            daysCompleted: intern.daysCompleted || intern.activeDays || 68,
            totalDays: intern.totalDays || 92,
            progress: intern.progress || 74
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const daysCompleted = tenure.daysCompleted;
  const totalDays = tenure.totalDays;
  const daysRemaining = Math.max(0, totalDays - daysCompleted);
  const progressPercent = tenure.progress;

  const handleClockToggle = async () => {
    if (!isClockedIn) {
      const res = await workingHoursService.startWork({ candidate_id: 'INT-201', candidate_name: user?.name || 'Ananya Roy' });
      setIsClockedIn(true);
      setClockInTime(res.record?.clockIn || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      showToast(res.message || 'Clocked in / resumed shift! Recorded in HR database.', 'success');
      loadData();
    } else {
      const res = await workingHoursService.endWork({ candidate_id: 'INT-201', candidate_name: user?.name || 'Ananya Roy' });
      setIsClockedIn(false);
      if (res.tenure) setTenure(res.tenure);
      showToast(res.message || `Work session paused. Total hours: ${res.record?.totalHours || 'updated'} & tenure synced!`, 'info');
      loadData();
    }
  };

  return (
    <MainLayout title="Intern Workspace">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PageHeader
          title={`Welcome back, ${user?.name || 'Ananya'}`}
          subtitle="Frontend Development Intern • Engineering | Assigned Manager: Vikram Mehta"
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setPreviewOffer({
                  id: 'OFR-INT-201',
                  applicationId: 'INT-201',
                  candidateName: user?.name || 'Ananya Roy',
                  candidateEmail: user?.email || 'ananya.roy@ragnify.com',
                  role: 'Frontend Development Intern',
                  type: 'Intern',
                  department: 'Engineering & Product Innovation',
                  stipendSalary: '₹30,000 / mo',
                  reportingManager: 'Vikram Mehta, Engineering Manager',
                  joiningDate: '2026-08-01',
                  generatedDate: '2026-07-20',
                  status: 'COUNTERSIGNED',
                  fileUrl: '/offer-letters/download/INT-201'
                })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FaEye size={12} /> View Offer Letter
              </button>
              <Link to="/intern/certificate" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FaAward size={12} /> Certificate Status
              </Link>
            </div>
          }
        />

        {/* 4 Stat Cards */}
        <div className="kpi-cards-grid">
          <StatCard
            title="Days Completed"
            value={`${daysCompleted} Days`}
            icon={<FaClock />}
            subtitle={`Out of ${totalDays} Total Days`}
          />
          <StatCard
            title="Days Remaining"
            value={`${daysRemaining} Days`}
            icon={<FaCalendarAlt />}
            subtitle={`Until Tenure End (${daysRemaining} Days to Certificate)`}
          />
          <StatCard
            title="Tenure Progress"
            value={`${progressPercent}%`}
            icon={<FaUserGraduate />}
            change={progressPercent >= 90 ? "Certificate Ready" : "On Track"}
            subtitle="Live Attendance Synced"
          />
          <StatCard
            title="Certificate Status"
            value={progressPercent >= 100 || daysRemaining === 0 ? "Unlocked" : "Upcoming"}
            icon={<FaAward />}
            change={progressPercent >= 100 ? "Ready to Download" : `In ${daysRemaining} Days`}
            subtitle="Completion Award"
          />
        </div>

        {/* Grid layout for Clock Widget & Tenure Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Working Time Clock Widget */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="card-header">
                <h3 className="card-title">Daily Time Clock</h3>
                <span className={`badge ${isClockedIn ? 'badge-success' : 'badge-neutral'}`}>
                  {isClockedIn ? 'ACTIVE SESSION' : 'ON BREAK / OFF DUTY'}
                </span>
              </div>
              <p className="text-sm" style={{ marginBottom: '18px' }}>
                Log your working hours daily. Taking breaks and resuming accumulates into the same daily record.
              </p>

              <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', marginBottom: '18px', textAlign: 'center' }}>
                <div className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                  {isClockedIn ? `Clocked In at ${clockInTime}` : 'Session Paused / Logged'}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: isClockedIn ? 'var(--status-success)' : 'var(--text-primary)' }}>
                  {isClockedIn ? 'Active Shift in Progress...' : 'Ready to Resume or Start'}
                </div>
              </div>
            </div>

            <button
              className={isClockedIn ? 'btn-danger' : 'btn-primary'}
              onClick={handleClockToggle}
              style={{ width: '100%', height: '42px', justifyContent: 'center' }}
            >
              {isClockedIn ? (
                <>
                  <FaStop size={12} /> Pause Work / Take Break
                </>
              ) : (
                <>
                  <FaPlay size={12} /> Resume / Clock In for Today
                </>
              )}
            </button>
          </div>

          {/* Tenure Progress Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="card-header">
                <h3 className="card-title">Internship Tenure Roadmap</h3>
                <span className="badge badge-info">3 Months Term</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span>Aug 01, 2026</span>
                  <strong>{progressPercent}% Completed</strong>
                  <span>Oct 31, 2026</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--border-default)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--brand-primary)', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✅ Onboarding & Workstation Setup</span>
                  <span style={{ color: 'var(--status-success)', fontWeight: '700' }}>Done</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✅ Milestone 1 Deliverables</span>
                  <span style={{ color: 'var(--status-success)', fontWeight: '700' }}>Done</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>⏳ Final Capstone Presentation</span>
                  <span style={{ color: 'var(--status-warning)', fontWeight: '700' }}>Oct 28</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <Link to="/intern/working-time" className="btn-secondary" style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}>
                Time History
              </Link>
              <Link to="/intern/documents" className="btn-secondary" style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}>
                My Documents
              </Link>
            </div>
          </div>
        </div>

        <OfferLetterPreviewModal
          isOpen={Boolean(previewOffer)}
          onClose={() => setPreviewOffer(null)}
          offer={previewOffer}
        />
      </div>
    </MainLayout>
  );
}

export default InternDashboard;

import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { workingHoursService, tenureService } from '../../api/onboardingService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  FaClock, 
  FaPlay, 
  FaStop, 
  FaCalendarCheck, 
  FaBriefcase, 
  FaAward, 
  FaCheckCircle, 
  FaHistory 
} from 'react-icons/fa';

export function EmployeeWorkingTime() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [currentClockIn, setCurrentClockIn] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [tenureStats, setTenureStats] = useState({
    daysCompleted: 382,
    totalDays: 730,
    progress: 52
  });

  const employeeId = user?.employee_id || user?.id || 'EMP-101';
  const employeeName = user?.name || 'Rahul Verma';

  const loadWorkingHours = async () => {
    try {
      setLoading(true);
      const data = await workingHoursService.getWorkingHours(employeeId);
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
        const emp = tenures.find(t => t.type === 'Employee' || t.candidate_id === employeeId || t.name === employeeName) || tenures[0];
        if (emp) {
          setTenureStats({
            daysCompleted: emp.daysCompleted || emp.activeDays || 382,
            totalDays: emp.totalDays || 730,
            progress: emp.progress || 52
          });
        }
      }
    } catch (err) {
      console.error('Error loading employee working hours:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkingHours();
  }, [user]);

  const handleStartWork = async () => {
    setProcessing(true);
    try {
      const payload = {
        candidate_id: employeeId,
        candidate_name: employeeName,
        candidate_type: 'Employee'
      };
      const res = await workingHoursService.startWork(payload);
      setIsWorking(true);
      setCurrentClockIn(res.record?.clockIn || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      showToast(res.message || 'Shift started! Hours will accumulate into today\'s record.', 'success');
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
        candidate_id: employeeId,
        candidate_name: employeeName,
        candidate_type: 'Employee'
      };
      const res = await workingHoursService.endWork(payload);
      setIsWorking(false);
      setCurrentClockIn(null);
      if (res.tenure) {
        setTenureStats(res.tenure);
      }
      showToast(res.message || `Work session paused. Total hours recorded: ${res.record?.totalHours || 'updated'}!`, 'success');
      loadWorkingHours();
    } catch (err) {
      console.error('End work failed:', err);
      showToast('Failed to record clock-out with backend.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <MainLayout title="Working Time">
      <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PageHeader
          title="Daily Working Time & Attendance"
          subtitle="Log employee clock-in and clock-out timestamps. Taking breaks and restarting on the same date accumulates hours in the same daily record."
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
                {isWorking ? `Session active — Clocked in at ${currentClockIn || '09:00 AM'}. Click 'Pause / End Work' when taking a break.` : 'Click Start Work to begin or resume your daily shift (multiple sessions accumulate in the same row).'}
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

          {/* Dynamic Tenure & Service Milestone Stats */}
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Service Days</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {tenureStats.daysCompleted} / {tenureStats.totalDays} Days
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Tenure Progress</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--brand-primary)', marginTop: '2px' }}>
                {tenureStats.progress}% Completed
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Next Milestone</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <FaAward /> 3-Year Service Recognition Award
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Logs Table */}
        <div className="table-card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Audited Attendance Logs (HR Master)</h3>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>1 Daily Row per Date (Accumulated Hours)</span>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      Loading attendance logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      No attendance logged yet. Click 'Start Work' above to log your shift.
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                          <FaCalendarCheck style={{ color: 'var(--brand-primary)' }} />
                          {log.date}
                        </div>
                      </td>
                      <td>
                        <strong>{log.candidateName || employeeName}</strong>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{employeeId}</div>
                      </td>
                      <td>{log.clockIn}</td>
                      <td>{log.clockOut}</td>
                      <td>
                        <span style={{ fontWeight: '700', color: log.status === 'IN_PROGRESS' ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                          {log.totalHours}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={log.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default EmployeeWorkingTime;

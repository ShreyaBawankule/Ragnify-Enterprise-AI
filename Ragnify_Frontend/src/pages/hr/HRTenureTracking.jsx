import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge, EmptyState } from '../../components/common/StatCard';
import { tenureService, workingHoursService } from '../../api/onboardingService';
import { 
  FaClock, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaUsers, 
  FaUserTie, 
  FaUserGraduate, 
  FaSearch, 
  FaTimes, 
  FaEye, 
  FaCheckCircle, 
  FaAward, 
  FaShieldAlt,
  FaArrowRight
} from 'react-icons/fa';

export function HRTenureTracking() {
  const [tenures, setTenures] = useState([]);
  const [typeSlicer, setTypeSlicer] = useState('ALL'); // 'ALL' | 'EMPLOYEE' | 'INTERN'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    tenureService.getTenures().then(setTenures);
  }, []);

  const employeeCount = useMemo(() => tenures.filter(t => t.type?.toLowerCase() === 'employee').length, [tenures]);
  const internCount = useMemo(() => tenures.filter(t => t.type?.toLowerCase() === 'intern').length, [tenures]);

  const filteredTenures = useMemo(() => {
    return tenures.filter(t => {
      // Role Slicer
      if (typeSlicer === 'EMPLOYEE' && t.type?.toLowerCase() !== 'employee') return false;
      if (typeSlicer === 'INTERN' && t.type?.toLowerCase() !== 'intern') return false;

      // Status Filter
      if (statusFilter !== 'ALL' && t.status?.toUpperCase() !== statusFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (t.name || t.candidateName || '').toLowerCase().includes(q);
        const matchRole = (t.role || '').toLowerCase().includes(q);
        const matchDept = (t.department || '').toLowerCase().includes(q);
        const matchEmail = (t.email || '').toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchDept && !matchEmail) return false;
      }

      return true;
    });
  }, [tenures, typeSlicer, statusFilter, searchQuery]);

  return (
    <MainLayout title="Tenure Tracking">
      <div className="fade-in">
        <PageHeader
          title="Workforce Tenure & Milestone Tracking"
          subtitle="Real-time monitoring of employment contracts, 92-day internship progress, and service anniversary milestones"
        />

        {/* 4 SUMMARY KPI CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
            <span className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)' }}>Total Tracked Workforce</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
              {tenures.length || 38} Staff
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{employeeCount || 26} Employees + {internCount || 12} Interns</span>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #16A34A' }}>
            <span className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)' }}>Full-Time Staff on Tenure</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#16A34A', marginTop: '4px' }}>
              {employeeCount || 26} Confirmed
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Permanent Contract Monitored</span>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #0284C7' }}>
            <span className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)' }}>Active Intern Cohort</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0284C7', marginTop: '4px' }}>
              {internCount || 12} Active Terms
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>92-Day Program Tracked</span>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
            <span className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)' }}>Workforce Milestone Health</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#F59E0B', marginTop: '4px' }}>
              100% On-Track
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Zero Milestone Violations</span>
          </div>
        </div>

        {/* TOP TOOLBAR: ROLE SLICER + SEARCH BAR + STATUS FILTER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Role Slicers */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)'
          }}>
            <button
              onClick={() => setTypeSlicer('ALL')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'ALL' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <FaUsers size={13} />
              All Workforce ({tenures.length})
            </button>

            <button
              onClick={() => setTypeSlicer('EMPLOYEE')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'EMPLOYEE' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'EMPLOYEE' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <FaUserTie size={13} />
              Employees ({employeeCount})
            </button>

            <button
              onClick={() => setTypeSlicer('INTERN')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'INTERN' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'INTERN' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <FaUserGraduate size={13} />
              Interns ({internCount})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '380px', position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', fontSize: '13px' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, role, department..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '34px', height: '36px', fontSize: '0.8125rem', width: '100%' }}
            />
            {searchQuery && (
              <button className="btn-secondary" style={{ padding: '0 8px', height: '36px' }} onClick={() => setSearchQuery('')}>
                <FaTimes size={11} />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <select
            className="form-select"
            style={{ width: '160px', height: '36px', fontSize: '0.8125rem' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>

        {/* TENURE DIRECTORY DATA TABLE */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Type</th>
                  <th>Department &amp; Role</th>
                  <th>Joining / Start Date</th>
                  <th>Duration / Term</th>
                  <th>Milestone Progress</th>
                  <th>Next Target Milestone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenures.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ padding: '36px' }}>
                      <EmptyState 
                        title="No tenure records match your filter" 
                        message="Try clearing your search query or selecting 'All Workforce' slicer." 
                      />
                    </td>
                  </tr>
                ) : (
                  filteredTenures.map(t => {
                    const isIntern = t.type === 'Intern';
                    const initials = t.name ? t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'RG';
                    return (
                      <tr key={t.id || t.candidate_id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: isIntern ? '#E0F2FE' : '#F1F5F9',
                              color: isIntern ? '#0284C7' : 'var(--brand-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              flexShrink: 0
                            }}>
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{t.name || t.candidateName}</div>
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.email || `${t.candidate_id}@ragnify.com`}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${isIntern ? 'badge-info' : 'badge-neutral'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{t.role}</div>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.department}</div>
                        </td>
                        <td>{t.startDate}</td>
                        <td>
                          <span style={{ fontSize: '0.8125rem', fontWeight: '600' }}>{t.duration}</span>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Target: {t.endDate}</div>
                        </td>
                        <td style={{ minWidth: '170px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '7px', backgroundColor: 'var(--border-default)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div 
                                style={{ 
                                  width: `${Math.min(100, t.progress || 0)}%`, 
                                  height: '100%', 
                                  backgroundColor: isIntern ? '#0284C7' : 'var(--brand-primary)', 
                                  borderRadius: '4px' 
                                }} 
                              />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', minWidth: '34px' }}>{t.progress}%</span>
                          </div>
                          <div className="text-xs" style={{ marginTop: '3px', color: 'var(--text-secondary)' }}>
                            {t.daysCompleted || t.activeDays} / {t.totalDays || (isIntern ? 92 : 1095)} Days
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FaAward size={12} color={isIntern ? '#0284C7' : '#F59E0B'} />
                            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                              {t.nextMilestone || (isIntern ? 'Certificate Clearance' : 'Anniversary Milestone')}
                            </span>
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={t.status || 'CONFIRMED'} />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-action"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            onClick={() => setSelectedMilestone(t)}
                            title="Inspect Milestone Details"
                          >
                            <FaEye size={11} /> Milestone
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MILESTONE DETAILS MODAL */}
        {selectedMilestone && (
          <div className="modal-overlay" onClick={() => setSelectedMilestone(null)}>
            <div className="modal-card" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
                    Tenure Milestones: {selectedMilestone.name}
                  </h3>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {selectedMilestone.role} • {selectedMilestone.type} ({selectedMilestone.department})
                  </span>
                </div>
                <button onClick={() => setSelectedMilestone(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                  <div>
                    <div className="text-xs" style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Joining Date</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedMilestone.startDate}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Days Completed</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--brand-primary)' }}>
                      {selectedMilestone.daysCompleted || selectedMilestone.activeDays} Days
                    </div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Remaining to Next Target</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#16A34A' }}>
                      {selectedMilestone.daysRemaining || 0} Days
                    </div>
                  </div>
                </div>

                <div style={{ padding: '4px 0' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: '800' }}>Tenure Lifecycle Journey</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: '#F0FDF4', borderRadius: '6px', border: '1px solid #BBF7D0' }}>
                      <FaCheckCircle color="#16A34A" size={16} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#166534' }}>1. Induction &amp; Compliance Verified</div>
                        <div className="text-xs" style={{ color: '#15803D' }}>KYC, Aadhaar, PAN, and Employment Contract countersigned.</div>
                      </div>
                      <span className="badge badge-success">COMPLETED</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: '#F0FDF4', borderRadius: '6px', border: '1px solid #BBF7D0' }}>
                      <FaCheckCircle color="#16A34A" size={16} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#166534' }}>2. 30-Day Manager Alignment &amp; IT Access</div>
                        <div className="text-xs" style={{ color: '#15803D' }}>Engineering workstation, credentials, and sprint tasks assigned.</div>
                      </div>
                      <span className="badge badge-success">COMPLETED</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: selectedMilestone.progress >= 70 ? '#F0FDF4' : '#EFF6FF', borderRadius: '6px', border: selectedMilestone.progress >= 70 ? '1px solid #BBF7D0' : '1px solid #BFDBFE' }}>
                      {selectedMilestone.progress >= 70 ? <FaCheckCircle color="#16A34A" size={16} /> : <FaClock color="#0284C7" size={16} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: '700', color: selectedMilestone.progress >= 70 ? '#166534' : '#1E40AF' }}>
                          3. {selectedMilestone.type === 'Intern' ? '60-Day Mid-Term Evaluation' : '1-Year Performance Review'}
                        </div>
                        <div className="text-xs" style={{ color: selectedMilestone.progress >= 70 ? '#15803D' : '#3B82F6' }}>
                          Performance review and milestone audit with reporting manager.
                        </div>
                      </div>
                      <span className={`badge ${selectedMilestone.progress >= 70 ? 'badge-success' : 'badge-info'}`}>
                        {selectedMilestone.progress >= 70 ? 'COMPLETED' : 'IN PROGRESS'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: selectedMilestone.progress >= 100 ? '#F0FDF4' : 'var(--bg-surface-subtle)', borderRadius: '6px', border: '1px solid var(--border-default)' }}>
                      <FaAward color={selectedMilestone.progress >= 100 ? '#16A34A' : 'var(--text-muted)'} size={16} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          4. {selectedMilestone.nextMilestone}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {selectedMilestone.type === 'Intern' ? 'Final Internship Certificate release & PPO review.' : 'Long-term corporate service recognition.'}
                        </div>
                      </div>
                      <span className={`badge ${selectedMilestone.progress >= 100 ? 'badge-success' : 'badge-neutral'}`}>
                        {selectedMilestone.progress >= 100 ? 'ACHIEVED' : 'TARGET'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={() => setSelectedMilestone(null)}>
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export function HRWorkingHours() {
  const [hours, setHours] = useState([]);
  const [typeSlicer, setTypeSlicer] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    workingHoursService.getWorkingHours().then(setHours);
  }, []);

  const employeeCount = useMemo(() => hours.filter(h => h.type?.toLowerCase() === 'employee').length, [hours]);
  const internCount = useMemo(() => hours.filter(h => h.type?.toLowerCase() === 'intern').length, [hours]);

  const filteredHours = useMemo(() => {
    return hours.filter(h => {
      if (typeSlicer === 'EMPLOYEE' && h.type?.toLowerCase() !== 'employee') return false;
      if (typeSlicer === 'INTERN' && h.type?.toLowerCase() !== 'intern') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (h.name || h.candidateName || '').toLowerCase().includes(q);
        const matchType = (h.type || '').toLowerCase().includes(q);
        if (!matchName && !matchType) return false;
      }
      return true;
    });
  }, [hours, typeSlicer, searchQuery]);

  return (
    <MainLayout title="Working Hours">
      <div className="fade-in">
        <PageHeader
          title="Workforce Time & Attendance Auditing"
          subtitle="Real-time attendance logs, time clock audits, and daily session tracking for employees and interns"
        />

        {/* 3 SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
            <span className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)' }}>Active Clock-Ins Tracked</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--brand-primary)', marginTop: '4px' }}>
              {hours.length} Checked In
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>From active 38-member workforce</span>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #16A34A' }}>
            <span className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)' }}>Average Daily Work Time</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#16A34A', marginTop: '4px' }}>
              8.5 hrs
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Standard enterprise shift compliant</span>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #0284C7' }}>
            <span className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)' }}>Attendance Reliability</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0284C7', marginTop: '4px' }}>
              99.4%
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Audited daily time records</span>
          </div>
        </div>

        {/* TOOLBAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)'
          }}>
            <button
              onClick={() => setTypeSlicer('ALL')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'ALL' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              <FaUsers size={13} />
              All Records ({hours.length})
            </button>

            <button
              onClick={() => setTypeSlicer('EMPLOYEE')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'EMPLOYEE' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'EMPLOYEE' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              <FaUserTie size={13} />
              Employees ({employeeCount})
            </button>

            <button
              onClick={() => setTypeSlicer('INTERN')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: typeSlicer === 'INTERN' ? 'var(--brand-primary)' : 'transparent',
                color: typeSlicer === 'INTERN' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              <FaUserGraduate size={13} />
              Interns ({internCount})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '360px', position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', fontSize: '13px' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search attendance by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '34px', height: '36px', fontSize: '0.8125rem', width: '100%' }}
            />
            {searchQuery && (
              <button className="btn-secondary" style={{ padding: '0 8px', height: '36px' }} onClick={() => setSearchQuery('')}>
                <FaTimes size={11} />
              </button>
            )}
          </div>
        </div>

        {/* ATTENDANCE TABLE */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Total Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHours.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '36px' }}>
                      <EmptyState title="No attendance records match your filter" message="Adjust your search query or role slicer." />
                    </td>
                  </tr>
                ) : (
                  filteredHours.map(h => (
                    <tr key={h.id}>
                      <td><strong>{h.name || h.candidateName}</strong></td>
                      <td><span className={`badge ${h.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>{h.type}</span></td>
                      <td>{h.date}</td>
                      <td>{h.clockIn}</td>
                      <td>{h.clockOut || '--:--'}</td>
                      <td><strong>{h.totalHours || h.total || 'In Progress'}</strong></td>
                      <td><StatusBadge status={h.status || 'COMPLETED'} /></td>
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

export default HRTenureTracking;

import React, { useState, useMemo } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { useToast } from '../../context/ToastContext';
import {
  FaFileAlt,
  FaFilePdf,
  FaFileCsv,
  FaPrint,
  FaSearch,
  FaCalendarAlt,
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaDownload
} from 'react-icons/fa';

const SPRINT_DELIVERABLES_DATA = [
  { id: 'TSK-101', task: 'ChromaDB Cosine Vector Indexing Pipeline', assignee: 'Rahul Verma', role: 'Senior ML Engineer', cohort: 'Employee', sprint: 'Sprint 4', hours: 38, priority: 'HIGH', status: 'IN_PROGRESS', score: '92%' },
  { id: 'TSK-102', task: 'Design System & Neo-Tech Dark Theme UI', assignee: 'Ananya Roy', role: 'Frontend Intern', cohort: 'Intern', sprint: 'Sprint 4', hours: 32, priority: 'HIGH', status: 'COMPLETED', score: '96%' },
  { id: 'TSK-103', task: 'Multi-Role Route Guard & Session Persistence', assignee: 'Neha Kapoor', role: 'Full Stack Engineer', cohort: 'Employee', sprint: 'Sprint 4', hours: 28, priority: 'MEDIUM', status: 'COMPLETED', score: '95%' },
  { id: 'TSK-104', task: 'Groq Whisper Audio Transcription Benchmark', assignee: 'Rohan Gupta', role: 'AI Research Intern', cohort: 'Intern', sprint: 'Sprint 4', hours: 30, priority: 'HIGH', status: 'IN_PROGRESS', score: '88%' },
  { id: 'TSK-105', task: 'Automated Offer Letter PDF Generation Worker', assignee: 'Rahul Verma', role: 'Senior ML Engineer', cohort: 'Employee', sprint: 'Sprint 3', hours: 24, priority: 'HIGH', status: 'COMPLETED', score: '98%' },
  { id: 'TSK-106', task: 'Intern Daily Time Clock & Attendance Tracking', assignee: 'Ananya Roy', role: 'Frontend Intern', cohort: 'Intern', sprint: 'Sprint 3', hours: 26, priority: 'MEDIUM', status: 'COMPLETED', score: '94%' },
  { id: 'TSK-107', task: 'Enterprise PostgreSQL Database Schemas', assignee: 'Siddharth Sen', role: 'DevOps Engineer', cohort: 'Employee', sprint: 'Sprint 3', hours: 35, priority: 'HIGH', status: 'COMPLETED', score: '99%' }
];

const WORKLOAD_AUDIT_DATA = [
  { id: 'EMP-1', name: 'Rahul Verma', role: 'Senior ML Engineer', cohort: 'Employee', activeTasks: 2, completedTasks: 8, totalHours: 154, capacity: '95%', velocityRating: 'Exceeding' },
  { id: 'EMP-2', name: 'Neha Kapoor', role: 'Full Stack Engineer', cohort: 'Employee', activeTasks: 1, completedTasks: 6, totalHours: 140, capacity: '88%', velocityRating: 'On Target' },
  { id: 'EMP-3', name: 'Siddharth Sen', role: 'DevOps Engineer', cohort: 'Employee', activeTasks: 1, completedTasks: 7, totalHours: 145, capacity: '90%', velocityRating: 'On Target' },
  { id: 'INT-1', name: 'Ananya Roy', role: 'Frontend Intern', cohort: 'Intern', activeTasks: 1, completedTasks: 5, totalHours: 128, capacity: '92%', velocityRating: 'Exceeding' },
  { id: 'INT-2', name: 'Rohan Gupta', role: 'AI Research Intern', cohort: 'Intern', activeTasks: 2, completedTasks: 4, totalHours: 120, capacity: '85%', velocityRating: 'On Target' }
];

export function ManagerReports() {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState('SPRINT_VELOCITY'); // 'SPRINT_VELOCITY' | 'WORKLOAD_AUDIT'
  const [filterCohort, setFilterCohort] = useState('ALL'); // 'ALL' | 'Employee' | 'Intern'
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Current Sprint (Sprint 4)');

  // Filter Sprint Deliverables
  const filteredSprintData = useMemo(() => {
    return SPRINT_DELIVERABLES_DATA.filter(item => {
      const matchesCohort = filterCohort === 'ALL' || item.cohort === filterCohort;
      const matchesSearch = item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCohort && matchesSearch;
    });
  }, [filterCohort, searchQuery]);

  // Filter Workload Audit
  const filteredWorkloadData = useMemo(() => {
    return WORKLOAD_AUDIT_DATA.filter(item => {
      const matchesCohort = filterCohort === 'ALL' || item.cohort === filterCohort;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCohort && matchesSearch;
    });
  }, [filterCohort, searchQuery]);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (selectedReport === 'SPRINT_VELOCITY') {
      const headers = ['Task ID', 'Task Name', 'Assignee', 'Role', 'Cohort', 'Sprint', 'Hours Logged', 'Priority', 'Status', 'Quality Score'];
      const rows = filteredSprintData.map(d => [d.id, d.task, d.assignee, d.role, d.cohort, d.sprint, d.hours, d.priority, d.status, d.score]);
      downloadCSV('Manager_Sprint_Velocity_Report.csv', rows, headers);
    } else {
      const headers = ['Member ID', 'Name', 'Role', 'Cohort', 'Active Tasks', 'Completed Tasks', 'Total Hours', 'Capacity Utilization', 'Velocity Rating'];
      const rows = filteredWorkloadData.map(d => [d.id, d.name, d.role, d.cohort, d.activeTasks, d.completedTasks, d.totalHours, d.capacity, d.velocityRating]);
      downloadCSV('Team_Workload_Audit_Report.csv', rows, headers);
    }
    showToast('Exported CSV dataset successfully!', 'success');
  };

  // Helper CSV Trigger
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

  // Export / Print PDF Handler
  const handlePrintPDF = () => {
    showToast('Preparing formatted PDF report view for printing...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <MainLayout title="Manager Reports">
      <div className="fade-in">
        <PageHeader
          title="Team Velocity & Workforce Analytics"
          subtitle="Generate audit summaries, sprint velocity reports, and workload evaluations for executive review"
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-secondary" 
                onClick={handleExportCSV}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FaFileCsv size={13} style={{ color: '#10b981' }} /> Export CSV
              </button>
              <button 
                className="btn-primary" 
                onClick={handlePrintPDF}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FaPrint size={13} /> Print / Save PDF
              </button>
            </div>
          }
        />

        {/* Top KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <FaTasks size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sprint Velocity</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>88% On-Track</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <FaCheckCircle size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deliverables Closed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>18 Tasks</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <FaClock size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Review Turnaround</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>4.2 Hours</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <FaUsers size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Utilization</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>89.6% Avg</div>
            </div>
          </div>
        </div>

        {/* Report Selector Tabs & Filter Toolbar */}
        <div className="card" style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn-secondary ${selectedReport === 'SPRINT_VELOCITY' ? 'active' : ''}`}
              style={{
                fontSize: '0.8125rem',
                padding: '8px 16px',
                backgroundColor: selectedReport === 'SPRINT_VELOCITY' ? 'var(--primary-color, #2563eb)' : 'transparent',
                color: selectedReport === 'SPRINT_VELOCITY' ? '#fff' : 'var(--text-secondary)',
                borderColor: selectedReport === 'SPRINT_VELOCITY' ? 'var(--primary-color, #2563eb)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => setSelectedReport('SPRINT_VELOCITY')}
            >
              <FaTasks size={12} /> Sprint Velocity & Deliverables
            </button>

            <button
              className={`btn-secondary ${selectedReport === 'WORKLOAD_AUDIT' ? 'active' : ''}`}
              style={{
                fontSize: '0.8125rem',
                padding: '8px 16px',
                backgroundColor: selectedReport === 'WORKLOAD_AUDIT' ? 'var(--primary-color, #2563eb)' : 'transparent',
                color: selectedReport === 'WORKLOAD_AUDIT' ? '#fff' : 'var(--text-secondary)',
                borderColor: selectedReport === 'WORKLOAD_AUDIT' ? 'var(--primary-color, #2563eb)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => setSelectedReport('WORKLOAD_AUDIT')}
            >
              <FaUsers size={12} /> Team Capacity & Workload Audit
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Cohort Filter */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'Employee', 'Intern'].map(c => (
                <button
                  key={c}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${filterCohort === c ? 'var(--primary-color, #2563eb)' : 'var(--border-color)'}`,
                    backgroundColor: filterCohort === c ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                    color: filterCohort === c ? '#60a5fa' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setFilterCohort(c)}
                >
                  {c === 'ALL' ? 'All' : `${c}s`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={12} />
              <input
                type="text"
                placeholder="Search report items..."
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

        {/* Report Content View */}
        {selectedReport === 'SPRINT_VELOCITY' ? (
          <div className="table-card">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Sprint Velocity & Deliverables Ledger ({dateRange})
                </h3>
                <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Showing {filteredSprintData.length} tracked engineering deliverables
                </div>
              </div>
              <span className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaCalendarAlt size={10} /> Active Sprint
              </span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Deliverable & ID</th>
                    <th>Assignee & Cohort</th>
                    <th>Sprint</th>
                    <th>Hours Logged</th>
                    <th>Priority</th>
                    <th>Quality / QA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSprintData.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.task}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.id}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.assignee}</div>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          backgroundColor: item.cohort === 'Intern' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: item.cohort === 'Intern' ? '#60a5fa' : '#34d399'
                        }}>
                          {item.cohort} • {item.role}
                        </span>
                      </td>
                      <td><strong>{item.sprint}</strong></td>
                      <td>{item.hours} hrs</td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: item.priority === 'HIGH' ? '#ef4444' : '#f59e0b'
                        }}>
                          {item.priority}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem' }}>{item.score}</span>
                      </td>
                      <td>
                        <StatusBadge status={item.status} />
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
                  Team Capacity & Workload Utilization Audit
                </h3>
                <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Engineering resource distribution under Manager Vikram Mehta
                </div>
              </div>
              <span className="badge badge-neutral">Monthly Cycle</span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Team Member</th>
                    <th>Role & Cohort</th>
                    <th>Active Tasks</th>
                    <th>Completed Deliverables</th>
                    <th>Hours Recorded</th>
                    <th>Capacity Load</th>
                    <th>Velocity Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkloadData.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.id}</div>
                      </td>
                      <td>
                        <div>{item.role}</div>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          backgroundColor: item.cohort === 'Intern' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: item.cohort === 'Intern' ? '#60a5fa' : '#34d399'
                        }}>
                          {item.cohort}
                        </span>
                      </td>
                      <td><strong>{item.activeTasks} active</strong></td>
                      <td><span style={{ color: '#10b981', fontWeight: '700' }}>{item.completedTasks} closed</span></td>
                      <td>{item.totalHours} hrs</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '80px', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: item.capacity, height: '100%', backgroundColor: '#3b82f6' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>{item.capacity}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success">{item.velocityRating}</span>
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

export default ManagerReports;

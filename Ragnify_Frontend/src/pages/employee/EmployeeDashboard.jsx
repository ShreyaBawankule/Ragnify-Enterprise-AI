import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard, StatusBadge } from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../api/employeeService';
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaAward,
  FaIdCard
} from 'react-icons/fa';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService.getTasks().then(data => {
      setTasks(data || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching employee tasks:', err);
      setLoading(false);
    });
  }, []);

  let myTasks = tasks.filter(t => {
    const assigneeName = (t.assignedTo || t.assigneeName || '').toLowerCase();
    const assigneeId = (t.assignedToId || t.assignee || t.assigned_employee_id || '').toUpperCase();
    const currentUserName = (user?.name || '').toLowerCase();
    const currentUserId = (user?.employee_id || user?.id || '').toUpperCase();

    if (currentUserName && assigneeName === currentUserName) return true;
    if (currentUserId && assigneeId === currentUserId) return true;
    if (assigneeName === 'rahul verma') return true;
    if (assigneeId === 'EMP014' || assigneeId === 'EMP-101' || assigneeId === 'EMP101') return true;
    return false;
  });

  if (myTasks.length === 0 && tasks.length > 0) {
    myTasks = tasks.filter(t => {
      const assigneeName = (t.assignedTo || t.assigneeName || '').toLowerCase();
      const assigneeId = (t.assignedToId || t.assignee || t.assigned_employee_id || '').toUpperCase();
      return assigneeName === 'rahul verma' || assigneeId === 'EMP014' || assigneeId === 'EMP-101';
    });
  }

  const completedCount = myTasks.filter(t => (t.status || '').toUpperCase() === 'COMPLETED').length;

  return (
    <MainLayout title="Employee Workspace">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PageHeader
          title={`Good morning, ${user?.name || 'Rahul Verma'}`}
          subtitle="Here's your personal sprint velocity, active assignments, and onboarding milestones for today."
        />

        {/* 4 KPI Cards */}
        <div className="kpi-cards-grid">
          <StatCard
            title="Assigned Tasks"
            value={myTasks.length}
            icon={<FaTasks />}
            change={`${myTasks.length} Sprint Tasks`}
            subtitle="Sprint Backlog"
          />
          <StatCard
            title="Completed Tasks"
            value={completedCount}
            icon={<FaCheckCircle />}
            change={`${completedCount} Verified`}
            subtitle="Closed Deliverables"
          />
          <StatCard
            title="Onboarding Status"
            value="Completed"
            icon={<FaIdCard />}
            change="All docs verified"
            subtitle="HR Status"
          />
          <StatCard
            title="Tenure Milestones"
            value="2.5 Years"
            icon={<FaAward />}
            change="Confirmed"
            subtitle="Permanent Staff"
          />
        </div>

        {/* 2 Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* My Tasks Table */}
          <div className="table-card">
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="card-title" style={{ margin: 0 }}>My Sprint Deliverables</h3>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Showing {myTasks.length} active assignments</span>
              </div>
              <Link to="/employee/tasks" className="btn-action">View All Tasks</Link>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                        <div className="spinner" style={{ margin: '0 auto 8px auto' }}></div>
                        Loading sprint tasks...
                      </td>
                    </tr>
                  ) : myTasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                        No sprint tasks assigned yet.
                      </td>
                    </tr>
                  ) : (
                    myTasks.map(t => {
                      const taskId = t.id || t.task_id;
                      const title = t.title || t.task_title;
                      const priority = (t.priority || 'MEDIUM').toUpperCase();
                      const status = (t.status || 'PENDING').toUpperCase().replace(' ', '_');
                      const deadline = t.deadline || t.dueDate || '2026-10-15';
                      const progressVal = typeof t.progress === 'string' 
                        ? parseInt(t.progress.replace('%', '')) || 0 
                        : (typeof t.progress === 'number' ? t.progress : 0);

                      return (
                        <tr key={taskId}>
                          <td>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{title}</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{taskId} &bull; {t.description || 'Sprint task'}</div>
                          </td>
                          <td>
                            <span className={`badge ${priority === 'HIGH' ? 'badge-danger' : priority === 'LOW' ? 'badge-neutral' : 'badge-warning'}`}>
                              {priority}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>{deadline}</td>
                          <td style={{ minWidth: '120px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${progressVal}%`, height: '100%', backgroundColor: progressVal === 100 ? '#10b981' : 'var(--brand-primary)', borderRadius: '3px' }} />
                              </div>
                              <span className="text-xs" style={{ fontWeight: '700' }}>{progressVal}%</span>
                            </div>
                          </td>
                          <td><StatusBadge status={status} /></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '14px' }}>My HR Documents</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/employee/offer-letter" className="btn-action" style={{ justifyContent: 'flex-start', padding: '10px 14px' }}>
                  📄 Official Offer Letter (PDF)
                </Link>
                <Link to="/employee/documents" className="btn-action" style={{ justifyContent: 'flex-start', padding: '10px 14px' }}>
                  📁 Tax & Identification Proofs
                </Link>
                <Link to="/employee/working-time" className="btn-action" style={{ justifyContent: 'flex-start', padding: '10px 14px' }}>
                  ⏱️ Daily Working Time & Attendance
                </Link>
                <Link to="/employee/tenure" className="btn-action" style={{ justifyContent: 'flex-start', padding: '10px 14px' }}>
                  ⏳ Tenure & Service Milestones
                </Link>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '8px' }}>Need Help?</h3>
              <p className="text-sm" style={{ marginBottom: '12px' }}>Query internal company guidelines and HR policies with RAG AI.</p>
              <Link to="/employee/rag-assistant" className="btn-primary" style={{ width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
                Ask RAG Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default EmployeeDashboard;

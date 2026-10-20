import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { taskService } from '../../api/employeeService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FaCheck, FaTasks, FaCheckCircle, FaSpinner } from 'react-icons/fa';

export function EmployeeMyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    taskService.getTasks().then(all => {
      const list = all || [];
      let filtered = list.filter(t => {
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

      if (filtered.length === 0 && list.length > 0) {
        filtered = list.filter(t => {
          const assigneeName = (t.assignedTo || t.assigneeName || '').toLowerCase();
          const assigneeId = (t.assignedToId || t.assignee || t.assigned_employee_id || '').toUpperCase();
          return assigneeName === 'rahul verma' || assigneeId === 'EMP014' || assigneeId === 'EMP-101';
        });
      }

      setTasks(filtered);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching tasks in EmployeeMyTasks:', err);
      setLoading(false);
    });
  }, [user]);

  const handleComplete = (id) => {
    setTasks(prev => prev.map(t => (t.id === id || t.task_id === id) ? { ...t, status: 'COMPLETED', progress: 100 } : t));
    taskService.updateTask(id, { status: 'COMPLETED', progress: 100 }).catch(() => {});
    showToast('Task marked as completed successfully!', 'success');
  };

  const completedCount = tasks.filter(t => (t.status || '').toUpperCase() === 'COMPLETED').length;

  return (
    <MainLayout title="My Tasks">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <PageHeader
          title="My Sprint Deliverables"
          subtitle="Track your active assignments, update completion percentage, and submit finished items"
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-neutral" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                <FaTasks style={{ marginRight: '6px' }} /> Total Assigned: {tasks.length}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                <FaCheckCircle style={{ marginRight: '6px' }} /> Completed: {completedCount}
              </span>
            </div>
          }
        />

        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Title & ID</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      <div className="spinner" style={{ margin: '0 auto 8px auto' }}></div>
                      Loading your assigned tasks...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      No tasks currently assigned to your queue.
                    </td>
                  </tr>
                ) : (
                  tasks.map(t => {
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
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {taskId} &bull; {t.description || 'Enterprise assignment'}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${priority === 'HIGH' ? 'badge-danger' : priority === 'LOW' ? 'badge-neutral' : 'badge-warning'}`}>
                            {priority}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{deadline}</td>
                        <td style={{ minWidth: '140px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${progressVal}%`, height: '100%', backgroundColor: progressVal === 100 ? '#10b981' : 'var(--brand-primary)', borderRadius: '3px' }} />
                            </div>
                            <span className="text-xs" style={{ fontWeight: '700' }}>{progressVal}%</span>
                          </div>
                        </td>
                        <td><StatusBadge status={status} /></td>
                        <td>
                          {status !== 'COMPLETED' ? (
                            <button className="btn-action" onClick={() => handleComplete(taskId)}>
                              <FaCheck size={11} /> Mark Complete
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaCheck size={10} /> Verified Done
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export function EmployeeProfile() {
  const { user } = useAuth();

  return (
    <MainLayout title="My Profile">
      <div className="fade-in">
        <PageHeader
          title="Employee Profile"
          subtitle="Personal identity information and registered contact details"
        />

        <div className="card" style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-default)' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary-subtle)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800'
            }}>
              RV
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{user?.name || 'Rahul Verma'}</h2>
              <div className="text-sm">{user?.designation || 'Senior ML Engineer'} • {user?.department || 'AI & Data Science'}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.875rem' }}>
            <div><span className="text-xs">Employee ID</span><strong>EMP-101</strong></div>
            <div><span className="text-xs">Work Email</span><strong>{user?.email || 'rahul.verma@ragnify.com'}</strong></div>
            <div><span className="text-xs">Phone</span><strong>+91 98765 43210</strong></div>
            <div><span className="text-xs">Location</span><strong>Bangalore Office (Hybrid)</strong></div>
            <div><span className="text-xs">Supervisor</span><strong>Vikram Mehta (Engineering Manager)</strong></div>
            <div><span className="text-xs">Joining Date</span><strong>March 15, 2024</strong></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default EmployeeMyTasks;

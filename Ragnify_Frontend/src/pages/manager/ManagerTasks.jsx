import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge, EmptyState } from '../../components/common/StatCard';
import { taskService } from '../../api/employeeService';
import { useToast } from '../../context/ToastContext';
import { FaPlus, FaSearch, FaCheck, FaTrash, FaEdit, FaTimes, FaUserTie, FaUserGraduate } from 'react-icons/fa';

export function ManagerTasks() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const employeeList = ['Rahul Verma', 'Neha Kapoor', 'Arjun Nair', 'Siddharth Sen'];
  const internList = ['Ananya Roy', 'Rohan Gupta'];

  // Modal Slicer
  const [assigneeType, setAssigneeType] = useState('EMPLOYEE'); // 'EMPLOYEE' or 'INTERN'
  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: 'Rahul Verma',
    priority: 'HIGH',
    deadline: '',
    department: 'Engineering'
  });

  // Edit Task State
  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete / Cancel Confirmation State
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    taskService.getTasks().then(setTasks);
  }, []);

  const handleAssigneeTypeChange = (type) => {
    setAssigneeType(type);
    setNewTask(prev => ({
      ...prev,
      assignedTo: type === 'EMPLOYEE' ? employeeList[0] : internList[0],
      department: type === 'EMPLOYEE' ? 'AI & Data Science' : 'Engineering'
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const created = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      status: 'PENDING',
      progress: 0,
      deadline: newTask.deadline || '2026-10-31',
      department: newTask.department
    };

    setTasks(prev => [created, ...prev]);
    showToast(`New task assigned to ${assigneeType.toLowerCase()} ${newTask.assignedTo}!`, 'success');
    setIsModalOpen(false);
    setNewTask({ title: '', assignedTo: employeeList[0], priority: 'HIGH', deadline: '', department: 'Engineering' });
  };

  const openEditModal = (task) => {
    setEditingTask({ ...task });
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
    taskService.updateTask(editingTask.id, editingTask);
    showToast(`Task ${editingTask.id} updated successfully!`, 'success');
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const openDeleteModal = (task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingTask) return;
    setTasks(prev => prev.filter(t => t.id !== deletingTask.id));
    taskService.deleteTask(deletingTask.id);
    showToast(`Task ${deletingTask.id} cancelled and removed!`, 'success');
    setIsDeleteModalOpen(false);
    setDeletingTask(null);
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <MainLayout title="Tasks">
      <div className="fade-in">
        <PageHeader
          title="Task Management & Sprints"
          subtitle="Assign deliverables, manage priorities, track completion velocity, and audit deadlines"
          actions={
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <FaPlus size={12} /> Assign Task
            </button>
          }
        />

        {/* Toolbar */}
        <div className="filter-toolbar">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks by title or assignee..."
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: '170px', height: '38px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Tasks Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task ID & Title</th>
                  <th>Assignee</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '32px' }}>
                      <EmptyState title="No tasks found" message="Tasks matching your filter will appear here." />
                    </td>
                  </tr>
                ) : (
                  filtered.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{t.title}</div>
                        <div className="text-xs">{t.id}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {internList.includes(t.assignedTo) ? <FaUserGraduate size={11} style={{ color: 'var(--ai-accent)' }} /> : <FaUserTie size={11} style={{ color: 'var(--brand-primary)' }} />}
                          <strong>{t.assignedTo}</strong>
                        </div>
                      </td>
                      <td>{t.department}</td>
                      <td>
                        <span className={`badge ${t.priority === 'HIGH' ? 'badge-danger' : t.priority === 'MEDIUM' ? 'badge-warning' : 'badge-neutral'}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td>{t.deadline}</td>
                      <td style={{ minWidth: '140px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${t.progress}%`, height: '100%', backgroundColor: 'var(--brand-primary)', borderRadius: '3px' }} />
                          </div>
                          <span className="text-xs" style={{ fontWeight: '700' }}>{t.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            className="btn-action"
                            style={{ 
                              color: 'var(--brand-primary)',
                              borderColor: 'var(--border-default)',
                              backgroundColor: 'transparent'
                            }}
                            title="Edit Task"
                            onClick={() => openEditModal(t)}
                          >
                            <FaEdit size={11} /> Edit
                          </button>

                          <button
                            className="btn-action"
                            style={{ 
                              color: 'var(--accent-red, #ef4444)',
                              borderColor: 'var(--border-default)',
                              backgroundColor: 'transparent'
                            }}
                            title="Cancel / Delete Task"
                            onClick={() => openDeleteModal(t)}
                          >
                            <FaTrash size={11} /> Delete
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

        {/* Modal with Slicer for Employee vs Intern */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Create Task Deliverable</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  {/* Slicer */}
                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label className="form-label" style={{ marginBottom: '8px' }}>
                      Assignee Category <span className="required">*</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleAssigneeTypeChange('EMPLOYEE')}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1.5px solid ${assigneeType === 'EMPLOYEE' ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                          backgroundColor: assigneeType === 'EMPLOYEE' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                          color: assigneeType === 'EMPLOYEE' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                          fontWeight: '700',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaUserTie /> Full-Time Employee
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAssigneeTypeChange('INTERN')}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1.5px solid ${assigneeType === 'INTERN' ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                          backgroundColor: assigneeType === 'INTERN' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                          color: assigneeType === 'INTERN' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                          fontWeight: '700',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaUserGraduate /> Intern
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Task Title <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={newTask.title}
                      onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder={assigneeType === 'EMPLOYEE' ? "e.g. Implement ChromaDB semantic search vector index" : "e.g. Build reusable UI tokens and table components"}
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        {assigneeType === 'EMPLOYEE' ? "Select Employee" : "Select Intern"} <span className="required">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={newTask.assignedTo}
                        onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      >
                        {assigneeType === 'EMPLOYEE' ? (
                          employeeList.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))
                        ) : (
                          internList.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={newTask.priority}
                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                      >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newTask.deadline}
                      onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Assign to {assigneeType === 'EMPLOYEE' ? 'Employee' : 'Intern'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {isEditModalOpen && editingTask && (
          <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Edit Task: {editingTask.id}</h3>
                <button onClick={() => setIsEditModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateTask}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Task Title <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingTask.title}
                      onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Assignee</label>
                      <select
                        className="form-select"
                        value={editingTask.assignedTo}
                        onChange={e => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                      >
                        <optgroup label="Employees">
                          {employeeList.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Interns">
                          {internList.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={editingTask.priority}
                        onChange={e => setEditingTask({ ...editingTask, priority: e.target.value })}
                      >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Task Status</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingTask.status}
                        readOnly
                        style={{ backgroundColor: 'var(--bg-surface-subtle)', cursor: 'not-allowed', fontWeight: '700' }}
                        title="Status is updated by the assigned employee when completing deliverables"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Assignee Progress ({editingTask.progress}%)</label>
                      <div style={{ paddingTop: '8px' }}>
                        <div style={{ height: '8px', backgroundColor: 'var(--border-default)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${editingTask.progress}%`, height: '100%', backgroundColor: editingTask.progress === 100 ? '#10b981' : 'var(--brand-primary)', borderRadius: '4px' }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                          Calculated directly from assignee task completion
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingTask.department || ''}
                        onChange={e => setEditingTask({ ...editingTask, department: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Deadline</label>
                      <input
                        type="date"
                        className="form-input"
                        value={editingTask.deadline || ''}
                        onChange={e => setEditingTask({ ...editingTask, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete / Cancel Task Confirmation Modal */}
        {isDeleteModalOpen && deletingTask && (
          <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
            <div className="modal-card" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--accent-red, #ef4444)' }}>
                  Cancel & Delete Task?
                </h3>
                <button onClick={() => setIsDeleteModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '20px 24px' }}>
                <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Are you sure you want to cancel and remove this deliverable?
                </p>
                <div style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  marginBottom: '14px'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{deletingTask.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                    ID: <strong>{deletingTask.id}</strong> • Assigned to: <strong>{deletingTask.assignedTo}</strong>
                  </div>
                </div>
                <p className="text-xs" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  This action will cancel the work and delete the task from the sprint queue.
                </p>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Keep Task
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  style={{
                    backgroundColor: 'var(--accent-red, #ef4444)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                  onClick={handleConfirmDelete}
                >
                  <FaTrash size={11} style={{ marginRight: '6px' }} /> Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export function ManagerReports() {
  const { showToast } = useToast();

  return (
    <MainLayout title="Reports">
      <div className="fade-in">
        <PageHeader
          title="Team Velocity & Workforce Reports"
          subtitle="Generate audit summaries, sprint velocity reports, and onboarding evaluations for executive review"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px' }}>📊 Monthly Sprint Velocity (PDF)</h3>
            <p className="text-sm" style={{ marginBottom: '16px' }}>Detailed breakdown of completed user stories, code review turnaround, and velocity per engineer.</p>
            <button className="btn-secondary" onClick={() => showToast('Exporting Sprint Velocity PDF Report...', 'info')}>
              Download Report (PDF)
            </button>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px' }}>👥 Team Performance Audit (CSV)</h3>
            <p className="text-sm" style={{ marginBottom: '16px' }}>Export raw completion rates, task milestones, and logged engineering hours for spreadsheet analysis.</p>
            <button className="btn-secondary" onClick={() => showToast('Exporting Performance Audit CSV...', 'info')}>
              Export CSV Dataset
            </button>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px' }}>🎓 Intern Onboarding Progress Summary</h3>
            <p className="text-sm" style={{ marginBottom: '16px' }}>Mentorship milestone evaluation and document compliance state for assigned interns.</p>
            <button className="btn-secondary" onClick={() => showToast('Generating Intern Evaluation Summary...', 'info')}>
              Generate Summary (PDF)
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ManagerTasks;

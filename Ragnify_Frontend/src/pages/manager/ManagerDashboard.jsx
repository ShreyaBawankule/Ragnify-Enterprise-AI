import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard, StatusBadge } from '../../components/common/StatCard';
import { WorkloadReviewModal } from '../../components/common/WorkloadReviewModal';
import { taskService, employeeService } from '../../api/employeeService';
import { useToast } from '../../context/ToastContext';
import {
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaTasks,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaFileAlt,
  FaEye,
  FaTimes,
  FaClipboardCheck
} from 'react-icons/fa';

export function ManagerDashboard() {
  const [dashboardView, setDashboardView] = useState('EMPLOYEES'); // 'EMPLOYEES' or 'INTERNS'
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [reviewPerson, setReviewPerson] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { showToast } = useToast();

  // Assign Task Form States
  const [assigneeType, setAssigneeType] = useState('EMPLOYEE'); // 'EMPLOYEE' or 'INTERN'
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Rahul Verma');
  const [newTaskPriority, setNewTaskPriority] = useState('HIGH');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  const employeeList = ['Rahul Verma', 'Neha Kapoor', 'Arjun Nair', 'Siddharth Sen'];
  const internList = ['Ananya Roy', 'Rohan Gupta'];

  useEffect(() => {
    taskService.getTasks().then(setTasks);
    employeeService.getEmployees().then(setTeam);
  }, []);

  // Update default assignee when assigneeType changes
  const handleAssigneeTypeChange = (type) => {
    setAssigneeType(type);
    if (type === 'EMPLOYEE') {
      setNewTaskAssignee(employeeList[0]);
    } else {
      setNewTaskAssignee(internList[0]);
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      title: newTaskTitle,
      assignedTo: newTaskAssignee,
      priority: newTaskPriority,
      status: 'PENDING',
      progress: 0,
      deadline: newTaskDeadline || '2026-10-30',
      department: assigneeType === 'EMPLOYEE' ? 'AI & Data Science' : 'Engineering'
    };

    setTasks(prev => [created, ...prev]);
    showToast(`Task assigned to ${assigneeType.toLowerCase()} ${newTaskAssignee}!`, 'success');
    setIsAssignModalOpen(false);
    setNewTaskTitle('');
  };

  const handleOpenReview = (target) => {
    let personObj;
    if (typeof target === 'string') {
      const match = team.find(m => m.name.toLowerCase() === target.toLowerCase());
      personObj = match || {
        name: target,
        type: internList.includes(target) ? 'Intern' : 'Employee',
        role: internList.includes(target) ? 'Frontend Development Intern' : 'Senior ML Engineer',
        department: internList.includes(target) ? 'Engineering' : 'AI & Data Science'
      };
    } else {
      personObj = target;
    }
    setReviewPerson(personObj);
    setIsReviewModalOpen(true);
  };

  const handleUpdateTaskFromReview = (taskId, updatedFields) => {
    setTasks(prev => prev.map(t => (t.id === taskId || t.task_id === taskId) ? { ...t, ...updatedFields } : t));
    taskService.updateTask(taskId, updatedFields).catch(() => {});
  };

  // Filter tasks and team members based on selected dashboard view
  const isEmployeeTask = (t) => employeeList.includes(t.assignedTo) || t.assignedTo?.includes('Verma') || t.assignedTo?.includes('Kapoor') || t.assignedTo?.includes('Sen');
  const isInternTask = (t) => internList.includes(t.assignedTo) || t.assignedTo?.includes('Roy') || t.assignedTo?.includes('Gupta');

  const currentTeam = dashboardView === 'EMPLOYEES' 
    ? team.filter(m => m.type === 'Employee') 
    : team.filter(m => m.type === 'Intern');

  const currentTasks = dashboardView === 'EMPLOYEES'
    ? tasks.filter(t => isEmployeeTask(t))
    : tasks.filter(t => isInternTask(t));

  const totalTasksCount = currentTasks.length;
  const inProgressCount = currentTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = currentTasks.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = currentTasks.filter(t => t.status === 'PENDING').length;

  return (
    <MainLayout title="Manager Dashboard">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Slicer / Segmented Toggle for Employees vs Interns */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '12px 18px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Dashboard View:
            </span>
            <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
              <button
                type="button"
                onClick={() => setDashboardView('EMPLOYEES')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  border: 'none',
                  backgroundColor: dashboardView === 'EMPLOYEES' ? 'var(--brand-primary)' : 'transparent',
                  color: dashboardView === 'EMPLOYEES' ? '#FFFFFF' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <FaUserTie size={12} /> Employees Dashboard
              </button>

              <button
                type="button"
                onClick={() => setDashboardView('INTERNS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  border: 'none',
                  backgroundColor: dashboardView === 'INTERNS' ? 'var(--brand-primary)' : 'transparent',
                  color: dashboardView === 'INTERNS' ? '#FFFFFF' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <FaUserGraduate size={12} /> Interns Dashboard
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/manager/reports" className="btn-secondary">
              <FaFileAlt size={12} /> Reports
            </Link>
            <button className="btn-primary" onClick={() => setIsAssignModalOpen(true)}>
              <FaPlus size={12} /> Assign Task
            </button>
          </div>
        </div>

        {/* Page Heading & Context */}
        <PageHeader
          title={dashboardView === 'EMPLOYEES' ? "Manager Dashboard — Employees" : "Manager Dashboard — Interns"}
          subtitle={dashboardView === 'EMPLOYEES'
            ? "Track full-time staff deliverables, sprint velocity, and core product engineering progress"
            : "Supervise intern task assignments, milestone deliverables, and mentorship progress"}
        />

        {/* 4 KPI Cards Filtered by Category */}
        <div className="kpi-cards-grid">
          <StatCard
            title={dashboardView === 'EMPLOYEES' ? "Full-Time Employees" : "Active Interns"}
            value={currentTeam.length}
            icon={dashboardView === 'EMPLOYEES' ? <FaUserTie /> : <FaUserGraduate />}
            change={dashboardView === 'EMPLOYEES' ? "4 Engineers" : "2 in tenure"}
            subtitle="Under Direct Supervision"
          />
          <StatCard
            title={dashboardView === 'EMPLOYEES' ? "Employee Tasks" : "Intern Tasks"}
            value={totalTasksCount}
            icon={<FaTasks />}
            change="Active Sprint"
            subtitle="Total Assigned"
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            icon={<FaClock />}
            change={`${pendingCount} pending start`}
            subtitle="Ongoing Work"
          />
          <StatCard
            title="Completed"
            value={completedCount}
            icon={<FaCheckCircle />}
            change={`${Math.round((completedCount / (totalTasksCount || 1)) * 100)}% completion`}
            subtitle="Sprint Output"
          />
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column: Tasks Table for Selected Category */}
          <div className="table-card">
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title">
                {dashboardView === 'EMPLOYEES' ? "Active Employee Tasks" : "Active Intern Deliverables"}
              </h3>
              <Link to="/manager/tasks" className="btn-action">View All Tasks</Link>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No tasks assigned for {dashboardView.toLowerCase()} in this sprint.
                      </td>
                    </tr>
                  ) : (
                    currentTasks.map(task => (
                      <tr key={task.id}>
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{task.title}</div>
                          <div className="text-xs">{task.id} • Due {task.deadline}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {dashboardView === 'EMPLOYEES' ? <FaUserTie size={11} style={{ color: 'var(--brand-primary)' }} /> : <FaUserGraduate size={11} style={{ color: 'var(--ai-accent)' }} />}
                            <span>{task.assignedTo}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${task.priority === 'HIGH' ? 'badge-danger' : task.priority === 'MEDIUM' ? 'badge-warning' : 'badge-neutral'}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={task.status} />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${task.progress}%`, height: '100%', backgroundColor: 'var(--brand-primary)', borderRadius: '3px' }} />
                            </div>
                            <span className="text-xs" style={{ fontWeight: '700' }}>{task.progress}%</span>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-action"
                            style={{ padding: '3px 8px', fontSize: '0.75rem', gap: '4px' }}
                            onClick={() => handleOpenReview(task.assignedTo)}
                            title={`Review workload for ${task.assignedTo}`}
                          >
                            <FaClipboardCheck size={10} /> Review Workload
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Workload or Onboarding Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {dashboardView === 'EMPLOYEES' ? (
              <>
                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: '14px' }}>Employee Workload Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
                    {employeeList.map(empName => {
                      const empTasks = tasks.filter(t => (t.assignedTo || '').includes(empName));
                      return (
                        <div key={empName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '6px' }}>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{empName}</div>
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {empTasks.length} Active Task{empTasks.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-action"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '5px' }}
                            onClick={() => handleOpenReview(empName)}
                            title={`Review sprint workload for ${empName}`}
                          >
                            <FaClipboardCheck size={11} /> Review Workload
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <Link to="/manager/employees" className="btn-secondary" style={{ width: '100%', marginTop: '14px', justifyContent: 'center', boxSizing: 'border-box' }}>
                    View All Employees
                  </Link>
                </div>

                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: '8px' }}>Sprint Velocity Review</h3>
                  <p className="text-sm" style={{ marginBottom: '12px' }}>Full-time engineering team output is currently on schedule with 100% QA pass rate.</p>
                  <Link to="/manager/team" className="btn-action" style={{ width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
                    Team Roster (Employees)
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: '14px' }}>Intern Workload & Mentorship</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {internList.map(internName => {
                      const intTasks = tasks.filter(t => (t.assignedTo || '').includes(internName));
                      return (
                        <div key={internName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)' }}>{internName}</div>
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {intTasks.length} Active Task{intTasks.length !== 1 ? 's' : ''} Assigned
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-action"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '5px' }}
                            onClick={() => handleOpenReview(internName)}
                            title={`Review mentorship workload for ${internName}`}
                          >
                            <FaClipboardCheck size={11} /> Review Workload
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <Link to="/manager/interns" className="btn-secondary" style={{ width: '100%', marginTop: '14px', justifyContent: 'center', boxSizing: 'border-box' }}>
                    Manage Assigned Interns
                  </Link>
                </div>

                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: '10px' }}>Pending Intern Reviews</h3>
                  <p className="text-sm" style={{ marginBottom: '12px' }}>Deliverables waiting for mentor sign-off before sprint closure.</p>
                  <Link to="/manager/reviews" className="btn-action" style={{ width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
                    Open Review Queue
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Assign Task Modal with Slicer for Employee vs Intern */}
        {isAssignModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAssignModalOpen(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Assign New Task</h3>
                <button onClick={() => setIsAssignModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateTask}>
                <div className="modal-body">
                  {/* Slicer for Employee vs Intern */}
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
                      placeholder={assigneeType === 'EMPLOYEE' ? "e.g. Implement ChromaDB semantic search vector index" : "e.g. Build reusable UI tokens and table components"}
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        {assigneeType === 'EMPLOYEE' ? "Select Employee" : "Select Intern"} <span className="required">*</span>
                      </label>
                      <select className="form-select" value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)}>
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
                      <select className="form-select" value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)}>
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
                      value={newTaskDeadline}
                      onChange={e => setNewTaskDeadline(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsAssignModalOpen(false)}>
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

        {/* Workload Review Modal for Employee & Intern */}
        <WorkloadReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          person={reviewPerson}
          tasks={tasks}
          onUpdateTask={handleUpdateTaskFromReview}
          onAssignNewTask={(name, type) => {
            setAssigneeType(type === 'Intern' ? 'INTERN' : 'EMPLOYEE');
            setNewTaskAssignee(name);
            setIsAssignModalOpen(true);
          }}
        />
      </div>
    </MainLayout>
  );
}

export default ManagerDashboard;

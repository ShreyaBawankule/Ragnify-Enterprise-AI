import React, { useState } from 'react';
import { 
  FaTimes, 
  FaUserTie, 
  FaUserGraduate, 
  FaCheckCircle, 
  FaClock, 
  FaTasks, 
  FaClipboardCheck, 
  FaPlus, 
  FaEdit, 
  FaExclamationTriangle,
  FaChartLine,
  FaBusinessTime
} from 'react-icons/fa';
import { StatusBadge } from './StatCard';
import { useToast } from '../../context/ToastContext';

export function WorkloadReviewModal({
  isOpen,
  onClose,
  person,
  tasks = [],
  onUpdateTask,
  onAssignNewTask
}) {
  const { showToast } = useToast();
  const [assessmentStatus, setAssessmentStatus] = useState('BALANCED'); // 'BALANCED' | 'OVERLOADED' | 'AVAILABLE'
  const [managerNotes, setManagerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !person) return null;

  const personName = typeof person === 'string' ? person : (person.name || person.applicantName || 'Team Member');
  const personType = person?.type || (['Ananya Roy', 'Rohan Gupta'].some(n => personName.includes(n)) ? 'Intern' : 'Employee');
  const personRole = person?.role || (personType === 'Intern' ? 'Frontend Development Intern' : 'Senior ML Engineer');
  const personDept = person?.department || 'Engineering';
  const personEmail = person?.email || `${personName.toLowerCase().replace(/\s+/g, '.')}@ragnify.com`;
  const personId = person?.id || (personType === 'Intern' ? 'INT-201' : 'EMP-101');

  // Filter tasks assigned to this person
  const personTasks = tasks.filter(t => {
    const assignee = (t.assignedTo || t.assigneeName || '').toLowerCase();
    const target = personName.toLowerCase();
    return assignee.includes(target) || target.includes(assignee);
  });

  const totalTasks = personTasks.length;
  const completedTasks = personTasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = personTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingTasks = personTasks.filter(t => t.status === 'PENDING').length;
  const avgProgress = totalTasks > 0 
    ? Math.round(personTasks.reduce((acc, t) => acc + (Number(t.progress) || 0), 0) / totalTasks)
    : 0;

  const handleStatusChange = (taskId, newStatus) => {
    const newProgress = newStatus === 'COMPLETED' ? 100 : (newStatus === 'IN_PROGRESS' ? 50 : 0);
    if (onUpdateTask) {
      onUpdateTask(taskId, { status: newStatus, progress: newProgress });
      showToast(`Task status updated to ${newStatus.replace('_', ' ')}!`, 'success');
    }
  };

  const handlePriorityChange = (taskId, newPriority) => {
    if (onUpdateTask) {
      onUpdateTask(taskId, { priority: newPriority });
      showToast(`Task priority set to ${newPriority}!`, 'info');
    }
  };

  const handleProgressChange = (taskId, progressVal) => {
    const val = Math.min(100, Math.max(0, Number(progressVal)));
    const newStatus = val === 100 ? 'COMPLETED' : (val > 0 ? 'IN_PROGRESS' : 'PENDING');
    if (onUpdateTask) {
      onUpdateTask(taskId, { progress: val, status: newStatus });
    }
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Workload review for ${personName} signed off and saved! Capacity marked as ${assessmentStatus}.`, 'success');
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '840px', width: '92vw', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="modal-header" style={{ paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: personType === 'Intern' ? 'var(--status-info-subtle, #E0F2FE)' : 'var(--brand-primary-subtle, #EFF6FF)',
              color: personType === 'Intern' ? 'var(--ai-accent, #0284C7)' : 'var(--brand-primary, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800'
            }}>
              {personType === 'Intern' ? <FaUserGraduate /> : <FaUserTie />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Workload Review — {personName}
                </h3>
                <span className={`badge ${personType === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                  {personType}
                </span>
                <span className={`badge ${inProgressTasks > 2 ? 'badge-warning' : (totalTasks > 0 ? 'badge-success' : 'badge-neutral')}`}>
                  {inProgressTasks > 2 ? 'Heavy Load' : (totalTasks > 0 ? 'Optimal Load' : 'Available')}
                </span>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                {personRole} • {personDept} • {personEmail} • ID: {personId}
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <FaTimes size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* KPI CARDS SUMMARY */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700' }}>
                <span>TOTAL ASSIGNED</span>
                <FaTasks color="var(--brand-primary)" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalTasks} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Tasks</span>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                {inProgressTasks} In Progress • {completedTasks} Done
              </div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700' }}>
                <span>SPRINT PROGRESS</span>
                <FaChartLine color="var(--status-success)" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                {avgProgress}%
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Avg across active deliverables
              </div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700' }}>
                <span>WEEKLY HOURS</span>
                <FaBusinessTime color="var(--ai-accent)" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                {personType === 'Intern' ? '25' : '40'} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>hrs/wk</span>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Standard scheduled sprint shift
              </div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700' }}>
                <span>CAPACITY STATUS</span>
                <FaClipboardCheck color="var(--status-warning)" />
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: inProgressTasks > 2 ? 'var(--status-warning)' : 'var(--status-success)', marginTop: '6px' }}>
                {inProgressTasks > 2 ? 'Near Capacity' : (totalTasks > 0 ? 'Healthy Balance' : '100% Available')}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Based on active deliverables
              </div>
            </div>
          </div>

          {/* DELIVERABLES & TASKS LIST */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Active Sprint Deliverables ({personTasks.length})
              </h4>
              {onAssignNewTask && (
                <button 
                  type="button" 
                  className="btn-action" 
                  onClick={() => {
                    onClose();
                    onAssignNewTask(personName, personType);
                  }}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <FaPlus size={10} /> Assign New Task
                </button>
              )}
            </div>

            {personTasks.length === 0 ? (
              <div style={{
                padding: '28px 16px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '8px',
                border: '1px dashed var(--border-default)',
                color: 'var(--text-secondary)'
              }}>
                <FaTasks size={28} color="var(--text-muted)" style={{ marginBottom: '8px', opacity: 0.7 }} />
                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>No tasks currently assigned to {personName}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                  Use the Assign Task button to allocate deliverables to this {personType.toLowerCase()}.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {personTasks.map(task => (
                  <div
                    key={task.id || task.task_id}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {task.title || task.task_title}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                          ID: <code>{task.id || task.task_id}</code> • Deadline: <strong>{task.deadline || task.dueDate || 'Sprint End'}</strong> • Dept: {task.department || personDept}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Priority Selector */}
                        <select
                          className="form-select"
                          value={task.priority}
                          onChange={e => handlePriorityChange(task.id || task.task_id, e.target.value)}
                          style={{ padding: '3px 8px', fontSize: '0.75rem', height: 'auto', fontWeight: '700' }}
                        >
                          <option value="HIGH">High Priority</option>
                          <option value="MEDIUM">Medium Priority</option>
                          <option value="LOW">Low Priority</option>
                        </select>

                        {/* Status Selector */}
                        <select
                          className="form-select"
                          value={task.status}
                          onChange={e => handleStatusChange(task.id || task.task_id, e.target.value)}
                          style={{ padding: '3px 8px', fontSize: '0.75rem', height: 'auto', fontWeight: '700' }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Progress Slider & Quick Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--border-default)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${task.progress || 0}%`, 
                              height: '100%', 
                              backgroundColor: (task.progress || 0) === 100 ? 'var(--status-success)' : 'var(--brand-primary)',
                              borderRadius: '4px',
                              transition: 'width 0.2s ease'
                            }} 
                          />
                        </div>
                        <span className="text-xs" style={{ fontWeight: '800', minWidth: '38px', textAlign: 'right' }}>
                          {task.progress || 0}%
                        </span>
                      </div>

                      {/* Quick Progress Buttons */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[25, 50, 75, 100].map(pct => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleProgressChange(task.id || task.task_id, pct)}
                            style={{
                              padding: '2px 6px',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              borderRadius: '3px',
                              border: '1px solid var(--border-default)',
                              backgroundColor: task.progress === pct ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                              color: task.progress === pct ? '#FFFFFF' : 'var(--text-secondary)',
                              cursor: 'pointer'
                            }}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MANAGER ASSESSMENT & SIGN-OFF FORM */}
          <form onSubmit={handleSaveReview} style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Manager Performance & Capacity Assessment
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setAssessmentStatus('BALANCED')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: `1.5px solid ${assessmentStatus === 'BALANCED' ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                  backgroundColor: assessmentStatus === 'BALANCED' ? 'var(--brand-primary-subtle, #EFF6FF)' : 'var(--bg-surface)',
                  color: assessmentStatus === 'BALANCED' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                ✅ Optimal & Balanced
              </button>

              <button
                type="button"
                onClick={() => setAssessmentStatus('AVAILABLE')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: `1.5px solid ${assessmentStatus === 'AVAILABLE' ? 'var(--status-success)' : 'var(--border-default)'}`,
                  backgroundColor: assessmentStatus === 'AVAILABLE' ? 'var(--status-success-subtle, #ECFDF5)' : 'var(--bg-surface)',
                  color: assessmentStatus === 'AVAILABLE' ? 'var(--status-success)' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                🚀 Has Extra Capacity
              </button>

              <button
                type="button"
                onClick={() => setAssessmentStatus('OVERLOADED')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: `1.5px solid ${assessmentStatus === 'OVERLOADED' ? 'var(--status-warning)' : 'var(--border-default)'}`,
                  backgroundColor: assessmentStatus === 'OVERLOADED' ? 'var(--status-warning-subtle, #FFFBEB)' : 'var(--bg-surface)',
                  color: assessmentStatus === 'OVERLOADED' ? 'var(--status-warning)' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                ⚠️ Near Max Capacity
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                Manager Sprint Feedback & Guidance Notes
              </label>
              <textarea
                className="form-input"
                rows="2"
                placeholder={`Provide mentorship guidance, milestone feedback, or workload adjustment recommendations for ${personName}...`}
                value={managerNotes}
                onChange={e => setManagerNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={onClose} style={{ padding: '7px 14px' }}>
                Close
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '7px 16px' }}>
                <FaClipboardCheck size={12} /> Sign Off & Save Workload Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WorkloadReviewModal;

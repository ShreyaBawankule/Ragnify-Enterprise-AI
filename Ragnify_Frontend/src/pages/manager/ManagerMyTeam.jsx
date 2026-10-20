import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge, EmptyState } from '../../components/common/StatCard';
import { WorkloadReviewModal } from '../../components/common/WorkloadReviewModal';
import { employeeService, taskService } from '../../api/employeeService';
import { useToast } from '../../context/ToastContext';
import { FaUserTie, FaUserGraduate, FaTasks, FaSearch, FaClipboardCheck } from 'react-icons/fa';

export function ManagerMyTeam() {
  const [team, setTeam] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamFilter, setTeamFilter] = useState('ALL'); // 'ALL', 'EMPLOYEES', 'INTERNS'
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    employeeService.getEmployees().then(setTeam);
    taskService.getTasks().then(setTasks);
  }, []);

  const filteredTeam = team.filter(member => {
    const matchFilter = teamFilter === 'ALL' ||
      (teamFilter === 'EMPLOYEES' && member.type === 'Employee') ||
      (teamFilter === 'INTERNS' && member.type === 'Intern');
    const matchSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase()) ||
      member.department.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const employeeCount = team.filter(m => m.type === 'Employee').length;
  const internCount = team.filter(m => m.type === 'Intern').length;

  return (
    <MainLayout title="My Team">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <PageHeader
          title="Direct Engineering & Product Team"
          subtitle="Supervise team members, track individual sprint workloads, and distinguish between full-time staff and interns"
        />

        {/* Team Slicer / Segmented Bar */}
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setTeamFilter('ALL')}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8125rem',
                fontWeight: '700',
                border: 'none',
                backgroundColor: teamFilter === 'ALL' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: teamFilter === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              All Members ({team.length})
            </button>

            <button
              type="button"
              onClick={() => setTeamFilter('EMPLOYEES')}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8125rem',
                fontWeight: '700',
                border: 'none',
                backgroundColor: teamFilter === 'EMPLOYEES' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: teamFilter === 'EMPLOYEES' ? '#FFFFFF' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <FaUserTie size={12} /> Employees ({employeeCount})
            </button>

            <button
              type="button"
              onClick={() => setTeamFilter('INTERNS')}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8125rem',
                fontWeight: '700',
                border: 'none',
                backgroundColor: teamFilter === 'INTERNS' ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                color: teamFilter === 'INTERNS' ? '#FFFFFF' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <FaUserGraduate size={12} /> Interns ({internCount})
            </button>
          </div>

          <div className="search-input-wrapper" style={{ maxWidth: '280px', minWidth: '200px' }}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, role, dept..."
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Team Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Category</th>
                  <th>Designation / Role</th>
                  <th>Department</th>
                  <th>Active Sprint Workload</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeam.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '32px' }}>
                      <EmptyState title="No team members found" message="No records match your selected filter." />
                    </td>
                  </tr>
                ) : (
                  filteredTeam.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{member.name}</div>
                        <div className="text-xs">{member.email}</div>
                      </td>
                      <td>
                        <span className={`badge ${member.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                          {member.type === 'Intern' ? <FaUserGraduate size={10} /> : <FaUserTie size={10} />} {member.type}
                        </span>
                      </td>
                      <td>{member.role}</td>
                      <td>{member.department}</td>
                      <td>
                        <strong>{member.type === 'Intern' ? '2 Tasks Assigned' : '3 Tasks Assigned'}</strong>
                      </td>
                      <td>
                        <StatusBadge status={member.status} />
                      </td>
                      <td>
                        <button
                          className="btn-action"
                          onClick={() => {
                            setSelectedPerson(member);
                            setIsModalOpen(true);
                          }}
                          title={`Review sprint workload for ${member.name}`}
                        >
                          <FaClipboardCheck size={11} /> Review Workload
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workload Review Modal */}
        <WorkloadReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          person={selectedPerson}
          tasks={tasks}
          onUpdateTask={(taskId, updatedFields) => {
            setTasks(prev => prev.map(t => (t.id === taskId || t.task_id === taskId) ? { ...t, ...updatedFields } : t));
            taskService.updateTask(taskId, updatedFields).catch(() => {});
          }}
        />
      </div>
    </MainLayout>
  );
}

export default ManagerMyTeam;

import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { WorkloadReviewModal } from '../../components/common/WorkloadReviewModal';
import { employeeService, taskService } from '../../api/employeeService';
import { useToast } from '../../context/ToastContext';
import { FaUserTie, FaCheckCircle, FaClipboardCheck, FaTasks } from 'react-icons/fa';

export function ManagerMyEmployees() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    employeeService.getEmployees().then(all => {
      setEmployees(all.filter(e => e.type === 'Employee'));
    });
    taskService.getTasks().then(setTasks);
  }, []);

  const handleOpenReview = (emp) => {
    setSelectedPerson(emp);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (taskId, updatedFields) => {
    setTasks(prev => prev.map(t => (t.id === taskId || t.task_id === taskId) ? { ...t, ...updatedFields } : t));
    taskService.updateTask(taskId, updatedFields).catch(() => {});
  };

  return (
    <MainLayout title="My Employees">
      <div className="fade-in">
        <PageHeader
          title="Direct Report Employees"
          subtitle="Full-time staff oversight, role responsibilities, sprint tasks, and onboarding completion records"
        />

        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Designation / Role</th>
                  <th>Department</th>
                  <th>Joining Date</th>
                  <th>Onboarding State</th>
                  <th>Employment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{emp.name}</div>
                      <div className="text-xs">{emp.email} • {emp.id}</div>
                    </td>
                    <td>{emp.role}</td>
                    <td>{emp.department}</td>
                    <td>{emp.joiningDate}</td>
                    <td>
                      <StatusBadge status={emp.onboardingStatus || 'COMPLETED'} />
                    </td>
                    <td>
                      <StatusBadge status={emp.status} />
                    </td>
                    <td>
                      <button
                        className="btn-action"
                        onClick={() => handleOpenReview(emp)}
                        title={`Review sprint workload for ${emp.name}`}
                      >
                        <FaClipboardCheck size={11} /> Review Workload
                      </button>
                    </td>
                  </tr>
                ))}
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
          onUpdateTask={handleUpdateTask}
        />
      </div>
    </MainLayout>
  );
}

export default ManagerMyEmployees;

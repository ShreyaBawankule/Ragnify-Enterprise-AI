import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { WorkloadReviewModal } from '../../components/common/WorkloadReviewModal';
import { internService } from '../../api/onboardingService';
import { taskService } from '../../api/employeeService';
import { useToast } from '../../context/ToastContext';
import { FaUserGraduate, FaCheckCircle, FaClipboardCheck } from 'react-icons/fa';

export function ManagerMyInterns() {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    internService.getInterns().then(setInterns);
    taskService.getTasks().then(setTasks);
  }, []);

  const handleOpenReview = (intern) => {
    setSelectedPerson(intern);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (taskId, updatedFields) => {
    setTasks(prev => prev.map(t => (t.id === taskId || t.task_id === taskId) ? { ...t, ...updatedFields } : t));
    taskService.updateTask(taskId, updatedFields).catch(() => {});
  };

  return (
    <MainLayout title="My Interns">
      <div className="fade-in">
        <PageHeader
          title="Assigned Interns & Mentorship"
          subtitle="Supervise internship tenures, guide project roadmaps, and review sprint submissions"
        />

        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Intern Name</th>
                  <th>Internship Role</th>
                  <th>Department</th>
                  <th>Tenure Duration</th>
                  <th>Onboarding State</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interns.map(intern => (
                  <tr key={intern.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{intern.name}</div>
                      <div className="text-xs">{intern.email}</div>
                    </td>
                    <td>{intern.role}</td>
                    <td>{intern.department}</td>
                    <td>Aug 01, 2026 – Oct 31, 2026</td>
                    <td>
                      <StatusBadge status={intern.onboardingStatus} />
                    </td>
                    <td>
                      <StatusBadge status={intern.status} />
                    </td>
                    <td>
                      <button
                        className="btn-action"
                        onClick={() => handleOpenReview(intern)}
                        title={`Review mentorship workload for ${intern.name}`}
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

        {/* Workload Review Modal for Interns */}
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

export function ManagerOnboardingProgress() {
  return (
    <MainLayout title="Onboarding Progress">
      <div className="fade-in">
        <PageHeader
          title="Team Onboarding & Verification Progress"
          subtitle="Real-time verification states, document submissions, and mentor checkpoints"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Ananya Roy</span>
              <StatusBadge status="IN_PROGRESS" />
            </div>
            <div className="text-sm" style={{ marginBottom: '16px' }}>Frontend Development Intern • Engineering</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>✅ Offer Letter Signed</span>
                <span className="text-xs" style={{ color: 'var(--status-success)', fontWeight: '700' }}>COMPLETED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>✅ IT & Git Access Provisioned</span>
                <span className="text-xs" style={{ color: 'var(--status-success)', fontWeight: '700' }}>COMPLETED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>⏳ Mid-Tenure Performance Review</span>
                <span className="text-xs" style={{ color: 'var(--status-warning)', fontWeight: '700' }}>IN PROGRESS</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Rohan Gupta</span>
              <StatusBadge status="IN_PROGRESS" />
            </div>
            <div className="text-sm" style={{ marginBottom: '16px' }}>AI Research Intern • AI & Data Science</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>✅ Offer Letter Signed</span>
                <span className="text-xs" style={{ color: 'var(--status-success)', fontWeight: '700' }}>COMPLETED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>⏳ Document Verification Check</span>
                <span className="text-xs" style={{ color: 'var(--status-warning)', fontWeight: '700' }}>HR PENDING</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>⏳ First Sprint Deliverable</span>
                <span className="text-xs" style={{ color: 'var(--status-warning)', fontWeight: '700' }}>IN PROGRESS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export function ManagerPendingReviews() {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([
    {
      id: 'REV-1',
      intern: 'Ananya Roy',
      item: 'Design System Implementation Pull Request #42',
      deadline: '2026-10-10',
      status: 'PENDING'
    },
    {
      id: 'REV-2',
      intern: 'Rohan Gupta',
      item: 'Groq Whisper Audio Transcription Benchmarking Docs',
      deadline: '2026-10-12',
      status: 'PENDING'
    }
  ]);

  const handleApprove = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Deliverable approved & marked as verified!', 'success');
  };

  return (
    <MainLayout title="Pending Reviews">
      <div className="fade-in">
        <PageHeader
          title="Pending Deliverable Reviews"
          subtitle="Audit team submissions and sign off on milestone completion"
        />

        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assignee</th>
                  <th>Deliverable / Item</th>
                  <th>Target Deadline</th>
                  <th>Review Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      All pending reviews cleared! No outstanding items.
                    </td>
                  </tr>
                ) : (
                  reviews.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.intern}</strong></td>
                      <td>{r.item}</td>
                      <td>{r.deadline}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <button
                          className="btn-action"
                          style={{ color: 'var(--status-success)', backgroundColor: 'var(--status-success-subtle)', borderColor: 'var(--status-success-border)' }}
                          onClick={() => handleApprove(r.id)}
                        >
                          <FaCheckCircle size={11} /> Approve & Sign Off
                        </button>
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

export default ManagerMyInterns;

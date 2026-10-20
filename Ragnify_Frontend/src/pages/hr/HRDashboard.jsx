import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard, StatusBadge } from '../../components/common/StatCard';
import { onboardingService, documentService } from '../../api/onboardingService';
import { employeeService } from '../../api/employeeService';
import {
  FaUsers,
  FaUserGraduate,
  FaClipboardList,
  FaFileAlt,
  FaArrowRight,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaUserPlus
} from 'react-icons/fa';

export function HRDashboard() {
  const [employees, setEmployees] = useState([]);
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [empData, appData, docData] = await Promise.all([
          employeeService.getEmployees(),
          onboardingService.getApplications(),
          documentService.getDocuments()
        ]);
        setEmployees(empData);
        setApplications(appData);
        setDocuments(docData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalEmployees = employees.filter(e => e.type === 'Employee').length;
  const activeInterns = employees.filter(e => e.type === 'Intern').length;
  const pendingApps = applications.filter(a => a.status === 'PENDING').length;
  const docsUnderReview = documents.filter(d => d.status === 'UNDER_REVIEW' || d.status === 'PENDING').length;

  return (
    <MainLayout title="HR Dashboard">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Page Header */}
        <PageHeader
          title="HR & Onboarding Command Center"
          subtitle="Manage people, candidate verification, onboarding lifecycles, and workforce operations."
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/hr/applications" className="btn-secondary">
                <FaClipboardList size={12} /> Review Applications
              </Link>
              <Link to="/apply/intern" target="_blank" className="btn-primary">
                <FaUserPlus size={12} /> Public Application Link
              </Link>
            </div>
          }
        />

        {/* 4-Column KPI Grid */}
        <div className="kpi-cards-grid">
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            icon={<FaUsers />}
            change="+4 this quarter"
            subtitle="Full-Time Staff"
          />
          <StatCard
            title="Active Interns"
            value={activeInterns}
            icon={<FaUserGraduate />}
            change="2 ending soon"
            subtitle="Active Tenure"
          />
          <StatCard
            title="Pending Applications"
            value={pendingApps}
            icon={<FaClipboardList />}
            change="Action Needed"
            subtitle="Awaiting Review"
          />
          <StatCard
            title="Documents Under Review"
            value={docsUnderReview}
            icon={<FaFileAlt />}
            change="Verification Queue"
            subtitle="Pending Sign-off"
          />
        </div>

        {/* Onboarding Overview Metrics Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Onboarding Pipeline & Status Summary</h3>
            <span className="badge badge-info">Active Sprint</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Fully Onboarded</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--status-success)' }}>
                {employees.filter(e => e.onboardingStatus === 'COMPLETED').length} Staff
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Documents Under Review</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--status-warning)' }}>
                {docsUnderReview} Pending
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Avg Verification Speed</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--brand-primary)' }}>
                1.8 Days
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Certificate Issuance</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--ai-accent)' }}>
                Automated
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="table-card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="card-title">Recent Candidate Applications</h3>
              <p className="text-xs" style={{ marginTop: '2px' }}>Latest applicant registrations submitted for evaluation</p>
            </div>
            <Link to="/hr/applications" className="btn-action">
              View All <FaArrowRight size={10} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Type</th>
                  <th>Applied Role</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 4).map(app => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{app.applicantName}</div>
                      <div className="text-xs">{app.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${app.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                        {app.type}
                      </span>
                    </td>
                    <td>{app.role}</td>
                    <td>{app.appliedDate}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      <Link to="/hr/applications" className="btn-action">
                        <FaEye size={11} /> Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default HRDashboard;

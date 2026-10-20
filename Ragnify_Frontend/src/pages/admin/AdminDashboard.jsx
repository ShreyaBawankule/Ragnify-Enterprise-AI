import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard, StatusBadge } from '../../components/common/StatCard';
import { employeeService, taskService } from '../../api/employeeService';
import { useToast } from '../../context/ToastContext';
import { FaUsers, FaTasks, FaServer, FaRobot, FaCog, FaFileAlt } from 'react-icons/fa';

export function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    employeeService.getEmployees().then(setEmployees);
    taskService.getTasks().then(setTasks);
  }, []);

  return (
    <MainLayout title="Admin Console">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PageHeader
          title="Platform Administration Console"
          subtitle="System health, organization user directory, infrastructure metrics, and workspace configuration"
          actions={
            <Link to="/admin/settings" className="btn-secondary">
              <FaCog size={12} /> System Settings
            </Link>
          }
        />

        {/* 4 KPI Cards */}
        <div className="kpi-cards-grid">
          <StatCard
            title="Total Users Registered"
            value={employees.length + 5}
            icon={<FaUsers />}
            change="+12% YoY"
            subtitle="Active accounts"
          />
          <StatCard
            title="Total Active Tasks"
            value={tasks.length}
            icon={<FaTasks />}
            change="Across all departments"
            subtitle="Platform Tasks"
          />
          <StatCard
            title="API & Service Uptime"
            value="99.98%"
            icon={<FaServer />}
            change="All services online"
            subtitle="FastAPI + PostgreSQL"
          />
          <StatCard
            title="AI Inferences Today"
            value="1,420"
            icon={<FaRobot />}
            change="Groq Whisper + GPT-OSS"
            subtitle="Model Queries"
          />
        </div>

        {/* Admin Quick Action Shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px' }}>Workforce Management</h3>
            <p className="text-sm" style={{ marginBottom: '16px' }}>Manage user permissions, roles (HR, Manager, Employee, Intern), and account provisioning.</p>
            <Link to="/admin/employees" className="btn-action">
              Manage Employee Accounts
            </Link>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px' }}>Task & Workflow Auditing</h3>
            <p className="text-sm" style={{ marginBottom: '16px' }}>Global oversight of team deliverables, cross-department deadlines, and sprint metrics.</p>
            <Link to="/admin/tasks" className="btn-action">
              Audit Organization Tasks
            </Link>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px' }}>Audit & Compliance Reports</h3>
            <p className="text-sm" style={{ marginBottom: '16px' }}>Generate platform security access logs and compliance reports for leadership audit.</p>
            <Link to="/admin/reports" className="btn-action">
              View Audit Reports
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    employeeService.getEmployees().then(setEmployees);
  }, []);

  return (
    <MainLayout title="Admin Employees">
      <div className="fade-in">
        <PageHeader
          title="Organization User Administration"
          subtitle="Directory of all registered accounts, credentials, and role assignments"
        />

        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e.id}>
                    <td>
                      <strong>{e.name}</strong>
                      <div className="text-xs">{e.email}</div>
                    </td>
                    <td><span className="badge badge-neutral">{e.type}</span></td>
                    <td>{e.role}</td>
                    <td>{e.department}</td>
                    <td><StatusBadge status={e.status} /></td>
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

export function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    taskService.getTasks().then(setTasks);
  }, []);

  return (
    <MainLayout title="Admin Tasks">
      <div className="fade-in">
        <PageHeader
          title="Platform Task Audit"
          subtitle="System-wide deliverables across all corporate teams"
        />

        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Assignee</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.title}</strong></td>
                    <td>{t.assignedTo}</td>
                    <td>{t.department}</td>
                    <td><span className="badge badge-neutral">{t.priority}</span></td>
                    <td>{t.deadline}</td>
                    <td><StatusBadge status={t.status} /></td>
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

export function AdminReports() {
  const { showToast } = useToast();

  return (
    <MainLayout title="Admin Reports">
      <div className="fade-in">
        <PageHeader
          title="Platform Infrastructure & Access Reports"
          subtitle="Audit system logs, security events, and compliance records"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px' }}>🔒 Security & Access Audit Log</h3>
            <p className="text-sm" style={{ marginBottom: '16px' }}>Detailed report of all user logins, token sessions, and role privilege changes.</p>
            <button className="btn-secondary" onClick={() => showToast('Exporting Security Audit Log (CSV)...', 'info')}>
              Export Audit Log (CSV)
            </button>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '8px' }}>🤖 AI Model Usage & Latency Report</h3>
            <p className="text-sm" style={{ marginBottom: '16px' }}>Inference token usage, Groq Whisper transcription metrics, and RAG retrieval latency stats.</p>
            <button className="btn-secondary" onClick={() => showToast('Exporting AI Metrics Summary (PDF)...', 'info')}>
              Export AI Metrics (PDF)
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;

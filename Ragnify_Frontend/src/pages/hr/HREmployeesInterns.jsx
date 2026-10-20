import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge, EmptyState } from '../../components/common/StatCard';
import { employeeService } from '../../api/employeeService';
import { useToast } from '../../context/ToastContext';
import { FaSearch, FaUserPlus, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

export function HREmployeesInterns() {
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    employeeService.getEmployees().then(setPeople);
  }, []);

  const filtered = useMemo(() => {
    return people.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'ALL' || p.type.toUpperCase() === typeFilter.toUpperCase();
      const matchStatus = statusFilter === 'ALL' || p.status.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchType && matchStatus;
    });
  }, [people, searchTerm, typeFilter, statusFilter]);

  return (
    <MainLayout title="Employees & Interns">
      <div className="fade-in">
        <PageHeader
          title="Employees & Interns Directory"
          subtitle="Unified workforce registry with role mappings, department records, and onboarding states"
        />

        {/* Filters Toolbar */}
        <div className="filter-toolbar">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: '160px', height: '38px' }}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="EMPLOYEE">Employees Only</option>
            <option value="INTERN">Interns Only</option>
          </select>

          <select
            className="form-select"
            style={{ width: '160px', height: '38px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Directory Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Type</th>
                  <th>Designation / Role</th>
                  <th>Department</th>
                  <th>Manager</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '32px' }}>
                      <EmptyState title="No people match your search" message="Try adjusting your filter or search query." />
                    </td>
                  </tr>
                ) : (
                  filtered.map(person => (
                    <tr key={person.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{person.name}</div>
                        <div className="text-xs">{person.email}</div>
                      </td>
                      <td>
                        <span className={`badge ${person.type === 'Intern' ? 'badge-info' : 'badge-neutral'}`}>
                          {person.type}
                        </span>
                      </td>
                      <td>{person.role}</td>
                      <td>{person.department}</td>
                      <td>{person.manager || 'Priya Sharma'}</td>
                      <td>{person.joiningDate}</td>
                      <td>
                        <StatusBadge status={person.status} />
                      </td>
                      <td>
                        <button
                          className="btn-action"
                          onClick={() => {
                            setSelectedPerson(person);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaEye size={11} /> View Record
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {isModalOpen && selectedPerson && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{selectedPerson.name}</h3>
                  <span className="text-sm">{selectedPerson.id} • {selectedPerson.type}</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.875rem' }}>
                  <div>
                    <span className="text-xs" style={{ display: 'block' }}>Email Address</span>
                    <strong>{selectedPerson.email}</strong>
                  </div>
                  <div>
                    <span className="text-xs" style={{ display: 'block' }}>Phone</span>
                    <strong>{selectedPerson.phone || '+91 98765 43210'}</strong>
                  </div>
                  <div>
                    <span className="text-xs" style={{ display: 'block' }}>Department</span>
                    <strong>{selectedPerson.department}</strong>
                  </div>
                  <div>
                    <span className="text-xs" style={{ display: 'block' }}>Assigned Manager</span>
                    <strong>{selectedPerson.manager || 'Vikram Mehta'}</strong>
                  </div>
                  <div>
                    <span className="text-xs" style={{ display: 'block' }}>Joining Date</span>
                    <strong>{selectedPerson.joiningDate}</strong>
                  </div>
                  <div>
                    <span className="text-xs" style={{ display: 'block' }}>Onboarding Status</span>
                    <StatusBadge status={selectedPerson.onboardingStatus || 'COMPLETED'} />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
                <button className="btn-primary" onClick={() => { showToast('Employee records updated.', 'success'); setIsModalOpen(false); }}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default HREmployeesInterns;

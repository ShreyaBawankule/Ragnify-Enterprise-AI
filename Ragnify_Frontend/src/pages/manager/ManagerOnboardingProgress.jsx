import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatCard';
import { useToast } from '../../context/ToastContext';
import { 
  FaUserGraduate, 
  FaUserTie, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCommentDots, 
  FaSave, 
  FaTimes, 
  FaFilter,
  FaSearch
} from 'react-icons/fa';

const DEFAULT_ONBOARDING_DATA = [
  {
    id: 'OB-001',
    name: 'Ananya Roy',
    type: 'Intern',
    role: 'Frontend Development Intern',
    department: 'Engineering',
    startDate: '2026-08-01',
    manager: 'Vikram Mehta',
    overallStatus: 'IN_PROGRESS',
    notes: 'Excelling in UI architecture. Needs final mentor review on Capstone milestone.',
    milestones: [
      { id: 'm1', label: 'Offer Letter Signed & Accepted', status: 'COMPLETED' },
      { id: 'm2', label: 'Identity & Legal Documentation Verified', status: 'COMPLETED' },
      { id: 'm3', label: 'Workstation & IT Git Access Provisioned', status: 'COMPLETED' },
      { id: 'm4', label: 'Manager 1-on-1 & Sprint Orientation', status: 'COMPLETED' },
      { id: 'm5', label: 'Mid-Tenure Performance Review', status: 'IN_PROGRESS' },
      { id: 'm6', label: 'Final Capstone Project Sign-off', status: 'PENDING' }
    ]
  },
  {
    id: 'OB-002',
    name: 'Rohan Gupta',
    type: 'Intern',
    role: 'AI Research Intern',
    department: 'AI & Data Science',
    startDate: '2026-08-01',
    manager: 'Vikram Mehta',
    overallStatus: 'IN_PROGRESS',
    notes: 'Awaiting HR verification for university transcript credits.',
    milestones: [
      { id: 'm1', label: 'Offer Letter Signed & Accepted', status: 'COMPLETED' },
      { id: 'm2', label: 'Identity & Legal Documentation Verified', status: 'IN_PROGRESS' },
      { id: 'm3', label: 'Workstation & IT Git Access Provisioned', status: 'COMPLETED' },
      { id: 'm4', label: 'Manager 1-on-1 & Sprint Orientation', status: 'COMPLETED' },
      { id: 'm5', label: 'First Sprint Benchmark Deliverable', status: 'IN_PROGRESS' },
      { id: 'm6', label: 'Final Capstone Project Sign-off', status: 'PENDING' }
    ]
  },
  {
    id: 'OB-003',
    name: 'Rahul Verma',
    type: 'Employee',
    role: 'Senior ML Engineer',
    department: 'AI & Data Science',
    startDate: '2024-04-15',
    manager: 'Vikram Mehta',
    overallStatus: 'COMPLETED',
    notes: 'Onboarding completed with distinction. Currently core lead on ChromaDB indexing.',
    milestones: [
      { id: 'm1', label: 'Official Contract & Offer Letter Signed', status: 'COMPLETED' },
      { id: 'm2', label: 'Background Check & Compliance Clearance', status: 'COMPLETED' },
      { id: 'm3', label: 'Enterprise Cloud & Vector DB Credentials', status: 'COMPLETED' },
      { id: 'm4', label: 'Architecture Deep-Dive & Manager Sync', status: 'COMPLETED' },
      { id: 'm5', label: 'First Sprint PR Merged & Validated', status: 'COMPLETED' },
      { id: 'm6', label: 'Probation Confirmation Review', status: 'COMPLETED' }
    ]
  },
  {
    id: 'OB-004',
    name: 'Neha Kapoor',
    type: 'Employee',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    startDate: '2025-01-10',
    manager: 'Vikram Mehta',
    overallStatus: 'COMPLETED',
    notes: 'All access granted. Leads frontend design system and API sync.',
    milestones: [
      { id: 'm1', label: 'Official Contract & Offer Letter Signed', status: 'COMPLETED' },
      { id: 'm2', label: 'Background Check & Compliance Clearance', status: 'COMPLETED' },
      { id: 'm3', label: 'Dev Environment & Repository Setup', status: 'COMPLETED' },
      { id: 'm4', label: 'Manager 1-on-1 & Sprint Orientation', status: 'COMPLETED' },
      { id: 'm5', label: 'First Sprint PR Merged & Validated', status: 'COMPLETED' },
      { id: 'm6', label: 'Probation Confirmation Review', status: 'COMPLETED' }
    ]
  }
];

export function ManagerOnboardingProgress() {
  const { showToast } = useToast();
  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('ragnify_manager_onboarding_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_ONBOARDING_DATA;
  });

  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Employee' | 'Intern'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMilestoneModalOpen, setIsEditMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // New Candidate Form State
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    type: 'Intern',
    role: '',
    department: 'Engineering',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Save to localStorage whenever candidates state changes
  useEffect(() => {
    localStorage.setItem('ragnify_manager_onboarding_progress', JSON.stringify(candidates));
  }, [candidates]);

  // Toggle single milestone status
  const handleToggleMilestone = (candidateId, milestoneId) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;

      const nextMilestones = cand.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        const nextStatus = m.status === 'COMPLETED' ? 'PENDING' : m.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED';
        return { ...m, status: nextStatus };
      });

      // Recalculate overall status
      const completedCount = nextMilestones.filter(m => m.status === 'COMPLETED').length;
      let newOverall = 'IN_PROGRESS';
      if (completedCount === nextMilestones.length) newOverall = 'COMPLETED';
      else if (completedCount === 0) newOverall = 'PENDING';

      return {
        ...cand,
        milestones: nextMilestones,
        overallStatus: newOverall
      };
    }));

    showToast('Milestone status updated!', 'success');
  };

  // Add custom milestone to a candidate
  const handleAddMilestone = (candidateId) => {
    const label = prompt('Enter title for the new onboarding milestone:');
    if (!label || !label.trim()) return;

    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      const newM = {
        id: 'm_' + Date.now(),
        label: label.trim(),
        status: 'PENDING'
      };
      return {
        ...cand,
        milestones: [...cand.milestones, newM],
        overallStatus: 'IN_PROGRESS'
      };
    }));
    showToast('New milestone added successfully!', 'success');
  };

  // Delete milestone
  const handleDeleteMilestone = (candidateId, milestoneId) => {
    if (!window.confirm('Are you sure you want to remove this milestone?')) return;
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      return {
        ...cand,
        milestones: cand.milestones.filter(m => m.id !== milestoneId)
      };
    }));
    showToast('Milestone removed.', 'info');
  };

  // Update notes
  const handleUpdateNotes = (candidateId) => {
    const candidate = candidates.find(c => c.id === candidateId);
    const newNotes = prompt('Update manager notes/feedback for ' + candidate.name + ':', candidate.notes || '');
    if (newNotes === null) return;

    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, notes: newNotes } : c));
    showToast('Manager notes updated!', 'success');
  };

  // Add new candidate submit
  const handleAddCandidateSubmit = (e) => {
    e.preventDefault();
    if (!newCandidate.name.trim() || !newCandidate.role.trim()) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    const defaultSteps = newCandidate.type === 'Intern' ? [
      { id: 'm1', label: 'Offer Letter Signed & Accepted', status: 'COMPLETED' },
      { id: 'm2', label: 'Identity & Legal Documentation Verified', status: 'PENDING' },
      { id: 'm3', label: 'Workstation & IT Git Access Provisioned', status: 'PENDING' },
      { id: 'm4', label: 'Manager 1-on-1 & Sprint Orientation', status: 'PENDING' },
      { id: 'm5', label: 'Mid-Tenure Performance Review', status: 'PENDING' },
      { id: 'm6', label: 'Final Capstone Project Sign-off', status: 'PENDING' }
    ] : [
      { id: 'm1', label: 'Official Contract & Offer Letter Signed', status: 'COMPLETED' },
      { id: 'm2', label: 'Background Check & Compliance Clearance', status: 'PENDING' },
      { id: 'm3', label: 'Dev Environment & Access Credentials', status: 'PENDING' },
      { id: 'm4', label: 'Manager 1-on-1 & Sprint Orientation', status: 'PENDING' },
      { id: 'm5', label: 'First Sprint PR Merged & Validated', status: 'PENDING' },
      { id: 'm6', label: 'Probation Confirmation Review', status: 'PENDING' }
    ];

    const newlyCreated = {
      id: 'OB-' + String(Date.now()).slice(-4),
      name: newCandidate.name,
      type: newCandidate.type,
      role: newCandidate.role,
      department: newCandidate.department,
      startDate: newCandidate.startDate,
      manager: 'Vikram Mehta',
      overallStatus: 'IN_PROGRESS',
      notes: newCandidate.notes || 'Onboarding cycle initiated.',
      milestones: defaultSteps
    };

    setCandidates(prev => [newlyCreated, ...prev]);
    setIsAddModalOpen(false);
    setNewCandidate({
      name: '',
      type: 'Intern',
      role: '',
      department: 'Engineering',
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    showToast(`Added ${newlyCreated.name} to Onboarding Tracker!`, 'success');
  };

  // Remove candidate
  const handleRemoveCandidate = (candidateId, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from onboarding tracking?`)) return;
    setCandidates(prev => prev.filter(c => c.id !== candidateId));
    showToast(`Removed ${name} from onboarding records.`, 'info');
  };

  // Filtered list
  const filteredCandidates = candidates.filter(cand => {
    const matchesType = filterType === 'ALL' || cand.type === filterType;
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate Metrics
  const totalTracked = candidates.length;
  const activeCount = candidates.filter(c => c.overallStatus === 'IN_PROGRESS').length;
  const completedCount = candidates.filter(c => c.overallStatus === 'COMPLETED').length;

  return (
    <MainLayout title="Onboarding Progress">
      <div className="fade-in">
        <PageHeader
          title="Team Onboarding & Verification Progress"
          subtitle="Real-time verification states, milestone checklist management, and mentor sign-offs"
          actions={
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus size={12} /> Add Team Member to Onboard
            </button>
          }
        />

        {/* KPI Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <FaClock size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Active Onboarding</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{activeCount}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <FaCheckCircle size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fully Certified / Ready</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{completedCount}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <FaUserGraduate size={20} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Supervised</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalTracked}</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'Intern', 'Employee'].map(type => (
              <button
                key={type}
                className={`btn-secondary ${filterType === type ? 'active' : ''}`}
                style={{
                  fontSize: '0.8125rem',
                  padding: '6px 14px',
                  backgroundColor: filterType === type ? 'var(--primary-color, #2563eb)' : 'transparent',
                  color: filterType === type ? '#fff' : 'var(--text-secondary)',
                  borderColor: filterType === type ? 'var(--primary-color, #2563eb)' : 'var(--border-color)'
                }}
                onClick={() => setFilterType(type)}
              >
                {type === 'ALL' ? 'All Personnel' : `${type}s Only`}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, role, dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                backgroundColor: 'var(--bg-input, rgba(255,255,255,0.05))',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Candidate Onboarding Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredCandidates.map(cand => {
            const completedCount = cand.milestones.filter(m => m.status === 'COMPLETED').length;
            const progressPercent = Math.round((completedCount / cand.milestones.length) * 100);

            return (
              <div key={cand.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{cand.name}</span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '2px 8px', 
                          borderRadius: '12px',
                          backgroundColor: cand.type === 'Intern' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: cand.type === 'Intern' ? '#60a5fa' : '#34d399',
                          fontWeight: '600'
                        }}>
                          {cand.type}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                        {cand.role} • {cand.department}
                      </div>
                    </div>
                    <StatusBadge status={cand.overallStatus} />
                  </div>

                  {/* Progress Bar */}
                  <div style={{ margin: '14px 0 18px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      <span>Checklist Completion</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{progressPercent}% ({completedCount}/{cand.milestones.length})</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${progressPercent}%`, 
                          height: '100%', 
                          backgroundColor: progressPercent === 100 ? '#10b981' : '#3b82f6',
                          transition: 'width 0.4s ease'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Interactive Milestones Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                      Editable Milestones (Click to Toggle Status)
                    </div>

                    {cand.milestones.map((m) => {
                      const isDone = m.status === 'COMPLETED';
                      const isInProg = m.status === 'IN_PROGRESS';
                      return (
                        <div 
                          key={m.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            backgroundColor: isDone ? 'rgba(16, 185, 129, 0.06)' : isInProg ? 'rgba(245, 158, 11, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '6px',
                            border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.2)' : isInProg ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                          onClick={() => handleToggleMilestone(cand.id, m.id)}
                          title="Click to toggle: Pending -> In Progress -> Completed"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            <span>{isDone ? '✅' : isInProg ? '⏳' : '⚪'}</span>
                            <span style={{ textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.8 : 1 }}>
                              {m.label}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ 
                              fontSize: '0.6875rem', 
                              fontWeight: '700',
                              color: isDone ? '#10b981' : isInProg ? '#f59e0b' : 'var(--text-muted)'
                            }}>
                              {m.status}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMilestone(cand.id, m.id);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                              title="Delete milestone"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Notes / Remarks Section */}
                  <div style={{ 
                    padding: '10px 12px', 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px dashed var(--border-color)',
                    fontSize: '0.8rem',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaCommentDots size={11} /> Manager Remarks:
                      </span>
                      <button 
                        onClick={() => handleUpdateNotes(cand.id)}
                        style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FaEdit size={10} /> Edit Note
                      </button>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontStyle: cand.notes ? 'normal' : 'italic' }}>
                      {cand.notes || 'No remarks recorded yet.'}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleAddMilestone(cand.id)}
                  >
                    <FaPlus size={10} /> Add Milestone
                  </button>

                  <button
                    className="btn-action"
                    style={{ fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    onClick={() => handleRemoveCandidate(cand.id, cand.name)}
                    title="Remove from tracking"
                  >
                    <FaTrash size={10} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Add New Team Member */}
        {isAddModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Add Member to Onboarding Tracker</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleAddCandidateSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Sen"
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        Member Type
                      </label>
                      <select
                        value={newCandidate.type}
                        onChange={(e) => setNewCandidate({ ...newCandidate, type: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="Intern" style={{ background: '#1e293b' }}>Intern</option>
                        <option value="Employee" style={{ background: '#1e293b' }}>Full-time Employee</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        Department
                      </label>
                      <select
                        value={newCandidate.department}
                        onChange={(e) => setNewCandidate({ ...newCandidate, department: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="Engineering" style={{ background: '#1e293b' }}>Engineering</option>
                        <option value="AI & Data Science" style={{ background: '#1e293b' }}>AI & Data Science</option>
                        <option value="DevOps" style={{ background: '#1e293b' }}>DevOps</option>
                        <option value="Product & Design" style={{ background: '#1e293b' }}>Product & Design</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Designation / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cloud Infrastructure Intern"
                      value={newCandidate.role}
                      onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Initial Manager Remarks / Goals
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Needs immediate access to Kubernetes clusters."
                      value={newCandidate.notes}
                      onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Add to Tracker
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ManagerOnboardingProgress;

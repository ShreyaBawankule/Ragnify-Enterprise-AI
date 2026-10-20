import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/common/BrandLogo';
import { onboardingService } from '../../api/onboardingService';
import { useToast } from '../../context/ToastContext';
import { 
  FaCheckCircle, 
  FaArrowRight, 
  FaArrowLeft, 
  FaFileUpload,
  FaFilePdf,
  FaFileAlt,
  FaIdCard,
  FaUniversity,
  FaFileContract,
  FaImage,
  FaBriefcase,
  FaPhoneSquareAlt
} from 'react-icons/fa';
import '../../styles/auth.css';

// 8 Departments with ATS Target Keywords & Specific Employee Roles
export const DEPARTMENT_CONFIGS = [
  { 
    id: 'Engineering', 
    label: 'Engineering', 
    icon: '💻',
    roles: [
      'Senior Backend Engineer',
      'Full Stack Developer',
      'Lead Frontend Engineer',
      'Principal Software Architect'
    ],
    keywords: ['Python', 'JavaScript', 'React', 'FastAPI', 'SQL', 'Git']
  },
  { 
    id: 'AI & Data Science', 
    label: 'AI & Data Science', 
    icon: '🤖',
    roles: [
      'Senior ML Engineer',
      'Lead Data Scientist',
      'Deep Learning Specialist',
      'AI Systems Architect'
    ],
    keywords: ['Python', 'Machine Learning', 'PyTorch', 'Deep Learning', 'NLP', 'Pandas']
  },
  { 
    id: 'Product & Design', 
    label: 'Product & Design', 
    icon: '🎨',
    roles: [
      'Lead Product Designer (UI/UX)',
      'Principal UX Researcher',
      'Senior UI/UX Engineer',
      'Head of Design Systems'
    ],
    keywords: ['Figma', 'UI/UX', 'Wireframing', 'User Research', 'Prototyping', 'Design System']
  },
  { 
    id: 'Infrastructure', 
    label: 'Infrastructure / Cloud', 
    icon: '☁️',
    roles: [
      'DevOps Lead',
      'Cloud Infrastructure Architect',
      'Senior Site Reliability Engineer (SRE)',
      'Cybersecurity & Platform Lead'
    ],
    keywords: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform']
  },
  { 
    id: 'Finance & Accounts', 
    label: 'Finance & Accounts', 
    icon: '📈',
    roles: [
      'Senior Financial Analyst',
      'Lead Corporate Accountant',
      'Tax & Compliance Manager',
      'Financial Controller'
    ],
    keywords: ['Accounting', 'Financial Modeling', 'Budgeting', 'Auditing', 'Taxation', 'Excel']
  },
  { 
    id: 'Sales & Marketing', 
    label: 'Sales & Marketing', 
    icon: '🚀',
    roles: [
      'Growth Marketing Lead',
      'Senior SEO & Content Strategist',
      'Digital Campaign Manager',
      'Enterprise Sales Manager'
    ],
    keywords: ['SEO', 'Lead Generation', 'Digital Marketing', 'CRM', 'Content Strategy', 'Campaign Management']
  },
  { 
    id: 'HR & Admin', 
    label: 'HR & People Ops', 
    icon: '👥',
    roles: [
      'HR Operations Manager',
      'Senior Talent Acquisition Specialist',
      'People & Culture Business Partner',
      'HR Compliance Lead'
    ],
    keywords: ['Talent Acquisition', 'Onboarding', 'Payroll', 'Compliance', 'Employee Relations', 'HRIS']
  },
  { 
    id: 'QA & Testing', 
    label: 'QA & Testing', 
    icon: '🧪',
    roles: [
      'Lead QA Automation Engineer',
      'Senior SDET',
      'Quality Assurance Manager',
      'Performance & Security Test Lead'
    ],
    keywords: ['Test Automation', 'Selenium', 'API Testing', 'Bug Tracking', 'Manual Testing', 'Test Cases']
  }
];

export function EmployeeRegistration() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceYears: '3 Years',
    previousCompany: '',
    role: 'Senior Backend Engineer',
    department: 'Engineering',
    expectedJoiningDate: '',
    skills: '',
    declaration: false
  });

  // Essential Onboarding Documents for Full-Time Employees
  const [uploadedDocs, setUploadedDocs] = useState({
    resume: null,
    identity_proof: null,
    pan_proof: null,
    degree_certificate: null,
    previous_employment_docs: null
  });

  const documentSlots = [
    { key: 'resume', label: '1. Resume / CV', icon: FaFilePdf, accept: '.pdf,.docx', req: true },
    { key: 'identity_proof', label: '2. Identity Proof (Aadhaar / Passport)', icon: FaIdCard, accept: '.pdf,.jpg,.png', req: true },
    { key: 'pan_proof', label: '3. PAN Card Proof', icon: FaIdCard, accept: '.pdf,.jpg,.png', req: true },
    { key: 'degree_certificate', label: '4. Degree Certificate', icon: FaUniversity, accept: '.pdf', req: true },
    { key: 'previous_employment_docs', label: '5. Previous Employment Docs (Relieving/Payslips)', icon: FaBriefcase, accept: '.pdf', req: false }
  ];

  const activeDeptConfig = DEPARTMENT_CONFIGS.find(d => d.id === formData.department) || DEPARTMENT_CONFIGS[0];

  const handleDepartmentSelect = (deptId) => {
    const targetDept = DEPARTMENT_CONFIGS.find(d => d.id === deptId) || DEPARTMENT_CONFIGS[0];
    setFormData(prev => ({
      ...prev,
      department: targetDept.id,
      role: targetDept.roles[0] || prev.role
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDocChange = (key, file) => {
    setUploadedDocs(prev => ({
      ...prev,
      [key]: file || null
    }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone)) {
      showToast('Please fill all required personal details.', 'error');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.declaration) {
      showToast('Please accept the declaration statement.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('applicantName', `${formData.firstName} ${formData.lastName}`.trim());
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('type', 'Employee');
      payload.append('role', formData.role);
      payload.append('department', formData.department);
      payload.append('experienceYears', formData.experienceYears || '0');
      payload.append('previousEmployer', formData.previousCompany || '');
      payload.append('skills', formData.skills || '');

      let count = 0;
      Object.entries(uploadedDocs).forEach(([key, fileObj]) => {
        if (fileObj && fileObj instanceof File) {
          payload.append(`file_${key}`, fileObj, fileObj.name);
          count++;
        }
      });

      const response = await onboardingService.submitApplication(payload);
      setSubmittedData(response);
      showToast(`Employee registration with ${count} uploaded document(s) submitted!`, 'success');
    } catch (err) {
      showToast('Submission error. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedData) {
    return (
      <div className="auth-container fade-in">
        <div className="auth-card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-success-subtle)',
            color: 'var(--status-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 20px auto'
          }}>
            <FaCheckCircle />
          </div>

          <h1 className="auth-title">Registration Submitted!</h1>
          <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
            Your employee profile and submitted compliance documents are under HR verification.
          </p>

          <div style={{
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            padding: '20px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-sm">Registration ID:</span>
              <span style={{ fontWeight: '700', color: 'var(--brand-primary)' }}>{submittedData.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-sm">Submission Date:</span>
              <span style={{ fontWeight: '600' }}>{submittedData.submissionDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-sm">Compliance Documents:</span>
              <span className="badge badge-pending">DOCUMENTS UPLOADED</span>
            </div>
          </div>

          <button onClick={() => navigate('/')} className="btn-primary" style={{ width: '100%' }}>
            Return to Welcome Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container fade-in">
      <div className="auth-card auth-card-wide" style={{ maxWidth: '780px' }}>
        <div className="auth-header-block">
          <div className="auth-brand-badge">
            <BrandLogo to="/" />
          </div>
          <h1 className="auth-title">Employee Registration & Onboarding</h1>
          <p className="auth-subtitle">
            Submit your profile details and core compliance documents
          </p>
        </div>

        <div className="stepper-header-bar">
          <div className={`step-node ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            <div className="step-number-circle">1</div>
            <span className="step-label-text">Contact Info</span>
          </div>
          <div className={`step-node ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            <div className="step-number-circle">2</div>
            <span className="step-label-text">Experience</span>
          </div>
          <div className={`step-node ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
            <div className="step-number-circle">3</div>
            <span className="step-label-text">Documents (5)</span>
          </div>
          <div className={`step-node ${step === 4 ? 'active' : ''}`}>
            <div className="step-number-circle">4</div>
            <span className="step-label-text">Declaration</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Contact Info */}
          {step === 1 && (
            <div className="fade-in">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Verma"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    className="form-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul.v@company.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    className="form-input"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Role & Experience */}
          {step === 2 && (
            <div className="fade-in">
              {/* Department Slicer */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: '700' }}>
                    Department Slicer <span className="required">*</span>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: '600' }}>
                    Select department to filter roles & view target ATS keywords
                  </span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '8px'
                }}>
                  {DEPARTMENT_CONFIGS.map(dept => {
                    const isSelected = formData.department === dept.id;
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleDepartmentSelect(dept.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)',
                          backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-surface-subtle)',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                          fontWeight: isSelected ? '700' : '500',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{dept.icon}</span>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {dept.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ATS Target Keywords Callout for Sliced Department */}
              {activeDeptConfig && (
                <div style={{
                  padding: '12px 14px',
                  marginBottom: '18px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.06)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#2563eb', marginBottom: '6px' }}>
                    <span>🎯</span>
                    <span>ATS Matching Keywords for {activeDeptConfig.label} (6 Core Competencies):</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                    {activeDeptConfig.keywords.map(kw => (
                      <span key={kw} style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: '600',
                        fontSize: '0.75rem',
                        border: '1px solid #bfdbfe'
                      }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                    💡 Tip: Include these keywords in your uploaded resume to achieve a high ATS match score (≥70%) during HR screening.
                  </div>
                </div>
              )}

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Target Role <span className="required">*</span></label>
                  <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                    {(activeDeptConfig?.roles || []).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Selected Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.department}
                    readOnly
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Total Experience</label>
                  <input
                    type="text"
                    className="form-input"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g. 3.5 Years"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Previous Employer</label>
                  <input
                    type="text"
                    className="form-input"
                    name="previousCompany"
                    value={formData.previousCompany}
                    onChange={handleChange}
                    placeholder="e.g. Tech Systems Ltd"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Technical Skills</label>
                <input
                  type="text"
                  className="form-input"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. Python, FastAPI, Docker, PostgreSQL"
                />
              </div>
            </div>
          )}

          {/* Step 3: All 11 Compliance Documents */}
          {step === 3 && (
            <div className="fade-in">
              <div style={{ marginBottom: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Please upload your essential identification, academic, and employment credentials:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                {documentSlots.map((doc) => {
                  const Icon = doc.icon;
                  const isUploaded = !!uploadedDocs[doc.key];
                  return (
                    <div 
                      key={doc.key} 
                      style={{
                        padding: '10px 14px',
                        backgroundColor: isUploaded ? 'var(--status-success-subtle)' : 'var(--bg-surface-subtle)',
                        border: `1px solid ${isUploaded ? 'var(--status-success)' : 'var(--border-default)'}`,
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Icon style={{ color: isUploaded ? 'var(--status-success)' : 'var(--brand-primary)', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {doc.label} {doc.req && <span style={{ color: 'red' }}>*</span>}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {uploadedDocs[doc.key] ? (uploadedDocs[doc.key].name || uploadedDocs[doc.key]) : 'Not attached yet'}
                          </div>
                        </div>
                      </div>

                      <label className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0, margin: 0 }}>
                        <FaFileUpload size={10} />
                        <span>{isUploaded ? 'Change' : 'Upload'}</span>
                        <input
                          type="file"
                          accept={doc.accept}
                          style={{ display: 'none' }}
                          onChange={(e) => handleDocChange(doc.key, e.target.files[0])}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Review & Declaration */}
          {step === 4 && (
            <div className="fade-in">
              <div style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                marginBottom: '20px',
                border: '1px solid var(--border-default)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8125rem' }}>
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Department:</strong> {formData.department}</div>
                  <div><strong>Role:</strong> {formData.role}</div>
                  <div><strong>Experience:</strong> {formData.experienceYears}</div>
                  <div><strong>Documents Attached:</strong> {Object.values(uploadedDocs).filter(Boolean).length} of {documentSlots.length} files</div>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleChange}
                    style={{ marginTop: '3px', accentColor: 'var(--brand-primary)' }}
                    required
                  />
                  <span>
                    I confirm that the personal details, experience credentials, and uploaded compliance documents are authentic and submitted for official onboarding verification.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-default)' }}>
            {step > 1 ? (
              <button type="button" onClick={handlePrev} className="btn-secondary">
                <FaArrowLeft size={12} /> Previous
              </button>
            ) : (
              <button type="button" onClick={() => navigate('/new-user')} className="btn-secondary">
                <FaArrowLeft size={12} /> Cancel
              </button>
            )}

            {step < 4 ? (
              <button type="button" onClick={handleNext} className="btn-primary">
                Continue <FaArrowRight size={12} />
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Employee Registration'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeRegistration;

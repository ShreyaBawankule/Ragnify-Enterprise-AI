/* ============================================================
   RAGNIFY TENURE & WORKING HOURS MOCK DATA
   Strict Workforce Roster: 26 Employees + 12 Interns = 38 Total
============================================================ */

const rawWorkforce = [
  // 26 Full-time Employees
  { id: 'EMP-101', name: 'Rahul Verma', type: 'Employee', role: 'Senior ML Engineer', dept: 'AI & Data Science', date: '2024-03-15', days: 940, prog: 86, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-102', name: 'Neha Kapoor', type: 'Employee', role: 'Full Stack Developer', dept: 'Engineering', date: '2024-05-01', days: 890, prog: 81, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-103', name: 'Arjun Nair', type: 'Employee', role: 'Product Designer', dept: 'Product & Design', date: '2024-06-15', days: 845, prog: 77, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-104', name: 'Siddharth Sen', type: 'Employee', role: 'DevOps & Cloud Engineer', dept: 'Infrastructure', date: '2024-01-10', days: 1000, prog: 91, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-105', name: 'Sneha Reddy', type: 'Employee', role: 'Backend Architect', dept: 'Engineering', date: '2023-11-20', days: 1050, prog: 96, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-106', name: 'Karan Malhotra', type: 'Employee', role: 'Frontend Lead', dept: 'Engineering', date: '2024-02-01', days: 980, prog: 89, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-107', name: 'Pooja Nair', type: 'Employee', role: 'Data Engineer', dept: 'AI & Data Science', date: '2024-07-01', days: 830, prog: 76, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-108', name: 'Aditya Joshi', type: 'Employee', role: 'QA Automation Lead', dept: 'Engineering', date: '2024-04-15', days: 905, prog: 83, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-109', name: 'Meera Iyer', type: 'Employee', role: 'Security Analyst', dept: 'Security & Compliance', date: '2024-08-10', days: 790, prog: 72, milestone: '2-Year Service Award' },
  { id: 'EMP-110', name: 'Devansh Jain', type: 'Employee', role: 'System Reliability Engineer', dept: 'Infrastructure', date: '2024-03-01', days: 955, prog: 87, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-111', name: 'Vikram Singh', type: 'Employee', role: 'ML Ops Specialist', dept: 'AI & Data Science', date: '2024-09-01', days: 770, prog: 70, milestone: '2-Year Service Award' },
  { id: 'EMP-112', name: 'Nisha Kapoor', type: 'Employee', role: 'Scrum Master', dept: 'Product & Design', date: '2024-05-15', days: 875, prog: 80, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-113', name: 'Amit Sharma', type: 'Employee', role: 'Solutions Architect', dept: 'Engineering', date: '2023-10-01', days: 1100, prog: 100, milestone: 'Leadership Milestone' },
  { id: 'EMP-114', name: 'Rohan Nair', type: 'Employee', role: 'Senior Python Engineer', dept: 'Engineering', date: '2024-04-10', days: 910, prog: 83, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-115', name: 'Divya Sharma', type: 'Employee', role: 'UI/UX Researcher', dept: 'Product & Design', date: '2024-06-01', days: 860, prog: 79, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-116', name: 'Kavita Menon', type: 'Employee', role: 'Database Administrator', dept: 'Infrastructure', date: '2024-02-15', days: 965, prog: 88, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-117', name: 'Sanjay Kumar', type: 'Employee', role: 'Platform Engineer', dept: 'Infrastructure', date: '2024-07-20', days: 810, prog: 74, milestone: '2-Year Service Award' },
  { id: 'EMP-118', name: 'Priya Sharma', type: 'Employee', role: 'HR Operations Lead', dept: 'Human Resources', date: '2023-08-01', days: 1160, prog: 100, milestone: 'Leadership Milestone' },
  { id: 'EMP-119', name: 'Vikram Mehta', type: 'Employee', role: 'Director of Engineering', dept: 'Engineering', date: '2023-05-15', days: 1240, prog: 100, milestone: 'Executive Leadership' },
  { id: 'EMP-120', name: 'Karthik Reddy', type: 'Employee', role: 'Distributed Systems Engineer', dept: 'Engineering', date: '2024-08-01', days: 800, prog: 73, milestone: '2-Year Service Award' },
  { id: 'EMP-121', name: 'Aarav Patel', type: 'Employee', role: 'Cloud Security Architect', dept: 'Security & Compliance', date: '2024-03-20', days: 935, prog: 85, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-122', name: 'Divya Krishnan', type: 'Employee', role: 'NLP Research Scientist', dept: 'AI & Data Science', date: '2024-05-10', days: 885, prog: 81, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-123', name: 'Siddharth Joshi', type: 'Employee', role: 'Frontend Engineer', dept: 'Engineering', date: '2024-09-15', days: 755, prog: 69, milestone: '2-Year Service Award' },
  { id: 'EMP-124', name: 'Pooja Verma', type: 'Employee', role: 'Product Marketing Manager', dept: 'Product & Design', date: '2024-07-15', days: 815, prog: 74, milestone: '2-Year Service Award' },
  { id: 'EMP-125', name: 'Tarun Saxena', type: 'Employee', role: 'Full Stack Engineer', dept: 'Engineering', date: '2024-04-01', days: 920, prog: 84, milestone: '3-Year Veteran Milestone' },
  { id: 'EMP-126', name: 'Rashmi Deshmukh', type: 'Employee', role: 'Compliance Officer', dept: 'Human Resources', date: '2024-06-25', days: 835, prog: 76, milestone: '2-Year Service Award' },

  // 12 Active Interns (92-Day Cohort)
  { id: 'INT-201', name: 'Ananya Roy', type: 'Intern', role: 'Frontend Development Intern', dept: 'Engineering', date: '2026-08-01', days: 68, prog: 74, milestone: 'Stage-3 Certificate Clearance' },
  { id: 'INT-202', name: 'Rohan Gupta', type: 'Intern', role: 'AI Research Intern', dept: 'AI & Data Science', date: '2026-08-15', days: 54, prog: 58, milestone: 'Mid-Term Evaluation' },
  { id: 'INT-203', name: 'Tanvi Deshmukh', type: 'Intern', role: 'UI/UX Design Intern', dept: 'Product & Design', date: '2026-08-01', days: 68, prog: 74, milestone: 'Stage-3 Certificate Clearance' },
  { id: 'INT-204', name: 'Ishita Sharma', type: 'Intern', role: 'Machine Learning Intern', dept: 'AI & Data Science', date: '2026-09-01', days: 38, prog: 41, milestone: 'Mid-Term Evaluation' },
  { id: 'INT-205', name: 'Varun Joshi', type: 'Intern', role: 'Backend Python Intern', dept: 'Engineering', date: '2026-08-10', days: 59, prog: 64, milestone: 'Mid-Term Evaluation' },
  { id: 'INT-206', name: 'Shreya Patel', type: 'Intern', role: 'Data Analytics Intern', dept: 'AI & Data Science', date: '2026-08-01', days: 68, prog: 74, milestone: 'Stage-3 Certificate Clearance' },
  { id: 'INT-207', name: 'Aman Mehra', type: 'Intern', role: 'Cloud Infrastructure Intern', dept: 'Infrastructure', date: '2026-09-10', days: 29, prog: 31, milestone: '1st Month Alignment' },
  { id: 'INT-208', name: 'Kritika Sen', type: 'Intern', role: 'Product Operations Intern', dept: 'Product & Design', date: '2026-08-20', days: 49, prog: 53, milestone: 'Mid-Term Evaluation' },
  { id: 'INT-209', name: 'Harsh Vardhan', type: 'Intern', role: 'QA & Testing Intern', dept: 'Engineering', date: '2026-08-01', days: 68, prog: 74, milestone: 'Stage-3 Certificate Clearance' },
  { id: 'INT-210', name: 'Riya Sengupta', type: 'Intern', role: 'HR & People Ops Intern', dept: 'Human Resources', date: '2026-08-15', days: 54, prog: 58, milestone: 'Mid-Term Evaluation' },
  { id: 'INT-211', name: 'Sameer Kulkarni', type: 'Intern', role: 'DevOps Intern', dept: 'Infrastructure', date: '2026-09-01', days: 38, prog: 41, milestone: 'Mid-Term Evaluation' },
  { id: 'INT-212', name: 'Priyanka Ghosh', type: 'Intern', role: 'Cybersecurity Intern', dept: 'Security & Compliance', date: '2026-08-01', days: 68, prog: 74, milestone: 'Stage-3 Certificate Clearance' }
];

export const MOCK_TENURE = rawWorkforce.map(w => {
  const isIntern = w.type === 'Intern';
  const totalDays = isIntern ? 92 : 1095;
  const remDays = Math.max(0, totalDays - w.days);
  return {
    id: `TEN-${w.id}`,
    candidate_id: w.id,
    candidateName: w.name,
    name: w.name,
    email: `${w.name.toLowerCase().replace(/\s+/g, '.')}@ragnify.com`,
    type: w.type,
    role: w.role,
    department: w.dept,
    startDate: w.date,
    endDate: isIntern ? '2026-10-31' : 'Permanent',
    duration: isIntern ? '3 Months (92 Days)' : `${(w.days / 365.25).toFixed(1)} Years Active`,
    activeDays: w.days,
    daysCompleted: w.days,
    daysRemaining: remDays,
    totalDays: totalDays,
    progress: w.prog,
    status: isIntern ? 'ACTIVE' : 'CONFIRMED',
    probationStatus: isIntern ? 'Active Term (92 Days)' : 'Confirmed Full-Time',
    nextMilestone: w.milestone
  };
});

export const MOCK_WORKING_HOURS = rawWorkforce.slice(0, 16).map((w, idx) => ({
  id: `WH-70${idx + 1}`,
  candidate_id: w.id,
  candidateName: w.name,
  name: w.name,
  type: w.type,
  department: w.dept,
  date: '2026-10-17',
  clockIn: idx % 2 === 0 ? '09:15 AM' : '09:30 AM',
  clockOut: idx < 12 ? (idx % 2 === 0 ? '06:15 PM' : '06:30 PM') : '--:--',
  totalHours: idx < 12 ? (idx % 2 === 0 ? '8.75 hrs' : '8.50 hrs') : 'In Progress',
  status: idx < 12 ? 'COMPLETED' : 'IN_PROGRESS'
}));

export default MOCK_TENURE;

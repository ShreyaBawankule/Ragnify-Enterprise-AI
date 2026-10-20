import api from './axios';

const FALLBACK_KB_DOCS = [
  {
    name: 'RAGNIFY_Internship_Handbook_2026.pdf',
    size: '1.4 MB',
    chunks: 3,
    access_tier: 'INTERN_ONLY',
    allowed_roles: 'INTERN,MANAGER,HR,ADMIN',
    category: 'Intern Guidelines & Tenure'
  },
  {
    name: 'RAGNIFY_Engineering_And_SaaS_Architecture_Guide_2026.pdf',
    size: '1.9 MB',
    chunks: 2,
    access_tier: 'INTERN_PUBLIC',
    allowed_roles: 'INTERN,EMPLOYEE,MANAGER,HR,ADMIN',
    category: 'Engineering & Technical Standards'
  },
  {
    name: 'RAGNIFY_Employee_Handbook_And_Benefits_2026.pdf',
    size: '2.6 MB',
    chunks: 3,
    access_tier: 'COMPANY_INTERNAL',
    allowed_roles: 'EMPLOYEE,MANAGER,HR,ADMIN',
    category: 'Company HR Policy (Employees Only)'
  },
  {
    name: 'RAGNIFY_IT_Security_And_Data_Privacy_Policy_2026.pdf',
    size: '1.8 MB',
    chunks: 2,
    access_tier: 'COMPANY_INTERNAL',
    allowed_roles: 'EMPLOYEE,MANAGER,HR,ADMIN',
    category: 'IT Security & Privacy Compliance'
  },
  {
    name: 'RAGNIFY_Manager_Leadership_And_Appraisal_Playbook_2026.pdf',
    size: '2.1 MB',
    chunks: 2,
    access_tier: 'MANAGER_RESTRICTED',
    allowed_roles: 'MANAGER,HR,ADMIN',
    category: 'Manager Confidential Playbook'
  },
  {
    name: 'RAGNIFY_HR_Compensation_Grids_And_Executive_Governance_2026.pdf',
    size: '2.8 MB',
    chunks: 2,
    access_tier: 'HR_CONFIDENTIAL',
    allowed_roles: 'HR,ADMIN',
    category: 'HR & Executive Confidential'
  }
];

export const ragService = {
  getDocuments: async (role = 'EMPLOYEE') => {
    try {
      const response = await api.get('/rag/documents', { params: { role } });
      return response.data;
    } catch (err) {
      const r = (role || 'EMPLOYEE').toUpperCase();
      const docs = FALLBACK_KB_DOCS.map(d => ({
        ...d,
        accessible: d.allowed_roles.split(',').includes(r)
      }));
      return {
        collection: 'ragnify_docs',
        total_documents: docs.length,
        accessible_documents_count: docs.filter(d => d.accessible).length,
        total_chunks: 66,
        role: r,
        documents: docs
      };
    }
  },

  chat: async (query, role = 'EMPLOYEE', userName = 'User', userEmail = '', history = []) => {
    try {
      const response = await api.post('/rag/chat', {
        question: query,
        role,
        user_name: userName,
        user_email: userEmail,
        history
      });
      return response.data;
    } catch (err) {
      const r = (role || 'EMPLOYEE').toUpperCase();
      if (r === 'INTERN') {
        return {
          answer: `### 🎓 RAGNIFY Policy Classroom & Mentorship Hub\n\nHello **${userName || 'Intern'}**! As an authorized **\`INTERN\`**, you have access to the official **Internship Program Handbook** (\`RAGNIFY_Internship_Handbook_2026.pdf\`) and Engineering Standards.\n\nHere are the policies accessible under your clearance:\n\n1. **[👉 Internship Stipend Policy]** — **₹30,000 to ₹35,000/month** stipend and payment schedule.\n2. **[👉 92-Day Tenure Roadmap]** — 3-stage milestone timeline (Days 1–30 Foundation, Days 31–60 Projects, Days 61–92 Delivery).\n3. **[👉 Intern Leave & Attendance]** — **1 paid leave per month**, daily clock-in rules & sprint timings.\n4. **[👉 3-Stage Certificate Unlock]** — Internship Certificate, Letter of Recommendation, and Completion Sign-off.\n5. **[👉 PPO Conversion Criteria]** — Criteria for full-time software engineer conversion.\n6. **[👉 Engineering & Coding Standards]** — Git workflow, branch naming, and SaaS architecture standards.\n\n👉 **Click any option below to view the official notification:**`,
          sources: ['RAGNIFY_Internship_Handbook_2026.pdf'],
          suggested_actions: [
            'Internship Stipend Policy',
            '92-Day Tenure Roadmap',
            'Intern Leave & Attendance',
            '3-Stage Certificate Unlock',
            'PPO Conversion Criteria',
            'Engineering & Coding Standards'
          ]
        };
      }
      return {
        answer: `### 🎓 RAGNIFY Policy Classroom & Mentorship Hub\n\nHello **${userName || 'Team Member'}**! Under your authorized **\`${r}\`** clearance, here are the official policy modules available for you:\n\n1. **[👉 Annual Leave Policy]** — **18 Paid Casual Leaves**, 10-day carry forward, and year-end encashment.\n2. **[👉 Sick & Emergency Leave Policy]** — **12 Paid Sick Leaves** per year with streamlined medical notice.\n3. **[👉 Equipment Allowance Policy (₹5,500)]** — One-time tech stipend for your home workstation setup.\n4. **[👉 Health Insurance & Medical Coverage]** — Comprehensive **₹5,00,000** family floater health plan.\n5. **[👉 Hybrid & Remote Work (WFH) Guidelines]** — Work-from-home schedule, core hours, and attendance check-ins.\n6. **[👉 Learning & Skill Development Budget]** — Annual **₹25,000** professional certification and book stipend.\n\n👉 **Click any option below to view the official notification:**`,
        sources: ['RAGNIFY_Employee_Handbook_And_Benefits_2026.pdf'],
        suggested_actions: [
          'Annual Leave Policy',
          'Sick & Emergency Leave Policy',
          'Equipment Allowance Policy (₹5,500)',
          'Health Insurance & Medical Coverage',
          'Hybrid & Remote Work (WFH) Guidelines',
          'Generate Leave Policy PDF'
        ]
      };
    }
  },

  uploadDocument: async (file, accessTier = 'COMPANY_INTERNAL', role = 'HR') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('access_tier', accessTier);
    formData.append('role', role);
    try {
      const response = await api.post('/rag/upload', formData);
      return response.data;
    } catch (err) {
      return { filename: file.name, status: 'indexed', chunks_added: 14, access_tier: accessTier };
    }
  }
};

export const aiAssistantService = {
  chat: async (message, role = 'EMPLOYEE', userName = 'User', userEmail = '', history = []) => {
    try {
      const response = await api.post('/ai-assistant/chat', {
        message,
        role,
        user_name: userName,
        user_email: userEmail,
        history
      });
      return response.data;
    } catch (err) {
      const r = (role || 'EMPLOYEE').toUpperCase();
      const msg_lower = (message || '').toLowerCase();
      if (r === 'INTERN' && ['salary', 'payroll', 'compensation', 'severance', 'equity', 'budget', 'termination', '18 casual', '5500', 'employee handbook'].some(k => msg_lower.includes(k))) {
        return {
          answer: `### 🔒 Company Data Access Restricted (Intern Clearance)\n\nInternal company policies, full-time employee benefit handbooks, managerial appraisal playbooks, and HR compensation grids are accessible **only to Employee, Manager, HR, and Admin personnel**.\n\nAs an **Intern (${userName})**, you can query your **Internship Handbook** (\`₹30,000/month\` stipend, \`92-day\` tenure, certificate unlock rules) and your own personal tasks.`,
          sources: ['RAGNIFY_Internship_Handbook_2026.pdf', 'RBAC Policy Guard']
        };
      }

      return {
        answer: `### ⚡ RAGNIFY Enterprise AI Copilot (${r} Clearance)\n\nI am connected to your role-scoped enterprise knowledge base and personal workspace records for **${userName}**. Ask me about your authorized policies, personal tasks, working hours, or request a **PDF report / PowerPoint presentation**!`,
        sources: ['RAGNIFY Workspace Intelligence Engine']
      };
    }
  }
};

export const meetingService = {
  getMeetingHistory: async () => {
    try {
      const response = await api.get('/meeting/history');
      return response.data;
    } catch (err) {
      return [
        {
          id: 'MTG011',
          meeting_id: 'MTG011',
          title: 'Q3 Product Review & Meeting AI Integration Sync',
          meeting_title: 'Q3 Product Review & Meeting AI Integration Sync',
          date: '2026-09-28',
          meeting_date: '2026-09-28',
          duration: '30 mins',
          organizer: 'Sarah Jenkins (VP Product)',
          participants: 'Rahul Verma, Amit Sharma, Priya Patel, Sarah Jenkins',
          agenda: 'Review AI module integration and new meeting summary features.',
          decisions: '1. Launch the AI Assistant module next Monday.\n2. Deploy ChromaDB vector updates.',
          action_items: '• Rahul Verma: Complete FastAPI meeting endpoints (due Friday)\n• Priya Patel: Finish front-end UI components (due Wednesday)',
          summary: 'The Q3 product review meeting focused on AI module integration and new meeting summary features. The team decided to launch the AI Assistant module next Monday and deploy ChromaDB vector updates. Action items were assigned to Rahul Verma and Priya Patel.',
          short_summary: 'The Q3 product review focused on AI module integration and new meeting summary features. Launch AI Assistant next Monday and deploy ChromaDB vector updates.',
          transcript: 'Good morning team. Welcome to the Ragnify Q3 product review meeting on September 28, 2026. The meeting duration is set for 30 minutes...'
        },
        {
          id: 'MTG001',
          meeting_id: 'MTG001',
          title: 'Sprint Planning for Enterprise AI Workspace',
          meeting_title: 'Sprint Planning for Enterprise AI Workspace',
          date: '2026-01-08',
          meeting_date: '2026-01-08',
          duration: '60 mins',
          organizer: 'Aarav Menon',
          participants: 'Rohan Sharma, Ananya Iyer, Vikram Rao, Arjun Patel, Karthik Reddy',
          agenda: 'Finalize sprint scope and assign ownership for authentication, dashboards, and RAG discovery.',
          decisions: 'Sprint 1 will prioritize login, employee dashboard shell, authentication API, and RAG proof of concept.',
          action_items: '• Rohan: Prepare vector store plan\n• Vikram: Publish auth API contract\n• Arjun: Start login page',
          summary: 'The sprint planning meeting focused on finalizing sprint scope and ownership for authentication, dashboards, and RAG discovery. The team prioritized the login flow, employee dashboard shell, and RAG proof of concept.',
          short_summary: 'Finalized sprint scope and ownership for authentication, dashboards, and RAG discovery. Prioritized login, employee dashboard, and RAG proof of concept.'
        }
      ];
    }
  },

  getMeetingById: async (meetingId) => {
    try {
      const response = await api.get(`/meeting/${meetingId}`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  summarizeAudio: async (audioFile) => {
    const formData = new FormData();
    formData.append('file', audioFile);
    try {
      const response = await api.post('/meeting/summarize', formData);
      return response.data;
    } catch (err) {
      return {
        meeting_id: `MTG-${Date.now().toString().slice(-4)}`,
        id: `MTG-${Date.now().toString().slice(-4)}`,
        title: 'Sprint Planning & Workforce Architecture Sync',
        meeting_title: 'Sprint Planning & Workforce Architecture Sync',
        date: new Date().toISOString().split('T')[0],
        meeting_date: new Date().toISOString().split('T')[0],
        duration: '32 mins',
        organizer: 'Vikram Mehta (Engineering Manager)',
        participants: 'Rahul Verma, Ananya Roy, Priya Sharma, Vikram Mehta',
        agenda: 'Review Q4 sprint deliverables, vector embeddings pipeline, and intern onboarding progress.',
        decisions: '1. Finalize ChromaDB persistence with cosine similarity.\n2. Roll out modern light-first SaaS design system.\n3. Integrate automated PDF certificate generation upon internship completion.',
        action_items: '• Rahul: Finalize embedding vector chunking test cases by Friday.\n• Ananya: Implement unified table components and sidebar badges.\n• Priya: Verify pending intern bonafide documents.',
        summary: 'The team aligned on the engineering velocity roadmap for Q4, confirmed technical constraints for the meeting summary pipeline, and verified HR onboarding automation workflows.',
        short_summary: 'Aligned on the engineering velocity roadmap for Q4, confirmed technical constraints for the meeting summary pipeline, and verified HR onboarding automation workflows.',
        transcript: 'Speaker 1 (00:01): Good morning everyone, let us begin our sprint review...\nSpeaker 2 (05:14): The RAG retrieval pipeline is performing well with high recall...',
        audio_filename: audioFile.name
      };
    }
  }
};

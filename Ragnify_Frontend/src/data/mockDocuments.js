/* ============================================================
   RAGNIFY DOCUMENTS REPOSITORY DATA
   Strict Role-Based Document Sets:
   - Intern: 5 documents (Resume, Aadhaar, PAN, Offer Letter, Internship Certificate)
   - Employee: 6 documents (Resume, Aadhaar, PAN, Degree Certificate, Previous Employment Docs, Offer Letter)
============================================================ */

export const INTERN_DOC_TYPES = [
  { name: 'Resume / CV', type: 'Resume / CV', fileNameSuffix: 'Resume.pdf', category: 'Career Profile', size: '1.2 MB' },
  { name: 'Identity Proof (Aadhaar)', type: 'Identity Proof (Aadhaar)', fileNameSuffix: 'Identity_Proof.pdf', category: 'Identity & KYC', size: '1.4 MB' },
  { name: 'PAN Card Proof', type: 'PAN Card Proof', fileNameSuffix: 'PAN_Proof.pdf', category: 'Tax & Compliance', size: '680 KB' },
  { name: 'Offer Letter', type: 'Offer Letter', fileNameSuffix: 'Offer_Letter.pdf', category: 'Corporate & Tenure', size: '1.8 MB' },
  { name: 'Internship Certificate', type: 'Internship Certificate', fileNameSuffix: 'Internship_Certificate.pdf', category: 'Academic & Credentials', size: '2.1 MB' }
];

export const EMPLOYEE_DOC_TYPES = [
  { name: 'Resume / CV', type: 'Resume / CV', fileNameSuffix: 'Resume.pdf', category: 'Career Profile', size: '1.2 MB' },
  { name: 'Identity Proof (Aadhaar)', type: 'Identity Proof (Aadhaar)', fileNameSuffix: 'Identity_Proof.pdf', category: 'Identity & KYC', size: '1.4 MB' },
  { name: 'PAN Card Proof', type: 'PAN Card Proof', fileNameSuffix: 'PAN_Proof.pdf', category: 'Tax & Compliance', size: '680 KB' },
  { name: 'Degree Certificate', type: 'Degree Certificate', fileNameSuffix: 'Degree_Certificate.pdf', category: 'Academic & Credentials', size: '2.4 MB' },
  { name: 'Previous Employment Documents', type: 'Previous Employment Documents', fileNameSuffix: 'Previous_Employment_Docs.pdf', category: 'Corporate & Tenure', size: '4.2 MB' },
  { name: 'Offer Letter', type: 'Offer Letter', fileNameSuffix: 'Offer_Letter.pdf', category: 'Corporate & Tenure', size: '1.8 MB' }
];

const candidates = [
  { id: 'CAND-001', name: 'Rahul Verma', email: 'employee@ragnify.com', type: 'Employee', dept: 'AI & Data Science', date: '2024-03-15' },
  { id: 'INT-201', name: 'Ananya Roy', email: 'intern@ragnify.com', type: 'Intern', dept: 'Frontend Engineering', date: '2026-08-01' },
  { id: 'CAND-002', name: 'Ishita Sharma', email: 'ishita.s@ragnify.com', type: 'Intern', dept: 'AI & Data Science', date: '2026-09-01' },
  { id: 'CAND-003', name: 'Rohan Nair', email: 'rohan.n@ragnify.com', type: 'Employee', dept: 'Engineering', date: '2024-04-10' }
];

export const MOCK_DOCUMENTS = candidates.flatMap((c, cIdx) => {
  const docTypes = c.type === 'Intern' ? INTERN_DOC_TYPES : EMPLOYEE_DOC_TYPES;
  return docTypes.map((doc, dIdx) => {
    const fName = `${c.id}_${doc.fileNameSuffix}`;
    return {
      id: `DOC-${c.id}-${String(dIdx + 1).padStart(2, '0')}`,
      candidateId: c.id,
      candidateName: c.name,
      candidateEmail: c.email,
      type: c.type,
      department: c.dept,
      documentType: doc.type,
      name: doc.name,
      label: doc.name,
      fileName: fName,
      fileUrl: `/documents/view/${fName}`,
      category: doc.category,
      size: doc.size,
      fileSize: doc.size,
      status: 'VERIFIED',
      date: c.date,
      uploadedDate: c.date,
      verifiedBy: 'Priya Sharma (HR)',
      remarks: 'Document cryptographically verified by RAGNIFY HR Operations.'
    };
  });
});

export default MOCK_DOCUMENTS;

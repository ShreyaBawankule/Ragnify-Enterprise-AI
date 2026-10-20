---
document_id: HR-002
title: Leave Policy
category: HR
department: Human Resources
author: HR Director
version: 2.4
last_updated: 2026-05-15
keywords: leave, pto, sick leave, maternity, vacation
tags: [pto, vacation]
related_documents: [HR-001, HR-005, HR-018]
summary: This document outlines policies, standard guidelines, tables, and troubleshooting steps related to leave at Aethera Software Solutions.
---

# Leave Policy

Welcome to the official documentation for **Leave Policy** (Document ID: **HR-002**). At Aethera Software Solutions, we prioritize maintaining precise and reliable resources to support our global development of NexusSync. This guidelines document is maintained by the Human Resources department and applies to all full-time employees, contractors, and relevant third-party vendors.

Regular reviews of these benefits and frameworks ensure that our team members remain motivated. We believe that a supportive work environment is critical to employee happiness and productivity. Employee feedback is collected quarterly to adjust policies dynamically as needs evolve. Exceptions to this policy can only be authorized by the VP of Human Resources in writing. All processes described herein must be conducted with absolute confidentiality and respect. Make sure you read the related records (HR-001, HR-005, HR-018) to fully understand the contextual framework.

## Policy Overview and Core Description
To apply for leave or paid time off (PTO), employees must submit their requests through the **Aethera People** HR portal. Navigate to the 'Time Off' tab, select the request type (Vacation, Sick Leave, or Parental Leave), input the dates, and submit. All applications must be submitted at least 14 days in advance for planned leaves, and will require approval from your direct manager.

In case of sudden illness or medical emergency, notifications must be sent via Slack to your manager and HR before 9:30 AM local time. Medical certificates are mandatory for sick leaves exceeding 3 consecutive business days.

### Scope & Applicability
This policy is applicable across all international offices of Aethera Software Solutions, including hybrid and fully remote workers. It governs the practices associated with **leave**.

- **Primary Focus**: Ensuring compliance and standardizing processes around leave.
- **Applicability**: Active from date of release. Mandatory compliance checks are performed quarterly.
- **Governance**: Audited by the Human Resources group, led by HR Director.


### Core Parameters & Level Matrix
The following table outlines the quantitative parameters, limits, and levels governing this guide:
| Parameter ID | Level/Classification | Threshold / Limit | Review Cycle | Owner |
| --- | --- | --- | --- | --- |
| VAL-HR-002-01 | Standard / Tier 1 | Under 5,000 units / Days | Monthly | Team Lead |
| VAL-HR-002-02 | Intermediate / Tier 2 | 5,000 to 25,000 / Days | Bi-Annual | Department Head |
| VAL-HR-002-03 | Critical / Tier 3 | Over 25,000 / Days | Annual | HR Director |

### Standard Operating Procedures (SOP)
Follow these steps exactly to execute processes related to Leave Policy. If any unexpected errors occur, consult the FAQ section or contact support.

1. **Step 1: Check Pre-requisites**: Ensure you have configured the appropriate portal accounts in **Aethera Hub** and have active SSO permissions.

2. **Step 2: Log Request / Access Service**: Navigate to the **Human Resources Console** (or corresponding system interface) and open the request form.

3. **Step 3: Define Parameters**: Input the specific parameters based on the classification matrix. Double check the values against the related guide **HR-001**.

4. **Step 4: Execute / Apply Configuration**: Apply changes or submit the ticket. If you are configuring software locally, run the commands outlined in the section below.

5. **Step 5: Peer Verification**: Submit your configuration or request to a peer review channel. For engineers, this corresponds to creating a Pull Request.

6. **Step 6: Final Sign-off**: Ensure the designated owner (e.g. Director or Manager) completes the approval checklist in the portal.

### Code Examples and Configurations
Below is the typical payload structure or configuration setup used during execution:

```json
// Sample API Payload / Configuration for HR-002
{
  "request_meta": {
    "origin": "nexus_internal",
    "requestId": "req-hr-002-55a9b",
    "timestamp": "2026-07-10T23:35:00Z"
  },
  "data": {
    "documentId": "HR-002",
    "status": "active",
    "parameters": [
      {"name": "retention_period", "value": "90_days"},
      {"name": "compliance_flag", "value": "true"},
      {"name": "max_concurrency", "value": "150"}
    ],
    "verification": {
      "status": "approved",
      "approver": "Elena Rostova",
      "lastChecked": "2026-05-10"
    }
  }
}
```


### Guidelines, Best Practices, and Warnings
> [!IMPORTANT]
> Always double-check values prior to submission. Inaccurate data can delay workflows or cause authentication locks.

> [!WARNING]
> Never share passwords, security tokens, or private configuration files. Refer to the standard **SEC-001 (Password Policy)** for security requirements.

> [!NOTE]
> Remote staff should ensure they are connected to the corporate VPN (**SEC-002**) when performing database updates or accessing confidential HR tools.

### Policy Exceptions & Escalations
In exceptional circumstances where standard procedures cannot be followed (e.g. emergency hotfixes or urgent client deployments), a formal waiver request must be submitted via the **Aethera Hub Exception Logger**. The request must document the business justification, potential security or financial risks, and a mitigation plan. Waiver approvals require joint sign-off from the Department Head and **HR Director**.

### Frequently Asked Questions (FAQ) & Troubleshooting
**Q: How do I apply for leave?**
A: Go to the Aethera People portal, click on 'Time Off', choose your leave dates and type, and click 'Submit' to send the request to your manager for approval.

**Q: What happens to my unused vacation leaves at the end of the year?**
A: A maximum of 5 unused leave days can be carried forward to the next fiscal year. Any additional unused leaves will expire automatically without compensation.

**Q: Whom do I contact for questions regarding policy exceptions?**
A: Direct all inquiries to the department mailing list: humanresources-alerts@aethera.com.

### Revision History & Approvals
| Version | Date | Author | Description of Change | Approval Status |
| --- | --- | --- | --- | --- |
| 1.0 | 2024-03-12 | System | Initial publication of documentation framework. | Approved |
| 2.0 | 2025-05-18 | HR Director | Comprehensive update to incorporate NexusSync cloud components. | Approved |
| 2.4 | 2026-05-15 | HR Director | Added structured FAQs and revised parameters table. | Approved |

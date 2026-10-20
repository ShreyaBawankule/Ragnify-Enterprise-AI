---
document_id: SEC-002
title: VPN Setup Guide
category: SECURITY
department: Information Security
author: Emily Wong (Lead DevOps)
version: 2.4
last_updated: 2026-05-15
keywords: vpn configuration, openvpn, wireguard, remote login
tags: [vpn, config]
related_documents: [SEC-003, HR-007]
summary: This document outlines policies, standard guidelines, tables, and troubleshooting steps related to vpn configuration at Aethera Software Solutions.
---

# VPN Setup Guide

Welcome to the official documentation for **VPN Setup Guide** (Document ID: **SEC-002**). At Aethera Software Solutions, we prioritize maintaining precise and reliable resources to support our global development of NexusSync. This guidelines document is maintained by the Information Security department and applies to all full-time employees, contractors, and relevant third-party vendors.

Information security is the responsibility of every employee and contractor at Aethera. Our security perimeter relies on end-to-end encryption, network segmentation, and endpoint MDM. Any suspicious activity or suspected data leaks must be reported to security@aethera.com immediately. Access to customer data is strictly regulated on a need-to-know basis and requires multi-factor auth. We maintain strict compliance with SOC 2, ISO 27001, and GDPR frameworks to protect all parties. Make sure you read the related records (SEC-003, HR-007) to fully understand the contextual framework.

## Policy Overview and Core Description
To configure the corporate VPN, download the OpenVPN or WireGuard client appropriate for your operating system. Go to the VPN setup portal (secure-vpn.aethera.com), log in using your Aethera SSO credentials, and download your personal configuration profile file (.ovpn or .conf). Import this file into your client, configure it to run on system boot, and start the connection.

When connecting to the VPN, you will be prompted for your username, password, and a multi-factor authentication (MFA) authorization code from your Google Authenticator app. All traffic to internal tools (Jira, staging servers, database replicas) must flow through this encrypted tunnel.

### Scope & Applicability
This policy is applicable across all international offices of Aethera Software Solutions, including hybrid and fully remote workers. It governs the practices associated with **vpn configuration**.

- **Primary Focus**: Ensuring compliance and standardizing processes around vpn configuration.
- **Applicability**: Active from date of release. Mandatory compliance checks are performed quarterly.
- **Governance**: Audited by the Information Security group, led by Emily Wong (Lead DevOps).


### Core Parameters & Level Matrix
The following table outlines the quantitative parameters, limits, and levels governing this guide:
| Parameter ID | Level/Classification | Threshold / Limit | Review Cycle | Owner |
| --- | --- | --- | --- | --- |
| VAL-SEC-002-01 | Standard / Tier 1 | Under 5,000 units / Days | Monthly | Team Lead |
| VAL-SEC-002-02 | Intermediate / Tier 2 | 5,000 to 25,000 / Days | Bi-Annual | Department Head |
| VAL-SEC-002-03 | Critical / Tier 3 | Over 25,000 / Days | Annual | Emily Wong |

### Standard Operating Procedures (SOP)
Follow these steps exactly to execute processes related to VPN Setup Guide. If any unexpected errors occur, consult the FAQ section or contact support.

1. **Step 1: Check Pre-requisites**: Ensure you have configured the appropriate portal accounts in **Aethera Hub** and have active SSO permissions.

2. **Step 2: Log Request / Access Service**: Navigate to the **Information Security Console** (or corresponding system interface) and open the request form.

3. **Step 3: Define Parameters**: Input the specific parameters based on the classification matrix. Double check the values against the related guide **HR-007**.

4. **Step 4: Execute / Apply Configuration**: Apply changes or submit the ticket. If you are configuring software locally, run the commands outlined in the section below.

5. **Step 5: Peer Verification**: Submit your configuration or request to a peer review channel. For engineers, this corresponds to creating a Pull Request.

6. **Step 6: Final Sign-off**: Ensure the designated owner (e.g. Director or Manager) completes the approval checklist in the portal.

### Code Examples and Configurations
Below is the typical payload structure or configuration setup used during execution:

```yaml
# client.ovpn config profile
client
dev tun
proto udp
remote vpn.aethera.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-GCM
auth SHA256
key-direction 1
auth-user-pass
auth-nocache
<ca>
-----BEGIN CERTIFICATE-----
MIIB/TCCAWWgAwIBAgIJAN36+ZkWN8K/MA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAMTEGFldGhlcmEtcm9vdC1jYTAeFw0yNjA2MTYxOTI5MjRaFw0zNjA2MTQxOTI5
...
-----END CERTIFICATE-----
</ca>
```


### Guidelines, Best Practices, and Warnings
> [!IMPORTANT]
> Always double-check values prior to submission. Inaccurate data can delay workflows or cause authentication locks.

> [!WARNING]
> Never share passwords, security tokens, or private configuration files. Refer to the standard **SEC-001 (Password Policy)** for security requirements.

> [!NOTE]
> Remote staff should ensure they are connected to the corporate VPN (**SEC-002**) when performing database updates or accessing confidential HR tools.

### Policy Exceptions & Escalations
In exceptional circumstances where standard procedures cannot be followed (e.g. emergency hotfixes or urgent client deployments), a formal waiver request must be submitted via the **Aethera Hub Exception Logger**. The request must document the business justification, potential security or financial risks, and a mitigation plan. Waiver approvals require joint sign-off from the Department Head and **Emily Wong (Lead DevOps)**.

### Frequently Asked Questions (FAQ) & Troubleshooting
**Q: How do I configure VPN?**
A: Log in to secure-vpn.aethera.com, download the client configuration profile, import it into your OpenVPN or WireGuard client, and authenticate using your SSO and MFA credentials.

**Q: Which VPN protocols are supported?**
A: We officially support OpenVPN (port 1194 over UDP) for legacy compatibility, and WireGuard (port 51820) for high-performance connections.

**Q: Whom do I contact for questions regarding policy exceptions?**
A: Direct all inquiries to the department mailing list: informationsecurity-alerts@aethera.com.

### Revision History & Approvals
| Version | Date | Author | Description of Change | Approval Status |
| --- | --- | --- | --- | --- |
| 1.0 | 2024-03-12 | System | Initial publication of documentation framework. | Approved |
| 2.0 | 2025-05-18 | Emily Wong | Comprehensive update to incorporate NexusSync cloud components. | Approved |
| 2.4 | 2026-05-15 | Emily Wong | Added structured FAQs and revised parameters table. | Approved |

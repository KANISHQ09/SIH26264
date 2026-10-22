# AICTE OneView — Integrated Complaint Monitoring & Tracking Engine
## Comprehensive Implementation Plan · SIH 2026 Problem Statement 26264

> **Problem Statement ID:** 26264  
> **Problem Statement Title:** Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells  
> **Target Organization:** All India Council for Technical Education (AICTE)  
> **Key Bureaus:** Regulation Bureau (RB), Public Grievance Redressal Cell (PGRC), Approval Bureau (AB), Academic Planning & Faculty Development Cells, Regional Offices (WRO, NRO, SRO, ERO, NWRO, SWRO, CRO, SCRO)  
> **Core Theme:** Smart Automation & Administrative Accountability  
> **Product Principle:** *One institution. One consolidated dossier. Zero overlapping silos. Trackable SLA resolution.*

---

## 1. Executive Summary & Problem-Solution Fit

### Current AICTE Challenge (As per PS 26264)
AICTE receives complaints concerning technical education institutions from students, faculty, and stakeholders across multiple channels (CPGRAMS, web portals, physical letters, and direct submissions). These are processed in functional silos:
- The **Regulation Bureau (RB)** handles statutory violations, unapproved courses, intake anomalies, and governance breaches.
- The **Public Grievance Redressal Cell (PGRC)** addresses student, faculty, and employee grievances.
- The **Approval Bureau (AB)** evaluates annual extensions of approval (EoA) and institutional sanction.

**The Failure Mode:** When both RB and PGRC receive complaints concerning the same institution simultaneously, there is no centralized, real-time mechanism to detect overlap. This causes:
1. Duplication of administrative inquiries and parallel inspections.
2. Contradictory official correspondence sent to institutions.
3. Difficulty identifying which Bureau/Cell currently holds primary responsibility.
4. Passive deadlines without automated escalation, resulting in delayed disposal.

### The Proposed Solution: AICTE OneView
AICTE OneView is a unified, real-time coordination and monitoring engine delivering:
1. **Centralized Institution Profile**: Search any college by **AICTE Permanent ID** (e.g. `1-3321458291`) or Name to retrieve a 360° consolidated dossier across RB, PGRC, and AB.
2. **Deterministic Overlap & Duplicate Detection**: Automated identification of multi-bureau actions on the same institution with the mandated banner:  
   > ⚠️ **"Potential Overlapping Cases – Coordination Required"**
3. **Proactive SLA Engine & Escalation Ladder**: Dynamic countdown timers flagging cases as *On Track*, *Due Soon (< 48 hrs)*, or *Overdue*, with automated multi-tier escalation (Desk Officer ➔ Bureau Head ➔ Member Secretary).
4. **Closed-Loop 3-Tier Ecosystem**:
   - **Internal AICTE Consoles**: RB, PGRC, Executive Leadership, Regional Offices, Auditors, and System Administrators.
   - **Student / Complainant Portal**: Grievance registration wizard with evidence locker, transparent SLA tracker, and satisfaction appeal.
   - **Institution / College Portal**: Compliance health & risk index, Show-Cause Notice inbox, and Action Taken Report (ATR) submission desk.
5. **Stripe-Grade Landing Page**: World-class visual design inspired by Stripe (`https://stripe.com/in`), complete with iridescent mesh gradients, interactive hero terminal, bureau ecosystem ribbon, 8-point comparison matrix, and citizen quick-lookup.

---

## 2. Feature-by-Feature Alignment with Official PS 26264

| PS 26264 Requirement | Required Specification | Our Implementation Architecture |
|---|---|---|
| **1. Centralized Institution Profile** | Unique AICTE Permanent ID, Name, Address, Region (WRO, NRO, SRO, etc.), full consolidated complaint history. | Indexed by `aicte_permanent_id` and `institution_code`. Consolidated OneView modal/page aggregating all RB, PGRC, and AB cases with institutional risk index. |
| **2. Complaint/Case Tracking** | Unique Case ID, Date of Receipt, Category, Status, Bureau/Cell assigned, Officer, Last Action Date, Next Action, Expected Disposal Date. | Granular case schema tracking `case_number`, `intake_date`, `assigned_bureau_code`, `assigned_officer_id`, `last_action_at`, `next_action_due`, `sla_deadline`. |
| **3. Cross-Bureau Overlap Detection** | Detect when complaints on the same institution are active in RB and PGRC simultaneously; trigger overlap alerts; enable linking. | Semantic similarity & institution-ID correlation engine. Triggers prominent warning: **"Potential Overlapping Cases – Coordination Required"** with human-in-the-loop linking. |
| **4. Real-Time Dashboard** | Total received, pending, under-process, disposed, transferred, escalated, overdue beyond prescribed timelines; institution & bureau workload. | Live KPI metric cards with real-time computation; interactive Bureau workload bar charts; region-wise breakdown maps/charts. |
| **5. Workflow & Action History** | Complete chronological audit trail with responsible officer/bureau, timestamps, remarks, attachments, and transfer history. | Append-only immutable `case_events` and `audit_events` ledger. Mandatory transfer handshake requiring receiving bureau, desk officer, and justification. |
| **6. Search and Filters** | Institution Name, AICTE Permanent ID, Case ID, Bureau/Cell, Region, Category, Status, Date Range. | Multi-parameter search header with debounce autocomplete, faceted filter drawer on cases and institutions views. |
| **7. Alerts & Notifications** | Overlap alerts, pending reminders, escalation notices, timeline/SLA breach warnings. | Dynamic badge engine: Emerald (*On Track*), Amber (*Due Soon < 48h*), Crimson (*Overdue / SLA Breached*), and Cyan (*Coordination Required*). |
| **8. Reports & Analytics** | Bureau-wise, Region-wise, Institution history, Ageing analysis (<15d, 15-30d, 30-60d, >60d), Disposal rate, CSV exports. | Interactive Recharts analytics view with ageing buckets, bureau comparison, disposal efficiency percentage, and audit-logged CSV exporter. |
| **9. Target User Groups** | Regulation Bureau, PGRC, Approval Bureau, Regional Offices, Senior Leadership, Students, and Institutions. | 7 distinct role personas with tailored permissions, navigation bars, and specialized dashboards. |

---

## 3. Technology Stack & Architecture

- **Frontend Application (`apps/web`)**:
  - React 18, TypeScript, Vite
  - Styling: Tailwind CSS, custom design tokens (`#F5F7FC` base, `#2457D6` electric blue, `#17233D` deep navy)
  - Icons & Visuals: Lucide React, SVG Aurora Mesh Gradients
  - Charts: Recharts (Ageing analysis, Bureau workload distribution, Disposal trends)
  - Layout: Responsive desktop-first console with collapsible mobile drawer
- **Backend API (`apps/api`)**:
  - Node.js (v22), Express, TypeScript
  - Validation: Zod schema validators
  - Database: Better-SQLite3 with repository abstraction layer (ready for production PostgreSQL)
  - Logging & Security: Immutable append-only audit trail, RBAC middleware
- **Monorepo Structure**:
  - Root `package.json` with npm workspaces (`apps/web`, `apps/api`)
  - Deterministic database seed command (`npm run seed`) and dual-server startup (`npm run dev`)

---

## 4. Multi-Role Ecosystem & Personas

The system supports 7 clearly differentiated roles:

### A. Internal AICTE Roles
1. **🏛️ Executive Leadership** (*Dr. Anil Sahasrabudhe - Chairman / Member Secretary*)
   - System-wide executive dashboard, national KPI counters, Bureau Overdue Heatmap, inter-bureau bottleneck identification.
2. **⚖️ Regulation Bureau Head (RB)** (*Dr. M. S. Manna - Director, Regulation Bureau*)
   - Regulatory case queue, statutory compliance triage, show-cause notice dispatch, show-cause hearing coordination.
3. **🤝 Public Grievance Redressal Cell Incharge (PGRC)** (*Prof. Rajive Kumar - Incharge, PGRC*)
   - Student and faculty grievance queues, ragging/fee retention investigations, overlap resolution with Regulation Bureau.
4. **✍️ Senior Desk Officer / Case Handler** (*Er. Neha Sharma - Senior Technical Officer, RB*)
   - Detailed case workbench, evidence review, institution clarification requests, transfer handshake initiation, closure summary filing.
5. **🔍 Vigilance & Compliance Auditor** (*Sunil Verma - Vigilance Officer*)
   - Read-only forensic audit trail, SLA breach chronology, transfer handshake verification, compliance certificate export.
6. **⚙️ System Administrator** (*Amit Patel - Systems Administrator*)
   - SLA threshold rule configuration, escalation matrix definition, demo data reset and seed management.

### B. External Stakeholder Roles
7. **🎓 Student / Complainant** (*Aarav Sharma - Student, B.Tech CSE*)
   - Grievance registration wizard (category, institution search, proof attachment, anonymous option), milestone tracker, live SLA counter, satisfaction rating.
8. **🏫 Institution Representative** (*Dr. Meenakshi Sundaram - Principal / Registrar, RGPV Demonstration Institute*)
   - Institutional Compliance Health & Risk Index (Score: 78/100), Show-Cause Notice inbox, Action Taken Report (ATR) submission desk with document attachments.

---

## 5. Information Architecture & Navigation

```
AICTE OneView Ecosystem
│
├── 🌐 Public Landing Page (Stripe-Inspired Design)
│   ├── Top Aurora Banner (SIH 2026 PS 26264 Pill)
│   ├── Hero Section with Interactive Live Case Terminal
│   ├── AICTE Bureau Ecosystem Ribbon (RB, PGRC, AB, Cells)
│   ├── 3 Core Differentiators (SLA Engine, Cross-Bureau OneView, Accountability)
│   ├── Interactive 8-Point Comparison Matrix (Existing vs Proposed)
│   ├── Live Public Grievance & Institution Tracker Widget
│   └── Sign-In / Role-Selection Gateway
│
├── 🔐 Government Access & Persona Portal (SignInModal)
│   ├── 1-Click Persona Quick Access (7 Distinct Roles)
│   └── Official Credentials / Parichay SSO Login Form
│
└── 💼 Operations Console (Role-Gated Dashboards)
    ├── Top Navigation Header (Global Search, Role Badge, 'Public Site' Toggle)
    ├── Operations Sidebar (Dashboard, Institutions, Cases, Reports, Audit, Admin)
    │
    ├── 📊 Dashboard Views:
    │   ├── Leadership / Executive View
    │   ├── Bureau-Specific View (RB / PGRC)
    │   ├── Student Grievance Portal View
    │   └── Institution Compliance & ATR Desk View
    │
    ├── 🏢 Consolidated Institution OneView:
    │   ├── Institution Profile (AICTE Permanent ID, Region, Affiliation)
    │   ├── Institutional Risk Index & Health Score
    │   ├── Consolidated Cases across RB, PGRC & AB
    │   └── Overlap Alert Banner ("Potential Overlapping Cases – Coordination Required")
    │
    ├── 📁 Case Detail & Investigation Workspace:
    │   ├── Case Header & SLA Countdown Timer
    │   ├── Overlap Detection & Coordination Drawer
    │   ├── Overview Tab (Category, Complainant, Next Action)
    │   ├── Timeline Tab (Chronological Case Events)
    │   ├── Related Cases & AI Correlation Tab (Human Confirmation)
    │   ├── Action Taken Report (ATR) Tab
    │   └── Transfer & Assignment Handshake Modal
    │
    ├── 📈 Reports & Analytics View:
    │   ├── Case Ageing Analysis (<15d, 15-30d, 30-60d, >60d)
    │   ├── Bureau & Region Distribution Charts
    │   ├── Disposal Efficiency Rate
    │   └── Audit-Logged CSV Exporter
    │
    ├── 🛡️ Immutable Audit Trail View:
    │   └── Searchable tamper-evident log of all mutations and handshakes
    │
    └── ⚙️ System Administration & Demo Reset:
        └── Configurable SLA rules & 1-click pristine seed reset
```

---

## 6. Implementation Roadmap

### Phase 1: Stripe-Grade Public Landing Page
- Implement `LandingPageView.tsx` featuring:
  - Luminous diagonal mesh aurora gradient (`#2457D6`, `#17233D`, `#06B6D4`, `#F59E0B`).
  - Interactive floating dashboard terminal showcasing a real-time SLA countdown, overlap banner, and college health score.
  - Interactive 8-point comparison matrix (Traditional Grievance Portals vs. AICTE OneView).
  - Built-in **Public Citizen & College Tracker** (search `CASE-2026-0101` or `1-3321458291`).

### Phase 2: Multi-Persona Authentication & Switcher
- Expand `DemoContext` and user store to support the 7 roles:
  - Executive Leadership
  - Regulation Bureau (RB) Head
  - PGRC Incharge
  - Desk Officer
  - Auditor
  - Student / Complainant
  - Institution Representative
- Implement `SignInModal.tsx` with 1-click persona switching and government SSO styling.

### Phase 3: Cross-Bureau Overlap Engine (RB & PGRC)
- Implement deterministic overlap detection logic when multiple complaints target the same AICTE Permanent ID across RB and PGRC.
- Display the official SIH required banner:
  > **⚠️ "Potential Overlapping Cases – Coordination Required"**
- Add coordination action buttons: **Link Cases**, **Joint Inquiry**, and **Designate Primary Bureau**.

### Phase 4: Student & Institution Portals
- **Student View**:
  - Grievance Registration Wizard with category, institution search, and file upload simulation.
  - My Grievances list with transparent SLA countdown and satisfaction rating.
- **Institution View**:
  - Institutional Compliance Health Scorecard.
  - Active Show-Cause notices and ATR submission drawer.

### Phase 5: Ageing Analytics & Verification
- Enhance `ReportsView.tsx` with the official 4-tier ageing breakdown: `< 15 days`, `15-30 days`, `30-60 days`, `> 60 days`.
- Verify end-to-end user journeys, role transitions, and API stability.

---

## 7. SIH Presentation Demonstration Script (3-Minute Winning Flow)

1. **Minute 1: The Public Face & Problem Context (Landing Page)**
   - Open on the Stripe-style landing page. Point out the SIH 26264 banner, the 8-point comparison matrix, and test the public tracker with `CASE-2026-0101`.
   - Click **"Sign In / Select Persona"** to show the 7-role government access gateway.
2. **Minute 2: The Core Differentiator — Overlap Detection & SLA Engine**
   - Log in as **Regulation Bureau Head**. Open institution `RGPV Demonstration Institute` (`1-3321458291`).
   - Highlight the alert: **"Potential Overlapping Cases – Coordination Required"** (RB regulatory inquiry + PGRC fee withholding grievance).
   - Demonstrate the **SLA Countdown Timer** (`Due in 14h 22m · Amber Warning`) and execute an enforced transfer handshake to the Desk Officer with mandatory notes.
3. **Minute 3: The 360° Closed Loop (Student & College Portals)**
   - Switch to **Student Persona (Aarav Sharma)**: Show filed case status updating in real-time with the milestone stepper.
   - Switch to **Institution Persona (Dr. Meenakshi Sundaram)**: Show the Show-Cause Notice appearing in their inbox and submit an Action Taken Report (ATR).
   - Switch to **Auditor Persona (Sunil Verma)**: Conclude by displaying the immutable, timestamped audit trail proving complete accountability.

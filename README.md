# Nexus 0 — AICTE OneView Prototype

> **Problem Statement:** Smart Automation · SIH 2026 PS 26264  
> **Organization:** AICTE – Regulation Bureau  
> **Product Principle:** *One institution. One consolidated case view. Clear ownership. Trackable resolution.*  
> **Environment:** `DEMO ENVIRONMENT — SAMPLE DATA ONLY`

---

## 1. Overview

**Nexus 0 (AICTE OneView)** is an enterprise coordination and monitoring console designed for AICTE officials to track, triage, correlate, and resolve institution-linked cases across disparate Bureaus and Cells (Approval Bureau, Academic Planning, Faculty Development, Student Grievance Redressal, and Regulation & Vigilance).

### Key Features
1. **Consolidated Institution View (OneView)**: Search any institution by name or code (`AICTE-MH-2024-ENG-089`) to see every grievance, inquiry, or compliance matter across all Bureaus in one place.
2. **Deterministic SLA & Overdue Engine**: Dynamic rules flag cases as Overdue (`due_at < now`), Due Soon (within 48 hours), or On Track.
3. **Multi-Bureau Transfers & Handoffs**: Transactional assignments recording receiving Bureau, assigned desk officer, mandatory transfer reason, and handoff notes.
4. **AI Deduplication & Correlation Assistance**: Identifies potential duplicate or related cases across Bureaus. **Zero auto-merge policy**: requires human review to confirm or reject.
5. **Role-Based Access Control (RBAC)**: Backend-enforced permissions for Leadership, Bureau Officials, Case Handlers, Auditors, and System Administrators.
6. **Immutable Audit Trail**: Append-only log recording every status change, reassignment, related-case decision, export, and reset.
7. **One-Click Demo Reset**: Restores pristine seed state with 8 institutions, 20 cases, timeline history, and deterministic overdue examples.

---

## 2. Design System Specification

| Element | Specification | Hex / Token |
|---|---|---|
| **Main background** | Soft cool white | `#F5F7FC` |
| **Cards & panels** | Pure white with subtle shadow | `#FFFFFF` |
| **Primary accent** | Electric blue | `#2457D6` (subtle `#EEF3FF`) |
| **Main text** | Deep navy | `#17233D` |
| **Borders** | Subtle blue-grey | `#E4EAF3` |
| **Success** | Emerald green | `#10B981` |
| **Warning / Due Soon** | Amber | `#F59E0B` |
| **Overdue Alert** | Crimson red | `#EF4444` |
| **Typography** | Inter | Google Fonts sans-serif |
| **Overall Style** | Clean, spacious, enterprise SaaS | High legibility & tabular figures |

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend API**: Node.js (v22), Express, TypeScript, Zod, Better-SQLite3 (repository abstraction ready for PostgreSQL)
- **Monorepo**: npm workspaces (`apps/web`, `apps/api`)

---

## 4. Getting Started

### Prerequisites
- Node.js >= 18 (Tested on v22)
- npm >= 9

### Installation & Launch
```bash
# 1. Clone repository and install dependencies
git clone <repo-url>
cd SIH26264
npm install

# 2. Seed the database (automated on startup, or manually run:)
npm run seed

# 3. Launch both API and Web concurrently
npm run dev
```

- **Frontend Web UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **API Health Check**: [http://localhost:4000/health](http://localhost:4000/health)

---

## 5. Demo Personas

Switch personas anytime using the top-right persona selector:

| Persona | Name | Title | Primary Role |
|---|---|---|---|
| **Leadership** | Dr. Anil Sahasrabudhe | Director General | Executive oversight, KPIs, system-wide visibility |
| **Bureau Head** | Prof. Rajive Kumar | Member Secretary (Approvals) | Bureau case triage, assignments, status transitions |
| **Desk Officer** | Er. Neha Sharma | Senior Technical Officer | Assigned case handling, investigation notes, milestone updates |
| **Auditor** | Sunil Verma | Vigilance & Compliance Officer | Read-only audit log inspection, verification |
| **Administrator** | Amit Patel | System Administrator | Demo data reset, configuration, system maintenance |

---

## 6. Live Demo Walkthrough (3 Minutes)

1. **Open Dashboard (`/`) as Leadership**: Point out the KPI counters: Total Intake (20), Active (16), Overdue (6), Due in 48h (2), and Intake vs Resolution trend chart.
2. **Search Institution**: In top global search, type `RGPV` and open the **RGPV Demonstration Institute** OneView profile. Show grievances spanning multiple Bureaus (*Approvals*, *Faculty Welfare*, *Infrastructure*, *Student Grievances*).
3. **Open Case Workspace**: Click on `CASE-2026-0101` or `CASE-2026-0104`. Walk through:
   - **Overview Tab**: SLA countdown timer, source ref (`CPGRAMS`), operational next action.
   - **Timeline Tab**: Chronological audit entries with actors and timestamps.
   - **Related Cases AI Tab**: Candidate correlation with advisory match score (89%) and matching reasons. Demonstrate the human review buttons (**Confirm Related** / **Reject**).
4. **Transfer Case**: Click **Transfer / Assign**, choose receiving Bureau (e.g. *Regulation, Redressal & Vigilance Cell*), select officer, provide mandatory reason, and submit. Show immediate reflection in case view and audit trail.
5. **Update Status**: Click **Update Status**, transition case, verify closure summary requirement for Resolved cases.
6. **Inspect Audit Trail**: Switch to **Auditor** persona and navigate to the Audit Trail to show that every action was immutably recorded.
7. **Reset Demo State**: Switch to **System Administrator** persona, navigate to Demo Controls, and click **Reset Demo Seed Data** to restore the deterministic starting state.

---

## 7. Prototype Boundary & Non-Goals

- **Synthetic Data**: All institution records, case numbers, and identities are synthetic demo data.
- **No Production Claims**: This prototype is not connected to production AICTE databases or CPGRAMS APIs.
- **Coordination Tool**: Nexus 0 coordinates and monitors cases; official merit decisions remain under statutory authority.
- **Zero Auto-Merge**: AI-assisted related cases provide recommendations only; human authorization is strictly required.

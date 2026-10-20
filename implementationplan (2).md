# AICTE OneView — Prototype Implementation Plan

> **Problem Statement:** SIH 2026 · PS 26264  
> **Organization:** AICTE – Regulation Bureau  
> **Theme:** Smart Automation  
> **Product principle:** *One institution. One consolidated case view. Clear ownership. Trackable resolution.*

## 1. Purpose and prototype boundary

AICTE OneView is an internal, role-based coordination and monitoring dashboard for institution-related complaint cases handled by different AICTE Bureaus/Cells. It should help authorized officials find institution-linked cases, see current responsibility and next actions, track transfers and due dates, review possible related cases, and inspect a traceable activity history.

This is a **working hackathon prototype using seeded demo data**. It must not claim to be connected to AICTE production systems, CPGRAMS, or institutional databases. Any real integration requires formal access, documented interfaces, data governance approval, and security review. The dashboard complements official grievance channels; it does not replace them or decide the merits of complaints.

### Prototype success criteria

- A presenter can select a clearly labelled demo role and reach the dashboard.
- Searching for a demo institution returns its linked cases.
- Opening a case displays status, institution, Bureau/Cell, current owner, due date, next action, and chronological timeline.
- Authorized demo users can assign/transfer a case and change its status.
- Each successful mutation updates the UI and creates a persistent event/audit entry.
- Possible related cases are flagged with an explanation and require a human reviewer to confirm, reject, or link them. Never auto-merge.
- Filters and summary counts are calculated from the same case dataset.
- Overdue indicators are derived from due dates and configured rules.
- Role restrictions are enforced by the backend, not only by hiding buttons.
- Resetting demo data restores a known, repeatable presentation state.

## 2. Recommended technology

Use the proposal's intended architecture:

| Layer | Technology | Prototype responsibility |
|---|---|---|
| Frontend | React + TypeScript + Vite | Responsive dashboard, search, filters, case detail, forms, charts |
| UI styling | Tailwind CSS or CSS Modules; Lucide icons | Consistent design system and responsive layouts |
| Data fetching | TanStack Query or a small typed API client | Loading/error states and cache refresh after mutations |
| Backend | Node.js + Express + TypeScript | REST endpoints, validation, permissions, workflow logic |
| Database | PostgreSQL | Institutions, cases, users, assignments, related-case reviews, events |
| Validation | Zod (or equivalent) | Validate request bodies and query parameters |
| Charts | Recharts | Trends and workload summaries |
| Testing | Vitest + React Testing Library; Supertest | UI and API workflow tests |
| Local setup | Docker Compose (optional but recommended) | Repeatable API + PostgreSQL demo environment |

If time is very limited, SQLite can be used temporarily for a local-only demo, but PostgreSQL is the target architecture from the supplied proposal. Keep database access behind a repository/service layer so the persistence implementation can be changed without rewriting the UI.

## 3. Product experience and visual direction

### Design goals

Create a credible government operations console: clear, restrained, accessible, information-dense without feeling crowded. Prioritize legibility and action clarity over decorative effects.

- **Palette:** deep navy/charcoal surfaces, white primary text, muted slate labels, electric blue/cyan for primary actions, green for resolved, amber for due-soon/pending, red for overdue.
- **Typography:** Inter or a system sans-serif; clear hierarchy and tabular numerals for counts and IDs.
- **Layout:** left navigation rail, top bar with global institution/case search and demo-role selector, dashboard KPI row, analytics area, recent activity panel, and a searchable case table.
- **Case detail:** summary header; status, owner, Bureau/Cell, due date and next action; tabs for Overview, Timeline, Related Cases and Attachments metadata.
- **Interaction:** compact drawers/modals for assignment and transfer; confirmation before destructive or consequential actions; toast feedback; skeletons and explicit empty/error states.
- **Responsive:** desktop-first for the judging demo, but usable at tablet/mobile widths. Collapse navigation, stack cards, keep filters accessible, and make tables horizontally scrollable or convert rows into cards.
- **Accessibility:** semantic headings, visible keyboard focus, labels on all inputs, sufficient contrast, and status text/icons in addition to color.

### Main screens

1. **Demo access / role selection** — label prominently “DEMO ENVIRONMENT — SAMPLE DATA ONLY”. Offer Leadership, Bureau/Cell Official, Case Handler, Auditor, and System Administrator personas. No real authentication or production access should be implied.
2. **Dashboard** — total cases, open/pending, resolved, overdue and unassigned counts; case trends; workload by Bureau/Cell; recent activity; quick filters.
3. **Institutions** — search by institution name or demo code; show institution profile and all linked cases.
4. **Cases** — sortable, filterable list with case ID, institution, category, status, responsible Bureau/Cell, owner, last action and due date.
5. **Case workspace** — summary, next action, timeline, assignment/transfer history, related-case review and permitted metadata.
6. **Reports** — filtered counts, age bands, status distribution and CSV export with an audit entry.
7. **Admin / demo controls** — users and role mapping, configurable demo statuses/due-date rules, data reset, and seed-data information. Restrict admin actions to the administrator demo role.

### Reference visual

The accompanying generated visual is a **design direction**, not a literal pixel-perfect specification. Implement real components and working interactions rather than embedding the image as the application UI.

## 4. Application structure

Suggested monorepo:

```text
aicte-oneview/
├── README.md
├── implementationplan.md
├── docker-compose.yml
├── .env.example
├── package.json
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/                 # routes, providers, layout
│   │   │   ├── components/          # buttons, badges, tables, dialogs
│   │   │   ├── features/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── institutions/
│   │   │   │   ├── cases/
│   │   │   │   ├── assignments/
│   │   │   │   ├── related-cases/
│   │   │   │   ├── reports/
│   │   │   │   └── admin/
│   │   │   ├── lib/api-client.ts
│   │   │   ├── types/
│   │   │   └── styles/
│   │   └── package.json
│   └── api/
│       ├── src/
│       │   ├── app.ts
│       │   ├── server.ts
│       │   ├── middleware/           # auth, RBAC, errors, validation
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── institutions/
│       │   │   ├── cases/
│       │   │   ├── assignments/
│       │   │   ├── related-cases/
│       │   │   ├── dashboard/
│       │   │   ├── reports/
│       │   │   └── audit/
│       │   ├── db/
│       │   │   ├── migrations/
│       │   │   ├── seed.ts
│       │   │   └── repositories/
│       │   └── tests/
│       └── package.json
└── docs/
    ├── demo-script.md
    └── api-contract.md
```

Keep UI, business rules, and persistence separate. Do not put workflow rules only in React components.

## 5. Core data model

Use UUID primary keys internally and human-readable demo IDs for presentation. Store timestamps in UTC and render them in the user's local timezone.

### `institutions`
- `id`, `institution_code` (unique demo identifier), `name`
- `city`, `state`, `institution_type` (optional demo fields)
- `source_reference` (nullable), `updated_at`

### `cases`
- `id`, `case_number` (unique, human-readable)
- `source_case_id` (nullable), `institution_id`
- `category`, `summary`, `status`, `priority` (demo-only if used)
- `current_bureau_id`, `current_owner_id` (nullable where appropriate)
- `created_at`, `updated_at`, `due_at` (nullable)
- `next_action`, `closure_summary` (nullable), `closed_at` (nullable)
- `source_name`, `source_updated_at` (optional provenance fields)

### `bureaus`
- `id`, `name`, `code`, `active`

### `users`
- `id`, `display_name`, `demo_email`, `role`, `bureau_id` (nullable), `active`
- Use fictional sample identities only.

### `assignments`
- `id`, `case_id`, `bureau_id`, `owner_id`, `assigned_by`
- `started_at`, `ended_at` (nullable), `transfer_reason`, `handoff_note`
- Preserve previous assignments; mark the current assignment with `ended_at = NULL`.

### `case_events`
- `id`, `case_id`, `actor_id`, `event_type`, `from_value` (nullable), `to_value` (nullable)
- `note` (nullable), `created_at`, `metadata` (JSONB, limited to non-sensitive demo details)
- Append events; do not overwrite historical entries.

### `related_case_reviews`
- `id`, `case_id`, `candidate_case_id`, `match_reasons` (JSONB), `similarity_score` (optional)
- `review_status` (`pending`, `confirmed_related`, `rejected`), `reviewed_by`, `reviewed_at`, `review_note`
- Enforce a consistent pair-ordering/unique constraint to avoid duplicate review pairs.

### `audit_events`
- `id`, `actor_id`, `action`, `target_type`, `target_id`, `result`, `created_at`, `metadata`
- Record assignment, transfer, status changes, related-case decisions, exports, and administrative changes. Do not log passwords, tokens, or unnecessary complaint text.

### Relationships and constraints
- One institution has many cases.
- One case has many assignment records and case events.
- One case may have multiple related-case review candidates.
- Add indexes for `case_number`, `institution_code`, `institution_id`, `status`, `current_bureau_id`, `current_owner_id`, and `due_at`.
- Use transactions for case mutation + assignment/event/audit insertion so the case cannot update without its history being written.

## 6. API contract

Prefix routes with `/api/v1`. Return consistent JSON and meaningful HTTP status codes. Validate inputs on the server.

| Method and route | Purpose |
|---|---|
| `GET /health` | API/database health for local demo |
| `GET /api/v1/demo/users` | List available demo personas |
| `POST /api/v1/demo/session` | Select a demo persona; issue a prototype session or establish demo identity |
| `GET /api/v1/dashboard/summary` | KPI counts, trend series, bureau distribution, recent activity |
| `GET /api/v1/institutions?search=` | Search institutions |
| `GET /api/v1/institutions/:id` | Institution profile |
| `GET /api/v1/institutions/:id/cases` | Cases linked to institution |
| `GET /api/v1/cases` | Paginated case list with filters and sorting |
| `GET /api/v1/cases/:id` | Case details |
| `GET /api/v1/cases/:id/timeline` | Chronological case events |
| `POST /api/v1/cases` | Create a demo case (authorized roles only) |
| `PATCH /api/v1/cases/:id/status` | Update status and append event |
| `POST /api/v1/cases/:id/assign` | Assign/transfer team and/or handler |
| `GET /api/v1/cases/:id/related` | Candidate related cases and reasons |
| `POST /api/v1/cases/:id/related/:candidateId/review` | Confirm, reject or link a candidate after human review |
| `GET /api/v1/reports/summary` | Aggregates respecting role scope and filters |
| `GET /api/v1/reports/export.csv` | Export permitted filtered fields and log export |
| `GET /api/v1/audit` | Authorized audit-event search |
| `POST /api/v1/demo/reset` | Restore seed state; administrator-only, demo-only |

Example case-list filters: `institutionId`, `bureauId`, `ownerId`, `status`, `category`, `ageBucket`, `dueState`, `q`, `page`, `pageSize`, `sortBy`, `sortOrder`.

Example assignment request:

```json
{
  "bureauId": "demo-bureau-approvals",
  "ownerId": "demo-user-nehasharma",
  "transferReason": "Subject-matter review required",
  "handoffNote": "Please review the submitted documentation."
}
```

Use a shared response shape, for example `{ "data": ..., "meta": ... }`, and a consistent error shape such as `{ "error": { "code": "FORBIDDEN", "message": "..." } }`. Never trust role names sent by the browser; derive the acting user from the validated demo session.

## 7. Workflow rules

### Institution search and linked cases
- Search institution name and normalized demo code; optionally support case number search in the global search.
- Display a clear “no results” state and a “sample data” label.
- Preserve source IDs when present rather than replacing them with OneView IDs.

### Assignment and transfer
1. User opens the action dialog.
2. Select receiving Bureau/Cell and handler; enter a reason (required for transfer) and optional hand-off note.
3. Show a confirmation summary before submission.
4. Backend checks role and target values.
5. In one database transaction, close the previous assignment, create the new assignment, update current case ownership, and append case/audit events.
6. Refresh case details, timeline, dashboard summary and case lists. Show success or an actionable error.

### Status updates
- Configure allowed transitions for the demo, for example `Open → In Review → Awaiting Information → Resolved → Closed`, with permitted return transitions defined explicitly.
- Require a closure summary for a transition to `Resolved` or `Closed` if that is the configured rule.
- Record actor, previous status, new status, timestamp and reason.

### Due dates and overdue logic
- Define overdue as `due_at < current time` and status not in the configured terminal statuses.
- Define “due soon” as a configurable window (for example, the next 48 hours); label this as a demo rule.
- Cases with no due date should display “No due date”, not silently count as on time.
- Derive dashboard counts and filters from the same backend rule to avoid mismatches.

### Related-case assistance
- Seed explicit candidate pairs for a reliable demo.
- Matching can use exact institution-code equality and configurable text/category similarity.
- Display why a case was flagged, e.g. “same institution” and “similar category/summary”.
- Similarity scores are advisory only. Require a reviewer action and record the decision. Never automatically merge records.

### Reporting and exports
- Counts and charts must use the filtered backend data.
- CSV export should include only approved columns, respect role scope, and write an audit event.
- Clearly label charts as illustrative if using a static historical trend series.

## 8. Roles and permissions

The role matrix below is an illustrative prototype default; AICTE must confirm the real permission model.

| Capability | Leadership | Bureau/Cell official | Case handler | Auditor | Administrator |
|---|---:|---:|---:|---:|---:|
| View authorized summary dashboard | Yes | Yes | Scoped | Read-only scope | Yes |
| Search/view cases | Authorized scope | Bureau scope / approved cross-team | Assigned cases | Read-only scope | Technical/admin scope |
| Assign or transfer cases | Optional policy | Yes, permitted scope | No by default | No | Configuration only |
| Update status / next action | No by default | Yes | Assigned cases | No | No by default |
| Review related-case suggestions | Read-only or approved | Yes | Optional | Read-only | No by default |
| View audit trail | Summary/approved | Relevant scope | Own actions/visible case | Yes, authorized scope | Admin events |
| Manage roles / reset demo | No | No | No | No | Yes |

Implement an `authorize(action, resource, actor)` service/middleware. Return `403` for a forbidden operation and test it through direct API requests. UI restrictions improve usability but are not a security boundary.

## 9. Seeded demo dataset

Use clearly fictional or synthetic data; never use real complaint details or personal data. Seed data should be stable and deterministic so the same demo can be replayed.

Suggested initial seed:
- **8 institutions** with fictional names and unique demo codes.
- **30–40 cases** across 4–5 Bureaus/Cells and categories such as Academic, Approvals, Infrastructure, Examination, and Other.
- Statuses spread across Open, In Review, Awaiting Information, Resolved, and Closed.
- A mix of future, missing, and past due dates.
- Cases with assigned owners, unassigned cases, and multiple historical transfers.
- At least **3 candidate related-case pairs**: one confirmed, one rejected, and one awaiting review.
- Enough event history to make the timeline and recent activity panels feel populated.
- 5 demo roles with fictional display names.

Keep demo identity and credentials obvious in the README; do not ship real secrets. Use deterministic timestamps relative to a fixed demo clock or provide a “Reset demo data” control so overdue examples do not unpredictably disappear. If a fixed demo clock is used, label it clearly.

## 10. Implementation phases

### Phase 1 — Foundation
- Create the monorepo, TypeScript configuration, lint/format scripts and environment templates.
- Start PostgreSQL and Express; add migrations, constraints, health endpoint and seed script.
- Define shared types, status values, Bureau/Cell names and demo role permissions.
- **Exit check:** clean install and seed command work; API reports healthy.

### Phase 2 — Visual shell and read paths
- Build navigation, top bar, demo-role selector and design tokens.
- Implement dashboard summary cards, charts, recent activity, case table and responsive states.
- Implement institution search, linked-case view and case detail/timeline read endpoints.
- **Exit check:** evaluator can select a persona, search a seeded institution and inspect its cases.

### Phase 3 — Mutations and auditability
- Implement assignment/transfer form and status update flow.
- Add related-case review controls, confirmation dialog, validation and useful error feedback.
- Make each mutation transactional and append event/audit records.
- **Exit check:** transfer and status update appear immediately in the case view, timeline and dashboard.

### Phase 4 — Filters, reporting and role enforcement
- Add status, Bureau/Cell, institution, owner, age and due-state filters.
- Implement report aggregates and permitted CSV export.
- Enforce backend authorization for each protected endpoint and audit exports/admin changes.
- **Exit check:** filtered counts match results and forbidden direct API calls return `403`.

### Phase 5 — QA and presentation hardening
- Test empty results, invalid inputs, no due date, terminal status, rejected permission, repeated transfer, and related-case review.
- Add loading, empty, error and success states; keyboard focus and responsive checks.
- Add demo reset, predictable seed data, setup instructions and a rehearsed demo path.
- **Exit check:** the complete demo can be repeated from a clean seed without manual database editing.

### Phase 6 — Future integration discovery (not required for prototype)
- Confirm source systems, approved APIs or controlled exports, data owners, authoritative institution identifiers, status mappings, access policy, retention and hosting.
- Build a separate integration adapter only after approval.
- Never imply that the prototype currently connects to AICTE or CPGRAMS.

## 11. Testing and acceptance checklist

### Functional
- [ ] Search by institution name and institution code.
- [ ] Institution view lists every linked seeded case.
- [ ] Case detail shows current owner, Bureau/Cell, status, due date and next action.
- [ ] Timeline is chronological and includes actor and timestamp.
- [ ] Transfer preserves previous assignment and creates new current assignment.
- [ ] Status change refreshes all affected views and records history.
- [ ] Related-case suggestion shows reasons and requires explicit review.
- [ ] Filters, pagination and sorting work together.
- [ ] Overdue and due-soon counts match the configured rule.
- [ ] CSV export reflects active filters and creates an audit event.
- [ ] Demo reset restores the known initial state.

### Security and data quality
- [ ] Backend rejects unauthorized operations even if called outside the UI.
- [ ] Inputs, IDs, status transitions and assignment targets are validated.
- [ ] Case update, assignment history, case event and audit event commit atomically.
- [ ] No credentials, tokens or sensitive complaint text appear in logs.
- [ ] Only synthetic sample data is used.
- [ ] UI labels the environment as a demo and discloses integrations are not connected.

### Reliability and usability
- [ ] API errors show helpful messages and do not silently fail.
- [ ] Empty search, loading, network failure and no-due-date states are designed.
- [ ] Dashboard charts have labels and do not rely on color alone.
- [ ] Core flow works at presentation-screen and tablet widths.
- [ ] A clean checkout can be started using documented commands.

## 12. Recommended live demonstration (3–4 minutes)

1. **Open the dashboard** as Leadership. Explain the consolidated view and point out pending, resolved and overdue indicators.
2. **Search for a seeded institution** such as “RGPV Demonstration Institute”. Open its institution profile and show cases across multiple Bureaus/Cells.
3. **Open a pending case** and identify its current Bureau/Cell, owner, due date, next action and event timeline.
4. **Review a possible related case.** Show the matching reasons, then confirm or reject the suggestion. Emphasize that the system never auto-merges.
5. **Transfer the case** to another demo Bureau/handler with a hand-off reason. Submit and show the updated owner plus the new timeline/audit entry.
6. **Change status or next action**, then return to the dashboard and show the counts/filtered list updating.
7. **Open the overdue view** and explain that overdue status follows the configured demo rule.
8. Close with the boundary: all records are synthetic; live integration is a future approved phase.

### Presenter preparation
- Reset seed data immediately before the presentation.
- Keep one case ready for transfer, one overdue case, and one related-case candidate pending review.
- Check database/API health and open the dashboard before screen sharing.
- Avoid relying on external email, SMS, AI API keys, or live institutional systems for the core demo.

## 13. Risks and explicit non-goals

- **No production integration assumed:** no direct AICTE database or CPGRAMS access unless formally approved.
- **No official adjudication:** the product supports coordination and monitoring, not deciding complaint merits.
- **No automatic case merge:** related-case logic is a review aid.
- **No unapproved external messages:** do not contact institutions or complainants from the prototype.
- **No real sensitive records:** use synthetic or formally approved anonymized data only.
- **No unsupported impact claims:** measure outcomes during a pilot before reporting percentage improvements.
- **Security must be reviewed:** demo-role selection is not equivalent to production authentication.

## 14. Definition of done

The prototype is ready to present when the seeded demo starts reliably, the dashboard and institution/case search are functional, assignment/transfer and status updates persist, timeline and audit events update correctly, related-case decisions require human review, filters and overdue counts are consistent, and backend permissions are tested. The README must document setup, environment variables, migrations, seeding, demo personas, reset steps, and known limitations.

---

## Visual design reference

Generated concept image: `aicte-oneview-dashboard-concept.png` (provided alongside this plan). Treat it as a visual target for layout and styling; build the dashboard from real React components and connect each interactive control to the API.

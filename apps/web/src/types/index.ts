export type DemoRole =
  | 'leadership'
  | 'bureau_official'
  | 'case_handler'
  | 'auditor'
  | 'admin';

export type CaseStatus =
  | 'Open'
  | 'In Review'
  | 'Awaiting Information'
  | 'Resolved'
  | 'Closed';

export type CasePriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type CaseCategory =
  | 'Approvals'
  | 'Academic'
  | 'Infrastructure'
  | 'Examination'
  | 'Faculty & Staff'
  | 'Fee & Admissions'
  | 'Other';

export interface User {
  id: string;
  display_name: string;
  demo_email: string;
  role: DemoRole;
  designation: string;
  bureau_id: string | null;
  bureau_name?: string;
  active: number;
}

export interface Bureau {
  id: string;
  name: string;
  code: string;
  active: number;
}

export interface Institution {
  id: string;
  institution_code: string;
  name: string;
  city: string;
  state: string;
  institution_type: string;
  source_reference: string | null;
  updated_at: string;
  case_count?: number;
  open_case_count?: number;
  overdue_case_count?: number;
}

export interface Case {
  id: string;
  case_number: string;
  source_case_id: string | null;
  institution_id: string;
  category: CaseCategory;
  priority: CasePriority;
  summary: string;
  status: CaseStatus;
  current_bureau_id: string;
  current_owner_id: string | null;
  created_at: string;
  updated_at: string;
  due_at: string | null;
  next_action: string | null;
  next_action_due: string | null;
  closure_summary: string | null;
  closed_at: string | null;
  source_name: string | null;
  source_updated_at: string | null;
  institution_name?: string;
  institution_code?: string;
  institution_city?: string;
  institution_state?: string;
  institution_type?: string;
  bureau_name?: string;
  bureau_code?: string;
  owner_name?: string;
  owner_email?: string;
  owner_designation?: string;
  is_overdue?: boolean | number;
  is_due_soon?: boolean | number;
  activeAssignment?: Assignment;
  assignmentHistory?: Assignment[];
  pendingRelatedCount?: number;
}

export interface Assignment {
  id: string;
  case_id: string;
  bureau_id: string;
  owner_id: string | null;
  assigned_by: string;
  started_at: string;
  ended_at: string | null;
  transfer_reason: string | null;
  handoff_note: string | null;
  bureau_name?: string;
  owner_name?: string;
  assigned_by_name?: string;
}

export interface CaseEvent {
  id: string;
  case_id: string;
  actor_id: string;
  actor_name?: string;
  actor_role?: string;
  actor_designation?: string;
  event_type: string;
  from_value: string | null;
  to_value: string | null;
  note: string | null;
  created_at: string;
  metadata?: string | null;
  case_number?: string;
}

export interface RelatedCaseCandidate {
  id: string;
  case_id: string;
  candidate_case_id: string;
  match_reasons: string[];
  similarity_score: number;
  review_status: 'pending' | 'confirmed_related' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  candidate_case_number?: string;
  candidate_summary?: string;
  candidate_status?: string;
  candidate_category?: string;
  candidate_bureau?: string;
  reviewer_name?: string;
}

export interface DashboardSummary {
  kpis: {
    totalCases: number;
    activeCases: number;
    resolvedCases: number;
    overdueCases: number;
    unassignedCases: number;
    dueSoonCases: number;
  };
  bureauWorkload: {
    bureauId: string;
    bureauName: string;
    code: string;
    total: number;
    open: number;
    overdue: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
  statusDistribution: {
    status: string;
    count: number;
  }[];
  intakeTrends: {
    month: string;
    received: number;
    resolved: number;
  }[];
  recentActivity: CaseEvent[];
}

export interface AuditEvent {
  id: string;
  actor_id: string;
  actor_name: string;
  role: string;
  action: string;
  target_type: string;
  target_id: string | null;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  created_at: string;
  metadata: string | null;
}

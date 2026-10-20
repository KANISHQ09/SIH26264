import {
  User,
  Bureau,
  Institution,
  Case,
  CaseEvent,
  RelatedCaseCandidate,
  DashboardSummary,
  AuditEvent
} from '../types';

let currentDemoUserId: string | null = null;
let currentDemoRole: string | null = null;

export function setApiDemoIdentity(userId: string | null, role: string | null) {
  currentDemoUserId = userId;
  currentDemoRole = role;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (currentDemoUserId) {
    headers.set('x-demo-user-id', currentDemoUserId);
  }
  if (currentDemoRole) {
    headers.set('x-demo-role', currentDemoRole);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errMessage = 'Request failed';
    try {
      const errorData = await response.json();
      if (errorData?.error?.message) {
        errMessage = errorData.error.message;
      }
    } catch {
      errMessage = response.statusText;
    }
    throw new Error(errMessage);
  }

  return response.json();
}

export const api = {
  // Demo & Personas
  async getDemoUsers(): Promise<{ data: User[] }> {
    return request('/api/v1/demo/users');
  },

  async getBureaus(): Promise<{ data: Bureau[] }> {
    return request('/api/v1/demo/bureaus');
  },

  async resetDemoData(): Promise<{ data: { success: boolean; message: string } }> {
    return request('/api/v1/demo/reset', { method: 'POST' });
  },

  // Dashboard
  async getDashboardSummary(): Promise<{ data: DashboardSummary }> {
    return request('/api/v1/dashboard/summary');
  },

  // Institutions
  async getInstitutions(search?: string): Promise<{ data: Institution[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/api/v1/institutions${query}`);
  },

  async getInstitutionById(id: string): Promise<{ data: Institution }> {
    return request(`/api/v1/institutions/${encodeURIComponent(id)}`);
  },

  async getInstitutionCases(id: string): Promise<{ data: Case[] }> {
    return request(`/api/v1/institutions/${encodeURIComponent(id)}/cases`);
  },

  // Cases
  async getCases(params: Record<string, any> = {}): Promise<{ data: Case[]; meta: any }> {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        urlParams.append(k, String(v));
      }
    });
    const qs = urlParams.toString();
    return request(`/api/v1/cases${qs ? `?${qs}` : ''}`);
  },

  async getCaseById(id: string): Promise<{ data: Case }> {
    return request(`/api/v1/cases/${encodeURIComponent(id)}`);
  },

  async getCaseTimeline(id: string): Promise<{ data: CaseEvent[] }> {
    return request(`/api/v1/cases/${encodeURIComponent(id)}/timeline`);
  },

  async createCase(payload: any): Promise<{ data: Case }> {
    return request('/api/v1/cases', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async assignCase(caseId: string, payload: {
    bureauId: string;
    ownerId?: string | null;
    transferReason?: string;
    handoffNote?: string;
  }): Promise<{ data: Case }> {
    return request(`/api/v1/cases/${encodeURIComponent(caseId)}/assign`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updateCaseStatus(caseId: string, payload: {
    status: string;
    note?: string;
    closureSummary?: string;
  }): Promise<{ data: Case }> {
    return request(`/api/v1/cases/${encodeURIComponent(caseId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async updateCaseNextAction(caseId: string, payload: {
    nextAction: string;
    nextActionDue?: string | null;
  }): Promise<{ data: Case }> {
    return request(`/api/v1/cases/${encodeURIComponent(caseId)}/next-action`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  // Related Cases
  async getRelatedCandidates(caseId: string): Promise<{ data: RelatedCaseCandidate[] }> {
    return request(`/api/v1/cases/${encodeURIComponent(caseId)}/related`);
  },

  async reviewRelatedCandidate(caseId: string, candidateId: string, payload: {
    status: 'confirmed_related' | 'rejected';
    reviewNote?: string;
  }): Promise<{ data: RelatedCaseCandidate[] }> {
    return request(`/api/v1/cases/${encodeURIComponent(caseId)}/related/${encodeURIComponent(candidateId)}/review`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Reports
  async getReportsSummary(): Promise<{ data: any }> {
    return request('/api/v1/reports/summary');
  },

  async exportCasesCsvUrl(): Promise<string> {
    return '/api/v1/reports/export.csv';
  },

  // Audit
  async getAuditEvents(limit = 100): Promise<{ data: AuditEvent[] }> {
    return request(`/api/v1/audit?limit=${limit}`);
  }
};

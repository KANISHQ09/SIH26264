import { Router, Request, Response } from 'express';
import { casesService } from './modules/cases/cases.service.js';
import { dashboardService } from './modules/dashboard/dashboard.service.js';
import { institutionsService } from './modules/institutions/institutions.service.js';
import { relatedService } from './modules/related/related.service.js';
import { reportsService } from './modules/reports/reports.service.js';
import { demoService } from './modules/demo/demo.service.js';
import { auditService } from './modules/audit/audit.service.js';
import { AuthenticatedRequest, requireRole } from './middleware/auth.js';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Nexus 0 - AICTE OneView API',
    version: '1.0.0-sih2026'
  });
});

// Demo & Persona endpoints
apiRouter.get('/demo/users', (req, res) => {
  const users = demoService.getUsers();
  res.json({ data: users });
});

apiRouter.get('/demo/bureaus', (req, res) => {
  const bureaus = demoService.getBureaus();
  res.json({ data: bureaus });
});

apiRouter.post('/demo/reset', requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const result = demoService.resetDemo(req.user!);
  res.json({ data: result });
});

// Dashboard
apiRouter.get('/dashboard/summary', (req: AuthenticatedRequest, res: Response) => {
  const summary = dashboardService.getSummary();
  res.json({ data: summary });
});

// Institutions
apiRouter.get('/institutions', (req: AuthenticatedRequest, res: Response) => {
  const search = req.query.search as string | undefined;
  const institutions = institutionsService.list(search);
  res.json({ data: institutions });
});

apiRouter.get('/institutions/:id', (req: AuthenticatedRequest, res: Response) => {
  const institution = institutionsService.getById(req.params.id);
  if (!institution) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Institution not found' } });
  }
  res.json({ data: institution });
});

apiRouter.get('/institutions/:id/cases', (req: AuthenticatedRequest, res: Response) => {
  const cases = institutionsService.getCases(req.params.id);
  res.json({ data: cases });
});

// Cases
apiRouter.get('/cases', (req: AuthenticatedRequest, res: Response) => {
  const {
    q,
    institutionId,
    bureauId,
    ownerId,
    status,
    category,
    priority,
    dueState,
    unassigned,
    page,
    pageSize,
    sortBy,
    sortOrder
  } = req.query;

  const result = casesService.list({
    q: q as string,
    institutionId: institutionId as string,
    bureauId: bureauId as string,
    ownerId: ownerId as string,
    status: status as string,
    category: category as string,
    priority: priority as string,
    dueState: dueState as any,
    unassigned: unassigned === 'true',
    page: page ? parseInt(page as string, 10) : 1,
    pageSize: pageSize ? parseInt(pageSize as string, 10) : 20,
    sortBy: sortBy as string,
    sortOrder: sortOrder as any
  });

  res.json(result);
});

apiRouter.get('/cases/:id', (req: AuthenticatedRequest, res: Response) => {
  const foundCase = casesService.getById(req.params.id);
  if (!foundCase) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Case not found' } });
  }
  res.json({ data: foundCase });
});

apiRouter.get('/cases/:id/timeline', (req: AuthenticatedRequest, res: Response) => {
  const timeline = casesService.getTimeline(req.params.id);
  res.json({ data: timeline });
});

apiRouter.post('/cases', requireRole(['leadership', 'bureau_official', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const newCase = casesService.create({
      ...req.body,
      actor: req.user!
    });
    res.status(201).json({ data: newCase });
  } catch (err: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: err.message } });
  }
});

apiRouter.post('/cases/:id/assign', requireRole(['leadership', 'bureau_official', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedCase = casesService.assign(req.params.id, {
      bureauId: req.body.bureauId,
      ownerId: req.body.ownerId,
      transferReason: req.body.transferReason,
      handoffNote: req.body.handoffNote,
      actor: req.user!
    });
    res.json({ data: updatedCase });
  } catch (err: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: err.message } });
  }
});

apiRouter.patch('/cases/:id/status', requireRole(['leadership', 'bureau_official', 'case_handler', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedCase = casesService.updateStatus(req.params.id, {
      status: req.body.status,
      note: req.body.note,
      closureSummary: req.body.closureSummary,
      actor: req.user!
    });
    res.json({ data: updatedCase });
  } catch (err: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: err.message } });
  }
});

apiRouter.patch('/cases/:id/next-action', requireRole(['leadership', 'bureau_official', 'case_handler']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedCase = casesService.updateNextAction(req.params.id, {
      nextAction: req.body.nextAction,
      nextActionDue: req.body.nextActionDue,
      actor: req.user!
    });
    res.json({ data: updatedCase });
  } catch (err: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: err.message } });
  }
});

// Related Cases
apiRouter.get('/cases/:id/related', (req: AuthenticatedRequest, res: Response) => {
  const candidates = relatedService.getCandidates(req.params.id);
  res.json({ data: candidates });
});

apiRouter.post('/cases/:id/related/:candidateId/review', requireRole(['leadership', 'bureau_official', 'case_handler', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = relatedService.reviewCandidate(req.params.id, req.params.candidateId, {
      status: req.body.status,
      reviewNote: req.body.reviewNote,
      actor: req.user!
    });
    res.json({ data: result });
  } catch (err: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: err.message } });
  }
});

// Reports & CSV export
apiRouter.get('/reports/summary', (req: AuthenticatedRequest, res: Response) => {
  const summary = reportsService.getSummary();
  res.json({ data: summary });
});

apiRouter.get('/reports/export.csv', (req: AuthenticatedRequest, res: Response) => {
  const csv = reportsService.exportCsv(req.user!, req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="nexus-cases-export-${Date.now()}.csv"`);
  res.send(csv);
});

// Audit
apiRouter.get('/audit', requireRole(['leadership', 'auditor', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  const targetType = req.query.targetType as string | undefined;
  const events = auditService.list({ limit, targetType });
  res.json({ data: events });
});

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'nexus0.db');

export const db: InstanceType<typeof Database> = new Database(DB_PATH);

// Enable WAL mode and foreign keys for performance and consistency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bureaus (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      demo_email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      designation TEXT NOT NULL,
      bureau_id TEXT REFERENCES bureaus(id) ON DELETE SET NULL,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      institution_code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      institution_type TEXT NOT NULL,
      source_reference TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      case_number TEXT NOT NULL UNIQUE,
      source_case_id TEXT,
      institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
      category TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'Medium',
      summary TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Open',
      current_bureau_id TEXT NOT NULL REFERENCES bureaus(id) ON DELETE RESTRICT,
      current_owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      due_at TEXT,
      next_action TEXT,
      next_action_due TEXT,
      closure_summary TEXT,
      closed_at TEXT,
      source_name TEXT DEFAULT 'AICTE Central Portal',
      source_updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      bureau_id TEXT NOT NULL REFERENCES bureaus(id) ON DELETE RESTRICT,
      owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      assigned_by TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      transfer_reason TEXT,
      handoff_note TEXT
    );

    CREATE TABLE IF NOT EXISTS case_events (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      actor_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      event_type TEXT NOT NULL,
      from_value TEXT,
      to_value TEXT,
      note TEXT,
      created_at TEXT NOT NULL,
      metadata TEXT
    );

    CREATE TABLE IF NOT EXISTS related_case_reviews (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      candidate_case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      match_reasons TEXT NOT NULL,
      similarity_score REAL NOT NULL,
      review_status TEXT NOT NULL DEFAULT 'pending',
      reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      reviewed_at TEXT,
      review_note TEXT,
      UNIQUE(case_id, candidate_case_id)
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      actor_id TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      role TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      result TEXT NOT NULL,
      created_at TEXT NOT NULL,
      metadata TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(case_number);
    CREATE INDEX IF NOT EXISTS idx_cases_institution ON cases(institution_id);
    CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
    CREATE INDEX IF NOT EXISTS idx_cases_bureau ON cases(current_bureau_id);
    CREATE INDEX IF NOT EXISTS idx_cases_owner ON cases(current_owner_id);
    CREATE INDEX IF NOT EXISTS idx_cases_due_at ON cases(due_at);
    CREATE INDEX IF NOT EXISTS idx_institutions_code ON institutions(institution_code);
    CREATE INDEX IF NOT EXISTS idx_assignments_case ON assignments(case_id);
    CREATE INDEX IF NOT EXISTS idx_case_events_case ON case_events(case_id);
  `);
}

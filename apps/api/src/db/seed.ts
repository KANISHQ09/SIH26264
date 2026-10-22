import { db, initSchema } from './connection.js';

export function runSeed() {
  initSchema();

  // Clean existing data
  const tables = [
    'audit_events',
    'action_taken_reports',
    'related_case_reviews',
    'case_events',
    'assignments',
    'cases',
    'institutions',
    'users',
    'bureaus'
  ];

  db.transaction(() => {
    for (const table of tables) {
      db.prepare(`DELETE FROM ${table}`).run();
    }

    // 1. Bureaus (Specifically highlighting Regulation Bureau and PGRC as mandated by PS 26264)
    const insertBureau = db.prepare(`
      INSERT INTO bureaus (id, name, code, active) VALUES (?, ?, ?, ?)
    `);

    const bureaus = [
      { id: 'bur-rb', name: 'Regulation Bureau (RB)', code: 'BUR-RB', active: 1 },
      { id: 'bur-pgrc', name: 'Public Grievance Redressal Cell (PGRC)', code: 'BUR-PGRC', active: 1 },
      { id: 'bur-approval', name: 'Approval Bureau (AB)', code: 'BUR-APP', active: 1 },
      { id: 'bur-academic', name: 'Policy & Academic Planning Bureau', code: 'BUR-ACAD', active: 1 },
      { id: 'bur-faculty', name: 'Faculty Development & Welfare Cell', code: 'BUR-FDW', active: 1 }
    ];

    for (const b of bureaus) {
      insertBureau.run(b.id, b.name, b.code, b.active);
    }

    // 2. Exactly 8 Demo Personas
    const insertUser = db.prepare(`
      INSERT INTO users (id, display_name, demo_email, role, designation, bureau_id, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const users = [
      {
        id: 'usr-leadership',
        display_name: 'Dr. Anil Sahasrabudhe',
        demo_email: 'anil.sahasrabudhe@aicte.gov.in.demo',
        role: 'leadership',
        designation: 'Chairman / Member Secretary',
        bureau_id: null,
        active: 1
      },
      {
        id: 'usr-rb-head',
        display_name: 'Dr. M. S. Manna',
        demo_email: 'ms.manna@aicte.gov.in.demo',
        role: 'bureau_official',
        designation: 'Director, Regulation Bureau (RB)',
        bureau_id: 'bur-rb',
        active: 1
      },
      {
        id: 'usr-pgrc-head',
        display_name: 'Prof. Rajive Kumar',
        demo_email: 'rajive.kumar@aicte.gov.in.demo',
        role: 'bureau_official',
        designation: 'Incharge, Public Grievance Redressal Cell (PGRC)',
        bureau_id: 'bur-pgrc',
        active: 1
      },
      {
        id: 'usr-handler',
        display_name: 'Er. Neha Sharma',
        demo_email: 'neha.sharma@aicte.gov.in.demo',
        role: 'case_handler',
        designation: 'Senior Technical Officer (RB)',
        bureau_id: 'bur-rb',
        active: 1
      },
      {
        id: 'usr-auditor',
        display_name: 'Sunil Verma',
        demo_email: 'sunil.verma@aicte.gov.in.demo',
        role: 'auditor',
        designation: 'Vigilance & Compliance Officer',
        bureau_id: 'bur-rb',
        active: 1
      },
      {
        id: 'usr-admin',
        display_name: 'Amit Patel',
        demo_email: 'amit.patel@aicte.gov.in.demo',
        role: 'admin',
        designation: 'System Administrator',
        bureau_id: null,
        active: 1
      },
      {
        id: 'usr-student',
        display_name: 'Aarav Sharma',
        demo_email: 'aarav.sharma@student.demo',
        role: 'student',
        designation: '3rd Year B.Tech Student (Complainant)',
        bureau_id: null,
        active: 1
      },
      {
        id: 'usr-institution',
        display_name: 'Dr. Meenakshi Sundaram',
        demo_email: 'principal@rgpvdemo.edu.in.demo',
        role: 'institution',
        designation: 'Principal & Registrar, RGPV Demo Institute',
        bureau_id: null,
        active: 1
      }
    ];

    for (const u of users) {
      insertUser.run(u.id, u.display_name, u.demo_email, u.role, u.designation, u.bureau_id, u.active);
    }

    // 3. Institutions (8 sample institutions across all AICTE Regions)
    const insertInst = db.prepare(`
      INSERT INTO institutions (id, institution_code, aicte_permanent_id, name, city, state, region, institution_type, source_reference, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const institutions = [
      {
        id: 'inst-01',
        institution_code: 'AICTE-MH-2024-ENG-089',
        aicte_permanent_id: '1-3321458291',
        name: 'RGPV Demonstration Institute of Engineering & Technology',
        city: 'Pune',
        state: 'Maharashtra',
        region: 'WRO',
        institution_type: 'Engineering & Technology',
        source_reference: 'REG-WRO-2024-8841',
        updated_at: '2026-10-18T10:00:00Z'
      },
      {
        id: 'inst-02',
        institution_code: 'AICTE-DL-2023-MGT-042',
        aicte_permanent_id: '1-4921008112',
        name: 'National Capital Institute of Business & Management',
        city: 'New Delhi',
        state: 'Delhi',
        region: 'NRO',
        institution_type: 'Management',
        source_reference: 'REG-NRO-2023-1120',
        updated_at: '2026-10-19T08:30:00Z'
      },
      {
        id: 'inst-03',
        institution_code: 'AICTE-KA-2022-ENG-118',
        aicte_permanent_id: '1-2291884021',
        name: 'Deccan Institute of Advanced Technology & Applied Sciences',
        city: 'Bengaluru',
        state: 'Karnataka',
        region: 'SWRO',
        institution_type: 'Engineering & Technology',
        source_reference: 'REG-SWRO-2022-0941',
        updated_at: '2026-10-15T14:15:00Z'
      },
      {
        id: 'inst-04',
        institution_code: 'AICTE-TN-2024-ENG-304',
        aicte_permanent_id: '1-8841029411',
        name: 'Southern Coastal Polytechnic & Engineering College',
        city: 'Chennai',
        state: 'Tamil Nadu',
        region: 'SRO',
        institution_type: 'Polytechnic & Applied Sciences',
        source_reference: 'REG-SRO-2024-7719',
        updated_at: '2026-10-17T11:45:00Z'
      },
      {
        id: 'inst-05',
        institution_code: 'AICTE-WB-2023-PHA-017',
        aicte_permanent_id: '1-5519820019',
        name: 'East India Institute of Pharmaceutical Sciences & Research',
        city: 'Kolkata',
        state: 'West Bengal',
        region: 'ERO',
        institution_type: 'Pharmacy',
        source_reference: 'REG-ERO-2023-3391',
        updated_at: '2026-10-16T16:20:00Z'
      },
      {
        id: 'inst-06',
        institution_code: 'AICTE-MP-2022-ENG-065',
        aicte_permanent_id: '1-7738192004',
        name: 'Malwa Technical Academy of Sciences & Engineering',
        city: 'Indore',
        state: 'Madhya Pradesh',
        region: 'CRO',
        institution_type: 'Engineering & Technology',
        source_reference: 'REG-CRO-2022-5502',
        updated_at: '2026-10-20T09:00:00Z'
      },
      {
        id: 'inst-07',
        institution_code: 'AICTE-RJ-2024-ARC-009',
        aicte_permanent_id: '1-6629103991',
        name: 'Desert School of Architecture & Urban Design',
        city: 'Jaipur',
        state: 'Rajasthan',
        region: 'NWRO',
        institution_type: 'Architecture & Planning',
        source_reference: 'REG-NWRO-2024-2194',
        updated_at: '2026-10-14T13:10:00Z'
      },
      {
        id: 'inst-08',
        institution_code: 'AICTE-UP-2023-MCA-081',
        aicte_permanent_id: '1-1182993002',
        name: 'Ganga Institute of Computer Applications & Information Tech',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        region: 'NRO',
        institution_type: 'Computer Applications & MCA',
        source_reference: 'REG-NRO-2023-6621',
        updated_at: '2026-10-18T15:40:00Z'
      }
    ];

    for (const inst of institutions) {
      insertInst.run(
        inst.id,
        inst.institution_code,
        inst.aicte_permanent_id,
        inst.name,
        inst.city,
        inst.state,
        inst.region,
        inst.institution_type,
        inst.source_reference,
        inst.updated_at
      );
    }

    // 4. Cases
    const insertCase = db.prepare(`
      INSERT INTO cases (
        id, case_number, source_case_id, institution_id, category, priority,
        summary, status, escalation_level, current_bureau_id, current_owner_id,
        complainant_name, complainant_email, is_anonymous, created_at, updated_at,
        due_at, next_action, next_action_due, closure_summary, closed_at, source_name, source_updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date();
    const isoHoursFromNow = (hours: number) => new Date(now.getTime() + hours * 3600 * 1000).toISOString();
    const isoDaysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 3600 * 1000).toISOString();

    const cases = [
      // Case 1: Core RB Inspection Case on RGPV (triggers overlap with Case 4 in PGRC)
      {
        id: 'case-01',
        case_number: 'CASE-2026-0101',
        source_case_id: 'CPGRAMS-2026-D00918',
        institution_id: 'inst-01',
        category: 'Regulation Violation',
        priority: 'High',
        summary: 'Inquiry into unauthorized intake expansion in B.Tech Artificial Intelligence & Data Science and violation of mandatory faculty cadre ratio (1:15).',
        status: 'Under Process',
        escalation_level: 1,
        current_bureau_id: 'bur-rb',
        current_owner_id: 'usr-handler',
        complainant_name: 'AICTE Vigilance Committee (Suo Motu)',
        complainant_email: 'vigilance.rb@aicte.gov.in.demo',
        is_anonymous: 0,
        created_at: isoDaysFromNow(-6),
        updated_at: isoHoursFromNow(-4),
        due_at: isoDaysFromNow(8),
        next_action: 'Scrutinize institutional compliance affidavit and faculty appointment orders',
        next_action_due: isoDaysFromNow(3),
        closure_summary: null,
        closed_at: null,
        source_name: 'Regulation Bureau Inward',
        source_updated_at: isoHoursFromNow(-4)
      },

      // Case 2: Overdue Case with SLA Escalation History (Demo Step 3)
      {
        id: 'case-02',
        case_number: 'CASE-2026-0102',
        source_case_id: 'PG-2026-09941',
        institution_id: 'inst-02',
        category: 'Fee & Admissions',
        priority: 'Urgent',
        summary: 'Non-refund of caution deposit and unapproved mandatory laptop fee levied upon 140 first-year MBA students.',
        status: 'Escalated',
        escalation_level: 2, // Escalated to Bureau Head
        current_bureau_id: 'bur-pgrc',
        current_owner_id: 'usr-pgrc-head',
        complainant_name: 'Student Welfare Association (Delhi Chapter)',
        complainant_email: 'student.welfare@delhi.demo',
        is_anonymous: 0,
        created_at: isoDaysFromNow(-18),
        updated_at: isoDaysFromNow(-1),
        due_at: isoDaysFromNow(-3), // Past due (OVERDUE)
        next_action: 'Summon Director and Registrar for personal hearing before Member Secretary',
        next_action_due: isoHoursFromNow(24),
        closure_summary: null,
        closed_at: null,
        source_name: 'PGRC Portal',
        source_updated_at: isoDaysFromNow(-1)
      },

      // Case 3: Due Soon Case (SLA Countdown < 48 hours)
      {
        id: 'case-03',
        case_number: 'CASE-2026-0103',
        source_case_id: 'APP-REV-2026-118',
        institution_id: 'inst-03',
        category: 'Approvals',
        priority: 'Medium',
        summary: 'Discrepancy in fire safety certification and built-up instructional area for newly proposed M.Tech Robotics block.',
        status: 'Under Process',
        escalation_level: 1,
        current_bureau_id: 'bur-approval',
        current_owner_id: 'usr-handler',
        complainant_name: 'Regional Inspection Team (SWRO)',
        complainant_email: 'inspections.swro@aicte.gov.in.demo',
        is_anonymous: 0,
        created_at: isoDaysFromNow(-8),
        updated_at: isoHoursFromNow(-6),
        due_at: isoHoursFromNow(18), // Due in 18 hours (DUE SOON)
        next_action: 'Submit revised architect floor-plan validation certificate',
        next_action_due: isoHoursFromNow(12),
        closure_summary: null,
        closed_at: null,
        source_name: 'Approval Bureau Scrutiny Desk',
        source_updated_at: isoHoursFromNow(-6)
      },

      // Case 4: Student Grievance on RGPV (Triggers Overlap with Case 1 in RB!)
      {
        id: 'case-04',
        case_number: 'CASE-2026-0104',
        source_case_id: 'CPGRAMS-2026-M44109',
        institution_id: 'inst-01',
        category: 'Student Grievance',
        priority: 'High',
        summary: 'Denial of fee refund upon admission withdrawal and illegal withholding of original 10th and 12th marksheets by college administration.',
        status: 'Under Process',
        escalation_level: 1,
        current_bureau_id: 'bur-pgrc',
        current_owner_id: 'usr-pgrc-head',
        complainant_name: 'Aarav Sharma (Student Complainant)',
        complainant_email: 'aarav.sharma@student.demo',
        is_anonymous: 0,
        created_at: isoDaysFromNow(-7),
        updated_at: isoHoursFromNow(-10),
        due_at: isoDaysFromNow(7),
        next_action: 'Await Action Taken Report (ATR) from Principal with proof of returned certificates',
        next_action_due: isoDaysFromNow(2),
        closure_summary: null,
        closed_at: null,
        source_name: 'National Grievance Inward (PGRC)',
        source_updated_at: isoHoursFromNow(-10)
      },

      // Case 5: Infrastructure Deficiency in Tamil Nadu
      {
        id: 'case-05',
        case_number: 'CASE-2026-0105',
        source_case_id: 'CPGRAMS-2026-S8912',
        institution_id: 'inst-04',
        category: 'Infrastructure',
        priority: 'Medium',
        summary: 'Failure to provide required clean drinking water plants, barrier-free ramps, and disabled-friendly restrooms in academic block C.',
        status: 'Under Process',
        escalation_level: 1,
        current_bureau_id: 'bur-rb',
        current_owner_id: 'usr-handler',
        complainant_name: 'Differently-Abled Students Collective',
        complainant_email: 'advocacy.sro@demo',
        is_anonymous: 0,
        created_at: isoDaysFromNow(-10),
        updated_at: isoDaysFromNow(-2),
        due_at: isoDaysFromNow(11),
        next_action: 'Verify physical inspection geotagged photographs submitted by SRO nodal officer',
        next_action_due: isoDaysFromNow(4),
        closure_summary: null,
        closed_at: null,
        source_name: 'SRO Zonal Grievance Desk',
        source_updated_at: isoDaysFromNow(-2)
      },

      // Case 6: Faculty Salary Withholding in West Bengal
      {
        id: 'case-06',
        case_number: 'CASE-2026-0106',
        source_case_id: 'FAC-WB-2026-0041',
        institution_id: 'inst-05',
        category: 'Faculty & Staff',
        priority: 'Urgent',
        summary: 'Non-payment of 7th CPC revised scale salaries and delay of 4 months in disbursement of stipend to pharmacy teaching fellows.',
        status: 'Pending',
        escalation_level: 1,
        current_bureau_id: 'bur-faculty',
        current_owner_id: null, // Unassigned
        complainant_name: 'Confederation of Pharmacy Faculty',
        complainant_email: 'faculty.union@wb.demo',
        is_anonymous: 0,
        created_at: isoDaysFromNow(-2),
        updated_at: isoDaysFromNow(-2),
        due_at: isoDaysFromNow(12),
        next_action: 'Assign desk officer and issue formal notice to Governing Body Chairman',
        next_action_due: isoDaysFromNow(1),
        closure_summary: null,
        closed_at: null,
        source_name: 'Faculty Cell Portal',
        source_updated_at: isoDaysFromNow(-2)
      },

      // Case 7: Disposed / Resolved Case (for reports and audit demonstration)
      {
        id: 'case-07',
        case_number: 'CASE-2026-0107',
        source_case_id: 'EXAM-2026-081',
        institution_id: 'inst-06',
        category: 'Examination',
        priority: 'Low',
        summary: 'Delay in publication of revaluation results for 6th semester mechanical engineering examination.',
        status: 'Disposed',
        escalation_level: 1,
        current_bureau_id: 'bur-academic',
        current_owner_id: 'usr-handler',
        complainant_name: 'Batch of 2025 Representatives',
        complainant_email: 'students.mp@demo',
        is_anonymous: 0,
        created_at: isoDaysFromNow(-25),
        updated_at: isoDaysFromNow(-5),
        due_at: isoDaysFromNow(-10),
        next_action: 'Disposed — results published and certified by University Examination Controller',
        next_action_due: null,
        closure_summary: 'University Examination Controller submitted official notification dated 15th October confirming declaration of revaluation marks. Grievance closed with complainant satisfaction.',
        closed_at: isoDaysFromNow(-5),
        source_name: 'Academic Bureau Desk',
        source_updated_at: isoDaysFromNow(-5)
      },

      // Case 8: Approval Bureau Notice on RGPV (3rd Bureau on RGPV)
      {
        id: 'case-08',
        case_number: 'CASE-2026-0108',
        source_case_id: 'EOA-2026-WRO-99',
        institution_id: 'inst-01',
        category: 'Approvals',
        priority: 'Medium',
        summary: 'Scrutiny of land title deed and compliance with AICTE Approval Process Handbook (APH 2026-27).',
        status: 'Pending',
        escalation_level: 1,
        current_bureau_id: 'bur-approval',
        current_owner_id: 'usr-handler',
        complainant_name: 'Scrutiny Committee (WRO)',
        complainant_email: 'approvals.wro@aicte.gov.in.demo',
        is_anonymous: 0,
        created_at: isoDaysFromNow(-4),
        updated_at: isoDaysFromNow(-1),
        due_at: isoDaysFromNow(16),
        next_action: 'Verification of municipal corporation building approval certificate',
        next_action_due: isoDaysFromNow(5),
        closure_summary: null,
        closed_at: null,
        source_name: 'Approval Scrutiny System',
        source_updated_at: isoDaysFromNow(-1)
      }
    ];

    for (const c of cases) {
      insertCase.run(
        c.id,
        c.case_number,
        c.source_case_id,
        c.institution_id,
        c.category,
        c.priority,
        c.summary,
        c.status,
        c.escalation_level,
        c.current_bureau_id,
        c.current_owner_id,
        c.complainant_name,
        c.complainant_email,
        c.is_anonymous,
        c.created_at,
        c.updated_at,
        c.due_at,
        c.next_action,
        c.next_action_due,
        c.closure_summary,
        c.closed_at,
        c.source_name,
        c.source_updated_at
      );
    }

    // 5. Assignments (with complete audit handshakes)
    const insertAssignment = db.prepare(`
      INSERT INTO assignments (id, case_id, bureau_id, owner_id, assigned_by, started_at, ended_at, transfer_reason, handoff_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const assignments = [
      {
        id: 'asg-01',
        case_id: 'case-01',
        bureau_id: 'bur-rb',
        owner_id: 'usr-handler',
        assigned_by: 'usr-rb-head',
        started_at: isoDaysFromNow(-6),
        ended_at: null,
        transfer_reason: 'Statutory verification initiated under Regulation Bureau mandate',
        handoff_note: 'Please verify the approved AICTE student intake capacity against ERP enrollment rolls.'
      },
      {
        id: 'asg-02-prev',
        case_id: 'case-02',
        bureau_id: 'bur-pgrc',
        owner_id: 'usr-handler',
        assigned_by: 'usr-pgrc-head',
        started_at: isoDaysFromNow(-18),
        ended_at: isoDaysFromNow(-3),
        transfer_reason: 'Initial intake and preliminary institution inquiry',
        handoff_note: 'Initial show-cause issued to college; response deadline expired without reply.'
      },
      {
        id: 'asg-02-current',
        case_id: 'case-02',
        bureau_id: 'bur-pgrc',
        owner_id: 'usr-pgrc-head',
        assigned_by: 'usr-leadership',
        started_at: isoDaysFromNow(-3),
        ended_at: null,
        transfer_reason: 'Automated SLA Breach: Escalated to Level 2 (Bureau Head / Incharge)',
        handoff_note: 'Prescribed 15-day resolution window exceeded without institution compliance. Personal hearing mandated.'
      },
      {
        id: 'asg-03',
        case_id: 'case-03',
        bureau_id: 'bur-approval',
        owner_id: 'usr-handler',
        assigned_by: 'usr-rb-head',
        started_at: isoDaysFromNow(-8),
        ended_at: null,
        transfer_reason: 'Assigned for urgent 48h deadline compliance check',
        handoff_note: 'Inspection committee report due within 18 hours.'
      },
      {
        id: 'asg-04',
        case_id: 'case-04',
        bureau_id: 'bur-pgrc',
        owner_id: 'usr-pgrc-head',
        assigned_by: 'usr-leadership',
        started_at: isoDaysFromNow(-7),
        ended_at: null,
        transfer_reason: 'Direct student grievance registered via CPGRAMS integration',
        handoff_note: 'Notice issued to Principal Dr. Meenakshi Sundaram to submit Action Taken Report (ATR).'
      }
    ];

    for (const a of assignments) {
      insertAssignment.run(
        a.id,
        a.case_id,
        a.bureau_id,
        a.owner_id,
        a.assigned_by,
        a.started_at,
        a.ended_at,
        a.transfer_reason,
        a.handoff_note
      );
    }

    // 6. Case Events (Chronological Timeline)
    const insertEvent = db.prepare(`
      INSERT INTO case_events (id, case_id, actor_id, event_type, from_value, to_value, note, created_at, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const events = [
      {
        id: 'evt-01',
        case_id: 'case-01',
        actor_id: 'usr-rb-head',
        event_type: 'CASE_CREATED',
        from_value: null,
        to_value: 'Under Process',
        note: 'Regulatory investigation opened based on vigilance inspection findings.',
        created_at: isoDaysFromNow(-6),
        metadata: JSON.stringify({ category: 'Regulation Violation', priority: 'High' })
      },
      {
        id: 'evt-02',
        case_id: 'case-01',
        actor_id: 'usr-rb-head',
        event_type: 'CASE_ASSIGNED',
        from_value: null,
        to_value: 'Er. Neha Sharma',
        note: 'Desk Officer assigned for document scrutiny and cadre verification.',
        created_at: isoDaysFromNow(-6),
        metadata: JSON.stringify({ bureau: 'Regulation Bureau (RB)' })
      },
      {
        id: 'evt-03',
        case_id: 'case-02',
        actor_id: 'usr-pgrc-head',
        event_type: 'CASE_CREATED',
        from_value: null,
        to_value: 'Under Process',
        note: 'Student welfare grievance registered regarding unlawful MBA laptop fees.',
        created_at: isoDaysFromNow(-18),
        metadata: JSON.stringify({ source: 'PGRC Inward' })
      },
      {
        id: 'evt-04',
        case_id: 'case-02',
        actor_id: 'usr-admin',
        event_type: 'SLA_BREACH_DETECTED',
        from_value: 'Under Process',
        to_value: 'Overdue',
        note: 'SLA deadline expired without resolution. Deterministic rule triggered escalation to Level 2.',
        created_at: isoDaysFromNow(-3),
        metadata: JSON.stringify({ overdue_hours: 72, escalation_tier: 'Level 2' })
      },
      {
        id: 'evt-05',
        case_id: 'case-02',
        actor_id: 'usr-leadership',
        event_type: 'CASE_ESCALATED',
        from_value: 'Er. Neha Sharma',
        to_value: 'Prof. Rajive Kumar',
        note: 'Case escalated to Incharge PGRC for formal summoning of college authorities.',
        created_at: isoDaysFromNow(-3),
        metadata: JSON.stringify({ reason: 'SLA Breach Timeout' })
      },
      {
        id: 'evt-06',
        case_id: 'case-04',
        actor_id: 'usr-student',
        event_type: 'GRIEVANCE_FILED',
        from_value: null,
        to_value: 'Pending',
        note: 'Student Aarav Sharma filed grievance regarding withheld certificates and refused fee refund.',
        created_at: isoDaysFromNow(-7),
        metadata: JSON.stringify({ roll_no: '2023CS041', documents_attached: 2 })
      },
      {
        id: 'evt-07',
        case_id: 'case-04',
        actor_id: 'usr-pgrc-head',
        event_type: 'NOTICE_ISSUED_TO_COLLEGE',
        from_value: 'Pending',
        to_value: 'Under Process',
        note: 'Show-Cause Notice issued to Principal Dr. Meenakshi Sundaram requiring Action Taken Report (ATR) within 7 days.',
        created_at: isoDaysFromNow(-5),
        metadata: JSON.stringify({ notice_ref: 'AICTE/PGRC/2026/SC-881' })
      }
    ];

    for (const e of events) {
      insertEvent.run(e.id, e.case_id, e.actor_id, e.event_type, e.from_value, e.to_value, e.note, e.created_at, e.metadata);
    }

    // 7. Related Case Reviews (Pre-seeded Cross-Bureau Overlap Candidate)
    const insertRelated = db.prepare(`
      INSERT INTO related_case_reviews (
        id, case_id, candidate_case_id, match_reasons, similarity_score, review_status, reviewed_by, reviewed_at, review_note
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const related = [
      {
        id: 'rel-01',
        case_id: 'case-01', // RB case on RGPV
        candidate_case_id: 'case-04', // PGRC case on RGPV
        match_reasons: JSON.stringify([
          'Identical AICTE Permanent ID (1-3321458291)',
          'Common Institution: RGPV Demonstration Institute',
          'Cross-Bureau Overlap: Regulation Bureau (RB) and PGRC concurrently dealing with same administration',
          'Potential Conflict: Coordinated inquiry required before EoA renewal'
        ]),
        similarity_score: 0.94,
        review_status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        review_note: null
      }
    ];

    for (const r of related) {
      insertRelated.run(
        r.id,
        r.case_id,
        r.candidate_case_id,
        r.match_reasons,
        r.similarity_score,
        r.review_status,
        r.reviewed_by,
        r.reviewed_at,
        r.review_note
      );
    }

    // 8. Action Taken Reports (Initial seed for Dr. Meenakshi Sundaram)
    const insertAtr = db.prepare(`
      INSERT INTO action_taken_reports (
        id, case_id, institution_id, submitted_by_name, submitted_by_role, submission_text, action_taken_date, evidence_files, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAtr.run(
      'atr-01',
      'case-04',
      'inst-01',
      'Dr. Meenakshi Sundaram',
      'Principal, RGPV Demo Institute',
      'The college Grievance Redressal Committee met on 18th October. Original 10th and 12th certificates have been verified and made available for immediate collection. The fee refund voucher of Rs. 42,500 has been sanctioned via RTGS reference RTGS-PUNB-881290.',
      isoDaysFromNow(-2),
      JSON.stringify(['RTGS_Bank_Receipt_42500.pdf', 'GRC_Meeting_Minutes_18Oct.pdf']),
      isoDaysFromNow(-2)
    );

    // 9. Audit Events (Immutable Append-Only Audit Trail)
    const insertAudit = db.prepare(`
      INSERT INTO audit_events (id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const audits = [
      {
        id: 'aud-01',
        actor_id: 'usr-admin',
        actor_name: 'Amit Patel',
        role: 'admin',
        action: 'SYSTEM_BOOTSTRAP_SEED',
        target_type: 'system',
        target_id: 'database',
        result: 'SUCCESS',
        created_at: isoDaysFromNow(-18),
        metadata: JSON.stringify({ version: '1.0.0-sih2026', total_institutions: 8, total_cases: 8 })
      },
      {
        id: 'aud-02',
        actor_id: 'usr-rb-head',
        actor_name: 'Dr. M. S. Manna',
        role: 'bureau_official',
        action: 'CASE_ASSIGNMENT',
        target_type: 'case',
        target_id: 'case-01',
        result: 'SUCCESS',
        created_at: isoDaysFromNow(-6),
        metadata: JSON.stringify({ case_number: 'CASE-2026-0101', assigned_to: 'Er. Neha Sharma', bureau: 'Regulation Bureau' })
      },
      {
        id: 'aud-03',
        actor_id: 'usr-leadership',
        actor_name: 'Dr. Anil Sahasrabudhe',
        role: 'leadership',
        action: 'AUTOMATED_ESCALATION_TRIGGERED',
        target_type: 'case',
        target_id: 'case-02',
        result: 'SUCCESS',
        created_at: isoDaysFromNow(-3),
        metadata: JSON.stringify({ case_number: 'CASE-2026-0102', reason: 'SLA overdue breach', from_level: 1, to_level: 2 })
      },
      {
        id: 'aud-04',
        actor_id: 'usr-institution',
        actor_name: 'Dr. Meenakshi Sundaram',
        role: 'institution',
        action: 'ACTION_TAKEN_REPORT_SUBMITTED',
        target_type: 'case',
        target_id: 'case-04',
        result: 'SUCCESS',
        created_at: isoDaysFromNow(-2),
        metadata: JSON.stringify({ case_number: 'CASE-2026-0104', institution: 'RGPV Demo Institute', atr_id: 'atr-01' })
      }
    ];

    for (const aud of audits) {
      insertAudit.run(
        aud.id,
        aud.actor_id,
        aud.actor_name,
        aud.role,
        aud.action,
        aud.target_type,
        aud.target_id,
        aud.result,
        aud.created_at,
        aud.metadata
      );
    }
  })();

  console.log('Seed executed successfully with 8 personas, 8 institutions, and 5-step demo datasets.');
}

if (process.argv[1]?.endsWith('seed.ts')) {
  runSeed();
}

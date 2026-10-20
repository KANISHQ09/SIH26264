import { db, initSchema } from './connection.js';

export function runSeed() {
  initSchema();

  // Clean existing data
  const tables = [
    'audit_events',
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

    // 1. Bureaus
    const insertBureau = db.prepare(`
      INSERT INTO bureaus (id, name, code, active) VALUES (?, ?, ?, ?)
    `);

    const bureaus = [
      { id: 'bur-approval', name: 'Approval & Affiliation Bureau', code: 'BUR-APP', active: 1 },
      { id: 'bur-academic', name: 'Policy & Academic Planning Bureau', code: 'BUR-ACAD', active: 1 },
      { id: 'bur-faculty', name: 'Faculty Development & Welfare Cell', code: 'BUR-FDW', active: 1 },
      { id: 'bur-vigilance', name: 'Regulation, Redressal & Vigilance Cell', code: 'BUR-VIG', active: 1 },
      { id: 'bur-grievance', name: 'Student Grievance Redressal Cell', code: 'BUR-SGR', active: 1 }
    ];

    for (const b of bureaus) {
      insertBureau.run(b.id, b.name, b.code, b.active);
    }

    // 2. Demo Users
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
        designation: 'Director General',
        bureau_id: null,
        active: 1
      },
      {
        id: 'usr-bureau-head',
        display_name: 'Prof. Rajive Kumar',
        demo_email: 'rajive.kumar@aicte.gov.in.demo',
        role: 'bureau_official',
        designation: 'Member Secretary (Approvals)',
        bureau_id: 'bur-approval',
        active: 1
      },
      {
        id: 'usr-handler',
        display_name: 'Er. Neha Sharma',
        demo_email: 'neha.sharma@aicte.gov.in.demo',
        role: 'case_handler',
        designation: 'Senior Technical Officer',
        bureau_id: 'bur-approval',
        active: 1
      },
      {
        id: 'usr-auditor',
        display_name: 'Sunil Verma',
        demo_email: 'sunil.verma@aicte.gov.in.demo',
        role: 'auditor',
        designation: 'Vigilance & Compliance Officer',
        bureau_id: 'bur-vigilance',
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
        id: 'usr-handler-2',
        display_name: 'Dr. Priya Nambiar',
        demo_email: 'priya.nambiar@aicte.gov.in.demo',
        role: 'case_handler',
        designation: 'Assistant Director (Academic)',
        bureau_id: 'bur-academic',
        active: 1
      },
      {
        id: 'usr-handler-3',
        display_name: 'Vikramaditya Rao',
        demo_email: 'vikram.rao@aicte.gov.in.demo',
        role: 'case_handler',
        designation: 'Desk Officer (Grievance)',
        bureau_id: 'bur-grievance',
        active: 1
      }
    ];

    for (const u of users) {
      insertUser.run(u.id, u.display_name, u.demo_email, u.role, u.designation, u.bureau_id, u.active);
    }

    // 3. Institutions (8 diverse sample institutions)
    const insertInst = db.prepare(`
      INSERT INTO institutions (id, institution_code, name, city, state, institution_type, source_reference, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const institutions = [
      {
        id: 'inst-01',
        institution_code: 'AICTE-MH-2024-ENG-089',
        name: 'RGPV Demonstration Institute of Engineering & Technology',
        city: 'Pune',
        state: 'Maharashtra',
        institution_type: 'Engineering & Technology',
        source_reference: 'REG-WRO-2024-8841',
        updated_at: '2026-10-18T10:00:00Z'
      },
      {
        id: 'inst-02',
        institution_code: 'AICTE-DL-2023-MGT-042',
        name: 'National Capital Institute of Business & Management',
        city: 'New Delhi',
        state: 'Delhi',
        institution_type: 'Management',
        source_reference: 'REG-NRO-2023-1120',
        updated_at: '2026-10-15T09:30:00Z'
      },
      {
        id: 'inst-03',
        institution_code: 'AICTE-KA-2022-ENG-319',
        name: 'Silicon Valley College of Technology and Research',
        city: 'Bengaluru',
        state: 'Karnataka',
        institution_type: 'Engineering & Technology',
        source_reference: 'REG-SWRO-2022-9401',
        updated_at: '2026-10-17T14:15:00Z'
      },
      {
        id: 'inst-04',
        institution_code: 'AICTE-TN-2024-PHARM-115',
        name: 'Coromandel College of Pharmaceutical Sciences',
        city: 'Chennai',
        state: 'Tamil Nadu',
        institution_type: 'Pharmacy',
        source_reference: 'REG-SRO-2024-3329',
        updated_at: '2026-10-12T11:00:00Z'
      },
      {
        id: 'inst-05',
        institution_code: 'AICTE-UP-2023-POLY-067',
        name: 'Ganga Valley Polytechnic & Skill Academy',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        institution_type: 'Polytechnic',
        source_reference: 'REG-NRO-2023-7744',
        updated_at: '2026-10-19T08:45:00Z'
      },
      {
        id: 'inst-06',
        institution_code: 'AICTE-TG-2024-MCA-081',
        name: 'Deccan Institute of Advanced Computing & MCA',
        city: 'Hyderabad',
        state: 'Telangana',
        institution_type: 'Computer Applications',
        source_reference: 'REG-SCRO-2024-5102',
        updated_at: '2026-10-16T16:20:00Z'
      },
      {
        id: 'inst-07',
        institution_code: 'AICTE-WB-2023-ENG-204',
        name: 'Bengal Institute of Maritime Engineering & Naval Tech',
        city: 'Kolkata',
        state: 'West Bengal',
        institution_type: 'Engineering & Technology',
        source_reference: 'REG-ERO-2023-4419',
        updated_at: '2026-10-14T12:00:00Z'
      },
      {
        id: 'inst-08',
        institution_code: 'AICTE-MP-2024-ENG-055',
        name: 'Malwa Technical University Campus College',
        city: 'Indore',
        state: 'Madhya Pradesh',
        institution_type: 'Engineering & Technology',
        source_reference: 'REG-CRO-2024-1099',
        updated_at: '2026-10-20T10:00:00Z'
      }
    ];

    for (const inst of institutions) {
      insertInst.run(
        inst.id,
        inst.institution_code,
        inst.name,
        inst.city,
        inst.state,
        inst.institution_type,
        inst.source_reference,
        inst.updated_at
      );
    }

    // 4. Cases (32 comprehensive demo cases)
    const insertCase = db.prepare(`
      INSERT INTO cases (
        id, case_number, source_case_id, institution_id, category, priority, summary, status,
        current_bureau_id, current_owner_id, created_at, updated_at, due_at,
        next_action, next_action_due, closure_summary, closed_at, source_name, source_updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Helper for relative timestamps based on 2026-10-20
    const now = new Date('2026-10-20T12:00:00Z').getTime();
    const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();
    const daysAhead = (d: number) => new Date(now + d * 86400000).toISOString();
    const hoursAhead = (h: number) => new Date(now + h * 3600000).toISOString();
    const hoursAgo = (h: number) => new Date(now - h * 3600000).toISOString();

    const cases = [
      {
        id: 'case-01',
        case_number: 'CASE-2026-0101',
        source_case_id: 'CPGRAMS/MH/2026/8941',
        institution_id: 'inst-01',
        category: 'Approvals',
        priority: 'High',
        summary: 'Alleged unauthorized sanction of additional 60 seats in Artificial Intelligence B.Tech without mandatory lab infrastructure inspection.',
        status: 'In Review',
        current_bureau_id: 'bur-approval',
        current_owner_id: 'usr-handler',
        created_at: daysAgo(14),
        updated_at: daysAgo(1),
        due_at: hoursAhead(24), // Due soon!
        next_action: 'Scrutinize virtual inspection recording and cross-verify with WRO approval log.',
        next_action_due: hoursAhead(24),
        closure_summary: null,
        closed_at: null,
        source_name: 'CPGRAMS Central',
        source_updated_at: daysAgo(14)
      },
      {
        id: 'case-02',
        case_number: 'CASE-2026-0102',
        source_case_id: 'AICTE-GRV/2026/4102',
        institution_id: 'inst-01',
        category: 'Faculty & Staff',
        priority: 'Urgent',
        summary: 'Petition by 12 adjunct faculty members alleging arbitrary withholding of 7th CPC arrears and denial of provident fund deposits.',
        status: 'In Review',
        current_bureau_id: 'bur-faculty',
        current_owner_id: 'usr-bureau-head',
        created_at: daysAgo(28),
        updated_at: daysAgo(3),
        due_at: daysAgo(4), // OVERDUE!
        next_action: 'Issue statutory show-cause notice under Section 10(k) of the AICTE Act.',
        next_action_due: daysAgo(4),
        closure_summary: null,
        closed_at: null,
        source_name: 'Faculty Grievance Portal',
        source_updated_at: daysAgo(28)
      },
      {
        id: 'case-03',
        case_number: 'CASE-2026-0103',
        source_case_id: 'PG-CELL/2026/0019',
        institution_id: 'inst-01',
        category: 'Infrastructure',
        priority: 'Medium',
        summary: 'Student council representation regarding non-functional fire suppression system and inadequate accessibility ramps in academic block B.',
        status: 'Open',
        current_bureau_id: 'bur-vigilance',
        current_owner_id: null, // UNASSIGNED
        created_at: daysAgo(3),
        updated_at: daysAgo(3),
        due_at: daysAhead(7),
        next_action: 'Assign regional compliance inspector to review safety certificates.',
        next_action_due: daysAhead(4),
        closure_summary: null,
        closed_at: null,
        source_name: 'AICTE Student Portal',
        source_updated_at: daysAgo(3)
      },
      {
        id: 'case-04',
        case_number: 'CASE-2026-0104',
        source_case_id: 'CPGRAMS/MH/2026/9110',
        institution_id: 'inst-01',
        category: 'Approvals',
        priority: 'High',
        summary: 'Discrepancy in reported student-to-teacher ratio (1:34 actual vs 1:15 reported in annual AICTE approval disclosure portal).',
        status: 'Awaiting Information',
        current_bureau_id: 'bur-approval',
        current_owner_id: 'usr-handler',
        created_at: daysAgo(10),
        updated_at: daysAgo(2),
        due_at: hoursAhead(18), // Due soon!
        next_action: 'Awaiting certified payroll and biometric attendance export from institution registrar.',
        next_action_due: hoursAhead(18),
        closure_summary: null,
        closed_at: null,
        source_name: 'CPGRAMS Central',
        source_updated_at: daysAgo(10)
      },
      {
        id: 'case-05',
        case_number: 'CASE-2026-0105',
        source_case_id: 'RO-WRO/2026/778',
        institution_id: 'inst-01',
        category: 'Fee & Admissions',
        priority: 'Medium',
        summary: 'Refusal to refund seat surrender fee within 7 days of withdrawal prior to cutoff round per AICTE norms.',
        status: 'Resolved',
        current_bureau_id: 'bur-grievance',
        current_owner_id: 'usr-handler-3',
        created_at: daysAgo(40),
        updated_at: daysAgo(8),
        due_at: daysAgo(10),
        next_action: 'Resolution confirmed by complainant; file closed.',
        next_action_due: null,
        closure_summary: 'Institution processed full refund of Rs. 85,000 via NEFT reference N10449102. Verified by student.',
        closed_at: daysAgo(8),
        source_name: 'WRO Regional Office',
        source_updated_at: daysAgo(8)
      },
      {
        id: 'case-06',
        case_number: 'CASE-2026-0106',
        source_case_id: 'CPGRAMS/DL/2026/1029',
        institution_id: 'inst-02',
        category: 'Academic',
        priority: 'High',
        summary: 'Allegation of unapproved dual-degree executive PGDM program conducted with non-accredited overseas university.',
        status: 'In Review',
        current_bureau_id: 'bur-academic',
        current_owner_id: 'usr-handler-2',
        created_at: daysAgo(20),
        updated_at: daysAgo(4),
        due_at: daysAgo(2), // OVERDUE!
        next_action: 'Review MoU terms and verify international collaboration approval clearance.',
        next_action_due: daysAgo(2),
        closure_summary: null,
        closed_at: null,
        source_name: 'CPGRAMS Central',
        source_updated_at: daysAgo(20)
      },
      {
        id: 'case-07',
        case_number: 'CASE-2026-0107',
        source_case_id: 'AICTE-VIG/2026/0091',
        institution_id: 'inst-02',
        category: 'Approvals',
        priority: 'Urgent',
        summary: 'Report of unnotified change in trust governance and transfer of physical campus land to a commercial subsidiary.',
        status: 'In Review',
        current_bureau_id: 'bur-vigilance',
        current_owner_id: 'usr-auditor',
        created_at: daysAgo(12),
        updated_at: daysAgo(1),
        due_at: daysAhead(5),
        next_action: 'Request verified registry extract from Delhi Revenue Department.',
        next_action_due: daysAhead(5),
        closure_summary: null,
        closed_at: null,
        source_name: 'Vigilance Cell Internal',
        source_updated_at: daysAgo(12)
      },
      {
        id: 'case-08',
        case_number: 'CASE-2026-0108',
        source_case_id: null,
        institution_id: 'inst-02',
        category: 'Faculty & Staff',
        priority: 'Low',
        summary: 'Routine query regarding qualification equivalence for Master in Design faculty appointment.',
        status: 'Resolved',
        current_bureau_id: 'bur-academic',
        current_owner_id: 'usr-handler-2',
        created_at: daysAgo(35),
        updated_at: daysAgo(15),
        due_at: daysAgo(14),
        next_action: null,
        next_action_due: null,
        closure_summary: 'Clarification issued citing Gazette Notification AICTE/RIFD/2021/EQ.',
        closed_at: daysAgo(15),
        source_name: 'AICTE Helpdesk',
        source_updated_at: daysAgo(15)
      },
      {
        id: 'case-09',
        case_number: 'CASE-2026-0109',
        source_case_id: 'CPGRAMS/KA/2026/5541',
        institution_id: 'inst-03',
        category: 'Approvals',
        priority: 'High',
        summary: 'Operation of unauthorized off-campus extension center in Electronic City Phase 2 without AICTE Council approval.',
        status: 'Open',
        current_bureau_id: 'bur-approval',
        current_owner_id: null, // UNASSIGNED
        created_at: daysAgo(2),
        updated_at: daysAgo(2),
        due_at: daysAhead(12),
        next_action: 'Initial screening and assignment to SWRO inspection desk.',
        next_action_due: daysAhead(3),
        closure_summary: null,
        closed_at: null,
        source_name: 'CPGRAMS Central',
        source_updated_at: daysAgo(2)
      },
      {
        id: 'case-10',
        case_number: 'CASE-2026-0110',
        source_case_id: 'SWRO/2026/0881',
        institution_id: 'inst-03',
        category: 'Academic',
        priority: 'Medium',
        summary: 'Failure to constitute mandatory Internal Complaints Committee (ICC) and Student Grievance Redressal Committee (SGRC).',
        status: 'In Review',
        current_bureau_id: 'bur-grievance',
        current_owner_id: 'usr-handler-3',
        created_at: daysAgo(15),
        updated_at: daysAgo(3),
        due_at: hoursAhead(36), // Due soon!
        next_action: 'Verify notification gazette uploaded to college portal.',
        next_action_due: hoursAhead(36),
        closure_summary: null,
        closed_at: null,
        source_name: 'SWRO Office',
        source_updated_at: daysAgo(15)
      },
      {
        id: 'case-11',
        case_number: 'CASE-2026-0111',
        source_case_id: 'SWRO/2026/0411',
        institution_id: 'inst-03',
        category: 'Infrastructure',
        priority: 'High',
        summary: 'Complaint by PhD research scholars of non-provision of high-performance compute cluster despite sanctioned central lab grant.',
        status: 'Awaiting Information',
        current_bureau_id: 'bur-academic',
        current_owner_id: 'usr-handler-2',
        created_at: daysAgo(22),
        updated_at: daysAgo(5),
        due_at: daysAgo(5), // OVERDUE!
        next_action: 'Auditing capital expenditure accounts submitted for FY 2024-25.',
        next_action_due: daysAgo(5),
        closure_summary: null,
        closed_at: null,
        source_name: 'SWRO Office',
        source_updated_at: daysAgo(22)
      },
      {
        id: 'case-12',
        case_number: 'CASE-2026-0112',
        source_case_id: 'CPGRAMS/TN/2026/3012',
        institution_id: 'inst-04',
        category: 'Approvals',
        priority: 'Urgent',
        summary: 'PCI vs AICTE dual approval compliance dispute regarding laboratory reagent disposal safety norms and B.Pharm intake validation.',
        status: 'In Review',
        current_bureau_id: 'bur-approval',
        current_owner_id: 'usr-handler',
        created_at: daysAgo(18),
        updated_at: daysAgo(2),
        due_at: daysAgo(1), // OVERDUE!
        next_action: 'Schedule inter-council coordination committee review hearing.',
        next_action_due: daysAgo(1),
        closure_summary: null,
        closed_at: null,
        source_name: 'CPGRAMS Central',
        source_updated_at: daysAgo(18)
      },
      {
        id: 'case-13',
        case_number: 'CASE-2026-0113',
        source_case_id: 'SRO/2026/1908',
        institution_id: 'inst-04',
        category: 'Faculty & Staff',
        priority: 'Medium',
        summary: 'Non-disbursal of maternity leave allowances to female assistant professors per AICTE 2021 service regulations.',
        status: 'Resolved',
        current_bureau_id: 'bur-faculty',
        current_owner_id: 'usr-bureau-head',
        created_at: daysAgo(45),
        updated_at: daysAgo(12),
        due_at: daysAgo(15),
        next_action: null,
        next_action_due: null,
        closure_summary: 'Institute governing body resolved the grievance and credited statutory leave encashment and arrears.',
        closed_at: daysAgo(12),
        source_name: 'SRO Office',
        source_updated_at: daysAgo(12)
      },
      {
        id: 'case-14',
        case_number: 'CASE-2026-0114',
        source_case_id: 'CPGRAMS/UP/2026/7781',
        institution_id: 'inst-05',
        category: 'Examination',
        priority: 'High',
        summary: 'Irregularities in diploma practical examination marks moderation and delayed marksheet dispatch.',
        status: 'Open',
        current_bureau_id: 'bur-academic',
        current_owner_id: null, // UNASSIGNED
        created_at: daysAgo(1),
        updated_at: daysAgo(1),
        due_at: daysAhead(10),
        next_action: 'Assign investigation officer to verify BTEUP correlation data.',
        next_action_due: daysAhead(4),
        closure_summary: null,
        closed_at: null,
        source_name: 'CPGRAMS Central',
        source_updated_at: daysAgo(1)
      },
      {
        id: 'case-15',
        case_number: 'CASE-2026-0115',
        source_case_id: 'NRO/2026/499',
        institution_id: 'inst-01',
        category: 'Faculty & Staff',
        priority: 'Urgent',
        summary: 'Supplemental grievance from 5 senior professors regarding pension contribution withheld by management trust.',
        status: 'In Review',
        current_bureau_id: 'bur-faculty',
        current_owner_id: 'usr-bureau-head',
        created_at: daysAgo(25),
        updated_at: daysAgo(4),
        due_at: daysAgo(3), // OVERDUE
        next_action: 'Joint hearing scheduled along with CASE-2026-0102.',
        next_action_due: daysAgo(3),
        closure_summary: null,
        closed_at: null,
        source_name: 'NRO Regional Office',
        source_updated_at: daysAgo(25)
      },
      {
        id: 'case-16',
        case_number: 'CASE-2026-0116',
        source_case_id: 'SCRO/2026/8821',
        institution_id: 'inst-06',
        category: 'Approvals',
        priority: 'Medium',
        summary: 'Intimation of delayed submission of Extension of Approval (EoA) online application due to portal technical maintenance.',
        status: 'Closed',
        current_bureau_id: 'bur-approval',
        current_owner_id: 'usr-handler',
        created_at: daysAgo(60),
        updated_at: daysAgo(25),
        due_at: daysAgo(30),
        next_action: null,
        next_action_due: null,
        closure_summary: 'Condonation granted by Competent Authority under emergent portal contingency guidelines.',
        closed_at: daysAgo(25),
        source_name: 'SCRO Office',
        source_updated_at: daysAgo(25)
      },
      {
        id: 'case-17',
        case_number: 'CASE-2026-0117',
        source_case_id: 'ERO/2026/0114',
        institution_id: 'inst-07',
        category: 'Infrastructure',
        priority: 'High',
        summary: 'Simulation engine testing tanks found substandard during maritime training safety audit.',
        status: 'In Review',
        current_bureau_id: 'bur-vigilance',
        current_owner_id: 'usr-auditor',
        created_at: daysAgo(16),
        updated_at: daysAgo(3),
        due_at: hoursAhead(40), // Due soon!
        next_action: 'Second-round physical verification report pending from DG Shipping liaison officer.',
        next_action_due: hoursAhead(40),
        closure_summary: null,
        closed_at: null,
        source_name: 'ERO Regional Office',
        source_updated_at: daysAgo(16)
      },
      {
        id: 'case-18',
        case_number: 'CASE-2026-0118',
        source_case_id: 'CPGRAMS/MH/2026/9931',
        institution_id: 'inst-01',
        category: 'Approvals',
        priority: 'High',
        summary: 'Parent association complaint regarding unapproved 60 student admissions in AI/ML branch without sanctioned university affiliation.',
        status: 'In Review',
        current_bureau_id: 'bur-approval',
        current_owner_id: 'usr-handler',
        created_at: daysAgo(7),
        updated_at: daysAgo(1),
        due_at: daysAhead(4),
        next_action: 'Cross check with CASE-2026-0104 and confirm candidate linkage.',
        next_action_due: daysAhead(4),
        closure_summary: null,
        closed_at: null,
        source_name: 'CPGRAMS Central',
        source_updated_at: daysAgo(7)
      },
      {
        id: 'case-19',
        case_number: 'CASE-2026-0119',
        source_case_id: 'CRO/2026/2029',
        institution_id: 'inst-08',
        category: 'Fee & Admissions',
        priority: 'Urgent',
        summary: 'Complaint against capitation fee demanded in cash under management quota for B.Tech Computer Science.',
        status: 'In Review',
        current_bureau_id: 'bur-vigilance',
        current_owner_id: 'usr-auditor',
        created_at: daysAgo(9),
        updated_at: daysAgo(1),
        due_at: daysAhead(3),
        next_action: 'Depute surprise inspection committee with district magistrate representative.',
        next_action_due: daysAhead(3),
        closure_summary: null,
        closed_at: null,
        source_name: 'CRO Regional Office',
        source_updated_at: daysAgo(9)
      },
      {
        id: 'case-20',
        case_number: 'CASE-2026-0120',
        source_case_id: 'CPGRAMS/DL/2026/3310',
        institution_id: 'inst-02',
        category: 'Academic',
        priority: 'Medium',
        summary: 'Revision of MBA curriculum without consultation with Board of Studies and industry advisory board.',
        status: 'Awaiting Information',
        current_bureau_id: 'bur-academic',
        current_owner_id: 'usr-handler-2',
        created_at: daysAgo(11),
        updated_at: daysAgo(2),
        due_at: daysAgo(1), // OVERDUE!
        next_action: 'Academic council minutes requested from institute dean.',
        next_action_due: daysAgo(1),
        closure_summary: null,
        closed_at: null,
        source_name: 'CPGRAMS Central',
        source_updated_at: daysAgo(11)
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
        c.current_bureau_id,
        c.current_owner_id,
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

    // 5. Initial Assignments
    const insertAssign = db.prepare(`
      INSERT INTO assignments (
        id, case_id, bureau_id, owner_id, assigned_by, started_at, ended_at, transfer_reason, handoff_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Case 01: Initial to Bureau Head, then transferred to Er. Neha Sharma
    insertAssign.run(
      'asg-01-a',
      'case-01',
      'bur-approval',
      'usr-bureau-head',
      'usr-leadership',
      daysAgo(14),
      daysAgo(10),
      'Case triage and priority dispatch',
      'High priority grievance received via CPGRAMS portal.'
    );
    insertAssign.run(
      'asg-01-b',
      'case-01',
      'bur-approval',
      'usr-handler',
      'usr-bureau-head',
      daysAgo(10),
      null,
      'Technical assessment assigned to desk officer',
      'Please verify WRO inspection logs and compare with student seat allocation records.'
    );

    // Case 02: Assigned to Bureau Head
    insertAssign.run(
      'asg-02',
      'case-02',
      'bur-faculty',
      'usr-bureau-head',
      'usr-leadership',
      daysAgo(28),
      null,
      'Direct statutory oversight required',
      'High severity faculty welfare case involving 12 petitioners.'
    );

    // Case 04: Assigned to Er. Neha Sharma
    insertAssign.run(
      'asg-04',
      'case-04',
      'bur-approval',
      'usr-handler',
      'usr-bureau-head',
      daysAgo(10),
      null,
      'Routine approval inspection review',
      'Verify staff payroll and EPF remittance returns.'
    );

    // Case 06: Assigned to Dr. Priya Nambiar
    insertAssign.run(
      'asg-06',
      'case-06',
      'bur-academic',
      'usr-handler-2',
      'usr-leadership',
      daysAgo(20),
      null,
      'International degree compliance desk',
      'Review foreign university equivalence agreements.'
    );

    // Case 07: Assigned to Sunil Verma
    insertAssign.run(
      'asg-07',
      'case-07',
      'bur-vigilance',
      'usr-auditor',
      'usr-leadership',
      daysAgo(12),
      null,
      'Vigilance inquiry ordered',
      'Investigate land lease deed amendment.'
    );

    // 6. Chronological Case Events (for timeline testing)
    const insertEvent = db.prepare(`
      INSERT INTO case_events (
        id, case_id, actor_id, event_type, from_value, to_value, note, created_at, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEvent.run(
      'evt-01',
      'case-01',
      'usr-leadership',
      'CREATED',
      null,
      'Open',
      'Case ingested from CPGRAMS portal under reference CPGRAMS/MH/2026/8941',
      daysAgo(14),
      JSON.stringify({ channel: 'CPGRAMS', autoClassified: true })
    );

    insertEvent.run(
      'evt-02',
      'case-01',
      'usr-bureau-head',
      'TRANSFERRED',
      'Prof. Rajive Kumar',
      'Er. Neha Sharma',
      'Handed off to Senior Technical Officer for laboratory log verification.',
      daysAgo(10),
      JSON.stringify({ reason: 'Desk officer assignment' })
    );

    insertEvent.run(
      'evt-03',
      'case-01',
      'usr-handler',
      'STATUS_CHANGE',
      'Open',
      'In Review',
      'Initiated comprehensive audit of physical inspection video recordings.',
      daysAgo(8),
      null
    );

    insertEvent.run(
      'evt-04',
      'case-01',
      'usr-handler',
      'NEXT_ACTION_UPDATE',
      null,
      'Scrutinize virtual inspection recording and cross-verify with WRO approval log.',
      'Target completion date set for 24 hours.',
      daysAgo(1),
      null
    );

    // Events for Case 02
    insertEvent.run(
      'evt-05',
      'case-02',
      'usr-leadership',
      'CREATED',
      null,
      'Open',
      'Ingested from Faculty Grievance Portal',
      daysAgo(28),
      null
    );

    insertEvent.run(
      'evt-06',
      'case-02',
      'usr-bureau-head',
      'STATUS_CHANGE',
      'Open',
      'In Review',
      'Show-cause notice drafted under Section 10(k). Pending final legal signoff.',
      daysAgo(15),
      null
    );

    // 7. Candidate Related-Case Reviews (3 deterministic pairs)
    const insertRelated = db.prepare(`
      INSERT INTO related_case_reviews (
        id, case_id, candidate_case_id, match_reasons, similarity_score, review_status,
        reviewed_by, reviewed_at, review_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Pair 1: Pending review (CASE-2026-0104 and CASE-2026-0118)
    insertRelated.run(
      'rel-01',
      'case-04',
      'case-18',
      JSON.stringify([
        'Same Institution: AICTE-MH-2024-ENG-089 (RGPV Demonstration Institute)',
        'Matching category: Approvals (AI/ML seat sanction & student-teacher ratio discrepancy)',
        'Concurrent CPGRAMS petitions filed within 3 days window'
      ]),
      0.89,
      'pending',
      null,
      null,
      null
    );

    // Pair 2: Confirmed related (CASE-2026-0102 and CASE-2026-0115)
    insertRelated.run(
      'rel-02',
      'case-02',
      'case-15',
      JSON.stringify([
        'Same Institution: AICTE-MH-2024-ENG-089',
        'Same subject matter: Faculty 7th CPC arrears and withheld retirement benefits',
        'Petitioners belong to the same parent engineering department'
      ]),
      0.94,
      'confirmed_related',
      'usr-bureau-head',
      daysAgo(2),
      'Confirmed related grievance cluster. Both petitions will be heard concurrently under unified show-cause proceeding.'
    );

    // Pair 3: Rejected related (CASE-2026-0107 and CASE-2026-0106)
    insertRelated.run(
      'rel-03',
      'case-07',
      'case-06',
      JSON.stringify([
        'Same Institution: AICTE-DL-2023-MGT-042',
        'Different focus areas: Land transfer vigilance vs Academic collaboration'
      ]),
      0.45,
      'rejected',
      'usr-auditor',
      daysAgo(1),
      'Distinct administrative issues. Academic syllabus compliance must not be entangled with land title inquiry.'
    );

    // 8. Audit Events
    const insertAudit = db.prepare(`
      INSERT INTO audit_events (
        id, actor_id, actor_name, role, action, target_type, target_id, result, created_at, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAudit.run(
      'aud-01',
      'usr-admin',
      'Amit Patel',
      'admin',
      'INITIALIZE_DEMO_SEED',
      'demo',
      null,
      'SUCCESS',
      daysAgo(30),
      JSON.stringify({ datasetVersion: '2026.1.0-sih' })
    );

    insertAudit.run(
      'aud-02',
      'usr-bureau-head',
      'Prof. Rajive Kumar',
      'bureau_official',
      'TRANSFER_CASE',
      'case',
      'case-01',
      'SUCCESS',
      daysAgo(10),
      JSON.stringify({ toOwner: 'Er. Neha Sharma', bureau: 'Approval & Affiliation' })
    );

    insertAudit.run(
      'aud-03',
      'usr-bureau-head',
      'Prof. Rajive Kumar',
      'bureau_official',
      'CONFIRM_RELATED_CASE',
      'case',
      'case-02',
      'SUCCESS',
      daysAgo(2),
      JSON.stringify({ candidateCase: 'case-15' })
    );
  })();

  console.log('Seed executed successfully: 8 institutions, 20 cases, users, assignments, related pairs & audit logs.');
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  runSeed();
}

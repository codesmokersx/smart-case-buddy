export type CasePriority = "critical" | "high" | "medium" | "low";
export type CaseStatus = "new" | "in_progress" | "review" | "completed" | "escalated";
export type AIStatus = "processing" | "complete" | "needs_review" | "error";

export interface Case {
  id: string;
  caseType: string;
  workflowStage: string;
  assignedUser: string;
  aiStatus: AIStatus;
  priority: CasePriority;
  lastActivity: string;
  memberName: string;
  status: CaseStatus;
  createdAt: string;
  documentsTotal: number;
  documentsComplete: number;
}

export const mockCases: Case[] = [
  { id: "CAS-2024-001", caseType: "New Application", workflowStage: "Medical Record Extraction", assignedUser: "Sarah Chen", aiStatus: "processing", priority: "high", lastActivity: "2 min ago", memberName: "John Martinez", status: "in_progress", createdAt: "2024-01-15", documentsTotal: 5, documentsComplete: 3 },
  { id: "CAS-2024-002", caseType: "Claims Review", workflowStage: "EOB Structuring", assignedUser: "Mike Torres", aiStatus: "complete", priority: "medium", lastActivity: "15 min ago", memberName: "Emily Davis", status: "review", createdAt: "2024-01-14", documentsTotal: 4, documentsComplete: 4 },
  { id: "CAS-2024-003", caseType: "Eligibility Check", workflowStage: "Plan Rule Verification", assignedUser: "Unassigned", aiStatus: "needs_review", priority: "critical", lastActivity: "5 min ago", memberName: "Acme Corp Census", status: "escalated", createdAt: "2024-01-13", documentsTotal: 3, documentsComplete: 1 },
  { id: "CAS-2024-004", caseType: "Policy Comparison", workflowStage: "Clause Extraction", assignedUser: "Lisa Park", aiStatus: "complete", priority: "low", lastActivity: "1 hr ago", memberName: "Robert Wilson", status: "completed", createdAt: "2024-01-12", documentsTotal: 6, documentsComplete: 6 },
  { id: "CAS-2024-005", caseType: "Claims Review", workflowStage: "Fact Extraction", assignedUser: "Sarah Chen", aiStatus: "processing", priority: "high", lastActivity: "8 min ago", memberName: "Maria Garcia", status: "in_progress", createdAt: "2024-01-11", documentsTotal: 4, documentsComplete: 2 },
  { id: "CAS-2024-006", caseType: "New Application", workflowStage: "Document Parsing", assignedUser: "Mike Torres", aiStatus: "error", priority: "critical", lastActivity: "1 min ago", memberName: "David Kim", status: "new", createdAt: "2024-01-10", documentsTotal: 3, documentsComplete: 0 },
  { id: "CAS-2024-007", caseType: "Eligibility Check", workflowStage: "Compliance Report", assignedUser: "Lisa Park", aiStatus: "complete", priority: "medium", lastActivity: "30 min ago", memberName: "TechStart Inc Census", status: "review", createdAt: "2024-01-09", documentsTotal: 5, documentsComplete: 5 },
  { id: "CAS-2024-008", caseType: "Claims Review", workflowStage: "Adjudication Support", assignedUser: "Sarah Chen", aiStatus: "needs_review", priority: "high", lastActivity: "12 min ago", memberName: "James Brown", status: "in_progress", createdAt: "2024-01-08", documentsTotal: 7, documentsComplete: 4 },
];

export interface AIInsight {
  type: "flag" | "warning" | "info" | "missing";
  title: string;
  description: string;
}

export const mockInsights: AIInsight[] = [
  { type: "flag", title: "Pre-existing Condition Detected", description: "Medical records indicate Type 2 Diabetes diagnosed 2019. Policy excludes coverage for 12-month waiting period." },
  { type: "warning", title: "Coverage Limit Mismatch", description: "Requested $500K coverage exceeds standard tier maximum of $250K. Requires underwriter approval." },
  { type: "missing", title: "Missing Lab Report", description: "Application requires recent HbA1c lab results. Last report on file is from 14 months ago." },
  { type: "info", title: "Similar Case Pattern", description: "3 similar applications from same employer group processed this month. Consider batch review." },
];

export interface ActivityEvent {
  id: string;
  type: "ai" | "human" | "system";
  actor: string;
  action: string;
  timestamp: string;
}

export const mockActivity: ActivityEvent[] = [
  { id: "1", type: "ai", actor: "Document Validation Agent", action: "Extracted 23 fields from medical records", timestamp: "2 min ago" },
  { id: "2", type: "ai", actor: "Policy Validation Agent", action: "Flagged pre-existing condition exclusion", timestamp: "3 min ago" },
  { id: "3", type: "human", actor: "Sarah Chen", action: "Assigned case for underwriter review", timestamp: "10 min ago" },
  { id: "4", type: "system", actor: "System", action: "Case created from application submission", timestamp: "25 min ago" },
  { id: "5", type: "ai", actor: "Claim Intake Agent", action: "Parsed application form and attachments", timestamp: "25 min ago" },
];

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: "parsed" | "pending" | "error" | "missing";
  pages?: number;
  caseId?: string;
}

export const mockDocuments: DocumentItem[] = [
  { id: "1", name: "Application Form", type: "PDF", status: "parsed", pages: 8, caseId: "CAS-2024-001" },
  { id: "2", name: "Medical Records", type: "PDF", status: "parsed", pages: 24, caseId: "CAS-2024-001" },
  { id: "3", name: "Lab Report - CBC", type: "PDF", status: "parsed", pages: 2, caseId: "CAS-2024-001" },
  { id: "4", name: "Lab Report - HbA1c", type: "PDF", status: "missing", caseId: "CAS-2024-001" },
  { id: "5", name: "Doctor's Statement", type: "PDF", status: "pending", pages: 3, caseId: "CAS-2024-001" },
  { id: "6", name: "EOB - Hospital Stay", type: "PDF", status: "parsed", pages: 4, caseId: "CAS-2024-002" },
  { id: "7", name: "Claim Form 1500", type: "PDF", status: "parsed", pages: 2, caseId: "CAS-2024-002" },
  { id: "8", name: "Discharge Summary", type: "PDF", status: "pending", pages: 6, caseId: "CAS-2024-002" },
  { id: "9", name: "Provider Notes", type: "PDF", status: "parsed", pages: 3, caseId: "CAS-2024-002" },
  { id: "10", name: "Census File", type: "CSV", status: "parsed", pages: 1, caseId: "CAS-2024-003" },
  { id: "11", name: "Plan Document", type: "PDF", status: "error", pages: 45, caseId: "CAS-2024-003" },
  { id: "12", name: "Eligibility Letter", type: "PDF", status: "missing", caseId: "CAS-2024-003" },
  { id: "13", name: "Policy A - Current", type: "PDF", status: "parsed", pages: 32, caseId: "CAS-2024-004" },
  { id: "14", name: "Policy B - Proposed", type: "PDF", status: "parsed", pages: 28, caseId: "CAS-2024-004" },
  { id: "15", name: "Rider Addendum", type: "PDF", status: "parsed", pages: 5, caseId: "CAS-2024-004" },
  { id: "16", name: "Hospital Bill", type: "PDF", status: "pending", pages: 12, caseId: "CAS-2024-005" },
  { id: "17", name: "Surgical Notes", type: "PDF", status: "error", pages: 8, caseId: "CAS-2024-006" },
  { id: "18", name: "Application - Kim", type: "PDF", status: "missing", caseId: "CAS-2024-006" },
];

// ── Workflows ──

export type WorkflowStatus = "active" | "draft" | "paused";

export interface WorkflowTrigger {
  type: "mailbox" | "webhook" | "manual" | "schedule" | "phone";
  config: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  agentId: string;
  agentName: string;
  triggers: WorkflowTrigger[];
  stages: string[];
  casesProcessed: number;
  lastRun: string;
  department: string;
}

export const mockWorkflows: Workflow[] = [
  {
    id: "WF-001",
    name: "New Application Processing",
    description: "End-to-end application intake, document parsing, and underwriting packet assembly",
    status: "active",
    agentId: "AGT-001",
    agentName: "Claim Intake Agent",
    triggers: [
      { type: "mailbox", config: "applications@insurai.com" },
      { type: "webhook", config: "https://api.insurai.com/webhooks/applications" },
    ],
    stages: ["Application Submission", "Document Parsing", "Medical Record Extraction", "Missing Data Detection", "Underwriting Packet Assembly", "Underwriter Review"],
    casesProcessed: 142,
    lastRun: "3 min ago",
    department: "Underwriting",
  },
  {
    id: "WF-002",
    name: "Claims Document Intelligence",
    description: "Extract structured data from claims documents and assemble adjudication packets",
    status: "active",
    agentId: "AGT-002",
    agentName: "Document Validation Agent",
    triggers: [
      { type: "mailbox", config: "claims@insurai.com" },
    ],
    stages: ["Claim Submission", "Document Parsing", "EOB Structuring", "Fact Extraction", "Case Assembly", "Adjudication Support"],
    casesProcessed: 89,
    lastRun: "8 min ago",
    department: "Claims",
  },
  {
    id: "WF-003",
    name: "Eligibility Verification",
    description: "Validate member eligibility against plan rules and detect discrepancies",
    status: "active",
    agentId: "AGT-003",
    agentName: "Policy Validation Agent",
    triggers: [
      { type: "webhook", config: "https://api.insurai.com/webhooks/eligibility" },
      { type: "schedule", config: "Daily at 6:00 AM" },
    ],
    stages: ["Upload Census File", "Eligibility Validation", "Plan Rule Verification", "Discrepancy Detection", "Compliance Report"],
    casesProcessed: 56,
    lastRun: "1 hr ago",
    department: "Enrollment",
  },
  {
    id: "WF-004",
    name: "Policy Comparison & Redlining",
    description: "Compare policy versions, extract clauses, and highlight differences",
    status: "draft",
    agentId: "AGT-004",
    agentName: "Workflow Routing Agent",
    triggers: [
      { type: "manual", config: "Triggered by operator" },
    ],
    stages: ["Upload Policies", "Clause Extraction", "Difference Highlighting", "Redline Report"],
    casesProcessed: 0,
    lastRun: "Never",
    department: "Compliance",
  },
  {
    id: "WF-005",
    name: "Urgent Claims Escalation",
    description: "Auto-detect and route high-priority claims requiring immediate review",
    status: "paused",
    agentId: "AGT-004",
    agentName: "Workflow Routing Agent",
    triggers: [
      { type: "webhook", config: "https://api.insurai.com/webhooks/urgent" },
    ],
    stages: ["Claim Flagging", "Priority Assessment", "Routing", "Escalation"],
    casesProcessed: 23,
    lastRun: "2 days ago",
    department: "Claims",
  },
  // ── New insurance department workflows ──
  {
    id: "WF-006",
    name: "Underwriting Risk Assessment",
    description: "Automated risk scoring, medical history analysis, and actuarial table matching for policy pricing",
    status: "active",
    agentId: "AGT-005",
    agentName: "Underwriting Assessment Agent",
    triggers: [
      { type: "webhook", config: "https://api.insurai.com/webhooks/underwriting" },
      { type: "mailbox", config: "underwriting@insurai.com" },
    ],
    stages: ["Application Intake", "Medical History Analysis", "Risk Factor Scoring", "Actuarial Table Matching", "Premium Calculation", "Underwriter Decision"],
    casesProcessed: 218,
    lastRun: "5 min ago",
    department: "Underwriting",
  },
  {
    id: "WF-007",
    name: "Fraud Detection & SIU Referral",
    description: "Pattern-based anomaly detection, cross-reference checking, and Special Investigations Unit referral",
    status: "active",
    agentId: "AGT-006",
    agentName: "Fraud Detection Agent",
    triggers: [
      { type: "schedule", config: "Every 30 minutes" },
      { type: "webhook", config: "https://api.insurai.com/webhooks/fraud-alert" },
    ],
    stages: ["Claim Screening", "Pattern Analysis", "Provider Cross-Reference", "Anomaly Scoring", "SIU Referral", "Investigation Tracking"],
    casesProcessed: 1345,
    lastRun: "12 min ago",
    department: "Fraud & SIU",
  },
  {
    id: "WF-008",
    name: "Member Inquiry & Inbound Call Handling",
    description: "AI-powered inbound call routing, real-time member lookup, benefits inquiry resolution, and call summarization",
    status: "active",
    agentId: "AGT-007",
    agentName: "Member Services Agent",
    triggers: [
      { type: "phone", config: "+1-800-INSURAI (inbound IVR)" },
      { type: "webhook", config: "https://api.insurai.com/webhooks/member-inquiry" },
    ],
    stages: ["Call Reception / IVR", "Member Identity Verification", "Benefits Lookup", "Inquiry Resolution", "Call Summary & Case Creation", "Follow-up Scheduling"],
    casesProcessed: 3420,
    lastRun: "1 min ago",
    department: "Member Services",
  },
  {
    id: "WF-009",
    name: "Appeals & Grievances Processing",
    description: "End-to-end appeals intake, clinical review coordination, and regulatory timeline tracking",
    status: "active",
    agentId: "AGT-008",
    agentName: "Appeals & Grievances Agent",
    triggers: [
      { type: "mailbox", config: "appeals@insurai.com" },
      { type: "manual", config: "Triggered by member services" },
    ],
    stages: ["Appeal Intake", "Document Completeness Check", "Clinical Review Routing", "Medical Director Decision", "Member Notification", "Regulatory Reporting"],
    casesProcessed: 87,
    lastRun: "45 min ago",
    department: "Appeals",
  },
  {
    id: "WF-010",
    name: "Premium Billing & Reconciliation",
    description: "Automated premium calculation, invoice generation, payment tracking, and delinquency management",
    status: "active",
    agentId: "AGT-009",
    agentName: "Premium Billing Agent",
    triggers: [
      { type: "schedule", config: "1st of every month" },
      { type: "webhook", config: "https://api.insurai.com/webhooks/payments" },
    ],
    stages: ["Census Reconciliation", "Premium Calculation", "Invoice Generation", "Payment Tracking", "Delinquency Detection", "Grace Period Management"],
    casesProcessed: 456,
    lastRun: "2 hr ago",
    department: "Billing",
  },
  {
    id: "WF-011",
    name: "Provider Credentialing & Network",
    description: "Provider application verification, license validation, network adequacy analysis",
    status: "draft",
    agentId: "AGT-010",
    agentName: "Provider Network Agent",
    triggers: [
      { type: "mailbox", config: "providers@insurai.com" },
      { type: "manual", config: "Triggered by network team" },
    ],
    stages: ["Application Receipt", "License & DEA Verification", "Malpractice History Check", "Credentialing Committee Review", "Contract Issuance", "Network Directory Update"],
    casesProcessed: 34,
    lastRun: "3 days ago",
    department: "Provider Relations",
  },
];

// ── AI Agents ──

export type AgentStatus = "running" | "idle" | "error" | "testing";
export type AgentType = "document_processing" | "voice_inbound" | "voice_outbound" | "decision_engine" | "monitoring" | "orchestrator";

export interface AgentTool {
  name: string;
  description: string;
  enabled: boolean;
}

export interface KnowledgeBaseItem {
  id: string;
  name: string;
  type: "pdf" | "csv" | "policy" | "rules";
  size: string;
  indexed: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  model: string;
  status: AgentStatus;
  agentType: AgentType;
  tools: AgentTool[];
  knowledgeBase: KnowledgeBaseItem[];
  policyRules: string[];
  tasksProcessed: number;
  successRate: number;
  avgProcessingTime: string;
  lastActive: string;
  integrations: string[];
  department: string;
}

export const AGENT_TYPES: { value: AgentType; label: string; description: string }[] = [
  { value: "document_processing", label: "Document Processing", description: "Parse, extract, and validate documents" },
  { value: "voice_inbound", label: "Inbound Call Agent", description: "Handle incoming phone calls and IVR" },
  { value: "voice_outbound", label: "Outbound Call Agent", description: "Make outgoing calls for follow-ups" },
  { value: "decision_engine", label: "Decision Engine", description: "Evaluate rules and make determinations" },
  { value: "monitoring", label: "Monitoring & Alerts", description: "Watch for patterns and anomalies" },
  { value: "orchestrator", label: "Orchestrator", description: "Route and coordinate between agents" },
];

export const AVAILABLE_MODELS = [
  { value: "GPT-4o", label: "GPT-4o", provider: "OpenAI", tier: "premium" },
  { value: "GPT-4o Mini", label: "GPT-4o Mini", provider: "OpenAI", tier: "standard" },
  { value: "GPT-5", label: "GPT-5", provider: "OpenAI", tier: "premium" },
  { value: "Claude 3.5 Sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic", tier: "premium" },
  { value: "Claude 3.5 Haiku", label: "Claude 3.5 Haiku", provider: "Anthropic", tier: "standard" },
  { value: "Gemini 2.0 Flash", label: "Gemini 2.0 Flash", provider: "Google", tier: "standard" },
  { value: "Gemini 1.5 Pro", label: "Gemini 1.5 Pro", provider: "Google", tier: "premium" },
  { value: "Llama 3.1 70B", label: "Llama 3.1 70B", provider: "Meta", tier: "open-source" },
];

export const INSURANCE_DEPARTMENTS = [
  "Underwriting", "Claims", "Member Services", "Enrollment",
  "Compliance", "Fraud & SIU", "Appeals", "Billing", "Provider Relations",
];

export const mockAgents: AIAgent[] = [
  {
    id: "AGT-001",
    name: "Claim Intake Agent",
    role: "Document Intake & Extraction",
    description: "Reads incoming submissions, extracts attachments, creates case records, and routes to appropriate workflows",
    model: "GPT-4o",
    status: "running",
    agentType: "document_processing",
    department: "Claims",
    tools: [
      { name: "PDF Parser", description: "Extract text and tables from PDF documents", enabled: true },
      { name: "OCR Engine", description: "Optical character recognition for scanned documents", enabled: true },
      { name: "Email Reader", description: "Parse incoming emails and extract attachments", enabled: true },
      { name: "Case Creator", description: "Create new case records in the system", enabled: true },
    ],
    knowledgeBase: [
      { id: "KB-1", name: "Application Forms Guide", type: "pdf", size: "2.4 MB", indexed: true },
      { id: "KB-2", name: "Document Classification Rules", type: "rules", size: "156 KB", indexed: true },
      { id: "KB-3", name: "ICD-10 Code Reference", type: "csv", size: "8.1 MB", indexed: true },
    ],
    policyRules: [
      "Always extract patient demographics first",
      "Flag documents older than 12 months",
      "Route applications with >$500K coverage to senior underwriter",
    ],
    tasksProcessed: 1247,
    successRate: 96.2,
    avgProcessingTime: "2.3 min",
    lastActive: "2 min ago",
    integrations: ["Email IMAP", "Webhook API", "S3 Storage"],
  },
  {
    id: "AGT-002",
    name: "Document Validation Agent",
    role: "Validation & Completeness",
    description: "Detects missing documents, validates formats, checks completeness, and sends document requests",
    model: "GPT-4o",
    status: "running",
    agentType: "document_processing",
    department: "Claims",
    tools: [
      { name: "Document Checker", description: "Validate document completeness and format", enabled: true },
      { name: "Missing Doc Detector", description: "Identify required but absent documents", enabled: true },
      { name: "Format Validator", description: "Check file formats and quality standards", enabled: true },
      { name: "Request Sender", description: "Send automated document request emails", enabled: false },
    ],
    knowledgeBase: [
      { id: "KB-4", name: "Required Documents by Case Type", type: "rules", size: "89 KB", indexed: true },
      { id: "KB-5", name: "Document Quality Standards", type: "pdf", size: "1.2 MB", indexed: true },
    ],
    policyRules: [
      "Require lab reports dated within 6 months",
      "Accept JPEG and PDF formats only",
      "Flag incomplete applications after 48 hours",
    ],
    tasksProcessed: 892,
    successRate: 98.1,
    avgProcessingTime: "1.1 min",
    lastActive: "5 min ago",
    integrations: ["Email SMTP", "Webhook API"],
  },
  {
    id: "AGT-003",
    name: "Policy Validation Agent",
    role: "Coverage & Compliance",
    description: "Checks coverage rules, verifies limits, detects exclusions, and ensures policy compliance",
    model: "Claude 3.5 Sonnet",
    status: "idle",
    agentType: "decision_engine",
    department: "Compliance",
    tools: [
      { name: "Rule Engine", description: "Evaluate coverage rules against case data", enabled: true },
      { name: "Exclusion Detector", description: "Identify policy exclusions and limitations", enabled: true },
      { name: "Limit Calculator", description: "Calculate and verify coverage limits", enabled: true },
      { name: "Compliance Reporter", description: "Generate compliance reports", enabled: true },
    ],
    knowledgeBase: [
      { id: "KB-6", name: "Master Policy Document 2024", type: "policy", size: "4.5 MB", indexed: true },
      { id: "KB-7", name: "Exclusion Clauses Database", type: "csv", size: "2.3 MB", indexed: true },
      { id: "KB-8", name: "State Regulation Guide", type: "pdf", size: "12.7 MB", indexed: false },
    ],
    policyRules: [
      "Pre-existing conditions have 12-month waiting period",
      "Maximum coverage per individual: $1M",
      "Dependent age limit: 26 years",
    ],
    tasksProcessed: 634,
    successRate: 94.7,
    avgProcessingTime: "3.8 min",
    lastActive: "15 min ago",
    integrations: ["Policy API", "Compliance Database"],
  },
  {
    id: "AGT-004",
    name: "Workflow Routing Agent",
    role: "Routing & Escalation",
    description: "Routes cases to appropriate queues, assigns adjudicators, and escalates suspicious claims",
    model: "Gemini 2.0 Flash",
    status: "error",
    agentType: "orchestrator",
    department: "Claims",
    tools: [
      { name: "Queue Manager", description: "Manage case routing queues", enabled: true },
      { name: "Assignment Engine", description: "Auto-assign cases to available processors", enabled: true },
      { name: "Escalation Trigger", description: "Detect and escalate high-risk cases", enabled: true },
      { name: "SLA Monitor", description: "Track and enforce processing SLAs", enabled: false },
    ],
    knowledgeBase: [
      { id: "KB-9", name: "Routing Rules Matrix", type: "rules", size: "234 KB", indexed: true },
      { id: "KB-10", name: "Team Capacity Data", type: "csv", size: "45 KB", indexed: true },
    ],
    policyRules: [
      "Critical priority cases go to senior staff only",
      "Max 15 active cases per processor",
      "Escalate if no action within 4 hours",
    ],
    tasksProcessed: 445,
    successRate: 91.3,
    avgProcessingTime: "0.5 min",
    lastActive: "1 hr ago",
    integrations: ["Slack", "Team Calendar API"],
  },
  // ── New insurance department agents ──
  {
    id: "AGT-005",
    name: "Underwriting Assessment Agent",
    role: "Risk Analysis & Pricing",
    description: "Analyzes medical history, calculates risk scores using actuarial models, and recommends premium tiers for new applications",
    model: "GPT-4o",
    status: "running",
    agentType: "decision_engine",
    department: "Underwriting",
    tools: [
      { name: "Risk Scorer", description: "Multi-factor risk score calculation", enabled: true },
      { name: "Medical History Analyzer", description: "Parse and evaluate medical records for risk factors", enabled: true },
      { name: "Actuarial Table Lookup", description: "Match risk profile to actuarial pricing tables", enabled: true },
      { name: "MIB Query", description: "Query Medical Information Bureau for prior applications", enabled: true },
    ],
    knowledgeBase: [
      { id: "KB-11", name: "Actuarial Tables 2024", type: "csv", size: "15.2 MB", indexed: true },
      { id: "KB-12", name: "Underwriting Guidelines v4", type: "policy", size: "6.8 MB", indexed: true },
      { id: "KB-13", name: "Risk Classification Manual", type: "pdf", size: "3.1 MB", indexed: true },
    ],
    policyRules: [
      "BMI > 40 triggers enhanced medical review",
      "Tobacco use adds 25% surcharge per ACA guidelines",
      "Family history of hereditary conditions requires specialist review",
      "Coverage > $1M requires reinsurance treaty check",
    ],
    tasksProcessed: 1856,
    successRate: 97.4,
    avgProcessingTime: "4.2 min",
    lastActive: "5 min ago",
    integrations: ["MIB Database", "Actuarial Engine", "Reinsurance API"],
  },
  {
    id: "AGT-006",
    name: "Fraud Detection Agent",
    role: "Anomaly Detection & Investigation",
    description: "Monitors claims for fraudulent patterns, cross-references provider networks, scores anomalies, and generates SIU referral packets",
    model: "Claude 3.5 Sonnet",
    status: "running",
    agentType: "monitoring",
    department: "Fraud & SIU",
    tools: [
      { name: "Pattern Analyzer", description: "Statistical anomaly detection across claims history", enabled: true },
      { name: "Provider Cross-Ref", description: "Cross-reference claims against provider sanctioned lists", enabled: true },
      { name: "Billing Code Validator", description: "Detect upcoding, unbundling, and impossible procedure combinations", enabled: true },
      { name: "Network Graph Builder", description: "Build relationship graphs between providers, members, and facilities", enabled: true },
    ],
    knowledgeBase: [
      { id: "KB-14", name: "NICB Fraud Indicators", type: "rules", size: "420 KB", indexed: true },
      { id: "KB-15", name: "OIG Exclusion List", type: "csv", size: "28.4 MB", indexed: true },
      { id: "KB-16", name: "Historical Fraud Cases", type: "csv", size: "5.6 MB", indexed: true },
    ],
    policyRules: [
      "Flag claims from sanctioned providers immediately",
      "Score > 0.85 auto-refers to SIU",
      "Phantom billing detection: >5 claims same day same provider",
      "Upcoding threshold: 3+ standard deviations from peer group",
    ],
    tasksProcessed: 12450,
    successRate: 99.1,
    avgProcessingTime: "0.8 min",
    lastActive: "1 min ago",
    integrations: ["NICB API", "OIG Database", "SIU Portal", "NHCAA Network"],
  },
  {
    id: "AGT-007",
    name: "Member Services Agent",
    role: "Inbound Call Handling & Member Support",
    description: "AI-powered inbound call agent that handles member inquiries via IVR/voice, performs real-time benefits lookup, resolves common questions, and escalates complex issues to human agents",
    model: "GPT-4o",
    status: "running",
    agentType: "voice_inbound",
    department: "Member Services",
    tools: [
      { name: "Voice Transcription", description: "Real-time speech-to-text for call processing", enabled: true },
      { name: "Member Lookup", description: "Search member records by ID, SSN last-4, or DOB", enabled: true },
      { name: "Benefits Calculator", description: "Real-time deductible, copay, and OOP max lookups", enabled: true },
      { name: "Call Summarizer", description: "Auto-generate call summary and case notes", enabled: true },
      { name: "IVR Router", description: "Intelligent IVR menu routing based on intent detection", enabled: true },
      { name: "Outbound Follow-up", description: "Schedule and trigger follow-up calls or messages", enabled: false },
    ],
    knowledgeBase: [
      { id: "KB-17", name: "Member FAQ Database", type: "csv", size: "1.8 MB", indexed: true },
      { id: "KB-18", name: "Benefits Summary Guide 2024", type: "pdf", size: "4.2 MB", indexed: true },
      { id: "KB-19", name: "Call Handling Scripts", type: "rules", size: "560 KB", indexed: true },
      { id: "KB-20", name: "Provider Directory", type: "csv", size: "22.1 MB", indexed: true },
    ],
    policyRules: [
      "Verify member identity with 2-factor authentication (DOB + Member ID)",
      "Never disclose PHI without identity verification",
      "Escalate to human agent if member requests supervisor",
      "Auto-create case for any call exceeding 10 minutes",
      "Record call consent statement before proceeding",
    ],
    tasksProcessed: 8934,
    successRate: 92.6,
    avgProcessingTime: "6.2 min",
    lastActive: "Just now",
    integrations: ["Telephony API", "IVR System", "CRM", "Twilio Voice", "Call Recording"],
  },
  {
    id: "AGT-008",
    name: "Appeals & Grievances Agent",
    role: "Appeals Processing & Regulatory Compliance",
    description: "Manages the full appeals lifecycle from intake through resolution, coordinates clinical reviews, and tracks regulatory deadlines",
    model: "Claude 3.5 Sonnet",
    status: "idle",
    agentType: "document_processing",
    department: "Appeals",
    tools: [
      { name: "Appeal Classifier", description: "Classify appeal type (clinical, administrative, expedited)", enabled: true },
      { name: "Deadline Tracker", description: "Monitor state and federal appeal response deadlines", enabled: true },
      { name: "Clinical Review Router", description: "Route to appropriate medical director by specialty", enabled: true },
      { name: "Notification Generator", description: "Generate compliant member acknowledgment and decision letters", enabled: true },
    ],
    knowledgeBase: [
      { id: "KB-21", name: "Appeal Regulations by State", type: "rules", size: "2.8 MB", indexed: true },
      { id: "KB-22", name: "CMS Appeal Requirements", type: "pdf", size: "8.4 MB", indexed: true },
      { id: "KB-23", name: "Letter Templates", type: "pdf", size: "1.1 MB", indexed: true },
    ],
    policyRules: [
      "Expedited appeals must be processed within 72 hours",
      "Standard appeals: 30-day response for commercial, 60-day for government",
      "All denials require peer-to-peer review option disclosure",
      "Track IRE (Independent Review Entity) referral deadlines",
    ],
    tasksProcessed: 342,
    successRate: 95.8,
    avgProcessingTime: "8.5 min",
    lastActive: "45 min ago",
    integrations: ["Clinical Review System", "Regulatory Calendar", "Member Portal"],
  },
  {
    id: "AGT-009",
    name: "Premium Billing Agent",
    role: "Billing, Invoicing & Payment",
    description: "Automates premium calculations, generates invoices, tracks payments, manages grace periods, and detects delinquencies",
    model: "Gemini 2.0 Flash",
    status: "running",
    agentType: "decision_engine",
    department: "Billing",
    tools: [
      { name: "Premium Calculator", description: "Calculate premiums based on census and plan selections", enabled: true },
      { name: "Invoice Generator", description: "Generate and distribute monthly invoices", enabled: true },
      { name: "Payment Matcher", description: "Match incoming payments to outstanding invoices", enabled: true },
      { name: "Delinquency Alerter", description: "Flag accounts approaching grace period expiration", enabled: true },
    ],
    knowledgeBase: [
      { id: "KB-24", name: "Rate Tables 2024", type: "csv", size: "6.2 MB", indexed: true },
      { id: "KB-25", name: "Billing Rules & Grace Periods", type: "rules", size: "340 KB", indexed: true },
    ],
    policyRules: [
      "ACA 90-day grace period for subsidized members",
      "30-day grace period for non-subsidized commercial",
      "COBRA continuation requires 45-day election window",
      "Generate dunning notices at 15, 30, and 60 days past due",
    ],
    tasksProcessed: 2340,
    successRate: 99.6,
    avgProcessingTime: "0.3 min",
    lastActive: "2 hr ago",
    integrations: ["Payment Gateway", "Bank Reconciliation", "ERP System"],
  },
  {
    id: "AGT-010",
    name: "Provider Network Agent",
    role: "Credentialing & Network Management",
    description: "Verifies provider credentials, validates licenses and DEA registrations, manages network adequacy, and maintains provider directories",
    model: "GPT-4o Mini",
    status: "testing",
    agentType: "document_processing",
    department: "Provider Relations",
    tools: [
      { name: "License Verifier", description: "Validate state medical licenses and DEA registrations", enabled: true },
      { name: "NPPES Lookup", description: "Query NPI registry for provider information", enabled: true },
      { name: "Malpractice Checker", description: "Check malpractice claims history", enabled: true },
      { name: "Network Adequacy Analyzer", description: "Analyze network coverage by geography and specialty", enabled: false },
    ],
    knowledgeBase: [
      { id: "KB-26", name: "NCQA Credentialing Standards", type: "pdf", size: "3.4 MB", indexed: true },
      { id: "KB-27", name: "State Licensing Requirements", type: "rules", size: "890 KB", indexed: true },
    ],
    policyRules: [
      "Re-credentialing required every 36 months",
      "Verify board certification within 180 days of application",
      "OIG/SAM exclusion check required before onboarding",
      "Maintain minimum network adequacy per CMS standards",
    ],
    tasksProcessed: 156,
    successRate: 88.5,
    avgProcessingTime: "12.4 min",
    lastActive: "3 days ago",
    integrations: ["NPPES Registry", "State License APIs", "CAQH ProView"],
  },
];

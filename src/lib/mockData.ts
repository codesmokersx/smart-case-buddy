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
  type: "mailbox" | "webhook" | "manual" | "schedule";
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
  },
];

// ── AI Agents ──

export type AgentStatus = "running" | "idle" | "error" | "testing";

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
  tools: AgentTool[];
  knowledgeBase: KnowledgeBaseItem[];
  policyRules: string[];
  tasksProcessed: number;
  successRate: number;
  avgProcessingTime: string;
  lastActive: string;
  integrations: string[];
}

export const mockAgents: AIAgent[] = [
  {
    id: "AGT-001",
    name: "Claim Intake Agent",
    role: "Document Intake & Extraction",
    description: "Reads incoming submissions, extracts attachments, creates case records, and routes to appropriate workflows",
    model: "GPT-4o",
    status: "running",
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
];

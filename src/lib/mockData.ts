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
}

export const mockCases: Case[] = [
  { id: "CAS-2024-001", caseType: "New Application", workflowStage: "Medical Record Extraction", assignedUser: "Sarah Chen", aiStatus: "processing", priority: "high", lastActivity: "2 min ago", memberName: "John Martinez" },
  { id: "CAS-2024-002", caseType: "Claims Review", workflowStage: "EOB Structuring", assignedUser: "Mike Torres", aiStatus: "complete", priority: "medium", lastActivity: "15 min ago", memberName: "Emily Davis" },
  { id: "CAS-2024-003", caseType: "Eligibility Check", workflowStage: "Plan Rule Verification", assignedUser: "Unassigned", aiStatus: "needs_review", priority: "critical", lastActivity: "5 min ago", memberName: "Acme Corp Census" },
  { id: "CAS-2024-004", caseType: "Policy Comparison", workflowStage: "Clause Extraction", assignedUser: "Lisa Park", aiStatus: "complete", priority: "low", lastActivity: "1 hr ago", memberName: "Robert Wilson" },
  { id: "CAS-2024-005", caseType: "Claims Review", workflowStage: "Fact Extraction", assignedUser: "Sarah Chen", aiStatus: "processing", priority: "high", lastActivity: "8 min ago", memberName: "Maria Garcia" },
  { id: "CAS-2024-006", caseType: "New Application", workflowStage: "Document Parsing", assignedUser: "Mike Torres", aiStatus: "error", priority: "critical", lastActivity: "1 min ago", memberName: "David Kim" },
  { id: "CAS-2024-007", caseType: "Eligibility Check", workflowStage: "Compliance Report", assignedUser: "Lisa Park", aiStatus: "complete", priority: "medium", lastActivity: "30 min ago", memberName: "TechStart Inc Census" },
  { id: "CAS-2024-008", caseType: "Claims Review", workflowStage: "Adjudication Support", assignedUser: "Sarah Chen", aiStatus: "needs_review", priority: "high", lastActivity: "12 min ago", memberName: "James Brown" },
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
}

export const mockDocuments: DocumentItem[] = [
  { id: "1", name: "Application Form", type: "PDF", status: "parsed", pages: 8 },
  { id: "2", name: "Medical Records", type: "PDF", status: "parsed", pages: 24 },
  { id: "3", name: "Lab Report - CBC", type: "PDF", status: "parsed", pages: 2 },
  { id: "4", name: "Lab Report - HbA1c", type: "PDF", status: "missing" },
  { id: "5", name: "Doctor's Statement", type: "PDF", status: "pending", pages: 3 },
];

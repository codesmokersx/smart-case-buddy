import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Inbox,
  Briefcase,
  GitBranch,
  Bot,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  Shield,
  Phone,
  Layers,
  Zap,
  Users,
  Database,
  ChevronRight,
  ExternalLink,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: DocBlock[];
}

interface DocBlock {
  type: "heading" | "paragraph" | "list" | "table" | "code" | "callout" | "divider";
  content?: string;
  items?: string[];
  variant?: "info" | "warning" | "success" | "destructive";
  rows?: string[][];
  headers?: string[];
  level?: number;
}

const sections: DocSection[] = [
  {
    id: "overview",
    title: "Platform Overview",
    icon: Layers,
    content: [
      { type: "heading", content: "What is Aurastack?", level: 2 },
      {
        type: "paragraph",
        content:
          "Aurastack is an AI-powered insurance operations platform designed to automate and streamline health insurance workflows. It combines intelligent AI agents, configurable workflows, and comprehensive case management to transform how insurance organizations process applications, claims, eligibility checks, and policy comparisons.",
      },
      {
        type: "callout",
        variant: "info",
        content:
          "Aurastack is built for insurance operations teams who want to reduce manual processing time by up to 80% while maintaining full HIPAA compliance and audit trails.",
      },
      { type: "heading", content: "Core Capabilities", level: 3 },
      {
        type: "list",
        items: [
          "AI-powered document extraction and processing across medical records, claims forms, and policy documents",
          "Configurable multi-stage workflows with intelligent routing and escalation",
          "Specialized AI agents for each insurance department — Claims, Underwriting, Member Services, Fraud & SIU, and more",
          "Inbound and outbound voice agents with IVR management and call recording",
          "Real-time analytics and performance dashboards across all operations",
          "Role-based access control (RBAC) with PHI data masking and HIPAA-aligned governance",
          "Natural language AI Assistant for operating the entire platform through conversation",
        ],
      },
      { type: "heading", content: "Architecture", level: 3 },
      {
        type: "paragraph",
        content:
          "The platform follows a modular architecture with clearly separated concerns. The frontend is a single-page application built with React, TypeScript, and Tailwind CSS. The sidebar navigation provides access to all major modules: Operations Inbox, AI Assistant, Cases, Workflows, AI Agents, Documents, Analytics, and Administration.",
      },
      {
        type: "table",
        headers: ["Layer", "Technology", "Purpose"],
        rows: [
          ["Frontend", "React 18 + TypeScript + Tailwind CSS", "Single-page application with responsive design"],
          ["UI Components", "shadcn/ui + Radix Primitives", "Accessible, composable component library"],
          ["State", "TanStack React Query", "Server state management and caching"],
          ["Animation", "Framer Motion", "Smooth transitions and micro-interactions"],
          ["Routing", "React Router v6", "Client-side navigation with nested routes"],
          ["Charts", "Recharts", "Data visualization for analytics dashboards"],
        ],
      },
    ],
  },
  {
    id: "operations-inbox",
    title: "Operations Inbox",
    icon: Inbox,
    content: [
      { type: "heading", content: "Operations Inbox", level: 2 },
      {
        type: "paragraph",
        content:
          'The Operations Inbox is the primary command center for all insurance operations. It provides a real-time view of every active case, its AI processing status, assigned team member, and priority level. Think of it as a unified queue that surfaces the most critical work items first.',
      },
      { type: "heading", content: "Dashboard Metrics", level: 3 },
      {
        type: "table",
        headers: ["Metric", "Description"],
        rows: [
          ["Open Cases", "Total number of cases currently in active processing stages"],
          ["AI Processing", "Cases currently being analyzed by one or more AI agents"],
          ["Needs Review", "Cases flagged by AI that require human review or decision"],
          ["Avg. Processing Time", "Mean time from case creation to resolution, tracked weekly"],
        ],
      },
      { type: "heading", content: "Case Table Columns", level: 3 },
      {
        type: "list",
        items: [
          "Case ID — Unique identifier (e.g., CAS-2024-001) linking to the Case Workspace",
          "Type — Category: New Application, Claims Review, Eligibility Check, or Policy Comparison",
          "Workflow Stage — Current step in the processing pipeline",
          "Assigned — Team member responsible; shows 'Unassigned' if pending assignment",
          "AI Status — Processing, Complete, Needs Review, or Error",
          "Priority — Critical, High, Medium, or Low with color-coded badges",
          "Last Activity — Relative timestamp of the most recent action on the case",
        ],
      },
      { type: "heading", content: "Quick Filters", level: 3 },
      {
        type: "paragraph",
        content:
          "Filter buttons above the table allow instant filtering by case type. The 'All Cases' filter shows every case, while individual type buttons (New Application, Claims Review, etc.) narrow the view.",
      },
    ],
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    icon: Sparkles,
    content: [
      { type: "heading", content: "AI Assistant", level: 2 },
      {
        type: "paragraph",
        content:
          "The AI Assistant is a natural language interface that lets you operate the entire Aurastack platform through conversation. Instead of navigating through menus and forms, you describe what you want in plain English and the assistant executes it.",
      },
      {
        type: "callout",
        variant: "success",
        content:
          'The AI Assistant can create cases, configure agents, build workflows, manage users, pull analytics, and more — all from a single chat interface.',
      },
      { type: "heading", content: "Split-View Interface", level: 3 },
      {
        type: "paragraph",
        content:
          "The assistant uses a split-view layout inspired by modern AI development tools. The left panel contains the chat conversation, while the right panel shows a live platform preview with quick-nav tabs for Inbox, Cases, Agents, Workflows, Analytics, and Admin.",
      },
      { type: "heading", content: "Supported Commands", level: 3 },
      {
        type: "table",
        headers: ["Category", "Example Commands"],
        rows: [
          ["Cases", '"Create a new claims review case for John Smith with high priority"'],
          ["Agents", '"Set up a new document processing agent with GPT-4o for the Claims department"'],
          ["Workflows", '"Create a fraud detection workflow with email and webhook triggers"'],
          ["Users", '"Add a new user with reviewer role for the Claims department"'],
          ["Search", '"Show me all critical priority cases" / "What\'s the status of CAS-2024-003?"'],
          ["Analytics", '"What\'s our average case resolution time this week?"'],
        ],
      },
      { type: "heading", content: "Action Tracking", level: 3 },
      {
        type: "paragraph",
        content:
          "Each assistant response includes an action trail showing what operations were performed. Completed actions show a green checkmark, while pending actions show a spinner. This provides full transparency into every change the assistant makes.",
      },
    ],
  },
  {
    id: "cases",
    title: "Cases Management",
    icon: Briefcase,
    content: [
      { type: "heading", content: "Cases Management", level: 2 },
      {
        type: "paragraph",
        content:
          "The Cases module provides full lifecycle management for insurance cases from intake through resolution. Each case represents a discrete work item — an application, claim, eligibility check, or policy comparison — that flows through a multi-stage processing pipeline.",
      },
      { type: "heading", content: "Case Lifecycle", level: 3 },
      {
        type: "table",
        headers: ["Status", "Description"],
        rows: [
          ["New", "Case has been created but not yet picked up by an agent or team member"],
          ["In Progress", "Active processing — AI agents and/or humans are working on the case"],
          ["Review", "AI processing is complete and the case is awaiting human review"],
          ["Completed", "All processing and review steps are finished"],
          ["Escalated", "Case has been flagged for urgent attention or elevated to a supervisor"],
        ],
      },
      { type: "heading", content: "Case Workspace", level: 3 },
      {
        type: "paragraph",
        content:
          "Clicking a case opens the Case Workspace — a three-column layout designed for efficient processing:",
      },
      {
        type: "list",
        items: [
          "Left Column — Documents: All files associated with the case with status indicators (Parsed, Pending, Error, Missing). Supports upload, retry, and preview actions.",
          "Center Column — Extracted Data: Structured fields extracted by AI from the case documents. Editable for human corrections.",
          "Right Column — AI Insights: Automated flags, warnings, missing data alerts, and pattern recognition results from AI analysis.",
        ],
      },
      { type: "heading", content: "Case Actions", level: 3 },
      {
        type: "list",
        items: [
          "Approve & Advance — Move the case to the next workflow stage after review",
          "Escalate — Flag for urgent review and optionally reassign to a supervisor",
          "Assign — Change the team member responsible for the case",
          "Add Note — Append a timestamped note to the activity timeline",
          "Upload Document — Add new files to the case document set",
        ],
      },
      { type: "heading", content: "Activity Timeline", level: 3 },
      {
        type: "paragraph",
        content:
          'Every action on a case — whether by AI, human, or system — is logged in a chronological activity timeline. Each entry shows the actor type (AI agent, human operator, or system), the action performed, and the timestamp.',
      },
    ],
  },
  {
    id: "workflows",
    title: "Workflows",
    icon: GitBranch,
    content: [
      { type: "heading", content: "Workflows", level: 2 },
      {
        type: "paragraph",
        content:
          "Workflows define the automated processing pipelines that power every insurance operation. Each workflow consists of triggers (how it starts), stages (what steps it runs), and an assigned AI agent (who executes the work).",
      },
      { type: "heading", content: "Workflow Status", level: 3 },
      {
        type: "table",
        headers: ["Status", "Behavior"],
        rows: [
          ["Active", "Workflow is live and processing incoming cases automatically"],
          ["Paused", "Workflow exists but is temporarily disabled; no new cases are processed"],
          ["Draft", "Workflow is being configured and has not been activated yet"],
        ],
      },
      { type: "heading", content: "Trigger Types", level: 3 },
      {
        type: "table",
        headers: ["Trigger", "Icon", "Description"],
        rows: [
          ["Mailbox", "📧", "Monitors a specific email inbox for incoming submissions"],
          ["Webhook", "🔗", "Receives HTTP POST requests from external systems"],
          ["Phone", "📞", "Inbound call via IVR system triggers case creation"],
          ["Schedule", "📅", "Runs on a defined schedule (daily, weekly, monthly)"],
          ["Manual", "✋", "Triggered manually by an operator from the UI"],
        ],
      },
      { type: "heading", content: "Pre-Built Workflows", level: 3 },
      {
        type: "list",
        items: [
          "New Application Processing — Document parsing → Medical record extraction → Underwriting packet assembly",
          "Claims Document Intelligence — EOB structuring → Fact extraction → Adjudication support",
          "Eligibility Verification — Census upload → Plan rule verification → Compliance reporting",
          "Underwriting Risk Assessment — Medical history analysis → Risk scoring → Premium calculation",
          "Fraud Detection & SIU Referral — Pattern analysis → Anomaly scoring → Investigation tracking",
          "Member Inquiry & Inbound Call Handling — IVR → Identity verification → Benefits lookup → Case creation",
          "Appeals & Grievances Processing — Document completeness → Clinical review → Regulatory reporting",
          "Premium Billing & Reconciliation — Census reconciliation → Invoice generation → Delinquency management",
          "Provider Credentialing & Network — License verification → Malpractice check → Contract issuance",
        ],
      },
      { type: "heading", content: "Workflow Management", level: 3 },
      {
        type: "list",
        items: [
          "Create Workflow — Multi-step wizard to name, describe, assign agent, configure triggers, and define stages",
          "Edit Stages — Reorder, add, or remove processing stages via drag controls",
          "Toggle Status — Switch between Active, Paused, and Draft states",
          "Duplicate — Clone an existing workflow as a starting point for a new one",
          "Delete — Remove a workflow (requires confirmation)",
        ],
      },
    ],
  },
  {
    id: "ai-agents",
    title: "AI Agents",
    icon: Bot,
    content: [
      { type: "heading", content: "AI Agents", level: 2 },
      {
        type: "paragraph",
        content:
          "AI Agents are the intelligent workers that power Aurastack. Each agent is configured with a specific role, LLM model, tools, knowledge base, and policy rules. Agents can process documents, handle phone calls, make decisions, detect fraud, and orchestrate other agents.",
      },
      { type: "heading", content: "Agent Types", level: 3 },
      {
        type: "table",
        headers: ["Type", "Description", "Use Cases"],
        rows: [
          ["Document Processing", "Parse, extract, and validate documents", "Claims intake, medical record extraction, form parsing"],
          ["Inbound Call Agent", "Handle incoming phone calls via IVR", "Member inquiries, benefits lookup, call summarization"],
          ["Outbound Call Agent", "Make outgoing calls for follow-ups", "Appointment reminders, claim status updates"],
          ["Decision Engine", "Evaluate rules and make determinations", "Risk scoring, eligibility verification, premium calculation"],
          ["Monitoring & Alerts", "Watch for patterns and anomalies", "Fraud detection, SLA monitoring, compliance alerts"],
          ["Orchestrator", "Route and coordinate between agents", "Workflow routing, escalation management"],
        ],
      },
      { type: "heading", content: "Supported Models", level: 3 },
      {
        type: "table",
        headers: ["Model", "Provider", "Tier", "Best For"],
        rows: [
          ["GPT-4o", "OpenAI", "Premium", "Complex document analysis, multi-step reasoning"],
          ["GPT-4o Mini", "OpenAI", "Standard", "Fast processing, high-volume tasks"],
          ["GPT-5", "OpenAI", "Premium", "Most advanced reasoning and accuracy"],
          ["Claude 3.5 Sonnet", "Anthropic", "Premium", "Nuanced analysis, long documents"],
          ["Claude 3.5 Haiku", "Anthropic", "Standard", "Quick classification, structured extraction"],
          ["Gemini 2.0 Flash", "Google", "Standard", "Multimodal processing, fast inference"],
          ["Gemini 1.5 Pro", "Google", "Premium", "Large context windows, document comparison"],
          ["Llama 3.1 70B", "Meta", "Open-source", "Self-hosted, data sovereignty requirements"],
        ],
      },
      { type: "heading", content: "Agent Configuration", level: 3 },
      {
        type: "list",
        items: [
          "Identity — Name, role description, department assignment, and agent type selection",
          "Model — LLM selection with provider and tier information",
          "System Prompt — Custom instructions that define the agent's behavior and constraints",
          "Tools — Toggleable capabilities like PDF Parser, OCR Engine, Email Reader, Case Creator",
          "Knowledge Base — Uploaded reference documents (PDFs, CSVs, policy docs, rule sets) that the agent can search",
          "Policy Rules — Hard constraints the agent must follow (e.g., 'Always extract patient demographics first')",
        ],
      },
      { type: "heading", content: "Telephony (Voice Agents)", level: 3 },
      {
        type: "paragraph",
        content:
          "Voice agents (inbound and outbound) include additional telephony configuration:",
      },
      {
        type: "list",
        items: [
          "Phone Number — Assigned phone number for inbound call routing",
          "IVR Welcome Message — Configurable greeting played when calls connect",
          "Call Recording — Toggle to enable/disable call recording for compliance",
          "Call Simulation — Test sandbox for simulating inbound call transcripts",
        ],
      },
      { type: "heading", content: "Agent Testing", level: 3 },
      {
        type: "paragraph",
        content:
          'Every agent has a built-in testing sandbox. For document agents, you can input sample text and see the agent\'s extraction output. For voice agents, you can simulate call transcripts. Test results show processing time and structured output.',
      },
      { type: "heading", content: "Agent Management", level: 3 },
      {
        type: "list",
        items: [
          "Create Agent — 3-step wizard: Identity → Model → System Prompt",
          "Toggle Status — Start/stop agents (Running, Idle, Error, Testing)",
          "Duplicate — Clone agent configuration for creating variants",
          "Delete — Remove agent with confirmation dialog",
        ],
      },
    ],
  },
  {
    id: "documents",
    title: "Documents",
    icon: FileText,
    content: [
      { type: "heading", content: "Documents", level: 2 },
      {
        type: "paragraph",
        content:
          "The Documents module provides a centralized repository for all files processed across the platform. Every document is associated with a case and has a processing status tracked by the AI pipeline.",
      },
      { type: "heading", content: "Document Statuses", level: 3 },
      {
        type: "table",
        headers: ["Status", "Badge Color", "Description"],
        rows: [
          ["Parsed", "Green", "Successfully extracted and structured by AI"],
          ["Pending", "Yellow", "Queued for processing or currently being analyzed"],
          ["Error", "Red", "Processing failed — requires retry or manual intervention"],
          ["Missing", "Gray", "Expected document has not been uploaded yet"],
        ],
      },
      { type: "heading", content: "Supported File Types", level: 3 },
      {
        type: "list",
        items: [
          "PDF — Application forms, medical records, EOBs, policy documents, lab reports",
          "CSV — Census files, enrollment data, provider lists",
          "Images (JPEG, PNG, TIFF) — Scanned documents processed via OCR",
        ],
      },
      { type: "heading", content: "Document Actions", level: 3 },
      {
        type: "list",
        items: [
          "Upload — Add new documents to a case via drag-and-drop or file picker",
          "Retry — Re-process a document that encountered an error",
          "Preview — View document content and extracted fields side by side",
          "Download — Export the original file",
        ],
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: BarChart3,
    content: [
      { type: "heading", content: "Analytics & Reporting", level: 2 },
      {
        type: "paragraph",
        content:
          "The Analytics module provides real-time dashboards and performance metrics across all platform operations. Data is organized into four tabs: Overview, Cases, Workflows, and Agents.",
      },
      { type: "heading", content: "Overview Tab", level: 3 },
      {
        type: "list",
        items: [
          "Cases Processed — Daily/weekly/monthly volume with trend lines",
          "AI Accuracy Rate — Percentage of AI decisions that passed human review without correction",
          "Processing Volume — Throughput metrics by case type",
          "Performance Over Time — Time-series charts showing efficiency improvements",
        ],
      },
      { type: "heading", content: "Cases Tab", level: 3 },
      {
        type: "list",
        items: [
          "Case Volume Over Time — Area chart showing new cases created per period",
          "Resolution Time vs Target — Bar chart comparing actual resolution times against SLA targets",
          "Priority Distribution — Pie chart breaking down cases by priority level",
          "Status Breakdown — Current distribution across New, In Progress, Review, Completed, Escalated",
        ],
      },
      { type: "heading", content: "Workflows Tab", level: 3 },
      {
        type: "list",
        items: [
          "Cases Processed by Workflow — Bar chart comparing throughput across all workflows",
          "Success Rate by Department — Donut chart showing completion rates per department",
          "Workflow Performance Table — Sortable table with cases processed, success rate, avg time, and status",
        ],
      },
      { type: "heading", content: "Agents Tab", level: 3 },
      {
        type: "list",
        items: [
          "Agent Performance — Success rate, tasks processed, and average processing time per agent",
          "Model Comparison — Side-by-side metrics across different LLM providers",
          "Agent Utilization — Capacity and load metrics per agent",
        ],
      },
    ],
  },
  {
    id: "admin",
    title: "Administration",
    icon: Settings,
    content: [
      { type: "heading", content: "Administration", level: 2 },
      {
        type: "paragraph",
        content:
          "The Admin module provides comprehensive platform governance tools including user management, role-based access control, integration configuration, and compliance policies.",
      },
      { type: "heading", content: "User Management", level: 3 },
      {
        type: "list",
        items: [
          "Invite Users — Send email invitations with role and department pre-assignment",
          "Edit Users — Modify name, email, role, department, and PHI access level",
          "Suspend/Activate — Toggle user access without deleting their account",
          "User Directory — Searchable table with status, role, department, and last login",
        ],
      },
      { type: "heading", content: "Role-Based Access Control (RBAC)", level: 3 },
      {
        type: "table",
        headers: ["Role", "Access Level", "PHI Visibility"],
        rows: [
          ["Admin", "Full platform access, user management, system configuration", "Full"],
          ["Manager", "Department-level oversight, case assignment, reporting", "Full"],
          ["Reviewer", "Review AI outputs, approve/escalate cases", "Redacted"],
          ["Operator", "Process cases within assigned workflows", "Redacted"],
          ["Analyst", "Read-only access to analytics and reports", "Masked"],
          ["Auditor", "Read-only access to audit logs and compliance data", "Full (audit only)"],
        ],
      },
      { type: "heading", content: "PHI Data Masking", level: 3 },
      {
        type: "callout",
        variant: "warning",
        content:
          "Protected Health Information (PHI) is masked according to each user's visibility level. Full access shows all data, Redacted replaces sensitive fields with [REDACTED], and Masked shows only the last 4 characters of identifiers.",
      },
      { type: "heading", content: "Integrations", level: 3 },
      {
        type: "table",
        headers: ["Integration", "Type", "Purpose"],
        rows: [
          ["Epic FHIR Gateway", "EHR", "Pull patient records and clinical data via FHIR R4 API"],
          ["Salesforce Health Cloud", "CRM", "Sync member data and case status bidirectionally"],
          ["DocuSign", "E-Signature", "Automated policy signing and document execution"],
          ["Twilio", "Telephony", "Inbound/outbound voice calls and IVR routing"],
        ],
      },
      { type: "heading", content: "Governance Policies", level: 3 },
      {
        type: "list",
        items: [
          "Data Retention — Configurable retention periods per document type",
          "Access Logging — Every PHI access is logged with user, timestamp, and resource",
          "Audit Trail — Complete history of all system changes, user actions, and AI decisions",
          "Compliance Reports — Automated HIPAA compliance reporting and gap analysis",
          "Encryption — AES-256 at rest, TLS 1.3 in transit for all data",
          "BAA Management — Business Associate Agreement tracking and renewal alerts",
        ],
      },
    ],
  },
  {
    id: "departments",
    title: "Insurance Departments",
    icon: Users,
    content: [
      { type: "heading", content: "Supported Departments", level: 2 },
      {
        type: "paragraph",
        content:
          "Aurastack covers every major department within a health insurance organization. Each department has dedicated workflows, AI agents, and document processing pipelines.",
      },
      {
        type: "table",
        headers: ["Department", "Key Workflows", "Primary Agent Type"],
        rows: [
          ["Underwriting", "Risk assessment, medical history analysis, premium calculation", "Decision Engine"],
          ["Claims", "Document intake, EOB structuring, adjudication support", "Document Processing"],
          ["Member Services", "Inbound call handling, benefits inquiry, call summarization", "Inbound Call Agent"],
          ["Enrollment", "Eligibility verification, plan rule checking, census processing", "Document Processing"],
          ["Compliance", "Policy comparison, clause extraction, redline reporting", "Decision Engine"],
          ["Fraud & SIU", "Pattern analysis, anomaly detection, SIU referral", "Monitoring & Alerts"],
          ["Appeals", "Appeal intake, clinical review routing, regulatory reporting", "Document Processing"],
          ["Billing", "Premium calculation, invoice generation, delinquency management", "Decision Engine"],
          ["Provider Relations", "Credentialing, license verification, network management", "Document Processing"],
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Security & Compliance",
    icon: Shield,
    content: [
      { type: "heading", content: "Security & Compliance", level: 2 },
      {
        type: "paragraph",
        content:
          "Aurastack is designed from the ground up to meet healthcare data security standards. The platform implements defense-in-depth security controls across every layer.",
      },
      { type: "heading", content: "HIPAA Compliance", level: 3 },
      {
        type: "list",
        items: [
          "Administrative Safeguards — RBAC, workforce training tracking, security incident procedures",
          "Physical Safeguards — Cloud infrastructure with SOC 2 Type II certified providers",
          "Technical Safeguards — AES-256 encryption, access logging, automatic session timeout, MFA support",
        ],
      },
      { type: "heading", content: "Data Protection", level: 3 },
      {
        type: "table",
        headers: ["Control", "Implementation"],
        rows: [
          ["Encryption at Rest", "AES-256 for all stored data including documents and database"],
          ["Encryption in Transit", "TLS 1.3 for all API calls and data transfers"],
          ["PHI Masking", "Role-based data visibility with Full, Redacted, and Masked levels"],
          ["Access Logging", "Every PHI access logged with user ID, timestamp, resource, and action"],
          ["Session Management", "Automatic timeout after inactivity, secure token rotation"],
          ["Audit Trail", "Immutable log of all system changes for compliance review"],
        ],
      },
      {
        type: "callout",
        variant: "destructive",
        content:
          "All PHI data access is logged and auditable. Unauthorized access attempts trigger immediate alerts to the security team and are logged in the compliance audit trail.",
      },
    ],
  },
  {
    id: "data-model",
    title: "Data Model",
    icon: Database,
    content: [
      { type: "heading", content: "Data Model Reference", level: 2 },
      { type: "heading", content: "Case", level: 3 },
      {
        type: "table",
        headers: ["Field", "Type", "Description"],
        rows: [
          ["id", "string", "Unique case identifier (e.g., CAS-2024-001)"],
          ["caseType", "string", "New Application | Claims Review | Eligibility Check | Policy Comparison"],
          ["workflowStage", "string", "Current processing stage name"],
          ["assignedUser", "string", "Assigned team member or 'Unassigned'"],
          ["aiStatus", "enum", "processing | complete | needs_review | error"],
          ["priority", "enum", "critical | high | medium | low"],
          ["status", "enum", "new | in_progress | review | completed | escalated"],
          ["memberName", "string", "Name of the insured member or organization"],
          ["documentsTotal", "number", "Total documents expected for this case"],
          ["documentsComplete", "number", "Documents successfully processed"],
          ["createdAt", "string", "ISO date of case creation"],
          ["lastActivity", "string", "Relative timestamp of most recent action"],
        ],
      },
      { type: "heading", content: "AI Agent", level: 3 },
      {
        type: "table",
        headers: ["Field", "Type", "Description"],
        rows: [
          ["id", "string", "Unique agent identifier (e.g., AGT-001)"],
          ["name", "string", "Display name of the agent"],
          ["role", "string", "Functional role description"],
          ["agentType", "enum", "document_processing | voice_inbound | voice_outbound | decision_engine | monitoring | orchestrator"],
          ["model", "string", "LLM model (e.g., GPT-4o, Claude 3.5 Sonnet)"],
          ["status", "enum", "running | idle | error | testing"],
          ["department", "string", "Assigned insurance department"],
          ["tools", "AgentTool[]", "Array of enabled processing tools"],
          ["knowledgeBase", "KnowledgeBaseItem[]", "Indexed reference documents"],
          ["policyRules", "string[]", "Hard constraints for agent behavior"],
          ["successRate", "number", "Percentage of successful task completions"],
        ],
      },
      { type: "heading", content: "Workflow", level: 3 },
      {
        type: "table",
        headers: ["Field", "Type", "Description"],
        rows: [
          ["id", "string", "Unique workflow identifier (e.g., WF-001)"],
          ["name", "string", "Display name of the workflow"],
          ["status", "enum", "active | paused | draft"],
          ["triggers", "WorkflowTrigger[]", "Array of trigger configurations (mailbox, webhook, phone, schedule, manual)"],
          ["stages", "string[]", "Ordered array of processing stage names"],
          ["agentId", "string", "ID of the assigned AI agent"],
          ["department", "string", "Operating department"],
          ["casesProcessed", "number", "Total cases processed by this workflow"],
        ],
      },
    ],
  },
];

function renderBlock(block: DocBlock, index: number) {
  switch (block.type) {
    case "heading":
      if (block.level === 2)
        return (
          <h2 key={index} className="text-xl font-semibold mt-8 mb-3 first:mt-0">
            {block.content}
          </h2>
        );
      return (
        <h3 key={index} className="text-base font-semibold mt-6 mb-2">
          {block.content}
        </h3>
      );
    case "paragraph":
      return (
        <p key={index} className="text-sm text-muted-foreground leading-relaxed mb-4">
          {block.content}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="space-y-1.5 mb-4 ml-4">
          {block.items?.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
              <span className="text-accent mt-1.5 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/^(.*?) — /, "<strong class='text-foreground'>$1</strong> — ") }} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={index} className="rounded-lg border overflow-hidden mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                {block.headers?.map((h, i) => (
                  <th key={i} className="text-left font-medium px-3 py-2 text-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, ri) => (
                <tr key={ri} className="border-t">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout": {
      const colors: Record<string, string> = {
        info: "border-primary/30 bg-primary/5 text-primary",
        warning: "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5 text-[hsl(var(--warning))]",
        success: "border-accent/30 bg-accent/5 text-accent",
        destructive: "border-destructive/30 bg-destructive/5 text-destructive",
      };
      return (
        <div
          key={index}
          className={cn(
            "rounded-lg border px-4 py-3 text-sm leading-relaxed mb-4",
            colors[block.variant || "info"]
          )}
        >
          {block.content}
        </div>
      );
    }
    case "divider":
      return <Separator key={index} className="my-6" />;
    default:
      return null;
  }
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.some(
            (b) =>
              b.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.items?.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
          )
      )
    : sections;

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <AppLayout title="Documentation">
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar Nav */}
        <div className="w-64 shrink-0 border-r bg-card/50 flex flex-col">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search docs..."
                className="h-8 pl-8 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1 px-2 pb-4">
            <div className="space-y-0.5">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {section.title}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto px-8 py-8"
          >
            {currentSection && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] h-5">
                    {currentSection.id}
                  </Badge>
                </div>
                {currentSection.content.map((block, i) => renderBlock(block, i))}
              </>
            )}
          </motion.div>
        </ScrollArea>
      </div>
    </AppLayout>
  );
}

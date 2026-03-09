import { AppLayout } from "@/components/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { mockCases, mockDocuments, mockInsights, mockActivity } from "@/lib/mockData";
import { AIStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Upload,
  Bot,
  User,
  Settings,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const docStatusIcon: Record<string, React.ElementType> = {
  parsed: CheckCircle2,
  pending: Clock,
  error: XCircle,
  missing: AlertTriangle,
};

const docStatusColor: Record<string, string> = {
  parsed: "text-success",
  pending: "text-muted-foreground",
  error: "text-destructive",
  missing: "text-warning",
};

const insightIcon: Record<string, { icon: React.ElementType; color: string }> = {
  flag: { icon: AlertTriangle, color: "text-destructive" },
  warning: { icon: AlertTriangle, color: "text-warning" },
  info: { icon: Bot, color: "text-info" },
  missing: { icon: XCircle, color: "text-warning" },
};

const extractedFields = [
  { label: "Patient Name", value: "John Martinez" },
  { label: "Date of Birth", value: "03/15/1978" },
  { label: "Policy Type", value: "Group Health - PPO" },
  { label: "Coverage Requested", value: "$500,000" },
  { label: "Employer", value: "Acme Technologies Inc." },
  { label: "Diagnosis", value: "Type 2 Diabetes (E11.9)" },
  { label: "Medical History", value: "Hypertension, controlled" },
  { label: "Smoking Status", value: "Non-smoker" },
];

export default function CaseWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseData = mockCases.find((c) => c.id === id) || mockCases[0];

  return (
    <AppLayout title="Case Workspace">
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Case header */}
        <div className="flex items-center justify-between border-b bg-card px-6 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-primary">{caseData.id}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{caseData.memberName}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{caseData.caseType}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{caseData.workflowStage}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AIStatusBadge status={caseData.aiStatus} />
            <PriorityBadge priority={caseData.priority} />
            <Button size="sm" className="h-7 text-xs">Approve & Advance</Button>
          </div>
        </div>

        {/* Three column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Documents */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-64 shrink-0 border-r bg-card overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documents</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Upload className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {mockDocuments.map((doc) => {
                  const Icon = docStatusIcon[doc.status];
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs hover:bg-muted cursor-pointer transition-colors"
                    >
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", docStatusColor[doc.status])} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {doc.status === "missing" ? "Not uploaded" : `${doc.pages} pages · ${doc.type}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Center: Extracted Data */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Extracted Data
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {extractedFields.map((field) => (
                  <div key={field.label} className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">{field.label}</label>
                    <div className="rounded-lg border bg-card px-3 py-2 text-sm">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Activity Timeline */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Activity Timeline
              </h3>
              <div className="space-y-3">
                {mockActivity.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      event.type === "ai" ? "bg-ai/10" : event.type === "human" ? "bg-primary/10" : "bg-muted"
                    )}>
                      {event.type === "ai" ? (
                        <Bot className="h-3 w-3 text-ai" />
                      ) : event.type === "human" ? (
                        <User className="h-3 w-3 text-primary" />
                      ) : (
                        <Settings className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs">
                        <span className="font-medium">{event.actor}</span>{" "}
                        <span className="text-muted-foreground">{event.action}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-80 shrink-0 border-l bg-card overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-4 w-4 text-ai" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  AI Insights
                </h3>
              </div>
              <div className="space-y-3">
                {mockInsights.map((insight, i) => {
                  const config = insightIcon[insight.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={i}
                      className="rounded-lg border p-3 space-y-1.5 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-3.5 w-3.5", config.color)} />
                        <span className="text-xs font-medium">{insight.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}

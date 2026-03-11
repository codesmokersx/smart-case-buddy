import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { mockCases, mockDocuments, mockInsights, mockActivity, type AIStatus } from "@/lib/mockData";
import { AIStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import {
  FileText, CheckCircle2, Clock, AlertTriangle, XCircle, Upload, Bot, User, Settings,
  ArrowLeft, ChevronRight, Send, UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

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

const teamMembers = ["Sarah Chen", "Mike Torres", "Lisa Park", "James Rodriguez", "Emily Watson"];

export default function CaseWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseData = mockCases.find((c) => c.id === id) || mockCases[0];

  const [status, setStatus] = useState(caseData.status);
  const [aiStatus, setAiStatus] = useState<AIStatus>(caseData.aiStatus);
  const [assignedUser, setAssignedUser] = useState(caseData.assignedUser);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState(mockActivity);
  const [docs, setDocs] = useState(mockDocuments);

  const caseDocs = docs.filter((d) => d.caseId === caseData.id || !d.caseId);

  const handleAdvance = () => {
    const stages = ["new", "in_progress", "review", "completed"];
    const currentIdx = stages.indexOf(status);
    if (currentIdx < stages.length - 1) {
      const nextStatus = stages[currentIdx + 1] as typeof status;
      setStatus(nextStatus);
      setAiStatus("complete");
      setActivities((prev) => [
        { id: String(Date.now()), type: "human" as const, actor: assignedUser || "System", action: `Advanced case to ${nextStatus.replace("_", " ")}`, timestamp: "Just now" },
        ...prev,
      ]);
      toast({ title: "Case advanced", description: `Case moved to ${nextStatus.replace("_", " ")}` });
    } else {
      toast({ title: "Case completed", description: "This case has been fully processed." });
    }
  };

  const handleEscalate = () => {
    setStatus("escalated");
    setActivities((prev) => [
      { id: String(Date.now()), type: "human" as const, actor: assignedUser || "System", action: "Escalated case for urgent review", timestamp: "Just now" },
      ...prev,
    ]);
    toast({ title: "Case escalated", description: "Case has been flagged for urgent review.", variant: "destructive" });
  };

  const handleAssign = (user: string) => {
    setAssignedUser(user);
    setShowAssignDialog(false);
    setActivities((prev) => [
      { id: String(Date.now()), type: "human" as const, actor: "System", action: `Case assigned to ${user}`, timestamp: "Just now" },
      ...prev,
    ]);
    toast({ title: "Case assigned", description: `Assigned to ${user}` });
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    setActivities((prev) => [
      { id: String(Date.now()), type: "human" as const, actor: assignedUser || "Operator", action: note, timestamp: "Just now" },
      ...prev,
    ]);
    setNote("");
    toast({ title: "Note added" });
  };

  const handleUpload = () => {
    const newDoc = {
      id: String(Date.now()),
      name: "Uploaded Document.pdf",
      type: "PDF",
      status: "pending" as const,
      pages: 4,
      caseId: caseData.id,
    };
    setDocs((prev) => [...prev, newDoc]);
    setShowUploadDialog(false);
    setActivities((prev) => [
      { id: String(Date.now()), type: "system" as const, actor: "System", action: "New document uploaded: Uploaded Document.pdf", timestamp: "Just now" },
      ...prev,
    ]);
    toast({ title: "Document uploaded", description: "Document is queued for parsing." });
  };

  const handleRetryParse = (docId: string) => {
    setDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, status: "pending" as const } : d)));
    toast({ title: "Retrying parse", description: "Document resubmitted for processing." });
  };

  return (
    <AppLayout title="Case Workspace">
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Case header */}
        <div className="flex items-center justify-between border-b bg-card px-6 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate("/cases")}>
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
                <span className="text-xs text-muted-foreground">·</span>
                <Badge variant="outline" className="text-[10px] capitalize">{status.replace("_", " ")}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setShowAssignDialog(true)}>
              <UserPlus className="h-3 w-3" />
              {assignedUser === "Unassigned" ? "Assign" : assignedUser}
            </Button>
            <AIStatusBadge status={aiStatus} />
            <PriorityBadge priority={caseData.priority} />
            <Button variant="outline" size="sm" className="h-7 text-xs text-destructive" onClick={handleEscalate}>
              Escalate
            </Button>
            <Button size="sm" className="h-7 text-xs" onClick={handleAdvance}>
              Approve & Advance
            </Button>
          </div>
        </div>

        {/* Three column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Documents */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="w-64 shrink-0 border-r bg-card overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documents</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowUploadDialog(true)}>
                  <Upload className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {caseDocs.map((doc) => {
                  const Icon = docStatusIcon[doc.status];
                  return (
                    <div
                      key={doc.id}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-colors",
                        selectedDoc === doc.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                      )}
                      onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                    >
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", docStatusColor[doc.status])} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {doc.status === "missing" ? "Not uploaded" : `${doc.pages} pages · ${doc.type}`}
                        </p>
                      </div>
                      {doc.status === "error" && (
                        <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[9px] text-destructive" onClick={(e) => { e.stopPropagation(); handleRetryParse(doc.id); }}>
                          Retry
                        </Button>
                      )}
                      {doc.status === "missing" && (
                        <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[9px]" onClick={(e) => { e.stopPropagation(); setShowUploadDialog(true); }}>
                          Upload
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Center: Extracted Data + Notes */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex-1 overflow-y-auto">
            <div className="p-6">
              {selectedDoc ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Document Preview</h3>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setSelectedDoc(null)}>← Back to data</Button>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">{caseDocs.find((d) => d.id === selectedDoc)?.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Document preview would render here</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">PDF viewer integration required for production</p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Extracted Data</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {extractedFields.map((field) => (
                      <div key={field.label} className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">{field.label}</label>
                        <div className="rounded-lg border bg-card px-3 py-2 text-sm">{field.value}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <Separator className="my-6" />

              {/* Add Note */}
              <div className="flex items-center gap-2 mb-4">
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note or update..." className="h-8 text-xs flex-1" onKeyDown={(e) => e.key === "Enter" && handleAddNote()} />
                <Button size="sm" className="h-8 gap-1 text-xs" onClick={handleAddNote} disabled={!note.trim()}>
                  <Send className="h-3 w-3" /> Add
                </Button>
              </div>

              {/* Activity Timeline */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Activity Timeline</h3>
              <div className="space-y-3">
                {activities.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      event.type === "ai" ? "bg-ai/10" : event.type === "human" ? "bg-primary/10" : "bg-muted"
                    )}>
                      {event.type === "ai" ? <Bot className="h-3 w-3 text-ai" /> : event.type === "human" ? <User className="h-3 w-3 text-primary" /> : <Settings className="h-3 w-3 text-muted-foreground" />}
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
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="w-80 shrink-0 border-l bg-card overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-4 w-4 text-ai" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Insights</h3>
              </div>
              <div className="space-y-3">
                {mockInsights.map((insight, i) => {
                  const config = insightIcon[insight.type];
                  const Icon = config.icon;
                  return (
                    <div key={i} className="rounded-lg border p-3 space-y-1.5 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-3.5 w-3.5", config.color)} />
                        <span className="text-xs font-medium">{insight.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{insight.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription className="text-xs">Upload a document to this case for AI processing</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border-2 border-dashed p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Drag & drop files here, or click to browse</p>
              <p className="text-[10px] text-muted-foreground mt-1">Supports PDF, DOCX, CSV, TXT (max 25MB)</p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" className="text-xs" onClick={handleUpload}>Upload & Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign Case</DialogTitle>
            <DialogDescription className="text-xs">Select a team member to assign this case to</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2">
            {teamMembers.map((member) => (
              <div
                key={member}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors hover:bg-muted/50",
                  assignedUser === member && "border-primary bg-primary/5"
                )}
                onClick={() => handleAssign(member)}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member}</span>
                </div>
                {assignedUser === member && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

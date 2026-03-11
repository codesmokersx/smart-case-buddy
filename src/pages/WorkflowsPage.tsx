import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockWorkflows as initialWorkflows, mockAgents, type Workflow, type WorkflowStatus, type WorkflowTrigger, INSURANCE_DEPARTMENTS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GitBranch, Plus, Mail, Webhook, Hand, CalendarClock, Bot, Play, Pause,
  ChevronRight, ArrowLeft, Settings, Trash2, Search, MoreVertical, Phone,
  Copy, Edit, CheckCircle2, XCircle, Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const triggerIcons: Record<string, React.ElementType> = {
  mailbox: Mail,
  webhook: Webhook,
  manual: Hand,
  schedule: CalendarClock,
  phone: Phone,
};

const statusColors: Record<WorkflowStatus, string> = {
  active: "bg-success/10 text-success",
  draft: "bg-muted text-muted-foreground",
  paused: "bg-warning/10 text-warning",
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filtered = workflows.filter((w) => {
    const matchesSearch = search === "" || w.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    if (selected?.id === id) setSelected(null);
    toast({ title: "Workflow deleted", description: "The workflow has been removed." });
  };

  const handleDuplicate = (wf: Workflow) => {
    const newWf: Workflow = {
      ...wf,
      id: `WF-${String(workflows.length + 1).padStart(3, "0")}`,
      name: `${wf.name} (Copy)`,
      status: "draft",
      casesProcessed: 0,
      lastRun: "Never",
    };
    setWorkflows((prev) => [...prev, newWf]);
    toast({ title: "Workflow duplicated", description: `${newWf.name} created as draft.` });
  };

  const handleToggleStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "paused" : "active", lastRun: "Just now" }
          : w
      )
    );
    const wf = workflows.find((w) => w.id === id);
    toast({ title: wf?.status === "active" ? "Workflow paused" : "Workflow activated" });
  };

  const handleUpdateWorkflow = (updated: Workflow) => {
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setSelected(updated);
  };

  const handleCreate = (wf: Workflow) => {
    setWorkflows((prev) => [...prev, wf]);
    setShowCreateDialog(false);
    toast({ title: "Workflow created", description: `${wf.name} is ready for configuration.` });
  };

  if (selected) {
    const currentWf = workflows.find((w) => w.id === selected.id) || selected;
    return (
      <AppLayout title="Workflow Details">
        <WorkflowDetail
          workflow={currentWf}
          onBack={() => setSelected(null)}
          onToggleStatus={() => handleToggleStatus(currentWf.id)}
          onDelete={() => handleDelete(currentWf.id)}
          onUpdate={handleUpdateWorkflow}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Workflows">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Workflow Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Configure automated insurance processing pipelines</p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-3.5 w-3.5" />
            Create Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Workflows", value: String(workflows.length), icon: GitBranch, color: "text-primary" },
            { label: "Active", value: String(workflows.filter((w) => w.status === "active").length), icon: Activity, color: "text-success" },
            { label: "Total Cases", value: workflows.reduce((s, w) => s + w.casesProcessed, 0).toLocaleString(), icon: CheckCircle2, color: "text-ai" },
            { label: "Departments", value: String(new Set(workflows.map((w) => w.department)).size), icon: Settings, color: "text-muted-foreground" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search workflows..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "active", "draft", "paused"].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "outline" : "ghost"}
                size="sm"
                className={cn("h-7 text-xs capitalize", statusFilter === s && "border-primary/30 bg-primary/5")}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Workflow cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((wf, i) => (
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group relative"
              onClick={() => setSelected(wf)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <GitBranch className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{wf.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{wf.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-[10px] font-medium", statusColors[wf.status])}>{wf.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => handleToggleStatus(wf.id)}>
                        {wf.status === "active" ? <><Pause className="h-3.5 w-3.5 mr-2" /> Pause</> : <><Play className="h-3.5 w-3.5 mr-2" /> Activate</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(wf)}>
                        <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(wf.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Bot className="h-3 w-3 text-ai" />
                    <span>{wf.agentName}</span>
                  </div>
                  <span>{wf.stages.length} stages</span>
                  <span>{wf.casesProcessed} cases</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {wf.triggers.map((t, idx) => {
                    const Icon = triggerIcons[t.type];
                    return (
                      <div key={idx} className="flex h-6 w-6 items-center justify-center rounded-md bg-muted" title={`${t.type}: ${t.config}`}>
                        <Icon className="h-3 w-3 text-muted-foreground" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
                <span>{wf.department}</span>
                <span>Last run: {wf.lastRun}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <GitBranch className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No workflows found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or create a new workflow</p>
          </div>
        )}
      </div>

      <CreateWorkflowDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onCreate={handleCreate} existingCount={workflows.length} />
    </AppLayout>
  );
}

/* ──────────── Create Workflow Dialog ──────────── */

function CreateWorkflowDialog({ open, onOpenChange, onCreate, existingCount }: {
  open: boolean; onOpenChange: (v: boolean) => void; onCreate: (wf: Workflow) => void; existingCount: number;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("Claims");
  const [agentId, setAgentId] = useState(mockAgents[0]?.id || "");
  const [triggerType, setTriggerType] = useState<WorkflowTrigger["type"]>("mailbox");
  const [triggerConfig, setTriggerConfig] = useState("");
  const [stages, setStages] = useState("");

  const resetForm = () => { setName(""); setDescription(""); setDepartment("Claims"); setAgentId(mockAgents[0]?.id || ""); setTriggerType("mailbox"); setTriggerConfig(""); setStages(""); };

  const handleCreate = () => {
    const agent = mockAgents.find((a) => a.id === agentId);
    const newWf: Workflow = {
      id: `WF-${String(existingCount + 1).padStart(3, "0")}`,
      name,
      description,
      status: "draft",
      agentId,
      agentName: agent?.name || "Unassigned",
      triggers: triggerConfig ? [{ type: triggerType, config: triggerConfig }] : [],
      stages: stages ? stages.split(",").map((s) => s.trim()).filter(Boolean) : ["Step 1"],
      casesProcessed: 0,
      lastRun: "Never",
      department,
    };
    onCreate(newWf);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Create New Workflow</DialogTitle>
          <DialogDescription className="text-xs">Define a new automated processing pipeline</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-medium">Workflow Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Prior Auth Processing" className="h-8 text-xs mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this workflow do?" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INSURANCE_DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium">Assign Agent</label>
              <Select value={agentId} onValueChange={setAgentId}>
                <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockAgents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Trigger Type</label>
              <Select value={triggerType} onValueChange={(v) => setTriggerType(v as WorkflowTrigger["type"])}>
                <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mailbox">Email Mailbox</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="phone">Phone / IVR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium">Trigger Config</label>
              <Input value={triggerConfig} onChange={(e) => setTriggerConfig(e.target.value)} placeholder="e.g., claims@insurai.com" className="h-8 text-xs mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">Pipeline Stages (comma-separated)</label>
            <Input value={stages} onChange={(e) => setStages(e.target.value)} placeholder="e.g., Intake, Parsing, Review, Decision" className="h-8 text-xs mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" className="text-xs" disabled={!name} onClick={handleCreate}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Create Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────── Workflow Detail ──────────── */

function WorkflowDetail({ workflow, onBack, onToggleStatus, onDelete, onUpdate }: {
  workflow: Workflow; onBack: () => void; onToggleStatus: () => void; onDelete: () => void; onUpdate: (wf: Workflow) => void;
}) {
  const [showAddTrigger, setShowAddTrigger] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState(workflow.name);
  const [editDesc, setEditDesc] = useState(workflow.description);
  const [newTriggerType, setNewTriggerType] = useState<WorkflowTrigger["type"]>("webhook");
  const [newTriggerConfig, setNewTriggerConfig] = useState("");
  const [newStage, setNewStage] = useState("");

  const handleRemoveTrigger = (idx: number) => {
    const updated = { ...workflow, triggers: workflow.triggers.filter((_, i) => i !== idx) };
    onUpdate(updated);
    toast({ title: "Trigger removed" });
  };

  const handleAddTrigger = () => {
    if (!newTriggerConfig) return;
    const updated = { ...workflow, triggers: [...workflow.triggers, { type: newTriggerType, config: newTriggerConfig }] };
    onUpdate(updated);
    setNewTriggerConfig("");
    setShowAddTrigger(false);
    toast({ title: "Trigger added" });
  };

  const handleChangeAgent = (agentId: string) => {
    const agent = mockAgents.find((a) => a.id === agentId);
    if (!agent) return;
    onUpdate({ ...workflow, agentId, agentName: agent.name });
    toast({ title: "Agent assigned", description: `${agent.name} is now assigned to this workflow.` });
  };

  const handleSaveSettings = () => {
    onUpdate({ ...workflow, name: editName, description: editDesc });
    setShowSettings(false);
    toast({ title: "Workflow updated" });
  };

  const handleAddStage = () => {
    if (!newStage) return;
    onUpdate({ ...workflow, stages: [...workflow.stages, newStage] });
    setNewStage("");
    toast({ title: "Stage added" });
  };

  const handleRemoveStage = (idx: number) => {
    onUpdate({ ...workflow, stages: workflow.stages.filter((_, i) => i !== idx) });
    toast({ title: "Stage removed" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{workflow.name}</h2>
              <Badge className={cn("text-[10px]", statusColors[workflow.status])}>{workflow.status}</Badge>
              <Badge variant="outline" className="text-[10px]">{workflow.department}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {workflow.status === "active" ? (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-warning" onClick={onToggleStatus}>
              <Pause className="h-3.5 w-3.5" /> Pause
            </Button>
          ) : (
            <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={onToggleStatus}>
              <Play className="h-3.5 w-3.5" /> Activate
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => { setEditName(workflow.name); setEditDesc(workflow.description); setShowSettings(true); }}>
            <Settings className="h-3.5 w-3.5" /> Settings
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-destructive" onClick={() => { onDelete(); onBack(); }}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList className="h-8">
          <TabsTrigger value="pipeline" className="text-xs h-7">Pipeline</TabsTrigger>
          <TabsTrigger value="triggers" className="text-xs h-7">Triggers & Integrations</TabsTrigger>
          <TabsTrigger value="agent" className="text-xs h-7">AI Agent</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workflow Stages</h3>
              <div className="flex items-center gap-2">
                <Input value={newStage} onChange={(e) => setNewStage(e.target.value)} placeholder="New stage name..." className="h-7 text-xs w-48" onKeyDown={(e) => e.key === "Enter" && handleAddStage()} />
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleAddStage} disabled={!newStage}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {workflow.stages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 rounded-lg border px-4 py-2.5 text-sm">{stage}</div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => handleRemoveStage(i)}>
                    <XCircle className="h-3.5 w-3.5" />
                  </Button>
                  {i < workflow.stages.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="mt-4 space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Triggers</h3>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setShowAddTrigger(true)}>
                <Plus className="h-3 w-3" /> Add Trigger
              </Button>
            </div>
            <div className="space-y-3">
              {workflow.triggers.map((trigger, i) => {
                const Icon = triggerIcons[trigger.type];
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{trigger.type}</p>
                        <p className="text-xs text-muted-foreground font-mono">{trigger.config}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveTrigger(i)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
              {workflow.triggers.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">No triggers configured. Add a trigger to automate this workflow.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Available Integrations</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Email Mailbox", desc: "Monitor inbox for incoming submissions", icon: Mail, type: "mailbox" as const },
                { name: "Webhook", desc: "Receive data from external systems", icon: Webhook, type: "webhook" as const },
                { name: "Scheduled", desc: "Run on a time-based schedule", icon: CalendarClock, type: "schedule" as const },
                { name: "Phone / IVR", desc: "Handle incoming phone calls", icon: Phone, type: "phone" as const },
              ].map((int) => (
                <div
                  key={int.name}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => { setNewTriggerType(int.type); setShowAddTrigger(true); }}
                >
                  <int.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium">{int.name}</p>
                    <p className="text-[10px] text-muted-foreground">{int.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agent" className="mt-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assigned Agent</h3>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ai/10">
                <Bot className="h-5 w-5 text-ai" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{workflow.agentName}</p>
                <p className="text-xs text-muted-foreground">
                  {mockAgents.find((a) => a.id === workflow.agentId)?.role || "Agent"}
                </p>
              </div>
              <Badge className="bg-success/10 text-success text-[10px]">Active</Badge>
            </div>

            <Separator className="my-4" />

            <h4 className="text-xs font-semibold text-muted-foreground mb-3">Available Agents</h4>
            <div className="space-y-2">
              {mockAgents
                .filter((a) => a.id !== workflow.agentId)
                .map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground">{agent.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => handleChangeAgent(agent.id)}>Select</Button>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Trigger Dialog */}
      <Dialog open={showAddTrigger} onOpenChange={setShowAddTrigger}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add Trigger</DialogTitle>
            <DialogDescription className="text-xs">Configure how this workflow gets activated</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium">Trigger Type</label>
              <Select value={newTriggerType} onValueChange={(v) => setNewTriggerType(v as WorkflowTrigger["type"])}>
                <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mailbox">Email Mailbox</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="phone">Phone / IVR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium">Configuration</label>
              <Input value={newTriggerConfig} onChange={(e) => setNewTriggerConfig(e.target.value)} placeholder={
                newTriggerType === "mailbox" ? "email@insurai.com" :
                newTriggerType === "webhook" ? "https://api.insurai.com/webhooks/..." :
                newTriggerType === "schedule" ? "Daily at 6:00 AM" :
                newTriggerType === "phone" ? "+1-800-555-0100" : "Triggered by operator"
              } className="h-8 text-xs mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" className="text-xs" disabled={!newTriggerConfig} onClick={handleAddTrigger}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Trigger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Workflow Settings</DialogTitle>
            <DialogDescription className="text-xs">Edit workflow name and description</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium">Name</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 text-xs mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium">Description</label>
              <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" className="text-xs" onClick={handleSaveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

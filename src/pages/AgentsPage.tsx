import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  mockAgents as initialAgents,
  type AIAgent,
  type AgentStatus,
  type AgentType,
  AGENT_TYPES,
  AVAILABLE_MODELS,
  INSURANCE_DEPARTMENTS,
} from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bot, Plus, ArrowLeft, Play, Square, Settings, Cpu, Wrench,
  BookOpen, ShieldCheck, FileText, TestTube2, Activity, ChevronRight,
  Upload, Search, CheckCircle2, XCircle, Clock, AlertTriangle,
  Copy, Trash2, MoreVertical, Phone, PhoneIncoming, PhoneOutgoing,
  Headphones, Eye, Radio, Gauge, Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<AgentStatus, { label: string; color: string; icon: React.ElementType }> = {
  running: { label: "Running", color: "bg-success/10 text-success", icon: Activity },
  idle: { label: "Idle", color: "bg-muted text-muted-foreground", icon: Clock },
  error: { label: "Error", color: "bg-destructive/10 text-destructive", icon: XCircle },
  testing: { label: "Testing", color: "bg-info/10 text-info", icon: TestTube2 },
};

const agentTypeIcons: Record<AgentType, React.ElementType> = {
  document_processing: FileText,
  voice_inbound: PhoneIncoming,
  voice_outbound: PhoneOutgoing,
  decision_engine: Gauge,
  monitoring: Eye,
  orchestrator: Radio,
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filtered = agents.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchType = typeFilter === "all" || a.agentType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    total: agents.length,
    running: agents.filter((a) => a.status === "running").length,
    tasksToday: agents.reduce((s, a) => s + Math.round(a.tasksProcessed * 0.08), 0),
    avgSuccess: (agents.reduce((s, a) => s + a.successRate, 0) / agents.length).toFixed(1),
  };

  const handleDelete = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Agent deleted", description: "The agent has been removed." });
  };

  const handleDuplicate = (agent: AIAgent) => {
    const newAgent: AIAgent = {
      ...agent,
      id: `AGT-${String(agents.length + 1).padStart(3, "0")}`,
      name: `${agent.name} (Copy)`,
      status: "idle",
      tasksProcessed: 0,
      lastActive: "Never",
    };
    setAgents((prev) => [...prev, newAgent]);
    toast({ title: "Agent duplicated", description: `${newAgent.name} created.` });
  };

  const handleToggleStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "running" ? "idle" : "running", lastActive: "Just now" }
          : a
      )
    );
  };

  const handleCreateAgent = (agent: AIAgent) => {
    setAgents((prev) => [...prev, agent]);
    setShowCreateDialog(false);
    toast({ title: "Agent created", description: `${agent.name} is ready for configuration.` });
  };

  if (selectedAgent) {
    const currentAgent = agents.find((a) => a.id === selectedAgent.id) || selectedAgent;
    return (
      <AppLayout title="Agent Configuration">
        <AgentDetail agent={currentAgent} onBack={() => setSelectedAgent(null)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="AI Agents">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">AI Agent Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define, configure, test, and deploy AI agents for insurance operations
            </p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-3.5 w-3.5" /> Create Agent
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Agents", value: String(stats.total), icon: Bot, color: "text-primary" },
            { label: "Running", value: String(stats.running), icon: Activity, color: "text-success" },
            { label: "Tasks Today", value: stats.tasksToday.toLocaleString(), icon: CheckCircle2, color: "text-ai" },
            { label: "Avg Success", value: `${stats.avgSuccess}%`, icon: ShieldCheck, color: "text-success" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border bg-card p-4"
            >
              <div className="flex items-center gap-2">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents or departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "running", "idle", "error", "testing"].map((s) => (
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-[170px] text-xs">
              <SelectValue placeholder="Agent type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {AGENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Agent cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((agent, i) => {
            const sc = statusConfig[agent.status];
            const TypeIcon = agentTypeIcons[agent.agentType];
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group relative"
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ai/10">
                      {agent.agentType === "voice_inbound" ? (
                        <PhoneIncoming className="h-5 w-5 text-ai" />
                      ) : (
                        <Bot className="h-5 w-5 text-ai" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{agent.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-[10px] font-medium", sc.color)}>{sc.label}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => handleToggleStatus(agent.id)}>
                          {agent.status === "running" ? (
                            <><Square className="h-3.5 w-3.5 mr-2" /> Stop</>
                          ) : (
                            <><Play className="h-3.5 w-3.5 mr-2" /> Start</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(agent)}>
                          <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(agent.id)}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{agent.description}</p>

                <Separator className="my-3" />

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-semibold">{agent.tasksProcessed.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Tasks</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{agent.successRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Success</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{agent.avgProcessingTime}</p>
                    <p className="text-[10px] text-muted-foreground">Avg Time</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <TypeIcon className="h-3 w-3" />
                      {AGENT_TYPES.find((t) => t.value === agent.agentType)?.label}
                    </span>
                    <span>·</span>
                    <span>{agent.department}</span>
                  </div>
                  <span>{agent.model} · {agent.lastActive}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bot className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No agents found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or create a new agent</p>
          </div>
        )}
      </div>

      <CreateAgentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreate={handleCreateAgent}
        existingCount={agents.length}
      />
    </AppLayout>
  );
}

/* ──────────────────────── Create Agent Dialog ──────────────────────── */

function CreateAgentDialog({
  open,
  onOpenChange,
  onCreate,
  existingCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (agent: AIAgent) => void;
  existingCount: number;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [agentType, setAgentType] = useState<AgentType>("document_processing");
  const [model, setModel] = useState("GPT-4o");
  const [department, setDepartment] = useState("Claims");
  const [systemPrompt, setSystemPrompt] = useState("");

  const resetForm = () => {
    setStep(1);
    setName("");
    setRole("");
    setDescription("");
    setAgentType("document_processing");
    setModel("GPT-4o");
    setDepartment("Claims");
    setSystemPrompt("");
  };

  const handleCreate = () => {
    const newAgent: AIAgent = {
      id: `AGT-${String(existingCount + 1).padStart(3, "0")}`,
      name,
      role,
      description,
      model,
      status: "idle",
      agentType,
      department,
      tools: [],
      knowledgeBase: [],
      policyRules: systemPrompt ? [systemPrompt] : [],
      tasksProcessed: 0,
      successRate: 0,
      avgProcessingTime: "—",
      lastActive: "Never",
      integrations: agentType === "voice_inbound" ? ["Telephony API", "IVR System"] : ["Webhook API"],
    };
    onCreate(newAgent);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Create New Agent</DialogTitle>
          <DialogDescription className="text-xs">
            Step {step} of 3 — {step === 1 ? "Agent Type & Identity" : step === 2 ? "Model & Department" : "System Instructions"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-2 block">Agent Type</label>
              <div className="grid grid-cols-2 gap-2">
                {AGENT_TYPES.map((t) => {
                  const Icon = agentTypeIcons[t.value];
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setAgentType(t.value)}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary/40",
                        agentType === t.value && "border-primary bg-primary/5 ring-1 ring-primary/20"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", agentType === t.value ? "text-primary" : "text-muted-foreground")} />
                      <div>
                        <p className="text-xs font-medium">{t.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{t.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Agent Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Claims Intake Agent" className="h-8 text-xs mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium">Role</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Document Intake & Extraction" className="h-8 text-xs mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this agent do?"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-2 block">AI Model</label>
              <div className="space-y-2">
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setModel(m.value)}
                    className={cn(
                      "flex items-center justify-between w-full rounded-lg border p-3 text-left transition-all hover:border-primary/40",
                      model === m.value && "border-primary bg-primary/5 ring-1 ring-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Cpu className={cn("h-4 w-4", model === m.value ? "text-primary" : "text-muted-foreground")} />
                      <div>
                        <p className="text-xs font-medium">{m.label}</p>
                        <p className="text-[10px] text-muted-foreground">{m.provider}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize">{m.tier}</Badge>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-xs font-medium">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-8 text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSURANCE_DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {agentType === "voice_inbound" && (
              <div className="rounded-lg border border-info/30 bg-info/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Headphones className="h-4 w-4 text-info" />
                  <p className="text-xs font-medium text-info">Inbound Call Configuration</p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  This agent will handle incoming phone calls via IVR integration. You can configure telephony settings, call scripts, and escalation rules after creation.
                </p>
              </div>
            )}

            {agentType === "voice_outbound" && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <PhoneOutgoing className="h-4 w-4 text-warning" />
                  <p className="text-xs font-medium text-warning">Outbound Call Configuration</p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  This agent will make outgoing calls for follow-ups, appointment reminders, and payment collection. Compliance with TCPA regulations will be enforced.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium">System Instructions / Prompt</label>
              <p className="text-[10px] text-muted-foreground mt-0.5 mb-2">
                Define the agent's behavior, rules, and constraints. This will be used as the base policy rule.
              </p>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder={
                  agentType === "voice_inbound"
                    ? "You are a member services agent for a health insurance company. Always verify member identity before disclosing any PHI. Be empathetic and professional..."
                    : "You are an AI agent specialized in insurance document processing. Follow all HIPAA guidelines when handling PHI..."
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              />
            </div>

            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <h4 className="text-xs font-semibold">Agent Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Name:</span> {name || "—"}</div>
                <div><span className="text-muted-foreground">Type:</span> {AGENT_TYPES.find((t) => t.value === agentType)?.label}</div>
                <div><span className="text-muted-foreground">Model:</span> {model}</div>
                <div><span className="text-muted-foreground">Dept:</span> {department}</div>
                <div><span className="text-muted-foreground">Role:</span> {role || "—"}</div>
              </div>
            </div>

            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-warning" />
                <p className="text-[10px] text-muted-foreground">
                  <strong className="text-foreground">Data Governance:</strong> All agents operate under HIPAA-compliant data handling. PHI access is logged and auditable.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              size="sm"
              className="text-xs"
              disabled={step === 1 && (!name || !role)}
              onClick={() => setStep(step + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button size="sm" className="text-xs" disabled={!name || !role} onClick={handleCreate}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Create Agent
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────────── Agent Detail ──────────────────────── */

function AgentDetail({ agent, onBack }: { agent: AIAgent; onBack: () => void }) {
  const sc = statusConfig[agent.status];
  const TypeIcon = agentTypeIcons[agent.agentType];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ai/10">
            {agent.agentType === "voice_inbound" ? (
              <PhoneIncoming className="h-5 w-5 text-ai" />
            ) : (
              <Bot className="h-5 w-5 text-ai" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{agent.name}</h2>
              <Badge className={cn("text-[10px]", sc.color)}>{sc.label}</Badge>
              <Badge variant="outline" className="text-[10px] gap-1">
                <TypeIcon className="h-3 w-3" />
                {AGENT_TYPES.find((t) => t.value === agent.agentType)?.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{agent.role} · {agent.model} · {agent.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <TestTube2 className="h-3.5 w-3.5" /> Test Agent
          </Button>
          {agent.status === "running" ? (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-destructive">
              <Square className="h-3.5 w-3.5" /> Stop
            </Button>
          ) : (
            <Button size="sm" className="h-8 gap-1.5 text-xs">
              <Play className="h-3.5 w-3.5" /> Start
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="config">
        <TabsList className="h-8">
          <TabsTrigger value="config" className="text-xs h-7">Configuration</TabsTrigger>
          <TabsTrigger value="tools" className="text-xs h-7">Tools</TabsTrigger>
          <TabsTrigger value="knowledge" className="text-xs h-7">Knowledge Base</TabsTrigger>
          <TabsTrigger value="rules" className="text-xs h-7">Policy Rules</TabsTrigger>
          {(agent.agentType === "voice_inbound" || agent.agentType === "voice_outbound") && (
            <TabsTrigger value="telephony" className="text-xs h-7">Telephony</TabsTrigger>
          )}
          <TabsTrigger value="testing" className="text-xs h-7">Testing</TabsTrigger>
        </TabsList>

        {/* Configuration */}
        <TabsContent value="config" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agent Identity</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-muted-foreground">Name</label>
                  <Input defaultValue={agent.name} className="h-8 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground">Role</label>
                  <Input defaultValue={agent.role} className="h-8 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground">Description</label>
                  <textarea
                    defaultValue={agent.description}
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground">Department</label>
                  <Select defaultValue={agent.department}>
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INSURANCE_DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model & Performance</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-muted-foreground">Model</label>
                  <Select defaultValue={agent.model}>
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label} ({m.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-semibold">{agent.tasksProcessed.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Tasks</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-semibold text-success">{agent.successRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Success</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-semibold">{agent.avgProcessingTime}</p>
                    <p className="text-[10px] text-muted-foreground">Avg Time</p>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground">Integrations</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {agent.integrations.map((int) => (
                      <Badge key={int} variant="outline" className="text-[10px]">{int}</Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px]">+ Add</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tools */}
        <TabsContent value="tools" className="mt-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agent Tools</h3>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <Plus className="h-3 w-3" /> Add Tool
              </Button>
            </div>
            <div className="space-y-3">
              {agent.tools.map((tool) => (
                <div key={tool.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-[11px] text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                  <Switch checked={tool.enabled} />
                </div>
              ))}
            </div>
            {agent.tools.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">No tools configured. Add tools to extend agent capabilities.</p>
            )}
          </div>
        </TabsContent>

        {/* Knowledge Base */}
        <TabsContent value="knowledge" className="mt-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Knowledge Base</h3>
                <p className="text-[11px] text-muted-foreground mt-1">Upload files and documents for the agent to reference</p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <Upload className="h-3 w-3" /> Upload Files
              </Button>
            </div>
            <div className="space-y-2">
              {agent.knowledgeBase.map((kb) => (
                <div key={kb.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{kb.name}</p>
                      <p className="text-[10px] text-muted-foreground">{kb.type.toUpperCase()} · {kb.size}</p>
                    </div>
                  </div>
                  {kb.indexed ? (
                    <Badge className="bg-success/10 text-success text-[10px]">Indexed</Badge>
                  ) : (
                    <Badge className="bg-warning/10 text-warning text-[10px]">Pending Index</Badge>
                  )}
                </div>
              ))}
            </div>
            {agent.knowledgeBase.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4 mb-2">No knowledge base files uploaded yet.</p>
            )}
            <div className="mt-4 rounded-lg border-2 border-dashed p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Drag & drop files here, or click to browse</p>
              <p className="text-[10px] text-muted-foreground mt-1">Supports PDF, CSV, DOCX, TXT</p>
            </div>
          </div>
        </TabsContent>

        {/* Policy Rules */}
        <TabsContent value="rules" className="mt-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Policy Rules</h3>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <Plus className="h-3 w-3" /> Add Rule
              </Button>
            </div>
            <div className="space-y-2">
              {agent.policyRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-sm flex-1">{rule}</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            {agent.policyRules.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">No policy rules defined. Add rules to constrain agent behavior.</p>
            )}
          </div>
        </TabsContent>

        {/* Telephony (voice agents only) */}
        {(agent.agentType === "voice_inbound" || agent.agentType === "voice_outbound") && (
          <TabsContent value="telephony" className="mt-4 space-y-4">
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {agent.agentType === "voice_inbound" ? "Inbound Call Settings" : "Outbound Call Settings"}
              </h3>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground">Phone Number</label>
                    <Input defaultValue={agent.agentType === "voice_inbound" ? "+1-800-INSURAI" : "+1-800-555-0199"} className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">Provider</label>
                    <Select defaultValue="twilio">
                      <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="vonage">Vonage</SelectItem>
                        <SelectItem value="bandwidth">Bandwidth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">Voice</label>
                    <Select defaultValue="professional_female">
                      <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional_female">Professional Female</SelectItem>
                        <SelectItem value="professional_male">Professional Male</SelectItem>
                        <SelectItem value="warm_female">Warm Female</SelectItem>
                        <SelectItem value="warm_male">Warm Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground">Language</label>
                    <Select defaultValue="en">
                      <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="zh">Mandarin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">Max Call Duration</label>
                    <Input defaultValue="30" type="number" className="h-8 text-xs mt-1" />
                    <p className="text-[10px] text-muted-foreground mt-0.5">Minutes</p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-xs font-medium">Call Recording</p>
                      <p className="text-[10px] text-muted-foreground">Record calls for QA and compliance</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-[11px] text-muted-foreground">IVR Welcome Message</label>
                <textarea
                  defaultValue="Thank you for calling InsurAI. Your call may be recorded for quality assurance. How can I help you today?"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-xs font-medium">Escalation to Human</p>
                  <p className="text-[10px] text-muted-foreground">Transfer to live agent when confidence is low or member requests</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>
        )}

        {/* Testing */}
        <TabsContent value="testing" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Test Input</h3>
              <textarea
                placeholder={
                  agent.agentType === "voice_inbound"
                    ? "Simulate a call transcript or member inquiry..."
                    : "Paste a sample document or case data to test the agent..."
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1.5 text-xs">
                  <Play className="h-3.5 w-3.5" /> Run Test
                </Button>
                {(agent.agentType === "voice_inbound" || agent.agentType === "voice_outbound") && (
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <Phone className="h-3.5 w-3.5" /> Simulate Call
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                  <Upload className="h-3.5 w-3.5" /> Upload Test File
                </Button>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Test Output</h3>
              <div className="rounded-lg bg-muted p-4 min-h-[200px] text-xs text-muted-foreground font-mono">
                Run a test to see the agent's output here...
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockWorkflows, mockAgents, type Workflow, type WorkflowStatus } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  GitBranch, Plus, Mail, Webhook, Hand, CalendarClock, Bot, Play, Pause,
  ChevronRight, ArrowLeft, Settings, Trash2, Search, MoreVertical, Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockWorkflows.filter((w) => {
    const matchesSearch = search === "" || w.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (selected) {
    return (
      <AppLayout title="Workflow Details">
        <WorkflowDetail workflow={selected} onBack={() => setSelected(null)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Workflows">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Workflow Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Configure automated insurance processing pipelines</p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Create Workflow
          </Button>
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
              className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group"
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
                <Badge className={cn("text-[10px] font-medium", statusColors[wf.status])}>{wf.status}</Badge>
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

              <p className="text-[10px] text-muted-foreground mt-2">Last run: {wf.lastRun}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

function WorkflowDetail({ workflow, onBack }: { workflow: Workflow; onBack: () => void }) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{workflow.name}</h2>
              <Badge className={cn("text-[10px]", statusColors[workflow.status])}>{workflow.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {workflow.status === "active" ? (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-warning">
              <Pause className="h-3.5 w-3.5" /> Pause
            </Button>
          ) : (
            <Button size="sm" className="h-8 gap-1.5 text-xs">
              <Play className="h-3.5 w-3.5" /> Activate
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" /> Settings
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
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Workflow Stages</h3>
            <div className="space-y-2">
              {workflow.stages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 rounded-lg border px-4 py-2.5 text-sm">{stage}</div>
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
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
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
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Available Integrations</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Email Mailbox", desc: "Monitor inbox for incoming submissions", icon: Mail },
                { name: "Webhook", desc: "Receive data from external systems", icon: Webhook },
                { name: "Scheduled", desc: "Run on a time-based schedule", icon: CalendarClock },
                { name: "Manual Trigger", desc: "Start manually by an operator", icon: Hand },
              ].map((int) => (
                <div key={int.name} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
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
              <Button variant="outline" size="sm" className="h-7 text-xs">Change Agent</Button>
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
                  <div key={agent.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground">{agent.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]">Select</Button>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

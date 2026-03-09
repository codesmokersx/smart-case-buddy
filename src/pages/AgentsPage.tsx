import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockAgents, type AIAgent, type AgentStatus } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Bot, Plus, ArrowLeft, Play, Square, Settings, Cpu, Wrench,
  BookOpen, ShieldCheck, FileText, TestTube2, Activity, ChevronRight,
  Upload, Search, CheckCircle2, XCircle, Clock, AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusConfig: Record<AgentStatus, { label: string; color: string; icon: React.ElementType }> = {
  running: { label: "Running", color: "bg-success/10 text-success", icon: Activity },
  idle: { label: "Idle", color: "bg-muted text-muted-foreground", icon: Clock },
  error: { label: "Error", color: "bg-destructive/10 text-destructive", icon: XCircle },
  testing: { label: "Testing", color: "bg-info/10 text-info", icon: TestTube2 },
};

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  if (selectedAgent) {
    return (
      <AppLayout title="Agent Configuration">
        <AgentDetail agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
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
            <p className="text-xs text-muted-foreground mt-0.5">Define, configure, test, and deploy AI agents for insurance operations</p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Create Agent
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Agents", value: "4", icon: Bot, color: "text-primary" },
            { label: "Running", value: "2", icon: Activity, color: "text-success" },
            { label: "Tasks Today", value: "312", icon: CheckCircle2, color: "text-ai" },
            { label: "Avg Success", value: "95.1%", icon: ShieldCheck, color: "text-success" },
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

        {/* Agent cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          {mockAgents.map((agent, i) => {
            const sc = statusConfig[agent.status];
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ai/10">
                      <Bot className="h-5 w-5 text-ai" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{agent.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <Badge className={cn("text-[10px] font-medium", sc.color)}>{sc.label}</Badge>
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
                  <span>Model: {agent.model}</span>
                  <span>Last active: {agent.lastActive}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

function AgentDetail({ agent, onBack }: { agent: AIAgent; onBack: () => void }) {
  const sc = statusConfig[agent.status];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ai/10">
            <Bot className="h-5 w-5 text-ai" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{agent.name}</h2>
              <Badge className={cn("text-[10px]", sc.color)}>{sc.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{agent.role} · {agent.model}</p>
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
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model & Performance</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-muted-foreground">Model</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <select className="flex h-8 w-full rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>{agent.model}</option>
                      <option>GPT-4o</option>
                      <option>GPT-4o Mini</option>
                      <option>Claude 3.5 Sonnet</option>
                      <option>Gemini 2.0 Flash</option>
                      <option>Gemini 1.5 Pro</option>
                    </select>
                  </div>
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
                      <p className="text-[10px] text-muted-foreground">
                        {kb.type.toUpperCase()} · {kb.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {kb.indexed ? (
                      <Badge className="bg-success/10 text-success text-[10px]">Indexed</Badge>
                    ) : (
                      <Badge className="bg-warning/10 text-warning text-[10px]">Pending Index</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

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
          </div>
        </TabsContent>

        {/* Testing */}
        <TabsContent value="testing" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Test Input</h3>
              <textarea
                placeholder="Paste a sample document or case data to test the agent..."
                className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1.5 text-xs">
                  <Play className="h-3.5 w-3.5" /> Run Test
                </Button>
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

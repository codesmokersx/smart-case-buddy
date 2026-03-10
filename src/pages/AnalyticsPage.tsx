import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp, TrendingDown, Clock, Bot, Users, FileCheck, ShieldCheck, AlertTriangle,
} from "lucide-react";
import { useState } from "react";

/* ── Mock analytics data ── */
const claimsOverTime = [
  { month: "Jul", processed: 320, automated: 245, manual: 75 },
  { month: "Aug", processed: 380, automated: 302, manual: 78 },
  { month: "Sep", processed: 410, automated: 340, manual: 70 },
  { month: "Oct", processed: 460, automated: 388, manual: 72 },
  { month: "Nov", processed: 520, automated: 448, manual: 72 },
  { month: "Dec", processed: 490, automated: 420, manual: 70 },
  { month: "Jan", processed: 550, automated: 484, manual: 66 },
];

const processingTimeData = [
  { month: "Jul", avg: 6.8, p95: 14.2 },
  { month: "Aug", avg: 6.1, p95: 13.5 },
  { month: "Sep", avg: 5.4, p95: 12.1 },
  { month: "Oct", avg: 4.9, p95: 11.0 },
  { month: "Nov", avg: 4.5, p95: 10.2 },
  { month: "Dec", avg: 4.3, p95: 9.8 },
  { month: "Jan", avg: 4.2, p95: 9.1 },
];

const casesByStage = [
  { stage: "Intake", count: 45 },
  { stage: "Parsing", count: 32 },
  { stage: "Extraction", count: 28 },
  { stage: "Validation", count: 18 },
  { stage: "Review", count: 12 },
  { stage: "Complete", count: 89 },
];

const casesByType = [
  { name: "New Application", value: 35, color: "hsl(220, 70%, 45%)" },
  { name: "Claims Review", value: 30, color: "hsl(173, 58%, 39%)" },
  { name: "Eligibility", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Policy Compare", value: 15, color: "hsl(280, 60%, 50%)" },
];

const agentPerformance = [
  { name: "Claim Intake", tasks: 1247, success: 96.2, avgTime: "2.3m" },
  { name: "Doc Validation", tasks: 892, success: 98.1, avgTime: "1.1m" },
  { name: "Policy Validation", tasks: 634, success: 94.7, avgTime: "3.8m" },
  { name: "Workflow Routing", tasks: 445, success: 91.3, avgTime: "0.5m" },
];

const complianceMetrics = [
  { label: "PHI Access Violations", value: "0", status: "good" as const },
  { label: "Audit Log Coverage", value: "100%", status: "good" as const },
  { label: "Data Retention Compliance", value: "98.7%", status: "good" as const },
  { label: "Pending Access Reviews", value: "3", status: "warning" as const },
];

const kpiCards = [
  { label: "Claims Processed", value: "3,130", change: "+12.4%", trend: "up" as const, icon: FileCheck },
  { label: "Automation Rate", value: "87.6%", change: "+3.2%", trend: "up" as const, icon: Bot },
  { label: "Avg Processing Time", value: "4.2 hrs", change: "-18%", trend: "up" as const, icon: Clock },
  { label: "Manual Interventions", value: "12.4%", change: "-3.2%", trend: "up" as const, icon: Users },
];

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <AppLayout title="Analytics">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Operations performance &amp; compliance metrics
            </p>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{kpi.value}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className="text-[11px] text-success">{kpi.change}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="operations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="operations" className="text-xs">Operations</TabsTrigger>
            <TabsTrigger value="agents" className="text-xs">AI Agents</TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs">Compliance &amp; Governance</TabsTrigger>
          </TabsList>

          {/* ── Operations Tab ── */}
          <TabsContent value="operations" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Claims Over Time */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Claims Processed</CardTitle>
                  <CardDescription className="text-xs">Automated vs manual processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={claimsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                      <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="automated" stackId="1" stroke="hsl(220, 70%, 45%)" fill="hsl(220, 70%, 45%)" fillOpacity={0.3} name="Automated" />
                      <Area type="monotone" dataKey="manual" stackId="1" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.3} name="Manual" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Processing Time */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Processing Time (hours)</CardTitle>
                  <CardDescription className="text-xs">Average &amp; P95 latency trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={processingTimeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="avg" stroke="hsl(173, 58%, 39%)" strokeWidth={2} dot={{ r: 3 }} name="Avg" />
                      <Line type="monotone" dataKey="p95" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" name="P95" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cases by Stage */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cases by Stage</CardTitle>
                  <CardDescription className="text-xs">Current pipeline distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={casesByStage}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
                      <Bar dataKey="count" fill="hsl(220, 70%, 45%)" radius={[4, 4, 0, 0]} name="Cases" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cases by Type */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cases by Type</CardTitle>
                  <CardDescription className="text-xs">Distribution across case categories</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={casesByType} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                        {casesByType.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── AI Agents Tab ── */}
          <TabsContent value="agents" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {agentPerformance.map((agent) => (
                <Card key={agent.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{agent.name}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{agent.avgTime} avg</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Tasks Processed</p>
                        <p className="text-lg font-semibold">{agent.tasks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <p className="text-lg font-semibold">{agent.success}%</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-success transition-all"
                        style={{ width: `${agent.success}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Compliance & Governance Tab ── */}
          <TabsContent value="compliance" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Compliance KPIs */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <CardTitle className="text-sm">Data Governance Status</CardTitle>
                  </div>
                  <CardDescription className="text-xs">HIPAA &amp; insurance data compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {complianceMetrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-xs">{m.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{m.value}</span>
                        {m.status === "good" ? (
                          <ShieldCheck className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Audit Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recent Audit Events</CardTitle>
                  <CardDescription className="text-xs">PHI access &amp; data operations log</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { action: "Case CAS-2024-001 accessed by Sarah Chen", time: "2 min ago", type: "access" },
                    { action: "Medical records exported — audit logged", time: "15 min ago", type: "export" },
                    { action: "Role 'Claims Processor' assigned to Mike Torres", time: "1 hr ago", type: "role" },
                    { action: "PHI data masked for external report", time: "2 hrs ago", type: "mask" },
                    { action: "Access review completed for Q1 2024", time: "1 day ago", type: "review" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs">{event.action}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;

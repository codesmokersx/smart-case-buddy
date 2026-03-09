import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockCases } from "@/lib/mockData";
import { AIStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Filter, Plus, ArrowUpDown, FileText, Clock, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusTabs = [
  { value: "all", label: "All Cases", count: 8 },
  { value: "new", label: "New", count: 1 },
  { value: "in_progress", label: "In Progress", count: 3 },
  { value: "review", label: "Review", count: 2 },
  { value: "completed", label: "Completed", count: 1 },
  { value: "escalated", label: "Escalated", count: 1 },
];

const caseTypeFilters = ["All Types", "New Application", "Claims Review", "Eligibility Check", "Policy Comparison"];

export default function CasesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [caseTypeFilter, setCaseTypeFilter] = useState("All Types");

  const filteredCases = mockCases.filter((c) => {
    const matchesTab = activeTab === "all" || c.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedUser.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = caseTypeFilter === "All Types" || c.caseType === caseTypeFilter;
    return matchesTab && matchesSearch && matchesType;
  });

  return (
    <AppLayout title="Cases">
      <div className="p-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            { label: "Total Cases", value: "8", icon: FileText, color: "text-primary" },
            { label: "In Progress", value: "3", icon: Clock, color: "text-info" },
            { label: "Needs Review", value: "2", icon: AlertTriangle, color: "text-warning" },
            { label: "Completed", value: "1", icon: CheckCircle2, color: "text-success" },
            { label: "Escalated", value: "1", icon: AlertTriangle, color: "text-destructive" },
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

        {/* Tabs + Search + Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-8">
              {statusTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="text-xs h-7 px-3">
                  {t.label}
                  <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-[10px]">{t.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-56 pl-8 text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => navigate("/cases/new")}>
              <Plus className="h-3.5 w-3.5" />
              New Case
            </Button>
          </div>
        </div>

        {/* Type filter chips */}
        <div className="flex items-center gap-2">
          {caseTypeFilters.map((t) => (
            <Button
              key={t}
              variant={caseTypeFilter === t ? "outline" : "ghost"}
              size="sm"
              className={cn("h-7 text-xs", caseTypeFilter === t && "border-primary/30 bg-primary/5")}
              onClick={() => setCaseTypeFilter(t)}
            >
              {t}
            </Button>
          ))}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Case ID</TableHead>
                <TableHead className="text-xs">Member</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Stage</TableHead>
                <TableHead className="text-xs">Assigned</TableHead>
                <TableHead className="text-xs">Docs</TableHead>
                <TableHead className="text-xs">AI Status</TableHead>
                <TableHead className="text-xs">Priority</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/cases/${c.id}`)}
                >
                  <TableCell className="font-mono text-xs font-medium text-primary">{c.id}</TableCell>
                  <TableCell className="text-xs font-medium">{c.memberName}</TableCell>
                  <TableCell className="text-xs">{c.caseType}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.workflowStage}</TableCell>
                  <TableCell className="text-xs">
                    {c.assignedUser === "Unassigned" ? (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    ) : c.assignedUser}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className={cn(
                      c.documentsComplete === c.documentsTotal ? "text-success" : "text-warning"
                    )}>
                      {c.documentsComplete}/{c.documentsTotal}
                    </span>
                  </TableCell>
                  <TableCell><AIStatusBadge status={c.aiStatus} /></TableCell>
                  <TableCell><PriorityBadge priority={c.priority} /></TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] capitalize">{c.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground text-right">{c.lastActivity}</TableCell>
                </TableRow>
              ))}
              {filteredCases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-12">
                    No cases found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </AppLayout>
  );
}

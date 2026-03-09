import { AppLayout } from "@/components/AppLayout";
import { mockCases } from "@/lib/mockData";
import { AIStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Open Cases", value: "24", change: "+3 today" },
  { label: "AI Processing", value: "8", change: "4 agents active" },
  { label: "Needs Review", value: "6", change: "2 critical" },
  { label: "Avg. Processing", value: "4.2h", change: "-18% vs last week" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <AppLayout title="Operations Inbox">
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="rounded-xl border bg-card p-4"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
            <Filter className="h-3 w-3" />
            All Cases
          </Button>
          {["New Application", "Claims Review", "Eligibility Check", "Policy Comparison"].map((t) => (
            <Button key={t} variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              {t}
            </Button>
          ))}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-xl border bg-card"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Case ID</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Workflow Stage</TableHead>
                <TableHead className="text-xs">Assigned</TableHead>
                <TableHead className="text-xs">AI Status</TableHead>
                <TableHead className="text-xs">Priority</TableHead>
                <TableHead className="text-xs text-right">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCases.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/cases/${c.id}`)}
                >
                  <TableCell className="font-mono text-xs font-medium text-primary">
                    {c.id}
                  </TableCell>
                  <TableCell className="text-xs">{c.caseType}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.workflowStage}</TableCell>
                  <TableCell className="text-xs">
                    {c.assignedUser === "Unassigned" ? (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    ) : (
                      c.assignedUser
                    )}
                  </TableCell>
                  <TableCell><AIStatusBadge status={c.aiStatus} /></TableCell>
                  <TableCell><PriorityBadge priority={c.priority} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground text-right">
                    {c.lastActivity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Index;

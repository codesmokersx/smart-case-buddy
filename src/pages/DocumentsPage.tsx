import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockDocuments, mockCases } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FileText, Search, Upload, CheckCircle2, Clock, XCircle, AlertTriangle,
  Bot, ChevronRight, Filter, FolderOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusIcon: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  parsed: { icon: CheckCircle2, color: "text-success", label: "Parsed" },
  pending: { icon: Clock, color: "text-muted-foreground", label: "Pending" },
  error: { icon: XCircle, color: "text-destructive", label: "Error" },
  missing: { icon: AlertTriangle, color: "text-warning", label: "Missing" },
};

// Group documents by case
function getDocsByCaseId() {
  const map = new Map<string, typeof mockDocuments>();
  mockDocuments.forEach((doc) => {
    const caseId = doc.caseId || "uncategorized";
    if (!map.has(caseId)) map.set(caseId, []);
    map.get(caseId)!.push(doc);
  });
  return map;
}

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const docsByCase = getDocsByCaseId();

  // Global stats
  const totalDocs = mockDocuments.length;
  const parsed = mockDocuments.filter((d) => d.status === "parsed").length;
  const pending = mockDocuments.filter((d) => d.status === "pending").length;
  const errors = mockDocuments.filter((d) => d.status === "error").length;
  const missing = mockDocuments.filter((d) => d.status === "missing").length;

  const filteredDocs = mockDocuments.filter((d) => {
    const matchesSearch = search === "" || d.name.toLowerCase().includes(search.toLowerCase()) || (d.caseId || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group filtered docs by case
  const filteredByCase = new Map<string, typeof mockDocuments>();
  filteredDocs.forEach((doc) => {
    const caseId = doc.caseId || "uncategorized";
    if (!filteredByCase.has(caseId)) filteredByCase.set(caseId, []);
    filteredByCase.get(caseId)!.push(doc);
  });

  return (
    <AppLayout title="Documents">
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            { label: "Total Documents", value: totalDocs, icon: FileText, color: "text-primary" },
            { label: "Parsed", value: parsed, icon: CheckCircle2, color: "text-success" },
            { label: "Pending", value: pending, icon: Clock, color: "text-muted-foreground" },
            { label: "Errors", value: errors, icon: XCircle, color: "text-destructive" },
            { label: "Missing", value: missing, icon: AlertTriangle, color: "text-warning" },
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

        {/* Search + Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search documents or cases..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "parsed", "pending", "error", "missing"].map((s) => (
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
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs ml-auto">
            <Upload className="h-3.5 w-3.5" /> Upload
          </Button>
        </div>

        {/* Documents grouped by case */}
        <div className="space-y-4">
          {Array.from(filteredByCase.entries()).map(([caseId, docs]) => {
            const caseData = mockCases.find((c) => c.id === caseId);
            const caseParsed = docs.filter((d) => d.status === "parsed").length;
            const caseTotal = docs.length;
            const allComplete = caseParsed === caseTotal;
            const hasMissing = docs.some((d) => d.status === "missing");
            const hasError = docs.some((d) => d.status === "error");

            return (
              <motion.div
                key={caseId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border bg-card overflow-hidden"
              >
                {/* Case header */}
                <div
                  className="flex items-center justify-between px-5 py-3 border-b bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => caseData && navigate(`/cases/${caseData.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">{caseId}</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{caseData?.memberName || "Unknown"}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{caseData?.caseType} · {caseData?.workflowStage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasMissing && (
                      <Badge className="bg-warning/10 text-warning text-[10px] gap-1">
                        <AlertTriangle className="h-2.5 w-2.5" /> Missing docs
                      </Badge>
                    )}
                    {hasError && (
                      <Badge className="bg-destructive/10 text-destructive text-[10px] gap-1">
                        <XCircle className="h-2.5 w-2.5" /> Parse error
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <span className={cn(allComplete ? "text-success" : "text-muted-foreground")}>
                        {caseParsed}/{caseTotal}
                      </span>
                      <Progress value={(caseParsed / caseTotal) * 100} className="w-16 h-1.5" />
                    </div>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1">
                      <Bot className="h-3 w-3" /> Validate
                    </Button>
                  </div>
                </div>

                {/* Document rows */}
                <Table>
                  <TableBody>
                    {docs.map((doc) => {
                      const sc = statusIcon[doc.status];
                      return (
                        <TableRow key={doc.id} className="hover:bg-muted/30">
                          <TableCell className="w-8 pl-5">
                            <sc.icon className={cn("h-3.5 w-3.5", sc.color)} />
                          </TableCell>
                          <TableCell className="text-xs font-medium">{doc.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{doc.type}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {doc.status === "missing" ? "—" : `${doc.pages} pages`}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-[10px]", sc.color)}>{sc.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {doc.status === "missing" && (
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
                                <Upload className="h-3 w-3" /> Upload
                              </Button>
                            )}
                            {doc.status === "error" && (
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-destructive">
                                Retry
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

import { cn } from "@/lib/utils";
import type { AIStatus, CasePriority } from "@/lib/mockData";
import { Bot, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";

const aiStatusConfig: Record<AIStatus, { label: string; className: string; icon: React.ElementType }> = {
  processing: { label: "Processing", className: "bg-info/10 text-info", icon: Loader2 },
  complete: { label: "Complete", className: "bg-success/10 text-success", icon: CheckCircle2 },
  needs_review: { label: "Needs Review", className: "bg-warning/10 text-warning", icon: AlertTriangle },
  error: { label: "Error", className: "bg-destructive/10 text-destructive", icon: XCircle },
};

const priorityConfig: Record<CasePriority, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-priority-critical/10 text-priority-critical" },
  high: { label: "High", className: "bg-priority-high/10 text-priority-high" },
  medium: { label: "Medium", className: "bg-priority-medium/10 text-priority-medium" },
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
};

export function AIStatusBadge({ status }: { status: AIStatus }) {
  const config = aiStatusConfig[status];
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", config.className)}>
      <Icon className={cn("h-3 w-3", status === "processing" && "animate-spin")} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: CasePriority }) {
  const config = priorityConfig[priority];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", config.className)}>
      {config.label}
    </span>
  );
}

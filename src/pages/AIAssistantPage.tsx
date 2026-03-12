import { useState, useRef, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: { label: string; completed: boolean }[];
}

const SUGGESTIONS = [
  "Create a new claims review case for John Smith",
  "Show me all critical priority cases",
  "Set up a new document processing agent with GPT-4o",
  "Create a workflow for fraud detection with email triggers",
  "Add a new user with reviewer role for the Claims department",
  "What's the status of CAS-2024-003?",
];

const simulateResponse = (input: string): { content: string; actions?: { label: string; completed: boolean }[] } => {
  const lower = input.toLowerCase();

  if (lower.includes("create") && lower.includes("case")) {
    return {
      content:
        "I've created a new case **CAS-2024-009** for the claims review. Here's what I set up:\n\n- **Type:** Claims Review\n- **Priority:** High\n- **Assigned to:** Sarah Chen\n- **Workflow:** Claims Document Intelligence\n\nThe case is now visible in your Operations Inbox and the document parsing stage has been initiated.",
      actions: [
        { label: "Created case CAS-2024-009", completed: true },
        { label: "Assigned to Sarah Chen", completed: true },
        { label: "Initiated document parsing workflow", completed: true },
      ],
    };
  }

  if (lower.includes("agent")) {
    return {
      content:
        "I've configured a new AI agent. Here's the setup:\n\n- **Name:** Document Analysis Agent\n- **Model:** GPT-4o\n- **Type:** Document Processing\n- **Department:** Claims\n- **Tools:** PDF Parser, OCR Engine, Table Extractor\n\nThe agent is now in **testing** status. Would you like me to activate it or run a test first?",
      actions: [
        { label: "Created Document Analysis Agent", completed: true },
        { label: "Configured GPT-4o model", completed: true },
        { label: "Enabled 3 processing tools", completed: true },
        { label: "Agent ready for testing", completed: false },
      ],
    };
  }

  if (lower.includes("workflow")) {
    return {
      content:
        "I've built a new workflow for you:\n\n- **Name:** Fraud Detection Pipeline\n- **Trigger:** Email → fraud-alerts@aurastack.ai\n- **Stages:** Claim Screening → Pattern Analysis → Anomaly Scoring → SIU Referral\n- **Assigned Agent:** Fraud Detection Agent\n\nThe workflow is saved as a **draft**. Want me to activate it?",
      actions: [
        { label: "Created Fraud Detection Pipeline", completed: true },
        { label: "Configured email trigger", completed: true },
        { label: "Added 4 processing stages", completed: true },
        { label: "Pending activation", completed: false },
      ],
    };
  }

  if (lower.includes("user") || lower.includes("role")) {
    return {
      content:
        "I've added the new team member:\n\n- **Name:** Alex Johnson\n- **Email:** alex.johnson@aurastack.ai\n- **Role:** Reviewer\n- **Department:** Claims\n- **PHI Access:** Redacted\n\nAn invitation email has been sent. They'll be able to access the platform once they accept.",
      actions: [
        { label: "Created user account", completed: true },
        { label: "Assigned Reviewer role", completed: true },
        { label: "Sent invitation email", completed: true },
      ],
    };
  }

  if (lower.includes("status") || lower.includes("cas-")) {
    return {
      content:
        "Here's the status of **CAS-2024-003**:\n\n| Field | Value |\n|-------|-------|\n| Type | Eligibility Check |\n| Stage | Plan Rule Verification |\n| Priority | 🔴 Critical |\n| AI Status | Needs Review |\n| Assigned | Unassigned |\n| Member | Acme Corp Census |\n\n⚠️ This case has been escalated. There are **2 missing documents** that need attention. Want me to assign it to someone?",
      actions: [
        { label: "Retrieved case details", completed: true },
        { label: "Identified 2 missing documents", completed: true },
      ],
    };
  }

  if (lower.includes("critical") || lower.includes("priority")) {
    return {
      content:
        "Found **2 critical priority cases** requiring immediate attention:\n\n1. **CAS-2024-003** — Eligibility Check — Escalated — Unassigned\n2. **CAS-2024-006** — New Application — Document parsing error\n\nBoth need immediate action. Want me to assign them or escalate further?",
      actions: [
        { label: "Searched cases by priority", completed: true },
        { label: "Found 2 critical cases", completed: true },
      ],
    };
  }

  return {
    content:
      "I can help you with that! Here's what I can do across the platform:\n\n- **Cases:** Create, assign, escalate, search cases\n- **Workflows:** Build, configure triggers, manage stages\n- **AI Agents:** Deploy, configure models, set up tools\n- **Documents:** Upload, parse, track status\n- **Admin:** Manage users, roles, integrations\n- **Analytics:** Pull reports, track KPIs\n\nWhat would you like me to do?",
  };
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Welcome to **Aurastack AI Assistant**. I can manage your entire platform — create cases, configure agents, build workflows, manage users, and more. Just tell me what you need.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [platformCollapsed, setPlatformCollapsed] = useState(false);
  const [iframeRoute, setIframeRoute] = useState("/");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const response = simulateResponse(userMsg.content);
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      actions: response.actions,
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Panel */}
          <div
            className={cn(
              "flex flex-col border-r bg-background transition-all duration-300",
              platformCollapsed ? "flex-1" : "w-[480px] min-w-[400px]"
            )}
          >
            {/* Chat Header */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <Sparkles className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold">AI Assistant</h1>
                  <p className="text-[10px] text-muted-foreground">Operate the entire platform with natural language</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPlatformCollapsed(!platformCollapsed)}
              >
                {platformCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </header>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "flex gap-3",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "assistant" && (
                        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                          <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                            <Bot className="h-3.5 w-3.5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-foreground"
                        )}
                      >
                        {/* Simple markdown-like rendering */}
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none [&_strong]:font-semibold [&_table]:text-xs [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_td]:border [&_td]:border-border"
                          dangerouslySetInnerHTML={{
                            __html: msg.content
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\n\n/g, "<br/><br/>")
                              .replace(/\n- /g, "<br/>• ")
                              .replace(/\n(\d+)\. /g, "<br/>$1. ")
                              .replace(/\| (.*?) \|/g, (match) => {
                                const cells = match
                                  .split("|")
                                  .filter(Boolean)
                                  .map((c) => c.trim());
                                return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
                              })
                              .replace(
                                /(<tr>.*<\/tr>)/s,
                                "<table>$1</table>"
                              )
                              .replace(/⚠️/g, "⚠️ "),
                          }}
                        />
                        {/* Action items */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 space-y-1.5 border-t border-border/50 pt-2.5">
                            {msg.actions.map((action, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs"
                              >
                                {action.completed ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                                ) : (
                                  <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin shrink-0" />
                                )}
                                <span
                                  className={
                                    action.completed
                                      ? "text-muted-foreground"
                                      : "text-foreground"
                                  }
                                >
                                  {action.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {msg.role === "user" && (
                        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            <User className="h-3.5 w-3.5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                        <Bot className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-xl bg-muted/60 px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.15s]" />
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.3s]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="border-t px-4 py-3">
                <p className="text-[11px] text-muted-foreground mb-2 font-medium">Try asking:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setInput(s);
                      }}
                      className="rounded-lg border bg-card px-2.5 py-1.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t bg-card p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tell me what to do..."
                  className="h-10 text-sm flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Platform Preview Panel */}
          {!platformCollapsed && (
            <div className="flex-1 flex flex-col bg-muted/30 min-w-0">
              <div className="flex h-10 items-center justify-between border-b bg-card/50 px-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] h-5 font-mono">
                    Platform View
                  </Badge>
                  <div className="flex gap-1">
                    {[
                      { label: "Inbox", route: "/" },
                      { label: "Cases", route: "/cases" },
                      { label: "Agents", route: "/agents" },
                      { label: "Workflows", route: "/workflows" },
                      { label: "Analytics", route: "/analytics" },
                      { label: "Admin", route: "/admin" },
                    ].map((tab) => (
                      <button
                        key={tab.route}
                        onClick={() => setIframeRoute(tab.route)}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] transition-colors",
                          iframeRoute === tab.route
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setPlatformCollapsed(true)}
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 p-3">
                <div className="h-full rounded-lg border bg-card shadow-sm overflow-hidden">
                  <PlatformPreview route={iframeRoute} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}

// Instead of an iframe, render actual platform content
function PlatformPreview({ route }: { route: string }) {
  const navigate = (await import("react-router-dom")).useNavigate;
  // We'll show a visual preview card for each section
  const previews: Record<string, { title: string; description: string; stats: { label: string; value: string }[] }> = {
    "/": {
      title: "Operations Inbox",
      description: "Real-time view of all active cases, AI processing status, and priority queue",
      stats: [
        { label: "Open Cases", value: "24" },
        { label: "AI Processing", value: "8" },
        { label: "Needs Review", value: "6" },
        { label: "Avg. Time", value: "4.2h" },
      ],
    },
    "/cases": {
      title: "Cases Management",
      description: "Full lifecycle management of insurance cases from intake to resolution",
      stats: [
        { label: "Total Cases", value: "156" },
        { label: "This Week", value: "24" },
        { label: "Resolution Rate", value: "92%" },
        { label: "Escalated", value: "3" },
      ],
    },
    "/agents": {
      title: "AI Agents",
      description: "Configure and manage AI agents across all insurance departments",
      stats: [
        { label: "Active Agents", value: "7" },
        { label: "Tasks Today", value: "1,245" },
        { label: "Success Rate", value: "96.8%" },
        { label: "Avg. Time", value: "2.3s" },
      ],
    },
    "/workflows": {
      title: "Workflows",
      description: "Automated processing pipelines for every insurance operation",
      stats: [
        { label: "Active", value: "8" },
        { label: "Draft", value: "2" },
        { label: "Cases Processed", value: "5,870" },
        { label: "Departments", value: "9" },
      ],
    },
    "/analytics": {
      title: "Analytics & Reports",
      description: "Real-time dashboards, KPIs, and performance metrics",
      stats: [
        { label: "Cases/Day", value: "18.4" },
        { label: "Avg Resolution", value: "4.2h" },
        { label: "AI Accuracy", value: "96.8%" },
        { label: "Cost Saved", value: "$142K" },
      ],
    },
    "/admin": {
      title: "Administration",
      description: "User management, RBAC, integrations, and governance policies",
      stats: [
        { label: "Users", value: "12" },
        { label: "Roles", value: "5" },
        { label: "Integrations", value: "4" },
        { label: "Policies", value: "6" },
      ],
    },
  };

  const preview = previews[route] || previews["/"];

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{preview.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{preview.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {preview.stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Use the AI Assistant to interact with this section, or click the tabs above to navigate.
        </p>
      </div>
    </div>
  );
}

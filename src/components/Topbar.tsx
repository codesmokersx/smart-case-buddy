import { useState } from "react";
import { Search, Plus, Bell, User, X, LogOut, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockCases } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title?: string;
}

const notifications = [
  { id: "1", title: "Case CAS-2024-006 has a parsing error", time: "1 min ago", type: "error" as const, read: false },
  { id: "2", title: "CAS-2024-003 escalated to critical", time: "5 min ago", type: "warning" as const, read: false },
  { id: "3", title: "Fraud Detection Agent flagged 2 claims", time: "12 min ago", type: "info" as const, read: false },
  { id: "4", title: "Document parsing complete for CAS-2024-002", time: "15 min ago", type: "success" as const, read: true },
  { id: "5", title: "New user invitation accepted by Alex J.", time: "1 hr ago", type: "info" as const, read: true },
];

export function Topbar({ title = "Operations Inbox" }: TopbarProps) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createCaseOpen, setCreateCaseOpen] = useState(false);
  const [notifRead, setNotifRead] = useState<Set<string>>(new Set(notifications.filter(n => n.read).map(n => n.id)));

  // Create case form
  const [caseType, setCaseType] = useState("");
  const [casePriority, setCasePriority] = useState("");
  const [caseMember, setCaseMember] = useState("");
  const [caseNotes, setCaseNotes] = useState("");

  const filteredResults = searchQuery.trim()
    ? mockCases.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.assignedUser.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const unreadCount = notifications.filter((n) => !notifRead.has(n.id)).length;

  const handleCreateCase = () => {
    if (!caseType || !casePriority) {
      toast({ title: "Missing fields", description: "Please fill in the case type and priority.", variant: "destructive" });
      return;
    }
    toast({
      title: "Case Created",
      description: `New ${caseType} case created with ${casePriority} priority.`,
    });
    setCreateCaseOpen(false);
    setCaseType("");
    setCasePriority("");
    setCaseMember("");
    setCaseNotes("");
  };

  const markAllRead = () => {
    setNotifRead(new Set(notifications.map((n) => n.id)));
    toast({ title: "Notifications cleared", description: "All notifications marked as read." });
  };

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <h1 className="text-sm font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search cases, documents..."
              className="h-8 w-64 pl-8 text-xs"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(!!e.target.value.trim());
              }}
              onFocus={() => searchQuery.trim() && setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            />
            {searchOpen && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-popover shadow-lg z-50 py-1 max-h-64 overflow-auto">
                {filteredResults.map((c) => (
                  <button
                    key={c.id}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-xs hover:bg-muted transition-colors"
                    onMouseDown={() => {
                      navigate(`/cases/${c.id}`);
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                  >
                    <span className="font-mono font-medium text-primary">{c.id}</span>
                    <span className="text-muted-foreground">{c.caseType}</span>
                    <span className="ml-auto text-muted-foreground">{c.memberName}</span>
                  </button>
                ))}
              </div>
            )}
            {searchOpen && searchQuery.trim() && filteredResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-popover shadow-lg z-50 p-3">
                <p className="text-xs text-muted-foreground text-center">No results found</p>
              </div>
            )}
          </div>

          {/* Create Case */}
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setCreateCaseOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create Case</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2">
                <DropdownMenuLabel className="p-0 text-sm">Notifications</DropdownMenuLabel>
                <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
                  Mark all read
                </button>
              </div>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={cn("flex flex-col items-start gap-0.5 px-3 py-2", !notifRead.has(n.id) && "bg-muted/40")}
                  onClick={() => setNotifRead((prev) => new Set([...prev, n.id]))}
                >
                  <div className="flex items-center gap-2 w-full">
                    {!notifRead.has(n.id) && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                    <span className="text-xs font-medium truncate flex-1">{n.title}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-3.5">{n.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <User className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">Sarah Chen</p>
                <p className="text-xs text-muted-foreground">sarah.chen@aurastack.ai</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin")} className="gap-2 text-xs">
                <Settings className="h-3.5 w-3.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs">
                <HelpCircle className="h-3.5 w-3.5" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-xs text-destructive">
                <LogOut className="h-3.5 w-3.5" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Create Case Dialog */}
      <Dialog open={createCaseOpen} onOpenChange={setCreateCaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Case</DialogTitle>
            <DialogDescription>Fill in the details to create a new insurance case.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Case Type</Label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  {["New Application", "Claims Review", "Eligibility Check", "Policy Comparison"].map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={casePriority} onValueChange={setCasePriority}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {["critical", "high", "medium", "low"].map((p) => (
                    <SelectItem key={p} value={p} className="text-xs capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Member Name</Label>
              <Input
                value={caseMember}
                onChange={(e) => setCaseMember(e.target.value)}
                placeholder="Enter member name"
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes (optional)</Label>
              <Textarea
                value={caseNotes}
                onChange={(e) => setCaseNotes(e.target.value)}
                placeholder="Additional notes..."
                className="text-xs min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCreateCaseOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreateCase}>Create Case</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

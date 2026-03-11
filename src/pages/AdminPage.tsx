import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Users, ShieldCheck, Building2, Plug, Plus, Search, Lock, Eye, EyeOff, FileText, AlertTriangle,
  MoreVertical, Edit, Trash2, UserX, UserCheck, CheckCircle2, XCircle, Activity, Clock,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

/* ── Types ── */
type Role = "Admin" | "Claims Processor" | "Claims Adjudicator" | "Operations Manager" | "Compliance Auditor" | "External Hospital User";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: "active" | "suspended" | "pending";
  lastLogin: string;
  mfaEnabled: boolean;
  phiAccess: boolean;
}

const rolePermissions: Record<Role, { description: string; permissions: string[]; phiLevel: string }> = {
  Admin: {
    description: "Full platform access, user & role management",
    permissions: ["Manage Users", "Manage Roles", "View All Cases", "View Audit Logs", "Manage Integrations", "Export Data"],
    phiLevel: "Full (with audit logging)",
  },
  "Claims Processor": {
    description: "Process assigned claims, view related documents",
    permissions: ["View Assigned Cases", "Edit Case Data", "Upload Documents", "Request Documents"],
    phiLevel: "Assigned cases only",
  },
  "Claims Adjudicator": {
    description: "Review and adjudicate claims, approve/deny decisions",
    permissions: ["View All Cases", "Adjudicate Claims", "View Documents", "Add Notes", "Escalate Cases"],
    phiLevel: "All cases (read)",
  },
  "Operations Manager": {
    description: "Oversee operations, manage workflows and agents",
    permissions: ["View All Cases", "Manage Workflows", "Manage Agents", "View Analytics", "Assign Cases"],
    phiLevel: "Aggregated only (no individual PHI)",
  },
  "Compliance Auditor": {
    description: "Audit access logs, review compliance reports",
    permissions: ["View Audit Logs", "View Compliance Reports", "View Access History", "Export Audit Data"],
    phiLevel: "Audit metadata only",
  },
  "External Hospital User": {
    description: "Submit documents and view status for their facility only",
    permissions: ["Submit Documents", "View Own Submissions", "Track Case Status"],
    phiLevel: "Own facility submissions only",
  },
};

const allRoles = Object.keys(rolePermissions) as Role[];

const initialUsers: MockUser[] = [
  { id: "U-001", name: "Sarah Chen", email: "sarah.chen@insurai.com", role: "Claims Processor", department: "Claims", status: "active", lastLogin: "2 min ago", mfaEnabled: true, phiAccess: true },
  { id: "U-002", name: "Mike Torres", email: "mike.torres@insurai.com", role: "Claims Adjudicator", department: "Claims", status: "active", lastLogin: "15 min ago", mfaEnabled: true, phiAccess: true },
  { id: "U-003", name: "Lisa Park", email: "lisa.park@insurai.com", role: "Operations Manager", department: "Operations", status: "active", lastLogin: "1 hr ago", mfaEnabled: true, phiAccess: false },
  { id: "U-004", name: "James Rodriguez", email: "james.r@insurai.com", role: "Admin", department: "IT", status: "active", lastLogin: "30 min ago", mfaEnabled: true, phiAccess: true },
  { id: "U-005", name: "Emily Watson", email: "emily.w@insurai.com", role: "Compliance Auditor", department: "Compliance", status: "active", lastLogin: "3 hrs ago", mfaEnabled: true, phiAccess: false },
  { id: "U-006", name: "Dr. Patel", email: "patel@mercy-hospital.org", role: "External Hospital User", department: "Mercy Hospital", status: "pending", lastLogin: "Never", mfaEnabled: false, phiAccess: false },
];

const initialIntegrations = [
  { id: "INT-1", name: "Email IMAP", status: "connected" as const, description: "Inbound email processing for claims intake", config: "imap.insurai.com:993" },
  { id: "INT-2", name: "Email SMTP", status: "connected" as const, description: "Outbound notifications and document requests", config: "smtp.insurai.com:587" },
  { id: "INT-3", name: "Webhook API", status: "connected" as const, description: "REST API endpoints for external submissions", config: "https://api.insurai.com/v1" },
  { id: "INT-4", name: "S3 Storage", status: "connected" as const, description: "Encrypted document storage (AES-256)", config: "s3://insurai-docs-prod" },
  { id: "INT-5", name: "Slack", status: "disconnected" as const, description: "Team notifications and escalation alerts", config: "" },
  { id: "INT-6", name: "Policy API", status: "connected" as const, description: "Real-time policy rule engine access", config: "https://policy.insurai.com/api" },
];

const dataGovernancePolicies = [
  { id: "GOV-1", policy: "PHI at Rest Encryption", status: "enforced" as const, standard: "HIPAA §164.312(a)(2)(iv)", details: "All PHI data is encrypted at rest using AES-256. Key rotation occurs every 90 days. Encryption covers database fields, file storage, and backup systems." },
  { id: "GOV-2", policy: "PHI in Transit Encryption", status: "enforced" as const, standard: "HIPAA §164.312(e)(1)", details: "All data in transit uses TLS 1.3. Certificate pinning is enforced for API communications. Internal service mesh uses mutual TLS." },
  { id: "GOV-3", policy: "Minimum Necessary Access", status: "enforced" as const, standard: "HIPAA §164.502(b)", details: "Access to PHI is restricted to the minimum necessary for each role. Role-based access control (RBAC) ensures users only see data relevant to their job function." },
  { id: "GOV-4", policy: "Audit Trail Retention (7 yrs)", status: "enforced" as const, standard: "HIPAA §164.530(j)", details: "All access to PHI is logged with user identity, timestamp, action, and data accessed. Logs are retained for 7 years and are immutable." },
  { id: "GOV-5", policy: "Automatic Session Timeout (15 min)", status: "enforced" as const, standard: "HIPAA §164.312(a)(2)(iii)", details: "User sessions automatically terminate after 15 minutes of inactivity. Re-authentication is required to resume. Applies to all user roles." },
  { id: "GOV-6", policy: "BAA for External Users", status: "pending_review" as const, standard: "HIPAA §164.502(e)", details: "Business Associate Agreements must be signed by all external entities with access to PHI. Currently pending review for 2 new provider organizations." },
];

const AdminPage = () => {
  const [users, setUsers] = useState<MockUser[]>(initialUsers);
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<typeof dataGovernancePolicies[0] | null>(null);
  const [configuringIntegration, setConfiguringIntegration] = useState<typeof initialIntegrations[0] | null>(null);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Claims Processor");
  const [inviteDept, setInviteDept] = useState("Claims");
  const [inviteMfa, setInviteMfa] = useState(true);

  // Access control settings
  const [accessSettings, setAccessSettings] = useState([
    { id: "mfa", label: "Enforce MFA for all users", description: "Require multi-factor authentication", enabled: true },
    { id: "phi-mask", label: "PHI data masking in exports", description: "Automatically redact PHI in exported reports", enabled: true },
    { id: "session", label: "Session timeout (15 min)", description: "Auto-logout after inactivity", enabled: true },
    { id: "ip", label: "IP allowlisting", description: "Restrict access to approved IP ranges", enabled: false },
    { id: "audit-phi", label: "Audit all PHI access", description: "Log every view/edit of protected health information", enabled: true },
  ]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteUser = () => {
    const newUser: MockUser = {
      id: `U-${String(users.length + 1).padStart(3, "0")}`,
      name: inviteEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: inviteEmail,
      role: inviteRole,
      department: inviteDept,
      status: "pending",
      lastLogin: "Never",
      mfaEnabled: inviteMfa,
      phiAccess: false,
    };
    setUsers((prev) => [...prev, newUser]);
    setShowInviteDialog(false);
    setInviteEmail("");
    toast({ title: "Invitation sent", description: `Invitation sent to ${inviteEmail}` });
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User removed", description: "The user has been removed from the platform." });
  };

  const handleToggleSuspend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u
      )
    );
    const user = users.find((u) => u.id === id);
    toast({ title: user?.status === "suspended" ? "User reactivated" : "User suspended" });
  };

  const handleSaveEditUser = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
    toast({ title: "User updated", description: `${editingUser.name}'s profile has been updated.` });
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, status: int.status === "connected" ? "disconnected" : "connected" } : int
      )
    );
    const intg = integrations.find((i) => i.id === id);
    toast({ title: intg?.status === "connected" ? "Integration disconnected" : "Integration connected" });
  };

  const handleToggleAccessSetting = (id: string) => {
    setAccessSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
    toast({ title: "Setting updated" });
  };

  return (
    <AppLayout title="Admin">
      <div className="p-6 space-y-6">
        <p className="text-sm text-muted-foreground">User management, access control &amp; insurance data governance</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Users", value: String(users.length), icon: Users, color: "text-primary" },
            { label: "Active", value: String(users.filter((u) => u.status === "active").length), icon: UserCheck, color: "text-success" },
            { label: "Pending", value: String(users.filter((u) => u.status === "pending").length), icon: Clock, color: "text-warning" },
            { label: "Integrations", value: String(integrations.filter((i) => i.status === "connected").length), icon: Plug, color: "text-ai" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="text-xs gap-1.5"><Users className="h-3 w-3" /> Users</TabsTrigger>
            <TabsTrigger value="roles" className="text-xs gap-1.5"><ShieldCheck className="h-3 w-3" /> Roles &amp; Access</TabsTrigger>
            <TabsTrigger value="governance" className="text-xs gap-1.5"><Lock className="h-3 w-3" /> Data Governance</TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs gap-1.5"><Plug className="h-3 w-3" /> Integrations</TabsTrigger>
          </TabsList>

          {/* ── Users Tab ── */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search users…" className="pl-8 h-8 text-xs" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Filter by role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {allRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setShowInviteDialog(true)}>
                <Plus className="h-3 w-3" /> Invite User
              </Button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">User</TableHead>
                      <TableHead className="text-xs">Role</TableHead>
                      <TableHead className="text-xs">Department</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">MFA</TableHead>
                      <TableHead className="text-xs">PHI Access</TableHead>
                      <TableHead className="text-xs">Last Login</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div>
                            <p className="text-xs font-medium">{u.name}</p>
                            <p className="text-[10px] text-muted-foreground">{u.email}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{u.role}</Badge></TableCell>
                        <TableCell className="text-xs">{u.department}</TableCell>
                        <TableCell>
                          <Badge variant={u.status === "active" ? "default" : u.status === "pending" ? "secondary" : "destructive"} className="text-[10px]">
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {u.mfaEnabled ? <ShieldCheck className="h-3.5 w-3.5 text-success" /> : <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
                        </TableCell>
                        <TableCell>
                          {u.phiAccess ? <Eye className="h-3.5 w-3.5 text-primary" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{u.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingUser({ ...u })}>
                                <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleSuspend(u.id)}>
                                {u.status === "suspended" ? (
                                  <><UserCheck className="h-3.5 w-3.5 mr-2" /> Reactivate</>
                                ) : (
                                  <><UserX className="h-3.5 w-3.5 mr-2" /> Suspend</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(u.id)}>
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ── Roles & Access Tab ── */}
          <TabsContent value="roles" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {allRoles.map((role) => {
                const info = rolePermissions[role];
                const usersWithRole = users.filter((u) => u.role === role).length;
                return (
                  <Card key={role}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{role}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">{usersWithRole} users</Badge>
                          <Badge variant="outline" className="text-[10px]">
                            <Lock className="h-2.5 w-2.5 mr-1" />
                            {info.phiLevel}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-xs">{info.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {info.permissions.map((p) => (
                          <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ── Data Governance Tab ── */}
          <TabsContent value="governance" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <CardTitle className="text-sm">Insurance Data Governance Policies</CardTitle>
                </div>
                <CardDescription className="text-xs">HIPAA-aligned data protection and access controls</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Policy</TableHead>
                      <TableHead className="text-xs">Regulatory Standard</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataGovernancePolicies.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs font-medium">{p.policy}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px] font-mono">{p.standard}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={p.status === "enforced" ? "default" : "secondary"} className="text-[10px]">
                            {p.status === "enforced" ? "Enforced" : "Pending Review"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setSelectedPolicy(p)}>
                            <FileText className="h-3 w-3 mr-1" /> Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Access Control Settings</CardTitle>
                <CardDescription className="text-xs">Platform-wide security configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {accessSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-xs font-medium">{setting.label}</p>
                      <p className="text-[10px] text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch checked={setting.enabled} onCheckedChange={() => handleToggleAccessSetting(setting.id)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Integrations Tab ── */}
          <TabsContent value="integrations" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {integrations.map((intg) => (
                <Card key={intg.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Plug className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{intg.name}</span>
                      </div>
                      <Badge variant={intg.status === "connected" ? "default" : "secondary"} className="text-[10px]">
                        {intg.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{intg.description}</p>
                    {intg.config && (
                      <p className="text-[10px] text-muted-foreground font-mono mt-1">{intg.config}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      {intg.status === "connected" ? (
                        <>
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setConfiguringIntegration(intg)}>
                            Configure
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => handleToggleIntegration(intg.id)}>
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="h-7 text-xs" onClick={() => handleToggleIntegration(intg.id)}>
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Invite User Dialog ── */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Send an invitation to join the platform with appropriate access controls.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input placeholder="user@example.com" className="text-sm" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Select value={inviteDept} onValueChange={setInviteDept}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Claims">Claims</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="require-mfa" checked={inviteMfa} onCheckedChange={(v) => setInviteMfa(!!v)} />
              <Label htmlFor="require-mfa" className="text-xs">Require MFA enrollment</Label>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" className="text-xs" disabled={!inviteEmail} onClick={handleInviteUser}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit User Dialog ── */}
      <Dialog open={!!editingUser} onOpenChange={(v) => { if (!v) setEditingUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Modify user role, department, and access settings.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input className="text-sm" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input className="text-sm" value={editingUser.email} readOnly disabled />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <Select value={editingUser.role} onValueChange={(v) => setEditingUser({ ...editingUser, role: v as Role })}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {allRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Department</Label>
                <Input className="text-sm" value={editingUser.department} onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={editingUser.mfaEnabled} onCheckedChange={(v) => setEditingUser({ ...editingUser, mfaEnabled: !!v })} />
                  <Label className="text-xs">MFA Enabled</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={editingUser.phiAccess} onCheckedChange={(v) => setEditingUser({ ...editingUser, phiAccess: !!v })} />
                  <Label className="text-xs">PHI Access</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" className="text-xs" onClick={handleSaveEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Policy Details Dialog ── */}
      <Dialog open={!!selectedPolicy} onOpenChange={(v) => { if (!v) setSelectedPolicy(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base">{selectedPolicy?.policy}</DialogTitle>
            <DialogDescription className="text-xs">{selectedPolicy?.standard}</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={selectedPolicy?.status === "enforced" ? "default" : "secondary"} className="text-[10px]">
                {selectedPolicy?.status === "enforced" ? "Enforced" : "Pending Review"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{selectedPolicy?.details}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setSelectedPolicy(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Configure Integration Dialog ── */}
      <Dialog open={!!configuringIntegration} onOpenChange={(v) => { if (!v) setConfiguringIntegration(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base">Configure {configuringIntegration?.name}</DialogTitle>
            <DialogDescription className="text-xs">{configuringIntegration?.description}</DialogDescription>
          </DialogHeader>
          {configuringIntegration && (
            <div className="py-2 space-y-4">
              <div>
                <Label className="text-xs">Endpoint / Connection String</Label>
                <Input className="text-sm mt-1" defaultValue={configuringIntegration.config} />
              </div>
              <div>
                <Label className="text-xs">API Key / Credentials</Label>
                <Input className="text-sm mt-1" type="password" defaultValue="••••••••••••" />
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <p className="text-xs">Connection verified — Last tested 2 hours ago</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => {
              toast({ title: "Connection tested", description: "Connection is healthy." });
            }}>Test Connection</Button>
            <Button size="sm" className="text-xs" onClick={() => {
              setConfiguringIntegration(null);
              toast({ title: "Integration updated", description: "Configuration saved successfully." });
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AdminPage;

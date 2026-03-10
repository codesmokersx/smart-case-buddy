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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users, ShieldCheck, Building2, Plug, Plus, Search, Lock, Eye, EyeOff, FileText, AlertTriangle,
} from "lucide-react";
import { useState } from "react";

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

/* ── Role-permission matrix (HIPAA aligned) ── */
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

/* ── Mock users ── */
const mockUsers: MockUser[] = [
  { id: "U-001", name: "Sarah Chen", email: "sarah.chen@insurai.com", role: "Claims Processor", department: "Claims", status: "active", lastLogin: "2 min ago", mfaEnabled: true, phiAccess: true },
  { id: "U-002", name: "Mike Torres", email: "mike.torres@insurai.com", role: "Claims Adjudicator", department: "Claims", status: "active", lastLogin: "15 min ago", mfaEnabled: true, phiAccess: true },
  { id: "U-003", name: "Lisa Park", email: "lisa.park@insurai.com", role: "Operations Manager", department: "Operations", status: "active", lastLogin: "1 hr ago", mfaEnabled: true, phiAccess: false },
  { id: "U-004", name: "James Rodriguez", email: "james.r@insurai.com", role: "Admin", department: "IT", status: "active", lastLogin: "30 min ago", mfaEnabled: true, phiAccess: true },
  { id: "U-005", name: "Emily Watson", email: "emily.w@insurai.com", role: "Compliance Auditor", department: "Compliance", status: "active", lastLogin: "3 hrs ago", mfaEnabled: true, phiAccess: false },
  { id: "U-006", name: "Dr. Patel", email: "patel@mercy-hospital.org", role: "External Hospital User", department: "Mercy Hospital", status: "pending", lastLogin: "Never", mfaEnabled: false, phiAccess: false },
];

const integrations = [
  { name: "Email IMAP", status: "connected", description: "Inbound email processing for claims intake" },
  { name: "Email SMTP", status: "connected", description: "Outbound notifications and document requests" },
  { name: "Webhook API", status: "connected", description: "REST API endpoints for external submissions" },
  { name: "S3 Storage", status: "connected", description: "Encrypted document storage (AES-256)" },
  { name: "Slack", status: "disconnected", description: "Team notifications and escalation alerts" },
  { name: "Policy API", status: "connected", description: "Real-time policy rule engine access" },
];

const dataGovernancePolicies = [
  { policy: "PHI at Rest Encryption", status: "enforced", standard: "HIPAA §164.312(a)(2)(iv)" },
  { policy: "PHI in Transit Encryption", status: "enforced", standard: "HIPAA §164.312(e)(1)" },
  { policy: "Minimum Necessary Access", status: "enforced", standard: "HIPAA §164.502(b)" },
  { policy: "Audit Trail Retention (7 yrs)", status: "enforced", standard: "HIPAA §164.530(j)" },
  { policy: "Automatic Session Timeout (15 min)", status: "enforced", standard: "HIPAA §164.312(a)(2)(iii)" },
  { policy: "BAA for External Users", status: "pending_review", standard: "HIPAA §164.502(e)" },
];

const AdminPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AppLayout title="Admin">
      <div className="p-6 space-y-6">
        <p className="text-sm text-muted-foreground">
          User management, access control &amp; insurance data governance
        </p>

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
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {allRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1.5 text-xs">
                    <Plus className="h-3 w-3" /> Invite User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite User</DialogTitle>
                    <DialogDescription>Send an invitation to join the platform with appropriate access controls.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Email</Label>
                      <Input placeholder="user@example.com" className="text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Role</Label>
                      <Select>
                        <SelectTrigger className="text-sm"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          {allRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Department</Label>
                      <Select>
                        <SelectTrigger className="text-sm"><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="claims">Claims</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="require-mfa" defaultChecked />
                      <Label htmlFor="require-mfa" className="text-xs">Require MFA enrollment</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button size="sm" className="text-xs">Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                      <TableHead className="text-xs text-right">Last Login</TableHead>
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
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{u.role}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{u.department}</TableCell>
                        <TableCell>
                          <Badge variant={u.status === "active" ? "default" : u.status === "pending" ? "secondary" : "destructive"} className="text-[10px]">
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {u.mfaEnabled ? (
                            <ShieldCheck className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                          )}
                        </TableCell>
                        <TableCell>
                          {u.phiAccess ? (
                            <Eye className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground text-right">{u.lastLogin}</TableCell>
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
                return (
                  <Card key={role}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{role}</CardTitle>
                        <Badge variant="outline" className="text-[10px]">
                          <Lock className="h-2.5 w-2.5 mr-1" />
                          {info.phiLevel}
                        </Badge>
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
                      <TableRow key={p.policy}>
                        <TableCell className="text-xs font-medium">{p.policy}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-mono">{p.standard}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.status === "enforced" ? "default" : "secondary"} className="text-[10px]">
                            {p.status === "enforced" ? "Enforced" : "Pending Review"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                            <FileText className="h-3 w-3 mr-1" /> Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Access Control Settings */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Access Control Settings</CardTitle>
                <CardDescription className="text-xs">Platform-wide security configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Enforce MFA for all users", description: "Require multi-factor authentication", enabled: true },
                  { label: "PHI data masking in exports", description: "Automatically redact PHI in exported reports", enabled: true },
                  { label: "Session timeout (15 min)", description: "Auto-logout after inactivity", enabled: true },
                  { label: "IP allowlisting", description: "Restrict access to approved IP ranges", enabled: false },
                  { label: "Audit all PHI access", description: "Log every view/edit of protected health information", enabled: true },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-xs font-medium">{setting.label}</p>
                      <p className="text-[10px] text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Integrations Tab ── */}
          <TabsContent value="integrations" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {integrations.map((intg) => (
                <Card key={intg.name}>
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
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        {intg.status === "connected" ? "Configure" : "Connect"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminPage;

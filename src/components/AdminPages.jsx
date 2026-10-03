import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BellRing,
  Cake,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileClock,
  FileImage,
  FileText,
  History,
  Mail,
  MapPinned,
  Megaphone,
  MessageSquareText,
  PackageCheck,
  Phone,
  Search,
  Send,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserRoundCheck,
  Users,
  UserX,
} from "lucide-react";
import { peso, useAdmin } from "@/lib/admin-store";
import {
  AdminCard,
  AdminPageHeader,
  MetricCard,
  SearchField,
  StatusBadge,
  StatusFilterNotice,
  TableShell,
  td,
  th,
} from "@/components/AdminUI";
import { useStatusFilter } from "@/lib/use-status-filter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import floodedDrainageEvidence from "@/assets/flooded-drainage-evidence.jpg";
import { ProblemReportDetail } from "@/components/ProblemReportDetail";
import { DocumentRequestsWorkspace } from "@/components/DocumentRequestsWorkspace";
const actions = [
  {
    to: "/admin/resident-verification",
    label: "Verify residents",
    detail: "Review pending registrations",
    icon: UserRoundCheck,
  },
  {
    to: "/admin/problem-reports",
    label: "Review reports",
    detail: "Prioritize community concerns",
    icon: ClipboardCheck,
  },
  {
    to: "/admin/document-requests",
    label: "Process documents",
    detail: "Update request statuses",
    icon: FileClock,
  },
  {
    to: "/admin/announcements",
    label: "Post announcement",
    detail: "Share a community update",
    icon: Megaphone,
  },
];
export function AdminDashboard() {
  const { residents, reports, documents, feedback } = useAdmin();
  const activities = [
    {
      icon: UserRoundCheck,
      title: "New resident registration",
      detail: "Ramon Villanueva submitted a PhilSys ID",
      time: "12 min ago",
    },
    {
      icon: FileText,
      title: "Document request received",
      detail: "Raven Rotao requested a Barangay Clearance",
      time: "34 min ago",
    },
    {
      icon: ClipboardCheck,
      title: "Problem report updated",
      detail: "Broken streetlight moved to In Progress",
      time: "1 hr ago",
    },
    {
      icon: MessageSquareText,
      title: "New resident feedback",
      detail: "A 5-star service review was submitted",
      time: "2 hrs ago",
    },
  ];
  const metrics = [
    { label: "Total Residents", value: "1,284", icon: Users, note: "+18 registered this month" },
    {
      label: "Pending Verifications",
      value: residents.filter((x) => x.status === "Pending Verification").length,
      icon: UserRoundCheck,
      note: "Requires identity review",
    },
    {
      label: "Pending Reports",
      value: reports.filter((x) => x.status === "Pending").length,
      icon: ClipboardCheck,
      note: "Awaiting assignment",
    },
    {
      label: "Pending Document Requests",
      value: documents.filter((x) => ["Pending", "Under Review"].includes(String(x.status))).length,
      icon: FileClock,
      note: "In the processing queue",
    },
    {
      label: "Ready for Pickup",
      value: documents.filter((x) => x.status === "Ready for Pickup").length,
      icon: PackageCheck,
      note: "Residents to be notified",
    },
  ];
  return (
    <div>
      <AdminPageHeader
        eyebrow="Admin overview"
        title="Dashboard"
        description="Monitor resident services and manage today’s barangay operations."
        action={
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success" />
            Live mock data
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <AdminCard>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-bold">Recent Activities</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Latest updates across the barangay portal
              </p>
            </div>
            <History className="h-5 w-5 text-gold-strong" />
          </div>
          <div className="divide-y divide-border">
            {activities.map((item) => (
              <div key={item.title} className="flex gap-4 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                  <item.icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">{item.time}</time>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="mb-4">
            <h2 className="font-bold">Quick Actions</h2>
            <p className="mt-1 text-xs text-muted-foreground">Common administrative tasks</p>
          </div>
          <div className="space-y-2">
            {actions.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                search={{ status: undefined }}
                className="group flex items-center gap-3 rounded-md border border-border p-3 transition hover:border-gold-muted hover:bg-muted"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <item.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.detail}</span>
                </span>
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
function VerificationField({ label, children, icon: Icon }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-gold-strong" />}
        {label}
      </p>
      <div className="break-words text-sm font-medium leading-6 text-foreground">{children}</div>
    </div>
  );
}
function DocumentPreview({ title, type, resident, compact = false }) {
  return (
    <figure className="overflow-hidden rounded-md border border-border bg-muted/50">
      <div
        className={`relative overflow-hidden bg-paper p-4 text-paper-ink ${compact ? "min-h-44" : "min-h-56"}`}
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
        <div className="flex items-start gap-3 border-b border-border pb-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground">
              Barangay 902 • Sample upload
            </p>
            <p className="mt-1 text-sm font-bold text-primary">{type}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[72px_1fr] gap-4">
          <span className="flex h-20 items-center justify-center rounded-md bg-muted text-xl font-bold text-primary">
            {resident
              .split(" ")
              .map((part) => part.charAt(0))
              .slice(0, 2)
              .join("")}
          </span>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] font-bold uppercase text-muted-foreground">Name</p>
              <p className="text-xs font-semibold">{resident}</p>
            </div>
            <div className="h-2 w-full rounded-full bg-muted" />
            <div className="h-2 w-4/5 rounded-full bg-muted" />
            <div className="h-2 w-2/3 rounded-full bg-muted" />
          </div>
        </div>
        <div className="mt-4 rounded-md border border-dashed border-input px-3 py-2 text-center text-[10px] font-semibold text-muted-foreground">
          Mock document preview • No ID number collected
        </div>
      </div>
      <figcaption className="flex items-center gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <FileImage className="h-3.5 w-3.5" />
        {title}
      </figcaption>
    </figure>
  );
}
export function ResidentVerificationPage() {
  const { residents, updateResident } = useAdmin();
  const statusFilter = useStatusFilter();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [confirmation, setConfirmation] = useState("");
  const selectedResident = residents.find((resident) => resident.id === selectedId);
  const filtered = useMemo(
    () =>
      residents.filter(
        (resident) =>
          (!statusFilter || String(resident.status) === statusFilter) &&
          Object.values(resident).join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [residents, query, statusFilter],
  );
  function decide(status) {
    if (!selectedResident) return;
    updateResident(selectedResident.id, { status, accountActive: status === "Verified" });
    setConfirmation(
      status === "Verified"
        ? `Account created and activated for ${selectedResident.name}. A mock confirmation is ready.`
        : status === "Rejected"
          ? "Registration rejected. The resident account remains inactive."
          : "Additional information requested. The resident account remains inactive.",
    );
  }
  return (
    <div>
      <AdminPageHeader
        eyebrow="Operations"
        title="Resident Verification"
        description="Review identity and residency submissions before activating a resident account."
      />
      <StatusFilterNotice status={statusFilter} to="/admin/resident-verification" />
      {confirmation && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-bold">Verification updated</p>
            <p className="mt-0.5">{confirmation}</p>
          </div>
        </div>
      )}
      <AdminCard>
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search resident registrations"
          />
          <p className="text-xs font-semibold text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "registration" : "registrations"} shown
          </p>
        </div>
        <TableShell>
          <thead>
            <tr>
              <th className={th}>Registration</th>
              <th className={th}>Resident</th>
              <th className={th}>ID Type</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((resident) => (
              <tr key={String(resident.id)} className="transition hover:bg-muted/60">
                <td className={`${td} whitespace-nowrap font-semibold text-primary`}>
                  {resident.id}
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {resident.submitted}
                  </span>
                </td>
                <td className={td}>
                  <span className="font-medium">{resident.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{resident.Road}</span>
                </td>
                <td className={`${td} whitespace-nowrap`}>{resident.idType}</td>
                <td className={`${td} whitespace-nowrap`}>
                  <StatusBadge status={String(resident.status)} />
                </td>
                <td className={`${td} text-right`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedId(String(resident.id));
                      setConfirmation("");
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        {filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <Search className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">No matching registrations</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different name, reference, or status.
            </p>
          </div>
        )}
      </AdminCard>

      <Dialog
        open={Boolean(selectedResident)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        {selectedResident && (
          <DialogContent className="max-h-[94vh] max-w-6xl gap-0 overflow-y-auto p-0">
            <DialogHeader className="border-b border-border px-5 py-5 pr-14 sm:px-7">
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="text-xl text-primary">{selectedResident.name}</DialogTitle>
                <StatusBadge status={String(selectedResident.status)} />
              </div>
              <DialogDescription>
                {selectedResident.id} • Registered {selectedResident.submitted}
              </DialogDescription>
            </DialogHeader>
            <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-7 px-5 py-6 sm:px-7">
                <section>
                  <h3 className="mb-4 flex items-center gap-2 border-b border-border pb-3 text-sm font-bold text-primary">
                    <UserRound className="h-4 w-4" />
                    Resident Information
                  </h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <VerificationField label="Full Name">{selectedResident.name}</VerificationField>
                    <VerificationField label="Date of Birth" icon={Cake}>
                      {selectedResident.birthday}
                    </VerificationField>
                    <VerificationField label="Sex">{selectedResident.sex}</VerificationField>
                    <VerificationField label="Contact Number" icon={Phone}>
                      {selectedResident.contact}
                    </VerificationField>
                    <VerificationField label="Email Address" icon={Mail}>
                      {selectedResident.email}
                    </VerificationField>
                    <VerificationField label="Registration Date" icon={CalendarClock}>
                      {selectedResident.submitted}
                    </VerificationField>
                    <div className="sm:col-span-2">
                      <VerificationField label="Complete Address" icon={MapPinned}>
                        {selectedResident.address}
                      </VerificationField>
                    </div>
                    <VerificationField label="Verification Status">
                      <StatusBadge status={String(selectedResident.status)} />
                    </VerificationField>
                  </div>
                </section>
                <section>
                  <h3 className="mb-4 flex items-center gap-2 border-b border-border pb-3 text-sm font-bold text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    Identity and Residency Verification
                  </h3>
                  <VerificationField label="ID Type">{selectedResident.idType}</VerificationField>
                  <div className="mt-5 grid gap-5 xl:grid-cols-2">
                    <DocumentPreview
                      title="Uploaded ID preview"
                      type={String(selectedResident.idType)}
                      resident={String(selectedResident.name)}
                    />
                    {selectedResident.residencyProof ? (
                      <DocumentPreview
                        title="Proof of residency preview"
                        type={String(selectedResident.residencyProof)}
                        resident={String(selectedResident.name)}
                        compact
                      />
                    ) : (
                      <div className="flex min-h-56 flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 px-5 text-center">
                        <FileImage className="h-7 w-7 text-muted-foreground" />
                        <p className="mt-2 text-sm font-semibold">No proof of residency provided</p>
                        <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                          This optional document was not included with the registration.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
              <aside className="border-t border-border bg-muted/40 px-5 py-6 sm:px-7 lg:border-l lg:border-t-0 lg:px-5">
                <div className="lg:sticky lg:top-6">
                  <h3 className="text-sm font-bold text-primary">Verification Decision</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Review all submitted details before changing the account status.
                  </p>
                  <div className="mt-5">
                    <label
                      className="text-xs font-bold uppercase text-muted-foreground"
                      htmlFor="resident-remarks"
                    >
                      Admin Remarks
                    </label>
                    <Textarea
                      id="resident-remarks"
                      value={String(selectedResident.remarks ?? "")}
                      onChange={(event) =>
                        updateResident(String(selectedResident.id), { remarks: event.target.value })
                      }
                      placeholder="Record findings or requested details…"
                      className="mt-2 min-h-32 resize-y bg-card"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Mock internal note for this registration.
                    </p>
                  </div>
                  <div className="mt-6 space-y-2.5 border-t border-border pt-5">
                    <Button className="w-full" onClick={() => decide("Verified")}>
                      <UserCheck className="h-4 w-4" />
                      Approve & Activate Account
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => decide("Additional Information Required")}
                    >
                      <Send className="h-4 w-4" />
                      Request Additional Information
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => decide("Rejected")}
                    >
                      <UserX className="h-4 w-4" />
                      Reject Registration
                    </Button>
                  </div>
                  {selectedResident.accountActive && (
                    <div className="mt-5 rounded-md border border-success/30 bg-success/10 px-3 py-3 text-xs text-success">
                      <p className="font-bold">Resident account active</p>
                      <p className="mt-1 leading-5">
                        Mock account access has been created for {selectedResident.email}.
                      </p>
                    </div>
                  )}
                  <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                    This demo uses fictional sample data. No ID number is collected or displayed.
                  </p>
                </div>
              </aside>
            </div>
            <DialogFooter className="border-t border-border bg-card px-5 py-4 sm:px-7">
              <Button variant="outline" onClick={() => setSelectedId(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
export const DocumentRequestsPage = DocumentRequestsWorkspace;
const reportStatuses = ["Pending", "Under Review", "In Progress", "Resolved", "Rejected"];
function ReportField({ label, children, icon: Icon }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-gold-strong" />}
        {label}
      </p>
      <div className="text-sm leading-6 text-foreground">{children}</div>
    </div>
  );
}
export function ProblemReportsPage() {
  const { reports } = useAdmin();
  const statusFilter = useStatusFilter();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const selectedReport = reports.find((report) => report.id === selectedId);
  const filtered = useMemo(
    () =>
      reports.filter(
        (report) =>
          (!statusFilter || String(report.status) === statusFilter) &&
          Object.values(report).join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [reports, query, statusFilter],
  );
  return (
    <div>
      <AdminPageHeader
        eyebrow="Operations"
        title="Problem Reports"
        description="Review resident concerns, inspect supporting details, and track every report through resolution."
      />
      <StatusFilterNotice status={statusFilter} to="/admin/problem-reports" />
      <AdminCard>
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <SearchField value={query} onChange={setQuery} placeholder="Search problem reports" />
          <p className="text-xs font-semibold text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "report" : "reports"} shown
          </p>
        </div>
        <TableShell>
          <thead>
            <tr>
              <th className={th}>Report Number</th>
              <th className={th}>Resident</th>
              <th className={th}>Problem Type</th>
              <th className={th}>Location</th>
              <th className={th}>Date</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={String(report.id)} className="transition hover:bg-muted/60">
                <td className={`${td} whitespace-nowrap font-semibold text-primary`}>
                  {report.id}
                </td>
                <td className={`${td} whitespace-nowrap font-medium`}>{report.resident}</td>
                <td className={td}>{report.type}</td>
                <td className={`${td} min-w-52 text-muted-foreground`}>{report.location}</td>
                <td className={`${td} whitespace-nowrap text-muted-foreground`}>{report.date}</td>
                <td className={`${td} whitespace-nowrap`}>
                  <StatusBadge status={String(report.status)} />
                </td>
                <td className={`${td} text-right`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedId(String(report.id))}
                  >
                    <FileText className="h-4 w-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        {filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <Search className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">No matching reports</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different report number, resident, or problem type.
            </p>
          </div>
        )}
      </AdminCard>

      {selectedReport && (
        <ProblemReportDetail
          report={selectedReport}
          evidence={selectedReport.id === "RPT-2026-0042" ? floodedDrainageEvidence : null}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
export function AnnouncementsPage() {
  const { announcements, addAnnouncement } = useAdmin();
  const statusFilter = useStatusFilter();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const visible = announcements.filter(
    (item) => !statusFilter || String(item.status) === statusFilter,
  );
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    addAnnouncement(
      String(data.get("title")),
      String(data.get("category")),
      String(data.get("description")),
    );
    event.currentTarget.reset();
    setOpen(false);
    setNotice("Announcement published successfully.");
  }
  return (
    <div>
      <AdminPageHeader
        eyebrow="Communications"
        title="Announcements"
        description="Publish timely information and advisories for Barangay 902 residents."
        action={
          <Button onClick={() => setOpen((value) => !value)}>
            <Megaphone className="h-4 w-4" />
            New announcement
          </Button>
        }
      />
      <StatusFilterNotice status={statusFilter} to="/admin/announcements" />
      {notice && (
        <p
          role="status"
          className="mb-5 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          {notice}
        </p>
      )}
      {open && (
        <AdminCard className="mb-6 p-5">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Title
              <input
                name="title"
                required
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
              />
            </label>
            <label className="text-sm font-semibold">
              Category
              <select
                name="category"
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
              >
                <option>Advisory</option>
                <option>Community Event</option>
                <option>Services</option>
              </select>
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Message
              <textarea
                name="description"
                required
                className="mt-2 min-h-28 w-full rounded-md border border-input bg-background p-3"
              />
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">Publish announcement</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </AdminCard>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((item) => (
          <AdminCard key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-primary">
                <BellRing className="h-5 w-5" />
              </span>
              <StatusBadge status={String(item.status)} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase text-gold-strong">{item.category}</p>
            <h2 className="mt-1 text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            <p className="mt-4 text-xs text-muted-foreground">Published {item.date}</p>
          </AdminCard>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="rounded-md border border-dashed border-input px-5 py-12 text-center text-sm text-muted-foreground">
          No announcements with this status.
        </p>
      )}
    </div>
  );
}
export function FeedbackPage() {
  const { feedback, markFeedback } = useAdmin();
  const statusFilter = useStatusFilter();
  const visible = feedback.filter((item) => !statusFilter || String(item.status) === statusFilter);
  return (
    <div>
      <AdminPageHeader
        eyebrow="Community voice"
        title="Resident Feedback"
        description="Review resident comments and identify opportunities to improve barangay services."
      />
      <StatusFilterNotice status={statusFilter} to="/admin/resident-feedback" />
      <div className="space-y-4">
        {visible.map((item) => (
          <AdminCard key={item.id} className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold">{item.subject}</h2>
                  <StatusBadge status={String(item.status)} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.resident} · {item.date}
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {item.message}
                </p>
                <p className="mt-3 text-sm font-semibold text-gold-strong">
                  {"★".repeat(Number(item.rating))}
                  {"☆".repeat(5 - Number(item.rating))}
                </p>
              </div>
              {item.status === "New" && (
                <Button variant="outline" onClick={() => markFeedback(String(item.id))}>
                  <CheckCircle2 className="h-4 w-4" />
                  Mark reviewed
                </Button>
              )}
            </div>
          </AdminCard>
        ))}
        {visible.length === 0 && (
          <p className="rounded-md border border-dashed border-input px-5 py-12 text-center text-sm text-muted-foreground">
            No feedback with this status.
          </p>
        )}
      </div>
    </div>
  );
}
const toIsoDate = (value) => {
  if (!value) return "";
  const d = new Date(value.split("·")[0].trim());
  return Number.isNaN(d.getTime())
    ? ""
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const PAYABLE_STATUSES = ["Ready for Pickup"];
export function TransactionHistoryPage() {
  const { transactions, recordPayment } = useAdmin();
  const statusFilter = useStatusFilter();
  const [query, setQuery] = useState("");
  const [docType, setDocType] = useState("All");
  const [payStatus, setPayStatus] = useState("All");
  const [date, setDate] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const selected = transactions.find((row) => row.requestId === selectedId);
  const docTypes = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.service))).sort(),
    [transactions],
  );
  const activePay = statusFilter ?? (payStatus === "All" ? null : payStatus);
  const rows = useMemo(
    () =>
      transactions.filter(
        (row) =>
          (!activePay || row.payment.status === activePay) &&
          (docType === "All" || row.service === docType) &&
          (!date || toIsoDate(row.payment.date) === date || toIsoDate(row.submitted) === date) &&
          [row.id, row.requestId, row.resident, row.service, row.payment.receipt ?? "", row.status]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [transactions, query, activePay, docType, date],
  );
  const totalPaid = transactions
    .filter((t) => t.payment.status === "Paid")
    .reduce((sum, t) => sum + t.fee, 0);
  const canPay =
    selected && selected.payment.status === "Unpaid" && PAYABLE_STATUSES.includes(selected.status);
  const canRefund =
    selected && selected.payment.status === "Paid" && selected.status === "Rejected";
  const payHint = !selected
    ? ""
    : selected.payment.status === "No Fee"
      ? "No fee is charged for this document."
      : selected.payment.status === "Unpaid" && !PAYABLE_STATUSES.includes(selected.status)
        ? selected.status === "Rejected"
          ? "Rejected requests are not charged."
          : "Payment is collected when the resident claims the document (Ready for Pickup)."
        : selected.payment.status === "Paid" && selected.status !== "Rejected"
          ? "Payment complete."
          : selected.payment.status === "Refunded"
            ? "This payment was refunded."
            : "";
  const row = (label, value) => (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value ? String(value) : "—"}</dd>
    </div>
  );
  const selectClass = "h-11 rounded-md border border-input bg-background px-3 text-sm";
  return (
    <div>
      <AdminPageHeader
        eyebrow="Records"
        title="Transaction History"
        description="Document request transactions and payment records. Document statuses are managed in Document Requests."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Transactions"
          value={transactions.length}
          icon={History}
          note="Document requests on record"
        />
        <MetricCard
          label="Collected"
          value={peso(totalPaid)}
          icon={CheckCircle2}
          note="Sample fees marked as paid"
        />
        <MetricCard
          label="Awaiting payment"
          value={transactions.filter((t) => t.payment.status === "Unpaid").length}
          icon={CalendarClock}
          note="Unpaid requests"
        />
      </div>
      <StatusFilterNotice status={statusFilter} to="/admin/transaction-history" />
      <AdminCard>
        <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:flex-wrap lg:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search transaction, request, resident, receipt"
          />
          <select
            aria-label="Document type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className={selectClass}
          >
            <option value="All">All document types</option>
            {docTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            aria-label="Payment status"
            value={statusFilter ?? payStatus}
            disabled={!!statusFilter}
            onChange={(e) => setPayStatus(e.target.value)}
            className={selectClass}
          >
            <option value="All">All payment statuses</option>
            {["Unpaid", "Paid", "No Fee", "Refunded"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            aria-label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={selectClass}
          />
          {(docType !== "All" || payStatus !== "All" || date || query) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDocType("All");
                setPayStatus("All");
                setDate("");
                setQuery("");
              }}
            >
              Clear
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr>
                {[
                  "Transaction No.",
                  "Request No.",
                  "Resident",
                  "Document Type",
                  "Fee",
                  "Payment",
                  "Payment Date",
                  "Receipt No.",
                  "Document Status",
                  "",
                ].map((h) => (
                  <th key={h} className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.requestId}>
                  <td className={`${td} font-semibold text-primary`}>{t.id}</td>
                  <td className={td}>{t.requestId}</td>
                  <td className={td}>{t.resident}</td>
                  <td className={td}>{t.service}</td>
                  <td className={`${td} font-semibold`}>{peso(t.fee)}</td>
                  <td className={td}>
                    <StatusBadge status={t.payment.status} />
                  </td>
                  <td className={`${td} text-muted-foreground`}>{t.payment.date ?? "—"}</td>
                  <td className={td}>{t.payment.receipt ?? "—"}</td>
                  <td className={td}>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className={td}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedId(t.requestId);
                        setConfirm(null);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.id}</DialogTitle>
                <DialogDescription>
                  {selected.service} · Request {selected.requestId}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 md:grid-cols-2">
                <section className="rounded-md border border-border p-4">
                  <h3 className="mb-2 text-sm font-bold text-primary">Transaction Summary</h3>
                  <dl>
                    {row("Resident", selected.resident)}
                    {row("Document", selected.service)}
                    {row("Purpose", selected.source.purpose)}
                    {row("Requested", selected.submitted)}
                    <div className="flex justify-between py-1.5 text-sm">
                      <dt className="text-muted-foreground">Document status</dt>
                      <dd>
                        <StatusBadge status={selected.status} />
                      </dd>
                    </div>
                  </dl>
                </section>
                <section className="rounded-md border border-border p-4">
                  <h3 className="mb-2 text-sm font-bold text-primary">Payment Information</h3>
                  <dl>
                    {row("Document fee", peso(selected.fee))}
                    <div className="flex justify-between py-1.5 text-sm">
                      <dt className="text-muted-foreground">Payment status</dt>
                      <dd>
                        <StatusBadge status={selected.payment.status} />
                      </dd>
                    </div>
                    {row("Payment date", selected.payment.date)}
                    {row("Method", selected.payment.method)}
                    {row("Receipt no.", selected.payment.receipt)}
                  </dl>
                  <div className="mt-3 border-t border-border pt-3">
                    {confirm ? (
                      <div className="space-y-2">
                        <p className="text-sm">
                          {confirm === "Paid"
                            ? `Record ${peso(selected.fee)} cash payment and issue a receipt?`
                            : `Refund ${peso(selected.fee)} for this rejected request?`}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              recordPayment(selected.requestId, confirm);
                              setConfirm(null);
                            }}
                          >
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setConfirm(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {canPay && (
                          <Button size="sm" onClick={() => setConfirm("Paid")}>
                            <CheckCircle2 className="h-4 w-4" />
                            Mark as Paid
                          </Button>
                        )}
                        {canRefund && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConfirm("Refunded")}
                          >
                            Mark as Refunded
                          </Button>
                        )}
                        {payHint && <p className="mt-2 text-xs text-muted-foreground">{payHint}</p>}
                      </>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Sample payment record only. No online payment is processed.
                    </p>
                  </div>
                </section>
              </div>
              <section className="rounded-md border border-dashed border-border bg-muted/40 p-5">
                <h3 className="mb-3 text-sm font-bold text-primary">Receipt Preview</h3>
                {selected.payment.receipt ? (
                  <div className="mx-auto max-w-sm rounded-md border border-border bg-card p-5 text-sm shadow-card">
                    <div className="text-center">
                      <p className="text-xs uppercase text-muted-foreground">
                        Republic of the Philippines
                      </p>
                      <p className="font-bold">BARANGAY 902</p>
                      <p className="text-xs text-muted-foreground">Official Receipt (Sample)</p>
                    </div>
                    <dl className="mt-4 border-t border-border pt-3">
                      {row("Receipt no.", selected.payment.receipt)}
                      {row("Date", selected.payment.date)}
                      {row("Received from", selected.resident)}
                      {row("For", selected.service)}
                      {row("Amount", peso(selected.fee))}
                      {row("Status", selected.payment.status)}
                    </dl>
                    <p className="mt-4 text-center text-[11px] text-muted-foreground">
                      NOT VALID FOR OFFICIAL USE
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {selected.payment.status === "No Fee"
                      ? "No receipt needed. This document is free of charge."
                      : "A receipt will appear once payment is recorded."}
                  </p>
                )}
              </section>
              <section>
                <h3 className="mb-3 text-sm font-bold text-primary">Document Status Timeline</h3>
                <ol className="relative space-y-4 border-l-2 border-border pl-5">
                  {selected.timeline.map((entry) => (
                    <li key={entry.id} className="relative">
                      <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                      <p className="text-sm font-semibold">{entry.action}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {entry.from ? (
                          <>
                            <StatusBadge status={entry.from} />
                            <span>→</span>
                          </>
                        ) : null}
                        <StatusBadge status={entry.to} />
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {entry.at} · {entry.by}
                      </p>
                      {entry.remarks && (
                        <p className="mt-2 rounded-md bg-muted px-3 py-2 text-xs">
                          Remarks: {entry.remarks}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
              <DialogFooter>
                <p className="mr-auto text-xs text-muted-foreground">
                  Document status is updated in Document Requests.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/admin/document-requests" search={{ status: undefined }}>
                    Go to Document Requests
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function AdminProfilePage() {
  const { admin, updateAdmin } = useAdmin();
  const [saved, setSaved] = useState(false);
  if (!admin) return null;
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    updateAdmin({
      fullName: String(data.get("name")),
      email: String(data.get("email")),
      contact: String(data.get("contact")),
    });
    setSaved(true);
  }
  return (
    <div>
      <AdminPageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage the administrator details shown within this mock portal."
      />
      <AdminCard className="max-w-3xl p-6">
        <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {admin.fullName.charAt(0)}
          </span>
          <div>
            <h2 className="text-lg font-bold">{admin.fullName}</h2>
            <p className="text-sm text-muted-foreground">{admin.role}</p>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Full name
            <input
              name="name"
              defaultValue={admin.fullName}
              className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
            />
          </label>
          <label className="text-sm font-semibold">
            Role
            <input
              disabled
              defaultValue={admin.role}
              className="mt-2 h-11 w-full rounded-md border border-input bg-muted px-3 text-muted-foreground"
            />
          </label>
          <label className="text-sm font-semibold">
            Email address
            <input
              name="email"
              type="email"
              defaultValue={admin.email}
              className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
            />
          </label>
          <label className="text-sm font-semibold">
            Contact number
            <input
              name="contact"
              defaultValue={admin.contact}
              className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
            />
          </label>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit">
              <ShieldCheck className="h-4 w-4" />
              Save profile
            </Button>
            {saved && <span className="text-sm font-semibold text-success">Changes saved.</span>}
          </div>
        </form>
      </AdminCard>
    </div>
  );
}

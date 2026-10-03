import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  History,
  Image as ImageIcon,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { StatusBadge } from "@/components/AdminUI";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
const FLOW = ["Pending", "Under Review", "In Progress", "Resolved"];
const STATUSES = [...FLOW, "Rejected"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
export function PriorityBadge({ priority }) {
  const p = priority ?? "Medium";
  const tone =
    p === "Urgent"
      ? "bg-destructive text-destructive-foreground"
      : p === "High"
        ? "bg-destructive/10 text-destructive"
        : p === "Medium"
          ? "bg-warning/15 text-warning"
          : "bg-primary/10 text-primary";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}
    >
      {(p === "Urgent" || p === "High") && <AlertTriangle className="h-3 w-3" />}
      {p} priority
    </span>
  );
}
function Card({ title, icon: Icon, children }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-primary">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}
function Field({ label, children, wide, icon: Icon }) {
  return (
    <div className={`min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-gold-strong" />}
        {label}
      </p>
      <div className="break-words text-sm leading-6">
        {children || <span className="text-muted-foreground">Not provided</span>}
      </div>
    </div>
  );
}
export function ProblemReportDetail({ report, evidence, onClose }) {
  const { updateReport, timelines } = useAdmin();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [zoom, setZoom] = useState(null);
  useEffect(() => {
    if (!report) return;
    setStatus(String(report.status));
    setPriority(String(report.priority ?? "Medium"));
    setRemarks(String(report.remarks ?? ""));
    setError("");
    setSuccess("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report?.id]);
  if (!report) return <Dialog open={false} />;
  const history = timelines[String(report.id)] ?? [];
  const photo = report.photo ?? evidence ?? null;
  const current = FLOW.indexOf(String(report.status));
  const closed = report.status === "Resolved" || report.status === "Rejected";
  const dirty =
    status !== report.status ||
    priority !== (report.priority ?? "Medium") ||
    remarks !== String(report.remarks ?? "");
  function save() {
    setSuccess("");
    if ((status === "Resolved" || status === "Rejected") && !remarks.trim()) {
      setError(
        status === "Resolved"
          ? "A resolution remark is required before marking this report as Resolved."
          : "Please state the reason for rejecting this report.",
      );
      return;
    }
    setError("");
    if (status !== report.status && (status === "Resolved" || status === "Rejected")) {
      setConfirming(true);
      return;
    }
    commit();
  }
  function commit() {
    const statusChanged = status !== report.status;
    updateReport(String(report.id), { status, remarks: remarks.trim(), priority });
    setConfirming(false);
    setSuccess(
      statusChanged
        ? `Report updated to "${status}". The change was added to the status history.`
        : "Changes saved successfully.",
    );
  }
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="flex max-h-[94vh] w-[calc(100vw-1rem)] max-w-6xl flex-col [&>button:last-child]:text-primary-foreground [&>button:last-child]:opacity-90 gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b border-border bg-primary px-5 py-4 pr-14 text-left text-primary-foreground sm:px-7">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gold">
              Problem Report · Case File
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <DialogTitle className="text-xl text-primary-foreground sm:text-2xl">
                {report.id}
              </DialogTitle>
              <span className="rounded-full bg-card p-0.5">
                <StatusBadge status={String(report.status)} />
              </span>
              <span className="rounded-full bg-card p-0.5">
                <PriorityBadge priority={report.priority} />
              </span>
            </div>
            <DialogDescription className="mt-1 text-primary-foreground/80">
              {report.type} · Submitted {report.reportedAt ?? report.date}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="min-w-0 space-y-4 bg-muted/40 p-4 sm:p-6">
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card title="Resident" icon={UserRound}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full name">{report.resident}</Field>
                      <Field label="Resident ID">{report.residentId}</Field>
                      <Field label="Contact number" icon={Phone}>
                        {report.contact}
                      </Field>
                      <Field label="Email" icon={Mail}>
                        {report.email}
                      </Field>
                    </div>
                  </Card>
                  <Card title="Submission" icon={CalendarClock}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Reference no.">{report.id}</Field>
                      <Field label="Date / time submitted">
                        {report.reportedAt ?? report.date}
                      </Field>
                      <Field label="Last updated">
                        {report.updatedAt ?? history[history.length - 1]?.at}
                      </Field>
                      <Field label="Current status">
                        <StatusBadge status={String(report.status)} />
                      </Field>
                    </div>
                  </Card>
                </div>
                <Card title="Reported Issue" icon={ClipboardList}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Problem category">{report.type}</Field>
                    <Field label="Priority">
                      <PriorityBadge priority={report.priority} />
                    </Field>
                    <Field label="Complete description" wide>
                      <p className="whitespace-pre-line">{report.description}</p>
                    </Field>
                  </div>
                </Card>
                <Card title="Location" icon={MapPin}>
                  <Field label="Exact reported location">{report.location}</Field>
                </Card>
                <Card title="Photo / Evidence" icon={ImageIcon}>
                  {photo ? (
                    <figure className="overflow-hidden rounded-md border border-border bg-muted">
                      <button
                        type="button"
                        onClick={() => setZoom({ src: photo, alt: `Evidence for ${report.id}` })}
                        className="group relative block w-full"
                        aria-label="Enlarge evidence photo"
                      >
                        <img
                          src={photo}
                          alt={`Evidence submitted for ${report.id}`}
                          className="max-h-[420px] w-full object-cover"
                        />
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-xs font-semibold text-primary shadow-card">
                          <Maximize2 className="h-3.5 w-3.5" />
                          Enlarge
                        </span>
                      </button>
                      <figcaption className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                        Submitted by {report.resident}
                      </figcaption>
                    </figure>
                  ) : (
                    <div className="flex min-h-36 flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 px-5 text-center">
                      <ImageIcon className="h-7 w-7 text-muted-foreground" />
                      <p className="mt-2 text-sm font-semibold">No photo or evidence uploaded</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        The resident submitted this report without an image.
                      </p>
                    </div>
                  )}
                </Card>
                <Card title="Applicant Confirmation & Signature" icon={FileSignature}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Confirmation">
                      {report.confirmation ? (
                        <span className="flex items-start gap-1.5 text-success">
                          <ShieldCheck className="mt-1 h-4 w-4 shrink-0" />
                          {report.confirmation}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No confirmation recorded</span>
                      )}
                    </Field>
                    <Field label="Signature">
                      {report.signature ? (
                        <button
                          type="button"
                          onClick={() =>
                            setZoom({
                              src: String(report.signature),
                              alt: `Signature of ${report.resident}`,
                            })
                          }
                          className="block w-full rounded-md border border-border bg-background p-2 hover:border-gold-muted"
                          aria-label="Enlarge signature"
                        >
                          <img
                            src={String(report.signature)}
                            alt={`Signature of ${report.resident}`}
                            className="mx-auto h-20 object-contain"
                          />
                        </button>
                      ) : (
                        <span className="text-muted-foreground">Signature not provided</span>
                      )}
                    </Field>
                  </div>
                </Card>
              </div>

              <aside className="min-w-0 space-y-5 border-t border-border p-4 sm:p-6 lg:border-l lg:border-t-0">
                <section>
                  <h3 className="text-sm font-bold text-primary">Case Progress</h3>
                  <ol className="mt-4 space-y-0">
                    {FLOW.map((step, i) => {
                      const done = report.status !== "Rejected" && i < current;
                      const active = report.status !== "Rejected" && i === current;
                      return (
                        <li key={step} className="relative flex gap-3 pb-4 last:pb-0">
                          {i < FLOW.length - 1 && (
                            <span
                              className={`absolute left-[11px] top-6 h-full w-0.5 ${done ? "bg-gold-strong" : "bg-border"}`}
                            />
                          )}
                          <span
                            className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${done ? "border-gold-strong bg-gold-strong text-primary-foreground" : active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}
                          >
                            {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                          </span>
                          <span
                            className={`pt-0.5 text-sm font-semibold ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {step}
                            {active && (
                              <span className="ml-2 text-xs font-normal text-muted-foreground">
                                Current
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                  {report.status === "Rejected" && (
                    <p className="mt-3 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                      <XCircle className="h-4 w-4" />
                      Outcome: Rejected
                    </p>
                  )}
                </section>

                <section className="space-y-4 border-t border-border pt-5">
                  <h3 className="text-sm font-bold text-primary">Update Case</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div>
                      <label
                        htmlFor="report-status"
                        className="text-xs font-bold uppercase text-muted-foreground"
                      >
                        Status
                      </label>
                      <Select
                        value={status}
                        onValueChange={(v) => {
                          setStatus(v);
                          setError("");
                          setSuccess("");
                        }}
                      >
                        <SelectTrigger id="report-status" className="mt-1.5 h-10 bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="report-priority"
                        className="text-xs font-bold uppercase text-muted-foreground"
                      >
                        Priority
                      </label>
                      <Select
                        value={priority}
                        onValueChange={(v) => {
                          setPriority(v);
                          setSuccess("");
                        }}
                      >
                        <SelectTrigger id="report-priority" className="mt-1.5 h-10 bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITIES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="admin-remarks"
                      className="text-xs font-bold uppercase text-muted-foreground"
                    >
                      {status === "Resolved"
                        ? "Resolution remark (required)"
                        : status === "Rejected"
                          ? "Rejection reason (required)"
                          : "Internal remarks"}
                    </label>
                    <Textarea
                      id="admin-remarks"
                      value={remarks}
                      onChange={(e) => {
                        setRemarks(e.target.value);
                        setError("");
                        setSuccess("");
                      }}
                      placeholder={
                        status === "Resolved"
                          ? "Describe how the issue was resolved…"
                          : "Add internal notes or action taken…"
                      }
                      className="mt-1.5 min-h-28 resize-y bg-card"
                      aria-invalid={Boolean(error)}
                    />
                    {error && (
                      <p className="mt-1 text-xs font-semibold text-destructive">{error}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Visible to barangay administrators only.
                    </p>
                  </div>
                  {closed && status === report.status && (
                    <p className="text-xs text-muted-foreground">
                      This case is closed. You can still reopen it by choosing another status.
                    </p>
                  )}
                  <Button className="w-full" disabled={!dirty} onClick={save}>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  {success && (
                    <p
                      role="status"
                      className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      {success}
                    </p>
                  )}
                </section>

                <section className="border-t border-border pt-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                    <History className="h-4 w-4" />
                    Status History
                  </h3>
                  {history.length ? (
                    <ol className="mt-3 space-y-3">
                      {[...history].reverse().map((e) => (
                        <li
                          key={e.id}
                          className="rounded-md border border-border bg-card p-3 text-xs"
                        >
                          <div className="flex flex-wrap items-center gap-1.5">
                            {e.from ? (
                              <>
                                <StatusBadge status={e.from} />
                                <span className="text-muted-foreground">→</span>
                              </>
                            ) : null}
                            <StatusBadge status={e.to} />
                          </div>
                          <p className="mt-2 font-semibold text-foreground">{e.action}</p>
                          <p className="mt-0.5 text-muted-foreground">
                            {e.at} · {e.by}
                          </p>
                          {e.remarks && (
                            <p className="mt-1.5 border-l-2 border-gold-muted pl-2 text-foreground">
                              {e.remarks}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">No status changes yet.</p>
                  )}
                </section>
              </aside>
            </div>
          </div>
          <div className="flex shrink-0 justify-end border-t border-border bg-card px-5 py-3 sm:px-7">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {status === "Resolved" ? "Mark this report as Resolved?" : "Reject this report?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {report.id} · {report.type}.{" "}
              {status === "Resolved"
                ? "This closes the case and records your resolution remark in the history."
                : "This closes the case as Rejected and records your reason in the history."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm">{remarks}</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={commit}
              className={
                status === "Rejected"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {status === "Resolved" ? "Yes, mark Resolved" : "Yes, reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={Boolean(zoom)}
        onOpenChange={(o) => {
          if (!o) setZoom(null);
        }}
      >
        {zoom && (
          <DialogContent className="max-h-[94vh] w-[calc(100vw-1rem)] max-w-5xl overflow-auto p-3">
            <DialogHeader className="sr-only">
              <DialogTitle>{zoom.alt}</DialogTitle>
              <DialogDescription>Enlarged preview</DialogDescription>
            </DialogHeader>
            <img
              src={zoom.src}
              alt={zoom.alt}
              className="mx-auto max-h-[85vh] w-auto rounded-md bg-background object-contain"
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

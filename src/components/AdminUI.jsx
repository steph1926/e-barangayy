import { useNavigate } from "@tanstack/react-router";
export function AdminPageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase text-gold-strong">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function MetricCard({ label, value, icon: Icon, note }) {
  return (
    <article className="group rounded-lg border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-gold-muted hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-primary">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </article>
  );
}
export function StatusBadge({ status }) {
  const style = [
    "Verified",
    "Resolved",
    "Completed",
    "Published",
    "Approved",
    "Released",
    "Paid",
  ].includes(status)
    ? "bg-success/15 text-success"
    : [
          "Pending",
          "Pending Verification",
          "New",
          "Needs Review",
          "Additional Information Required",
          "Unpaid",
        ].includes(status)
      ? "bg-warning/15 text-warning"
      : ["Rejected", "Refunded"].includes(status)
        ? "bg-destructive/10 text-destructive"
        : "bg-primary/10 text-primary";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}
export function AdminCard({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-border bg-card shadow-card ${className}`}>
      {children}
    </section>
  );
}
export function SearchField({ value, onChange, placeholder = "Search records" }) {
  return (
    <input
      aria-label={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring-soft sm:max-w-xs"
    />
  );
}
export function TableShell({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">{children}</table>
    </div>
  );
}
export function StatusFilterNotice({ status }) {
  const navigate = useNavigate();
  if (!status) return null;
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-md border border-gold-muted bg-accent/60 px-4 py-3 text-sm">
      <span className="font-semibold text-primary">Showing status:</span>
      <StatusBadge status={status} />
      <button
        type="button"
        onClick={() => navigate({ to: ".", search: {}, replace: true })}
        className="ml-auto text-xs font-semibold text-primary underline"
      >
        Clear filter
      </button>
    </div>
  );
}
export const th =
  "border-b border-border bg-muted px-5 py-3 text-xs font-bold uppercase text-muted-foreground";
export const td = "border-b border-border px-5 py-4 align-middle";

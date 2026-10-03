import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  FileText,
  Megaphone,
  PackageCheck,
  Clock,
  ClipboardList,
} from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import { Card, StatusBadge } from "@/components/ui-kit";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Resident Dashboard — E-Barangay 902" },
      {
        name: "description",
        content: "View your Barangay 902 reports, document requests, and announcements.",
      },
      { property: "og:title", content: "Resident Dashboard — E-Barangay 902" },
      {
        property: "og:description",
        content: "Manage resident reports and document requests in the Barangay 902 portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, reports, requests, announcements } = useApp();
  const pending = requests.filter((request) =>
    ["Pending", "Under Review", "Approved"].includes(request.status),
  ).length;
  const ready = requests.filter((request) => request.status === "Ready for Pickup").length;
  const stats = [
    { label: "Total Reports", value: reports.length, icon: ClipboardList },
    { label: "Pending Document Requests", value: pending, icon: Clock },
    { label: "Ready for Pickup", value: ready, icon: PackageCheck },
  ];
  const actions = [
    { to: "/report", label: "Report a Problem", icon: AlertTriangle },
    { to: "/request-document", label: "Request a Document", icon: FileText },
    { to: "/announcements", label: "View Announcements", icon: Megaphone },
  ];
  return (
    <div>
      <div className="mb-7 rounded-2xl bg-primary p-7 text-primary-foreground">
        <p className="text-sm text-primary-foreground/70">Welcome back,</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{user.fullName}</h1>
        <p className="mt-2 text-sm text-primary-foreground/80">
          Here is a summary of your barangay transactions today.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-5 w-5 text-secondary" />
            </div>
            <p className="mt-3 text-3xl font-bold text-primary">{stat.value}</p>
          </Card>
        ))}
      </div>
      <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-secondary hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <action.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Latest Announcements</h2>
            <Link to="/announcements" className="text-sm font-semibold text-secondary">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((item) => (
              <Card key={item.id} className="p-5">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Recent Reports</h2>
            <Link to="/my-reports" className="text-sm font-semibold text-secondary">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <Card key={report.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">{report.type}</p>
                  <StatusBadge status={report.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {report.id} · {report.date}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

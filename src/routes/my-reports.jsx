import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, MapPin } from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import { useAdmin } from "@/lib/admin-store";
import { Button, Card, EmptyState, PageHeader, StatusBadge } from "@/components/ui-kit";

export const Route = createFileRoute("/my-reports")({
  head: () => ({
    meta: [
      { title: "My Reports — E-Barangay 902" },
      { name: "description", content: "Track the status of the barangay problems you reported." },
      { property: "og:title", content: "My Reports — E-Barangay 902" },
      {
        property: "og:description",
        content: "Track the status of the barangay problems you reported.",
      },
    ],
  }),
  component: MyReports,
});

function MyReports() {
  const { reports: raw } = useApp();
  const { reports: adminItems } = useAdmin();
  const reports = raw.map((r) => ({
    ...r,
    status: adminItems.find((a) => a.id === r.id)?.status ?? r.status,
  }));

  return (
    <div>
      <PageHeader
        icon={ClipboardList}
        title="My Reports"
        subtitle="All problems you submitted to the barangay."
      />

      {reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="When you report a community problem, it will appear here with its status."
          action={
            <Link to="/report">
              <Button>Report a Problem</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-secondary">{r.id}</p>
                  <p className="mt-1 text-base font-bold text-foreground">{r.type}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {r.location}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={r.status} />
                  <p className="mt-2 text-xs text-muted-foreground">Submitted {r.date}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.description}</p>
              {r.photo ? (
                <img
                  src={r.photo}
                  alt="Report attachment"
                  className="mt-3 h-32 w-auto rounded-xl border border-border object-cover"
                />
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

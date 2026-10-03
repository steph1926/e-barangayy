import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, BellRing } from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import { useAdmin } from "@/lib/admin-store";
import { Button, Card, EmptyState, PageHeader, StatusBadge } from "@/components/ui-kit";

export const Route = createFileRoute("/my-requests")({
  head: () => ({
    meta: [
      { title: "My Document Requests — E-Barangay 902" },
      {
        name: "description",
        content: "Track your barangay document requests and pickup notifications.",
      },
      { property: "og:title", content: "My Document Requests — E-Barangay 902" },
      {
        property: "og:description",
        content: "Track your barangay document requests and pickup notifications.",
      },
    ],
  }),
  component: MyRequests,
});

function MyRequests() {
  const { requests: raw } = useApp();
  const { documents: adminItems } = useAdmin();
  const { user } = useApp();
  const { transactions } = useAdmin();
  const extra = adminItems.filter(
    (a) => user && a.resident === user.fullName && !raw.some((r) => r.id === a.id),
  );
  const requests = [...raw, ...extra].map((r) => {
    const live = adminItems.find((a) => a.id === r.id);
    return {
      ...r,
      status: live?.status ?? r.status,
      updatedAt: live?.updatedAt,
      payment: transactions.find((t) => t.requestId === r.id)?.payment.status,
    };
  });
  const ready = requests.filter((r) => r.status === "Ready for Pickup");

  return (
    <div>
      <PageHeader
        icon={FolderOpen}
        title="My Document Requests"
        subtitle="Monitor the progress of every request."
      />

      {ready.length > 0 ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
          <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">
              {ready.length} document{ready.length > 1 ? "s are" : " is"} ready for pickup
            </p>
            <p className="mt-1 text-muted-foreground">
              Claim {ready.map((r) => r.id).join(", ")} at the Barangay Hall, Monday to Friday, 8:00
              AM – 5:00 PM. Please bring a valid ID.
            </p>
          </div>
        </div>
      ) : null}

      {requests.length === 0 ? (
        <EmptyState
          title="No document requests yet"
          description="Submitted requests and their statuses will be listed here."
          action={
            <Link to="/request-document">
              <Button>Request a Document</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-secondary">{r.id}</p>
                  <p className="mt-1 text-base font-bold text-foreground">{r.type}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Purpose: {r.purpose}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={r.status} />
                  <p className="mt-2 text-xs text-muted-foreground">Requested {r.date}</p>
                  {r.updatedAt ? (
                    <p className="text-xs text-muted-foreground">Updated {r.updatedAt}</p>
                  ) : null}
                  {r.payment ? (
                    <p className="text-xs text-muted-foreground">Payment: {r.payment}</p>
                  ) : null}
                </div>
              </div>
              {r.status === "Ready for Pickup" ? (
                <p className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
                  Pickup notification: Your document is ready at the Barangay Hall.
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { ID_REMINDER, PICKUP_INSTRUCTIONS } from "@/lib/admin-store";
export function PickupEmailPreview({ notification }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card text-sm">
      <div className="space-y-1 border-b border-border bg-muted px-4 py-3 text-xs">
        <p>
          <span className="font-semibold">From:</span> Barangay 902 E-Services
          &lt;no-reply@barangay902.example&gt;
        </p>
        <p>
          <span className="font-semibold">To:</span>{" "}
          {notification.email || "No registered email on file"}
        </p>
        <p>
          <span className="font-semibold">Subject:</span> Your {notification.documentType} is ready
          for pickup ({notification.requestId})
        </p>
      </div>
      <div className="border-b-4 border-gold bg-primary px-5 py-4 text-primary-foreground">
        <p className="text-xs uppercase opacity-80">Barangay 902 · City of Manila</p>
        <p className="text-lg font-bold">Document Ready for Pickup</p>
      </div>
      <div className="space-y-3 px-5 py-4 leading-6">
        <p>Good day, {notification.resident}.</p>
        <p>Your requested document is now ready for pickup.</p>
        <dl className="rounded-md bg-muted px-4 py-3">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Document type</dt>
            <dd className="font-semibold">{notification.documentType}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Reference no.</dt>
            <dd className="font-semibold">{notification.requestId}</dd>
          </div>
        </dl>
        <p>
          <span className="font-semibold">Pickup instructions:</span> {PICKUP_INSTRUCTIONS}
        </p>
        <p className="rounded-md border border-gold-muted bg-accent/60 px-3 py-2">
          <span className="font-semibold">Reminder:</span> {ID_REMINDER}
        </p>
        <p className="text-muted-foreground">
          Thank you,
          <br />
          Office of the Barangay Council, Barangay 902
        </p>
      </div>
      <p className="border-t border-border bg-muted px-4 py-2 text-center text-[11px] font-semibold uppercase text-muted-foreground">
        Simulation only · No real email is sent in this prototype
      </p>
    </div>
  );
}

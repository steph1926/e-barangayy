import { useState } from "react";
import { Bell, Megaphone, PackageCheck } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export function NotificationBell({ resident }) {
  const { notifications, markNotificationsRead } = useAdmin();
  const [open, setOpen] = useState(false);
  const mine = notifications.filter((n) => n.resident === resident || n.resident === "All");
  const isUnread = (n) =>
    n.resident === "All" ? !(n.readBy ?? []).includes(resident) : !n.read;
  const unread = mine.filter(isUnread).length;
  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) markNotificationsRead(resident);
      }}
    >
      <PopoverTrigger asChild>
        <button
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary transition hover:border-gold-muted"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-primary">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-bold text-primary">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {unread ? `${unread} unread` : "All caught up"}
          </p>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {mine.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </li>
          )}
          {mine.map((n) => (
            <li
              key={n.id}
              className={`flex gap-3 border-b border-border px-4 py-3 last:border-0 ${isUnread(n) ? "bg-accent/60" : ""}`}
            >
              {n.resident === "All" ? (
                <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" />
              ) : (
                <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" />
              )}
              <div className="min-w-0 text-sm">
                <p className="font-semibold">{n.documentType}</p>
                <p className="text-xs text-muted-foreground">
                  {n.resident === "All" ? "Announcement" : n.requestId} · {n.date}
                </p>
                <p className="mt-1 text-xs leading-5">{n.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

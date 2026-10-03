import { NotificationBell } from "@/components/NotificationBell";
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  ClipboardList,
  FileText,
  FolderOpen,
  Megaphone,
  User,
  LogOut,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import logo from "@/assets/barangay-logo.png";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/report", label: "Report a Problem", icon: AlertTriangle },
  { to: "/my-reports", label: "My Reports", icon: ClipboardList },
  { to: "/request-document", label: "Request Documents", icon: FileText },
  { to: "/my-requests", label: "My Document Requests", icon: FolderOpen },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: User },
];

export default function ResidentShell({ children }) {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-secondary text-secondary-foreground"
                : "text-primary-foreground/75 hover:bg-primary-foreground/10"
            }`}
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-primary p-5 lg:flex">
        <Brand />
        {nav}
        <LogoutButton onClick={logout} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-primary p-5">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-5 text-primary-foreground/70"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Brand />
            {nav}
            <LogoutButton onClick={logout} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/90 px-5 py-3.5 backdrop-blur">
          <button onClick={() => setOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6 text-primary" />
          </button>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Barangay 902 Resident Portal
          </p>
          <div className="flex items-center gap-3">
            <NotificationBell resident={user.fullName} />
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">Resident</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user.fullName.charAt(0)}
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="mb-7 flex items-center gap-3 px-1">
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
        <img src={logo} alt="Barangay 902 logo" className="h-8 w-8 object-contain" />
      </span>
      <div>
        <p className="text-sm font-bold leading-tight text-primary-foreground">E-Barangay</p>
        <p className="text-xs text-primary-foreground/60">Resident Portal</p>
      </div>
    </div>
  );
}

function LogoutButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-primary-foreground/75 transition hover:bg-primary-foreground/10"
    >
      <LogOut className="h-4.5 w-4.5" />
      Logout
    </button>
  );
}

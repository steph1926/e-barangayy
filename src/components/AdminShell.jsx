import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import logo from "@/assets/barangay-logo.png";
function NavGroup({ item, pathname, activeStatus, collapsed, onNavigate, newCount = 0 }) {
  const active = pathname === item.to;
  const [open, setOpen] = useState(active);
  const hasStatuses = item.statuses.length > 0;
  const linkClass = `relative flex min-h-11 flex-1 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${collapsed ? "justify-center" : ""} ${active ? "bg-secondary text-secondary-foreground" : "text-nav-muted hover:bg-nav-hover hover:text-primary-foreground"}`;
  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          to={item.to}
          search={hasStatuses ? { status: undefined } : undefined}
          onClick={() => {
            onNavigate();
            if (hasStatuses) setOpen(true);
          }}
          title={collapsed ? item.label : undefined}
          className={linkClass}
        >
          <item.icon className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span className="flex-1">{item.label}</span>}
          {newCount > 0 && (
            <span className={`rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-destructive-foreground ${collapsed ? "absolute ml-6 -mt-6" : ""}`}>
              {collapsed ? newCount : `New ${newCount}`}
            </span>
          )}
        </Link>
        {hasStatuses && !collapsed && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={`${open ? "Hide" : "Show"} ${item.label} statuses`}
            className="flex h-9 w-8 shrink-0 items-center justify-center rounded-md text-nav-muted transition hover:bg-nav-hover hover:text-primary-foreground"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {hasStatuses && !collapsed && open && (
        <ul className="mt-1 ml-5 space-y-0.5 border-l border-nav-muted/25 pl-3">
          <li>
            <Link
              to={item.to}
              search={{ status: undefined }}
              onClick={onNavigate}
              className={`flex min-h-9 items-center rounded-md px-2.5 text-xs font-semibold transition ${active && !activeStatus ? "bg-nav-hover text-primary-foreground" : "text-nav-muted hover:bg-nav-hover hover:text-primary-foreground"}`}
            >
              All records
            </Link>
          </li>
          {item.statuses.map((status) => {
            const selected = active && activeStatus === status;
            return (
              <li key={status}>
                <Link
                  to={item.to}
                  search={{ status }}
                  onClick={onNavigate}
                  className={`flex min-h-9 items-center rounded-md px-2.5 text-xs font-medium transition ${selected ? "bg-nav-hover text-primary-foreground" : "text-nav-muted hover:bg-nav-hover hover:text-primary-foreground"}`}
                >
                  {status}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
export function AdminShell({ children }) {
  const { admin, logoutAdmin, adminAlerts, markAdminSeen } = useAdmin();
  const newDocs = adminAlerts.filter((a) => a.kind === "document").length;
  const newReports = adminAlerts.filter((a) => a.kind === "report").length;
  const newRegs = adminAlerts.filter((a) => a.kind === "registration").length;
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const searchStr = useRouterState({ select: (state) => state.location.searchStr });
  const activeStatus = new URLSearchParams(searchStr).get("status");
  const [mobileOpen, setMobileOpen] = useState(false);
  // Items count as seen once the admin leaves the page they were shown on.
  useEffect(() => {
    const kind =
      pathname === "/admin/document-requests" ? "document" : pathname === "/admin/problem-reports"
          ? "report"
          : pathname === "/admin/resident-verification"
            ? "registration"
            : null;
    if (!kind) return;
    return () => markAdminSeen(kind);
  }, [pathname, markAdminSeen]);
  const [collapsed, setCollapsed] = useState(false);
  const logout = () => {
    logoutAdmin();
    navigate({ to: "/", replace: true });
  };
  const content = (
    <>
      <div className={`mb-7 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
          <img src={logo} alt="Barangay 902 logo" className="h-8 w-8 object-contain" />
        </span>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-primary-foreground">E-Barangay 902</p>
            <p className="text-xs text-nav-muted">Admin Portal</p>
          </div>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Admin navigation">
        {ADMIN_NAV.map((item) => (
          <NavGroup
            key={item.to}
            item={item}
            pathname={pathname}
            activeStatus={activeStatus}
            collapsed={collapsed}
            onNavigate={() => setMobileOpen(false)}
            newCount={
              item.to === "/admin/document-requests" ? newDocs : item.to === "/admin/problem-reports" ? newReports : item.to === "/admin/resident-verification" ? newRegs : 0
            }
          />
        ))}
      </nav>
      <Button
        variant="ghost"
        onClick={logout}
        className={`mt-4 ${collapsed ? "px-0" : "justify-start"}`}
        title={collapsed ? "Logout" : undefined}
      >
        <LogOut className="h-[18px] w-[18px]" />
        {!collapsed && "Logout"}
      </Button>
    </>
  );
  return (
    <div className="min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-primary p-5 shadow-header transition-all lg:flex ${collapsed ? "w-20" : "w-72"}`}
      >
        {content}
        <Button
          variant="secondary"
          size="icon-sm"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-4 top-24 rounded-full border-4 border-background"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col overflow-y-auto bg-primary p-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
            {content}
          </aside>
        </div>
      )}
      <div className={`transition-all ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-30 flex min-h-17 items-center justify-between gap-4 border-b border-border bg-card/95 px-5 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs font-semibold uppercase text-gold-strong">Barangay 902</p>
              <p className="hidden text-sm font-semibold sm:block">Administration Office</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Notifications" title="Notifications" className="relative">
                  <Bell className="h-4 w-4" />
                  {adminAlerts.length > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {adminAlerts.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  {adminAlerts.length > 0 && (
                    <button type="button" onClick={() => markAdminSeen()} className="text-xs font-medium text-primary hover:underline">
                      Mark all as read
                    </button>
                  )}
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {adminAlerts.length === 0 && (
                    <li className="px-4 py-6 text-center text-sm text-muted-foreground">No new notifications</li>
                  )}
                  {adminAlerts.map((a) => (
                    <li key={a.id}>
                      <Link
                        to={
                          a.kind === "document"
                            ? "/admin/document-requests"
                            : a.kind === "registration"
                              ? "/admin/resident-verification"
                              : "/admin/problem-reports"
                        }
                        search={{ status: undefined }}
                        className="flex gap-3 border-b border-border px-4 py-3 text-left hover:bg-muted"
                      >
                        <span className="mt-0.5 h-fit rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-destructive-foreground">
                          New
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{a.title}</span>
                          <span className="block text-xs text-muted-foreground">
                            {a.resident} · {a.id}
                          </span>
                          <span className="block text-xs text-muted-foreground">{a.at}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{admin?.fullName}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {admin?.fullName.charAt(0)}
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-[1480px] px-5 py-7 sm:px-7 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

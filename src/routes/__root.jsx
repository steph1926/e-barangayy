import { QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import appCss from "../styles.css?url";
import { AppProvider, useApp } from "@/lib/barangay-store";
import ResidentShell from "@/components/ResidentShell";
import { AdminProvider, useAdmin } from "@/lib/admin-store";
import { AdminShell } from "@/components/AdminShell";
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "E-Barangay 902 Management System" },
      {
        name: "description",
        content: "Public information and resident services for Barangay 902, Maynila.",
      },
      { name: "author", content: "Barangay 902" },
      { property: "og:title", content: "E-Barangay 902" },
      {
        property: "og:description",
        content: "Public information and resident services for Barangay 902, Maynila.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
function RootShell({ children }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
const RESIDENT_PATHS = [
  "/dashboard",
  "/report",
  "/my-reports",
  "/request-document",
  "/my-requests",
  "/announcements",
  "/feedback",
  "/profile",
];
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AdminProvider>
          <PortalGate />
        </AdminProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
function PortalGate() {
  const { user, restored } = useApp();
  const { admin, adminRestored } = useAdmin();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isResidentArea = RESIDENT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  // Only verified resident accounts may open the resident portal.
  const residentAllowed =
    Boolean(user) && user?.status !== "Pending Verification" && user?.status !== "Rejected";
  useEffect(() => {
    if (isResidentArea && !residentAllowed && restored) navigate({ to: "/" });
    if (isAdminArea && !admin && adminRestored) navigate({ to: "/" });
  }, [isResidentArea, isAdminArea, restored, adminRestored, residentAllowed, admin, navigate]);
  if (isAdminArea) {
    if (!admin)
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Opening the admin portal…</p>
        </div>
      );
    return (
      <AdminShell>
        <Outlet />
      </AdminShell>
    );
  }
  if (isResidentArea) {
    if (!residentAllowed) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Opening the resident portal…</p>
        </div>
      );
    }
    return (
      <ResidentShell>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </ResidentShell>
    );
  }
  return <Outlet />;
}

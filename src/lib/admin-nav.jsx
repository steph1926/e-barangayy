import {
  ClipboardCheck,
  FileClock,
  History,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
export const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, statuses: [] },
  {
    to: "/admin/resident-verification",
    label: "Resident Verification",
    icon: UserRoundCheck,
    statuses: ["Pending Verification", "Additional Information Required", "Verified", "Rejected"],
  },
  {
    to: "/admin/problem-reports",
    label: "Problem Reports",
    icon: ClipboardCheck,
    statuses: ["Pending", "Under Review", "In Progress", "Resolved", "Rejected"],
  },
  {
    to: "/admin/document-requests",
    label: "Document Requests",
    icon: FileClock,
    statuses: ["Pending", "Under Review", "Approved", "Ready for Pickup", "Released", "Rejected"],
  },
  {
    to: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
    statuses: ["Published", "Draft"],
  },
  {
    to: "/admin/resident-feedback",
    label: "Resident Feedback",
    icon: MessageSquareText,
    statuses: ["New", "Reviewed"],
  },
  {
    to: "/admin/transaction-history",
    label: "Transaction History",
    icon: History,
    statuses: ["Unpaid", "Paid", "No Fee", "Refunded"],
  },
  { to: "/admin/profile", label: "Profile", icon: ShieldCheck, statuses: [] },
];
export const statusSearchSchema = (search) => {
  const value = search["status"];
  return { status: typeof value === "string" && value.trim() ? value : undefined };
};

import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/AdminPages";
export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — E-Barangay 902" },
      { name: "description", content: "Barangay 902 administration overview and service queues." },
      { property: "og:title", content: "Admin Dashboard — E-Barangay 902" },
      {
        property: "og:description",
        content: "Barangay 902 administration overview and service queues.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboard,
});

import { createFileRoute } from "@tanstack/react-router";
import { AdminProfilePage } from "@/components/AdminPages";
export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile — E-Barangay 902" },
      { name: "description", content: "Manage the Barangay 902 administrator profile." },
      { property: "og:title", content: "Admin Profile — E-Barangay 902" },
      { property: "og:description", content: "Manage the Barangay 902 administrator profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminProfilePage,
});

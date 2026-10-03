import { createFileRoute } from "@tanstack/react-router";
import { statusSearchSchema } from "@/lib/admin-nav";
import { AnnouncementsPage } from "@/components/AdminPages";
export const Route = createFileRoute("/admin/announcements")({
  validateSearch: statusSearchSchema,
  head: () => ({
    meta: [
      { title: "Announcements — E-Barangay 902" },
      { name: "description", content: "Publish and review Barangay 902 community announcements." },
      { property: "og:title", content: "Announcements — E-Barangay 902" },
      {
        property: "og:description",
        content: "Publish and review Barangay 902 community announcements.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnnouncementsPage,
});

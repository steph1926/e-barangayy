import { createFileRoute } from "@tanstack/react-router";
import { statusSearchSchema } from "@/lib/admin-nav";
import { FeedbackPage } from "@/components/AdminPages";
export const Route = createFileRoute("/admin/resident-feedback")({
  validateSearch: statusSearchSchema,
  head: () => ({
    meta: [
      { title: "Resident Feedback — E-Barangay 902" },
      { name: "description", content: "Review feedback submitted by Barangay 902 residents." },
      { property: "og:title", content: "Resident Feedback — E-Barangay 902" },
      {
        property: "og:description",
        content: "Review feedback submitted by Barangay 902 residents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedbackPage,
});

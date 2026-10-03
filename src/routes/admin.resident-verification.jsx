import { createFileRoute } from "@tanstack/react-router";
import { statusSearchSchema } from "@/lib/admin-nav";
import { ResidentVerificationPage } from "@/components/AdminPages";
export const Route = createFileRoute("/admin/resident-verification")({
  validateSearch: statusSearchSchema,
  head: () => ({
    meta: [
      { title: "Resident Verification — E-Barangay 902" },
      { name: "description", content: "Review and verify Barangay 902 resident registrations." },
      { property: "og:title", content: "Resident Verification — E-Barangay 902" },
      {
        property: "og:description",
        content: "Review and verify Barangay 902 resident registrations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResidentVerificationPage,
});

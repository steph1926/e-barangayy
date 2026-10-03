import { createFileRoute } from "@tanstack/react-router";
import { statusSearchSchema } from "@/lib/admin-nav";
import { DocumentRequestsPage } from "@/components/AdminPages";
export const Route = createFileRoute("/admin/document-requests")({
  validateSearch: statusSearchSchema,
  head: () => ({
    meta: [
      { title: "Document Requests — E-Barangay 902" },
      { name: "description", content: "Process Barangay 902 resident document requests." },
      { property: "og:title", content: "Document Requests — E-Barangay 902" },
      { property: "og:description", content: "Process Barangay 902 resident document requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocumentRequestsPage,
});

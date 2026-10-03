import { createFileRoute } from "@tanstack/react-router";
import { statusSearchSchema } from "@/lib/admin-nav";
import { ProblemReportsPage } from "@/components/AdminPages";
export const Route = createFileRoute("/admin/problem-reports")({
  validateSearch: statusSearchSchema,
  head: () => ({
    meta: [
      { title: "Problem Reports — E-Barangay 902" },
      { name: "description", content: "Manage reported community concerns in Barangay 902." },
      { property: "og:title", content: "Problem Reports — E-Barangay 902" },
      {
        property: "og:description",
        content: "Manage reported community concerns in Barangay 902.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProblemReportsPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { statusSearchSchema } from "@/lib/admin-nav";
import { TransactionHistoryPage } from "@/components/AdminPages";
export const Route = createFileRoute("/admin/transaction-history")({
  validateSearch: statusSearchSchema,
  head: () => ({
    meta: [
      { title: "Transaction History — E-Barangay 902" },
      { name: "description", content: "Review Barangay 902 service transaction records." },
      { property: "og:title", content: "Transaction History — E-Barangay 902" },
      { property: "og:description", content: "Review Barangay 902 service transaction records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TransactionHistoryPage,
});

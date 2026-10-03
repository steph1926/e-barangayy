import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, CalendarDays } from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import { Card, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements — E-Barangay 902" },
      {
        name: "description",
        content: "Official barangay announcements, advisories, and community events.",
      },
      { property: "og:title", content: "Announcements — E-Barangay 902" },
      {
        property: "og:description",
        content: "Official barangay announcements, advisories, and community events.",
      },
    ],
  }),
  component: Announcements,
});

function Announcements() {
  const { announcements } = useApp();
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(announcements.map((a) => a.category))];
  const list =
    filter === "All" ? announcements : announcements.filter((a) => a.category === filter);

  return (
    <div>
      <PageHeader
        icon={Megaphone}
        title="Announcements"
        subtitle="Stay updated with official barangay news."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === c
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                {a.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> Posted {a.date}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-foreground">{a.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

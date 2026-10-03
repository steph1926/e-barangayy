import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, Star, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import { useAdmin } from "@/lib/admin-store";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
} from "@/components/ui-kit";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — E-Barangay 902" },
      {
        name: "description",
        content: "Share feedback and suggestions with Barangay 902 officials.",
      },
      { property: "og:title", content: "Feedback — E-Barangay 902" },
      {
        property: "og:description",
        content: "Share feedback and suggestions with Barangay 902 officials.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FeedbackPage,
});

const CATEGORIES = [
  "Document Services",
  "Problem Reports",
  "Barangay Officials",
  "Facilities",
  "Website / Portal",
  "Other",
];
const today = () =>
  new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function FeedbackPage() {
  const { user } = useApp();
  const { feedback, addFeedback } = useAdmin();
  const [form, setForm] = useState({ category: "", subject: "", message: "", rating: 0 });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);
  const mine = feedback.filter((f) => user && f.resident === user.fullName);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.category) err.category = "Please choose a category.";
    if (form.subject.trim().length < 5) err.subject = "Subject must be at least 5 characters.";
    if (form.message.trim().length < 15) err.message = "Message must be at least 15 characters.";
    if (!form.rating) err.rating = "Please give a rating.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const item = {
      id: `FDB-${Math.floor(100 + Math.random() * 900)}`,
      resident: user?.fullName ?? "Resident",
      subject: `${form.category}: ${form.subject.trim()}`,
      message: form.message.trim(),
      date: today(),
      rating: form.rating,
      status: "New",
    };
    addFeedback(item);
    setSent(item);
    setForm({ category: "", subject: "", message: "", rating: 0 });
  };

  return (
    <div>
      <PageHeader
        icon={MessageSquare}
        title="Feedback"
        subtitle="Tell us how we can serve Barangay 902 better."
      />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <p className="mt-3 text-lg font-bold text-foreground">Thank you for your feedback!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Reference no. <span className="font-semibold text-secondary">{sent.id}</span> ·{" "}
                {sent.date}
              </p>
              <Button className="mt-5" onClick={() => setSent(null)}>
                Send Another
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Field label="Category" error={errors.category}>
                <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Subject" error={errors.subject}>
                <Input
                  value={form.subject}
                  maxLength={80}
                  onChange={(e) => set("subject", e.target.value)}
                  placeholder="e.g. Faster clearance processing"
                />
              </Field>
              <div>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Rating</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onClick={() => set("rating", n)}
                    >
                      <Star
                        className={`h-7 w-7 ${n <= form.rating ? "fill-warning text-warning" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating ? (
                  <span className="mt-1 block text-xs text-destructive">{errors.rating}</span>
                ) : null}
              </div>
              <Field label="Message" error={errors.message}>
                <Textarea
                  value={form.message}
                  maxLength={600}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Share your experience or suggestion..."
                />
              </Field>
              <Button type="submit">Submit Feedback</Button>
            </form>
          )}
        </Card>
        <Card className="p-6">
          <p className="text-base font-bold text-foreground">My Feedback</p>
          {mine.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              You have not sent any feedback yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {mine.map((f) => (
                <li key={f.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{f.subject}</p>
                    <StatusBadge status={f.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {f.id} · {f.date} · {f.rating}★
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

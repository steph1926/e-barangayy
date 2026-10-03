import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Eraser,
  FileSignature,
  Info,
  ImagePlus,
  MapPin,
  PenLine,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useApp } from "@/lib/barangay-store";
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

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Barangay Problem — Barangay 902 Resident Portal" },
      {
        name: "description",
        content:
          "Report garbage, damaged streetlights, Road damage and other problems in Barangay 902, Zone 100, District 6, Maynila.",
      },
      { property: "og:title", content: "Report a Barangay Problem — Barangay 902" },
      {
        property: "og:description",
        content:
          "Help improve our community by reporting problems in your area of Barangay 902, Zone 100, District 6, Maynila.",
      },
    ],
  }),
  component: ReportPage,
});

const CATEGORIES = [
  "Garbage Accumulation",
  "Damaged Streetlight",
  "Road Damage",
  "Flooding / Drainage",
  "Water Supply Problem",
  "Noise Disturbance",
  "Stray Animals",
  "Peace and Order Concern",
  "Other",
];

const RoadS = ["Road 1", "Road 2", "Road 3", "Road 4", "Road 5", "Road 6"];

const PRIORITIES = [
  { value: "Low", hint: "Minor inconvenience, no danger to residents." },
  { value: "Medium", hint: "Affects daily activities and should be acted on soon." },
  { value: "High", hint: "Urgent — poses risk to safety, health, or property." },
];

const TIPS = [
  "Include the nearest landmark so the barangay team can find the exact spot.",
  "Mention when you first noticed the problem (e.g. “since Monday morning”).",
  "Attach a clear daytime photo whenever possible.",
  "Sample: “Uncollected garbage piling up beside the corner sari-sari store since Sept 18.”",
];

const STEPS = [
  { id: 1, label: "Problem Details", icon: AlertTriangle },
  { id: 2, label: "Location & Evidence", icon: MapPin },
  { id: 3, label: "Review", icon: ClipboardList },
  { id: 4, label: "E-Signature", icon: FileSignature },
];

const priorityStyles = {
  Low: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  High: "bg-destructive/10 text-destructive border-destructive/30",
};

const today = () => new Date().toISOString().slice(0, 10);

function Stepper({ current, onJump, furthest }) {
  return (
    <Card className="mb-6">
      <ol className="grid gap-4 sm:grid-cols-4">
        {STEPS.map((step) => {
          const done = step.id < current;
          const active = step.id === current;
          const reachable = step.id <= furthest;
          const Icon = step.icon;
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(step.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-secondary bg-secondary/10"
                    : reachable
                      ? "border-border bg-card hover:bg-muted"
                      : "border-border bg-muted/30 opacity-60"
                } ${reachable ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-success text-primary-foreground"
                      : active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Step {step.id}
                  </span>
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {step.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-secondary transition-all"
          style={{ width: `${(current / STEPS.length) * 100}%` }}
        />
      </div>
    </Card>
  );
}

function SectionCard({ step, title, description, icon: Icon, children, action }) {
  return (
    <Card className="mb-6">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            {step ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step {step}
              </p>
            ) : null}
            <h2 className="truncate text-lg font-bold text-foreground">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const point = e.touches?.[0] ?? e;
    return {
      x: (point.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (point.clientY - rect.top) * (canvasRef.current.height / rect.height),
    };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = pos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    onChange(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={640}
        height={200}
        className="h-44 w-full touch-none rounded-xl border border-dashed border-border bg-muted/30"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Draw your signature above using your mouse or finger.
        </p>
        <Button type="button" variant="outline" onClick={clear}>
          <Eraser className="h-4 w-4" /> Clear Signature
        </Button>
      </div>
      {value ? (
        <div className="mt-3 rounded-xl border border-border bg-card p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Signature preview
          </p>
          <img src={value} alt="Resident signature preview" className="h-20 w-auto" />
        </div>
      ) : null}
    </div>
  );
}

const EMPTY = {
  type: "",
  title: "",
  description: "",
  observedOn: today(),
  priority: "Medium",
  houseNo: "",
  street: "",
  Road: "",
  landmark: "",
};

function ReportPage() {
  const { addReport, user } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [signature, setSignature] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [submitted, setSubmitted] = useState(null);

  const set = (k) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const fullLocation = useMemo(
    () =>
      [
        [form.houseNo, form.street].filter(Boolean).join(" "),
        form.Road,
        "Barangay 902, Zone 100, District 6, Maynila",
        form.landmark ? `Near ${form.landmark}` : "",
      ]
        .filter(Boolean)
        .join(", "),
    [form],
  );

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, photo: "Please choose an image file (JPG or PNG)." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Photo must be 5MB or smaller." }));
      return;
    }
    setErrors((prev) => ({ ...prev, photo: undefined }));
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoName("");
  };

  const validateStep1 = () => {
    const next = {};
    if (!form.type) next.type = "Please select a problem category.";
    if (form.title.trim().length < 5) next.title = "Give a short title (at least 5 characters).";
    if (form.description.trim().length < 20)
      next.description = "Describe the problem in at least 20 characters.";
    if (!form.observedOn) next.observedOn = "Please choose the date you observed the problem.";
    else if (form.observedOn > today()) next.observedOn = "The date cannot be in the future.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next = {};
    if (!form.street.trim()) next.street = "Please enter the street or area name.";
    if (!form.Road) next.Road = "Please select the Road.";
    if (!form.landmark.trim()) next.landmark = "Please enter the nearest landmark.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goTo = (target) => {
    setErrors({});
    setStep(target);
    setFurthest((f) => Math.max(f, target));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    goTo(step + 1);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validateStep1()) return goTo(1);
    if (!validateStep2()) return goTo(2);
    const next2 = {};
    if (!signature) next2.signature = "Your signature is required before submitting.";
    if (!confirmed) next2.confirmed = "Please confirm that your information is accurate.";
    setErrors(next2);
    if (Object.keys(next2).length) return;

    const report = addReport({
      ...form,
      location: fullLocation,
      photo,
      signature,
      confirmation: "Resident confirmed that all information provided is accurate.",
    });
    setSubmitted(report);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAll = () => {
    setForm({ ...EMPTY, observedOn: today() });
    setPhoto(null);
    setPhotoName("");
    setSignature(null);
    setConfirmed(false);
    setErrors({});
    setStep(1);
    setFurthest(1);
    setSubmitted(null);
  };

  if (submitted) {
    return (
      <div>
        <PageHeader
          icon={CheckCircle2}
          title="Report Submitted"
          subtitle="Thank you for helping improve Barangay 902, Zone 100, District 6, Maynila."
        />
        <Card className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-xl font-bold text-foreground">
            Your report was received successfully
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Barangay staff will review your report and update its status. Please keep your reference
            number for follow-up.
          </p>

          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-border bg-muted/30 p-5 text-left">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClipboardList className="h-4 w-4" /> Reference Number
              </span>
              <strong className="text-sm text-foreground">{submitted.id}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-border py-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> Date Submitted
              </span>
              <strong className="text-sm text-foreground">{submitted.date}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-border py-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" /> Report Title
              </span>
              <strong className="text-right text-sm text-foreground">{submitted.title}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 pt-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" /> Status
              </span>
              <StatusBadge status="Pending Review" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/my-reports">
              <Button>
                <ClipboardList className="h-4 w-4" /> Go to My Reports
              </Button>
            </Link>
            <Button variant="outline" onClick={resetAll}>
              <RefreshCw className="h-4 w-4" /> Submit Another Report
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        icon={AlertTriangle}
        title="Report a Barangay Problem"
        subtitle="Help improve our community by reporting problems in your area."
      />

      <Stepper current={step} furthest={furthest} onJump={goTo} />

      <form onSubmit={submit}>
        {step === 1 ? (
          <SectionCard
            step="1"
            icon={AlertTriangle}
            title="Problem Details"
            description="Tell us what the problem is, when you saw it, and how urgent it is."
          >
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Problem Category" error={errors.type}>
                  <Select value={form.type} onChange={set("type")}>
                    <option value="">Select a problem category</option>
                    {CATEGORIES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Date Observed" error={errors.observedOn}>
                  <Input
                    type="date"
                    max={today()}
                    value={form.observedOn}
                    onChange={set("observedOn")}
                  />
                </Field>
              </div>

              <Field label="Report Title" error={errors.title}>
                <Input
                  value={form.title}
                  onChange={set("title")}
                  maxLength={100}
                  placeholder="e.g. Uncollected garbage along Mabini Street corner"
                />
              </Field>

              <Field label="Detailed Description" error={errors.description}>
                <Textarea
                  value={form.description}
                  onChange={set("description")}
                  maxLength={1000}
                  placeholder="Describe what happened, when you noticed it, and how it affects the community."
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {form.description.length}/1000 characters
                </p>
              </Field>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-foreground">
                  Urgency Level
                </span>
                <div className="grid gap-3 sm:grid-cols-3">
                  {PRIORITIES.map((p) => (
                    <label
                      key={p.value}
                      className={`cursor-pointer rounded-xl border p-3 shadow-sm transition ${
                        form.priority === p.value
                          ? priorityStyles[p.value]
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <input
                          type="radio"
                          name="priority"
                          className="accent-primary"
                          value={p.value}
                          checked={form.priority === p.value}
                          onChange={set("priority")}
                        />
                        {p.value}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">{p.hint}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Info className="h-4 w-4 text-secondary" /> Helpful reporting tips
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {TIPS.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={next}>
                  Continue to Location <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SectionCard>
        ) : null}

        {step === 2 ? (
          <SectionCard
            step="2"
            icon={MapPin}
            title="Location and Evidence"
            description="Where exactly is the problem, and do you have a photo?"
          >
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="House / Building No. (optional)">
                  <Input value={form.houseNo} onChange={set("houseNo")} placeholder="e.g. 12-B" />
                </Field>
                <Field label="Street / Area" error={errors.street}>
                  <Input
                    value={form.street}
                    onChange={set("street")}
                    placeholder="e.g. Mabini Street"
                  />
                </Field>
                <Field label="Road" error={errors.Road}>
                  <Select value={form.Road} onChange={set("Road")}>
                    <option value="">Select Road</option>
                    {RoadS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Barangay / City">
                  <Input value="Barangay 902, Zone 100, District 6, Maynila" readOnly disabled />
                </Field>
              </div>

              <Field label="Nearest Landmark" error={errors.landmark}>
                <Input
                  value={form.landmark}
                  onChange={set("landmark")}
                  placeholder="e.g. beside the corner sari-sari store, across the covered court"
                />
              </Field>

              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Complete location
                </p>
                <p className="mt-1 text-sm text-foreground">{fullLocation}</p>
              </div>

              <Field label="Photo Evidence (optional)" error={errors.photo}>
                {photo ? (
                  <div className="space-y-3">
                    <div className="relative w-fit">
                      <img
                        src={photo}
                        alt="Report evidence preview"
                        className="h-44 w-auto rounded-xl border border-border object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-primary-foreground"
                        aria-label="Remove photo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{photoName}</p>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted">
                        <RefreshCw className="h-4 w-4" /> Replace Photo
                        <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
                      </label>
                      <Button type="button" variant="ghost" onClick={removePhoto}>
                        <Trash2 className="h-4 w-4" /> Remove Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-8 text-center">
                    <ImagePlus className="h-6 w-6 text-secondary" />
                    <span className="text-sm font-medium text-foreground">
                      Click to attach a photo
                    </span>
                    <span className="text-xs text-muted-foreground">
                      JPG or PNG up to 5MB — preview only, nothing is uploaded
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
                  </label>
                )}
              </Field>

              <div className="flex flex-wrap justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => goTo(1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="button" onClick={next}>
                  Review My Report <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SectionCard>
        ) : null}

        {step === 3 ? (
          <>
            <SectionCard
              step="3"
              icon={ClipboardList}
              title="Review Your Report"
              description="Please check every detail before signing."
              action={
                <Button type="button" variant="outline" onClick={() => goTo(1)}>
                  <PenLine className="h-4 w-4" /> Edit
                </Button>
              }
            >
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <SummaryRow label="Problem Category" value={form.type} />
                <SummaryRow label="Report Title" value={form.title} />
                <SummaryRow
                  label="Detailed Description"
                  value={<span className="whitespace-pre-line">{form.description}</span>}
                />
                <SummaryRow label="Date Observed" value={form.observedOn} />
                <SummaryRow
                  label="Urgency Level"
                  value={
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[form.priority]}`}
                    >
                      {form.priority}
                    </span>
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={MapPin}
              title="Location and Evidence"
              description="Where the barangay team should go."
              action={
                <Button type="button" variant="outline" onClick={() => goTo(2)}>
                  <PenLine className="h-4 w-4" /> Edit
                </Button>
              }
            >
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <SummaryRow label="House / Building No." value={form.houseNo} />
                <SummaryRow label="Street / Area" value={form.street} />
                <SummaryRow label="Road" value={form.Road} />
                <SummaryRow label="Nearest Landmark" value={form.landmark} />
                <SummaryRow label="Complete Location" value={fullLocation} />
                <SummaryRow
                  label="Photo Evidence"
                  value={
                    photo ? (
                      <img
                        src={photo}
                        alt="Attached evidence"
                        className="h-24 w-auto rounded-lg border border-border object-cover"
                      />
                    ) : (
                      "No photo attached"
                    )
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={UserRound}
              title="Resident Information"
              description="Taken from your resident profile."
              action={
                <Link to="/profile">
                  <Button type="button" variant="outline">
                    <PenLine className="h-4 w-4" /> Edit Profile
                  </Button>
                </Link>
              }
            >
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <SummaryRow label="Full Name" value={user?.fullName} />
                <SummaryRow label="Contact Number" value={user?.contact} />
                <SummaryRow label="Email Address" value={user?.email} />
                <SummaryRow label="Home Address" value={user?.address} />
                <SummaryRow label="Road" value={user?.Road} />
                <SummaryRow label="Account Status" value={<StatusBadge status={user?.status} />} />
              </div>

              <div className="mt-5 flex flex-wrap justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => goTo(2)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="button" onClick={next}>
                  Continue to E-Signature <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </SectionCard>
          </>
        ) : null}

        {step === 4 ? (
          <SectionCard
            step="4"
            icon={FileSignature}
            title="E-Signature and Declaration"
            description="Sign below and confirm your report before submitting."
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-foreground">Resident E-Signature</p>
                <p className="mb-3 text-xs text-muted-foreground">
                  This is the resident&apos;s own signature. It is not an official barangay
                  signature or approval.
                </p>
                <SignaturePad
                  value={signature}
                  onChange={(v) => {
                    setSignature(v);
                    setErrors((prev) => ({ ...prev, signature: undefined }));
                  }}
                />
                {errors.signature ? (
                  <p className="mt-1 text-xs text-destructive">{errors.signature}</p>
                ) : null}
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-primary"
                    checked={confirmed}
                    onChange={(e) => {
                      setConfirmed(e.target.checked);
                      setErrors((prev) => ({ ...prev, confirmed: undefined }));
                    }}
                  />
                  <span className="text-sm text-foreground">
                    I declare that all information and evidence provided in this report is true,
                    accurate, and reported in good faith.
                  </span>
                </label>
                {errors.confirmed ? (
                  <p className="mt-1 text-xs text-destructive">{errors.confirmed}</p>
                ) : null}
              </div>

              <p className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                Your report will be forwarded to the Barangay 902 office with the status “Pending
                Review”. You can track updates under My Reports.
              </p>

              <div className="flex flex-wrap justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => goTo(3)}>
                  <ArrowLeft className="h-4 w-4" /> Back to Review
                </Button>
                <Button type="submit" disabled={!signature || !confirmed}>
                  <Send className="h-4 w-4" /> Submit Report
                </Button>
              </div>
            </div>
          </SectionCard>
        ) : null}
      </form>
    </div>
  );
}

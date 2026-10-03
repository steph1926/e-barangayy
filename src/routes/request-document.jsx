import { useRef, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Send,
  Info,
  User as UserIcon,
  ClipboardCheck,
  PenLine,
  Eraser,
  Pencil,
  CheckCircle2,
  CalendarDays,
  Hash,
} from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import { calculateAge } from "@/lib/resident-age";
import BirthdayPicker, { formatBirthday } from "@/components/BirthdayPicker";
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

export const Route = createFileRoute("/request-document")({
  head: () => ({
    meta: [
      { title: "Request Documents — Barangay 902 Resident Portal" },
      {
        name: "description",
        content:
          "Choose a barangay document, provide the required information, sign, and submit your request online.",
      },
      { property: "og:title", content: "Request Documents — Barangay 902 Resident Portal" },
      {
        property: "og:description",
        content:
          "Request clearances, certificates, residency, and indigency from Barangay 902, Zone 100, Maynila.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequestDocument,
});

const DOC_INFO = {
  "Barangay Clearance": {
    description:
      "General clearance certifying that the resident has no derogatory record on file with Barangay 902, Zone 100, District 6, Maynila.",
    requirements: [
      "Valid government-issued ID",
      "Proof of residency (6 months)",
      "Community tax certificate (cedula)",
    ],
    processing: "2 working days",
    fee: "PHP 50.00",
  },
  "Barangay Certificate": {
    description:
      "Certifies a specific fact about the resident, such as good moral character or first-time job seeker status.",
    requirements: ["Valid government-issued ID", "Proof of residency"],
    processing: "1 working day",
    fee: "PHP 40.00",
  },
  "Certificate of Residency": {
    description:
      "Certifies that the applicant is a bona fide resident of Barangay 902, Zone 100, District 6, Maynila.",
    requirements: ["Valid government-issued ID", "Latest utility bill or lease contract"],
    processing: "1 working day",
    fee: "PHP 40.00",
  },
  "Certificate of Indigency": {
    description:
      "Issued to qualified low-income residents for medical, educational, burial, or legal assistance.",
    requirements: [
      "Valid government-issued ID",
      "Barangay social worker interview",
      "Proof of income or certification of no income",
    ],
    processing: "1 working day",
    fee: "Free of charge",
  },
};

const DOCS = Object.keys(DOC_INFO);

function SectionCard({ step, title, description, icon: Icon, children, action }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Step {step}
            </p>
            <h2 className="text-base font-bold text-foreground">{title}</h2>
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

function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e2a5a";
  }, []);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = pos(e);
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
    hasInk.current = true;
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (hasInk.current) onChange(canvasRef.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInk.current = false;
    onChange(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="h-40 w-full touch-none rounded-xl border border-dashed border-border bg-muted/40"
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
          Draw your signature inside the box using a mouse or your finger.
        </p>
        <Button type="button" variant="outline" onClick={clear}>
          <Eraser className="h-4 w-4" /> Clear Signature
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="max-w-md text-right text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}

function RequestDocument() {
  const { user, addRequest } = useApp();
  const [form, setForm] = useState({
    type: "",
    purpose: "",
    name: user.fullName,
    birthday: user.birthday ?? "",
    address: user.address,
    contact: user.contact,
  });
  const [editingResident, setEditingResident] = useState(false);
  const [signature, setSignature] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const info = DOC_INFO[form.type];
  const age = calculateAge(form.birthday);

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.type) next.type = "Please select a document type.";
    if (!form.purpose.trim()) next.purpose = "Please state the purpose.";
    if (!form.name.trim()) next.name = "Complete name is required.";
    if (!form.birthday) next.birthday = "Birthday is required.";
    if (!form.address.trim()) next.address = "Address is required.";
    if (!form.contact.trim()) next.contact = "Contact information is required.";
    if (!signature) next.signature = "Your digital signature is required.";
    if (!confirmed) next.confirmed = "Please confirm that your information is correct.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const created = addRequest({ ...form, age, signature });
    setSubmitted({ ...created, signature });
  };

  if (submitted) {
    return (
      <div>
        <PageHeader
          icon={CheckCircle2}
          title="Request Submitted"
          subtitle="Your document request has been received by Barangay 902, Zone 100, District 6, Maynila."
        />
        <Card className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-xl font-bold text-foreground">
            Thank you, {submitted.name.split(" ")[0]}!
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your request for <strong className="text-foreground">{submitted.type}</strong> is now
            being queued for evaluation by the barangay staff.
          </p>

          <div className="mx-auto mt-6 grid max-w-xl gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <Hash className="mx-auto h-4 w-4 text-secondary" />
              <p className="mt-2 text-xs text-muted-foreground">Request Number</p>
              <p className="text-sm font-bold text-foreground">{submitted.id}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <CalendarDays className="mx-auto h-4 w-4 text-secondary" />
              <p className="mt-2 text-xs text-muted-foreground">Date Submitted</p>
              <p className="text-sm font-bold text-foreground">{submitted.date}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <ClipboardCheck className="mx-auto h-4 w-4 text-secondary" />
              <p className="mt-2 text-xs text-muted-foreground">Status</p>
              <div className="mt-1">
                <StatusBadge status="Pending" />
              </div>
              <p className="mt-1 text-xs font-semibold text-foreground">Pending Review</p>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Please keep your request number. You will be notified once the document is ready for
            pickup at the Barangay Hall.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/my-requests">
              <Button>
                <ClipboardCheck className="h-4 w-4" /> Go to My Document Requests
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(null);
                setForm({
                  type: "",
                  purpose: "",
                  name: user.fullName,
                  birthday: user.birthday ?? "",
                  address: user.address,
                  contact: user.contact,
                });
                setSignature(null);
                setConfirmed(false);
                setErrors({});
              }}
            >
              <FileText className="h-4 w-4" /> Submit Another Request
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        icon={FileText}
        title="Request Barangay Documents"
        subtitle="Choose a document, provide the required information, and submit your request."
      />

      <form onSubmit={submit} className="space-y-5">
        <SectionCard
          step="1"
          icon={FileText}
          title="Document Information"
          description="Select the document you need and state its purpose."
        >
          <div className="space-y-5">
            <Field label="Document Type" error={errors.type}>
              <Select value={form.type} onChange={set("type")}>
                <option value="">Select a document</option>
                {DOCS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Purpose of Request" error={errors.purpose}>
              <Textarea
                value={form.purpose}
                onChange={set("purpose")}
                placeholder="e.g. Employment requirement, scholarship application, medical assistance"
              />
            </Field>

            {info ? (
              <div className="overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/5">
                <div className="flex flex-wrap items-center gap-2 border-b border-secondary/20 bg-secondary/10 px-4 py-3">
                  <Info className="h-4 w-4 text-secondary" />
                  <p className="text-sm font-bold text-foreground">{form.type}</p>
                  <span className="ml-auto rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning">
                    Sample information only
                  </span>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      About this document
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {info.description}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Requirements to bring
                      </p>
                      <ul className="mt-2 space-y-2">
                        {info.requirements.map((r, index) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                              {index + 1}
                            </span>
                            <span className="leading-6">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Processing details
                      </p>
                      <dl className="mt-2 divide-y divide-border">
                        <div className="flex items-center justify-between gap-3 py-2">
                          <dt className="text-sm text-muted-foreground">Processing time</dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {info.processing}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 py-2">
                          <dt className="text-sm text-muted-foreground">Fee</dt>
                          <dd className="text-sm font-semibold text-foreground">{info.fee}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 py-2">
                          <dt className="text-sm text-muted-foreground">Where to claim</dt>
                          <dd className="text-right text-sm font-semibold text-foreground">
                            Barangay Hall
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 py-2">
                          <dt className="text-sm text-muted-foreground">Validity</dt>
                          <dd className="text-right text-sm font-semibold text-foreground">
                            1 year from issuance
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                Select a document type to view its description, requirements, and processing
                information.
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          step="2"
          icon={UserIcon}
          title="Resident Information"
          description="Pre-filled from your profile. You may edit it for this request."
          action={
            <Button type="button" variant="outline" onClick={() => setEditingResident((v) => !v)}>
              <Pencil className="h-4 w-4" /> {editingResident ? "Done" : "Edit"}
            </Button>
          }
        >
          {editingResident ? (
            <div className="space-y-4">
              <Field label="Complete Name" error={errors.name}>
                <Input value={form.name} onChange={set("name")} />
              </Field>
              <Field label="Birthday / Date of Birth" error={errors.birthday}>
                <BirthdayPicker
                  value={form.birthday}
                  onChange={(value) => {
                    setForm((prev) => ({ ...prev, birthday: value }));
                    setErrors((prev) => ({ ...prev, birthday: undefined }));
                  }}
                  invalid={Boolean(errors.birthday)}
                />
              </Field>
              <Field label="Age (Auto-Calculated)">
                <Input
                  value={age === null ? "" : `${age} years old`}
                  readOnly
                  disabled
                  className="cursor-not-allowed"
                />
              </Field>
              <Field label="Address" error={errors.address}>
                <Input value={form.address} onChange={set("address")} />
              </Field>
              <Field label="Contact Information" error={errors.contact}>
                <Input value={form.contact} onChange={set("contact")} />
              </Field>
            </div>
          ) : (
            <dl className="divide-y divide-border">
              <SummaryRow label="Complete Name" value={form.name} />
              <SummaryRow label="Birthday / Date of Birth" value={formatBirthday(form.birthday)} />
              <SummaryRow label="Age" value={age === null ? "" : `${age} years old`} />
              <SummaryRow label="Address" value={form.address} />
              <SummaryRow label="Contact Information" value={form.contact} />
            </dl>
          )}
          {!editingResident &&
          (errors.name || errors.birthday || errors.address || errors.contact) ? (
            <p className="mt-2 text-xs text-destructive">
              Please complete your resident information.
            </p>
          ) : null}
        </SectionCard>

        <SectionCard
          step="3"
          icon={ClipboardCheck}
          title="Review and Confirmation"
          description="Check your details, sign, and confirm before submitting."
        >
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Request Summary
            </p>
            <dl className="mt-1 divide-y divide-border">
              <SummaryRow label="Document Type" value={form.type} />
              <SummaryRow label="Purpose of Request" value={form.purpose} />
              <SummaryRow label="Complete Name" value={form.name} />
              <SummaryRow label="Birthday / Date of Birth" value={formatBirthday(form.birthday)} />
              <SummaryRow label="Age" value={age === null ? "" : `${age} years old`} />
              <SummaryRow label="Address" value={form.address} />
              <SummaryRow label="Contact Information" value={form.contact} />
            </dl>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <PenLine className="h-4 w-4 text-secondary" />
              <p className="text-sm font-semibold text-foreground">Applicant Digital Signature</p>
            </div>
            <p className="mb-2 text-xs text-muted-foreground">
              Applicant Confirmation only — this is not an official barangay signature or approval.
            </p>
            <SignaturePad onChange={setSignature} />
            {errors.signature ? (
              <p className="mt-1 text-xs text-destructive">{errors.signature}</p>
            ) : null}

            {signature ? (
              <div className="mt-4 rounded-xl border border-border bg-card p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Signature Preview
                </p>
                <img
                  src={signature}
                  alt="Applicant signature preview"
                  className="mt-2 h-24 object-contain"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {form.name} — Applicant Confirmation
                </p>
              </div>
            ) : null}
          </div>

          <label className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[oklch(0.45_0.14_255)]"
            />
            <span className="text-sm text-foreground">
              I confirm that the information I provided is correct.
            </span>
          </label>
          {errors.confirmed ? (
            <p className="mt-1 text-xs text-destructive">{errors.confirmed}</p>
          ) : null}

          <Button
            type="submit"
            className="mt-5 w-full sm:w-auto"
            disabled={!signature || !confirmed}
          >
            <Send className="h-4 w-4" /> Submit Request
          </Button>
        </SectionCard>
      </form>
    </div>
  );
}

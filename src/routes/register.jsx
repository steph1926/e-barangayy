import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  UserPlus,
  ArrowLeft,
  ArrowRight,
  Lock,
  Info,
  Check,
  User,
  MapPin,
  IdCard,
} from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import logo from "@/assets/barangay-logo.png";
import { calculateAge, isFutureDate } from "@/lib/resident-age";
import BirthdayPicker, { formatBirthday } from "@/components/BirthdayPicker";
import { Button, Card, Field, Input, Select } from "@/components/ui-kit";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Resident Registration — E-Barangay 902" },
      {
        name: "description",
        content:
          "Register as a resident of Barangay 902, Zone 100, District 6, Maynila to access online barangay services.",
      },
      { property: "og:title", content: "Resident Registration — E-Barangay 902" },
      {
        property: "og:description",
        content:
          "Create your resident account for Barangay 902 online document requests and reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Register,
});

const RoadS = [
  "Road 1",
  "Road 2",
  "Road 3",
  "Road 4",
  "Road 5",
  "J. Posadas",
  "Mount Mayon",
];
const ID_TYPES = [
  "Philippine National ID (PhilSys)",
  "Driver's License",
  "Passport",
  "UMID / SSS ID",
  "PhilHealth ID",
  "Voter's ID",
  "Postal ID",
  "Senior Citizen ID",
  "Student ID",
];

const EMPTY = {
  fullName: "",
  birthday: "",
  sex: "",
  contact: "",
  email: "",
  address: "",
  Road: "",
  landmark: "",
  idType: "",
  idNumber: "",
  password: "",
  confirmPassword: "",
};

const STEPS = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "Valid ID", icon: IdCard },
  { id: 4, label: "Account", icon: Lock },
];

function Stepper({ current }) {
  return (
    <ol className="mb-6 flex items-center gap-2 sm:gap-3">
      {STEPS.map((step, index) => {
        const done = current > step.id;
        const active = current === step.id;
        const Icon = step.icon;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition ${
                  done
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : active
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <span
                className={`truncate text-[11px] font-semibold sm:text-xs ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <span
                className={`h-0.5 flex-1 rounded-full ${done ? "bg-secondary" : "bg-border"}`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const age = calculateAge(form.birthday);

  const validateStep = (target) => {
    const next = {};
    if (target === 1) {
      if (!form.fullName.trim()) next.fullName = "Full name is required.";
      if (!form.birthday) next.birthday = "Birthday is required.";
      else if (isFutureDate(form.birthday)) next.birthday = "Birthday cannot be a future date.";
      else if (age === null || age > 120) next.birthday = "Please select a valid date of birth.";
      if (!form.sex) next.sex = "Please select your sex.";
      if (!/^[0-9+\s()-]{7,}$/.test(form.contact.trim()))
        next.contact = "Enter a valid contact number.";
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    }
    if (target === 2) {
      if (!form.address.trim()) next.address = "Complete address is required.";
      if (!form.Road) next.Road = "Please select your Road or sitio.";
    }
    if (target === 3) {
      if (!form.idType) next.idType = "Please select a valid ID type.";
      if (!form.idNumber.trim()) next.idNumber = "Valid ID number is required.";
    }
    if (target === 4) {
      if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    }
    return next;
  };

  const goNext = () => {
    const next = validateStep(step);
    setErrors(next);
    if (Object.keys(next).length) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (e) => {
    e.preventDefault();
    if (step < STEPS.length) {
      goNext();
      return;
    }

    const next = { ...validateStep(1), ...validateStep(2), ...validateStep(3), ...validateStep(4) };
    setErrors(next);
    if (Object.keys(next).length) {
      if (validateStep(1) && Object.keys(validateStep(1)).length) setStep(1);
      else if (Object.keys(validateStep(2)).length) setStep(2);
      else if (Object.keys(validateStep(3)).length) setStep(3);
      return;
    }

    const result = register({
      fullName: form.fullName.trim(),
      birthday: form.birthday,
      sex: form.sex,
      contact: form.contact.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      Road: form.Road,
      landmark: form.landmark.trim(),
      validId: `${form.idType} — ${form.idNumber.trim()}`,
      password: form.password,
    });

    if (!result?.ok) {
      setErrors({ email: result?.error ?? "Registration failed. Please try again." });
      setStep(1);
      return;
    }
    // Prototype: new accounts stay pending until an admin verifies them.
    navigate({ to: "/", search: { registered: "1" } });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-primary">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img src={logo} alt="Barangay 902 logo" className="h-8 w-8 object-contain" />
          </span>
          <div>
            <p className="text-base font-bold text-primary-foreground">E-Barangay 902</p>
            <p className="text-xs text-primary-foreground/70">Zone 100 · District 6 · Maynila</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="mt-5 mb-6 flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <UserPlus className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Resident Registration
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill out your resident profile step by step — Step {step} of {STEPS.length}.
            </p>
          </div>
        </div>

        <Stepper current={step} />

        <form onSubmit={submit} className="space-y-5">
          {step === 1 ? (
            <Card className="p-5 sm:p-6">
              <h2 className="text-base font-bold text-foreground">Step 1 · Personal Information</h2>
              <p className="mt-0.5 mb-5 text-sm text-muted-foreground">
                Your age is computed automatically from your birthday.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full Name" error={errors.fullName}>
                    <Input
                      value={form.fullName}
                      onChange={set("fullName")}
                      placeholder="Stephanie Alvaran"
                    />
                  </Field>
                </div>

                <Field label="Birthday / Date of Birth (Required)" error={errors.birthday}>
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
                    placeholder="Select your birthday first"
                    className="cursor-not-allowed"
                  />
                </Field>

                <Field label="Sex" error={errors.sex}>
                  <Select value={form.sex} onChange={set("sex")}>
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </Field>

                <Field label="Contact Number" error={errors.contact}>
                  <Input
                    value={form.contact}
                    onChange={set("contact")}
                    placeholder="0917 555 0142"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Email Address" error={errors.email}>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="resident@email.com"
                    />
                  </Field>
                </div>
              </div>
            </Card>
          ) : null}

          {step === 2 ? (
            <Card className="p-5 sm:p-6">
              <h2 className="text-base font-bold text-foreground">
                Step 2 · Address in Barangay 902
              </h2>
              <p className="mt-0.5 mb-5 text-sm text-muted-foreground">
                Where you currently reside within the barangay.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Complete Address" error={errors.address}>
                    <Input
                      value={form.address}
                      onChange={set("address")}
                      placeholder="House No., Street, Barangay 902, Zone 100, Maynila"
                    />
                  </Field>
                </div>

                <Field label="Road / Sitio" error={errors.Road}>
                  <Select value={form.Road} onChange={set("Road")}>
                    <option value="">Select a Road or street</option>
                    {RoadS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Nearest Landmark (Optional)">
                  <Input
                    value={form.landmark}
                    onChange={set("landmark")}
                    placeholder="e.g. near Barangay Hall"
                  />
                </Field>
              </div>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card className="p-5 sm:p-6">
              <h2 className="text-base font-bold text-foreground">Step 3 · Valid ID</h2>
              <p className="mt-0.5 mb-5 text-sm text-muted-foreground">
                Used by the barangay office to verify your identity.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Valid ID Type" error={errors.idType}>
                  <Select value={form.idType} onChange={set("idType")}>
                    <option value="">Select a valid ID</option>
                    {ID_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Valid ID Number" error={errors.idNumber}>
                  <Input
                    value={form.idNumber}
                    onChange={set("idNumber")}
                    placeholder="e.g. 1234-5678-9012"
                  />
                </Field>
              </div>
            </Card>
          ) : null}

          {step === 4 ? (
            <>
              <Card className="p-5 sm:p-6">
                <h2 className="text-base font-bold text-foreground">
                  Review your resident profile
                </h2>
                <p className="mt-0.5 mb-4 text-sm text-muted-foreground">
                  Check your details before creating your account.
                </p>
                <div className="rounded-xl border border-border bg-muted/30 px-4 py-2">
                  <SummaryRow label="Full Name" value={form.fullName} />
                  <SummaryRow label="Birthday" value={formatBirthday(form.birthday)} />
                  <SummaryRow label="Age" value={age === null ? "" : `${age} years old`} />
                  <SummaryRow label="Sex" value={form.sex} />
                  <SummaryRow label="Contact Number" value={form.contact} />
                  <SummaryRow label="Email Address" value={form.email} />
                  <SummaryRow label="Complete Address" value={form.address} />
                  <SummaryRow label="Road / Sitio" value={form.Road} />
                  <SummaryRow label="Nearest Landmark" value={form.landmark} />
                  <SummaryRow
                    label="Valid ID"
                    value={form.idType && form.idNumber ? `${form.idType} — ${form.idNumber}` : ""}
                  />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-foreground">
                  <Lock className="h-4 w-4 text-secondary" /> Step 4 · Account Password
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Password" error={errors.password}>
                    <Input
                      type="password"
                      value={form.password}
                      onChange={set("password")}
                      placeholder="At least 8 characters"
                    />
                  </Field>
                  <Field label="Confirm Password" error={errors.confirmPassword}>
                    <Input
                      type="password"
                      value={form.confirmPassword}
                      onChange={set("confirmPassword")}
                      placeholder="Re-type your password"
                    />
                  </Field>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-secondary/30 bg-secondary/5 p-3.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <p className="text-sm text-muted-foreground">
                    Prototype registration only. Your account will be created with a "Pending
                    Verification" status and can only sign in after the barangay office approves it.
                  </p>
                </div>
              </Card>
            </>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            ) : null}

            {step < STEPS.length ? (
              <Button type="button" onClick={goNext} className="w-full sm:w-auto">
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4" /> Create Resident Account
              </Button>
            )}

            <Link to="/" className="text-sm font-semibold text-secondary hover:opacity-80">
              Already registered? Sign in
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

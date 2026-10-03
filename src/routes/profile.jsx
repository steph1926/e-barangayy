import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { User, Pencil, Save, X } from "lucide-react";
import { useApp } from "@/lib/barangay-store";
import { calculateAge, isFutureDate } from "@/lib/resident-age";
import BirthdayPicker, { formatBirthday } from "@/components/BirthdayPicker";
import { Button, Card, Field, Input, PageHeader, Select, SuccessAlert } from "@/components/ui-kit";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — E-Barangay 902" },
      { name: "description", content: "View and update your resident profile information." },
      { property: "og:title", content: "My Profile — E-Barangay 902" },
      { property: "og:description", content: "View and update your resident profile information." },
    ],
  }),
  component: Profile,
});

const roadS = [
  "Road 1",
  "Road 2",
  "Road 3",
  "Road 4",
  "Road 5",
  "J. Posadas",
  "Mount Mayon",
];

function Profile() {
  const { user, updateProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(user);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const viewAge = calculateAge(user.birthday);
  const formAge = calculateAge(form.birthday);

  const save = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName?.trim()) next.fullName = "Full name is required.";
    if (!form.birthday) next.birthday = "Birthday is required.";
    else if (isFutureDate(form.birthday)) next.birthday = "Birthday cannot be a future date.";
    else if (formAge === null || formAge > 120)
      next.birthday = "Please select a valid date of birth.";
    if (!form.address?.trim()) next.address = "Address is required.";
    if (!form.contact?.trim()) next.contact = "Contact number is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email ?? "")) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) return;
    updateProfile(form);
    setEditing(false);
    setSaved(true);
  };

  const rows = [
    ["Full Name", user.fullName],
    ["Birthday / Date of Birth", formatBirthday(user.birthday) || "—"],
    ["Age", viewAge === null ? "—" : `${viewAge} years old`],
    ["Sex", user.sex || "—"],
    ["Contact Number", user.contact],
    ["Email Address", user.email],
    ["Complete Address", user.address],
    ["road / Sitio", user.road || "—"],
    ["Valid ID", user.validId || "—"],
  ];

  return (
    <div>
      <PageHeader
        icon={User}
        title="Resident Profile"
        subtitle="Your registered barangay information."
      />

      {saved ? (
        <SuccessAlert title="Profile updated successfully!">
          Your information has been saved.
        </SuccessAlert>
      ) : null}

      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {user.fullName.charAt(0)}
          </span>
          <div>
            <p className="text-lg font-bold text-foreground">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">
              Registered Resident{viewAge === null ? "" : ` · ${viewAge} years old`}
            </p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Full Name" error={errors.fullName}>
                <Input value={form.fullName ?? ""} onChange={set("fullName")} />
              </Field>
            </div>

            <Field label="Birthday / Date of Birth" error={errors.birthday}>
              <BirthdayPicker
                value={form.birthday ?? ""}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, birthday: value }));
                  setErrors((prev) => ({ ...prev, birthday: undefined }));
                }}
                invalid={Boolean(errors.birthday)}
              />
            </Field>

            <Field label="Age (Auto-Calculated)">
              <Input
                value={formAge === null ? "" : `${formAge} years old`}
                readOnly
                disabled
                placeholder="Select your birthday first"
                className="cursor-not-allowed"
              />
            </Field>

            <Field label="Sex">
              <Select value={form.sex ?? ""} onChange={set("sex")}>
                <option value="">Select sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </Field>

            <Field label="Contact Number" error={errors.contact}>
              <Input value={form.contact ?? ""} onChange={set("contact")} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Email Address" error={errors.email}>
                <Input value={form.email ?? ""} onChange={set("email")} />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Complete Address" error={errors.address}>
                <Input value={form.address ?? ""} onChange={set("address")} />
              </Field>
            </div>

            <Field label="road / Sitio">
              <Select value={form.road ?? ""} onChange={set("road")}>
                <option value="">Select a road or street</option>
                {roadS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Valid ID">
              <Input
                value={form.validId ?? ""}
                onChange={set("validId")}
                placeholder="ID type and number"
              />
            </Field>

            <div className="flex gap-3 sm:col-span-2">
              <Button type="submit">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(user);
                  setErrors({});
                  setEditing(false);
                }}
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <dl className="divide-y divide-border">
              {rows.map(([label, value]) => (
                <div key={label} className="flex flex-wrap justify-between gap-2 py-3">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <Button
              className="mt-5"
              onClick={() => {
                setForm(user);
                setSaved(false);
                setEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" /> Edit Profile
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

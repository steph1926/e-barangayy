import { useMemo, useState } from "react";
import logo from "@/assets/barangay-logo.png";
import {
  Check,
  ArrowRight,
  CircleX,
  PackageCheck,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Pencil,
  Printer,
  Search,
  ShieldCheck,
} from "lucide-react";
import { feeFor, peso, useAdmin } from "@/lib/admin-store";
import { PickupEmailPreview } from "@/components/PickupEmailPreview";
import { Mail, FileSignature, Maximize2, Wallet, History } from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  SearchField,
  StatusBadge,
  StatusFilterNotice,
  TableShell,
  td,
  th,
} from "@/components/AdminUI";
import { useStatusFilter } from "@/lib/use-status-filter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const templates = [
  "Barangay Certificate",
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Other Barangay Documents",
];
function isTemplate(value) {
  return templates.some((template) => template === value);
}
function fromRequest(request) {
  return {
    name: String(request.resident ?? request.name ?? ""),
    birthday: String(request.birthday ?? ""),
    age: String(request.age ?? ""),
    address: String(request.address ?? ""),
    purpose: String(request.purpose ?? ""),
    contact: String(request.contact ?? ""),
    email: String(request.email ?? ""),
    type: isTemplate(String(request.type)) ? String(request.type) : "Other Barangay Documents",
  };
}
const FLOW = ["Pending", "Under Review", "Approved", "Ready for Pickup", "Payment", "Released"];
function StatusFlow({ status, paid }) {
  const index =
    status === "Ready for Pickup" && paid
      ? FLOW.indexOf("Released") - 1 + 0.5
      : FLOW.findIndex((step) => step === status);
  return (
    <ol className="flex flex-wrap items-center gap-1.5 text-xs">
      {FLOW.map((step, i) => (
        <li key={step} className="flex items-center gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 font-semibold ${status === "Rejected" ? "bg-muted text-muted-foreground" : i < index ? "bg-success/15 text-success" : i === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {step}
          </span>
          {i < FLOW.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
        </li>
      ))}
      {status === "Rejected" && (
        <li>
          <StatusBadge status="Rejected" />
        </li>
      )}
    </ol>
  );
}
function Info({ label, value, wide }) {
  return (
    <div className={`min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value || "Not supplied"}</p>
    </div>
  );
}
function Value({ children }) {
  return <span className="document-paper__fill">{children}</span>;
}
function DocumentPaper({ draft, reference, date }) {
  const { name, address, age, purpose, type, birthday } = draft;
  const resident = name || "____________________";
  const home = address || "____________________";
  const reason = purpose || "____________________";
  const statements = {
    "Barangay Certificate": (
      <>
        This is to certify that <Value>{resident}</Value>, of legal age, is a bona fide resident of{" "}
        <Value>{home}</Value>, Barangay 902, Zone 100, District 6, City of Manila.
      </>
    ),
    "Barangay Clearance": (
      <>
        This is to certify that <Value>{resident}</Value>, a bona fide resident of{" "}
        <Value>{home}</Value>, Barangay 902, Zone 100, District 6, City of Manila, has no derogatory
        record on file with this barangay as of the date of issuance.
      </>
    ),
    "Certificate of Residency": (
      <>
        This is to certify that <Value>{resident}</Value> is a bona fide resident of{" "}
        <Value>{home}</Value>, Barangay 902, Zone 100, District 6, City of Manila, and has been
        residing thereat up to the present.
      </>
    ),
    "Certificate of Indigency": (
      <>
        This is to certify that <Value>{resident}</Value>, a bona fide resident of{" "}
        <Value>{home}</Value>, Barangay 902, Zone 100, District 6, City of Manila, belongs to the
        indigent families of this barangay based on the records on file.
      </>
    ),
    "Other Barangay Documents": (
      <>
        This is to certify that <Value>{resident}</Value>, a bona fide resident of{" "}
        <Value>{home}</Value>, Barangay 902, Zone 100, District 6, City of Manila, has requested a
        barangay document from this office.
      </>
    ),
  };
  return (
    <article id="printable-document" className="document-paper" aria-label="Document Preview">
      <header className="document-paper__header">
        <div className="document-paper__seal">
          <img src={logo} alt="Barangay 902 seal" width={40} height={40} style={{ objectFit: "contain" }} />
        </div>
        <div className="document-paper__org">
          <p>Republic of the Philippines</p>
          <p>OFFICE OF THE BARANGAY COUNCIL</p>
          <strong>BARANGAY 902</strong>
          <small>Zone 100, District 6, City of Manila</small>
          <small>Tel. Nos.: [barangay contact number]</small>
        </div>
        <div className="document-paper__seal">
          <ShieldCheck size={26} aria-hidden="true" />
        </div>
      </header>

      <h2 className="document-paper__title">{type}</h2>
      <p className="document-paper__caption">SAMPLE DOCUMENT · NOT VALID FOR OFFICIAL USE</p>

      <p className="document-paper__salutation">TO WHOM IT MAY CONCERN:</p>

      <section className="document-paper__section">
        <p className="document-paper__label">Applicant Details</p>
        <dl className="document-paper__details">
          <div>
            <dt>Name</dt>
            <dd>{resident}</dd>
          </div>
          <div>
            <dt>Date of Birth</dt>
            <dd>{birthday || "—"}</dd>
          </div>
          <div>
            <dt>Age</dt>
            <dd>{age ? `${age} years old` : "—"}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{home}</dd>
          </div>
        </dl>
      </section>

      <section className="document-paper__section">
        <p className="document-paper__label">Certification</p>
        <p className="document-paper__body">{statements[type]}</p>
        <p className="document-paper__body">
          The undersigned has certified that after a reasonable inquiry, the residency of the
          above-named applicant in this barangay has been verified against the records on file.
        </p>
        <p className="document-paper__body">
          This certification is issued upon the request of the above-named person as a supporting
          document for <Value>{reason}</Value>.
        </p>
        <p className="document-paper__body">
          Issued this <Value>{date}</Value> at the Barangay 902 Multi-Purpose Hall, Zone 100,
          District 6, City of Manila.
        </p>
      </section>

      <div className="document-paper__signatures">
        <div className="document-paper__sign">
          <span />
          Applicant&rsquo;s Signature
        </div>
        <div className="document-paper__sign">
          <span />
          [Punong Barangay]<small>Punong Barangay, Barangay 902</small>
        </div>
      </div>

      <section className="document-paper__section">
        <p className="document-paper__label">Issuance Record</p>
        <dl className="document-paper__meta">
          <div>
            <dt>Issued at</dt>
            <dd>Barangay 902 Hall</dd>
          </div>
          <div>
            <dt>Issued on</dt>
            <dd>{date}</dd>
          </div>
          <div>
            <dt>Valid until</dt>
            <dd>One (1) year from date of issuance</dd>
          </div>
          <div>
            <dt>Prepared by</dt>
            <dd>Barangay Records Staff</dd>
          </div>
          <div>
            <dt>Reference No.</dt>
            <dd>{reference}</dd>
          </div>
          <div>
            <dt>Document type</dt>
            <dd>{type}</dd>
          </div>
        </dl>
      </section>

      <ul className="document-paper__notes">
        <li>
          This document is not valid without the official barangay dry seal and the signature of the
          Punong Barangay.
        </li>
        <li>
          Applicants who submit false information may be held liable under applicable barangay and
          national regulations.
        </li>
        <li>Sample template only · Awaiting the official Barangay 902 format.</li>
      </ul>
    </article>
  );
}
function printPaper() {
  const paper = document.getElementById("printable-document");
  if (!paper) return;
  const popup = window.open("", "_blank");
  if (!popup) return;
  const sheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((link) => `<link rel="stylesheet" href="${link.href}">`)
    .join("");
  popup.document.write(
    `<!doctype html><html><head><title>Barangay 902 · Document Preview</title>${sheets}<style>body{margin:0;background:white!important}@page{size:A4;margin:0} .document-paper{box-shadow:none!important;border:none!important;min-height:297mm!important;width:210mm!important;max-width:none!important;margin:0!important;padding:22mm!important;box-sizing:border-box!important}</style></head><body>${paper.outerHTML}</body></html>`,
  );
  popup.document.close();
  popup.onload = () => {
    popup.focus();
    popup.print();
  };
}
export function DocumentRequestsWorkspace() {
  const {
    documents,
    updateDocument,
    transactions,
    notifications,
    simulateEmail,
    recordPayment,
    timelines,
  } = useAdmin();
  const [sigZoom, setSigZoom] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const statusFilter = useStatusFilter();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [generated, setGenerated] = useState({});
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState("none");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [remarkDraft, setRemarkDraft] = useState("");
  const selected = documents.find((item) => item.id === selectedId);
  const payment = transactions.find((t) => t.requestId === selectedId)?.payment;
  const paymentCleared = payment?.status === "Paid" || payment?.status === "No Fee";
  const latestNotice = notifications.find((n) => n.requestId === selectedId);
  const draft = selected ? (drafts[selected.id] ?? fromRequest(selected)) : null;
  const prepared = selected ? generated[selected.id] : undefined;
  const filtered = useMemo(
    () =>
      documents.filter(
        (item) =>
          (!statusFilter || String(item.status) === statusFilter) &&
          Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [documents, query, statusFilter],
  );
  function change(field, value) {
    if (!selected || !draft) return;
    setDrafts((current) => ({ ...current, [selected.id]: { ...draft, [field]: value } }));
    setGenerated((current) => {
      const next = { ...current };
      delete next[selected.id];
      return next;
    });
    setNotice("");
  }
  function open(request) {
    setSelectedId(request.id);
    setEditing(false);
    setNotice("");
    setMode("none");
    setReason("");
    setReasonError("");
    setRemarkDraft(String(request.remarks ?? ""));
  }
  function setStatus(status, message, remarks) {
    if (!selected) return;
    updateDocument(selected.id, remarks === undefined ? { status } : { status, remarks });
    if (remarks !== undefined) setRemarkDraft(remarks);
    setMode("none");
    setNotice(message);
  }
  function confirmReject() {
    if (!reason.trim()) {
      setReasonError("A rejection reason is required.");
      return;
    }
    setStatus(
      "Rejected",
      "Request rejected. The reason was saved to admin remarks.",
      `Rejected: ${reason.trim()}`,
    );
    setReason("");
    setReasonError("");
  }
  function generate() {
    if (!selected || !draft) return;
    if (selected.status !== "Approved") {
      setNotice("Approve the request before generating the document.");
      return;
    }
    if (!draft.name.trim() || !draft.address.trim() || !draft.purpose.trim()) {
      setNotice("Complete the resident name, address, and purpose before generating.");
      setEditing(true);
      return;
    }
    setGenerated((current) => ({
      ...current,
      [selected.id]: {
        draft: { ...draft },
        reference: selected.id,
        date: new Intl.DateTimeFormat("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date()),
      },
    }));
    setEditing(false);
    setNotice("Sample document generated. Review it before printing or marking it ready.");
  }
  const fields = [
    { key: "name", label: "Full name" },
    { key: "birthday", label: "Date of birth" },
    { key: "age", label: "Age" },
    { key: "address", label: "Home address" },
    { key: "contact", label: "Contact number" },
    { key: "email", label: "Email address" },
    { key: "purpose", label: "Purpose of request" },
  ];
  return (
    <div>
      <AdminPageHeader
        eyebrow="Operations"
        title="Document Requests"
        description="Review resident submissions and prepare sample barangay documents for pickup."
      />
      <StatusFilterNotice status={statusFilter} to="/admin/document-requests" />
      <AdminCard>
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <SearchField value={query} onChange={setQuery} placeholder="Search document requests" />
          <p className="text-xs font-semibold text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "request" : "requests"} shown
          </p>
        </div>
        <TableShell>
          <thead>
            <tr>
              <th className={th}>Reference</th>
              <th className={th}>Resident</th>
              <th className={th}>Document / Purpose</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-muted/60">
                <td className={`${td} whitespace-nowrap font-semibold text-primary`}>
                  {item.id}
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {item.date}
                  </span>
                </td>
                <td className={td}>
                  {item.resident}
                  <span className="mt-1 block text-xs text-muted-foreground">{item.address}</span>
                </td>
                <td className={td}>
                  {item.type}
                  <span className="mt-1 block text-xs text-muted-foreground">{item.purpose}</span>
                </td>
                <td className={td}>
                  <StatusBadge status={item.status} />
                </td>
                <td className={`${td} text-right`}>
                  <Button size="sm" variant="outline" onClick={() => open(item)}>
                    <Eye className="h-4 w-4" />
                    Open request
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        {filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <Search className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">No matching requests</p>
          </div>
        )}
      </AdminCard>
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(value) => {
          if (!value) setSelectedId(null);
        }}
      >
        {selected && draft && (
          <DialogContent className="max-h-[94vh] w-[calc(100vw-1rem)] max-w-[1200px] gap-0 overflow-y-auto p-0">
            <DialogHeader className="border-b border-border px-5 py-5 pr-14 sm:px-7">
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="text-xl text-primary">{selected.id}</DialogTitle>
                <StatusBadge status={selected.status} />
              </div>
              <DialogDescription>
                Submitted {selected.date} by {selected.resident}. Sample templates only; official
                formats will be added when provided.
              </DialogDescription>
            </DialogHeader>
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="min-w-0 space-y-6 border-b border-border p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <section className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-bold text-primary">Request Information</h3>
                  </div>
                  <Info label="Reference no." value={selected.id} />
                  <Info label="Date requested" value={selected.date} />
                  <Info label="Document status" value={<StatusBadge status={selected.status} />} />
                  <Info
                    label="Last updated"
                    value={
                      selected.updatedAt ??
                      timelines[selected.id]?.[timelines[selected.id].length - 1]?.at
                    }
                  />
                </section>
                <section className="border-t border-border pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-primary">Resident Information</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Resident-provided details for this request
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing((current) => !current)}
                    >
                      <Pencil className="h-4 w-4" />
                      {editing ? "Done editing" : "Edit Details"}
                    </Button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Resident ID
                      </p>
                      <p className="mt-1 text-sm">{selected.residentId ?? "Not supplied"}</p>
                    </div>
                    {fields.map(({ key, label }) => (
                      <div
                        key={key}
                        className={`min-w-0 ${key === "address" || key === "purpose" ? "sm:col-span-2" : ""}`}
                      >
                        <label
                          htmlFor={`doc-${key}`}
                          className="text-xs font-semibold uppercase text-muted-foreground"
                        >
                          {label}
                        </label>
                        {editing ? (
                          <Input
                            id={`doc-${key}`}
                            value={draft[key]}
                            onChange={(event) => change(key, event.target.value)}
                            className="mt-1 bg-card"
                          />
                        ) : (
                          <p className="mt-1 break-words text-sm font-medium">
                            {draft[key] || "Not supplied"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
                <section className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-bold text-primary">Document Information</h3>
                  </div>
                  <Info label="Document type" value={selected.type} />
                  <Info label="Fee" value={peso(feeFor(selected.type))} />
                  <Info label="Purpose" value={selected.purpose} wide />
                </section>
                <section className="border-t border-border pt-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                    <FileSignature className="h-4 w-4" />
                    Applicant Signature and Confirmation
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      {selected.signature ? (
                        <button
                          type="button"
                          onClick={() => setSigZoom(true)}
                          className="group relative block w-full rounded-md border border-border bg-background p-3 hover:border-gold-muted"
                          aria-label="Enlarge applicant signature"
                        >
                          <img
                            src={String(selected.signature)}
                            alt={`Signature of ${selected.resident}`}
                            className="mx-auto h-28 object-contain"
                          />
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-card px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                            <Maximize2 className="h-3 w-3" />
                            Enlarge
                          </span>
                          <span className="mt-1 block border-t border-dashed border-input pt-1 text-center text-xs text-muted-foreground">
                            Signed by {selected.resident}
                          </span>
                        </button>
                      ) : (
                        <div className="flex min-h-24 flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 px-4 text-center">
                          <FileSignature className="h-6 w-6 text-muted-foreground" />
                          <p className="mt-1 text-sm font-semibold">Signature not provided</p>
                          <p className="text-xs text-muted-foreground">
                            No signature was captured with this request.
                          </p>
                        </div>
                      )}
                    </div>
                    <Info
                      label="Confirmation checkbox"
                      value={
                        <span
                          className={`inline-flex items-center gap-1.5 ${selected.confirmed || selected.confirmation ? "text-success" : "text-muted-foreground"}`}
                        >
                          {selected.confirmed || selected.confirmation ? (
                            <>
                              <ShieldCheck className="h-4 w-4" />
                              Checked
                            </>
                          ) : (
                            <>
                              <CircleX className="h-4 w-4" />
                              Not checked
                            </>
                          )}
                        </span>
                      }
                    />
                    <Info
                      label="Submitted"
                      value={
                        selected.reportedAt ?? timelines[selected.id]?.[0]?.at ?? selected.date
                      }
                    />
                    {selected.confirmation && (
                      <Info label="Confirmation record" value={selected.confirmation} wide />
                    )}
                  </div>
                </section>
                <section className="border-t border-border pt-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                    <Wallet className="h-4 w-4" />
                    Payment Information
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Payment status is tracked separately from document status.
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Info label="Amount due" value={peso(feeFor(selected.type))} />
                    <Info
                      label="Payment status"
                      value={<StatusBadge status={payment?.status ?? "Unpaid"} />}
                    />
                    <Info label="Transaction no." value={payment?.txn} />
                    <Info label="Official receipt" value={payment?.receipt ?? "—"} />
                    <Info label="Method" value={payment?.method ?? "—"} />
                    <Info label="Paid on" value={payment?.date ?? "—"} />
                  </div>
                  {payment?.status === "Unpaid" &&
                    selected.status !== "Ready for Pickup" &&
                    selected.status !== "Rejected" &&
                    selected.status !== "Released" && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Payment is collected after the resident is notified that the document is
                        Ready for Pickup.
                      </p>
                    )}
                  {payment?.status === "Unpaid" && selected.status === "Ready for Pickup" && (
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        recordPayment(selected.id, "Paid");
                        setNotice("Payment confirmed and official receipt recorded.");
                      }}
                    >
                      <Wallet className="h-4 w-4" />
                      Confirm Payment
                    </Button>
                  )}
                </section>
                <section className="border-t border-border pt-5">
                  <label htmlFor="document-template" className="text-sm font-bold text-primary">
                    Document template
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose a type to update the sample preview.
                  </p>
                  <Select value={draft.type} onValueChange={(value) => change("type", value)}>
                    <SelectTrigger id="document-template" className="mt-3 h-11 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </section>
                <section className="border-t border-border pt-5">
                  <label htmlFor="doc-remarks" className="text-sm font-bold text-primary">
                    Admin Remarks
                  </label>
                  <Textarea
                    id="doc-remarks"
                    value={remarkDraft}
                    onChange={(event) => setRemarkDraft(event.target.value)}
                    placeholder="Internal notes about this request"
                    className="mt-3 min-h-20 bg-card"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    disabled={remarkDraft === String(selected.remarks ?? "")}
                    onClick={() => {
                      updateDocument(selected.id, { remarks: remarkDraft });
                      setNotice("Remarks saved.");
                    }}
                  >
                    Save Remarks
                  </Button>
                </section>
                <section className="space-y-3 border-t border-border pt-5">
                  <div>
                    <h3 className="text-sm font-bold text-primary">
                      Document Status and Activity Timeline
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Actions available for the current status.
                    </p>
                  </div>
                  <StatusFlow status={selected.status} paid={paymentCleared} />
                  <div className="flex flex-wrap gap-2">
                    {selected.status === "Pending" && (
                      <Button
                        onClick={() => setStatus("Under Review", "Request moved to Under Review.")}
                      >
                        <ArrowRight className="h-4 w-4" />
                        Start Review
                      </Button>
                    )}
                    {selected.status === "Under Review" && (
                      <Button
                        onClick={() =>
                          setStatus(
                            "Approved",
                            "Request approved. You can now generate the document.",
                          )
                        }
                      >
                        <Check className="h-4 w-4" />
                        Approve Request
                      </Button>
                    )}
                    {selected.status === "Approved" && (
                      <>
                        <Button onClick={generate}>
                          <FileCheck2 className="h-4 w-4" />
                          Generate Document
                        </Button>
                        <Button
                          variant="outline"
                          disabled={!prepared}
                          onClick={() =>
                            setStatus(
                              "Ready for Pickup",
                              "Request marked Ready for Pickup. The resident was notified in the portal.",
                            )
                          }
                        >
                          <PackageCheck className="h-4 w-4" />
                          Mark as Ready for Pickup
                        </Button>
                      </>
                    )}
                    {selected.status === "Ready for Pickup" && (
                      <Button disabled={!paymentCleared} onClick={() => setMode("release")}>
                        <PackageCheck className="h-4 w-4" />
                        Mark as Released
                      </Button>
                    )}
                    {["Pending", "Under Review", "Approved"].includes(selected.status) && (
                      <Button
                        variant="outline"
                        className="text-destructive"
                        onClick={() => {
                          setMode("reject");
                          setReasonError("");
                        }}
                      >
                        <CircleX className="h-4 w-4" />
                        Reject
                      </Button>
                    )}
                    {["Released", "Rejected"].includes(selected.status) && (
                      <p className="text-sm text-muted-foreground">
                        This request is closed. No further status changes are available.
                      </p>
                    )}
                  </div>
                  {selected.status === "Approved" && !prepared && (
                    <p className="text-xs text-muted-foreground">
                      Generate the document first to enable Ready for Pickup.
                    </p>
                  )}
                  {selected.status === "Ready for Pickup" && !paymentCleared && (
                    <p className="text-xs text-warning">
                      Payment is {payment?.status ?? "Unpaid"}. Confirm the payment in Payment
                      Information before marking Released.
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-xs">
                    <span className="font-semibold">Payment:</span>
                    <StatusBadge status={payment?.status ?? "Unpaid"} />
                    {latestNotice && (
                      <>
                        <span className="ml-auto text-muted-foreground">
                          Resident notified {latestNotice.date}
                          {latestNotice.emailSimulatedAt
                            ? ` · email simulated ${latestNotice.emailSimulatedAt}`
                            : ""}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
                          <Mail className="h-4 w-4" />
                          Email Preview
                        </Button>
                      </>
                    )}
                  </div>
                  {mode === "reject" && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                      <label
                        htmlFor="reject-reason"
                        className="text-sm font-semibold text-destructive"
                      >
                        Rejection reason (required)
                      </label>
                      <Textarea
                        id="reject-reason"
                        value={reason}
                        onChange={(event) => {
                          setReason(event.target.value);
                          setReasonError("");
                        }}
                        placeholder="e.g. Missing valid ID or proof of residency"
                        className="mt-2 min-h-20 bg-card"
                      />
                      {reasonError && (
                        <p className="mt-1 text-xs text-destructive">{reasonError}</p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="destructive" onClick={confirmReject}>
                          Confirm Rejection
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setMode("none")}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  {mode === "release" && (
                    <div className="rounded-md border border-gold-muted bg-accent/60 p-3">
                      <p className="text-sm font-semibold text-primary">Confirm release</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Confirm that {selected.resident} has claimed the {selected.type}. This
                        closes the request.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setStatus("Released", "Document marked as Released.")}
                        >
                          Yes, mark as Released
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setMode("none")}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </section>
                <section className="border-t border-border pt-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                    <History className="h-4 w-4" />
                    Activity
                  </h3>
                  <ol className="mt-3 space-y-2">
                    {[...(timelines[selected.id] ?? [])].reverse().map((e) => (
                      <li
                        key={e.id}
                        className="rounded-md border border-border bg-card px-3 py-2 text-xs"
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          {e.from && (
                            <>
                              <StatusBadge status={e.from} />
                              <span className="text-muted-foreground">→</span>
                            </>
                          )}
                          <StatusBadge status={e.to} />
                          <span className="ml-auto text-muted-foreground">{e.at}</span>
                        </div>
                        <p className="mt-1 font-semibold">
                          {e.action}
                          <span className="font-normal text-muted-foreground"> · {e.by}</span>
                        </p>
                        {e.remarks && <p className="mt-1 text-muted-foreground">{e.remarks}</p>}
                      </li>
                    ))}
                  </ol>
                </section>
                {notice && (
                  <p
                    role="status"
                    className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground"
                  >
                    {notice}
                  </p>
                )}
              </div>
              <div className="min-w-0 bg-muted/60 p-5 sm:p-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                      <FileText className="h-4 w-4" />
                      Document Preview
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {prepared
                        ? "Generated sample · ready to print"
                        : "Live sample · generate before printing"}
                    </p>
                  </div>
                  <span className="rounded-md border border-gold-muted bg-card px-2 py-1 text-xs font-semibold text-gold-strong">
                    SAMPLE ONLY
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <DocumentPaper
                    draft={prepared?.draft ?? draft}
                    reference={selected.id}
                    date={prepared?.date ?? "[Date of issuance]"}
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="outline" disabled={!prepared} onClick={printPaper}>
                    <Printer className="h-4 w-4" />
                    Print Document
                  </Button>
                  <Button variant="outline" disabled={!prepared} onClick={printPaper}>
                    <Download className="h-4 w-4" />
                    Download / Save as PDF
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Use your browser’s print dialog and choose “Save as PDF” to save a copy.
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      <Dialog open={sigZoom && Boolean(selected?.signature)} onOpenChange={setSigZoom}>
        {selected?.signature && (
          <DialogContent className="w-[calc(100vw-1rem)] max-w-3xl">
            <DialogHeader>
              <DialogTitle>Applicant Signature</DialogTitle>
              <DialogDescription>
                {selected.id} · {selected.resident}
              </DialogDescription>
            </DialogHeader>
            <img
              src={String(selected.signature)}
              alt={`Signature of ${selected.resident}`}
              className="w-full rounded-md border border-border bg-background object-contain p-4"
            />
          </DialogContent>
        )}
      </Dialog>
      <Dialog open={emailOpen && !!latestNotice} onOpenChange={setEmailOpen}>
        {latestNotice && (
          <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Preview (Simulation)</DialogTitle>
              <DialogDescription>
                Review the pickup notice. This prototype has no email service, so nothing is
                actually delivered.
              </DialogDescription>
            </DialogHeader>
            <PickupEmailPreview notification={latestNotice} />
            <div className="flex flex-wrap items-center justify-end gap-2">
              {latestNotice.emailSimulatedAt ? (
                <p className="mr-auto text-xs font-semibold text-success">
                  Marked as sent (simulated) on {latestNotice.emailSimulatedAt}
                </p>
              ) : null}
              <Button variant="outline" onClick={() => setEmailOpen(false)}>
                Close
              </Button>
              <Button
                disabled={!latestNotice.email || !!latestNotice.emailSimulatedAt}
                onClick={() => simulateEmail(latestNotice.id)}
              >
                <Mail className="h-4 w-4" />
                Simulate Send
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

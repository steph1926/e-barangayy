import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useApp } from "@/lib/barangay-store";
import {
<<<<<<< HEAD
  BRoadCASTS_KEY,
  readBRoadcasts,
  writeBRoadcasts,
  markBRoadcastRead,
  bRoadcastNotification,
} from "@/lib/bRoadcasts";
=======
  BROADCASTS_KEY,
  readBroadcasts,
  writeBroadcasts,
  markBroadcastRead,
  broadcastNotification,
} from "@/lib/broadcasts";
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
export const PICKUP_INSTRUCTIONS =
  "Claim your document at the Barangay 902 Hall, Monday to Friday, 8:00 AM to 5:00 PM.";
export const ID_REMINDER =
  "Please bring a valid government-issued ID and your request reference number.";
export const DOCUMENT_FEES = {
  "Barangay Clearance": 50,
  "Certificate of Residency": 30,
  "Certificate of Indigency": 0,
  "Barangay Certificate": 40,
  "Business Clearance": 200,
  "Barangay ID": 60,
};
export const feeFor = (type) => DOCUMENT_FEES[String(type)] ?? 50;
export const peso = (n) => (n === 0 ? "₱0.00 / No Fee" : `₱${n.toFixed(2)}`);
export function nowStamp() {
  const d = new Date();
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}
function residentDate(value) {
  const d = new Date(String(value));
  return Number.isNaN(d.getTime())
    ? String(value ?? "")
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
const STATUS_ACTION = {
  "Under Review": "Moved to review",
  "In Progress": "Work started",
  Approved: "Request approved",
  "Ready for Pickup": "Marked ready for pickup",
  Released: "Document released",
  Resolved: "Report resolved",
  Rejected: "Rejected",
  Pending: "Returned to pending",
};
// Keep one context instance across live reloads so pages never lose the provider.
const globalForAdmin = globalThis;
const AdminContext =
  globalForAdmin.__adminContext ?? (globalForAdmin.__adminContext = createContext(null));
// Prototype-only administrator account. Not real authentication.
const ADMIN = {
  id: "a1",
  fullName: "Raven Rotao",
  email: "admin@barangay902.test",
  role: "Barangay Administrator",
  contact: "0917 902 0100",
};
export const ADMIN_EMAIL = "admin@barangay902.test";
export const ADMIN_PASSWORD = "Admin123!";
// Published announcements are shared with every resident tab through localStorage
<<<<<<< HEAD
// (see src/lib/bRoadcasts.js).
=======
// (see src/lib/broadcasts.js).
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
const INITIAL_RESIDENTS = [

];
const INITIAL_REPORTS = [
  
];
const INITIAL_DOCUMENTS = [
];
const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ANN-18",
    title: "Barangay Clean-Up Drive",
    category: "Community Event",
    date: "Sep 28, 2026",
    description: "Community clean-up starts at 6:00 AM at the Barangay Hall.",
    status: "Published",
  },
  {
    id: "ANN-17",
    title: "Water Interruption Advisory",
    category: "Advisory",
    date: "Sep 25, 2026",
    description: "Water service interruption will affect Road 1 to 4.",
    status: "Published",
  },
];
const INITIAL_FEEDBACK = [
];
const ADMIN_SESSION_KEY = "eb902-admin-session";
export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [adminRestored, setAdminRestored] = useState(false);
  const [residents, setResidents] = useState(INITIAL_RESIDENTS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  // Keep the admin signed in across reloads and direct URL visits.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ADMIN_SESSION_KEY)) setAdmin(ADMIN);
    } catch {
      /* storage unavailable */
    }
    setAdminRestored(true);
  }, []);
  const loginAdmin = useCallback((email, password) => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return false;
    setAdmin(ADMIN);
    try {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    return true;
  }, []);
  const logoutAdmin = useCallback(() => {
    setAdmin(null);
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const {
    allReports: residentReports,
    allRequests: residentRequests,
    users: residentUsers,
    setUserStatus,
  } = useApp();
  const updateResident = useCallback(
    (id, updates) =>
      setResidents((items) =>
        items.map((item) => {
          if (item.id !== id) return item;
          const next = typeof updates === "string" ? { status: updates } : updates;
          if (next.status && item.email)
            setUserStatus(
              String(item.email),
              next.status === "Verified"
                ? "Verified"
                : next.status === "Rejected"
                  ? "Rejected"
                  : "Pending Verification",
            );
          return { ...item, ...next };
        }),
      ),
    [setUserStatus],
  );
  // Registrations submitted through the public form appear in the verification queue.
  useEffect(() => {
    const pending = residentUsers.filter((u) => u.status === "Pending Verification");
    if (!pending.length) return;
    setResidents((items) => {
      const missing = pending.filter(
        (u) => !items.some((item) => String(item.email).toLowerCase() === u.email.toLowerCase()),
      );
      if (!missing.length) return items;
      return [
        ...missing.map((u, index) => ({
          id: `REG-2026-${1049 + items.length + index}`,
          name: u.fullName,
          birthday: residentDate(u.birthday),
          sex: u.sex ?? "",
<<<<<<< HEAD
          Road: u.Road ?? "",
=======
          road: u.road ?? "",
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
          address: u.address,
          contact: u.contact,
          email: u.email,
          submitted: nowStamp(),
          idType: String(u.validId ?? "").split(" — ")[0] ?? "",
          residencyProof: "Submitted online",
          remarks: "",
          accountActive: false,
          status: "Pending Verification",
        })),
        ...items,
      ];
    });
  }, [residentUsers]);
  const [timelines, setTimelines] = useState(() => {
    const seed = {};
    for (const item of [...INITIAL_REPORTS, ...INITIAL_DOCUMENTS]) {
      const at = item.reportedAt ?? `${item.date} · 9:00 AM`;
      const entries = [
        {
          id: `${item.id}-0`,
          action: "Submitted by resident",
          from: null,
          to: "Pending",
          at,
          by: String(item.resident ?? "Resident"),
        },
      ];
      if (item.status !== "Pending")
        entries.push({
          id: `${item.id}-1`,
          action: STATUS_ACTION[String(item.status)] ?? "Status updated",
          from: "Pending",
          to: String(item.status),
          at: `${item.date} · 2:15 PM`,
          by: ADMIN.fullName,
          remarks: item.remarks || undefined,
        });
      seed[item.id] = entries;
    }
    return seed;
  });
  // Bring resident-portal submissions into the admin records automatically.
  useEffect(() => {
    const stampTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const incoming = (list, existing, kind) =>
      list
        .filter((r) => !existing.some((e) => e.id === r["id"]))
        .map((r) => {
          const date = residentDate(r["date"]);
          const status =
            String(r["status"] ?? "Pending") === "Pending Review"
              ? "Pending"
              : String(r["status"] ?? "Pending");
          return kind === "report"
            ? {
                id: String(r["id"]),
                resident: String(r["name"] ?? r["resident"] ?? "Raven Rotao"),
                type: String(r["type"] ?? ""),
                location: String(r["location"] ?? ""),
                description: String(r["description"] ?? ""),
                contact: r["contact"] ? String(r["contact"]) : undefined,
                email: r["email"]
                  ? String(r["email"])
                  : residentUsers.find((u) => u.fullName === String(r["name"] ?? ""))?.email,
                date,
                reportedAt: `${date} · ${stampTime}`,
                priority: "Medium",
                remarks: "",
                status,
                updatedAt: `${date} · ${stampTime}`,
                photo: typeof r["photo"] === "string" ? String(r["photo"]) : null,
                signature: typeof r["signature"] === "string" ? String(r["signature"]) : null,
                confirmed: Boolean(r["signature"]),
                confirmation: r["signature"]
                  ? `Confirmed accurate by applicant on ${date}`
                  : undefined,
              }
            : {
                id: String(r["id"]),
                resident: String(r["name"] ?? "Raven Rotao"),
                type: String(r["type"] ?? ""),
                purpose: String(r["purpose"] ?? ""),
                address: String(r["address"] ?? ""),
                contact: String(r["contact"] ?? ""),
                email: String(
                  r["email"] ??
                    residentUsers.find((u) => u.fullName === String(r["name"] ?? "Raven Rotao"))
                      ?.email ??
                    "",
                ),
                date,
                remarks: "",
                confirmation: `Confirmed accurate by applicant on ${date}`,
                confirmed: true,
                signature: typeof r["signature"] === "string" ? String(r["signature"]) : null,
                birthday: r["birthday"] ? residentDate(r["birthday"]) : undefined,
                age: r["age"] ? String(r["age"]) : undefined,
                status,
                updatedAt: `${date} · ${stampTime}`,
                reportedAt: `${date} · ${stampTime}`,
              };
        });
    const newReports = incoming(residentReports, reports, "report");
    const newDocs = incoming(residentRequests, documents, "doc");
    if (!newReports.length && !newDocs.length) return;
    if (newReports.length)
      setReports((items) => [
        ...newReports.filter((n) => !items.some((i) => i.id === n.id)),
        ...items,
      ]);
    if (newDocs.length)
      setDocuments((items) => [
        ...newDocs.filter((n) => !items.some((i) => i.id === n.id)),
        ...items,
      ]);
    setTimelines((current) => {
      const next = { ...current };
      for (const item of [...newReports, ...newDocs]) {
        if (next[item.id]) continue;
        const entries = [
          {
            id: `${item.id}-0`,
            action: "Submitted by resident",
            from: null,
            to: "Pending",
            at: String(item.updatedAt),
            by: String(item.resident),
          },
        ];
        if (item.status !== "Pending")
          entries.push({
            id: `${item.id}-1`,
            action: STATUS_ACTION[String(item.status)] ?? "Status updated",
            from: "Pending",
            to: String(item.status),
            at: String(item.updatedAt),
            by: ADMIN.fullName,
          });
        next[item.id] = entries;
      }
      return next;
    });
  }, [residentReports, residentRequests, residentUsers, reports, documents]);
  // Admin "new" notifications: anything not in the seen list is new.
  const [adminSeen, setAdminSeen] = useState(
    () =>
      new Set(
        [...INITIAL_REPORTS, ...INITIAL_DOCUMENTS, ...INITIAL_RESIDENTS, ...residentReports, ...residentRequests].map((i) => String(i.id)),
      ),
  );
  const adminAlerts = useMemo(
    () =>
      [
        ...documents
          .filter((d) => !adminSeen.has(d.id))
          .map((d) => ({
            id: d.id,
            kind: "document",
            title: `New document request: ${String(d.type ?? "")}`,
            resident: String(d.resident ?? ""),
            at: String(d.reportedAt ?? d.date ?? ""),
          })),
        ...reports
          .filter((r) => !adminSeen.has(r.id))
          .map((r) => ({
            id: r.id,
            kind: "report",
            title: `New problem report: ${String(r.type ?? "")}`,
            resident: String(r.resident ?? ""),
            at: String(r.reportedAt ?? r.date ?? ""),
          })),
        ...residents
          .filter((r) => r.status === "Pending Verification" && !adminSeen.has(r.id))
          .map((r) => ({
            id: r.id,
            kind: "registration",
            title: "New resident registration",
            resident: String(r.name ?? ""),
            at: String(r.submitted ?? ""),
          })),
      ],
    [documents, reports, residents, adminSeen],
  );
  // Remember what the admin already read across reloads and tabs.
  useEffect(() => {
    const load = () => {
      try {
        const ids = JSON.parse(localStorage.getItem("eb902-admin-seen") || "[]");
        if (ids.length) setAdminSeen((seen) => new Set([...seen, ...ids]));
      } catch {
        /* ignore */
      }
    };
    load();
    const onStorage = (e) => e.key === "eb902-admin-seen" && load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("eb902-admin-seen", JSON.stringify([...adminSeen]));
    } catch {
      /* ignore */
    }
  }, [adminSeen]);
  const markAdminSeen = useCallback(
    (kind) => {
      const list =
        kind === "report"
          ? reports
          : kind === "document"
            ? documents
            : kind === "registration"
              ? residents
              : [...reports, ...documents, ...residents];
      setAdminSeen((seen) => {
        if (list.every((i) => seen.has(i.id))) return seen;
        const next = new Set(seen);
        list.forEach((i) => next.add(i.id));
        return next;
      });
    },
    [reports, documents, residents],
  );
  const [payments, setPayments] = useState({
    "DOC-2026-0127": {
      txn: "TXN-90268",
      status: "Paid",
      date: "Sep 15, 2026 · 11:20 AM",
      receipt: "OR-2026-00398",
      method: "Cash (Barangay Hall)",
    },
    "DOC-2026-0140": {
      txn: "TXN-90279",
      status: "Paid",
      date: "Sep 27, 2026 · 3:18 PM",
      receipt: "OR-2026-00417",
      method: "Cash (Barangay Hall)",
    },
    "DOC-2026-0138": {
      txn: "TXN-90276",
      status: "Paid",
      date: "Sep 26, 2026 · 1:02 PM",
      receipt: "OR-2026-00412",
      method: "Cash (Barangay Hall)",
    },
  });
  const recordPayment = useCallback((requestId, status) => {
    const at = nowStamp();
    let entry = null;
    setPayments((current) => {
      const prev = current[requestId];
      const receipt =
        status === "Paid"
          ? `OR-2026-${String(420 + Object.keys(current).length).padStart(5, "0")}`
          : prev?.receipt;
      entry = {
        id: `${requestId}-pay-${status}`,
        action: status === "Paid" ? `Payment received · ${receipt}` : "Payment refunded",
        from: prev?.status ?? "Unpaid",
        to: status,
        at,
        by: ADMIN.fullName,
      };
      return {
        ...current,
        [requestId]: {
          txn: prev?.txn ?? `TXN-${90300 + Object.keys(current).length}`,
          status,
          date: at,
          receipt,
          method: "Cash (Barangay Hall)",
        },
      };
    });
    setTimelines((current) => {
      const list = current[requestId] ?? [];
      if (!entry || list.some((e) => e.id === entry.id)) return current;
      return { ...current, [requestId]: [...list, entry] };
    });
  }, []);
  const applyUpdate = useCallback((setter, id, updates) => {
    setter((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const statusChanged = updates.status !== undefined && updates.status !== item.status;
        if (!statusChanged) return { ...item, ...updates };
        const at = nowStamp();
        const remarks = (updates.remarks ?? item.remarks ?? "").trim();
        const entry = {
          id: `${id}-${Date.now()}`,
          action: STATUS_ACTION[String(updates.status)] ?? "Status updated",
          from: String(item.status),
          to: String(updates.status),
          at,
          by: ADMIN.fullName,
          remarks: remarks || undefined,
        };
        setTimelines((current) => {
          const list = current[id] ?? [];
          const last = list[list.length - 1];
          if (last && last.from === entry.from && last.to === entry.to && last.at === entry.at)
            return current;
          return { ...current, [id]: [...list, entry] };
        });
        return { ...item, ...updates, updatedAt: at };
      }),
    );
  }, []);
  const updateReport = useCallback(
    (id, updates) => applyUpdate(setReports, id, updates),
    [applyUpdate],
  );
  const documentsRef = useRef(documents);
  documentsRef.current = documents;
  const [notifications, setNotifications] = useState([
    {
      id: "NTF-DOC-2026-0127-1",
      requestId: "DOC-2026-0127",
      resident: "Raven Rotao",
      email: "resident1@barangay902.test",
      documentType: "Barangay Clearance",
      date: "Sep 16, 2026 · 10:05 AM",
      message: `Your Barangay Clearance (DOC-2026-0127) is ready for pickup. ${PICKUP_INSTRUCTIONS}`,
      read: false,
    },
    {
      id: "NTF-DOC-2026-0118-1",
      requestId: "DOC-2026-0118",
      resident: "Stephanie Alvaran",
      email: "resident2@barangay902.test",
      documentType: "Certificate of Residency",
      date: "Sep 10, 2026 · 9:30 AM",
      message: `Your Certificate of Residency (DOC-2026-0118) is now under review by the barangay office.`,
      read: false,
    },
    {
      id: "NTF-DOC-2026-0139-1",
      requestId: "DOC-2026-0139",
      resident: "Nina Flores",
      email: "nina.flores@example.com",
      documentType: "Certificate of Indigency",
      date: "Sep 27, 2026 · 2:15 PM",
      message: `Your Certificate of Indigency (DOC-2026-0139) is ready for pickup. ${PICKUP_INSTRUCTIONS}`,
      read: false,
    },
  ]);
  const updateDocument = useCallback(
    (id, updates) => {
      const next = typeof updates === "string" ? { status: updates } : updates;
      const prev = documentsRef.current.find((d) => d.id === id);
      if (prev && next.status === "Ready for Pickup" && prev.status !== "Ready for Pickup") {
        const at = nowStamp();
        const resident = String(prev.resident ?? "");
        setNotifications((list) => {
          const nid = `NTF-${id}-${list.filter((n) => n.requestId === id).length + 1}`;
          if (list.some((n) => n.id === nid)) return list;
          return [
            {
              id: nid,
              requestId: id,
              resident,
              email: String(prev.email ?? ""),
              documentType: String(prev.type ?? ""),
              date: at,
              message: `Your ${String(prev.type)} (${id}) is ready for pickup. ${PICKUP_INSTRUCTIONS}`,
              read: false,
            },
            ...list,
          ];
        });
      }
      applyUpdate(setDocuments, id, next);
    },
    [applyUpdate],
  );
  // Receive announcements published from any tab (admin or resident) and turn
  // them into "All residents" notifications, refreshing each resident's read
  // state from storage. Runs on load, on storage events, and on a 1s poll.
  useEffect(() => {
<<<<<<< HEAD
    const syncBRoadcasts = () => {
      const bRoadcasts = readBRoadcasts();
      if (!bRoadcasts.length) return;
      setNotifications((list) => {
        let next = list;
        for (const ann of bRoadcasts) {
          const ntf = bRoadcastNotification(ann);
=======
    const syncBroadcasts = () => {
      const broadcasts = readBroadcasts();
      if (!broadcasts.length) return;
      setNotifications((list) => {
        let next = list;
        for (const ann of broadcasts) {
          const ntf = broadcastNotification(ann);
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
          const existing = next.find((n) => n.id === ntf.id);
          if (!existing) {
            next = [ntf, ...next];
          } else if (JSON.stringify(existing.readBy ?? []) !== JSON.stringify(ntf.readBy)) {
            next = next.map((n) => (n.id === ntf.id ? { ...n, readBy: ntf.readBy } : n));
          }
        }
        return next;
      });
      // Surface published announcements on the admin list too.
      setAnnouncements((items) => {
<<<<<<< HEAD
        const fresh = bRoadcasts.filter((b) => !items.some((i) => i.id === b.id));
        return fresh.length ? [...fresh, ...items] : items;
      });
    };
    syncBRoadcasts();
    const onStorage = (e) => {
      if (e.key === BRoadCASTS_KEY) syncBRoadcasts();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", syncBRoadcasts);
    const timer = window.setInterval(syncBRoadcasts, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", syncBRoadcasts);
=======
        const fresh = broadcasts.filter((b) => !items.some((i) => i.id === b.id));
        return fresh.length ? [...fresh, ...items] : items;
      });
    };
    syncBroadcasts();
    const onStorage = (e) => {
      if (e.key === BROADCASTS_KEY) syncBroadcasts();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", syncBroadcasts);
    const timer = window.setInterval(syncBroadcasts, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", syncBroadcasts);
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
      window.clearInterval(timer);
    };
  }, []);
  const markNotificationsRead = useCallback(
    (resident) =>
      setNotifications((list) =>
        list.map((n) => {
          if (n.resident === resident && !n.read) return { ...n, read: true };
          if (n.resident === "All" && !(n.readBy ?? []).includes(resident)) {
            // Persist so other tabs and future sessions keep it read.
<<<<<<< HEAD
            markBRoadcastRead(n.requestId, resident);
=======
            markBroadcastRead(n.requestId, resident);
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
            return { ...n, readBy: [...(n.readBy ?? []), resident] };
          }
          return n;
        }),
      ),
    [],
  );
  const simulateEmail = useCallback(
    (notificationId) =>
      setNotifications((list) =>
        list.map((n) => (n.id === notificationId ? { ...n, emailSimulatedAt: nowStamp() } : n)),
      ),
    [],
  );
  const transactions = useMemo(
    () =>
      documents.map((item, index) => {
        const timeline = timelines[item.id] ?? [];
        const fee = feeFor(item.type);
        const payment = payments[item.id] ?? {
          txn: `TXN-${90290 - index}`,
          status: fee === 0 ? "No Fee" : "Unpaid",
        };
        return {
          id: payment.txn,
          requestId: item.id,
          resident: String(item.resident ?? ""),
          service: String(item.type ?? ""),
          fee,
          payment,
          submitted: timeline[0]?.at ?? String(item.date ?? ""),
          status: String(item.status),
          updatedAt: item.updatedAt ?? timeline[timeline.length - 1]?.at ?? String(item.date ?? ""),
          source: item,
          timeline,
        };
      }),
    [documents, timelines, payments],
  );
  const addFeedback = useCallback((item) => setFeedback((items) => [item, ...items]), []);
  const markFeedback = useCallback(
    (id) =>
      setFeedback((items) =>
        items.map((item) => (item.id === id ? { ...item, status: "Reviewed" } : item)),
      ),
    [],
  );
  const addAnnouncement = useCallback((title, category, description) => {
    const postedAt = nowStamp();
    const ann = {
      id: `ANN-${Date.now()}`,
      title,
      category,
      description,
      date: postedAt.split(" · ")[0],
      postedAt,
      status: "Published",
      readBy: [],
    };
    // Persist so every resident tab (and future sessions) receives it.
<<<<<<< HEAD
    writeBRoadcasts([ann, ...readBRoadcasts()]);
    setAnnouncements((items) => [ann, ...items]);
    // BRoadcast a notification to every resident.
    setNotifications((list) => [bRoadcastNotification(ann), ...list]);
=======
    writeBroadcasts([ann, ...readBroadcasts()]);
    setAnnouncements((items) => [ann, ...items]);
    // Broadcast a notification to every resident.
    setNotifications((list) => [broadcastNotification(ann), ...list]);
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
  }, []);
  const updateAdmin = useCallback(
    (data) => setAdmin((current) => (current ? { ...current, ...data } : current)),
    [],
  );
  const value = useMemo(
    () => ({
      admin,
      adminRestored,
      residents,
      reports,
      documents,
      announcements,
      feedback,
      transactions,
      timelines,
      recordPayment,
      notifications,
      markNotificationsRead,
      simulateEmail,
      adminAlerts,
      markAdminSeen,
      loginAdmin,
      logoutAdmin,
      updateResident,
      updateReport,
      updateDocument,
      markFeedback,
      addFeedback,
      addAnnouncement,
      updateAdmin,
    }),
    [
      admin,
      adminRestored,
      residents,
      reports,
      documents,
      transactions,
      timelines,
      recordPayment,
      notifications,
      markNotificationsRead,
      simulateEmail,
      adminAlerts,
      markAdminSeen,
      announcements,
      feedback,
      loginAdmin,
      logoutAdmin,
      updateResident,
      updateReport,
      updateDocument,
      markFeedback,
      addFeedback,
      addAnnouncement,
      updateAdmin,
    ],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin must be used inside AdminProvider");
  return value;
}

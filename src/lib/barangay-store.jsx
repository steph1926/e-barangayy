import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { BRoadCASTS_KEY, readBRoadcasts } from "@/lib/bRoadcasts";

const AppContext = createContext(null);

const SESSION_KEY = "eb902-demo-session";

// Prototype-only accounts. No backend, no real authentication.
export const ACCOUNT_STATUS = {
  verified: "Verified",
  pending: "Pending Verification",
  rejected: "Rejected",
};

const MOCK_USERS = [
  {
    id: "u1",
    fullName: "Stephanie Alvaran",
    birthday: "1992-04-18",
    sex: "Female",
    address: "12 Mabini St., Road 3, Barangay 902",
    Road: "Road 3",
    validId: "Philippine National ID (PhilSys) — 1234-5678-9012",
    contact: "0917 555 0142",
    email: "resident1@barangay902.test",
    password: "Resident123!",
    status: ACCOUNT_STATUS.verified,
  },
  {
    id: "u2",
    fullName: "Raven Rotao",
    birthday: "1985-11-02",
    sex: "Male",
    address: "88 Rizal Ave., Road 1, Barangay 902",
    Road: "Road 1",
    validId: "Driver's License — N01-88-123456",
    contact: "0918 221 7788",
    email: "resident2@barangay902.test",
    password: "Resident123!",
    status: ACCOUNT_STATUS.verified,
  },
];

const INITIAL_REPORTS = [
];

const INITIAL_REQUESTS = [
  {
    id: "DOC-2026-0127",
    userId: "u1",
    type: "Barangay Clearance",
    purpose: "Employment requirement",
    name: "Stephanie Alvaran",
    address: "12 Mabini St., Road 3",
    contact: "0917 555 0142",
    date: "2026-09-15",
    status: "Ready for Pickup",
  },
  {
    id: "DOC-2026-0110",
    userId: "u1",
    type: "Certificate of Indigency",
    purpose: "Medical assistance",
    name: "Raven Rotao",
    address: "12 Mabini St., Road 3",
    contact: "0917 555 0142",
    date: "2026-09-02",
    status: "Released",
  },
  {
    id: "DOC-2026-0118",
    userId: "u2",
    type: "Certificate of Residency",
    purpose: "School enrollment of child",
    name: "Stephanie Alvaran",
    address: "88 Rizal Ave., Road 1",
    contact: "0918 221 7788",
    date: "2026-09-09",
    status: "Under Review",
  },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Barangay Clean-Up Drive",
    category: "Community Event",
    date: "2026-09-20",
    description:
      "Join the monthly clean-up drive this Saturday, 6:00 AM at the Barangay Hall. Bring gloves and sacks. Snacks will be provided for all volunteers.",
  },
  {
    id: 2,
    title: "Community Meeting on Peace and Order",
    category: "Meeting",
    date: "2026-09-18",
    description:
      "All household representatives are invited to the assembly on September 25, 7:00 PM at the covered court to discuss the barangay watch schedule.",
  },
  {
    id: 3,
    title: "Schedule of Document Services",
    category: "Services",
    date: "2026-09-10",
    description:
      "Document releasing is available Monday to Friday, 8:00 AM to 5:00 PM. Requests filed after 4:00 PM will be processed the next working day.",
  },
  {
    id: 4,
    title: "Public Advisory: Water Interruption",
    category: "Advisory",
    date: "2026-09-05",
    description:
      "Scheduled water service interruption on September 22, 9:00 AM to 4:00 PM, affecting Road 1 to Road 4. Please store enough water in advance.",
  },
];

const SUBMISSIONS_KEY = "eb902-submissions";
const pad = (n) => String(n).padStart(4, "0");
const today = () => new Date().toISOString().slice(0, 10);
const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export function AppProvider({ children }) {
  const [users, setUsers] = useState(MOCK_USERS);
  const [user, setUser] = useState(null);
  const [allReports, setAllReports] = useState(INITIAL_REPORTS);
  const [allRequests, setAllRequests] = useState(INITIAL_REQUESTS);
  const [seq, setSeq] = useState(40);
  const [restored, setRestored] = useState(false);
  // Announcements published by the admin, received from any tab via localStorage.
  const [bRoadcasts, setBRoadcasts] = useState(() => readBRoadcasts());

  // Refresh published announcements when another tab posts one.
  useEffect(() => {
    const load = () => setBRoadcasts(readBRoadcasts());
    const onStorage = (e) => {
      if (e.key === BRoadCASTS_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", load);
    const timer = window.setInterval(load, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", load);
      window.clearInterval(timer);
    };
  }, []);

  // Newest admin-published announcements first, then the built-in ones.
  const announcements = useMemo(
    () => [...bRoadcasts.map((b) => ({ ...b, date: b.date ?? b.postedAt })), ...ANNOUNCEMENTS],
    [bRoadcasts],
  );

  // Share resident submissions between browser tabs so the admin is notified right away.
  useEffect(() => {
    const load = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "null");
        if (!saved) return;
        const merge = (prev, incoming) => {
          const fresh = (incoming || []).filter((n) => !prev.some((p) => p.id === n.id));
          return fresh.length ? [...fresh, ...prev] : prev;
        };
        setAllReports((prev) => merge(prev, saved.reports));
        setAllRequests((prev) => merge(prev, saved.requests));
        if (saved.seq) setSeq((s) => Math.max(s, saved.seq));
        if (saved.users?.length) {
          setUsers((prev) => {
            let changed = false;
            const next = prev.map((u) => {
              const match = saved.users.find((n) => normalize(n.email) === normalize(u.email));
              if (match && match.status !== u.status) {
                changed = true;
                return { ...u, status: match.status };
              }
              return u;
            });
            const fresh = saved.users.filter(
              (n) => !next.some((u) => normalize(u.email) === normalize(n.email)),
            );
            if (fresh.length) changed = true;
            return changed ? [...next, ...fresh] : prev;
          });
          setUser((current) => {
            if (!current) return current;
            const match = saved.users.find((n) => normalize(n.email) === normalize(current.email));
            return match && match.status !== current.status ? { ...current, status: match.status } : current;
          });
        }
      } catch {
        /* ignore unreadable storage */
      }
    };
    load();
    const onStorage = (e) => {
      if (e.key === SUBMISSIONS_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", load);
    // Fallback check so new reports show up within a second even if a tab event is missed.
    const timer = window.setInterval(load, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", load);
      document.removeEventListener("visibilitychange", load);
      window.clearInterval(timer);
    };
  }, []);
  // Share registrations and their verification status between tabs.
  const saveUser = useCallback((account) => {
    try {
      const saved = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "null") || {
        reports: [],
        requests: [],
        seq: 0,
      };
      const others = (saved.users || []).filter((u) => normalize(u.email) !== normalize(account.email));
      saved.users = [...others, account];
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(saved));
    } catch {
      /* storage unavailable */
    }
  }, []);
  const saveSubmission = useCallback((kind, item, nextSeq) => {
    try {
      const saved = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "null") || {
        reports: [],
        requests: [],
        seq: 0,
      };
      saved[kind] = [item, ...(saved[kind] || []).filter((i) => i.id !== item.id)];
      saved.seq = Math.max(saved.seq || 0, nextSeq);
      try {
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(saved));
      } catch {
        // Too large (e.g. photo) — save without images.
        const strip = (list) => (list || []).map((i) => ({ ...i, photo: null, signature: null }));
        saved.reports = strip(saved.reports);
        saved.requests = strip(saved.requests);
        if (saved[kind][0]) saved[kind][0] = { ...saved[kind][0], photo: item.photo ?? null, signature: item.signature ?? null };
        try {
          localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(saved));
          return;
        } catch {
          saved[kind][0] = { ...item, photo: null, signature: null };
        }
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(saved));
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Keep the demo sign-in across page reloads.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      /* ignore unreadable session */
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore unwritable session */
    }
  }, [user, restored]);

  const login = useCallback(
    (email, password) => {
      const account = users.find((u) => normalize(u.email) === normalize(email));
      if (!account || account.password !== password) {
        return { ok: false, error: "Incorrect email address or password. Please try again." };
      }
      if (account.status === ACCOUNT_STATUS.pending) {
        return {
          ok: false,
          status: account.status,
          error:
            "Your resident account is still pending verification. The barangay office will review your registration before you can sign in.",
        };
      }
      if (account.status === ACCOUNT_STATUS.rejected) {
        return {
          ok: false,
          status: account.status,
          error:
            "Your resident registration was rejected. Please visit the Barangay 902 office to update your submitted requirements.",
        };
      }
      setUser(account);
      return { ok: true, role: "resident" };
    },
    [users],
  );

  const register = useCallback(
    (data) => {
      if (users.some((u) => normalize(u.email) === normalize(data.email))) {
        return { ok: false, error: "This email is already registered." };
      }
      const newUser = {
        ...data,
        id: `u${Date.now().toString(36)}`,
        email: String(data.email).trim(),
        status: ACCOUNT_STATUS.pending,
      };
      setUsers((prev) => [...prev, newUser]);
      saveUser(newUser);
      return { ok: true, user: newUser };
    },
    [users, saveUser],
  );

  // Mock password recovery — nothing is emailed.
  const requestPasswordReset = useCallback(
    (email) => {
      const account = users.find((u) => normalize(u.email) === normalize(email));
      if (!account) return { ok: false, error: "No account matches that email address." };
      return {
        ok: true,
        code: `RESET-${account.id.toUpperCase()}-902`,
      };
    },
    [users],
  );

  const setUserStatus = useCallback((email, status) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (normalize(u.email) !== normalize(email)) return u;
        const updated = { ...u, status };
        saveUser(updated);
        return updated;
      }),
    );
    setUser((current) =>
      current && normalize(current.email) === normalize(email) ? { ...current, status } : current,
    );
  }, [saveUser]);

  const quickLogin = useCallback((account) => setUser(account), []);
  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
    setUsers((prev) => prev.map((u) => (u.id === data.id ? { ...u, ...data } : u)));
  }, []);

  const addReport = useCallback(
    (data) => {
      const id = `RPT-2026-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      setSeq((s) => s + 1);
      const report = {
        ...data,
        id,
        userId: user?.id ?? null,
        name: data.name ?? user?.fullName ?? "",
        date: today(),
        status: "Pending Review",
      };
      setAllReports((prev) => [report, ...prev]);
      saveSubmission("reports", report, seq + 1);
      return report;
    },
    [seq, user, saveSubmission],
  );

  const addRequest = useCallback(
    (data) => {
      const id = `DOC-2026-${pad(seq + 200)}`;
      setSeq((s) => s + 1);
      const req = { ...data, id, userId: user?.id ?? null, date: today(), status: "Pending" };
      setAllRequests((prev) => [req, ...prev]);
      saveSubmission("requests", req, seq + 1);
      return req;
    },
    [seq, user, saveSubmission],
  );

  const reports = useMemo(
    () => (user ? allReports.filter((r) => r.userId === user.id) : []),
    [allReports, user],
  );
  const requests = useMemo(
    () => (user ? allRequests.filter((r) => r.userId === user.id) : []),
    [allRequests, user],
  );

  const value = useMemo(
    () => ({
      users,
      user,
      restored,
      reports,
      requests,
      allReports,
      allRequests,
      announcements,
      login,
      register,
      requestPasswordReset,
      setUserStatus,
      quickLogin,
      logout,
      updateProfile,
      addReport,
      addRequest,
    }),
    [
      users,
      user,
      restored,
      reports,
      requests,
      allReports,
      allRequests,
      announcements,
      login,
      register,
      requestPasswordReset,
      setUserStatus,
      quickLogin,
      logout,
      updateProfile,
      addReport,
      addRequest,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

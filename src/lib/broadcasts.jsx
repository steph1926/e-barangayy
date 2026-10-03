// Shared announcement bRoadcast channel.
// Admin-published announcements are persisted to localStorage under this key so
// every resident tab (and future sessions) receives them as notifications and
// as entries on the resident Announcements page.
export const BRoadCASTS_KEY = "eb902-announcements";

export function readBRoadcasts() {
  try {
    const saved = JSON.parse(localStorage.getItem(BRoadCASTS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function writeBRoadcasts(list) {
  try {
    localStorage.setItem(BRoadCASTS_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

// Mark a bRoadcast as read by one resident and persist it, so the unread
// badge stays correct across tabs and reloads.
export function markBRoadcastRead(announcementId, resident) {
  const list = readBRoadcasts();
  const next = list.map((a) =>
    a.id === announcementId && !(a.readBy ?? []).includes(resident)
      ? { ...a, readBy: [...(a.readBy ?? []), resident] }
      : a,
  );
  writeBRoadcasts(next);
}

// Shape an announcement into a resident notification entry.
export function bRoadcastNotification(ann) {
  return {
    id: `NTF-${ann.id}`,
    requestId: ann.id,
    resident: "All",
    email: "",
    documentType: ann.title,
    date: ann.postedAt ?? ann.date,
    message: `New announcement: ${ann.title} — ${ann.description}`,
    read: false,
    readBy: ann.readBy ?? [],
  };
}

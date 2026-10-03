<<<<<<< HEAD
// Shared announcement bRoadcast channel.
// Admin-published announcements are persisted to localStorage under this key so
// every resident tab (and future sessions) receives them as notifications and
// as entries on the resident Announcements page.
export const BRoadCASTS_KEY = "eb902-announcements";

export function readBRoadcasts() {
  try {
    const saved = JSON.parse(localStorage.getItem(BRoadCASTS_KEY) || "[]");
=======
// Shared announcement broadcast channel.
// Admin-published announcements are persisted to localStorage under this key so
// every resident tab (and future sessions) receives them as notifications and
// as entries on the resident Announcements page.
export const BROADCASTS_KEY = "eb902-announcements";

export function readBroadcasts() {
  try {
    const saved = JSON.parse(localStorage.getItem(BROADCASTS_KEY) || "[]");
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

<<<<<<< HEAD
export function writeBRoadcasts(list) {
  try {
    localStorage.setItem(BRoadCASTS_KEY, JSON.stringify(list));
=======
export function writeBroadcasts(list) {
  try {
    localStorage.setItem(BROADCASTS_KEY, JSON.stringify(list));
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
  } catch {
    /* storage unavailable */
  }
}

<<<<<<< HEAD
// Mark a bRoadcast as read by one resident and persist it, so the unread
// badge stays correct across tabs and reloads.
export function markBRoadcastRead(announcementId, resident) {
  const list = readBRoadcasts();
=======
// Mark a broadcast as read by one resident and persist it, so the unread
// badge stays correct across tabs and reloads.
export function markBroadcastRead(announcementId, resident) {
  const list = readBroadcasts();
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
  const next = list.map((a) =>
    a.id === announcementId && !(a.readBy ?? []).includes(resident)
      ? { ...a, readBy: [...(a.readBy ?? []), resident] }
      : a,
  );
<<<<<<< HEAD
  writeBRoadcasts(next);
}

// Shape an announcement into a resident notification entry.
export function bRoadcastNotification(ann) {
=======
  writeBroadcasts(next);
}

// Shape an announcement into a resident notification entry.
export function broadcastNotification(ann) {
>>>>>>> fbb9243e947d51418373039bec07105caa84beb6
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

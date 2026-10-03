// Age is always derived from the birthday and the current date — never stored or typed in.
export function calculateAge(birthday, reference = new Date()) {
  if (!birthday) return null;
  const [y, m, d] = String(birthday).split("-").map(Number);
  if (!y || !m || !d) return null;
  let age = reference.getFullYear() - y;
  const hadBirthdayThisYear =
    reference.getMonth() + 1 > m || (reference.getMonth() + 1 === m && reference.getDate() >= d);
  if (!hadBirthdayThisYear) age -= 1;
  return age < 0 ? null : age;
}

export function isFutureDate(birthday, reference = new Date()) {
  if (!birthday) return false;
  const [y, m, d] = String(birthday).split("-").map(Number);
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  const today = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  return date.getTime() > today.getTime();
}

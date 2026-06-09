export function getRoomKeyFromAcc(acc) {
  if (!acc) return null;
  if (typeof acc === "string") return acc;
  const { slug, id } = acc;
  if (slug && typeof slug === "string" && slug.trim()) return slug;
  if (id) return `room${id}`;
  return null;
}

export function getRoomKeyFromIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  if (typeof idOrSlug === "number") return `room${idOrSlug}`;
  if (/^\d+$/.test(String(idOrSlug))) return `room${idOrSlug}`;
  return String(idOrSlug);
}

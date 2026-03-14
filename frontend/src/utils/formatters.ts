export function formatDate(dateStr: string, lang: string = "ko"): string {
  const date = new Date(dateStr);
  const locale = lang === "en" ? "en-US" : "ko-KR";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
  return formatDate(dateStr);
}

export function formatRelativeTimeI18n(
  dateStr: string,
  t: (key: string, params?: Record<string, string | number>) => string,
  lang: string = "ko"
): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return t("time.justNow");
  if (diffMin < 60) return t("time.minutesAgo", { n: diffMin });
  if (diffHour < 24) return t("time.hoursAgo", { n: diffHour });
  if (diffDay < 7) return t("time.daysAgo", { n: diffDay });
  if (diffDay < 30) return t("time.weeksAgo", { n: Math.floor(diffDay / 7) });
  return formatDate(dateStr, lang);
}

export function truncateId(id: string, length = 8): string {
  if (id.length <= length) return id;
  return id.slice(0, length) + "...";
}

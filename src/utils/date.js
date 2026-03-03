export function formatDate(sentAt) {
  if (!sentAt) return "";

  try {
    const date = new Date(sentAt * 1000);
    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return timeString;
  } catch (e) {
    return "";
  }
}

export function isBlockedUrl(url: string): boolean {
  const blockedProtocols = [
    "about:",
    "brave://",
    "chrome://",
    "edge://",
    "opera://",
    "vivaldi://",
  ];

  if (blockedProtocols.some((p) => url.toLowerCase().startsWith(p))) {
    return true;
  }

  return false;
}

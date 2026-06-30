const KEY = "prime.device.id";
const NAME_KEY = "prime.device.name";

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "dev-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function detectName() {
  if (typeof navigator === "undefined") return "Web";
  const ua = navigator.userAgent;
  const browser = /edg/i.test(ua)
    ? "Edge"
    : /chrome/i.test(ua)
      ? "Chrome"
      : /firefox/i.test(ua)
        ? "Firefox"
        : /safari/i.test(ua)
          ? "Safari"
          : "Browser";
  const os = /windows/i.test(ua)
    ? "Windows"
    : /mac/i.test(ua)
      ? "macOS"
      : /android/i.test(ua)
        ? "Android"
        : /iphone|ipad/i.test(ua)
          ? "iOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Web";
  return `${browser} on ${os}`;
}

export function getDeviceId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function getDeviceName() {
  if (typeof window === "undefined") return null;
  let name = localStorage.getItem(NAME_KEY);
  if (!name) {
    name = detectName();
    localStorage.setItem(NAME_KEY, name);
  }
  return name;
}

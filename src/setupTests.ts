import "@testing-library/jest-dom";

// jsdom is already the environment, but add helpful polyfills/mocks

// matchMedia (used by some components or libraries)
if (typeof window.matchMedia !== "function") {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
    media: "",
  });
}

// ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!("ResizeObserver" in window)) {
  // @ts-expect-error - define for tests
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
}

// requestAnimationFrame
if (!("requestAnimationFrame" in window)) {
  // @ts-expect-error - jsdom fallback
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number;
  // @ts-expect-error - jsdom fallback
  window.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// Capacitor web-safe mocks to avoid runtime errors in tests
vi.mock("@capacitor/core", () => {
  return {
    Capacitor: {
      isNativePlatform: () => false,
      getPlatform: () => "web",
    },
  };
});

vi.mock("@capacitor/haptics", () => ({
  Haptics: {
    impact: vi.fn().mockResolvedValue(undefined),
    vibrate: vi.fn().mockResolvedValue(undefined),
    selectionStart: vi.fn().mockResolvedValue(undefined),
    selectionChanged: vi.fn().mockResolvedValue(undefined),
    selectionEnd: vi.fn().mockResolvedValue(undefined),
  },
  ImpactStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
}));

vi.mock("@capacitor/local-notifications", () => ({
  LocalNotifications: {
    requestPermissions: vi.fn().mockResolvedValue({ display: "granted" }),
    schedule: vi.fn().mockResolvedValue(undefined),
    cancel: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@capacitor/preferences", () => ({
  Preferences: {
    get: vi.fn().mockResolvedValue({ value: null }),
    set: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@capacitor/status-bar", () => ({
  StatusBar: { setStyle: vi.fn().mockResolvedValue(undefined) },
  Style: { Dark: "DARK", Light: "LIGHT" },
}));

// Optional: silence console.error noise from React during expected failures
const error = console.error;
console.error = (...args: unknown[]) => {
  const msg = args[0]?.toString?.() ?? "";
  if (msg.includes("ReactDOMTestUtils.act")) return;
  error(...args);
};

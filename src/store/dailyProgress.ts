import { create } from "zustand";
import localforage from "localforage";

const STORAGE_KEY = "daily-progress.v1";

const getDateKey = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export type ReadingUnit = "minutes" | "pages";

export interface DailyMetrics {
  date: string;
  water: {
    current: number;
    target: number;
  };
  reading: {
    current: number;
    target: number;
    unit: ReadingUnit;
  };
  gym: {
    completed: boolean;
    target: number;
  };
  updatedAt: number;
}

export interface DailyPreferences {
  waterTarget: number;
  waterIncrement: number;
  readingTarget: number;
  readingIncrement: number;
  readingUnit: ReadingUnit;
  gymTarget: number;
  hydrationReminderEnabled: boolean;
  hydrationReminderTimes: string[];
  readingReminderEnabled: boolean;
  readingReminderTime: string;
}

interface PersistedState {
  entries: Record<string, DailyMetrics>;
  preferences: DailyPreferences;
}

interface DailyProgressState extends PersistedState {
  loaded: boolean;
  load: () => Promise<void>;
  ensureEntry: (date?: string) => DailyMetrics;
  addWater: (amount: number, date?: string) => Promise<void>;
  setWater: (value: number, date?: string) => Promise<void>;
  setWaterTarget: (target: number) => Promise<void>;
  setWaterIncrement: (increment: number) => Promise<void>;
  logReading: (amount: number, date?: string) => Promise<void>;
  setReading: (value: number, date?: string) => Promise<void>;
  setReadingTarget: (target: number) => Promise<void>;
  setReadingUnit: (unit: ReadingUnit) => Promise<void>;
  setReadingIncrement: (increment: number) => Promise<void>;
  toggleGym: (date?: string) => Promise<void>;
  setGymCompleted: (completed: boolean, date?: string) => Promise<void>;
  setGymTarget: (target: number) => Promise<void>;
  setHydrationReminderEnabled: (enabled: boolean) => Promise<void>;
  setHydrationReminderTimes: (times: string[]) => Promise<void>;
  setReadingReminderEnabled: (enabled: boolean) => Promise<void>;
  setReadingReminderTime: (time: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const defaultPreferences: DailyPreferences = {
  waterTarget: 8,
  waterIncrement: 1,
  readingTarget: 30,
  readingIncrement: 10,
  readingUnit: "minutes",
  gymTarget: 1,
  hydrationReminderEnabled: false,
  hydrationReminderTimes: ["09:00", "13:00", "18:00"],
  readingReminderEnabled: false,
  readingReminderTime: "20:30",
};

const createEntry = (date: string, preferences: DailyPreferences): DailyMetrics => ({
  date,
  water: {
    current: 0,
    target: preferences.waterTarget,
  },
  reading: {
    current: 0,
    target: preferences.readingTarget,
    unit: preferences.readingUnit,
  },
  gym: {
    completed: false,
    target: preferences.gymTarget,
  },
  updatedAt: Date.now(),
});

const sanitizeTarget = (value: number, fallback: number, min: number) => {
  if (!Number.isFinite(value) || Number.isNaN(value)) return fallback;
  return Math.max(min, Math.round(value));
};

const sanitizeIncrement = (value: number, fallback: number) => {
  if (!Number.isFinite(value) || Number.isNaN(value)) return fallback;
  return Math.max(1, Math.round(value));
};

const sanitizeTimes = (times: string[], fallback: string[]) => {
  const cleaned = times
    .map(time => time.trim())
    .filter(Boolean)
    .map(time => {
      const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time);
      if (!match) return null;
      return `${match[1]!.padStart(2, "0")}:${match[2]!.padStart(2, "0")}`;
    })
    .filter((time): time is string => time !== null);

  const unique = Array.from(new Set(cleaned)).slice(0, 6);
  return unique.length > 0 ? unique.sort() : fallback;
};

const persistState = async (state: Pick<DailyProgressState, "entries" | "preferences">) => {
  await localforage.setItem(STORAGE_KEY, {
    entries: state.entries,
    preferences: state.preferences,
  });
};

export const useDailyProgress = create<DailyProgressState>((set, get) => ({
  entries: {},
  preferences: defaultPreferences,
  loaded: false,

  async load() {
    const stored = await localforage.getItem<PersistedState>(STORAGE_KEY);

    const preferences = stored?.preferences
      ? { ...defaultPreferences, ...stored.preferences }
      : defaultPreferences;
    const entries = stored?.entries ?? {};

    // Ensure today's entry exists so UI can read synchronously
    const todayKey = getDateKey();
    if (!entries[todayKey]) {
      entries[todayKey] = createEntry(todayKey, preferences);
    }

    set({ entries, preferences, loaded: true });
  },

  ensureEntry(date) {
    const state = get();
    const targetDate = date ?? getDateKey();
    let entry = state.entries[targetDate];
    if (!entry) {
      entry = createEntry(targetDate, state.preferences);
      set({ entries: { ...state.entries, [targetDate]: entry } });
    }
    return entry;
  },

  async addWater(amount, date) {
    const state = get();
    const targetDate = date ?? getDateKey();
    const entry = state.ensureEntry(targetDate);
    const next = {
      ...entry,
      water: {
        ...entry.water,
        current: Math.max(0, entry.water.current + amount),
      },
      updatedAt: Date.now(),
    };
    const entries = { ...state.entries, [targetDate]: next };
    set({ entries });
    await persistState({ entries, preferences: state.preferences });
  },

  async setWater(value, date) {
    const state = get();
    const targetDate = date ?? getDateKey();
    const entry = state.ensureEntry(targetDate);
    const next = {
      ...entry,
      water: {
        ...entry.water,
        current: Math.max(0, value),
      },
      updatedAt: Date.now(),
    };
    const entries = { ...state.entries, [targetDate]: next };
    set({ entries });
    await persistState({ entries, preferences: state.preferences });
  },

  async setWaterTarget(target) {
    const state = get();
    const safeTarget = sanitizeTarget(target, state.preferences.waterTarget, 1);
    const preferences = { ...state.preferences, waterTarget: safeTarget };

    // Update today's target so progress bar reflects immediately
    const todayKey = getDateKey();
    const todayEntry = state.ensureEntry(todayKey);
    const updatedToday = {
      ...todayEntry,
      water: { ...todayEntry.water, target: safeTarget },
      updatedAt: Date.now(),
    };

    const entries = { ...state.entries, [todayKey]: updatedToday };
    set({ preferences, entries });
    await persistState({ entries, preferences });
  },

  async setReadingIncrement(increment) {
    const state = get();
    const readingIncrement = sanitizeIncrement(increment, state.preferences.readingIncrement);
    const preferences = { ...state.preferences, readingIncrement };
    set({ preferences });
    await persistState({ entries: state.entries, preferences });
  },

  async setWaterIncrement(increment) {
    const state = get();
    const waterIncrement = sanitizeIncrement(increment, state.preferences.waterIncrement);
    const preferences = { ...state.preferences, waterIncrement };
    set({ preferences });
    await persistState({ entries: state.entries, preferences });
  },

  async logReading(amount, date) {
    const state = get();
    const targetDate = date ?? getDateKey();
    const entry = state.ensureEntry(targetDate);
    const next = {
      ...entry,
      reading: {
        ...entry.reading,
        current: Math.max(0, entry.reading.current + amount),
      },
      updatedAt: Date.now(),
    };
    const entries = { ...state.entries, [targetDate]: next };
    set({ entries });
    await persistState({ entries, preferences: state.preferences });
  },

  async setReading(value, date) {
    const state = get();
    const targetDate = date ?? getDateKey();
    const entry = state.ensureEntry(targetDate);
    const next = {
      ...entry,
      reading: {
        ...entry.reading,
        current: Math.max(0, value),
      },
      updatedAt: Date.now(),
    };
    const entries = { ...state.entries, [targetDate]: next };
    set({ entries });
    await persistState({ entries, preferences: state.preferences });
  },

  async setReadingTarget(target) {
    const state = get();
    const safeTarget = sanitizeTarget(target, state.preferences.readingTarget, 1);
    const preferences = { ...state.preferences, readingTarget: safeTarget };

    const todayKey = getDateKey();
    const todayEntry = state.ensureEntry(todayKey);
    const updatedToday = {
      ...todayEntry,
      reading: { ...todayEntry.reading, target: safeTarget },
      updatedAt: Date.now(),
    };

    const entries = { ...state.entries, [todayKey]: updatedToday };
    set({ preferences, entries });
    await persistState({ entries, preferences });
  },

  async setReadingUnit(unit) {
    const state = get();
    const preferences = { ...state.preferences, readingUnit: unit };

    const todayKey = getDateKey();
    const todayEntry = state.ensureEntry(todayKey);
    const updatedToday = {
      ...todayEntry,
      reading: { ...todayEntry.reading, unit },
      updatedAt: Date.now(),
    };

    const entries = { ...state.entries, [todayKey]: updatedToday };
    set({ preferences, entries });
    await persistState({ entries, preferences });
  },

  async toggleGym(date) {
    const state = get();
    const targetDate = date ?? getDateKey();
    const entry = state.ensureEntry(targetDate);
    const next = {
      ...entry,
      gym: {
        ...entry.gym,
        completed: !entry.gym.completed,
      },
      updatedAt: Date.now(),
    };
    const entries = { ...state.entries, [targetDate]: next };
    set({ entries });
    await persistState({ entries, preferences: state.preferences });
  },

  async setGymCompleted(completed, date) {
    const state = get();
    const targetDate = date ?? getDateKey();
    const entry = state.ensureEntry(targetDate);
    const next = {
      ...entry,
      gym: {
        ...entry.gym,
        completed,
      },
      updatedAt: Date.now(),
    };
    const entries = { ...state.entries, [targetDate]: next };
    set({ entries });
    await persistState({ entries, preferences: state.preferences });
  },

  async setGymTarget(target) {
    const state = get();
    const safeTarget = sanitizeTarget(target, state.preferences.gymTarget, 1);
    const preferences = { ...state.preferences, gymTarget: safeTarget };

    const todayKey = getDateKey();
    const todayEntry = state.ensureEntry(todayKey);
    const updatedToday = {
      ...todayEntry,
      gym: { ...todayEntry.gym, target: safeTarget },
      updatedAt: Date.now(),
    };

    const entries = { ...state.entries, [todayKey]: updatedToday };
    set({ preferences, entries });
    await persistState({ entries, preferences });
  },

  async setHydrationReminderEnabled(enabled) {
    const state = get();
    const preferences = { ...state.preferences, hydrationReminderEnabled: enabled };
    set({ preferences });
    await persistState({ entries: state.entries, preferences });
  },

  async setHydrationReminderTimes(times) {
    const state = get();
    const hydrationReminderTimes = sanitizeTimes(times, state.preferences.hydrationReminderTimes);
    const preferences = { ...state.preferences, hydrationReminderTimes };
    set({ preferences });
    await persistState({ entries: state.entries, preferences });
  },

  async setReadingReminderEnabled(enabled) {
    const state = get();
    const preferences = { ...state.preferences, readingReminderEnabled: enabled };
    set({ preferences });
    await persistState({ entries: state.entries, preferences });
  },

  async setReadingReminderTime(time) {
    const state = get();
    const sanitized = sanitizeTimes([time], [state.preferences.readingReminderTime])[0]!;
    const preferences = { ...state.preferences, readingReminderTime: sanitized };
    set({ preferences });
    await persistState({ entries: state.entries, preferences });
  },

  async clearHistory() {
    const state = get();
    const todayKey = getDateKey();
    const todayEntry = createEntry(todayKey, state.preferences);
    const entries = { [todayKey]: todayEntry };
    set({ entries });
    await persistState({ entries, preferences: state.preferences });
  },
}));

export const getTodayKey = getDateKey;

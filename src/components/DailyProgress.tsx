import { useEffect, useMemo, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Droplets, BookOpen, Dumbbell, Sparkles, Plus, X } from "lucide-react";
import {
  useDailyProgress,
  getTodayKey,
  type DailyMetrics,
  type ReadingUnit,
} from "../store/dailyProgress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

const unitLabel: Record<ReadingUnit, string> = {
  minutes: "minutes",
  pages: "pages",
};

const formatDateLabel = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year!, (month ?? 1) - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const withinCurrentWeek = (entryDate: string) => {
  const entry = new Date(entryDate);
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = today.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = (day + 6) % 7; // convert to Monday start
  startOfWeek.setDate(today.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return entry >= startOfWeek && entry < endOfWeek;
};

const toDateFromKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
};

const dayDiff = (a: Date, b: Date) => {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  const diff = (start.getTime() - end.getTime()) / 86_400_000;
  return Math.trunc(diff);
};

const calculateStreak = (entries: DailyMetrics[], predicate: (entry: DailyMetrics) => boolean) => {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let lastDate: Date | null = null;

  for (const entry of sorted) {
    const entryDate = toDateFromKey(entry.date);

    if (lastDate === null) {
      if (!predicate(entry)) break;
      streak = 1;
      lastDate = entryDate;
      continue;
    }

    const diff = dayDiff(lastDate, entryDate);
    if (diff === 0) {
      // Multiple entries per day are merged implicitly.
      continue;
    }

    if (diff === 1 && predicate(entry)) {
      streak += 1;
      lastDate = entryDate;
      continue;
    }

    break;
  }

  return streak;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type SettingsView = "water" | "reading" | "gym" | null;

export default function DailyProgress() {
  const {
    load,
    loaded,
    entries,
    preferences,
    addWater,
    setWaterTarget,
    setWaterIncrement,
    logReading,
    setReadingTarget,
    setReadingUnit,
    setReadingIncrement,
    toggleGym,
    setGymTarget,
    setHydrationReminderEnabled,
    setHydrationReminderTimes,
    setReadingReminderEnabled,
    setReadingReminderTime,
  } = useDailyProgress();

  const [settingsView, setSettingsView] = useState<SettingsView>(null);
  const [waterTargetDraft, setWaterTargetDraft] = useState(preferences.waterTarget);
  const [waterIncrementDraft, setWaterIncrementDraft] = useState(preferences.waterIncrement);
  const [readingTargetDraft, setReadingTargetDraft] = useState(preferences.readingTarget);
  const [readingUnitDraft, setReadingUnitDraft] = useState<ReadingUnit>(preferences.readingUnit);
  const [gymTargetDraft, setGymTargetDraft] = useState(preferences.gymTarget);
  const [hydrationEnabledDraft, setHydrationEnabledDraft] = useState(
    preferences.hydrationReminderEnabled
  );
  const [hydrationTimesDraft, setHydrationTimesDraft] = useState(
    preferences.hydrationReminderTimes
  );
  const [readingIncrementDraft, setReadingIncrementDraft] = useState(preferences.readingIncrement);
  const [readingEnabledDraft, setReadingEnabledDraft] = useState(
    preferences.readingReminderEnabled
  );
  const [readingReminderTimeDraft, setReadingReminderTimeDraft] = useState(
    preferences.readingReminderTime
  );

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [load, loaded]);

  useEffect(() => {
    setWaterTargetDraft(preferences.waterTarget);
    setWaterIncrementDraft(preferences.waterIncrement);
    setReadingTargetDraft(preferences.readingTarget);
    setReadingUnitDraft(preferences.readingUnit);
    setGymTargetDraft(preferences.gymTarget);
    setHydrationEnabledDraft(preferences.hydrationReminderEnabled);
    setHydrationTimesDraft(preferences.hydrationReminderTimes);
    setReadingIncrementDraft(preferences.readingIncrement);
    setReadingEnabledDraft(preferences.readingReminderEnabled);
    setReadingReminderTimeDraft(preferences.readingReminderTime);
  }, [preferences]);

  const todayKey = getTodayKey();
  const today = entries[todayKey];

  const recentEntries = useMemo(() => {
    const values = Object.values(entries);
    return values.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  }, [entries]);

  const allEntries = useMemo(() => Object.values(entries), [entries]);

  const weeklyGymCount = useMemo(() => {
    return Object.values(entries).filter(e => withinCurrentWeek(e.date) && e.gym.completed).length;
  }, [entries]);

  const hydrationStreak = useMemo(
    () =>
      calculateStreak(
        allEntries,
        entry => entry.water.target > 0 && entry.water.current >= entry.water.target
      ),
    [allEntries]
  );

  const readingStreak = useMemo(
    () =>
      calculateStreak(
        allEntries,
        entry => entry.reading.target > 0 && entry.reading.current >= entry.reading.target
      ),
    [allEntries]
  );

  const gymStreak = useMemo(
    () => calculateStreak(allEntries, entry => entry.gym.completed),
    [allEntries]
  );

  const quickReadingAdd = useMemo(
    () => Math.max(5, Math.round(preferences.readingIncrement / 2)),
    [preferences.readingIncrement]
  );

  if (!today) {
    return null;
  }

  const waterPercent = today.water.target
    ? clamp((today.water.current / today.water.target) * 100, 0, 120)
    : 0;
  const readingPercent = today.reading.target
    ? clamp((today.reading.current / today.reading.target) * 100, 0, 120)
    : 0;
  const waterIncrementLabel = preferences.waterIncrement === 1 ? "cup" : "cups";
  const handleHydrationTimeChange = (index: number, value: string) => {
    setHydrationTimesDraft(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };
  const addHydrationTime = () => {
    setHydrationTimesDraft(prev => {
      if (prev.length >= 6) return prev;
      return [...prev, "12:00"];
    });
  };
  const removeHydrationTime = (index: number) => {
    setHydrationTimesDraft(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
      <motion.div
        className="grid gap-4 sm:grid-cols-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Droplets className="h-5 w-5 text-sky-500" />
              Hydration
            </CardTitle>
            <CardDescription>Keep sipping throughout the day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-semibold text-foreground">
                {today.water.current}
                <span className="text-base font-normal text-muted-foreground">
                  /{today.water.target}
                </span>
              </span>
              <Badge variant={waterPercent >= 100 ? "success" : "secondary"}>
                {waterPercent >= 100 ? "Goal met" : `${Math.round(waterPercent)}%`}
              </Badge>
            </div>
            <Progress value={waterPercent} />
            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary" size="sm" onClick={() => addWater(-1)}>
                −1 cup
              </Button>
              <Button size="sm" onClick={() => addWater(preferences.waterIncrement)}>
                +{preferences.waterIncrement} {waterIncrementLabel}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSettingsView("water")}>
                Adjust goal
              </Button>
            </div>
            {preferences.hydrationReminderEnabled && (
              <p className="text-xs text-muted-foreground">
                Reminders at {preferences.hydrationReminderTimes.join(" • ")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Reading
            </CardTitle>
            <CardDescription>Build knowledge one session at a time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-semibold text-foreground">
                {today.reading.current}
                <span className="text-base font-normal text-muted-foreground">
                  /{today.reading.target} {unitLabel[today.reading.unit]}
                </span>
              </span>
              <Badge variant={readingPercent >= 100 ? "success" : "secondary"}>
                {readingPercent >= 100 ? "Goal met" : `${Math.round(readingPercent)}%`}
              </Badge>
            </div>
            <Progress value={readingPercent} />
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="secondary" onClick={() => logReading(quickReadingAdd)}>
                +{quickReadingAdd} {unitLabel[today.reading.unit]}
              </Button>
              <Button size="sm" onClick={() => logReading(preferences.readingIncrement)}>
                +{preferences.readingIncrement} {unitLabel[today.reading.unit]}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSettingsView("reading")}>
                Adjust goal
              </Button>
            </div>
            {preferences.readingReminderEnabled && (
              <p className="text-xs text-muted-foreground">
                Reminder at {preferences.readingReminderTime}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Dumbbell className="h-5 w-5 text-emerald-500" />
              Gym & Movement
            </CardTitle>
            <CardDescription>Track workouts and keep your streak alive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Badge variant={today.gym.completed ? "success" : "outline"}>
                  {today.gym.completed ? "Completed" : "Pending"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Weekly goal: {weeklyGymCount}/{preferences.gymTarget} sessions
                </span>
              </div>
              <Button
                size="sm"
                variant={today.gym.completed ? "secondary" : "default"}
                onClick={() => toggleGym()}
              >
                {today.gym.completed ? "Marked done" : "Mark as done"}
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {recentEntries
                .slice()
                .reverse()
                .map(entry => (
                  <motion.div
                    key={entry.date}
                    className="flex flex-col items-center gap-1"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <span className="text-[11px] text-muted-foreground">
                      {formatDateLabel(entry.date).split(" ")[0]}
                    </span>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ${
                        entry.gym.completed
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                          : "border-muted bg-muted text-muted-foreground"
                      }`}
                    >
                      {entry.gym.completed ? "✓" : "—"}
                    </div>
                  </motion.div>
                ))}
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setSettingsView("gym")}>
                Tweak weekly goal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-primary" />
              Recent Progress Highlights
            </CardTitle>
            <CardDescription>
              Snapshot of the last few days to keep momentum going
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <StreakBadge icon={Droplets} label="Hydration" value={hydrationStreak} />
              <StreakBadge icon={BookOpen} label="Reading" value={readingStreak} />
              <StreakBadge icon={Dumbbell} label="Movement" value={gymStreak} />
            </div>
            <div className="grid gap-2">
              {recentEntries.map(entry => (
                <HighlightRow key={entry.date} entry={entry} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Sheet open={settingsView !== null} onOpenChange={open => !open && setSettingsView(null)}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>
              {settingsView === "water" && "Hydration goal"}
              {settingsView === "reading" && "Reading goal"}
              {settingsView === "gym" && "Weekly gym target"}
            </SheetTitle>
            <SheetDescription>
              Tailor your targets so they match the day you have ahead.
            </SheetDescription>
          </SheetHeader>

          {settingsView === "water" && (
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="water-target">
                  Daily cups
                </label>
                <input
                  id="water-target"
                  type="number"
                  min={1}
                  className="input"
                  value={waterTargetDraft}
                  onChange={event => setWaterTargetDraft(Number(event.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="water-increment">
                  Quick add increment
                </label>
                <input
                  id="water-increment"
                  type="number"
                  min={1}
                  className="input"
                  value={waterIncrementDraft}
                  onChange={event => setWaterIncrementDraft(Number(event.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  We&apos;ll use this value when you tap the + button on the hydration card.
                </p>
              </div>

              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Hydration reminders</p>
                    <p className="text-xs text-muted-foreground">
                      Gentle nudges throughout the day. Works best when installed as an app.
                    </p>
                  </div>
                  <Switch
                    checked={hydrationEnabledDraft}
                    onCheckedChange={checked => setHydrationEnabledDraft(Boolean(checked))}
                    aria-label="Toggle hydration reminders"
                  />
                </div>

                {hydrationEnabledDraft && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Times are based on your local timezone.
                    </p>
                    <div className="space-y-2">
                      {hydrationTimesDraft.map((time, index) => (
                        <div className="flex items-center gap-2" key={`${time}-${index}`}>
                          <input
                            type="time"
                            className="input"
                            value={time}
                            onChange={event => handleHydrationTimeChange(index, event.target.value)}
                          />
                          {hydrationTimesDraft.length > 1 && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label="Remove reminder time"
                              onClick={() => removeHydrationTime(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {hydrationTimesDraft.length < 6 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                        onClick={addHydrationTime}
                      >
                        <Plus className="h-4 w-4" />
                        Add reminder time
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {settingsView === "reading" && (
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="reading-target">
                  Daily target
                </label>
                <input
                  id="reading-target"
                  type="number"
                  min={5}
                  className="input"
                  value={readingTargetDraft}
                  onChange={event => setReadingTargetDraft(Number(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="reading-unit">
                  Measurement
                </label>
                <select
                  id="reading-unit"
                  className="input"
                  value={readingUnitDraft}
                  onChange={event => setReadingUnitDraft(event.target.value as ReadingUnit)}
                >
                  <option value="minutes">Minutes</option>
                  <option value="pages">Pages</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="reading-increment">
                  Quick add increment
                </label>
                <input
                  id="reading-increment"
                  type="number"
                  min={1}
                  className="input"
                  value={readingIncrementDraft}
                  onChange={event => setReadingIncrementDraft(Number(event.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Determines how much progress is added when you tap the second + button.
                </p>
              </div>

              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Reading reminder</p>
                    <p className="text-xs text-muted-foreground">
                      A single notification to protect your evening learning ritual.
                    </p>
                  </div>
                  <Switch
                    checked={readingEnabledDraft}
                    onCheckedChange={checked => setReadingEnabledDraft(Boolean(checked))}
                    aria-label="Toggle reading reminder"
                  />
                </div>

                {readingEnabledDraft && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="reading-reminder-time">
                      Reminder time
                    </label>
                    <input
                      id="reading-reminder-time"
                      type="time"
                      className="input"
                      value={readingReminderTimeDraft}
                      onChange={event => setReadingReminderTimeDraft(event.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: choose a time when you&apos;re unwinding—Capacitor delivers in local time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {settingsView === "gym" && (
            <div className="space-y-4 mt-6">
              <label className="text-sm font-medium text-foreground" htmlFor="gym-target">
                Sessions per week
              </label>
              <input
                id="gym-target"
                type="number"
                min={1}
                className="input"
                value={gymTargetDraft}
                onChange={event => setGymTargetDraft(Number(event.target.value))}
              />
            </div>
          )}

          <SheetFooter className="mt-8">
            <Button variant="outline" onClick={() => setSettingsView(null)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (settingsView === "water") {
                  await setWaterTarget(waterTargetDraft);
                  await setWaterIncrement(waterIncrementDraft);
                  await setHydrationReminderTimes(hydrationTimesDraft);
                  await setHydrationReminderEnabled(hydrationEnabledDraft);
                } else if (settingsView === "reading") {
                  await setReadingTarget(readingTargetDraft);
                  await setReadingUnit(readingUnitDraft);
                  await setReadingIncrement(readingIncrementDraft);
                  await setReadingReminderTime(readingReminderTimeDraft);
                  await setReadingReminderEnabled(readingEnabledDraft);
                } else if (settingsView === "gym") {
                  await setGymTarget(gymTargetDraft);
                }
                setSettingsView(null);
              }}
            >
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

function HighlightRow({ entry }: { entry: DailyMetrics }) {
  const waterStatus = entry.water.current >= entry.water.target ? "✅" : "💧";
  const readingStatus = entry.reading.current >= entry.reading.target ? "📚" : "🕒";
  const gymStatus = entry.gym.completed ? "🏋️‍♂️" : "⏳";

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{formatDateLabel(entry.date)}</p>
        <p className="text-xs text-muted-foreground">
          Water {entry.water.current}/{entry.water.target} · Reading {entry.reading.current}/
          {entry.reading.target} {unitLabel[entry.reading.unit]}
        </p>
      </div>
      <div className="flex items-center gap-2 text-lg">
        <span role="img" aria-label="Water status">
          {waterStatus}
        </span>
        <span role="img" aria-label="Reading status">
          {readingStatus}
        </span>
        <span role="img" aria-label="Gym status">
          {gymStatus}
        </span>
      </div>
    </div>
  );
}

interface StreakBadgeProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
}

function StreakBadge({ icon: Icon, label, value }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">
          {value} day{value === 1 ? "" : "s"} streak
        </p>
      </div>
    </div>
  );
}

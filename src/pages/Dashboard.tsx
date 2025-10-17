import { useEffect, useMemo } from "react";
import { useActivities } from "../store/activities";
import { Card } from "../components/ui/card";
import PageShell from "../components/PageShell";
import DailyProgress from "../components/DailyProgress";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Stat = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) => (
  <Card className="p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`mt-1 text-2xl font-bold ${accent ?? ""}`}>{value}</p>
  </Card>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { load, items, loaded } = useActivities();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const total = items.length;
  const done = items.filter(i => i.status === "Done").length;
  const pending = total - done;
  const completionRate = total ? Math.round((done / total) * 100) : 0;
  const recent = useMemo(
    () =>
      [...items]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 4),
    [items]
  );
  const focusList = useMemo(() => items.filter(i => i.status === "Pending").slice(0, 3), [items]);
  const categories = useMemo(() => {
    const counts = new Map<string, { total: number; done: number }>();
    items.forEach(item => {
      const stats = counts.get(item.category) ?? { total: 0, done: 0 };
      stats.total += 1;
      if (item.status === "Done") stats.done += 1;
      counts.set(item.category, stats);
    });
    return Array.from(counts.entries());
  }, [items]);

  return (
    <PageShell>
      <div className="grid gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-primary/10 border border-primary/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge className="mb-2 bg-primary text-primary-foreground">Today</Badge>
              <h2 className="text-2xl font-bold text-foreground">Daily Progress Overview</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-[520px]">
                Keep tabs on habits that move the needle—hydrate, read, and stay active. Everything
                syncs locally so you can pick up right where you left off.
              </p>
            </div>
            <Button variant="secondary" className="gap-2" onClick={() => navigate("/activities")}>
              Go to Activities
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <DailyProgress />

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Total Activities" value={total} />
          <Stat label="Completed" value={done} accent="text-emerald-600" />
          <Stat label="Pending" value={pending} accent="text-orange-600" />
          <Stat label="Completion Rate" value={`${completionRate}%`} accent="text-primary" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Focus for Today</h3>
            {focusList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up—add new activities to keep the streak going.
              </p>
            ) : (
              <div className="grid gap-3">
                {focusList.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.category}</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Latest Wins</h3>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing yet—create an activity to start seeing your wins appear here.
              </p>
            ) : (
              <div className="grid gap-3">
                {recent.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.category} ·{" "}
                        {activity.status === "Done" ? "Completed" : "In progress"}
                      </p>
                    </div>
                    <Badge variant={activity.status === "Done" ? "success" : "secondary"}>
                      {activity.status === "Done" ? "Done" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Categories will appear automatically as you create activities.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(([category, stats]) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">{category}</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.done}/{stats.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}

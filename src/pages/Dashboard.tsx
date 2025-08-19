import { useEffect } from "react";
import { useActivities } from "../store/activities";
import { Card } from "../components/ui/card";

const Stat = ({label, value, accent}: {label: string; value: string | number; accent?: string}) => (
  <Card className="p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`mt-1 text-2xl font-bold ${accent ?? ""}`}>{value}</p>
  </Card>
);

export default function Dashboard() {
  const { load, items, loaded } = useActivities();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const total = items.length;
  const done = items.filter(i => i.status === "Done").length;
  const pending = total - done;
  const completionRate = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="container-app grid gap-6 pt-5 pb-24">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Track your progress across all categories</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Total Activities" value={total}/>
        <Stat label="Completed" value={done} accent="text-emerald-600"/>
        <Stat label="Pending" value={pending} accent="text-orange-600"/>
        <Stat label="Completion Rate" value={`${completionRate}%`} accent="text-primary"/>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Physical",
            "Mental",
            "Career",
            "Languages",
            "Knowledge",
            "Prayers",
            "Organization",
          ].map(category => {
            const categoryItems = items.filter(i => i.category === category);
            const categoryDone = categoryItems.filter(i => i.status === "Done").length;
            return (
              <div
                key={category}
                className="flex items-center justify-between p-4 bg-muted rounded-lg min-h-[44px]"
              >
                <span className="text-sm font-medium">{category}</span>
                <span className="text-sm text-muted-foreground">
                  {categoryDone}/{categoryItems.length}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}

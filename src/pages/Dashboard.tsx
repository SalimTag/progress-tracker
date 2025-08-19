import { useEffect } from "react";
import { useActivities } from "../store/activities";

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
    <section className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Track your progress across all categories</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <p className="text-sm font-medium text-gray-500">Total Activities</p>
          <p className="text-2xl lg:text-3xl font-bold mt-2">{total}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <p className="text-sm font-medium text-gray-500">Completed</p>
          <p className="text-2xl lg:text-3xl font-bold text-green-600 mt-2">{done}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <p className="text-2xl lg:text-3xl font-bold text-orange-600 mt-2">{pending}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <p className="text-sm font-medium text-gray-500">Completion Rate</p>
          <p className="text-2xl lg:text-3xl font-bold text-sky-600 mt-2">{completionRate}%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 scroll">
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
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[44px]"
              >
                <span className="text-sm font-medium">{category}</span>
                <span className="text-sm text-gray-500">
                  {categoryDone}/{categoryItems.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

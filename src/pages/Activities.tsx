import { useEffect, useState } from "react";
import { useActivities, type Category } from "../store/activities";

const CATEGORIES: Category[] = [
  "Physical",
  "Mental",
  "Career",
  "Languages",
  "Knowledge",
  "Prayers",
  "Organization",
];

export default function Activities() {
  const { load, items, loaded, add, toggle, remove } = useActivities();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Physical");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await add({ name: trimmed, category, amount: amount.trim() || undefined });
    setName("");
    setAmount("");
  };

  const filterOptions = ["All", "Done", "Pending", ...CATEGORIES];

  const filtered = items.filter(it => {
    if (filter === "All") return true;
    if (filter === "Done" || filter === "Pending") return it.status === filter;
    return it.category === filter;
  });

  return (
    <section className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Activities</h2>
        <p className="text-sm text-gray-500 mt-1">Add and manage your daily activities</p>
      </div>

      <form
        onSubmit={submit}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 grid gap-4"
      >
        <h3 className="text-lg font-semibold">Add New Activity</h3>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Activity Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 h-11 text-[16px]"
              placeholder="e.g., German study, Workout"
              value={name}
              onChange={e => setName(e.target.value)}
              autoCapitalize="sentences"
              autoCorrect="on"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 h-11 text-[16px]"
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount (Optional)</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 h-11 text-[16px]"
              placeholder="e.g., 30 min, 10 pages"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoCapitalize="sentences"
              autoCorrect="on"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 h-11 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Add Activity
        </button>
      </form>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} activities shown</p>
        <select
          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 h-11 text-sm"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          {filterOptions.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No activities found.</p>
          {filter !== "All" && (
            <button
              onClick={() => setFilter("All")}
              className="mt-2 text-sky-600 hover:underline h-11 px-4"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <ul className="grid gap-3 scroll">
          {filtered.map(it => (
            <li
              key={it.id}
              className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={it.status === "Done"}
                  onChange={() => toggle(it.id)}
                  className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <p
                    className={`font-medium ${it.status === "Done" ? "line-through text-gray-500" : ""}`}
                  >
                    {it.name}
                    <span className="text-xs text-gray-500 ml-2">({it.category})</span>
                  </p>
                  {it.amount && <p className="text-xs text-gray-500">{it.amount}</p>}
                </div>
              </div>
              <button
                className="text-red-600 hover:text-red-700 text-sm font-medium h-11 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => remove(it.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { useEffect, useState } from "react";
import { useActivities, type Category } from "../store/activities";

const CATEGORIES: Category[] = ["Physical", "Mental", "Career", "Languages", "Knowledge", "Prayers", "Organization"];

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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Activities</h2>
        <p className="text-sm text-zinc-500 mt-1">Add and manage your daily activities</p>
      </div>

      <form onSubmit={submit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 grid gap-4">
        <h3 className="text-lg font-semibold">Add New Activity</h3>
        
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Activity Name</label>
            <input 
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2" 
              placeholder="e.g., German study, Workout"
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select 
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2" 
              value={category} 
              onChange={e => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Amount (Optional)</label>
            <input 
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2" 
              placeholder="e.g., 30 min, 10 pages"
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
            />
          </div>
        </div>
        
        <button 
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition-colors"
        >
          Add Activity
        </button>
      </form>

      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{filtered.length} activities shown</p>
        <select 
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm" 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
        >
          {filterOptions.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p>No activities found.</p>
          {filter !== "All" && (
            <button 
              onClick={() => setFilter("All")} 
              className="mt-2 text-sky-600 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <ul className="grid gap-2">
          {filtered.map(it => (
            <li key={it.id} className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={it.status === "Done"} 
                  onChange={() => toggle(it.id)}
                  className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <p className={`font-medium ${it.status === "Done" ? "line-through text-zinc-500" : ""}`}>
                    {it.name} 
                    <span className="text-xs text-zinc-500 ml-2">({it.category})</span>
                  </p>
                  {it.amount && <p className="text-xs text-zinc-500">{it.amount}</p>}
                </div>
              </div>
              <button 
                className="text-red-600 hover:text-red-700 text-sm font-medium"
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

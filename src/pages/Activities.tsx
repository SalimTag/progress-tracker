import { useEffect, useState } from "react";
import { useActivities, type Category } from "../store/activities";
import { useNativeFeatures, ImpactStyle } from "../hooks/useNativeFeatures";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import FAB from "../components/FAB";
import { useToast } from "../hooks/useToast";
import { TrashIcon } from "@heroicons/react/24/outline";
import PageShell from "../components/PageShell";

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
  const { hapticImpact, hapticSelection } = useNativeFeatures();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Physical");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAddSheet, setShowAddSheet] = useState(false);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    await hapticImpact(ImpactStyle.Light);
    await add({ name: trimmed, category, amount: amount.trim() || undefined });
    setName("");
    setAmount("");
    setShowAddSheet(false);
    toast({
      title: "Activity added",
      description: `${trimmed} has been added to your activities.`,
    });
  };

  const handleDelete = async (id: string, activityName: string) => {
    await hapticImpact(ImpactStyle.Medium);
    remove(id);
    toast({
      title: "Activity deleted",
      description: `${activityName} has been removed.`,
    });
  };

  const handleToggle = async (id: string) => {
    await hapticSelection();
    toggle(id);
  };

  const filterOptions = ["All", "Done", "Pending", ...CATEGORIES];

  const filtered = items.filter(it => {
    if (filter === "All") return true;
    if (filter === "Done" || filter === "Pending") return it.status === filter;
    return it.category === filter;
  });

  return (
    <PageShell className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Activities</h2>
        <p className="text-sm text-muted-foreground mt-1">Add and manage your daily activities</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">{filtered.length} activities shown</p>
        <select
          className="input text-sm max-w-[120px]"
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
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No activities found.</p>
          {filter !== "All" && (
            <Button variant="ghost" onClick={() => setFilter("All")} className="mt-4">
              Clear filter
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(it => (
            <Card key={it.id} className="flex items-center justify-between px-4 py-3 min-h-[60px]">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={it.status === "Done"}
                  onChange={() => handleToggle(it.id)}
                  className="h-5 w-5 rounded border-input text-primary focus:ring-primary touch-manipulation flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-medium text-sm break-words ${
                      it.status === "Done"
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {it.name}
                    <span className="text-xs text-muted-foreground ml-2 font-normal">
                      ({it.category})
                    </span>
                  </p>
                  {it.amount && <p className="text-xs text-muted-foreground mt-1">{it.amount}</p>}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${it.name}`}
                    className="text-destructive hover:text-destructive"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Activity</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete "{it.name}"? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive" onClick={() => handleDelete(it.id, it.name)}>
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>
      )}

      <FAB onClick={() => setShowAddSheet(true)} />

      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle>Add New Activity</SheetTitle>
            <SheetDescription>Create a new activity to track your progress.</SheetDescription>
          </SheetHeader>

          <form onSubmit={submit} className="grid gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Activity Name
              </label>
              <input
                className="input"
                placeholder="e.g., German study, Workout"
                value={name}
                onChange={e => setName(e.target.value)}
                autoCapitalize="sentences"
                autoCorrect="on"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
                <select
                  className="input"
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
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Amount (Optional)
                </label>
                <input
                  className="input"
                  placeholder="e.g., 30 min, 10 pages"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  autoCapitalize="sentences"
                  autoCorrect="on"
                />
              </div>
            </div>

            <SheetFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowAddSheet(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Activity</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

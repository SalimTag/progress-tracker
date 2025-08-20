import { useState, useEffect } from "react";
import localforage from "localforage";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { useToast } from "../hooks/useToast";
import PageShell from "../components/PageShell";

type Priority = "Low" | "Medium" | "High";
type Status = "todo" | "doing" | "done";

interface OrgTask {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  createdAt: number;
}

const TASKS_KEY = "organization.tasks.v1";

export default function Organization() {
  const [tasks, setTasks] = useState<OrgTask[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [loaded, setLoaded] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; taskId: string | null }>({
    open: false,
    taskId: null,
  });
  const { toast } = useToast();

  // Load tasks from localforage
  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await localforage.getItem<OrgTask[]>(TASKS_KEY);
      if (savedTasks) {
        setTasks(savedTasks);
      }
      setLoaded(true);
    };
    loadTasks();
  }, []);

  // Save tasks to localforage whenever they change
  useEffect(() => {
    if (loaded) {
      localforage.setItem(TASKS_KEY, tasks);
    }
  }, [tasks, loaded]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTask: OrgTask = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: description.trim() || undefined,
      status: "todo",
      priority,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setTitle("");
    setDescription("");
    setIsAddSheetOpen(false);

    // Haptic feedback for mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    toast({
      title: "Task created",
      description: `"${trimmedTitle}" has been added to your board.`,
    });
  };

  const moveTask = (id: string, status: Status) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));

    // Haptic feedback for mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }

    const statusLabels = { todo: "To Do", doing: "In Progress", done: "Done" };
    toast({
      title: "Task moved",
      description: `"${task.title}" moved to ${statusLabels[status]}.`,
    });
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(prev => prev.filter(t => t.id !== id));
    setDeleteDialog({ open: false, taskId: null });

    // Haptic feedback for mobile
    if ("vibrate" in navigator) {
      navigator.vibrate([50, 50, 50]);
    }

    toast({
      title: "Task deleted",
      description: `"${task.title}" has been removed from your board.`,
      variant: "destructive",
    });
  };

  const openDeleteDialog = (taskId: string) => {
    setDeleteDialog({ open: true, taskId });
  };

  const getPriorityVariant = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
    }
  };

  const Column = ({ label, status, color }: { label: string; status: Status; color: string }) => {
    const columnTasks = tasks.filter(t => t.status === status);

    return (
      <Card className="min-h-[400px]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-base ${color}`}>{label}</CardTitle>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {columnTasks.length}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <AnimatePresence>
            {columnTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant={getPriorityVariant(task.priority)}
                        size="sm"
                        className="text-xs h-6 px-2"
                        disabled
                      >
                        {task.priority}
                      </Button>

                      <div className="flex gap-1">
                        {status !== "todo" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveTask(task.id, "todo")}
                            className="text-xs h-6 px-2 hover:bg-muted"
                          >
                            <ArrowLeft className="h-3 w-3 mr-1" />
                            To Do
                          </Button>
                        )}
                        {status === "todo" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveTask(task.id, "doing")}
                            className="text-xs h-6 px-2 hover:bg-muted"
                          >
                            Start
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                        {status === "doing" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveTask(task.id, "done")}
                            className="text-xs h-6 px-2 hover:bg-muted"
                          >
                            Complete
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {columnTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-sm">No tasks yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <PageShell className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Organization</CardTitle>
            <CardDescription>
              Manage your tasks with a simple Kanban board. Stay organized and track your progress.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        className="grid lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Column label="To Do" status="todo" color="text-muted-foreground" />
        <Column label="In Progress" status="doing" color="text-blue-600 dark:text-blue-400" />
        <Column label="Done" status="done" color="text-green-600 dark:text-green-400" />
      </motion.div>
      {/* Floating Action Button */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetTrigger asChild>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="fixed bottom-20 right-4 z-50 rounded-full bg-primary text-primary-foreground p-4 shadow-lg min-h-[56px] min-w-[56px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors hover:bg-primary/90"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
            aria-label="Add new task"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Add New Task</SheetTitle>
            <SheetDescription>
              Create a new task for your Kanban board. Organize your work and stay productive.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={addTask} className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="task-title"
                  className="text-sm font-medium text-foreground block mb-2"
                >
                  Task Title *
                </label>
                <input
                  id="task-title"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g., Review German notes"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="task-description"
                  className="text-sm font-medium text-foreground block mb-2"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="task-description"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-none"
                  placeholder="Additional details about the task..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="task-priority"
                  className="text-sm font-medium text-foreground block mb-2"
                >
                  Priority
                </label>
                <select
                  id="task-priority"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={priority}
                  onChange={e => setPriority(e.target.value as Priority)}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={!title.trim()}>
                Add Task
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddSheetOpen(false)}>
                Cancel
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              💡 Tip: Use this board for planning, time management, or organizing your thoughts
            </p>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open: boolean) => !open && setDeleteDialog({ open: false, taskId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, taskId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.taskId && deleteTask(deleteDialog.taskId)}
            >
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

import { useState, useEffect } from "react";
import localforage from "localforage";

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
  };

  const moveTask = (id: string, status: Status) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 dark:bg-red-950";
      case "Medium":
        return "text-orange-600 bg-orange-50 dark:bg-orange-950";
      case "Low":
        return "text-green-600 bg-green-50 dark:bg-green-950";
    }
  };

  const Column = ({ label, status, color }: { label: string; status: Status; color: string }) => {
    const columnTasks = tasks.filter(t => t.status === status);

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${color}`}>{label}</h3>
          <span className="text-sm text-gray-500">{columnTasks.length}</span>
        </div>

        <div className="grid gap-2">
          {columnTasks.map(task => (
            <div
              key={task.id}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm">{task.title}</h4>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-600 text-xs"
                >
                  ×
                </button>
              </div>

              {task.description && <p className="text-xs text-gray-500 mb-2">{task.description}</p>}

              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </span>

                <div className="flex gap-1">
                  {status !== "todo" && (
                    <button
                      onClick={() => moveTask(task.id, "todo")}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      To Do
                    </button>
                  )}
                  {status !== "doing" && (
                    <button
                      onClick={() => moveTask(task.id, "doing")}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Doing
                    </button>
                  )}
                  {status !== "done" && (
                    <button
                      onClick={() => moveTask(task.id, "done")}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Organization</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your tasks with a simple Kanban board</p>
      </div>

      <form
        onSubmit={addTask}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 grid gap-4"
      >
        <h3 className="text-lg font-semibold">Add New Task</h3>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Task Title</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2"
              placeholder="e.g., Review German notes"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2"
              placeholder="Additional details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2"
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition-colors"
        >
          Add Task
        </button>

        <p className="text-xs text-gray-500">
          💡 Tip: Use this board for planning, time management, or organizing your thoughts
        </p>
      </form>

      <div className="grid lg:grid-cols-3 gap-4">
        <Column label="To Do" status="todo" color="text-gray-700 dark:text-gray-300" />
        <Column label="In Progress" status="doing" color="text-sky-600" />
        <Column label="Done" status="done" color="text-green-600" />
      </div>
    </section>
  );
}

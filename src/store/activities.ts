import { create } from "zustand";
import localforage from "localforage";

export type Category = "Physical" | "Mental" | "Career" | "Languages" | "Knowledge" | "Prayers" | "Organization";
export type Status = "Pending" | "Done";

export interface Activity {
  id: string;
  name: string;
  category: Category;
  amount?: string;
  status: Status;
  createdAt: number;
}

interface State {
  items: Activity[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (a: Omit<Activity, "id" | "status" | "createdAt">) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const KEY = "activities.v1";

export const useActivities = create<State>((set, get) => ({
  items: [],
  loaded: false,

  async load() {
    const data = (await localforage.getItem<Activity[]>(KEY)) ?? [];
    set({ items: data, loaded: true });
  },

  async add(a) {
    const newItem: Activity = { 
      id: crypto.randomUUID(), 
      status: "Pending" as Status, 
      createdAt: Date.now(), 
      ...a 
    };
    const next = [newItem, ...get().items];
    await localforage.setItem(KEY, next);
    set({ items: next });
  },

  async toggle(id) {
    const next = get().items.map(it => 
      it.id === id 
        ? { ...it, status: (it.status === "Done" ? "Pending" : "Done") as Status } 
        : it
    );
    await localforage.setItem(KEY, next);
    set({ items: next });
  },

  async remove(id) {
    const next = get().items.filter(it => it.id !== id);
    await localforage.setItem(KEY, next);
    set({ items: next });
  },

  async clearAll() {
    await localforage.setItem(KEY, []);
    set({ items: [] });
  }
}));

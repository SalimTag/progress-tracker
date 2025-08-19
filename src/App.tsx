import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import BottomTab from "./components/BottomTab";

// Lazy load routes for better performance on mobile
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Activities = lazy(() => import("./pages/Activities"));
const Organization = lazy(() => import("./pages/Organization"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <div className="min-h-[100svh] flex flex-col bg-gray-50 dark:bg-gray-950">
      <header
        className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                Progress Tracker
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 grow pt-6 pb-24 grid gap-6">
        <Suspense fallback={<div className="p-4 text-center text-gray-500">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <BottomTab />
    </div>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import BottomTab from "./components/BottomTab";
import { Toaster } from "./components/Toaster";
import ThemeToggle from "./components/ThemeToggle";

// Lazy load routes for better performance on mobile
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Activities = lazy(() => import("./pages/Activities"));
const Organization = lazy(() => import("./pages/Organization"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <div className="min-h-screen-mobile bg-white dark:bg-slate-900">
      {/* Header - simplified for mobile */}
      <header className="safe-area-top bg-card border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h1 className="text-lg font-bold text-foreground">
              Progress Tracker
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content area with bottom navigation spacing */}
      <main className="pb-nav safe-area-left safe-area-right">
        <div className="container-app py-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-40">
              <div className="text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm">Loading…</p>
              </div>
            </div>
          }>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </div>
      </main>

      <BottomTab />
      <Toaster />
    </div>
  );
}

export default App;

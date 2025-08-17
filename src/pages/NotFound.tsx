import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">404</h2>
      <p className="text-lg text-zinc-500 mb-8">Page not found</p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition-colors"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}

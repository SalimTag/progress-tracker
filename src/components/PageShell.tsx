import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standardized page layout that ensures proper spacing for:
 * - Bottom navigation (pb-24)
 * - Safe areas on iOS
 * - Consistent container width
 * - Proper flex layout for full height
 */
export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className="min-h-[100svh] flex flex-col">
      <main className={`container-app grow pt-5 pb-24 safe-area-left safe-area-right ${className}`}>
        {children}
      </main>
    </div>
  );
}

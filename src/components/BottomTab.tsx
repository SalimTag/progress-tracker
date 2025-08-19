// src/components/BottomTab.tsx
import { NavLink } from "react-router-dom";

export default function BottomTab() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-800"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-3">
        {[
          { to: "/", label: "Dashboard" },
          { to: "/activities", label: "Activities" },
          { to: "/organization", label: "Organize" },
        ].map(i => (
          <li key={i.to} className="text-center">
            <NavLink
              to={i.to}
              className={({ isActive }) =>
                "block py-3 text-sm " +
                (isActive ? "text-sky-600 font-medium" : "text-gray-600 dark:text-gray-300")
              }
            >
              {i.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

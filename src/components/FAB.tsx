import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/solid";
import { cn } from "../lib/utils";

interface FABProps {
  onClick: () => void;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}

export default function FAB({ 
  onClick, 
  className, 
  icon: Icon = PlusIcon,
  children 
}: FABProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "fixed bottom-20 right-4 z-50 rounded-full bg-primary text-primary-foreground p-4 shadow-soft min-h-[56px] min-w-[56px] flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-colors hover:bg-primary/90 active:bg-primary/80",
        className
      )}
      style={{marginBottom: "env(safe-area-inset-bottom)"}}
      onClick={onClick}
      aria-label="Add new item"
    >
      {children || <Icon className="h-6 w-6" />}
    </motion.button>
  );
}

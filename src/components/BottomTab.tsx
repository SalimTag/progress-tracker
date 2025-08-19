import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  Squares2X2Icon 
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ClipboardDocumentListIcon as ClipboardIconSolid,
  Squares2X2Icon as GridIconSolid
} from '@heroicons/react/24/solid';
import { useNativeFeatures, ImpactStyle } from '../hooks/useNativeFeatures';
import { motion } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    path: '/activities',
    label: 'Activities',
    icon: ClipboardDocumentListIcon,
    iconSolid: ClipboardIconSolid,
  },
  {
    path: '/organization',
    label: 'Organize',
    icon: Squares2X2Icon,
    iconSolid: GridIconSolid,
  },
];

export default function BottomTab() {
  const location = useLocation();
  const { hapticImpact } = useNativeFeatures();

  const handleNavigation = async () => {
    await hapticImpact(ImpactStyle.Light);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      <div className="container-app grid grid-cols-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.iconSolid : item.icon;
          
          return (
            <motion.div key={item.path} className="text-center">
              <NavLink
                to={item.path}
                onClick={handleNavigation}
                className={`flex flex-col items-center py-2 transition-colors duration-200 min-h-[44px] ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className={`text-[11px] font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </NavLink>
            </motion.div>
          );
        })}
      </div>
      <div style={{paddingBottom: "env(safe-area-inset-bottom)"}}/>
    </nav>
  );
}

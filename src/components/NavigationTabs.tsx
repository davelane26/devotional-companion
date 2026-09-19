import React from 'react';
import { Radio, BookOpen, NotebookPen, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types/devotional';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  notesCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  notesCount = 0,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'sermon',
      label: 'Sermon Plan',
      icon: <Radio className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'book',
      label: 'Book Study',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'wftw',
      label: 'Word of the Week',
      icon: <Sparkles className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: <NotebookPen className="w-4 h-4 shrink-0" />,
      badge: notesCount > 0 ? notesCount : undefined,
    },
  ];

  return (
    <div className="w-full hidden sm:block">
      {/* Top Segmented Pill Bar (Tablet & Desktop only) */}
      <div className="flex items-center p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 backdrop-blur-sm shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-md font-semibold ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/40 dark:hover:bg-slate-700/40'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Bottom Bar for Mobile PWA (Sticky bottom with safe-area-inset-bottom)
export const MobileBottomBar: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  notesCount = 0,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'sermon',
      label: 'Sermon',
      icon: <Radio className="w-5 h-5" />,
    },
    {
      id: 'book',
      label: 'Book Study',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'wftw',
      label: 'Weekly Word',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: <NotebookPen className="w-5 h-5" />,
      badge: notesCount > 0 ? notesCount : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/80 dark:border-slate-800/80 backdrop-blur-lg pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 sm:hidden shadow-lg shadow-black/5">
      <div className="flex items-center justify-around max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all group relative active:scale-95"
            >
              <div
                className={`relative px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                {tab.icon}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight truncate max-w-full text-center transition-colors duration-200 ${
                  isActive
                    ? 'font-bold text-amber-600 dark:text-amber-400'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`w-5 h-0.5 rounded-full mt-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 opacity-100 scale-100'
                    : 'bg-transparent opacity-0 scale-50'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};


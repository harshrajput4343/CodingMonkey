'use client';

import React from 'react';
import { Keyboard, Trophy, Info, Settings, Bell, User, Code2, LogIn } from 'lucide-react';

type AppView = 'typing' | 'problems';

interface NavbarProps {
  onLogoClick?: () => void;
  currentView?: AppView;
  onNavigate?: (view: AppView) => void;
  onSignInClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLogoClick,
  currentView = 'typing',
  onNavigate,
  onSignInClick,
}) => {
  return (
    <nav className="flex items-center justify-between px-5 py-4 w-full shrink-0">
      {/* Left section: Logo + nav icons */}
      <div className="flex items-center gap-8">
        <button onClick={onLogoClick} className="flex items-center gap-2.5 group">
          <Keyboard className="w-7 h-7 text-main" />
          <h1 className="text-xl font-bold tracking-tighter text-text group-hover:text-main transition-colors">
            coding<span className="text-main">Monkey</span>
          </h1>
        </button>

        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onNavigate?.('typing')}
            title="Typing Test"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              currentView === 'typing'
                ? 'text-main bg-main/10'
                : 'text-sub-text hover:text-text hover:bg-sub-bg/40'
            }`}
          >
            <Keyboard size={14} />
            <span className="hidden sm:inline">Practice</span>
          </button>

          <button
            onClick={() => onNavigate?.('problems')}
            title="Problem List"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              currentView === 'problems'
                ? 'text-main bg-main/10'
                : 'text-sub-text hover:text-text hover:bg-sub-bg/40'
            }`}
          >
            <Code2 size={14} />
            <span className="hidden sm:inline">Problems</span>
          </button>

          <button
            title="Leaderboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide text-sub-text hover:text-text hover:bg-sub-bg/40 transition-all"
          >
            <Trophy size={14} />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          <button
            title="About"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide text-sub-text hover:text-text hover:bg-sub-bg/40 transition-all"
          >
            <Info size={14} />
          </button>

          <button
            title="Settings"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide text-sub-text hover:text-text hover:bg-sub-bg/40 transition-all"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Right section: Notifications + Sign In */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-lg text-sub-text hover:text-text hover:bg-sub-bg/40 transition-all"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-main rounded-full" />
        </button>
        <button
          onClick={onSignInClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-main/10 border border-main/20 text-main hover:bg-main hover:text-bg text-sm font-bold tracking-wide transition-all"
        >
          <LogIn size={14} />
          <span>Sign In</span>
        </button>
      </div>
    </nav>
  );
};

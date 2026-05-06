'use client';

import React from 'react';
import { Keyboard, Trophy, Info, Settings, Bell, User } from 'lucide-react';

interface NavbarProps {
  onLogoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogoClick }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full shrink-0">
      <div className="flex items-center gap-8">
        <button onClick={onLogoClick} className="flex items-center gap-2.5 group">
          <Keyboard className="w-7 h-7 text-main" />
          <h1 className="text-xl font-bold tracking-tighter text-text group-hover:text-main transition-colors">
            coding<span className="text-main">Monkey</span>
          </h1>
        </button>

        <div className="flex items-center gap-5 ml-4">
          <button onClick={onLogoClick} title="Typing Test" className="text-sub-text hover:text-text transition-colors">
            <Keyboard size={18} />
          </button>
          <button title="Leaderboard" className="text-sub-text hover:text-text transition-colors">
            <Trophy size={18} />
          </button>
          <button title="About" className="text-sub-text hover:text-text transition-colors">
            <Info size={18} />
          </button>
          <button title="Settings" className="text-sub-text hover:text-text transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-sub-text hover:text-text transition-colors">
          <Bell size={18} />
        </button>
        <button className="flex items-center gap-2 text-sub-text hover:text-text transition-colors">
          <User size={18} />
          <span className="text-xs font-medium">sign in</span>
        </button>
      </div>
    </nav>
  );
};

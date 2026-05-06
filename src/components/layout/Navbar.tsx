'use client';

import React from 'react';
import Link from 'next/link';
import { Keyboard, Trophy, Info, Settings, Bell, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
             {/* Simple monkey-themed icon or just keyboard */}
             <Keyboard className="w-8 h-8 text-main" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-text group-hover:text-main transition-colors">
            coding<span className="text-main">Monkey</span>
          </h1>
        </Link>

        <div className="flex items-center gap-6 ml-4">
          <Link href="/" title="Typing Test" className="text-sub-text hover:text-text transition-colors">
            <Keyboard size={20} />
          </Link>
          <Link href="/leaderboard" title="Leaderboard" className="text-sub-text hover:text-text transition-colors">
            <Trophy size={20} />
          </Link>
          <Link href="/about" title="About" className="text-sub-text hover:text-text transition-colors">
            <Info size={20} />
          </Link>
          <Link href="/settings" title="Settings" className="text-sub-text hover:text-text transition-colors">
            <Settings size={20} />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-sub-text hover:text-text transition-colors">
          <Bell size={20} />
        </button>
        <Link href="/login" className="flex items-center gap-2 text-sub-text hover:text-text transition-colors">
          <User size={20} />
          <span className="text-sm font-medium">sign in</span>
        </Link>
      </div>
    </nav>
  );
};

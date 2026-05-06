'use client';

import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CodeDisplay } from '@/components/typing/CodeDisplay';
import { LiveStats } from '@/components/typing/LiveStats';
import { TestModeSelector } from '@/components/typing/TestModeSelector';
import { ResultsScreen } from '@/components/typing/ResultsScreen';
import { useTypingStore } from '@/store/typing-store';
import snippetsData from '@/data/snippets.json';

export default function Home() {
  const { setSnippet, isFinished, language, approach } = useTypingStore();

  useEffect(() => {
    // Filter snippets based on current preferences
    const filtered = snippetsData.filter(
      (s) => s.language === language && s.approach === approach
    );
    
    if (filtered.length > 0) {
      // Pick random one from filtered
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setSnippet(random as any);
    }
  }, [language, approach, setSnippet]);

  return (
    <main className="flex flex-col min-h-screen bg-bg text-text selection:bg-main selection:text-bg">
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center items-center max-w-7xl mx-auto w-full px-8 py-20">
        {!isFinished ? (
          <div className="w-full max-w-5xl flex flex-col gap-8">
            <TestModeSelector />
            <LiveStats />
            <CodeDisplay />
            
            <div className="mt-8 flex justify-center gap-12 text-sub-text text-sm opacity-50 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <span className="bg-sub-bg px-2 py-1 rounded text-xs font-bold border border-sub-text/20">tab</span>
                <span>+</span>
                <span className="bg-sub-bg px-2 py-1 rounded text-xs font-bold border border-sub-text/20">enter</span>
                <span className="ml-1">- restart test</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-sub-bg px-2 py-1 rounded text-xs font-bold border border-sub-text/20">esc</span>
                <span className="ml-1">- focus test</span>
              </div>
            </div>
          </div>
        ) : (
          <ResultsScreen />
        )}
      </div>

      <footer className="py-8 px-8 flex justify-between items-center text-sub-text text-sm max-w-7xl mx-auto w-full">
        <div className="flex gap-6">
          <a href="#" className="hover:text-text transition-colors">github</a>
          <a href="#" className="hover:text-text transition-colors">discord</a>
          <a href="#" className="hover:text-text transition-colors">twitter</a>
        </div>
        <div className="flex gap-6">
          <span>codingMonkey v1.0</span>
          <span>serika dark</span>
        </div>
      </footer>
    </main>
  );
}

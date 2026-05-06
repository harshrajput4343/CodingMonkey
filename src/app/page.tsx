'use client';

import React, { useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CodeDisplay } from '@/components/typing/CodeDisplay';
import { LiveStats } from '@/components/typing/LiveStats';
import { TestModeSelector } from '@/components/typing/TestModeSelector';
import { ResultsScreen } from '@/components/typing/ResultsScreen';
import { useTypingStore } from '@/store/typing-store';
import snippetsData from '@/data/snippets.json';
import { Snippet } from '@/types';

export default function Home() {
  const { setSnippet, isFinished, language, approach, snippet } = useTypingStore();

  const loadRandomSnippet = useCallback((excludeId?: string) => {
    const filtered = snippetsData.filter(
      (s) => s.language === language && s.approach === approach && s.id !== excludeId
    );
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setSnippet(random as Snippet);
    } else {
      const fallback = snippetsData.filter((s) => s.language === language && s.approach === approach);
      if (fallback.length > 0) {
        setSnippet(fallback[Math.floor(Math.random() * fallback.length)] as Snippet);
      }
    }
  }, [language, approach, setSnippet]);

  useEffect(() => { loadRandomSnippet(); }, [language, approach, loadRandomSnippet]);

  const handleNextTest = () => loadRandomSnippet(snippet?.id);
  const handleRestart = () => loadRandomSnippet(snippet?.id);

  return (
    <main className="flex flex-col h-screen bg-bg text-text selection:bg-main selection:text-bg overflow-hidden">
      <Navbar onLogoClick={handleRestart} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">
        {!isFinished ? (
          <div className="w-full flex flex-col items-center gap-4" style={{ maxWidth: '860px' }}>
            <TestModeSelector />
            <LiveStats />
            <CodeDisplay onRestart={handleRestart} />
            <div className="flex justify-center gap-10 text-sub-text text-xs opacity-30 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-1.5">
                <kbd className="bg-sub-bg px-1.5 py-0.5 rounded text-[10px] border border-sub-text/20">ctrl+r</kbd>
                <span>restart</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="bg-sub-bg px-1.5 py-0.5 rounded text-[10px] border border-sub-text/20">ctrl+e</kbd>
                <span>exit</span>
              </div>
            </div>
          </div>
        ) : (
          <ResultsScreen onNextTest={handleNextTest} />
        )}
      </div>

      <footer className="py-3 px-8 flex justify-between items-center text-sub-text text-xs max-w-7xl mx-auto w-full shrink-0">
        <div className="flex gap-6">
          <a href="#" className="hover:text-text transition-colors">github</a>
          <a href="#" className="hover:text-text transition-colors">discord</a>
        </div>
        <span>codingMonkey v1.0</span>
      </footer>
    </main>
  );
}

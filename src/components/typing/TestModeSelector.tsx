'use client';

import React from 'react';
import { useTypingStore } from '@/store/typing-store';
import { Type, Hash, Clock, Quote, Zap, Settings, Languages, Code2 } from 'lucide-react';

export const TestModeSelector: React.FC = () => {
  const { 
    timeMode, setTimeMode, 
    language, setLanguage, 
    approach, setApproach,
    isActive, isFinished 
  } = useTypingStore();

  if (isActive || isFinished) return null;

  const modes = [
    { id: 15, label: '15' },
    { id: 30, label: '30' },
    { id: 60, label: '60' },
    { id: 120, label: '120' },
    { id: 0, label: 'snippet' },
  ];

  const langs = [
    { id: 'PYTHON', label: 'python' },
    { id: 'CPP', label: 'c++' },
  ];

  const approaches = [
    { id: 'BRUTE', label: 'brute' },
    { id: 'OPTIMAL', label: 'optimal' },
  ];

  return (
    <div className="flex flex-col gap-4 items-center bg-sub-bg/20 p-4 rounded-xl max-w-fit mx-auto mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex gap-8 items-center text-xs uppercase tracking-widest font-bold">
        <div className="flex gap-4 items-center text-sub-text">
          <Clock size={14} />
          <div className="flex gap-3">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setTimeMode(mode.id)}
                className={`transition-colors hover:text-text ${timeMode === mode.id ? 'text-main' : ''}`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-[1px] h-4 bg-sub-text/20" />

        <div className="flex gap-4 items-center text-sub-text">
          <Languages size={14} />
          <div className="flex gap-3">
            {langs.map((l) => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id as any)}
                className={`transition-colors hover:text-text ${language === l.id ? 'text-main' : ''}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-[1px] h-4 bg-sub-text/20" />

        <div className="flex gap-4 items-center text-sub-text">
          <Code2 size={14} />
          <div className="flex gap-3">
            {approaches.map((a) => (
              <button
                key={a.id}
                onClick={() => setApproach(a.id as any)}
                className={`transition-colors hover:text-text ${approach === a.id ? 'text-main' : ''}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

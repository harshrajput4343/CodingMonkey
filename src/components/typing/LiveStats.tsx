'use client';

import React, { useEffect, useState } from 'react';
import { useTypingStore } from '@/store/typing-store';
import { calcNetWPM, calcAccuracy } from '@/lib/wpm-calculator';

export const LiveStats: React.FC = () => {
  const { isActive, isFinished, correctChars, keystrokes, startTime } = useTypingStore();
  const [wpm, setWpm] = useState(0);
  const [acc, setAcc] = useState(100);

  useEffect(() => {
    if (!isActive || isFinished || !startTime) return;

    const interval = setInterval(() => {
      const elapsedSec = (Date.now() - startTime) / 1000;
      setWpm(Math.round(calcNetWPM(correctChars, elapsedSec)));
      setAcc(Math.round(calcAccuracy(correctChars, keystrokes)));
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, isFinished, startTime, correctChars, keystrokes]);

  if (!isActive && !isFinished) return null;

  return (
    <div className="flex gap-12 text-2xl font-mono mt-8 justify-center h-8">
      <div className="flex flex-col items-center">
        <span className="text-sub-text text-xs uppercase tracking-widest">wpm</span>
        <span className="text-main font-bold">{isActive ? wpm : '-'}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sub-text text-xs uppercase tracking-widest">acc</span>
        <span className="text-main font-bold">{isActive ? `${acc}%` : '-'}</span>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { useTypingStore } from '@/store/typing-store';
import { calcNetWPM, calcRawWPM, calcAccuracy, calcConsistency } from '@/lib/wpm-calculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCcw, ChevronRight } from 'lucide-react';

interface ResultsScreenProps {
  onNextTest: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onNextTest }) => {
  const { 
    isFinished, 
    correctChars, 
    keystrokes, 
    startTime, 
    endTime, 
    errors, 
    wpmHistory,
    resetTest,
    snippet
  } = useTypingStore();

  if (!isFinished || !startTime || !endTime) return null;

  const durationSec = (endTime - startTime) / 1000;
  const wpm = Math.round(calcNetWPM(correctChars, durationSec));
  const rawWpm = Math.round(calcRawWPM(keystrokes, durationSec));
  const accuracy = Math.round(calcAccuracy(correctChars, keystrokes) * 10) / 10;
  const consistency = Math.round(calcConsistency(wpmHistory.map(h => h.wpm)));

  return (
    <div className="flex flex-col gap-8 w-full" style={{ maxWidth: '900px' }}>
      {/* Big stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col">
          <span className="text-sub-text text-sm uppercase tracking-widest">wpm</span>
          <span className="text-6xl font-bold text-main leading-tight">{wpm}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sub-text text-sm uppercase tracking-widest">acc</span>
          <span className="text-6xl font-bold text-main leading-tight">{accuracy}%</span>
        </div>
        <div className="flex flex-col justify-end pb-1">
          <span className="text-sub-text text-xs uppercase tracking-widest">raw wpm</span>
          <span className="text-2xl font-bold text-text">{rawWpm}</span>
        </div>
        <div className="flex flex-col justify-end pb-1">
          <span className="text-sub-text text-xs uppercase tracking-widest">consistency</span>
          <span className="text-2xl font-bold text-text">{consistency}%</span>
        </div>
      </div>

      {/* WPM Chart */}
      {wpmHistory.length >= 3 && (
        <div className="h-56 w-full bg-sub-bg/30 rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wpmHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2e31" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#646669" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                label={{ value: 'seconds', position: 'insideBottom', offset: -5, fill: '#646669', fontSize: 10 }}
              />
              <YAxis 
                stroke="#646669" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2c2e31', border: 'none', borderRadius: '8px', color: '#d1d0c5' }}
                itemStyle={{ color: '#e2b714' }}
              />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                stroke="#e2b714" 
                strokeWidth={2.5} 
                dot={{ fill: '#e2b714', r: 2 }}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-sub-bg pt-6">
        <div className="flex gap-8 text-sm">
          <div className="flex flex-col">
            <span className="text-sub-text uppercase tracking-widest text-xs">characters</span>
            <span className="text-text font-mono">{correctChars}/{keystrokes}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sub-text uppercase tracking-widest text-xs">errors</span>
            <span className="text-text font-mono">{errors}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sub-text uppercase tracking-widest text-xs">time</span>
            <span className="text-text font-mono">{Math.round(durationSec)}s</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sub-text uppercase tracking-widest text-xs">problem</span>
            <span className="text-text font-mono text-xs">{snippet?.title}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={resetTest}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sub-bg hover:bg-sub-text/20 text-text transition-all group"
          >
            <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm">restart</span>
          </button>
          <button 
            onClick={onNextTest}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-main hover:bg-main/90 text-bg font-bold transition-all"
          >
            <span className="text-sm">next test</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

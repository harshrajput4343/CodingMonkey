'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useTypingStore } from '@/store/typing-store';

interface CodeDisplayProps {
  onRestart?: () => void;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ onRestart }) => {
  const { snippet, charStates, caretPos, handleKeydown, isActive, isFinished, resetTest } = useTypingStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const caretLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Ctrl+R = restart
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        if (onRestart) onRestart();
        else resetTest();
        return;
      }
      // Ctrl+E = exit (go home / reset)
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        resetTest();
        return;
      }

      // Prevent scrolling with space/arrows
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
      }

      handleKeydown(e.key);
    };

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [handleKeydown, resetTest, onRestart]);

  // Auto-scroll to keep the caret visible
  useEffect(() => {
    if (caretLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const caretEl = caretLineRef.current;
      const containerRect = container.getBoundingClientRect();
      const caretRect = caretEl.getBoundingClientRect();
      if (caretRect.bottom > containerRect.bottom - 20) {
        container.scrollTop += caretRect.bottom - containerRect.bottom + 60;
      }
      if (caretRect.top < containerRect.top + 20) {
        container.scrollTop -= containerRect.top - caretRect.top + 60;
      }
    }
  }, [caretPos]);

  // Split code into lines
  const lines = useMemo(() => {
    if (!snippet) return [];
    const code = snippet.code;
    const result: { chars: string[]; startIndex: number }[] = [];
    let currentLine: string[] = [];
    let lineStartIndex = 0;

    for (let i = 0; i < code.length; i++) {
      if (code[i] === '\n') {
        currentLine.push('\n');
        result.push({ chars: currentLine, startIndex: lineStartIndex });
        currentLine = [];
        lineStartIndex = i + 1;
      } else {
        currentLine.push(code[i]);
      }
    }
    if (currentLine.length > 0) {
      result.push({ chars: currentLine, startIndex: lineStartIndex });
    }
    return result;
  }, [snippet]);

  if (!snippet) return <div className="text-sub-text text-center text-lg">Loading snippet...</div>;

  // Find caret line
  let caretLineIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineEnd = lines[i].startIndex + lines[i].chars.length;
    if (caretPos < lineEnd) { caretLineIndex = i; break; }
    if (i === lines.length - 1) caretLineIndex = i;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Problem header */}
      <div className="border-b border-sub-text/10 pb-4 mb-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-main font-bold text-lg">{snippet.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-sub-bg text-sub-text uppercase tracking-wider">{snippet.category}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider ${
            snippet.difficulty === 'EASY' ? 'bg-green-900/30 text-green-400' :
            snippet.difficulty === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400' :
            'bg-red-900/30 text-red-400'
          }`}>{snippet.difficulty}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-sub-bg text-sub-text">{snippet.approach.toLowerCase()}</span>
        </div>
        {snippet.description && (
          <p className="text-sub-text text-sm leading-relaxed mb-2">{snippet.description}</p>
        )}
        {snippet.example && (
          <div className="text-xs font-mono bg-sub-bg/50 rounded-lg px-3 py-2 text-sub-text">
            <span className="text-main/70 font-bold">Example: </span>{snippet.example}
          </div>
        )}
      </div>

      {/* Code area */}
      <div
        ref={containerRef}
        className="relative font-mono text-[20px] leading-[1.8] w-full outline-none select-none overflow-y-auto max-h-[50vh] scroll-smooth rounded-lg"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#646669 transparent' }}
      >
        <div className="relative">
          {lines.map((line, lineIdx) => {
            const isCaretLine = lineIdx === caretLineIndex;
            return (
              <div
                key={lineIdx}
                ref={isCaretLine ? caretLineRef : undefined}
                className={`flex transition-colors duration-100 ${isCaretLine && !isFinished ? 'bg-sub-bg/30' : ''}`}
              >
                <span className="inline-block w-10 text-right pr-4 text-sub-text/30 text-xs select-none shrink-0" style={{ lineHeight: '1.8', paddingTop: '2px' }}>
                  {lineIdx + 1}
                </span>
                <span className="whitespace-pre">
                  {line.chars.map((char, charIdx) => {
                    const globalIndex = line.startIndex + charIdx;
                    const state = charStates[globalIndex];
                    let colorClass = 'text-sub-text';
                    if (state === 'correct') colorClass = 'text-text';
                    if (state === 'incorrect') colorClass = 'text-error';
                    const isNewline = char === '\n';

                    return (
                      <span
                        key={globalIndex}
                        className={`${colorClass} relative ${state === 'incorrect' ? 'bg-error/10 rounded-sm' : ''}`}
                      >
                        {globalIndex === caretPos && !isFinished && (
                          <span className="absolute left-0 top-[2px] bottom-[2px] w-[2.5px] bg-main rounded-full caret-blink" />
                        )}
                        {isNewline ? '' : char}
                      </span>
                    );
                  })}
                </span>
              </div>
            );
          })}
        </div>

        {!isActive && !isFinished && caretPos === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/60 backdrop-blur-[2px] rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <div className="text-main text-lg font-semibold tracking-wider animate-pulse">start typing</div>
              <div className="text-sub-text text-xs tracking-widest uppercase">{snippet.language.toLowerCase()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

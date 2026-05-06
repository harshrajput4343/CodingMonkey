'use client';

import React, { useEffect, useRef } from 'react';
import { useTypingStore } from '@/store/typing-store';
import { motion } from 'framer-motion';

export const CodeDisplay: React.FC = () => {
  const { snippet, charStates, caretPos, handleKeydown, isActive, isFinished } = useTypingStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Prevent scrolling with space/arrows while typing
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      // Handle Tab specifically for indentation
      if (e.key === 'Tab') {
        e.preventDefault();
        // For now, we'll just handle it as a normal key in handleKeydown 
        // if we decide to support manual tab, but usually code snippets 
        // have fixed indentation.
      }

      handleKeydown(e.key);
    };

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [handleKeydown]);

  if (!snippet) return <div className="text-sub-text">Loading snippet...</div>;

  return (
    <div 
      ref={containerRef}
      className="relative font-mono text-xl leading-relaxed max-w-3xl mx-auto mt-12 outline-none select-none"
    >
      <div className="flex flex-wrap break-all whitespace-pre-wrap relative">
        {snippet.code.split('').map((char, index) => {
          const state = charStates[index];
          let colorClass = 'text-sub-text'; // untyped
          if (state === 'correct') colorClass = 'text-text';
          if (state === 'incorrect') colorClass = 'text-error';

          return (
            <span key={index} className={`${colorClass} relative inline-block min-w-[0.6em]`}>
              {index === caretPos && !isFinished && (
                <motion.div
                  layoutId="caret"
                  className="absolute left-0 top-0 w-[2px] h-full bg-main caret-blink"
                  transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
                />
              )}
              {char === '\n' ? (
                <span className="opacity-30">↵{"\n"}</span>
              ) : char}
            </span>
          );
        })}
      </div>
      
      {!isActive && !isFinished && caretPos === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/50 backdrop-blur-[1px] rounded-lg">
          <div className="text-main animate-pulse font-sans text-sm tracking-widest uppercase">
            Click or type to start
          </div>
        </div>
      )}
    </div>
  );
};

import { create } from 'zustand';
import { TypingState, CharState, Snippet, Language, Approach } from '../types';

export const useTypingStore = create<TypingState>((set, get) => ({
  snippet: null,
  timeMode: 60,
  language: 'PYTHON',
  approach: 'OPTIMAL',
  charStates: [],
  caretPos: 0,
  startTime: null,
  endTime: null,
  keystrokes: 0,
  correctChars: 0,
  errors: 0,
  wpmHistory: [],
  isActive: false,
  isFinished: false,

  setSnippet: (snippet: Snippet) => {
    set({
      snippet,
      charStates: new Array(snippet.code.length).fill('untyped'),
      caretPos: 0,
      startTime: null,
      endTime: null,
      keystrokes: 0,
      correctChars: 0,
      errors: 0,
      wpmHistory: [],
      isActive: false,
      isFinished: false,
    });
  },

  setLanguage: (language: Language) => set({ language }),
  setApproach: (approach: Approach) => set({ approach }),
  setTimeMode: (timeMode: number) => set({ timeMode }),

  startTest: () => {
    const startTime = Date.now();
    set({ startTime, isActive: true });

    // Track WPM every second
    const intervalId = setInterval(() => {
      const state = get();
      if (!state.isActive) {
        clearInterval(intervalId);
        return;
      }
      const elapsedSec = (Date.now() - startTime) / 1000;
      const currentWpm = (state.correctChars / 5) / (elapsedSec / 60);
      set((s) => ({
        wpmHistory: [...s.wpmHistory, { time: Math.round(elapsedSec), wpm: Math.round(currentWpm) }]
      }));
    }, 1000);
  },

  endTest: () => {
    set({ endTime: Date.now(), isActive: false, isFinished: true });
  },

  resetTest: () => {
    const { snippet } = get();
    if (snippet) {
      set({
        charStates: new Array(snippet.code.length).fill('untyped'),
        caretPos: 0,
        startTime: null,
        endTime: null,
        keystrokes: 0,
        correctChars: 0,
        errors: 0,
        wpmHistory: [],
        isActive: false,
        isFinished: false,
      });
    }
  },

  handleKeydown: (key: string) => {
    const state = get();
    if (state.isFinished || !state.snippet) return;

    // Start test on first key (except special keys)
    if (!state.isActive && !['Tab', 'Escape', 'Shift', 'Control', 'Alt', 'Meta'].includes(key)) {
      state.startTest();
    }

    if (key === 'Backspace') {
      if (state.caretPos > 0) {
        const newCaretPos = state.caretPos - 1;
        const newCharStates = [...state.charStates];
        newCharStates[newCaretPos] = 'untyped';
        set({ caretPos: newCaretPos, charStates: newCharStates });
      }
      return;
    }

    // Special keys to ignore
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(key)) return;

    // Normalize Enter to newline
    const typedChar = key === 'Enter' ? '\n' : key;
    const expectedChar = state.snippet.code[state.caretPos];

    // Basic matching logic
    const isCorrect = typedChar === expectedChar;
    const newCharStates = [...state.charStates];
    newCharStates[state.caretPos] = isCorrect ? 'correct' : 'incorrect';

    const newCaretPos = state.caretPos + 1;
    set((s) => ({
      caretPos: newCaretPos,
      charStates: newCharStates,
      keystrokes: s.keystrokes + 1,
      correctChars: s.correctChars + (isCorrect ? 1 : 0),
      errors: s.errors + (isCorrect ? 0 : 1),
    }));

    // Check if finished
    if (newCaretPos === state.snippet.code.length) {
      state.endTest();
    }
  },
}));

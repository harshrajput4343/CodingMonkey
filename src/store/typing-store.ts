import { create } from 'zustand';
import { TypingState, CharState, Snippet, Language, Approach } from '../types';

const TAB_SIZE = 4; // 4 spaces per tab — standard Python indentation

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

    const code = state.snippet.code;

    // Start test on first key (except special keys)
    if (!state.isActive && !['Escape', 'Shift', 'Control', 'Alt', 'Meta'].includes(key)) {
      state.startTest();
    }

    // --- BACKSPACE ---
    if (key === 'Backspace') {
      if (state.caretPos > 0) {
        const newCaretPos = state.caretPos - 1;
        const newCharStates = [...state.charStates];
        newCharStates[newCaretPos] = 'untyped';
        set({ caretPos: newCaretPos, charStates: newCharStates });
      }
      return;
    }

    // Special keys to ignore (not Tab — we handle Tab below)
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 
         'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
         'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
         'Insert', 'Delete', 'Home', 'End', 'PageUp', 'PageDown',
         'NumLock', 'ScrollLock', 'Pause', 'PrintScreen', 'ContextMenu'
    ].includes(key)) return;

    // --- TAB KEY: insert TAB_SIZE spaces ---
    if (key === 'Tab') {
      // Check how many upcoming chars are spaces
      const newCharStates = [...state.charStates];
      let spacesMatched = 0;
      let correctCount = 0;
      let errorCount = 0;

      for (let i = 0; i < TAB_SIZE; i++) {
        const pos = state.caretPos + i;
        if (pos >= code.length) break;
        
        const expected = code[pos];
        if (expected === ' ') {
          newCharStates[pos] = 'correct';
          correctCount++;
        } else {
          newCharStates[pos] = 'incorrect';
          errorCount++;
        }
        spacesMatched++;
      }

      if (spacesMatched > 0) {
        const newCaretPos = state.caretPos + spacesMatched;
        set((s) => ({
          caretPos: newCaretPos,
          charStates: newCharStates,
          keystrokes: s.keystrokes + spacesMatched,
          correctChars: s.correctChars + correctCount,
          errors: s.errors + errorCount,
        }));

        // Check if finished
        if (state.caretPos + spacesMatched >= code.length) {
          state.endTest();
        }
      }
      return;
    }

    // --- ENTER KEY: match newline ---
    const typedChar = key === 'Enter' ? '\n' : key;

    // If Enter is pressed and the expected char is a newline,
    // also auto-skip any leading whitespace on the next line
    if (key === 'Enter' && code[state.caretPos] === '\n') {
      const newCharStates = [...state.charStates];
      newCharStates[state.caretPos] = 'correct';
      
      // Count leading spaces on the next line to auto-indent
      let autoSkip = 1; // 1 for the newline itself
      let autoCorrect = 1;
      let pos = state.caretPos + 1;
      while (pos < code.length && code[pos] === ' ') {
        newCharStates[pos] = 'correct';
        autoSkip++;
        autoCorrect++;
        pos++;
      }

      const newCaretPos = state.caretPos + autoSkip;
      set((s) => ({
        caretPos: newCaretPos,
        charStates: newCharStates,
        keystrokes: s.keystrokes + 1,
        correctChars: s.correctChars + autoCorrect,
        errors: s.errors,
      }));

      if (newCaretPos >= code.length) {
        state.endTest();
      }
      return;
    }

    // --- REGULAR CHARACTER ---
    const expectedChar = code[state.caretPos];
    if (!typedChar || typedChar.length !== 1) return; // Ignore multi-char keys or undefined

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
    if (newCaretPos === code.length) {
      state.endTest();
    }
  },
}));

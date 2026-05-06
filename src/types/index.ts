export type CharState = 'untyped' | 'correct' | 'incorrect' | 'extra';

export interface CharData {
  char: string;
  state: CharState;
}

export type Language = 'PYTHON' | 'CPP';
export type Approach = 'BRUTE' | 'OPTIMAL';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Snippet {
  id: string;
  title: string;
  category: string;
  language: Language;
  approach: Approach;
  code: string;
  difficulty: Difficulty;
}

export interface TypingState {
  // Config
  snippet: Snippet | null;
  timeMode: number; // 15, 30, 60, 120, 0 (0 for full snippet)
  language: Language;
  approach: Approach;

  // Runtime
  charStates: CharState[];
  caretPos: number;
  startTime: number | null;
  endTime: number | null;
  keystrokes: number;
  correctChars: number;
  errors: number;
  wpmHistory: { time: number; wpm: number }[];
  isActive: boolean;
  isFinished: boolean;

  // Actions
  setSnippet: (snippet: Snippet) => void;
  setLanguage: (lang: Language) => void;
  setApproach: (approach: Approach) => void;
  setTimeMode: (mode: number) => void;
  startTest: () => void;
  endTest: () => void;
  handleKeydown: (key: string) => void;
  resetTest: () => void;
}

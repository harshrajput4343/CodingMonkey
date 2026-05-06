'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Search, Code2, ChevronDown, X, Filter } from 'lucide-react';
import { Snippet } from '@/types';

interface ProblemListProps {
  snippets: Snippet[];
  onSelectProblem: (snippet: Snippet) => void;
  onClose: () => void;
}

const CATEGORIES = [
  'All',
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Advanced Graphs',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation',
  'Tries',
];

const DIFFICULTIES = ['All', 'EASY', 'MEDIUM', 'HARD'] as const;

export const ProblemList: React.FC<ProblemListProps> = ({ snippets, onSelectProblem, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery);
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || s.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [snippets, searchQuery, selectedCategory, selectedDifficulty]);

  const getDifficultyStyle = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-emerald-400';
      case 'MEDIUM':
        return 'text-amber-400';
      case 'HARD':
        return 'text-red-400';
      default:
        return 'text-sub-text';
    }
  }, []);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    snippets.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [snippets]);

  return (
    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-main" />
          <h2 className="text-xl font-bold text-text tracking-tight">
            NeetCode <span className="text-main">150</span>
          </h2>
          <span className="text-xs text-sub-text bg-sub-bg px-2.5 py-1 rounded-full">
            {filteredSnippets.length} problems
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-sub-bg text-sub-text hover:text-text transition-all"
          title="Close problem list"
        >
          <X size={18} />
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub-text w-4 h-4" />
          <input
            type="text"
            placeholder="Search problems by name, category, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-sub-bg/60 border border-sub-text/15 rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder:text-sub-text/50 focus:outline-none focus:border-main/50 focus:bg-sub-bg transition-all"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sub-text hover:text-text transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 bg-sub-bg/60 border border-sub-text/15 rounded-lg text-xs text-sub-text hover:text-text hover:border-sub-text/30 transition-all"
            >
              <Filter size={12} />
              <span>{selectedCategory}</span>
              <ChevronDown size={12} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showCategoryDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCategoryDropdown(false)} />
                <div className="absolute top-full left-0 mt-1 z-50 w-72 max-h-80 overflow-y-auto bg-sub-bg border border-sub-text/20 rounded-xl shadow-2xl shadow-black/40 py-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-main/10 transition-colors ${
                        selectedCategory === cat ? 'text-main bg-main/5' : 'text-sub-text hover:text-text'
                      }`}
                    >
                      <span>{cat}</span>
                      {cat !== 'All' && (
                        <span className="text-sub-text/50 text-[10px]">{categoryCount[cat] || 0}</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Difficulty pills */}
          <div className="flex items-center gap-1.5">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDifficulty === diff
                    ? diff === 'EASY'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : diff === 'MEDIUM'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : diff === 'HARD'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-main/15 text-main border border-main/30'
                    : 'text-sub-text hover:text-text border border-transparent hover:border-sub-text/15'
                }`}
              >
                {diff === 'All' ? 'All' : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center px-4 py-2.5 text-[10px] uppercase tracking-widest text-sub-text/60 border-b border-sub-text/10">
        <span className="w-12 shrink-0">#</span>
        <span className="flex-1">Title</span>
        <span className="w-48 text-left hidden md:block">Category</span>
        <span className="w-20 text-center">Difficulty</span>
        <span className="w-24 text-center">Action</span>
      </div>

      {/* Problem rows */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#646669 transparent' }}>
        {filteredSnippets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-sub-text">
            <Search size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No problems found</p>
            <p className="text-xs opacity-50 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredSnippets.map((snippet, idx) => (
            <div
              key={snippet.id}
              className={`group flex items-center px-4 py-3.5 border-b border-sub-text/5 hover:bg-sub-bg/40 transition-all cursor-pointer ${
                idx % 2 === 0 ? 'bg-transparent' : 'bg-sub-bg/10'
              }`}
              onClick={() => onSelectProblem(snippet)}
            >
              <span className="w-12 shrink-0 text-sub-text/40 text-xs font-mono">{snippet.id}</span>
              <span className="flex-1 text-sm text-text group-hover:text-main transition-colors font-medium truncate pr-4">
                {snippet.title}
              </span>
              <span className="w-48 text-left text-xs text-sub-text/60 hidden md:block truncate">
                {snippet.category}
              </span>
              <span className={`w-20 text-center text-xs font-semibold ${getDifficultyStyle(snippet.difficulty)}`}>
                {snippet.difficulty === 'EASY' ? 'Easy' : snippet.difficulty === 'MEDIUM' ? 'Med.' : 'Hard'}
              </span>
              <span className="w-24 flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProblem(snippet);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-main/10 text-main border border-main/20 hover:bg-main hover:text-bg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  Practice
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

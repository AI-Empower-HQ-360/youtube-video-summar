/**
 * @label Summary Context
 * @description State management for AI-generated summaries
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ============================================
// TYPES
// ============================================

interface QAPair {
  question: string;
  answer: string;
}

interface SummaryContextType {
  summary: string;
  setSummary: (summary: string) => void;
  keyPoints: string[];
  setKeyPoints: (points: string[]) => void;
  qaPairs: QAPair[];
  setQAPairs: (pairs: QAPair[]) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  clearAll: () => void;
}

// ============================================
// CONTEXT
// ============================================

const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

/**
 * @label Summary Provider
 * @description Provides summary state to the application
 */
export const SummaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [summary, setSummary] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  /**
   * @label Clear All Data
   * @description Reset all summary data
   */
  const clearAll = () => {
    setSummary('');
    setKeyPoints([]);
    setQAPairs([]);
    setIsGenerating(false);
  };

  const value = {
    summary,
    setSummary,
    keyPoints,
    setKeyPoints,
    qaPairs,
    setQAPairs,
    isGenerating,
    setIsGenerating,
    clearAll,
  };

  return <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>;
};

// ============================================
// HOOK
// ============================================

/**
 * @label Use Summary Context Hook
 * @description Custom hook to access summary context
 */
export const useSummaryContext = () => {
  const context = useContext(SummaryContext);
  if (context === undefined) {
    throw new Error('useSummaryContext must be used within a SummaryProvider');
  }
  return context;
};

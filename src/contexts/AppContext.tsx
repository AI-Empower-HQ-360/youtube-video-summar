/**
 * @label App Context
 * @description Global application state management
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ============================================
// TYPES
// ============================================

interface AppContextType {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  videoId: string | null;
  setVideoId: (id: string | null) => void;
  transcript: string;
  setTranscript: (transcript: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

// ============================================
// CONTEXT
// ============================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

/**
 * @label App Provider
 * @description Provides global state to the application
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    videoUrl,
    setVideoUrl,
    videoId,
    setVideoId,
    transcript,
    setTranscript,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ============================================
// HOOK
// ============================================

/**
 * @label Use App Context Hook
 * @description Custom hook to access app context
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

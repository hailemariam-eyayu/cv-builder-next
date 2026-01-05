import { useState, useCallback } from 'react';
import { CVElement } from '../components/cv-builder/AdvancedDragDropEditor';

interface HistoryState {
  elements: CVElement[];
  timestamp: number;
}

export function useUndoRedo(initialElements: CVElement[] = []) {
  const [history, setHistory] = useState<HistoryState[]>([
    { elements: initialElements, timestamp: Date.now() }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addToHistory = useCallback((elements: CVElement[]) => {
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push({ elements: [...elements], timestamp: Date.now() });
      
      // Limit history size to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        setCurrentIndex(prev => Math.max(0, prev - 1));
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1].elements;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1].elements;
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const getCurrentElements = useCallback(() => {
    return history[currentIndex]?.elements || [];
  }, [history, currentIndex]);

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentElements,
  };
}
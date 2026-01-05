import { useState, useCallback } from 'react';
import { CVElement } from '../components/cv-builder/AdvancedDragDropEditor';

export function useClipboard() {
  const [clipboard, setClipboard] = useState<CVElement[]>([]);

  const copyElements = useCallback((elements: CVElement[]) => {
    setClipboard([...elements]);
  }, []);

  const pasteElements = useCallback((offsetX: number = 20, offsetY: number = 20): CVElement[] => {
    return clipboard.map(element => ({
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: element.position.x + offsetX,
        y: element.position.y + offsetY,
      },
    }));
  }, [clipboard]);

  const hasClipboardContent = clipboard.length > 0;

  return {
    copyElements,
    pasteElements,
    hasClipboardContent,
    clipboardCount: clipboard.length,
  };
}
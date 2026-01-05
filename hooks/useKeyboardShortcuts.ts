import { useEffect, useCallback } from 'react';
import { CVElement } from '../components/cv-builder/AdvancedDragDropEditor';

interface KeyboardShortcutsProps {
  selectedElements: string[];
  elements: CVElement[];
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSelectAll: () => void;
  onDuplicate: () => void;
  onSave: () => void;
}

export function useKeyboardShortcuts({
  selectedElements,
  elements,
  onCopy,
  onPaste,
  onDelete,
  onUndo,
  onRedo,
  onSelectAll,
  onDuplicate,
  onSave,
}: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, shiftKey } = event;
    const isModifierPressed = ctrlKey || metaKey;

    // Prevent shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    switch (key) {
      case 'c':
        if (isModifierPressed && selectedElements.length > 0) {
          event.preventDefault();
          onCopy();
        }
        break;
      
      case 'v':
        if (isModifierPressed) {
          event.preventDefault();
          onPaste();
        }
        break;
      
      case 'Delete':
      case 'Backspace':
        if (selectedElements.length > 0) {
          event.preventDefault();
          onDelete();
        }
        break;
      
      case 'z':
        if (isModifierPressed && !shiftKey) {
          event.preventDefault();
          onUndo();
        } else if (isModifierPressed && shiftKey) {
          event.preventDefault();
          onRedo();
        }
        break;
      
      case 'y':
        if (isModifierPressed) {
          event.preventDefault();
          onRedo();
        }
        break;
      
      case 'a':
        if (isModifierPressed) {
          event.preventDefault();
          onSelectAll();
        }
        break;
      
      case 'd':
        if (isModifierPressed && selectedElements.length > 0) {
          event.preventDefault();
          onDuplicate();
        }
        break;
      
      case 's':
        if (isModifierPressed) {
          event.preventDefault();
          onSave();
        }
        break;
      
      case 'Escape':
        // Clear selection
        event.preventDefault();
        // This would be handled by the parent component
        break;
    }
  }, [selectedElements, onCopy, onPaste, onDelete, onUndo, onRedo, onSelectAll, onDuplicate, onSave]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
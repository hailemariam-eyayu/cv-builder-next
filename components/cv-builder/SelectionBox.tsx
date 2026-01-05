"use client";

import React, { useState, useCallback, useRef } from 'react';

interface SelectionBoxProps {
  onSelectionChange: (selectedIds: string[]) => void;
  elements: Array<{ id: string; position: { x: number; y: number }; size: { width: number; height: number } }>;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function SelectionBox({ onSelectionChange, elements, canvasRef }: SelectionBoxProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const selectionRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSelecting || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    setSelectionEnd({ x: endX, y: endY });
    
    // Calculate selection rectangle
    const selectionRect = {
      left: Math.min(selectionStart.x, endX),
      top: Math.min(selectionStart.y, endY),
      right: Math.max(selectionStart.x, endX),
      bottom: Math.max(selectionStart.y, endY),
    };
    
    // Find elements within selection
    const selectedIds = elements.filter(element => {
      const elementRect = {
        left: element.position.x,
        top: element.position.y,
        right: element.position.x + element.size.width,
        bottom: element.position.y + element.size.height,
      };
      
      // Check if element intersects with selection rectangle
      return !(
        elementRect.right < selectionRect.left ||
        elementRect.left > selectionRect.right ||
        elementRect.bottom < selectionRect.top ||
        elementRect.top > selectionRect.bottom
      );
    }).map(element => element.id);
    
    onSelectionChange(selectedIds);
  }, [isSelecting, selectionStart, elements, onSelectionChange, canvasRef]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  // Add event listeners
  React.useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isSelecting, handleMouseMove, handleMouseUp]);

  if (!isSelecting) return null;

  const selectionStyle = {
    position: 'absolute' as const,
    left: Math.min(selectionStart.x, selectionEnd.x),
    top: Math.min(selectionStart.y, selectionEnd.y),
    width: Math.abs(selectionEnd.x - selectionStart.x),
    height: Math.abs(selectionEnd.y - selectionStart.y),
    border: '2px dashed #3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    pointerEvents: 'none' as const,
    zIndex: 1000,
  };

  return (
    <div
      ref={selectionRef}
      style={selectionStyle}
      className="selection-box"
    />
  );
}
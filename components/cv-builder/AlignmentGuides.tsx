"use client";

import { useMemo } from 'react';
import { CVElement } from './AdvancedDragDropEditor';

interface AlignmentGuidesProps {
  elements: CVElement[];
  selectedElements: string[];
  canvasSize: { width: number; height: number };
  snapThreshold?: number;
}

interface Guide {
  type: 'vertical' | 'horizontal';
  position: number;
  elements: string[];
}

export function AlignmentGuides({ 
  elements, 
  selectedElements, 
  canvasSize, 
  snapThreshold = 5 
}: AlignmentGuidesProps) {
  const guides = useMemo(() => {
    if (selectedElements.length === 0) return [];

    const allGuides: Guide[] = [];
    const otherElements = elements.filter(el => !selectedElements.includes(el.id));

    // Canvas guides (center lines)
    allGuides.push(
      { type: 'vertical', position: canvasSize.width / 2, elements: ['canvas-center'] },
      { type: 'horizontal', position: canvasSize.height / 2, elements: ['canvas-center'] }
    );

    // Element alignment guides
    otherElements.forEach(element => {
      const { position, size } = element;
      
      // Vertical guides (left, center, right edges)
      allGuides.push(
        { type: 'vertical', position: position.x, elements: [element.id] },
        { type: 'vertical', position: position.x + size.width / 2, elements: [element.id] },
        { type: 'vertical', position: position.x + size.width, elements: [element.id] }
      );
      
      // Horizontal guides (top, center, bottom edges)
      allGuides.push(
        { type: 'horizontal', position: position.y, elements: [element.id] },
        { type: 'horizontal', position: position.y + size.height / 2, elements: [element.id] },
        { type: 'horizontal', position: position.y + size.height, elements: [element.id] }
      );
    });

    return allGuides;
  }, [elements, selectedElements, canvasSize]);

  const getSnapPosition = (position: number, type: 'vertical' | 'horizontal') => {
    const relevantGuides = guides.filter(guide => guide.type === type);
    
    for (const guide of relevantGuides) {
      if (Math.abs(position - guide.position) <= snapThreshold) {
        return guide.position;
      }
    }
    
    return position;
  };

  const activeGuides = useMemo(() => {
    if (selectedElements.length === 0) return [];

    const selectedElement = elements.find(el => selectedElements.includes(el.id));
    if (!selectedElement) return [];

    const { position, size } = selectedElement;
    const activeGuideLines: Guide[] = [];

    // Check which guides are close to the selected element
    guides.forEach(guide => {
      let isActive = false;
      
      if (guide.type === 'vertical') {
        const elementPositions = [
          position.x,
          position.x + size.width / 2,
          position.x + size.width
        ];
        
        isActive = elementPositions.some(pos => 
          Math.abs(pos - guide.position) <= snapThreshold
        );
      } else {
        const elementPositions = [
          position.y,
          position.y + size.height / 2,
          position.y + size.height
        ];
        
        isActive = elementPositions.some(pos => 
          Math.abs(pos - guide.position) <= snapThreshold
        );
      }
      
      if (isActive) {
        activeGuideLines.push(guide);
      }
    });

    return activeGuideLines;
  }, [elements, selectedElements, guides, snapThreshold]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {activeGuides.map((guide, index) => (
        <div
          key={`${guide.type}-${guide.position}-${index}`}
          className={`
            absolute bg-blue-500 opacity-75 z-50
            ${guide.type === 'vertical' 
              ? 'w-0.5 h-full' 
              : 'h-0.5 w-full'
            }
          `}
          style={{
            [guide.type === 'vertical' ? 'left' : 'top']: guide.position,
            [guide.type === 'vertical' ? 'top' : 'left']: 0,
          }}
        />
      ))}
      
      {/* Distance indicators */}
      {selectedElements.length === 1 && (
        <DistanceIndicators
          selectedElement={elements.find(el => selectedElements.includes(el.id))!}
          otherElements={elements.filter(el => !selectedElements.includes(el.id))}
        />
      )}
    </div>
  );
}

interface DistanceIndicatorsProps {
  selectedElement: CVElement;
  otherElements: CVElement[];
}

function DistanceIndicators({ selectedElement, otherElements }: DistanceIndicatorsProps) {
  const nearbyElements = otherElements.filter(element => {
    const distance = Math.sqrt(
      Math.pow(element.position.x - selectedElement.position.x, 2) +
      Math.pow(element.position.y - selectedElement.position.y, 2)
    );
    return distance < 200; // Only show for nearby elements
  });

  return (
    <>
      {nearbyElements.map(element => {
        const dx = element.position.x - selectedElement.position.x;
        const dy = element.position.y - selectedElement.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 10) return null; // Too close to show
        
        const midX = (selectedElement.position.x + element.position.x) / 2;
        const midY = (selectedElement.position.y + element.position.y) / 2;
        
        return (
          <div
            key={element.id}
            className="absolute bg-red-500 text-white text-xs px-1 py-0.5 rounded pointer-events-none z-50"
            style={{
              left: midX,
              top: midY,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {Math.round(distance)}px
          </div>
        );
      })}
    </>
  );
}

// Hook for snapping functionality
export function useSnapping(
  guides: Guide[],
  snapThreshold: number = 5
) {
  const snapToGuides = (position: { x: number; y: number }, size: { width: number; height: number }) => {
    let snappedX = position.x;
    let snappedY = position.y;
    
    const elementPositions = {
      left: position.x,
      centerX: position.x + size.width / 2,
      right: position.x + size.width,
      top: position.y,
      centerY: position.y + size.height / 2,
      bottom: position.y + size.height,
    };
    
    // Check vertical guides
    guides.filter(g => g.type === 'vertical').forEach(guide => {
      Object.entries(elementPositions).forEach(([key, pos]) => {
        if (['left', 'centerX', 'right'].includes(key)) {
          if (Math.abs(pos - guide.position) <= snapThreshold) {
            if (key === 'left') snappedX = guide.position;
            else if (key === 'centerX') snappedX = guide.position - size.width / 2;
            else if (key === 'right') snappedX = guide.position - size.width;
          }
        }
      });
    });
    
    // Check horizontal guides
    guides.filter(g => g.type === 'horizontal').forEach(guide => {
      Object.entries(elementPositions).forEach(([key, pos]) => {
        if (['top', 'centerY', 'bottom'].includes(key)) {
          if (Math.abs(pos - guide.position) <= snapThreshold) {
            if (key === 'top') snappedY = guide.position;
            else if (key === 'centerY') snappedY = guide.position - size.height / 2;
            else if (key === 'bottom') snappedY = guide.position - size.height;
          }
        }
      });
    });
    
    return { x: snappedX, y: snappedY };
  };
  
  return { snapToGuides };
}
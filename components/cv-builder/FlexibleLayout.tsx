"use client";

import { useState, useRef } from 'react';
import { CVElement } from './AdvancedDragDropEditor';

interface FlexibleLayoutProps {
  elements: CVElement[];
  onElementUpdate: (id: string, updates: Partial<CVElement>) => void;
  children: React.ReactNode;
  zoom: number;
}

export function FlexibleLayout({ elements, onElementUpdate, children, zoom }: FlexibleLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default sidebar width
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWidth = 794; // A4 width
  const canvasHeight = 1123; // A4 height

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = Math.max(150, Math.min(400, e.clientX - containerRect.left));
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add event listeners for resizing
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  const sidebarElements = elements.filter(el => el.layout?.column === 'sidebar');
  const mainElements = elements.filter(el => el.layout?.column !== 'sidebar');

  return (
    <div 
      ref={containerRef}
      className="relative bg-white shadow-lg"
      style={{
        width: canvasWidth * (zoom / 100),
        height: canvasHeight * (zoom / 100),
        transform: `scale(${zoom / 100})`,
        transformOrigin: "top left",
      }}
    >
      {/* Sidebar Column */}
      <div
        className="absolute top-0 left-0 h-full border-r border-gray-200 bg-gray-50"
        style={{ width: sidebarWidth }}
      >
        <div className="p-4">
          <div className="text-xs font-medium text-gray-600 mb-2">SIDEBAR</div>
          <div className="text-xs text-gray-500">Drag elements here</div>
        </div>
        
        {/* Sidebar Drop Zone */}
        <div 
          className="absolute inset-0 top-12"
          data-column="sidebar"
        >
          {sidebarElements.map((element) => (
            <div key={`sidebar-${element.id}`}>
              {/* Sidebar elements will be rendered by the main children */}
            </div>
          ))}
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute top-0 h-full w-2 cursor-col-resize bg-transparent hover:bg-blue-200 transition-colors z-10"
        style={{ left: sidebarWidth - 1 }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded"></div>
      </div>

      {/* Main Content Column */}
      <div
        className="absolute top-0 right-0 h-full"
        style={{ 
          left: sidebarWidth + 1,
          width: canvasWidth - sidebarWidth - 1 
        }}
      >
        <div className="p-4">
          <div className="text-xs font-medium text-gray-600 mb-2">MAIN CONTENT</div>
          <div className="text-xs text-gray-500">Drag elements here</div>
        </div>
        
        {/* Main Content Drop Zone */}
        <div 
          className="absolute inset-0 top-12"
          data-column="main"
        >
          {/* Main content elements will be rendered by the main children */}
        </div>
      </div>

      {/* Render all children (elements) */}
      {children}

      {/* Column indicators */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        Sidebar: {sidebarWidth}px
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
        Main: {canvasWidth - sidebarWidth - 1}px
      </div>
    </div>
  );
}
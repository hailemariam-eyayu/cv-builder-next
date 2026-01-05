"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ResizableElement } from "./ResizableElement";
import { ElementToolbar } from "./ElementToolbar";
import { PropertiesPanel } from "./PropertiesPanel";
import { TemplateSelector } from "./TemplateSelector";
import { FontSelector } from "./FontSelector";
import { ColorThemes } from "./ColorThemes";
import { AdvancedShapes } from "./AdvancedShapes";
import { CVScoring } from "./CVScoring";
import { AlignmentGuides } from "./AlignmentGuides";
import { SelectionBox } from "./SelectionBox";
import { Button } from "../ui/button";
import { 
  Save, 
  Download, 
  Eye, 
  Grid, 
  Undo2, 
  Redo2, 
  Type, 
  Palette, 
  Shapes, 
  Award,
  Copy,
  Clipboard,
  Trash2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize
} from "lucide-react";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useUndoRedo } from "../../hooks/useUndoRedo";
import { useClipboard } from "../../hooks/useClipboard";

export interface CVElement {
  id: string;
  type: "text" | "heading" | "image" | "contact" | "experience" | "education" | "skills" | "divider" | "shape";
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: number;
    margin?: number;
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    textAlign?: "left" | "center" | "right" | "justify";
    opacity?: number;
    zIndex?: number;
  };
  layout?: {
    width: "25%" | "50%" | "75%" | "100%" | "auto";
    align: "left" | "center" | "right";
    float?: "left" | "right" | "none";
  };
}

interface AdvancedDragDropEditorProps {
  initialElements?: CVElement[];
  onSave: (elements: CVElement[]) => void;
}

export function AdvancedDragDropEditor({ initialElements = [], onSave }: AdvancedDragDropEditorProps) {
  const [elements, setElements] = useState<CVElement[]>(initialElements);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [canvasSize] = useState({ width: 794, height: 1123 }); // A4 size in pixels
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Modal states
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [showColorThemes, setShowColorThemes] = useState(false);
  const [showAdvancedShapes, setShowAdvancedShapes] = useState(false);
  const [showCVScoring, setShowCVScoring] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Hooks for advanced functionality
  const { addToHistory, undo, redo, canUndo, canRedo } = useUndoRedo(initialElements);
  const { copyElements, pasteElements, hasClipboardContent } = useClipboard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Add to history when elements change
  useEffect(() => {
    if (elements.length > 0) {
      addToHistory(elements);
    }
  }, [elements, addToHistory]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    selectedElements,
    elements,
    onCopy: () => {
      const selectedElementsData = elements.filter(el => selectedElements.includes(el.id));
      copyElements(selectedElementsData);
    },
    onPaste: () => {
      if (hasClipboardContent) {
        const pastedElements = pasteElements();
        setElements([...elements, ...pastedElements]);
      }
    },
    onDelete: () => {
      setElements(elements.filter(el => !selectedElements.includes(el.id)));
      setSelectedElements([]);
    },
    onUndo: () => {
      const previousElements = undo();
      if (previousElements) {
        setElements(previousElements);
        setSelectedElements([]);
      }
    },
    onRedo: () => {
      const nextElements = redo();
      if (nextElements) {
        setElements(nextElements);
        setSelectedElements([]);
      }
    },
    onSelectAll: () => {
      setSelectedElements(elements.map(el => el.id));
    },
    onDuplicate: () => {
      const selectedElementsData = elements.filter(el => selectedElements.includes(el.id));
      const duplicatedElements = selectedElementsData.map(element => ({
        ...element,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: { x: element.position.x + 20, y: element.position.y + 20 }
      }));
      setElements([...elements, ...duplicatedElements]);
    },
    onSave: () => onSave(elements),
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    if (active.data.current?.type === "toolbar-item") {
      // Adding new element from toolbar
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && over?.id === "canvas") {
        const newElement: CVElement = {
          id: `element-${Date.now()}`,
          type: active.data.current.elementType,
          content: getDefaultContent(active.data.current.elementType),
          position: { 
            x: Math.max(0, (event.activatorEvent as PointerEvent).clientX - rect.left - 50),
            y: Math.max(0, (event.activatorEvent as PointerEvent).clientY - rect.top - 25)
          },
          size: getDefaultSize(active.data.current.elementType),
          style: getDefaultStyle(active.data.current.elementType),
        };
        setElements([...elements, newElement]);
      }
    } else {
      // Moving existing element(s)
      if (delta.x !== 0 || delta.y !== 0) {
        const elementsToMove = selectedElements.includes(active.id as string) 
          ? selectedElements 
          : [active.id as string];
        
        setElements(elements.map(el => 
          elementsToMove.includes(el.id)
            ? { 
                ...el, 
                position: { 
                  x: Math.max(0, Math.min(canvasSize.width - el.size.width, el.position.x + delta.x)),
                  y: Math.max(0, Math.min(canvasSize.height - el.size.height, el.position.y + delta.y))
                }
              }
            : el
        ));
      }
    }

    setActiveId(null);
  };

  const handleElementResize = useCallback((id: string, newSize: { width: number; height: number }) => {
    setElements(elements.map(el => 
      el.id === id 
        ? { 
            ...el, 
            size: {
              width: Math.min(canvasSize.width - el.position.x, newSize.width),
              height: Math.min(canvasSize.height - el.position.y, newSize.height)
            }
          }
        : el
    ));
  }, [elements, canvasSize]);

  const updateElement = (id: string, updates: Partial<CVElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElements(prev => prev.filter(selectedId => selectedId !== id));
  };

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement: CVElement = {
        ...element,
        id: `element-${Date.now()}`,
        position: { x: element.position.x + 20, y: element.position.y + 20 }
      };
      setElements([...elements, newElement]);
    }
  };

  const bringToFront = (id: string) => {
    const maxZ = Math.max(...elements.map(el => el.style.zIndex || 0));
    updateElement(id, { style: { ...elements.find(el => el.id === id)?.style, zIndex: maxZ + 1 } });
  };

  const sendToBack = (id: string) => {
    const minZ = Math.min(...elements.map(el => el.style.zIndex || 0));
    updateElement(id, { style: { ...elements.find(el => el.id === id)?.style, zIndex: minZ - 1 } });
  };

  const alignElements = (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (selectedElements.length === 0) return;
    
    const elementsToAlign = elements.filter(el => selectedElements.includes(el.id));
    
    elementsToAlign.forEach(element => {
      let updates: Partial<CVElement> = {};
      
      switch (alignment) {
        case "left":
          updates.position = { ...element.position, x: 0 };
          break;
        case "center":
          updates.position = { ...element.position, x: (canvasSize.width - element.size.width) / 2 };
          break;
        case "right":
          updates.position = { ...element.position, x: canvasSize.width - element.size.width };
          break;
        case "top":
          updates.position = { ...element.position, y: 0 };
          break;
        case "middle":
          updates.position = { ...element.position, y: (canvasSize.height - element.size.height) / 2 };
          break;
        case "bottom":
          updates.position = { ...element.position, y: canvasSize.height - element.size.height };
          break;
      }
      
      updateElement(element.id, updates);
    });
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(25, Math.min(200, newZoom)));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const clearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      setElements([]);
      setSelectedElements([]);
    }
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Left Toolbar */}
      <ElementToolbar />
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const previousElements = undo();
                if (previousElements) setElements(previousElements);
              }}
              disabled={!canUndo}
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const nextElements = redo();
                if (nextElements) setElements(nextElements);
              }}
              disabled={!canRedo}
            >
              <Redo2 className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* Copy/Paste */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const selectedElementsData = elements.filter(el => selectedElements.includes(el.id));
                copyElements(selectedElementsData);
              }}
              disabled={selectedElements.length === 0}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                if (hasClipboardContent) {
                  const pastedElements = pasteElements();
                  setElements([...elements, ...pastedElements]);
                }
              }}
              disabled={!hasClipboardContent}
            >
              <Clipboard className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* View Controls */}
            <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
              <Grid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleZoomChange(zoom - 25)}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <select 
                value={zoom} 
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={25}>25%</option>
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
                <option value={125}>125%</option>
                <option value={150}>150%</option>
                <option value={200}>200%</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => handleZoomChange(zoom + 25)}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* Alignment Tools */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => alignElements("left")}>
                Align Left
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignElements("center")}>
                Center
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignElements("right")}>
                Align Right
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Advanced Tools */}
            <Button variant="outline" size="sm" onClick={() => setShowFontSelector(true)}>
              <Type className="w-4 h-4 mr-2" />
              Fonts
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowColorThemes(true)}>
              <Palette className="w-4 h-4 mr-2" />
              Themes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAdvancedShapes(true)}>
              <Shapes className="w-4 h-4 mr-2" />
              Shapes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowCVScoring(true)}>
              <Award className="w-4 h-4 mr-2" />
              Score CV
            </Button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* View Options */}
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button size="sm" onClick={() => onSave(elements)}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8 bg-gray-200">
          <div className="flex justify-center">
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div
                ref={canvasRef}
                id="canvas"
                className="relative bg-white shadow-lg"
                style={{
                  width: canvasSize.width * (zoom / 100),
                  height: canvasSize.height * (zoom / 100),
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedElements([]);
                  }
                }}
              >
                {/* Grid overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: "20px 20px"
                    }}
                  />
                )}

                {/* Alignment Guides */}
                <AlignmentGuides
                  elements={elements}
                  selectedElements={selectedElements}
                  canvasSize={canvasSize}
                />

                {/* Selection Box */}
                <SelectionBox
                  onSelectionChange={setSelectedElements}
                  elements={elements}
                  canvasRef={canvasRef}
                />

                {/* Elements */}
                {elements.map((element) => (
                  <ResizableElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElements.includes(element.id)}
                    onSelect={() => {
                      if (selectedElements.includes(element.id)) {
                        setSelectedElements(prev => prev.filter(id => id !== element.id));
                      } else {
                        setSelectedElements([element.id]);
                      }
                    }}
                    onUpdate={updateElement}
                    onDelete={deleteElement}
                    onDuplicate={duplicateElement}
                    onResize={handleElementResize}
                    onBringToFront={bringToFront}
                    onSendToBack={sendToBack}
                  />
                ))}

                {/* Drop zone indicator */}
                <div className="absolute inset-0 pointer-events-none" />
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-blue-100 p-4 rounded shadow-lg border-2 border-blue-400">
                    Dragging element...
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>

      {/* Right Properties Panel */}
      <PropertiesPanel
        selectedElement={selectedElements.length === 1 ? elements.find(el => el.id === selectedElements[0]) || null : null}
        onUpdate={updateElement}
        onDelete={deleteElement}
      />

      {/* Modals */}
      {showTemplateSelector && (
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelectTemplate={(templateElements) => setElements(templateElements)}
        />
      )}

      {showFontSelector && (
        <FontSelector
          currentFont={elements.find(el => selectedElements.includes(el.id))?.style.fontFamily || 'Inter'}
          onFontChange={(fontFamily) => {
            selectedElements.forEach(id => {
              updateElement(id, {
                style: { ...elements.find(el => el.id === id)?.style, fontFamily }
              });
            });
          }}
          onClose={() => setShowFontSelector(false)}
        />
      )}

      {showColorThemes && (
        <ColorThemes
          onThemeChange={(theme) => {
            // Apply theme colors to selected elements or all elements
            const elementsToUpdate = selectedElements.length > 0 ? selectedElements : elements.map(el => el.id);
            elementsToUpdate.forEach(id => {
              const element = elements.find(el => el.id === id);
              if (element) {
                let newStyle = { ...element.style };
                
                // Apply theme colors based on element type
                if (element.type === 'heading') {
                  newStyle.color = theme.colors.primary;
                } else if (element.type === 'text') {
                  newStyle.color = theme.colors.text;
                } else if (element.type === 'shape') {
                  newStyle.backgroundColor = theme.colors.accent;
                }
                
                updateElement(id, { style: newStyle });
              }
            });
          }}
          onClose={() => setShowColorThemes(false)}
        />
      )}

      {showAdvancedShapes && (
        <AdvancedShapes
          onShapeSelect={(shape) => {
            const newElement: CVElement = {
              id: `element-${Date.now()}`,
              type: 'shape',
              content: { shape: shape.id, svg: shape.svg },
              position: { x: 100, y: 100 },
              size: { width: 100, height: 100 },
              style: getDefaultStyle('shape'),
            };
            setElements([...elements, newElement]);
          }}
          onClose={() => setShowAdvancedShapes(false)}
        />
      )}

      {showCVScoring && (
        <CVScoring
          elements={elements}
          onClose={() => setShowCVScoring(false)}
        />
      )}
    </div>
  );
}

function getDefaultContent(type: CVElement["type"]) {
  switch (type) {
    case "heading":
      return { text: "Heading Text" };
    case "text":
      return { text: "Your text here" };
    case "contact":
      return { email: "email@example.com", phone: "+1234567890", location: "City, Country" };
    case "experience":
      return { title: "Job Title", company: "Company Name", duration: "2020 - Present", description: "Job description here" };
    case "education":
      return { degree: "Degree", institution: "Institution", year: "2020" };
    case "skills":
      return { skills: ["Skill 1", "Skill 2", "Skill 3"] };
    case "image":
      return { url: "", alt: "Image" };
    case "divider":
      return {};
    case "shape":
      return { shape: "rectangle" };
    default:
      return {};
  }
}

function getDefaultSize(type: CVElement["type"]) {
  switch (type) {
    case "heading":
      return { width: 300, height: 40 };
    case "text":
      return { width: 250, height: 60 };
    case "contact":
      return { width: 200, height: 80 };
    case "experience":
      return { width: 350, height: 120 };
    case "education":
      return { width: 300, height: 80 };
    case "skills":
      return { width: 300, height: 100 };
    case "image":
      return { width: 150, height: 150 };
    case "divider":
      return { width: 300, height: 2 };
    case "shape":
      return { width: 100, height: 100 };
    default:
      return { width: 200, height: 50 };
  }
}

function getDefaultStyle(type: CVElement["type"]) {
  const baseStyle = {
    backgroundColor: "transparent",
    borderColor: "#e5e7eb",
    borderWidth: 0,
    borderRadius: 0,
    padding: 8,
    margin: 0,
    fontSize: 14,
    fontWeight: "normal",
    fontFamily: "Inter, sans-serif",
    color: "#374151",
    textAlign: "left" as const,
    opacity: 1,
    zIndex: 1,
  };

  switch (type) {
    case "heading":
      return { ...baseStyle, fontSize: 24, fontWeight: "bold" };
    case "divider":
      return { ...baseStyle, backgroundColor: "#e5e7eb", padding: 0 };
    case "shape":
      return { ...baseStyle, backgroundColor: "#3b82f6", borderRadius: 4 };
    default:
      return baseStyle;
  }
}
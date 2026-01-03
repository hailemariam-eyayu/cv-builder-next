"use client";

import { useState, useRef, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { ResizableElement } from "./ResizableElement";
import { ElementToolbar } from "./ElementToolbar";
import { PropertiesPanel } from "./PropertiesPanel";
import { TemplateSelector } from "./TemplateSelector";
import { Button } from "../ui/button";
import { Save, Download, Eye, Grid, Layers } from "lucide-react";

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
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 794, height: 1123 }); // A4 size in pixels
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      // Moving existing element
      if (delta.x !== 0 || delta.y !== 0) {
        setElements(elements.map(el => 
          el.id === active.id 
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
    if (selectedElement === id) {
      setSelectedElement(null);
    }
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
    if (!selectedElement) return;
    
    const selectedEl = elements.find(el => el.id === selectedElement);
    if (!selectedEl) return;

    let updates: Partial<CVElement> = {};
    
    switch (alignment) {
      case "left":
        updates.position = { ...selectedEl.position, x: 0 };
        break;
      case "center":
        updates.position = { ...selectedEl.position, x: (canvasSize.width - selectedEl.size.width) / 2 };
        break;
      case "right":
        updates.position = { ...selectedEl.position, x: canvasSize.width - selectedEl.size.width };
        break;
      case "top":
        updates.position = { ...selectedEl.position, y: 0 };
        break;
      case "middle":
        updates.position = { ...selectedEl.position, y: (canvasSize.height - selectedEl.size.height) / 2 };
        break;
      case "bottom":
        updates.position = { ...selectedEl.position, y: canvasSize.height - selectedEl.size.height };
        break;
    }
    
    updateElement(selectedElement, updates);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Toolbar */}
      <ElementToolbar />
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
              <Grid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">Zoom:</span>
              <select 
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
                <option value={125}>125%</option>
                <option value={150}>150%</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
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

                {/* Elements */}
                {elements.map((element) => (
                  <ResizableElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)}
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
        selectedElement={selectedElement ? elements.find(el => el.id === selectedElement) || null : null}
        onUpdate={updateElement}
        onDelete={deleteElement}
      />
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
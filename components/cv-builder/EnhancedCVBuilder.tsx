"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { EnhancedSortableItem } from "./EnhancedSortableItem";
import { Button } from "../ui/button";
import { 
  Plus, 
  Image, 
  Type, 
  Heading, 
  User, 
  Briefcase, 
  GraduationCap, 
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Languages,
  Palette,
  Layout,
  Download,
  Save,
  Eye,
  Trash2
} from "lucide-react";

export interface CVElement {
  id: string;
  type: "text" | "heading" | "image" | "contact" | "experience" | "education" | "skills" | "awards" | "languages" | "divider" | "shape";
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    textAlign?: "left" | "center" | "right";
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    padding?: number;
    opacity?: number;
    zIndex?: number;
  };
}

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elements: CVElement[];
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design",
    thumbnail: "🎨",
    elements: [
      {
        id: "header",
        type: "heading",
        content: { text: "Your Name" },
        position: { x: 50, y: 50 },
        size: { width: 400, height: 60 },
        style: { fontSize: 36, fontWeight: "bold", color: "#1f2937" },
      },
      {
        id: "contact",
        type: "contact",
        content: { email: "your.email@example.com", phone: "+1 (555) 123-4567", location: "City, State" },
        position: { x: 50, y: 120 },
        size: { width: 300, height: 80 },
        style: { fontSize: 14, color: "#6b7280" },
      },
    ],
  },
  {
    id: "creative",
    name: "Creative Designer",
    description: "Colorful and artistic layout",
    thumbnail: "🎭",
    elements: [
      {
        id: "header-bg",
        type: "shape",
        content: { shape: "rectangle" },
        position: { x: 0, y: 0 },
        size: { width: 794, height: 150 },
        style: { backgroundColor: "#3b82f6", borderRadius: 0 },
      },
      {
        id: "name",
        type: "heading",
        content: { text: "Creative Professional" },
        position: { x: 50, y: 40 },
        size: { width: 500, height: 70 },
        style: { fontSize: 42, fontWeight: "bold", color: "#ffffff" },
      },
    ],
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and elegant design",
    thumbnail: "⚪",
    elements: [
      {
        id: "name",
        type: "heading",
        content: { text: "John Doe" },
        position: { x: 100, y: 100 },
        size: { width: 300, height: 50 },
        style: { fontSize: 32, color: "#000000", textAlign: "center" },
      },
    ],
  },
  {
    id: "executive",
    name: "Executive Professional",
    description: "Sophisticated layout for executives",
    thumbnail: "💼",
    elements: [
      {
        id: "sidebar",
        type: "shape",
        content: { shape: "rectangle" },
        position: { x: 0, y: 0 },
        size: { width: 250, height: 1123 },
        style: { backgroundColor: "#1f2937" },
      },
      {
        id: "name",
        type: "heading",
        content: { text: "Executive Name" },
        position: { x: 30, y: 50 },
        size: { width: 190, height: 60 },
        style: { fontSize: 28, fontWeight: "bold", color: "#ffffff" },
      },
    ],
  },
];

const elementTypes = [
  { type: "text", icon: Type, label: "Text", description: "Add text content" },
  { type: "heading", icon: Heading, label: "Heading", description: "Add section headings" },
  { type: "contact", icon: User, label: "Contact Info", description: "Email, phone, address" },
  { type: "experience", icon: Briefcase, label: "Experience", description: "Work experience" },
  { type: "education", icon: GraduationCap, label: "Education", description: "Educational background" },
  { type: "skills", icon: Star, label: "Skills", description: "Technical skills" },
  { type: "awards", icon: Award, label: "Awards", description: "Achievements and awards" },
  { type: "languages", icon: Languages, label: "Languages", description: "Language proficiency" },
  { type: "divider", icon: Palette, label: "Divider", description: "Section divider" },
  { type: "shape", icon: Layout, label: "Shape", description: "Geometric shapes" },
];

interface EnhancedCVBuilderProps {
  initialElements?: CVElement[];
  onSave: (elements: CVElement[]) => void;
}

export function EnhancedCVBuilder({ initialElements = [], onSave }: EnhancedCVBuilderProps) {
  const [elements, setElements] = useState<CVElement[]>(initialElements);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);

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
    const { active, over } = event;

    if (over) {
      // If dragging from sidebar to canvas
      if (active.id.toString().startsWith('template-') || active.id.toString().startsWith('element-')) {
        const dropZone = over.id as string;
        
        if (dropZone === 'canvas') {
          // Add new element to canvas
          if (active.id.toString().startsWith('template-')) {
            const templateId = active.id.toString().replace('template-', '');
            const template = templates.find(t => t.id === templateId);
            if (template) {
              setElements(template.elements);
            }
          } else if (active.id.toString().startsWith('element-')) {
            const elementType = active.id.toString().replace('element-', '') as CVElement['type'];
            addElement(elementType);
          }
        }
      } else {
        // Reorder existing elements
        if (active.id !== over.id) {
          setElements((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      }
    }

    setActiveId(null);
  };

  const addElement = (type: CVElement['type']) => {
    const newElement: CVElement = {
      id: `element-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      position: { x: 50, y: elements.length * 120 + 50 },
      size: getDefaultSize(type),
      style: getDefaultStyle(type),
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: string, updates: Partial<CVElement>) => {
    setElements(elements.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((e) => e.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const selectTemplate = (template: Template) => {
    setElements(template.elements);
    setShowTemplates(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Left Sidebar - Templates and Images */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <Button
                variant={showTemplates ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTemplates(true)}
                className="flex-1"
              >
                <Layout className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button
                variant={!showTemplates ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTemplates(false)}
                className="flex-1"
              >
                <Image className="w-4 h-4 mr-2" />
                Images
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {showTemplates ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-3">CV Templates</h3>
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="group cursor-pointer"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', `template-${template.id}`);
                    }}
                  >
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{template.thumbnail}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => selectTemplate(template)}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => selectTemplate(template)}
                          className="flex-1"
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-3">Image Elements</h3>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', 'element-image');
                  }}
                >
                  <Image className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Profile Picture</p>
                  <p className="text-xs text-gray-500">Drag to add image</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "📷", label: "Photo" },
                    { icon: "🖼️", label: "Frame" },
                    { icon: "🎨", label: "Logo" },
                    { icon: "📊", label: "Chart" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 text-center hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', 'element-image');
                      }}
                    >
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="text-xs text-gray-600">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Other Elements */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col order-3">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">CV Elements</h3>
            <p className="text-sm text-gray-600">Drag elements to your CV</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {elementTypes.map((elementType) => {
                const Icon = elementType.icon;
                return (
                  <div
                    key={elementType.type}
                    className="group cursor-pointer"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', `element-${elementType.type}`);
                    }}
                  >
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                          <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{elementType.label}</h4>
                          <p className="text-xs text-gray-600">{elementType.description}</p>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Properties Panel */}
          {selectedElement && (
            <div className="border-t border-gray-200 p-4">
              <h4 className="font-medium text-gray-800 mb-3">Properties</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Font Size</label>
                  <input
                    type="range"
                    min="8"
                    max="72"
                    className="w-full mt-1"
                    onChange={(e) => {
                      const element = elements.find(el => el.id === selectedElement);
                      if (element) {
                        updateElement(selectedElement, {
                          style: { ...element.style, fontSize: parseInt(e.target.value) }
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Color</label>
                  <input
                    type="color"
                    className="w-full mt-1 h-8 rounded"
                    onChange={(e) => {
                      const element = elements.find(el => el.id === selectedElement);
                      if (element) {
                        updateElement(selectedElement, {
                          style: { ...element.style, color: e.target.value }
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col order-2">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-800">CV Builder</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{elements.length} elements</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={() => onSave(elements)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-8 bg-gray-50 overflow-auto">
            <div
              className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg min-h-[1000px] relative"
              style={{ width: 794, height: 1123 }} // A4 size
              onDrop={(e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('text/plain');
                
                if (data.startsWith('template-')) {
                  const templateId = data.replace('template-', '');
                  const template = templates.find(t => t.id === templateId);
                  if (template) {
                    setElements(template.elements);
                  }
                } else if (data.startsWith('element-')) {
                  const elementType = data.replace('element-', '') as CVElement['type'];
                  addElement(elementType);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <SortableContext items={elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                {elements.map((element) => (
                  <EnhancedSortableItem
                    key={element.id}
                    component={element}
                    onUpdate={updateElement}
                    onDelete={deleteElement}
                    isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)}
                  />
                ))}
              </SortableContext>

              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Layout className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg mb-2">Start Building Your CV</p>
                    <p className="text-sm">Drag templates from the left or elements from the right</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="bg-blue-100 border-2 border-blue-300 p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium text-blue-800">
                  {activeId.toString().startsWith('template-') ? 'Template' : 'Element'}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function getDefaultContent(type: CVElement['type']) {
  switch (type) {
    case "heading":
      return { text: "Section Heading" };
    case "text":
      return { text: "Enter your text here..." };
    case "contact":
      return { email: "your.email@example.com", phone: "+1 (555) 123-4567", location: "City, State" };
    case "experience":
      return { title: "Job Title", company: "Company Name", duration: "2020 - Present", description: "Job description..." };
    case "education":
      return { degree: "Degree", institution: "Institution", year: "Year", gpa: "" };
    case "skills":
      return { skills: ["Skill 1", "Skill 2", "Skill 3"] };
    case "awards":
      return { title: "Award Title", organization: "Organization", year: "Year", description: "" };
    case "languages":
      return { languages: [{ name: "English", level: "Native" }, { name: "Spanish", level: "Intermediate" }] };
    case "image":
      return { url: "", alt: "Profile picture", caption: "" };
    case "divider":
      return {};
    case "shape":
      return { shape: "rectangle" };
    default:
      return {};
  }
}

function getDefaultSize(type: CVElement['type']) {
  switch (type) {
    case "heading":
      return { width: 400, height: 50 };
    case "text":
      return { width: 400, height: 100 };
    case "contact":
      return { width: 300, height: 80 };
    case "experience":
      return { width: 450, height: 120 };
    case "education":
      return { width: 400, height: 80 };
    case "skills":
      return { width: 350, height: 100 };
    case "awards":
      return { width: 400, height: 80 };
    case "languages":
      return { width: 300, height: 80 };
    case "image":
      return { width: 150, height: 150 };
    case "divider":
      return { width: 400, height: 2 };
    case "shape":
      return { width: 200, height: 100 };
    default:
      return { width: 200, height: 50 };
  }
}

function getDefaultStyle(type: CVElement['type']) {
  const baseStyle = {
    fontSize: 14,
    color: "#374151",
    backgroundColor: "transparent",
    textAlign: "left" as const,
    borderWidth: 0,
    borderColor: "#d1d5db",
    borderRadius: 0,
    padding: 0,
    opacity: 1,
    zIndex: 1,
  };

  switch (type) {
    case "heading":
      return { ...baseStyle, fontSize: 24, fontWeight: "bold", color: "#1f2937" };
    case "text":
      return { ...baseStyle, fontSize: 14 };
    case "contact":
      return { ...baseStyle, fontSize: 12, color: "#6b7280" };
    case "divider":
      return { ...baseStyle, backgroundColor: "#d1d5db" };
    case "shape":
      return { ...baseStyle, backgroundColor: "#f3f4f6", borderWidth: 1 };
    default:
      return baseStyle;
  }
}
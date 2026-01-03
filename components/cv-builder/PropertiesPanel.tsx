"use client";

import { CVElement } from "./AdvancedDragDropEditor";
import { Button } from "../ui/button";
import { 
  Palette, 
  Type, 
  Layout, 
  Move, 
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline
} from "lucide-react";

interface PropertiesPanelProps {
  selectedElement: CVElement | null;
  onUpdate: (id: string, updates: Partial<CVElement>) => void;
  onDelete: (id: string) => void;
}

export function PropertiesPanel({ selectedElement, onUpdate, onDelete }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-20">
          <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleStyleChange = (field: string, value: any) => {
    onUpdate(selectedElement.id, {
      style: { ...selectedElement.style, [field]: value },
    });
  };

  const handlePositionChange = (field: "x" | "y", value: number) => {
    onUpdate(selectedElement.id, {
      position: { ...selectedElement.position, [field]: value },
    });
  };

  const handleSizeChange = (field: "width" | "height", value: number) => {
    onUpdate(selectedElement.id, {
      size: { ...selectedElement.size, [field]: value },
    });
  };

  const handleContentChange = (field: string, value: any) => {
    onUpdate(selectedElement.id, {
      content: { ...selectedElement.content, [field]: value },
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 capitalize">
            {selectedElement.type} Properties
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(selectedElement.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Content Properties */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Content
          </h4>
          <ContentEditor element={selectedElement} onChange={handleContentChange} />
        </div>

        {/* Position & Size */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Move className="w-4 h-4" />
            Position & Size
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">X</label>
              <input
                type="number"
                value={Math.round(selectedElement.position.x)}
                onChange={(e) => handlePositionChange("x", Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Y</label>
              <input
                type="number"
                value={Math.round(selectedElement.position.y)}
                onChange={(e) => handlePositionChange("y", Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
              <input
                type="number"
                value={Math.round(selectedElement.size.width)}
                onChange={(e) => handleSizeChange("width", Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
              <input
                type="number"
                value={Math.round(selectedElement.size.height)}
                onChange={(e) => handleSizeChange("height", Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        {(selectedElement.type === "text" || selectedElement.type === "heading") && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Typography
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Size</label>
                <input
                  type="number"
                  value={selectedElement.style.fontSize || 14}
                  onChange={(e) => handleStyleChange("fontSize", Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Weight</label>
                <select
                  value={selectedElement.style.fontWeight || "normal"}
                  onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Light</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Text Align</label>
                <div className="flex gap-1">
                  {["left", "center", "right", "justify"].map((align) => (
                    <Button
                      key={align}
                      size="sm"
                      variant={selectedElement.style.textAlign === align ? "default" : "outline"}
                      onClick={() => handleStyleChange("textAlign", align)}
                      className="flex-1"
                    >
                      {align === "left" && <AlignLeft className="w-3 h-3" />}
                      {align === "center" && <AlignCenter className="w-3 h-3" />}
                      {align === "right" && <AlignRight className="w-3 h-3" />}
                      {align === "justify" && <AlignJustify className="w-3 h-3" />}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                <input
                  type="color"
                  value={selectedElement.style.color || "#374151"}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                  className="w-full h-8 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Background</label>
              <input
                type="color"
                value={selectedElement.style.backgroundColor || "#ffffff"}
                onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Border Color</label>
              <input
                type="color"
                value={selectedElement.style.borderColor || "#e5e7eb"}
                onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Border Width</label>
              <input
                type="number"
                min="0"
                value={selectedElement.style.borderWidth || 0}
                onChange={(e) => handleStyleChange("borderWidth", Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius</label>
              <input
                type="number"
                min="0"
                value={selectedElement.style.borderRadius || 0}
                onChange={(e) => handleStyleChange("borderRadius", Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
              <input
                type="number"
                min="0"
                value={selectedElement.style.padding || 0}
                onChange={(e) => handleStyleChange("padding", Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedElement.style.opacity || 1}
                onChange={(e) => handleStyleChange("opacity", Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {Math.round((selectedElement.style.opacity || 1) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Layer Order */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Layer Order</h4>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Z-Index</label>
            <input
              type="number"
              value={selectedElement.style.zIndex || 1}
              onChange={(e) => handleStyleChange("zIndex", Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentEditor({ 
  element, 
  onChange 
}: { 
  element: CVElement; 
  onChange: (field: string, value: any) => void; 
}) {
  switch (element.type) {
    case "heading":
    case "text":
      return (
        <textarea
          value={element.content.text || ""}
          onChange={(e) => onChange("text", e.target.value)}
          placeholder={`Enter ${element.type}...`}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
          rows={3}
        />
      );
    
    case "contact":
      return (
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            value={element.content.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={element.content.phone || ""}
            onChange={(e) => onChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Location"
            value={element.content.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
      );
    
    case "experience":
      return (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Job Title"
            value={element.content.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Company"
            value={element.content.company || ""}
            onChange={(e) => onChange("company", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Duration (e.g., 2020 - Present)"
            value={element.content.duration || ""}
            onChange={(e) => onChange("duration", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <textarea
            placeholder="Job description..."
            value={element.content.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
            rows={3}
          />
        </div>
      );
    
    case "education":
      return (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Degree"
            value={element.content.degree || ""}
            onChange={(e) => onChange("degree", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Institution"
            value={element.content.institution || ""}
            onChange={(e) => onChange("institution", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Year"
            value={element.content.year || ""}
            onChange={(e) => onChange("year", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
      );
    
    case "skills":
      return (
        <textarea
          placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
          value={element.content.skills?.join(", ") || ""}
          onChange={(e) => onChange("skills", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
          rows={3}
        />
      );
    
    case "image":
      return (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="Image URL"
            value={element.content.url || ""}
            onChange={(e) => onChange("url", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Alt text"
            value={element.content.alt || ""}
            onChange={(e) => onChange("alt", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
      );
    
    default:
      return (
        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
          No content editor available for {element.type}
        </div>
      );
  }
}
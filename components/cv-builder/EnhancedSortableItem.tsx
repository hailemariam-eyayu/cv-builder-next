"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CVElement } from "./EnhancedCVBuilder";
import { GripVertical, Trash2, Edit, Move, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface EnhancedSortableItemProps {
  component: CVElement;
  onUpdate: (id: string, updates: Partial<CVElement>) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function EnhancedSortableItem({ 
  component, 
  onUpdate, 
  onDelete, 
  isSelected = false,
  onSelect 
}: EnhancedSortableItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : (isVisible ? 1 : 0.3),
    left: component.position.x,
    top: component.position.y,
    width: component.size.width,
    height: component.size.height,
    zIndex: component.style.zIndex || 1,
  };

  const elementStyle = {
    fontSize: component.style.fontSize,
    fontWeight: component.style.fontWeight,
    color: component.style.color,
    backgroundColor: component.style.backgroundColor,
    textAlign: component.style.textAlign,
    borderWidth: component.style.borderWidth,
    borderColor: component.style.borderColor,
    borderRadius: component.style.borderRadius,
    padding: component.style.padding,
    opacity: component.style.opacity,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group absolute cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isDragging ? 'z-50' : ''}
      `}
      onClick={onSelect}
    >
      {/* Selection Border */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none rounded" />
      )}

      {/* Control Handles */}
      <div className={`
        absolute -top-8 left-0 flex items-center gap-1 bg-white shadow-lg rounded px-2 py-1 border
        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        transition-opacity duration-200 z-10
      `}>
        <button
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
          title="Drag to move"
        >
          <GripVertical className="w-3 h-3 text-gray-500" />
        </button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(!isEditing);
          }}
          className="h-6 w-6 p-0"
          title="Edit"
        >
          <Edit className="w-3 h-3" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
          className="h-6 w-6 p-0"
          title={isVisible ? "Hide" : "Show"}
        >
          {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(component.id);
          }}
          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Resize Handles */}
      {isSelected && (
        <>
          {/* Corner resize handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-se-resize" />
          
          {/* Edge resize handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-s-resize" />
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-w-resize" />
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-e-resize" />
        </>
      )}

      {/* Element Content */}
      <div 
        className="w-full h-full overflow-hidden"
        style={elementStyle}
      >
        {isEditing ? (
          <EditMode component={component} onUpdate={onUpdate} onFinish={() => setIsEditing(false)} />
        ) : (
          renderElement(component)
        )}
      </div>
    </div>
  );
}

function renderElement(component: CVElement) {
  switch (component.type) {
    case "heading":
      return (
        <h1 className="w-full h-full flex items-center font-bold leading-tight">
          {component.content.text || "Heading"}
        </h1>
      );
      
    case "text":
      return (
        <div className="w-full h-full overflow-auto leading-relaxed">
          {component.content.text || "Text content"}
        </div>
      );
      
    case "contact":
      return (
        <div className="w-full h-full space-y-1 text-sm">
          {component.content.email && (
            <div className="flex items-center gap-2">
              <span>📧</span>
              <span>{component.content.email}</span>
            </div>
          )}
          {component.content.phone && (
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>{component.content.phone}</span>
            </div>
          )}
          {component.content.location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{component.content.location}</span>
            </div>
          )}
        </div>
      );
      
    case "experience":
      return (
        <div className="w-full h-full space-y-2">
          <div>
            <h3 className="font-semibold text-sm">{component.content.title || "Job Title"}</h3>
            <p className="text-xs opacity-75">
              {component.content.company || "Company"} • {component.content.duration || "Duration"}
            </p>
          </div>
          {component.content.description && (
            <p className="text-xs leading-relaxed">{component.content.description}</p>
          )}
        </div>
      );
      
    case "education":
      return (
        <div className="w-full h-full space-y-1">
          <h3 className="font-semibold text-sm">{component.content.degree || "Degree"}</h3>
          <p className="text-xs opacity-75">
            {component.content.institution || "Institution"} • {component.content.year || "Year"}
          </p>
          {component.content.gpa && (
            <p className="text-xs">GPA: {component.content.gpa}</p>
          )}
        </div>
      );
      
    case "skills":
      return (
        <div className="w-full h-full">
          <div className="flex flex-wrap gap-1">
            {(component.content.skills || []).map((skill: string, i: number) => (
              <span 
                key={i} 
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
      
    case "awards":
      return (
        <div className="w-full h-full space-y-1">
          <h3 className="font-semibold text-sm">{component.content.title || "Award Title"}</h3>
          <p className="text-xs opacity-75">
            {component.content.organization || "Organization"} • {component.content.year || "Year"}
          </p>
          {component.content.description && (
            <p className="text-xs">{component.content.description}</p>
          )}
        </div>
      );
      
    case "languages":
      return (
        <div className="w-full h-full space-y-1">
          {(component.content.languages || []).map((lang: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{lang.name}</span>
              <span className="opacity-75">{lang.level}</span>
            </div>
          ))}
        </div>
      );
      
    case "image":
      return component.content.url ? (
        <div className="w-full h-full">
          <img 
            src={component.content.url} 
            alt={component.content.alt || "Image"} 
            className="w-full h-full object-cover rounded"
          />
          {component.content.caption && (
            <p className="text-xs text-center mt-1 opacity-75">{component.content.caption}</p>
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-1">🖼️</div>
            <p className="text-xs">Click to add image</p>
          </div>
        </div>
      );
      
    case "divider":
      return (
        <div 
          className="w-full bg-current"
          style={{ height: component.size.height }}
        />
      );
      
    case "shape":
      return (
        <div 
          className="w-full h-full border"
          style={{
            borderRadius: component.style.borderRadius,
            borderWidth: component.style.borderWidth,
            borderColor: component.style.borderColor,
          }}
        />
      );
      
    default:
      return (
        <div className="w-full h-full bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-gray-500 text-xs">
          {component.type}
        </div>
      );
  }
}

function EditMode({
  component,
  onUpdate,
  onFinish,
}: {
  component: CVElement;
  onUpdate: (id: string, updates: Partial<CVElement>) => void;
  onFinish: () => void;
}) {
  const handleChange = (field: string, value: any) => {
    onUpdate(component.id, {
      content: { ...component.content, [field]: value },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onFinish();
    } else if (e.key === 'Escape') {
      onFinish();
    }
  };

  switch (component.type) {
    case "heading":
    case "text":
      return (
        <input
          type="text"
          value={component.content.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onFinish}
          className="w-full h-full bg-transparent border-none outline-none resize-none"
          placeholder={component.type === "heading" ? "Enter heading..." : "Enter text..."}
          autoFocus
        />
      );
      
    case "contact":
      return (
        <div className="w-full h-full space-y-1 text-xs">
          <input
            type="email"
            placeholder="Email"
            value={component.content.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full bg-transparent border-none outline-none"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={component.content.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full bg-transparent border-none outline-none"
          />
          <input
            type="text"
            placeholder="Location"
            value={component.content.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={onFinish}
            className="w-full bg-transparent border-none outline-none"
          />
        </div>
      );
      
    case "experience":
      return (
        <div className="w-full h-full space-y-1 text-xs">
          <input
            type="text"
            placeholder="Job Title"
            value={component.content.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full bg-transparent border-none outline-none font-semibold"
          />
          <input
            type="text"
            placeholder="Company"
            value={component.content.company || ""}
            onChange={(e) => handleChange("company", e.target.value)}
            className="w-full bg-transparent border-none outline-none"
          />
          <input
            type="text"
            placeholder="Duration"
            value={component.content.duration || ""}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full bg-transparent border-none outline-none"
          />
          <textarea
            placeholder="Description"
            value={component.content.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={onFinish}
            className="w-full flex-1 bg-transparent border-none outline-none resize-none"
          />
        </div>
      );
      
    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
          Edit mode for {component.type}
        </div>
      );
  }
}
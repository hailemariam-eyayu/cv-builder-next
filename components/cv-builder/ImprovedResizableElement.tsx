"use client";

import React, { useState, useRef, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CVElement } from "./AdvancedDragDropEditor";
import { 
  Move, 
  Trash2, 
  Copy, 
  MoreVertical, 
  ArrowUp, 
  ArrowDown,
  Edit3,
  RotateCw,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ImprovedResizableElementProps {
  element: CVElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<CVElement>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onResize: (id: string, newSize: { width: number; height: number }) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onRotate?: (id: string, angle: number) => void;
  onLock?: (id: string, locked: boolean) => void;
}

export function ImprovedResizableElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onResize,
  onBringToFront,
  onSendToBack,
  onRotate,
  onLock,
}: ImprovedResizableElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [rotation, setRotation] = useState(0);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: { type: "element" },
    disabled: isLocked,
  });

  const handleMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    if (isLocked) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.size.width;
    const startHeight = element.size.height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("right")) {
        newWidth = Math.max(20, startWidth + deltaX);
      }
      if (direction.includes("left")) {
        newWidth = Math.max(20, startWidth - deltaX);
      }
      if (direction.includes("bottom")) {
        newHeight = Math.max(20, startHeight + deltaY);
      }
      if (direction.includes("top")) {
        newHeight = Math.max(20, startHeight - deltaY);
      }

      onResize(element.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [element.id, element.size, onResize, isLocked]);

  const handleContentChange = (field: string, value: any) => {
    onUpdate(element.id, {
      content: { ...element.content, [field]: value },
    });
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    if (onRotate) {
      onRotate(element.id, newRotation);
    }
  };

  const handleLock = () => {
    const newLocked = !isLocked;
    setIsLocked(newLocked);
    if (onLock) {
      onLock(element.id, newLocked);
    }
  };

  const elementStyle = {
    position: "absolute" as const,
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    zIndex: element.style.zIndex || 1,
    transform: `${transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : ''} rotate(${rotation}deg)`,
    opacity: isDragging ? 0.5 : element.style.opacity || 1,
    backgroundColor: element.style.backgroundColor,
    borderColor: element.style.borderColor,
    borderWidth: element.style.borderWidth,
    borderStyle: element.style.borderWidth ? "solid" : "none",
    borderRadius: element.style.borderRadius,
    padding: element.style.padding,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    fontFamily: element.style.fontFamily,
    color: element.style.color,
    textAlign: element.style.textAlign,
  };

  return (
    <div
      ref={setNodeRef}
      style={elementStyle}
      className={`group cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
      } ${isResizing ? "select-none" : ""} ${isLocked ? "cursor-not-allowed opacity-75" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Content */}
      <div className="w-full h-full overflow-hidden">
        {renderElementContent(element, isEditing, handleContentChange)}
      </div>

      {/* Selection Controls */}
      {isSelected && !isLocked && (
        <>
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute -top-10 left-0 bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-move flex items-center gap-2 shadow-lg"
          >
            <Move className="w-3 h-3" />
            <span className="font-medium">{element.type}</span>
          </div>

          {/* Action Buttons */}
          <div className="absolute -top-10 right-0 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleRotate();
              }}
              className="h-8 w-8 p-0"
            >
              <RotateCw className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleLock();
              }}
              className="h-8 w-8 p-0"
            >
              {isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onDuplicate(element.id)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBringToFront(element.id)}>
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Bring to Front
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSendToBack(element.id)}>
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Send to Back
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(element.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Enhanced Resize Handles */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner handles */}
            <div
              className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize pointer-events-auto shadow-md hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, "top-left")}
            />
            <div
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize pointer-events-auto shadow-md hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, "top-right")}
            />
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize pointer-events-auto shadow-md hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
            />
            <div
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize pointer-events-auto shadow-md hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
            />

            {/* Edge handles */}
            <div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-n-resize pointer-events-auto shadow-md hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, "top")}
            />
            <div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-s-resize pointer-events-auto shadow-md hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, "bottom")}
            />
            <div
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-w-resize pointer-events-auto shadow-md hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, "left")}
            />
            <div
              className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-e-resize pointer-events-auto shadow-md hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, "right")}
            />
          </div>
        </>
      )}

      {/* Lock Indicator */}
      {isLocked && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-2 py-1 rounded text-xs">
          <Lock className="w-3 h-3 inline mr-1" />
          Locked
        </div>
      )}
    </div>
  );
}

function renderElementContent(
  element: CVElement,
  isEditing: boolean,
  onContentChange: (field: string, value: any) => void
) {
  if (isEditing) {
    return <EditMode element={element} onContentChange={onContentChange} />;
  }

  switch (element.type) {
    case "heading":
      return (
        <h1 className="w-full h-full flex items-center font-bold">
          {element.content.text || "Heading"}
        </h1>
      );
    case "text":
      return (
        <div className="w-full h-full">
          <p className="break-words">{element.content.text || "Text"}</p>
        </div>
      );
    case "contact":
      return (
        <div className="w-full h-full text-sm space-y-1">
          {element.content.email && <div>📧 {element.content.email}</div>}
          {element.content.phone && <div>📞 {element.content.phone}</div>}
          {element.content.location && <div>📍 {element.content.location}</div>}
        </div>
      );
    case "experience":
      return (
        <div className="w-full h-full text-sm">
          <div className="font-semibold">{element.content.title}</div>
          <div className="text-gray-600">{element.content.company} • {element.content.duration}</div>
          <div className="mt-1 text-xs">{element.content.description}</div>
        </div>
      );
    case "education":
      return (
        <div className="w-full h-full text-sm">
          <div className="font-semibold">{element.content.degree}</div>
          <div className="text-gray-600">{element.content.institution}</div>
          <div className="text-gray-500">{element.content.year}</div>
        </div>
      );
    case "skills":
      return (
        <div className="w-full h-full">
          <div className="flex flex-wrap gap-1">
            {element.content.skills?.map((skill: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
    case "image":
      return element.content.url ? (
        <img 
          src={element.content.url} 
          alt={element.content.alt} 
          className="w-full h-full object-cover rounded"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      );
    case "divider":
      return <div className="w-full h-full bg-gray-300" />;
    case "shape":
      return (
        <div 
          className="w-full h-full"
          style={{
            backgroundColor: element.style.backgroundColor,
            borderRadius: element.style.borderRadius,
          }}
        />
      );
    default:
      return <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
        {element.type}
      </div>;
  }
}

function EditMode({
  element,
  onContentChange,
}: {
  element: CVElement;
  onContentChange: (field: string, value: any) => void;
}) {
  switch (element.type) {
    case "heading":
    case "text":
      return (
        <textarea
          value={element.content.text || ""}
          onChange={(e) => onContentChange("text", e.target.value)}
          className="w-full h-full resize-none border-none outline-none bg-transparent"
          placeholder={`Enter ${element.type}...`}
        />
      );
    case "contact":
      return (
        <div className="w-full h-full space-y-1 text-xs">
          <input
            type="email"
            placeholder="Email"
            value={element.content.email || ""}
            onChange={(e) => onContentChange("email", e.target.value)}
            className="w-full border-none outline-none bg-transparent"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={element.content.phone || ""}
            onChange={(e) => onContentChange("phone", e.target.value)}
            className="w-full border-none outline-none bg-transparent"
          />
          <input
            type="text"
            placeholder="Location"
            value={element.content.location || ""}
            onChange={(e) => onContentChange("location", e.target.value)}
            className="w-full border-none outline-none bg-transparent"
          />
        </div>
      );
    case "experience":
      return (
        <div className="w-full h-full space-y-1 text-xs">
          <input
            type="text"
            placeholder="Job Title"
            value={element.content.title || ""}
            onChange={(e) => onContentChange("title", e.target.value)}
            className="w-full border-none outline-none bg-transparent font-semibold"
          />
          <input
            type="text"
            placeholder="Company"
            value={element.content.company || ""}
            onChange={(e) => onContentChange("company", e.target.value)}
            className="w-full border-none outline-none bg-transparent"
          />
          <input
            type="text"
            placeholder="Duration"
            value={element.content.duration || ""}
            onChange={(e) => onContentChange("duration", e.target.value)}
            className="w-full border-none outline-none bg-transparent"
          />
          <textarea
            placeholder="Description"
            value={element.content.description || ""}
            onChange={(e) => onContentChange("description", e.target.value)}
            className="w-full flex-1 resize-none border-none outline-none bg-transparent"
          />
        </div>
      );
    case "skills":
      return (
        <input
          type="text"
          placeholder="Skill1, Skill2, Skill3"
          value={element.content.skills?.join(", ") || ""}
          onChange={(e) => onContentChange("skills", e.target.value.split(",").map((s: string) => s.trim()))}
          className="w-full h-full border-none outline-none bg-transparent"
        />
      );
    case "image":
      return (
        <input
          type="url"
          placeholder="Image URL"
          value={element.content.url || ""}
          onChange={(e) => onContentChange("url", e.target.value)}
          className="w-full h-full border-none outline-none bg-transparent"
        />
      );
    default:
      return <div className="w-full h-full">Edit mode for {element.type}</div>;
  }
}
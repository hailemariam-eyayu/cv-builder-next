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
  columnWidth?: number;
}

export function EnhancedSortableItem({ 
  component, 
  onUpdate, 
  onDelete, 
  isSelected = false,
  onSelect,
  columnWidth = 400
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
    // Remove absolute positioning to work with flexbox layout
    width: Math.min(component.size.width, columnWidth || 400),
    height: component.size.height,
    zIndex: component.style.zIndex || 1,
    maxWidth: '100%', // Ensure it doesn't exceed container
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
        group relative cursor-pointer transition-all duration-200 mb-4 rounded-lg
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' : 'hover:shadow-md'}
        ${isDragging ? 'z-50 shadow-2xl' : ''}
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
          renderElement(component, columnWidth, onUpdate)
        )}
      </div>
    </div>
  );
}

function renderElement(component: CVElement, columnWidth: number = 400, onUpdate?: (id: string, updates: Partial<CVElement>) => void) {
  const isLeftColumn = component.position.x < 265;
  
  switch (component.type) {
    case "heading":
      return (
        <div className="w-full h-full flex items-center">
          <h1 className={`
            font-bold leading-tight tracking-tight bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent
            ${isLeftColumn ? 'text-slate-800' : 'text-gray-900'}
          `}>
            {component.content.text || "Heading"}
          </h1>
        </div>
      );
      
    case "text":
      return (
        <div className={`
          w-full h-full overflow-auto leading-relaxed p-3 bg-white bg-opacity-70 rounded-lg shadow-sm
          ${isLeftColumn ? 'text-slate-700' : 'text-gray-800'}
        `}>
          {component.content.text || "Text content"}
        </div>
      );
      
    case "contact":
      return (
        <div className="w-full h-full space-y-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-inner">
          {component.content.email && (
            <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white text-sm">📧</span>
              </div>
              <span className="text-sm text-gray-700 break-all font-medium">{component.content.email}</span>
            </div>
          )}
          {component.content.phone && (
            <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white text-sm">📞</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{component.content.phone}</span>
            </div>
          )}
          {component.content.location && (
            <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white text-sm">📍</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{component.content.location}</span>
            </div>
          )}
        </div>
      );
      
    case "experience":
      return (
        <div className="w-full h-full space-y-3 p-5 bg-gradient-to-r from-white to-blue-50 border-l-4 border-blue-500 shadow-lg rounded-r-xl hover:shadow-xl transition-all duration-300">
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{component.content.title || "Job Title"}</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{component.content.company || "Company"}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{component.content.duration || "Duration"}</span>
            </div>
          </div>
          {component.content.description && (
            <p className="text-sm leading-relaxed text-gray-700 bg-white bg-opacity-50 p-3 rounded-lg">{component.content.description}</p>
          )}
        </div>
      );
      
    case "education":
      return (
        <div className="w-full h-full space-y-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-gray-900">{component.content.degree || "Degree"}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-purple-600">{component.content.institution || "Institution"}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{component.content.year || "Year"}</span>
          </div>
          {component.content.gpa && (
            <p className="text-sm text-gray-600">GPA: <span className="font-medium">{component.content.gpa}</span></p>
          )}
        </div>
      );
      
    case "skills":
      return (
        <div className="w-full h-full">
          <div className="flex flex-wrap gap-2">
            {(component.content.skills || []).map((skill: string, i: number) => (
              <span 
                key={i} 
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full text-xs font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
      
    case "awards":
      return (
        <div className="w-full h-full space-y-2 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 text-lg">🏆</span>
            <h3 className="font-semibold text-gray-900">{component.content.title || "Award Title"}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-orange-600">{component.content.organization || "Organization"}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{component.content.year || "Year"}</span>
          </div>
          {component.content.description && (
            <p className="text-sm text-gray-700">{component.content.description}</p>
          )}
        </div>
      );
      
    case "languages":
      return (
        <div className="w-full h-full space-y-3">
          {(component.content.languages || []).map((lang: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-800">{lang.name}</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{lang.level}</span>
            </div>
          ))}
        </div>
      );
      
    case "image":
      return component.content.url ? (
        <div className="w-full h-full relative group">
          <img 
            src={component.content.url} 
            alt={component.content.alt || "Image"} 
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
          {/* Upload overlay on hover */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file && onUpdate) {
                  // Show loading state
                  onUpdate(component.id, {
                    content: { ...component.content, uploading: true }
                  });
                  
                  try {
                    // Convert to base64 for upload
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                      const base64 = e.target?.result as string;
                      
                      // Upload to Cloudinary
                      const formData = new FormData();
                      formData.append('file', base64);
                      formData.append('upload_preset', 'ml_default'); // You may need to set this
                      
                      try {
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData,
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          onUpdate(component.id, {
                            content: { 
                              ...component.content, 
                              url: data.secure_url || base64, // Fallback to base64 if upload fails
                              uploading: false 
                            }
                          });
                        } else {
                          // Fallback to base64 if upload fails
                          onUpdate(component.id, {
                            content: { 
                              ...component.content, 
                              url: base64,
                              uploading: false 
                            }
                          });
                        }
                      } catch (error) {
                        console.error('Upload failed:', error);
                        // Fallback to base64
                        onUpdate(component.id, {
                          content: { 
                            ...component.content, 
                            url: base64,
                            uploading: false 
                          }
                        });
                      }
                    };
                    reader.readAsDataURL(file);
                  } catch (error) {
                    console.error('File reading failed:', error);
                    onUpdate(component.id, {
                      content: { ...component.content, uploading: false }
                    });
                  }
                }
              };
              input.click();
            }}
          >
            <div className="text-center text-white">
              <div className="text-2xl mb-1">📷</div>
              <p className="text-sm font-medium">Change Image</p>
            </div>
          </div>
          {component.content.caption && (
            <p className="text-xs text-center mt-2 text-gray-600">{component.content.caption}</p>
          )}
        </div>
      ) : (
        <div 
          className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 transition-all duration-300 shadow-inner"
          onClick={(e) => {
            e.stopPropagation();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file && onUpdate) {
                // Show loading state
                onUpdate(component.id, {
                  content: { ...component.content, uploading: true }
                });
                
                try {
                  // Convert to base64 for upload
                  const reader = new FileReader();
                  reader.onload = async (e) => {
                    const base64 = e.target?.result as string;
                    
                    // Upload to Cloudinary
                    const formData = new FormData();
                    formData.append('file', base64);
                    formData.append('upload_preset', 'ml_default'); // You may need to set this
                    
                    try {
                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        onUpdate(component.id, {
                          content: { 
                            ...component.content, 
                            url: data.secure_url || base64, // Fallback to base64 if upload fails
                            uploading: false 
                          }
                        });
                      } else {
                        // Fallback to base64 if upload fails
                        onUpdate(component.id, {
                          content: { 
                            ...component.content, 
                            url: base64,
                            uploading: false 
                          }
                        });
                      }
                    } catch (error) {
                      console.error('Upload failed:', error);
                      // Fallback to base64
                      onUpdate(component.id, {
                        content: { 
                          ...component.content, 
                          url: base64,
                          uploading: false 
                        }
                      });
                    }
                  };
                  reader.readAsDataURL(file);
                } catch (error) {
                  console.error('File reading failed:', error);
                  onUpdate(component.id, {
                    content: { ...component.content, uploading: false }
                  });
                }
              }
            };
            input.click();
          }}
        >
          <div className="text-center text-blue-600">
            {component.content.uploading ? (
              <>
                <div className="animate-spin text-3xl mb-2">⏳</div>
                <p className="text-sm font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">📷</div>
                <p className="text-sm font-bold mb-1">Click to Upload Image</p>
                <p className="text-xs text-blue-500">JPG, PNG, GIF up to 10MB</p>
              </>
            )}
          </div>
        </div>
      );
      
    case "divider":
      return (
        <div 
          className="w-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full"
          style={{ height: Math.max(component.size.height, 2) }}
        />
      );
      
    case "shape":
      return (
        <div 
          className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 border border-gray-400 shadow-inner"
          style={{
            borderRadius: component.style.borderRadius,
            borderWidth: component.style.borderWidth,
            borderColor: component.style.borderColor,
          }}
        />
      );
      
    default:
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium">
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
"use client";

import { useDraggable } from "@dnd-kit/core";
import { 
  Type, 
  Heading1, 
  Image, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Minus,
  Square,
  Circle,
  Triangle
} from "lucide-react";

const elementTypes = [
  { type: "heading", icon: Heading1, label: "Heading", color: "bg-blue-100 text-blue-700" },
  { type: "text", icon: Type, label: "Text", color: "bg-gray-100 text-gray-700" },
  { type: "image", icon: Image, label: "Image", color: "bg-green-100 text-green-700" },
  { type: "contact", icon: User, label: "Contact", color: "bg-purple-100 text-purple-700" },
  { type: "experience", icon: Briefcase, label: "Experience", color: "bg-orange-100 text-orange-700" },
  { type: "education", icon: GraduationCap, label: "Education", color: "bg-indigo-100 text-indigo-700" },
  { type: "skills", icon: Award, label: "Skills", color: "bg-yellow-100 text-yellow-700" },
  { type: "divider", icon: Minus, label: "Divider", color: "bg-gray-100 text-gray-700" },
  { type: "shape", icon: Square, label: "Shape", color: "bg-pink-100 text-pink-700" },
];

export function ElementToolbar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-gray-800 mb-4">Elements</h3>
      
      <div className="space-y-2">
        {elementTypes.map((element) => (
          <DraggableElement
            key={element.type}
            type={element.type}
            icon={element.icon}
            label={element.label}
            color={element.color}
          />
        ))}
      </div>

      <div className="mt-8">
        <h4 className="font-medium text-gray-700 mb-3">Templates</h4>
        <div className="space-y-2">
          <TemplateItem name="Modern" preview="modern-preview.jpg" />
          <TemplateItem name="Classic" preview="classic-preview.jpg" />
          <TemplateItem name="Creative" preview="creative-preview.jpg" />
          <TemplateItem name="Minimal" preview="minimal-preview.jpg" />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-medium text-gray-700 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm">
            📄 New Document
          </button>
          <button className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm">
            📁 Load Template
          </button>
          <button className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm">
            💾 Save as Template
          </button>
          <button className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm">
            🔄 Reset Canvas
          </button>
        </div>
      </div>
    </div>
  );
}

function DraggableElement({ 
  type, 
  icon: Icon, 
  label, 
  color 
}: { 
  type: string; 
  icon: any; 
  label: string; 
  color: string; 
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `toolbar-${type}`,
    data: { 
      type: "toolbar-item",
      elementType: type 
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200 border border-gray-200
        ${color}
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function TemplateItem({ name, preview }: { name: string; preview: string }) {
  return (
    <div className="p-2 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
      <div className="w-full h-20 bg-gray-100 rounded mb-2 flex items-center justify-center text-xs text-gray-500">
        {name} Preview
      </div>
      <div className="text-sm font-medium text-center">{name}</div>
    </div>
  );
}
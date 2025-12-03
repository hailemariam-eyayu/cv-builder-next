"use client";

import { Type, Heading1, Image, Mail, Briefcase, GraduationCap, Award } from "lucide-react";
import { CVComponent } from "./DragDropEditor";

interface ComponentToolbarProps {
  onAddComponent: (type: CVComponent["type"]) => void;
}

const components = [
  { type: "heading" as const, icon: Heading1, label: "Heading" },
  { type: "text" as const, icon: Type, label: "Text" },
  { type: "image" as const, icon: Image, label: "Image" },
  { type: "contact" as const, icon: Mail, label: "Contact" },
  { type: "experience" as const, icon: Briefcase, label: "Experience" },
  { type: "education" as const, icon: GraduationCap, label: "Education" },
  { type: "skills" as const, icon: Award, label: "Skills" },
];

export function ComponentToolbar({ onAddComponent }: ComponentToolbarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <div className="space-y-2">
        {components.map((component) => (
          <button
            key={component.type}
            onClick={() => onAddComponent(component.type)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <component.icon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">{component.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CVElement } from "./AdvancedDragDropEditor";
import { Button } from "../ui/button";
import { X, Eye } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  elements: CVElement[];
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design with bold typography",
    preview: "/templates/modern-preview.jpg",
    elements: [
      {
        id: "header",
        type: "heading",
        content: { text: "Your Name" },
        position: { x: 50, y: 50 },
        size: { width: 400, height: 60 },
        style: {
          fontSize: 36,
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "left",
          backgroundColor: "transparent",
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: "contact",
        type: "contact",
        content: {
          email: "your.email@example.com",
          phone: "+1 (555) 123-4567",
          location: "City, State"
        },
        position: { x: 50, y: 120 },
        size: { width: 300, height: 80 },
        style: {
          fontSize: 14,
          color: "#6b7280",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: "experience-title",
        type: "heading",
        content: { text: "Experience" },
        position: { x: 50, y: 220 },
        size: { width: 200, height: 40 },
        style: {
          fontSize: 24,
          fontWeight: "bold",
          color: "#1f2937",
          backgroundColor: "transparent",
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: "experience-1",
        type: "experience",
        content: {
          title: "Senior Developer",
          company: "Tech Company",
          duration: "2020 - Present",
          description: "Led development of web applications using modern technologies."
        },
        position: { x: 50, y: 270 },
        size: { width: 400, height: 120 },
        style: {
          fontSize: 14,
          color: "#374151",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },
  {
    id: "creative",
    name: "Creative Designer",
    description: "Colorful and artistic layout perfect for creative professionals",
    preview: "/templates/creative-preview.jpg",
    elements: [
      {
        id: "header-bg",
        type: "shape",
        content: { shape: "rectangle" },
        position: { x: 0, y: 0 },
        size: { width: 794, height: 150 },
        style: {
          backgroundColor: "#3b82f6",
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          zIndex: 0,
        },
      },
      {
        id: "name",
        type: "heading",
        content: { text: "Creative Professional" },
        position: { x: 50, y: 40 },
        size: { width: 500, height: 70 },
        style: {
          fontSize: 42,
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "left",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: "tagline",
        type: "text",
        content: { text: "Bringing ideas to life through design" },
        position: { x: 50, y: 100 },
        size: { width: 400, height: 30 },
        style: {
          fontSize: 18,
          color: "#e5e7eb",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and elegant design focusing on content",
    preview: "/templates/minimal-preview.jpg",
    elements: [
      {
        id: "name",
        type: "heading",
        content: { text: "John Doe" },
        position: { x: 100, y: 100 },
        size: { width: 300, height: 50 },
        style: {
          fontSize: 32,
          fontWeight: "normal",
          color: "#000000",
          textAlign: "center",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: "divider",
        type: "divider",
        content: {},
        position: { x: 150, y: 160 },
        size: { width: 200, height: 1 },
        style: {
          backgroundColor: "#000000",
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: "title",
        type: "text",
        content: { text: "Professional Title" },
        position: { x: 100, y: 180 },
        size: { width: 300, height: 30 },
        style: {
          fontSize: 16,
          color: "#666666",
          textAlign: "center",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },
  {
    id: "executive",
    name: "Executive Professional",
    description: "Sophisticated layout for senior professionals and executives",
    preview: "/templates/executive-preview.jpg",
    elements: [
      {
        id: "sidebar",
        type: "shape",
        content: { shape: "rectangle" },
        position: { x: 0, y: 0 },
        size: { width: 250, height: 1123 },
        style: {
          backgroundColor: "#1f2937",
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          zIndex: 0,
        },
      },
      {
        id: "name",
        type: "heading",
        content: { text: "Executive Name" },
        position: { x: 30, y: 50 },
        size: { width: 190, height: 60 },
        style: {
          fontSize: 28,
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "left",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: "contact-sidebar",
        type: "contact",
        content: {
          email: "executive@company.com",
          phone: "+1 (555) 987-6543",
          location: "New York, NY"
        },
        position: { x: 30, y: 130 },
        size: { width: 190, height: 100 },
        style: {
          fontSize: 12,
          color: "#d1d5db",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: "main-content",
        type: "text",
        content: { text: "Professional Summary\n\nExperienced executive with proven track record..." },
        position: { x: 280, y: 50 },
        size: { width: 450, height: 200 },
        style: {
          fontSize: 14,
          color: "#374151",
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 20,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },
];

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (elements: CVElement[]) => void;
}

export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  if (!isOpen) return null;

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template.elements);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Choose a Template</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Template List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-all duration-200
                    ${selectedTemplate?.id === template.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-500 text-sm">
                    {template.name} Preview
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          <div className="flex-1 flex flex-col">
            {selectedTemplate ? (
              <>
                <div className="flex-1 p-6 bg-gray-50 overflow-auto">
                  <div className="bg-white shadow-lg mx-auto" style={{ width: 400, height: 565 }}>
                    <div className="relative w-full h-full overflow-hidden">
                      {selectedTemplate.elements.map((element) => (
                        <div
                          key={element.id}
                          className="absolute"
                          style={{
                            left: element.position.x * 0.5, // Scale down for preview
                            top: element.position.y * 0.5,
                            width: element.size.width * 0.5,
                            height: element.size.height * 0.5,
                            backgroundColor: element.style.backgroundColor,
                            color: element.style.color,
                            fontSize: (element.style.fontSize || 14) * 0.5,
                            fontWeight: element.style.fontWeight,
                            textAlign: element.style.textAlign,
                            padding: (element.style.padding || 0) * 0.5,
                            borderRadius: element.style.borderRadius,
                            opacity: element.style.opacity,
                            zIndex: element.style.zIndex,
                          }}
                        >
                          {element.type === "heading" && element.content.text}
                          {element.type === "text" && element.content.text}
                          {element.type === "contact" && (
                            <div className="text-xs space-y-1">
                              <div>{element.content.email}</div>
                              <div>{element.content.phone}</div>
                              <div>{element.content.location}</div>
                            </div>
                          )}
                          {element.type === "experience" && (
                            <div className="text-xs">
                              <div className="font-semibold">{element.content.title}</div>
                              <div>{element.content.company}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button onClick={() => handleSelectTemplate(selectedTemplate)}>
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <p>Select a template to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
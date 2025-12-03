"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CVComponent } from "./DragDropEditor";
import { GripVertical, Trash2, Edit } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface SortableItemProps {
  component: CVComponent;
  onUpdate: (id: string, updates: Partial<CVComponent>) => void;
  onDelete: (id: string) => void;
}

export function SortableItem({ component, onUpdate, onDelete }: SortableItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative mb-4 p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
    >
      <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(component.id)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>

      <div className="pl-8">
        {renderComponent(component, isEditing, onUpdate)}
      </div>
    </div>
  );
}

function renderComponent(
  component: CVComponent,
  isEditing: boolean,
  onUpdate: (id: string, updates: Partial<CVComponent>) => void
) {
  if (isEditing) {
    return <EditMode component={component} onUpdate={onUpdate} />;
  }

  switch (component.type) {
    case "heading":
      return (
        <h1 className="text-3xl font-bold" style={{ fontSize: component.content.fontSize }}>
          {component.content.text}
        </h1>
      );
    case "text":
      return <p className="text-gray-700">{component.content.text}</p>;
    case "contact":
      return (
        <div className="space-y-1">
          <p>Email: {component.content.email}</p>
          <p>Phone: {component.content.phone}</p>
          <p>Location: {component.content.location}</p>
        </div>
      );
    case "experience":
      return (
        <div>
          <h3 className="font-semibold">{component.content.title}</h3>
          <p className="text-sm text-gray-600">{component.content.company} • {component.content.duration}</p>
          <p className="mt-2">{component.content.description}</p>
        </div>
      );
    case "education":
      return (
        <div>
          <h3 className="font-semibold">{component.content.degree}</h3>
          <p className="text-sm text-gray-600">{component.content.institution} • {component.content.year}</p>
        </div>
      );
    case "skills":
      return (
        <div className="flex flex-wrap gap-2">
          {component.content.skills.map((skill: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      );
    case "image":
      return component.content.url ? (
        <img src={component.content.url} alt={component.content.alt} className="w-32 h-32 rounded-full object-cover" />
      ) : (
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
          No Image
        </div>
      );
    default:
      return null;
  }
}

function EditMode({
  component,
  onUpdate,
}: {
  component: CVComponent;
  onUpdate: (id: string, updates: Partial<CVComponent>) => void;
}) {
  const handleChange = (field: string, value: any) => {
    onUpdate(component.id, {
      content: { ...component.content, [field]: value },
    });
  };

  switch (component.type) {
    case "heading":
    case "text":
      return (
        <input
          type="text"
          value={component.content.text}
          onChange={(e) => handleChange("text", e.target.value)}
          className="w-full p-2 border rounded"
        />
      );
    case "contact":
      return (
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            value={component.content.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={component.content.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={component.content.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      );
    default:
      return <div>Edit mode for {component.type}</div>;
  }
}

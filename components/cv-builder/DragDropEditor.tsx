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
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { ComponentToolbar } from "./ComponentToolbar";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export interface CVComponent {
  id: string;
  type: "text" | "heading" | "image" | "contact" | "experience" | "education" | "skills";
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DragDropEditorProps {
  initialComponents?: CVComponent[];
  onSave: (components: CVComponent[]) => void;
}

export function DragDropEditor({ initialComponents = [], onSave }: DragDropEditorProps) {
  const [components, setComponents] = useState<CVComponent[]>(initialComponents);
  const [activeId, setActiveId] = useState<string | null>(null);

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

    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const addComponent = (type: CVComponent["type"]) => {
    const newComponent: CVComponent = {
      id: `component-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      position: { x: 0, y: components.length * 100 },
      size: { width: 100, height: 100 },
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (id: string, updates: Partial<CVComponent>) => {
    setComponents(components.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter((c) => c.id !== id));
  };

  return (
    <div className="flex h-full">
      <ComponentToolbar onAddComponent={addComponent} />
      
      <div className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 min-h-[1000px]">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              {components.map((component) => (
                <SortableItem
                  key={component.id}
                  component={component}
                  onUpdate={updateComponent}
                  onDelete={deleteComponent}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="bg-blue-100 p-4 rounded shadow-lg">
                  Dragging...
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {components.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Plus className="w-16 h-16 mx-auto mb-4" />
              <p>Add components from the toolbar to start building your CV</p>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setComponents([])}>
            Clear All
          </Button>
          <Button onClick={() => onSave(components)}>
            Save CV
          </Button>
        </div>
      </div>
    </div>
  );
}

function getDefaultContent(type: CVComponent["type"]) {
  switch (type) {
    case "heading":
      return { text: "Your Name", fontSize: 32, fontWeight: "bold" };
    case "text":
      return { text: "Enter text here", fontSize: 14 };
    case "contact":
      return { email: "", phone: "", location: "" };
    case "experience":
      return { title: "", company: "", duration: "", description: "" };
    case "education":
      return { degree: "", institution: "", year: "" };
    case "skills":
      return { skills: [] };
    case "image":
      return { url: "", alt: "Profile picture" };
    default:
      return {};
  }
}

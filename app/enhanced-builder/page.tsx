"use client";

import { useState } from "react";
import { EnhancedCVBuilder, CVElement } from "../../components/cv-builder/EnhancedCVBuilder";

export default function EnhancedBuilderPage() {
  const [savedElements, setSavedElements] = useState<CVElement[]>([]);

  const handleSave = (elements: CVElement[]) => {
    setSavedElements(elements);
    console.log("Saved CV elements:", elements);
    // Here you would typically save to a database or local storage
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedCVBuilder
        initialElements={savedElements}
        onSave={handleSave}
      />
    </div>
  );
}
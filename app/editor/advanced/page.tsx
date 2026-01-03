"use client";

import { useState } from "react";
import { AdvancedDragDropEditor, CVElement } from "../../../components/cv-builder/AdvancedDragDropEditor";
import { TemplateSelector } from "../../../components/cv-builder/TemplateSelector";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, FileText, Save, Download } from "lucide-react";
import Link from "next/link";

export default function AdvancedEditorPage() {
  const [elements, setElements] = useState<CVElement[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (elements: CVElement[]) => {
    setIsSaving(true);
    try {
      // Here you would typically save to your backend
      console.log("Saving CV elements:", elements);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // You could save to localStorage for now
      localStorage.setItem("cv-elements", JSON.stringify(elements));
      
      alert("CV saved successfully!");
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("Error saving CV. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadTemplate = (templateElements: CVElement[]) => {
    setElements(templateElements);
  };

  const handleExportPDF = async () => {
    try {
      // Import html2canvas and jsPDF dynamically
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = document.querySelector("#canvas") as HTMLElement;
      if (!canvas) return;

      const canvasImage = await html2canvas(canvas, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvasImage.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvasImage.height * imgWidth) / canvasImage.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("cv.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error exporting PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Advanced CV Editor</h1>
              <p className="text-sm text-gray-600">Create professional CVs with drag-and-drop functionality</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowTemplateSelector(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              onClick={() => handleSave(elements)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save CV"}
            </Button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div className="h-[calc(100vh-80px)]">
        <AdvancedDragDropEditor
          initialElements={elements}
          onSave={setElements}
        />
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleLoadTemplate}
      />
    </div>
  );
}
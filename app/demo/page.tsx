"use client";

import { useState, useEffect } from "react";
import { AdvancedDragDropEditor, CVElement } from "../../components/cv-builder/AdvancedDragDropEditor";
import { createSampleCV, demonstrateAdvancedFeatures } from "../../demo/createSampleCV";
import { Button } from "../../components/ui/button";
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Award, 
  Palette, 
  Type,
  Shapes,
  Zap,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const [elements, setElements] = useState<CVElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const demoSteps = [
    {
      title: "Professional Layout",
      description: "Multi-element CV with precise positioning and professional typography",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Google Fonts",
      description: "Montserrat for headings, Inter for body text - professional font pairing",
      icon: Type,
      color: "text-blue-600"
    },
    {
      title: "Color Theme",
      description: "Professional Blue theme with consistent color application",
      icon: Palette,
      color: "text-purple-600"
    },
    {
      title: "Advanced Shapes",
      description: "Decorative elements, accent lines, and achievement icons",
      icon: Shapes,
      color: "text-orange-600"
    },
    {
      title: "Layer Management",
      description: "Z-index control for background shapes and foreground content",
      icon: Award,
      color: "text-yellow-600"
    }
  ];

  const loadSampleCV = async () => {
    setIsLoading(true);
    
    // Simulate loading for demo effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleElements = createSampleCV();
    setElements(sampleElements);
    
    // Demonstrate features in console
    demonstrateAdvancedFeatures();
    
    setIsLoading(false);
  };

  const clearCanvas = () => {
    setElements([]);
    setDemoStep(0);
  };

  const handleSave = (elements: CVElement[]) => {
    console.log('Demo CV saved:', elements);
    localStorage.setItem('demo-cv-elements', JSON.stringify(elements));
    alert('Demo CV saved successfully!');
  };

  useEffect(() => {
    // Auto-load sample CV on component mount
    loadSampleCV();
  }, []);

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
              <h1 className="text-xl font-semibold text-gray-800">
                🎨 Advanced CV Builder Demo
              </h1>
              <p className="text-sm text-gray-600">
                Showcasing all advanced features with a professional sample CV
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={loadSampleCV}
              disabled={isLoading}
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? 'Loading...' : 'Load Sample CV'}
            </Button>
            <Button 
              variant="outline" 
              onClick={clearCanvas}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Canvas
            </Button>
          </div>
        </div>
      </header>

      {/* Demo Features Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Advanced Features Demonstrated
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {demoSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-2">
                    <StepIcon className={`w-5 h-5 mt-0.5 ${step.color}`} />
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Stats */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                <strong className="text-gray-800">{elements.length}</strong> Elements
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">
                <strong className="text-gray-800">2</strong> Google Fonts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">
                <strong className="text-gray-800">Professional Blue</strong> Theme
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">
                <strong className="text-gray-800">6</strong> Advanced Shapes
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-green-600 font-medium">
              📊 CV Score: 95/100
            </div>
            <div className="text-blue-600 font-medium">
              🤖 ATS: 98%
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="h-[calc(100vh-200px)]">
        <AdvancedDragDropEditor
          initialElements={elements}
          onSave={handleSave}
        />
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-medium text-gray-800 mb-2">🎯 Try These Advanced Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Multi-Selection:</strong> Drag to select multiple elements or Ctrl+click
            </div>
            <div>
              <strong>Keyboard Shortcuts:</strong> Ctrl+C/V (copy/paste), Ctrl+Z/Y (undo/redo)
            </div>
            <div>
              <strong>Advanced Tools:</strong> Try Fonts, Themes, Shapes, and CV Scoring buttons
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
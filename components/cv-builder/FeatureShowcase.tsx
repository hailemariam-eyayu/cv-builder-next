"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { 
  MousePointer, 
  Move, 
  Maximize, 
  Palette, 
  Layers, 
  Grid, 
  Download,
  FileText,
  Eye,
  Zap
} from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  demo: string;
}

const features: Feature[] = [
  {
    icon: MousePointer,
    title: "Drag & Drop",
    description: "Move elements anywhere on the canvas with pixel-perfect positioning",
    demo: "Click and drag any element to reposition it instantly"
  },
  {
    icon: Maximize,
    title: "Resize Handles",
    description: "8-point resize handles for precise width and height control",
    demo: "Grab any corner or edge to resize elements smoothly"
  },
  {
    icon: Palette,
    title: "Advanced Styling",
    description: "Complete control over colors, fonts, borders, and effects",
    demo: "Customize every visual aspect of your CV elements"
  },
  {
    icon: Layers,
    title: "Layer Management",
    description: "Control element stacking with bring-to-front and send-to-back",
    demo: "Organize overlapping elements with precise layer control"
  },
  {
    icon: Grid,
    title: "Grid Alignment",
    description: "Optional grid overlay for perfect element alignment",
    demo: "Enable grid to snap elements to perfect positions"
  },
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Start with beautifully designed templates for different industries",
    demo: "Choose from Modern, Creative, Minimal, or Executive layouts"
  },
  {
    icon: Download,
    title: "PDF Export",
    description: "Export your CV as a high-quality PDF ready for printing",
    demo: "One-click export to professional PDF format"
  },
  {
    icon: Zap,
    title: "Real-time Editing",
    description: "See changes instantly as you edit content and styling",
    demo: "All modifications appear immediately on the canvas"
  }
];

export function FeatureShowcase() {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const currentFeature = features[selectedFeature];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🎨 Advanced CV Builder Features
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Professional-grade editing tools that give you complete control over your CV design, 
          just like Canva or Microsoft Word.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Feature List */}
        <div className="space-y-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all duration-200 border
                  ${selectedFeature === index 
                    ? "bg-white shadow-lg border-blue-200 scale-105" 
                    : "bg-white/50 border-gray-200 hover:bg-white hover:shadow-md"
                  }
                `}
                onClick={() => setSelectedFeature(index)}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    p-2 rounded-lg ${selectedFeature === index ? "bg-blue-100" : "bg-gray-100"}
                  `}>
                    <IconComponent className={`
                      w-5 h-5 ${selectedFeature === index ? "text-blue-600" : "text-gray-600"}
                    `} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Demo */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              {currentFeature && (
                <currentFeature.icon className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {currentFeature?.title}
            </h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-4 min-h-[200px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Interactive demo area</p>
              <p className="text-xs mt-1">
                {currentFeature?.demo}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600">
              {currentFeature?.description}
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Try Feature
              </Button>
              <Button size="sm" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Zap className="w-5 h-5 mr-2" />
          Start Creating Your CV
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          No design experience required • Professional results guaranteed
        </p>
      </div>
    </div>
  );
}
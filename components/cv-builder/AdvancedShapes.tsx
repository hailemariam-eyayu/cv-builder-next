"use client";

import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Square, 
  Circle, 
  Triangle, 
  ArrowRight, 
  Star, 
  Heart,
  Hexagon,
  Diamond,
  Zap,
  Shield,
  Award,
  Target
} from 'lucide-react';

interface Shape {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  svg: string;
  category: 'basic' | 'arrows' | 'symbols' | 'icons';
}

const SHAPES: Shape[] = [
  // Basic Shapes
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: Square,
    category: 'basic',
    svg: '<rect width="100%" height="100%" rx="4" />',
  },
  {
    id: 'circle',
    name: 'Circle',
    icon: Circle,
    category: 'basic',
    svg: '<circle cx="50%" cy="50%" r="45%" />',
  },
  {
    id: 'triangle',
    name: 'Triangle',
    icon: Triangle,
    category: 'basic',
    svg: '<polygon points="50,10 90,90 10,90" />',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    icon: Diamond,
    category: 'basic',
    svg: '<polygon points="50,10 90,50 50,90 10,50" />',
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    icon: Hexagon,
    category: 'basic',
    svg: '<polygon points="25,10 75,10 90,50 75,90 25,90 10,50" />',
  },
  
  // Arrows
  {
    id: 'arrow-right',
    name: 'Arrow Right',
    icon: ArrowRight,
    category: 'arrows',
    svg: '<polygon points="10,30 10,70 70,70 70,85 90,50 70,15 70,30" />',
  },
  {
    id: 'arrow-up',
    name: 'Arrow Up',
    icon: ArrowRight,
    category: 'arrows',
    svg: '<polygon points="30,90 70,90 70,30 85,30 50,10 15,30 30,30" />',
  },
  {
    id: 'arrow-down',
    name: 'Arrow Down',
    icon: ArrowRight,
    category: 'arrows',
    svg: '<polygon points="30,10 70,10 70,70 85,70 50,90 15,70 30,70" />',
  },
  
  // Symbols
  {
    id: 'star',
    name: 'Star',
    icon: Star,
    category: 'symbols',
    svg: '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />',
  },
  {
    id: 'heart',
    name: 'Heart',
    icon: Heart,
    category: 'symbols',
    svg: '<path d="M50,85 C50,85 20,65 20,40 C20,25 30,15 45,15 C47,15 50,20 50,20 C50,20 53,15 55,15 C70,15 80,25 80,40 C80,65 50,85 50,85 Z" />',
  },
  {
    id: 'lightning',
    name: 'Lightning',
    icon: Zap,
    category: 'symbols',
    svg: '<polygon points="35,5 25,40 45,40 30,95 70,35 50,35 65,5" />',
  },
  
  // Icons
  {
    id: 'shield',
    name: 'Shield',
    icon: Shield,
    category: 'icons',
    svg: '<path d="M50,10 L80,25 L80,55 C80,75 50,90 50,90 C50,90 20,75 20,55 L20,25 Z" />',
  },
  {
    id: 'award',
    name: 'Award',
    icon: Award,
    category: 'icons',
    svg: '<circle cx="50" cy="40" r="25" /><polygon points="35,60 50,75 65,60 65,90 50,85 35,90" />',
  },
  {
    id: 'target',
    name: 'Target',
    icon: Target,
    category: 'icons',
    svg: '<circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="4" /><circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="4" /><circle cx="50" cy="50" r="10" />',
  },
];

interface AdvancedShapesProps {
  onShapeSelect: (shape: Shape) => void;
  onClose: () => void;
}

export function AdvancedShapes({ onShapeSelect, onClose }: AdvancedShapesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');

  const filteredShapes = SHAPES.filter(shape => 
    selectedCategory === 'all' || shape.category === selectedCategory
  );

  const categories = [
    { id: 'all', name: 'All Shapes' },
    { id: 'basic', name: 'Basic' },
    { id: 'arrows', name: 'Arrows' },
    { id: 'symbols', name: 'Symbols' },
    { id: 'icons', name: 'Icons' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Advanced Shapes
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredShapes.map((shape) => (
              <div
                key={shape.id}
                className="group p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col items-center"
                onClick={() => onShapeSelect(shape)}
              >
                <div className="w-12 h-12 mb-2 flex items-center justify-center">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    className="text-gray-600 group-hover:text-blue-600 transition-colors"
                    fill="currentColor"
                  >
                    <g dangerouslySetInnerHTML={{ __html: shape.svg }} />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">
                  {shape.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Click on a shape to add it to your CV
            </p>
            <Button onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
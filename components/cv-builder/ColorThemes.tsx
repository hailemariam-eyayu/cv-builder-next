"use client";

import { useState } from 'react';
import { Button } from '../ui/button';
import { Palette, Check } from 'lucide-react';

interface ColorTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    surface: string;
  };
}

const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    description: 'Classic and trustworthy',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f8fafc',
    },
  },
  {
    id: 'modern-purple',
    name: 'Modern Purple',
    description: 'Creative and innovative',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#8b5cf6',
      text: '#374151',
      background: '#ffffff',
      surface: '#faf5ff',
    },
  },
  {
    id: 'elegant-green',
    name: 'Elegant Green',
    description: 'Natural and balanced',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f0fdf4',
    },
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    description: 'Energetic and friendly',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#f97316',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#fff7ed',
    },
  },
  {
    id: 'sophisticated-gray',
    name: 'Sophisticated Gray',
    description: 'Minimal and elegant',
    colors: {
      primary: '#374151',
      secondary: '#1f2937',
      accent: '#6b7280',
      text: '#111827',
      background: '#ffffff',
      surface: '#f9fafb',
    },
  },
  {
    id: 'creative-pink',
    name: 'Creative Pink',
    description: 'Bold and expressive',
    colors: {
      primary: '#db2777',
      secondary: '#be185d',
      accent: '#ec4899',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#fdf2f8',
    },
  },
  {
    id: 'tech-cyan',
    name: 'Tech Cyan',
    description: 'Modern and digital',
    colors: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#ecfeff',
    },
  },
  {
    id: 'dark-mode',
    name: 'Dark Professional',
    description: 'Sleek dark theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      text: '#f9fafb',
      background: '#111827',
      surface: '#1f2937',
    },
  },
];

interface ColorThemesProps {
  currentTheme?: string;
  onThemeChange: (theme: ColorTheme) => void;
  onClose: () => void;
}

export function ColorThemes({ currentTheme, onThemeChange, onClose }: ColorThemesProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>(currentTheme || '');

  const handleThemeSelect = (theme: ColorTheme) => {
    setSelectedTheme(theme.id);
    onThemeChange(theme);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Themes
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Choose a color theme to apply consistent styling across your CV
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLOR_THEMES.map((theme) => (
              <div
                key={theme.id}
                className={`
                  relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedTheme === theme.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
                onClick={() => handleThemeSelect(theme)}
              >
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="mb-3">
                  <h4 className="font-semibold text-gray-800">{theme.name}</h4>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>

                {/* Color Preview */}
                <div className="space-y-2">
                  <div className="flex gap-1 h-8">
                    <div 
                      className="flex-1 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="flex-1 rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="flex-1 rounded"
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                  </div>
                  
                  <div className="flex gap-1 h-4">
                    <div 
                      className="flex-1 rounded"
                      style={{ backgroundColor: theme.colors.text }}
                      title="Text"
                    />
                    <div 
                      className="flex-1 rounded border"
                      style={{ backgroundColor: theme.colors.background }}
                      title="Background"
                    />
                    <div 
                      className="flex-1 rounded"
                      style={{ backgroundColor: theme.colors.surface }}
                      title="Surface"
                    />
                  </div>
                </div>

                {/* Mini CV Preview */}
                <div 
                  className="mt-3 p-2 rounded text-xs"
                  style={{ 
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.surface}`
                  }}
                >
                  <div 
                    className="font-bold mb-1"
                    style={{ color: theme.colors.primary }}
                  >
                    John Doe
                  </div>
                  <div className="text-xs opacity-75">Software Developer</div>
                  <div 
                    className="w-full h-1 mt-1 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Select a theme to apply colors to your CV elements
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClose}>
                Apply Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Search, Type } from 'lucide-react';

interface Font {
  family: string;
  variants: string[];
  category: string;
}

const POPULAR_FONTS: Font[] = [
  { family: 'Inter', variants: ['400', '500', '600', '700'], category: 'sans-serif' },
  { family: 'Roboto', variants: ['300', '400', '500', '700'], category: 'sans-serif' },
  { family: 'Open Sans', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
  { family: 'Lato', variants: ['300', '400', '700'], category: 'sans-serif' },
  { family: 'Montserrat', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
  { family: 'Poppins', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
  { family: 'Source Sans Pro', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
  { family: 'Nunito', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
  { family: 'Playfair Display', variants: ['400', '500', '600', '700'], category: 'serif' },
  { family: 'Merriweather', variants: ['300', '400', '700'], category: 'serif' },
  { family: 'Crimson Text', variants: ['400', '600'], category: 'serif' },
  { family: 'Libre Baskerville', variants: ['400', '700'], category: 'serif' },
  { family: 'Fira Code', variants: ['300', '400', '500'], category: 'monospace' },
  { family: 'JetBrains Mono', variants: ['300', '400', '500'], category: 'monospace' },
];

interface FontSelectorProps {
  currentFont: string;
  onFontChange: (fontFamily: string) => void;
  onClose: () => void;
}

export function FontSelector({ currentFont, onFontChange, onClose }: FontSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFonts = POPULAR_FONTS.filter(font => {
    const matchesSearch = font.family.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loadFont = async (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) return;

    try {
      const fontName = fontFamily.replace(/\s+/g, '+');
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      setLoadedFonts(prev => new Set([...prev, fontFamily]));
    } catch (error) {
      console.error('Failed to load font:', fontFamily, error);
    }
  };

  const handleFontSelect = (fontFamily: string) => {
    loadFont(fontFamily);
    onFontChange(fontFamily);
  };

  useEffect(() => {
    // Load popular fonts on component mount
    POPULAR_FONTS.slice(0, 5).forEach(font => loadFont(font.family));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Choose Font
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid gap-3">
            {filteredFonts.map((font) => (
              <div
                key={font.family}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all duration-200
                  ${currentFont === font.family 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => handleFontSelect(font.family)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 
                      className="font-medium text-gray-800 text-lg"
                      style={{ fontFamily: loadedFonts.has(font.family) ? font.family : 'inherit' }}
                    >
                      {font.family}
                    </h4>
                    <p 
                      className="text-gray-600 mt-1"
                      style={{ fontFamily: loadedFonts.has(font.family) ? font.family : 'inherit' }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {font.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredFonts.length} fonts available
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
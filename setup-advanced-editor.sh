#!/bin/bash

echo "🚀 Setting up Advanced CV Builder Editor..."

# Install new dependencies
echo "📦 Installing dependencies..."
npm install react-resizable@^3.0.5

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/templates
mkdir -p app/editor/advanced

# Copy example templates (you can add actual template images later)
echo "🎨 Setting up template assets..."
touch public/templates/modern-preview.jpg
touch public/templates/creative-preview.jpg
touch public/templates/minimal-preview.jpg
touch public/templates/executive-preview.jpg

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Advanced CV Builder setup complete!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Run 'npm run dev' to start the development server"
    echo "2. Navigate to '/editor/advanced' to use the new editor"
    echo "3. Check ADVANCED_EDITOR_FEATURES.md for detailed documentation"
    echo ""
    echo "🎨 Features added:"
    echo "- Drag & drop element positioning"
    echo "- Resize handles for precise sizing"
    echo "- Professional templates"
    echo "- Advanced styling controls"
    echo "- PDF export functionality"
    echo "- Grid alignment system"
    echo ""
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
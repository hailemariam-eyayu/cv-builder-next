import { CVElement } from '../components/cv-builder/AdvancedDragDropEditor';

export interface IndustryTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  preview: string;
  elements: CVElement[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  // Technology Templates
  {
    id: 'tech-modern',
    name: 'Tech Professional',
    industry: 'Technology',
    description: 'Modern design for software developers and tech professionals',
    preview: '/templates/tech-modern.jpg',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff',
    },
    elements: [
      {
        id: 'name',
        type: 'heading',
        content: { text: 'Alex Johnson' },
        position: { x: 50, y: 40 },
        size: { width: 400, height: 50 },
        style: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#2563eb',
          textAlign: 'left',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'title',
        type: 'text',
        content: { text: 'Senior Software Engineer' },
        position: { x: 50, y: 95 },
        size: { width: 300, height: 25 },
        style: {
          fontSize: 18,
          color: '#6b7280',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'contact',
        type: 'contact',
        content: {
          email: 'alex.johnson@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA'
        },
        position: { x: 50, y: 130 },
        size: { width: 300, height: 80 },
        style: {
          fontSize: 14,
          color: '#374151',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'skills-heading',
        type: 'heading',
        content: { text: 'Technical Skills' },
        position: { x: 50, y: 230 },
        size: { width: 200, height: 30 },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2563eb',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'skills',
        type: 'skills',
        content: { 
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'Git'] 
        },
        position: { x: 50, y: 270 },
        size: { width: 400, height: 100 },
        style: {
          fontSize: 14,
          color: '#374151',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },

  // Healthcare Templates
  {
    id: 'healthcare-professional',
    name: 'Healthcare Professional',
    industry: 'Healthcare',
    description: 'Clean and trustworthy design for medical professionals',
    preview: '/templates/healthcare-professional.jpg',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff',
    },
    elements: [
      {
        id: 'name',
        type: 'heading',
        content: { text: 'Dr. Sarah Williams' },
        position: { x: 50, y: 40 },
        size: { width: 400, height: 50 },
        style: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#059669',
          textAlign: 'left',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'credentials',
        type: 'text',
        content: { text: 'MD, Internal Medicine Specialist' },
        position: { x: 50, y: 95 },
        size: { width: 350, height: 25 },
        style: {
          fontSize: 16,
          color: '#6b7280',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'license',
        type: 'text',
        content: { text: 'Medical License: CA-12345' },
        position: { x: 50, y: 125 },
        size: { width: 250, height: 20 },
        style: {
          fontSize: 14,
          color: '#374151',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },

  // Finance Templates
  {
    id: 'finance-executive',
    name: 'Finance Executive',
    industry: 'Finance',
    description: 'Professional and sophisticated design for finance professionals',
    preview: '/templates/finance-executive.jpg',
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff',
    },
    elements: [
      {
        id: 'sidebar',
        type: 'shape',
        content: { shape: 'rectangle' },
        position: { x: 0, y: 0 },
        size: { width: 200, height: 1123 },
        style: {
          backgroundColor: '#1e40af',
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          zIndex: 0,
        },
      },
      {
        id: 'name',
        type: 'heading',
        content: { text: 'Michael Chen' },
        position: { x: 30, y: 50 },
        size: { width: 140, height: 50 },
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'left',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'title',
        type: 'text',
        content: { text: 'Chief Financial Officer' },
        position: { x: 30, y: 105 },
        size: { width: 140, height: 40 },
        style: {
          fontSize: 14,
          color: '#e5e7eb',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },

  // Creative Templates
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    industry: 'Design & Creative',
    description: 'Bold and artistic design for creative professionals',
    preview: '/templates/creative-designer.jpg',
    colors: {
      primary: '#db2777',
      secondary: '#be185d',
      accent: '#ec4899',
      text: '#1f2937',
      background: '#ffffff',
    },
    elements: [
      {
        id: 'header-shape',
        type: 'shape',
        content: { shape: 'rectangle' },
        position: { x: 0, y: 0 },
        size: { width: 794, height: 120 },
        style: {
          backgroundColor: '#db2777',
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          zIndex: 0,
        },
      },
      {
        id: 'name',
        type: 'heading',
        content: { text: 'Emma Rodriguez' },
        position: { x: 50, y: 30 },
        size: { width: 400, height: 60 },
        style: {
          fontSize: 36,
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'left',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'creative-title',
        type: 'text',
        content: { text: 'UX/UI Designer & Creative Director' },
        position: { x: 50, y: 85 },
        size: { width: 400, height: 25 },
        style: {
          fontSize: 18,
          color: '#fce7f3',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },

  // Education Templates
  {
    id: 'academic-researcher',
    name: 'Academic Researcher',
    industry: 'Education & Research',
    description: 'Scholarly and professional design for academics',
    preview: '/templates/academic-researcher.jpg',
    colors: {
      primary: '#374151',
      secondary: '#1f2937',
      accent: '#6b7280',
      text: '#111827',
      background: '#ffffff',
    },
    elements: [
      {
        id: 'name',
        type: 'heading',
        content: { text: 'Prof. David Thompson' },
        position: { x: 50, y: 50 },
        size: { width: 400, height: 50 },
        style: {
          fontSize: 30,
          fontWeight: 'bold',
          color: '#374151',
          textAlign: 'center',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'academic-title',
        type: 'text',
        content: { text: 'PhD in Computer Science | Research Professor' },
        position: { x: 50, y: 105 },
        size: { width: 400, height: 25 },
        style: {
          fontSize: 16,
          color: '#6b7280',
          textAlign: 'center',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'divider',
        type: 'divider',
        content: {},
        position: { x: 150, y: 140 },
        size: { width: 200, height: 2 },
        style: {
          backgroundColor: '#374151',
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },

  // Sales & Marketing Templates
  {
    id: 'sales-professional',
    name: 'Sales Professional',
    industry: 'Sales & Marketing',
    description: 'Dynamic and results-focused design for sales professionals',
    preview: '/templates/sales-professional.jpg',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#f97316',
      text: '#1f2937',
      background: '#ffffff',
    },
    elements: [
      {
        id: 'name',
        type: 'heading',
        content: { text: 'Jessica Martinez' },
        position: { x: 50, y: 40 },
        size: { width: 400, height: 50 },
        style: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#ea580c',
          textAlign: 'left',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'sales-title',
        type: 'text',
        content: { text: 'Senior Sales Manager | Revenue Growth Specialist' },
        position: { x: 50, y: 95 },
        size: { width: 450, height: 25 },
        style: {
          fontSize: 16,
          color: '#6b7280',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 'achievements',
        type: 'text',
        content: { text: '🏆 150% of sales target achieved | 🚀 $2M+ revenue generated' },
        position: { x: 50, y: 125 },
        size: { width: 450, height: 25 },
        style: {
          fontSize: 14,
          color: '#ea580c',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
          opacity: 1,
          zIndex: 1,
        },
      },
    ],
  },
];

export const getTemplatesByIndustry = (industry: string) => {
  return INDUSTRY_TEMPLATES.filter(template => template.industry === industry);
};

export const getAllIndustries = () => {
  return [...new Set(INDUSTRY_TEMPLATES.map(template => template.industry))];
};
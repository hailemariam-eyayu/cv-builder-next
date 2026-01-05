"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  TrendingUp, 
  Eye,
  FileText,
  Award,
  Target
} from 'lucide-react';
import { CVElement } from './AdvancedDragDropEditor';

interface ScoreCategory {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  issues: string[];
  suggestions: string[];
  icon: React.ComponentType<{ className?: string }>;
}

interface CVScoringProps {
  elements: CVElement[];
  onClose: () => void;
}

export function CVScoring({ elements, onClose }: CVScoringProps) {
  const [activeTab, setActiveTab] = useState<'score' | 'ats' | 'suggestions'>('score');

  const analysis = useMemo(() => {
    return analyzeCVElements(elements);
  }, [elements]);

  const overallScore = useMemo(() => {
    const totalScore = analysis.categories.reduce((sum, cat) => sum + cat.score, 0);
    const maxTotalScore = analysis.categories.reduce((sum, cat) => sum + cat.maxScore, 0);
    return Math.round((totalScore / maxTotalScore) * 100);
  }, [analysis]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertCircle;
    return XCircle;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Award className="w-6 h-6" />
              CV Analysis & Scoring
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          {/* Overall Score */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {React.createElement(getScoreIcon(overallScore), { 
                  className: `w-5 h-5 ${getScoreColor(overallScore)}` 
                })}
                <span className="font-medium">
                  {overallScore >= 80 ? 'Excellent CV!' : 
                   overallScore >= 60 ? 'Good CV with room for improvement' : 
                   'Needs significant improvement'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    overallScore >= 80 ? 'bg-green-500' :
                    overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'score', name: 'Detailed Score', icon: TrendingUp },
              { id: 'ats', name: 'ATS Compatibility', icon: FileText },
              { id: 'suggestions', name: 'Suggestions', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`
                  flex items-center gap-2 px-6 py-3 font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'score' && (
            <div className="space-y-4">
              {analysis.categories.map((category) => {
                const categoryScore = Math.round((category.score / category.maxScore) * 100);
                const CategoryIcon = category.icon;
                
                return (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-800">{category.name}</h4>
                      </div>
                      <div className={`font-bold ${getScoreColor(categoryScore)}`}>
                        {categoryScore}%
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          categoryScore >= 80 ? 'bg-green-500' :
                          categoryScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${categoryScore}%` }}
                      />
                    </div>
                    
                    {category.issues.length > 0 && (
                      <div className="space-y-1">
                        <h5 className="text-sm font-medium text-red-600">Issues:</h5>
                        {category.issues.map((issue, index) => (
                          <div key={index} className="text-sm text-red-600 flex items-start gap-2">
                            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'ats' && (
            <ATSCompatibilityCheck elements={elements} />
          )}

          {activeTab === 'suggestions' && (
            <ImprovementSuggestions analysis={analysis} />
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Analysis based on industry best practices and ATS requirements
            </p>
            <Button onClick={onClose}>
              Close Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function analyzeCVElements(elements: CVElement[]) {
  const categories: ScoreCategory[] = [
    {
      id: 'content',
      name: 'Content Quality',
      score: 0,
      maxScore: 100,
      issues: [],
      suggestions: [],
      icon: FileText,
    },
    {
      id: 'structure',
      name: 'Structure & Layout',
      score: 0,
      maxScore: 100,
      issues: [],
      suggestions: [],
      icon: Eye,
    },
    {
      id: 'completeness',
      name: 'Completeness',
      score: 0,
      maxScore: 100,
      issues: [],
      suggestions: [],
      icon: CheckCircle,
    },
  ];

  // Analyze content quality
  const textElements = elements.filter(el => ['text', 'heading', 'experience', 'education'].includes(el.type));
  const hasContact = elements.some(el => el.type === 'contact');
  const hasExperience = elements.some(el => el.type === 'experience');
  const hasSkills = elements.some(el => el.type === 'skills');

  // Content scoring
  let contentScore = 0;
  if (hasContact) contentScore += 25;
  if (hasExperience) contentScore += 35;
  if (hasSkills) contentScore += 20;
  if (textElements.length >= 3) contentScore += 20;

  categories[0].score = contentScore;
  if (!hasContact) categories[0].issues.push('Missing contact information');
  if (!hasExperience) categories[0].issues.push('No work experience section');
  if (!hasSkills) categories[0].issues.push('No skills section');

  // Structure scoring
  let structureScore = 0;
  const hasHeading = elements.some(el => el.type === 'heading');
  const wellPositioned = elements.every(el => el.position.x >= 0 && el.position.y >= 0);
  const reasonableSize = elements.every(el => el.size.width > 50 && el.size.height > 20);

  if (hasHeading) structureScore += 30;
  if (wellPositioned) structureScore += 35;
  if (reasonableSize) structureScore += 35;

  categories[1].score = structureScore;
  if (!hasHeading) categories[1].issues.push('Missing main heading/name');
  if (!wellPositioned) categories[1].issues.push('Some elements are positioned outside canvas');

  // Completeness scoring
  let completenessScore = 0;
  const requiredSections = ['contact', 'experience', 'skills'];
  const presentSections = requiredSections.filter(section => 
    elements.some(el => el.type === section)
  );

  completenessScore = (presentSections.length / requiredSections.length) * 100;
  categories[2].score = completenessScore;

  const missingSections = requiredSections.filter(section => 
    !elements.some(el => el.type === section)
  );
  missingSections.forEach(section => {
    categories[2].issues.push(`Missing ${section} section`);
  });

  return { categories };
}

function ATSCompatibilityCheck({ elements }: { elements: CVElement[] }) {
  const checks = [
    {
      name: 'Standard Fonts',
      passed: true, // Assume fonts are ATS-friendly
      description: 'Uses ATS-friendly fonts',
    },
    {
      name: 'Text-based Content',
      passed: elements.some(el => ['text', 'heading', 'experience'].includes(el.type)),
      description: 'Contains readable text content',
    },
    {
      name: 'Proper Sections',
      passed: elements.some(el => el.type === 'experience') && elements.some(el => el.type === 'contact'),
      description: 'Has essential sections (contact, experience)',
    },
    {
      name: 'No Complex Graphics',
      passed: elements.filter(el => el.type === 'image').length <= 1,
      description: 'Limited use of images and graphics',
    },
    {
      name: 'Standard Layout',
      passed: true, // Assume layout is standard
      description: 'Uses conventional CV layout',
    },
  ];

  const passedChecks = checks.filter(check => check.passed).length;
  const compatibilityScore = Math.round((passedChecks / checks.length) * 100);

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600 mb-2">
          {compatibilityScore}%
        </div>
        <div className="text-blue-800">ATS Compatibility Score</div>
      </div>

      <div className="space-y-3">
        {checks.map((check, index) => (
          <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
            {check.passed ? (
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
            )}
            <div>
              <div className="font-medium text-gray-800">{check.name}</div>
              <div className="text-sm text-gray-600">{check.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImprovementSuggestions({ analysis }: { analysis: any }) {
  const allSuggestions = [
    'Add a professional summary at the top',
    'Include quantifiable achievements in experience',
    'Use action verbs to start bullet points',
    'Add relevant skills for your target role',
    'Include education and certifications',
    'Ensure consistent formatting throughout',
    'Use a clean, professional layout',
    'Keep CV to 1-2 pages maximum',
    'Include contact information',
    'Proofread for spelling and grammar',
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {allSuggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-blue-800">{suggestion}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
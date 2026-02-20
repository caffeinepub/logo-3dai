import { useState } from 'react';
import { useActor } from './useActor';
import { LogoAnalysis } from '../utils/logoAnalysis';
import { WorkflowMode } from '../App';

export interface AIAnimationRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  keyframes: Array<{
    time: number;
    position?: [number, number, number] | [number, number];
    rotation?: [number, number, number] | [number, number];
    scale?: number;
    opacity?: number;
  }>;
  effects: {
    glow?: boolean;
    particles?: boolean;
    shadow?: number;
  };
  timing: {
    duration: number;
    easing: string;
  };
}

export function useAIAnimationRecommendations() {
  const { actor } = useActor();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<AIAnimationRecommendation[]>([]);

  const generateRecommendations = async (
    logoAnalysis: LogoAnalysis,
    workflowMode: WorkflowMode,
    provider: 'openai' | 'google'
  ): Promise<AIAnimationRecommendation[]> => {
    setIsAnalyzing(true);
    setError(null);
    setRecommendations([]);

    try {
      if (!actor) {
        throw new Error('Backend actor not initialized');
      }

      // Note: Backend integration pending - using placeholder for now
      // In production, this would call backend methods that proxy to AI services
      // Example: const result = await actor.generateAnimationRecommendations(logoAnalysis, workflowMode, provider);
      
      // Placeholder implementation - generates rule-based recommendations
      const aiRecommendations = generatePlaceholderRecommendations(logoAnalysis, workflowMode, provider);
      
      setRecommendations(aiRecommendations);
      return aiRecommendations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setError(errorMessage);
      console.error('Animation recommendation error:', err);
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    generateRecommendations,
    isAnalyzing,
    error,
    recommendations,
  };
}

// Placeholder recommendation generator until backend AI integration is complete
function generatePlaceholderRecommendations(
  analysis: LogoAnalysis,
  workflowMode: WorkflowMode,
  provider: string
): AIAnimationRecommendation[] {
  const recommendations: AIAnimationRecommendation[] = [];

  if (workflowMode === '3D') {
    recommendations.push({
      title: 'Dynamic Rotation Entry',
      description: `AI-powered ${provider === 'openai' ? 'ChatGPT' : 'Gemini'} suggests a smooth rotation entry based on your logo's geometry`,
      priority: 'high',
      keyframes: [
        { time: 0, rotation: [0, 0, 0], scale: 0.5, opacity: 0 },
        { time: 1, rotation: [0, Math.PI, 0], scale: 1, opacity: 1 },
      ],
      effects: { glow: true, shadow: 0.5 },
      timing: { duration: 1, easing: 'easeOutCubic' },
    });
  } else {
    recommendations.push({
      title: 'Smooth Fade & Scale',
      description: `AI-powered ${provider === 'openai' ? 'ChatGPT' : 'Gemini'} suggests a gentle entrance animation for 2D mode`,
      priority: 'high',
      keyframes: [
        { time: 0, position: [0, -2], scale: 0.8, opacity: 0 },
        { time: 1.5, position: [0, 0], scale: 1, opacity: 1 },
      ],
      effects: { glow: analysis.brightness > 0.5, shadow: 0.3 },
      timing: { duration: 1.5, easing: 'easeOutQuad' },
    });
  }

  if (analysis.colorfulness > 0.6) {
    recommendations.push({
      title: 'Vibrant Color Pulse',
      description: 'Your colorful logo would benefit from a pulsing glow effect',
      priority: 'medium',
      keyframes: [],
      effects: { glow: true, particles: workflowMode === '3D' },
      timing: { duration: 2, easing: 'easeInOutSine' },
    });
  }

  return recommendations;
}

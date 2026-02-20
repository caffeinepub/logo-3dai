import { useState } from 'react';

export function usePromptGeneration() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogoUrl, setGeneratedLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async (inputPrompt: string): Promise<string | null> => {
    setPrompt(inputPrompt);
    setIsGenerating(true);
    setError(null);
    setGeneratedLogoUrl(null);

    try {
      // Note: This is a placeholder implementation
      // In production, this would call backend methods that proxy to AI services
      // The actual AI integration is handled by useAILogoGeneration hook
      
      const svg = createPlaceholderSVG(inputPrompt);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      setGeneratedLogoUrl(url);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate logo';
      setError(errorMessage);
      console.error('Logo generation error:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setPrompt('');
    setGeneratedLogoUrl(null);
    setError(null);
  };

  return {
    prompt,
    isGenerating,
    generatedLogoUrl,
    error,
    generateLogo,
    reset,
  };
}

// Placeholder SVG generator
function createPlaceholderSVG(prompt: string): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const firstWord = prompt.split(' ')[0].substring(0, 2).toUpperCase();
  
  return `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${color}"/>
      <circle cx="200" cy="200" r="120" fill="white" opacity="0.9"/>
      <text x="200" y="220" font-family="Arial, sans-serif" font-size="60" font-weight="bold" 
            text-anchor="middle" fill="${color}">${firstWord}</text>
      <text x="200" y="350" font-family="Arial, sans-serif" font-size="12" 
            text-anchor="middle" fill="white" opacity="0.7">Placeholder Logo</text>
    </svg>
  `;
}

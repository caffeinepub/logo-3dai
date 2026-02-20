import { useState } from 'react';
import { generateLogo } from '../utils/aiLogoService';

export function useAILogoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLogoUrl, setGeneratedLogoUrl] = useState<string | null>(null);

  const generateLogoWithAI = async (prompt: string, provider: 'openai' | 'google'): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    setGeneratedLogoUrl(null);

    try {
      const imageUrl = await generateLogo(prompt, provider);
      setGeneratedLogoUrl(imageUrl);
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate logo';
      setError(errorMessage);
      console.error('Logo generation error:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateLogo: generateLogoWithAI,
    isGenerating,
    error,
    generatedLogoUrl,
  };
}

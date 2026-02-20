import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { AnimationSettings } from '../hooks/useAnimationSettings';
import { analyzeLogoImage, LogoAnalysis } from '../utils/logoAnalysis';
import { generateAnimationProfile } from '../utils/effectGeneration';
import { useAIAnimationRecommendations } from '../hooks/useAIAnimationRecommendations';
import { toast } from 'sonner';
import { WorkflowMode } from '../App';

interface AutoEffectButtonProps {
  logoUrl: string;
  currentSettings: AnimationSettings;
  onSettingsGenerated: (settings: AnimationSettings, analysis: LogoAnalysis) => void;
  workflowMode: WorkflowMode;
}

export default function AutoEffectButton({
  logoUrl,
  currentSettings,
  onSettingsGenerated,
  workflowMode,
}: AutoEffectButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openai' | 'google'>('openai');
  
  const { generateRecommendations, isAnalyzing } = useAIAnimationRecommendations();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const analysis = await analyzeLogoImage(logoUrl);
      
      if (useAI) {
        // AI-powered generation
        const aiRecommendations = await generateRecommendations(analysis, workflowMode, aiProvider);
        
        // Apply AI recommendations to create animation profile
        const generatedSettings = generateAnimationProfile(analysis, currentSettings, workflowMode);
        
        onSettingsGenerated(generatedSettings, analysis);
        
        toast.success('AI-powered effects generated!', {
          description: `Created ${workflowMode} animation profile using ${aiProvider === 'openai' ? 'ChatGPT' : 'Gemini'} analysis.`,
        });
      } else {
        // Rule-based generation
        const generatedSettings = generateAnimationProfile(analysis, currentSettings, workflowMode);
        
        onSettingsGenerated(generatedSettings, analysis);
        
        toast.success('Auto-effects generated!', {
          description: `Created ${workflowMode} animation profile based on your logo analysis.`,
        });
      }
    } catch (error) {
      console.error('Failed to generate effects:', error);
      toast.error('Failed to generate effects', {
        description: 'Please try again or adjust settings manually.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isLoading = isGenerating || isAnalyzing;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Mode:</label>
        <Select value={useAI ? 'ai' : 'auto'} onValueChange={(value) => setUseAI(value === 'ai')}>
          <SelectTrigger className="w-[140px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                <span>Rule-based</span>
              </div>
            </SelectItem>
            <SelectItem value="ai">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {useAI && (
        <Select value={aiProvider} onValueChange={(value) => setAiProvider(value as 'openai' | 'google')}>
          <SelectTrigger className="w-[140px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">ChatGPT</SelectItem>
            <SelectItem value="google">Gemini</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        size="lg"
        className="rounded-full bg-gradient-to-r from-coral-500 to-purple-500 hover:from-coral-600 hover:to-purple-600 text-white font-semibold shadow-soft-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {useAI ? `Analyzing with ${aiProvider === 'openai' ? 'ChatGPT' : 'Gemini'}...` : 'Generating...'}
          </>
        ) : (
          <>
            {useAI ? <Sparkles className="w-5 h-5 mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
            Auto-Generate {workflowMode} Effects
          </>
        )}
      </Button>
    </div>
  );
}

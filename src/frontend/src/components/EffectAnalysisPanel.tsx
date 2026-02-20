import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Lightbulb, CheckCircle2, Loader2 } from 'lucide-react';
import { AnimationSettings } from '../hooks/useAnimationSettings';
import { LogoAnalysis } from '../utils/logoAnalysis';
import { SceneElement } from '../hooks/useSceneElements';
import { analyzeEffects, EffectRecommendation } from '../utils/effectAnalysis';
import { applyMultipleRecommendations } from '../utils/recommendationApplicator';
import { useAIAnimationRecommendations } from '../hooks/useAIAnimationRecommendations';
import { WorkflowMode } from '../App';
import { toast } from 'sonner';

interface EffectAnalysisPanelProps {
  animationSettings: AnimationSettings;
  logoAnalysis: LogoAnalysis | null;
  sceneElements: SceneElement[];
  onApplyRecommendations: (settings: AnimationSettings) => void;
  workflowMode: WorkflowMode;
}

export default function EffectAnalysisPanel({
  animationSettings,
  logoAnalysis,
  sceneElements,
  onApplyRecommendations,
  workflowMode,
}: EffectAnalysisPanelProps) {
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set());
  const [aiProvider, setAiProvider] = useState<'openai' | 'google'>('openai');
  const [useAI, setUseAI] = useState(false);
  
  const { generateRecommendations, isAnalyzing, recommendations: aiRecommendations } = useAIAnimationRecommendations();

  // Get rule-based recommendations
  const ruleBasedRecommendations = logoAnalysis
    ? analyzeEffects(animationSettings, logoAnalysis, sceneElements, workflowMode)
    : [];

  const handleGenerateAIRecommendations = async () => {
    if (!logoAnalysis) {
      toast.error('Please generate auto-effects first to analyze your logo');
      return;
    }

    setUseAI(true);
    await generateRecommendations(logoAnalysis, workflowMode, aiProvider);
    toast.success('AI recommendations generated!', {
      description: `${aiProvider === 'openai' ? 'ChatGPT' : 'Gemini'} analyzed your logo and created custom animation suggestions.`,
    });
  };

  const toggleRecommendation = (id: string) => {
    const newSelected = new Set(selectedRecommendations);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRecommendations(newSelected);
  };

  const handleApplySelected = () => {
    const toApply = ruleBasedRecommendations.filter((rec) =>
      selectedRecommendations.has(rec.id)
    );

    if (toApply.length === 0) return;

    const updatedSettings = applyMultipleRecommendations(animationSettings, toApply);
    onApplyRecommendations(updatedSettings);
    setSelectedRecommendations(new Set());
    
    toast.success('Recommendations applied!', {
      description: `Applied ${toApply.length} recommendation${toApply.length > 1 ? 's' : ''} to your animation.`,
    });
  };

  const displayRecommendations = useAI ? [] : ruleBasedRecommendations;

  return (
    <div className="space-y-4">
      {/* AI Provider Selection */}
      <Card className="border-2 border-border rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-coral-500" />
            AI-Powered Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Select value={aiProvider} onValueChange={(value) => setAiProvider(value as 'openai' | 'google')}>
              <SelectTrigger className="flex-1 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">ChatGPT (OpenAI)</SelectItem>
                <SelectItem value="google">Gemini (Google AI)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerateAIRecommendations}
              disabled={!logoAnalysis || isAnalyzing}
              className="rounded-full bg-gradient-to-r from-coral-500 to-purple-500 hover:from-coral-600 hover:to-purple-600"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Suggestions
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use AI to analyze your logo and generate intelligent animation recommendations
          </p>
        </CardContent>
      </Card>

      {/* AI Recommendations Display */}
      {useAI && aiRecommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-coral-500" />
            <h3 className="text-sm font-semibold">
              AI Recommendations from {aiProvider === 'openai' ? 'ChatGPT' : 'Gemini'}
            </h3>
          </div>
          {aiRecommendations.map((rec, index) => (
            <Card key={index} className="border-2 border-border rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={rec.priority === 'high' ? 'default' : 'secondary'}
                        className="rounded-full"
                      >
                        {rec.priority}
                      </Badge>
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {rec.keyframes.length > 0 && (
                        <span>• {rec.keyframes.length} keyframes</span>
                      )}
                      {rec.effects.glow && <span>• Glow effect</span>}
                      {rec.effects.particles && <span>• Particles</span>}
                      <span>• {rec.timing.duration}s duration</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rule-based Recommendations */}
      {!useAI && displayRecommendations.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-teal-500" />
              <h3 className="text-sm font-semibold">Smart Recommendations</h3>
            </div>
            {selectedRecommendations.size > 0 && (
              <Button
                onClick={handleApplySelected}
                size="sm"
                className="rounded-full bg-teal-500 hover:bg-teal-600"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Apply Selected ({selectedRecommendations.size})
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {displayRecommendations.map((recommendation) => (
              <Card
                key={recommendation.id}
                className={`border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRecommendations.has(recommendation.id)
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-950'
                    : 'border-border hover:border-teal-300'
                }`}
                onClick={() => toggleRecommendation(recommendation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={recommendation.priority === 'high' ? 'default' : 'secondary'}
                          className="rounded-full"
                        >
                          {recommendation.priority}
                        </Badge>
                        <h4 className="font-semibold text-sm">{recommendation.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                    </div>
                    {selectedRecommendations.has(recommendation.id) && (
                      <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {!useAI && !logoAnalysis && (
        <Card className="border-2 border-dashed border-border rounded-2xl">
          <CardContent className="p-6 text-center">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click "Auto-Generate Effects" to analyze your logo and get intelligent recommendations
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAILogoGeneration } from '../hooks/useAILogoGeneration';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WorkflowMode } from '../App';

interface PromptLogoGeneratorProps {
  onLogoGenerated: (imageUrl: string) => void;
  workflowMode?: WorkflowMode;
}

export default function PromptLogoGenerator({ onLogoGenerated, workflowMode }: PromptLogoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<'openai' | 'google'>('openai');
  
  const { generateLogo, isGenerating, error, generatedLogoUrl } = useAILogoGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const logoUrl = await generateLogo(prompt, provider);
    if (logoUrl) {
      onLogoGenerated(logoUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-provider" className="text-sm font-semibold">
            AI Provider
          </Label>
          <Select value={provider} onValueChange={(value) => setProvider(value as 'openai' | 'google')}>
            <SelectTrigger id="ai-provider" className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">ChatGPT / DALL-E (OpenAI)</SelectItem>
              <SelectItem value="google">Gemini / Imagen (Google AI)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose your preferred AI service for logo generation
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt" className="text-sm font-semibold">
            Describe your logo
          </Label>
          <Textarea
            id="prompt"
            placeholder={`e.g., A modern tech company logo with a blue gradient and geometric shapes${workflowMode ? ` (for ${workflowMode} animation)` : ''}`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] rounded-xl resize-none"
            disabled={isGenerating}
          />
          <p className="text-xs text-muted-foreground">
            Be specific about style, colors, shapes, and mood for best results.
            {workflowMode && ` This logo will be used in ${workflowMode} animation mode.`}
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          size="lg"
          className="w-full rounded-full bg-gradient-to-r from-coral-500 to-purple-500 hover:from-coral-600 hover:to-purple-600 text-white font-semibold shadow-soft-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating with {provider === 'openai' ? 'DALL-E' : 'Gemini'}...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Logo with AI
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedLogoUrl && (
        <Card className="border-2 border-border rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Generated Logo Preview</Label>
              <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
                <img
                  src={generatedLogoUrl}
                  alt="Generated logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Logo generated successfully! Ready to animate in {workflowMode || '2D/3D'} mode.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

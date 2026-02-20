import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';
import { AnimationSettings } from '../hooks/useAnimationSettings';

interface EffectsControlsProps {
  settings: AnimationSettings;
  onSettingsChange: (settings: AnimationSettings) => void;
}

export default function EffectsControls({ settings, onSettingsChange }: EffectsControlsProps) {
  const updateSetting = <K extends keyof AnimationSettings>(
    key: K,
    value: AnimationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-coral-400/10 to-purple-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-coral-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          Visual Effects
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Add stunning visual effects to your animation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Glow/Bloom Effect */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <Label htmlFor="glow-enabled" className="text-sm font-semibold text-foreground">
              Glow Effect
            </Label>
            <Switch
              id="glow-enabled"
              checked={settings.glowEnabled}
              onCheckedChange={(checked) => updateSetting('glowEnabled', checked)}
            />
          </div>
          
          {settings.glowEnabled && (
            <div className="space-y-3 pl-4 border-l-4 border-coral-500/30 rounded">
              <div className="flex items-center justify-between">
                <Label htmlFor="glow-intensity" className="text-sm font-semibold text-foreground">
                  Glow Intensity
                </Label>
                <span className="text-sm font-medium text-coral-500">
                  {Math.round(settings.glowIntensity * 100)}%
                </span>
              </div>
              <Slider
                id="glow-intensity"
                min={0}
                max={1}
                step={0.01}
                value={[settings.glowIntensity]}
                onValueChange={([value]) => updateSetting('glowIntensity', value)}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Particle Trail Effect */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
          <Label htmlFor="particle-trail" className="text-sm font-semibold text-foreground">
            Particle Trail
          </Label>
          <Switch
            id="particle-trail"
            checked={settings.particleTrailEnabled}
            onCheckedChange={(checked) => updateSetting('particleTrailEnabled', checked)}
          />
        </div>

        {/* Shadow Intensity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="shadow-intensity" className="text-sm font-semibold text-foreground">
              Shadow Intensity
            </Label>
            <span className="text-sm font-medium text-purple-500">
              {Math.round(settings.shadowIntensity * 100)}%
            </span>
          </div>
          <Slider
            id="shadow-intensity"
            min={0}
            max={1}
            step={0.01}
            value={[settings.shadowIntensity]}
            onValueChange={([value]) => updateSetting('shadowIntensity', value)}
            className="cursor-pointer"
          />
        </div>
      </CardContent>
    </Card>
  );
}

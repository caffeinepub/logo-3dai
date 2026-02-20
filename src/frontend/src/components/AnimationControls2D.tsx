import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { AnimationSettings } from '../hooks/useAnimationSettings';
import { Move, Maximize2, Eye } from 'lucide-react';

interface AnimationControls2DProps {
  settings: AnimationSettings;
  onSettingsChange: (settings: AnimationSettings) => void;
}

export default function AnimationControls2D({ settings, onSettingsChange }: AnimationControls2DProps) {
  const updateSetting = <K extends keyof AnimationSettings>(
    key: K,
    value: AnimationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Position Controls (2D: X and Y only) */}
      <Card className="shadow-soft border-2 border-border">
        <CardHeader className="bg-gradient-to-r from-coral-400/10 to-coral-500/5 rounded-t-lg pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-coral-500/20 flex items-center justify-center">
              <Move className="w-4 h-4 text-coral-500" />
            </div>
            Position (2D)
          </CardTitle>
          <CardDescription className="text-xs">
            Adjust logo position on the flat plane
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* X Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="position-x" className="text-sm">X Position</Label>
              <Input
                id="position-x"
                type="number"
                value={settings.positionX.toFixed(2)}
                onChange={(e) => updateSetting('positionX', parseFloat(e.target.value) || 0)}
                className="w-20 h-8 text-xs rounded-lg"
                step="0.1"
              />
            </div>
            <Slider
              min={-5}
              max={5}
              step={0.1}
              value={[settings.positionX]}
              onValueChange={([value]) => updateSetting('positionX', value)}
              className="cursor-pointer"
            />
          </div>

          {/* Y Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="position-y" className="text-sm">Y Position</Label>
              <Input
                id="position-y"
                type="number"
                value={settings.positionY.toFixed(2)}
                onChange={(e) => updateSetting('positionY', parseFloat(e.target.value) || 0)}
                className="w-20 h-8 text-xs rounded-lg"
                step="0.1"
              />
            </div>
            <Slider
              min={-5}
              max={5}
              step={0.1}
              value={[settings.positionY]}
              onValueChange={([value]) => updateSetting('positionY', value)}
              className="cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scale Control */}
      <Card className="shadow-soft border-2 border-border">
        <CardHeader className="bg-gradient-to-r from-purple-400/10 to-purple-500/5 rounded-t-lg pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-purple-500" />
            </div>
            Scale
          </CardTitle>
          <CardDescription className="text-xs">
            Adjust logo size
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="scale" className="text-sm">Uniform Scale</Label>
              <Input
                id="scale"
                type="number"
                value={settings.scale.toFixed(2)}
                onChange={(e) => updateSetting('scale', parseFloat(e.target.value) || 1)}
                className="w-20 h-8 text-xs rounded-lg"
                step="0.1"
                min="0.1"
              />
            </div>
            <Slider
              min={0.1}
              max={3}
              step={0.1}
              value={[settings.scale]}
              onValueChange={([value]) => updateSetting('scale', value)}
              className="cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Opacity Control */}
      <Card className="shadow-soft border-2 border-border">
        <CardHeader className="bg-gradient-to-r from-teal-400/10 to-teal-500/5 rounded-t-lg pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Eye className="w-4 h-4 text-teal-500" />
            </div>
            Opacity
          </CardTitle>
          <CardDescription className="text-xs">
            Adjust logo transparency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="opacity" className="text-sm">Opacity</Label>
              <span className="text-sm font-medium text-teal-500">
                {Math.round(settings.opacity * 100)}%
              </span>
            </div>
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.01}
              value={[settings.opacity]}
              onValueChange={([value]) => updateSetting('opacity', value)}
              className="cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

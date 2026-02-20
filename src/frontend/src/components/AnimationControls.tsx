import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimationSettings } from '../hooks/useAnimationSettings';
import { RotateCw, Move, Maximize2, Palette } from 'lucide-react';

interface AnimationControlsProps {
  settings: AnimationSettings;
  onSettingsChange: (settings: AnimationSettings) => void;
}

export default function AnimationControls({ settings, onSettingsChange }: AnimationControlsProps) {
  const updateSetting = <K extends keyof AnimationSettings>(
    key: K,
    value: AnimationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const updateRotationAxis = (axis: 'x' | 'y' | 'z', value: number) => {
    onSettingsChange({
      ...settings,
      rotationAxis: {
        ...settings.rotationAxis,
        [axis]: value,
      },
    });
  };

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-teal-400/10 to-purple-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
            <RotateCw className="w-5 h-5 text-white" />
          </div>
          3D Animation Controls
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure rotation, position, and appearance
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted rounded-2xl p-1">
            <TabsTrigger value="transform" className="rounded-xl text-xs">Transform</TabsTrigger>
            <TabsTrigger value="rotation" className="rounded-xl text-xs">Rotation</TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl text-xs">Appearance</TabsTrigger>
          </TabsList>

          {/* Transform Tab */}
          <TabsContent value="transform" className="space-y-6 mt-4">
            {/* Position Controls with numeric inputs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Move className="w-4 h-4 text-teal-500" />
                <Label className="text-sm font-semibold text-foreground">Position (X, Y, Z)</Label>
              </div>
              
              {/* X Position */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="position-x" className="text-xs text-muted-foreground">X Position</Label>
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
                  min={-10}
                  max={10}
                  step={0.1}
                  value={[settings.positionX]}
                  onValueChange={([value]) => updateSetting('positionX', value)}
                  className="cursor-pointer"
                />
              </div>

              {/* Y Position */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="position-y" className="text-xs text-muted-foreground">Y Position</Label>
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
                  min={-10}
                  max={10}
                  step={0.1}
                  value={[settings.positionY]}
                  onValueChange={([value]) => updateSetting('positionY', value)}
                  className="cursor-pointer"
                />
              </div>

              {/* Z Position */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="position-z" className="text-xs text-muted-foreground">Z Position</Label>
                  <Input
                    id="position-z"
                    type="number"
                    value={settings.positionZ.toFixed(2)}
                    onChange={(e) => updateSetting('positionZ', parseFloat(e.target.value) || 0)}
                    className="w-20 h-8 text-xs rounded-lg"
                    step="0.1"
                  />
                </div>
                <Slider
                  min={-10}
                  max={10}
                  step={0.1}
                  value={[settings.positionZ]}
                  onValueChange={([value]) => updateSetting('positionZ', value)}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-purple-500" />
                <Label className="text-sm font-semibold text-foreground">Scale</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scale" className="text-xs text-muted-foreground">Uniform Scale</Label>
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
            </div>
          </TabsContent>

          {/* Rotation Tab */}
          <TabsContent value="rotation" className="space-y-6 mt-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <Label htmlFor="enable-rotation" className="text-sm font-semibold text-foreground">
                Enable Rotation
              </Label>
              <Switch
                id="enable-rotation"
                checked={settings.enableRotation}
                onCheckedChange={(checked) => updateSetting('enableRotation', checked)}
              />
            </div>

            {settings.enableRotation && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rotation-speed" className="text-sm font-semibold text-foreground">
                      Rotation Speed
                    </Label>
                    <span className="text-sm font-medium text-coral-500">
                      {settings.rotationSpeed.toFixed(1)}x
                    </span>
                  </div>
                  <Slider
                    id="rotation-speed"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[settings.rotationSpeed]}
                    onValueChange={([value]) => updateSetting('rotationSpeed', value)}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-foreground">Rotation Axis</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="axis-x" className="text-xs text-muted-foreground">X Axis</Label>
                      <span className="text-xs font-medium text-coral-500">
                        {settings.rotationAxis.x.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="axis-x"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[settings.rotationAxis.x]}
                      onValueChange={([value]) => updateRotationAxis('x', value)}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="axis-y" className="text-xs text-muted-foreground">Y Axis</Label>
                      <span className="text-xs font-medium text-coral-500">
                        {settings.rotationAxis.y.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="axis-y"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[settings.rotationAxis.y]}
                      onValueChange={([value]) => updateRotationAxis('y', value)}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="axis-z" className="text-xs text-muted-foreground">Z Axis</Label>
                      <span className="text-xs font-medium text-coral-500">
                        {settings.rotationAxis.z.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="axis-z"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[settings.rotationAxis.z]}
                      onValueChange={([value]) => updateRotationAxis('z', value)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="opacity" className="text-sm font-semibold text-foreground">
                  Opacity
                </Label>
                <span className="text-sm font-medium text-purple-500">
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

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-coral-500" />
                <Label htmlFor="color-tint" className="text-sm font-semibold text-foreground">
                  Color Tint
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="color-tint"
                  type="color"
                  value={settings.colorTint}
                  onChange={(e) => updateSetting('colorTint', e.target.value)}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.colorTint}
                  onChange={(e) => updateSetting('colorTint', e.target.value)}
                  className="flex-1 rounded-lg"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

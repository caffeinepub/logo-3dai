import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Volume2, RotateCw, Maximize2, Sparkles } from 'lucide-react';

interface SoundEffectsPanelProps {
  soundEffects: {
    rotation: boolean;
    scale: boolean;
    particle: boolean;
  };
  onToggleSoundEffect: (effect: 'rotation' | 'scale' | 'particle') => void;
}

export default function SoundEffectsPanel({ soundEffects, onToggleSoundEffect }: SoundEffectsPanelProps) {
  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-teal-400/10 to-coral-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          Sound Effects
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Add sound effects to animation events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Rotation Sound */}
        <div className="p-4 rounded-2xl border-2 border-border bg-card hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                <RotateCw className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <Label htmlFor="rotation-sound" className="text-sm font-semibold text-foreground cursor-pointer">
                  Rotation Sound
                </Label>
                <p className="text-xs text-muted-foreground">Plays during rotation</p>
              </div>
            </div>
            <Switch
              id="rotation-sound"
              checked={soundEffects.rotation}
              onCheckedChange={() => onToggleSoundEffect('rotation')}
            />
          </div>
        </div>

        {/* Scale Sound */}
        <div className="p-4 rounded-2xl border-2 border-border bg-card hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Maximize2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <Label htmlFor="scale-sound" className="text-sm font-semibold text-foreground cursor-pointer">
                  Scale Sound
                </Label>
                <p className="text-xs text-muted-foreground">Plays on scale changes</p>
              </div>
            </div>
            <Switch
              id="scale-sound"
              checked={soundEffects.scale}
              onCheckedChange={() => onToggleSoundEffect('scale')}
            />
          </div>
        </div>

        {/* Particle Sound */}
        <div className="p-4 rounded-2xl border-2 border-border bg-card hover:border-coral-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coral-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-coral-500" />
              </div>
              <div>
                <Label htmlFor="particle-sound" className="text-sm font-semibold text-foreground cursor-pointer">
                  Particle Sound
                </Label>
                <p className="text-xs text-muted-foreground">Plays with particle effects</p>
              </div>
            </div>
            <Switch
              id="particle-sound"
              checked={soundEffects.particle}
              onCheckedChange={() => onToggleSoundEffect('particle')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

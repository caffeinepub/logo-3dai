import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { Keyframe } from '../hooks/useAnimationSettings';
import AnimationControls from './AnimationControls';

interface KeyframeEditorProps {
  keyframe: Keyframe;
  onChange: (keyframe: Keyframe) => void;
  onDelete: () => void;
}

export default function KeyframeEditor({ keyframe, onChange, onDelete }: KeyframeEditorProps) {
  const handleSettingsChange = (newSettings: any) => {
    onChange({
      ...keyframe,
      settings: {
        ...keyframe.settings,
        ...newSettings,
      },
    });
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-soft border-2 border-coral-500 bg-coral-500/5">
        <CardHeader className="bg-gradient-to-r from-coral-400/20 to-purple-400/20 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="w-5 h-5 text-coral-500" />
                Keyframe Editor
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Editing keyframe at {keyframe.timestamp.toFixed(2)}s
              </CardDescription>
            </div>
            <Button
              onClick={onDelete}
              variant="destructive"
              size="icon"
              className="rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <AnimationControls
        settings={{ ...keyframe.settings, keyframes: [], duration: 5, renderMode: '3D' }}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

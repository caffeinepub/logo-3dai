import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Camera, Circle, Trash2, Video } from 'lucide-react';
import { RecordingState } from '../hooks/useCameraAnimation';
import { useState } from 'react';

interface CameraControlsProps {
  recordingState: RecordingState;
  keyframeCount: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onClearPath: () => void;
  onApplyPreset: (preset: string, options: { radius: number; speed: number; direction: 'clockwise' | 'counterclockwise' }) => void;
}

export default function CameraControls({
  recordingState,
  keyframeCount,
  onStartRecording,
  onStopRecording,
  onClearPath,
  onApplyPreset,
}: CameraControlsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [presetRadius, setPresetRadius] = useState(5);
  const [presetSpeed, setPresetSpeed] = useState(1);
  const [presetDirection, setPresetDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');

  const handleApplyPreset = () => {
    if (selectedPreset) {
      onApplyPreset(selectedPreset, {
        radius: presetRadius,
        speed: presetSpeed,
        direction: presetDirection,
      });
    }
  };

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-teal-400/10 to-purple-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          Camera Animation
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Record camera movements or apply presets
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Recording Controls */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Manual Recording</Label>
          <div className="flex items-center gap-3">
            {recordingState === 'idle' ? (
              <Button
                onClick={onStartRecording}
                className="flex-1 bg-coral-500 hover:bg-coral-600 rounded-xl"
              >
                <Circle className="w-4 h-4 mr-2 fill-current" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={onStopRecording}
                className="flex-1 bg-destructive hover:bg-destructive/90 rounded-xl"
              >
                <Video className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}
            <Button
              onClick={onClearPath}
              variant="outline"
              size="icon"
              className="rounded-xl border-2"
              disabled={keyframeCount === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {recordingState === 'recording' 
              ? 'Move the camera to record keyframes...' 
              : `${keyframeCount} camera keyframe${keyframeCount !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Camera Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Camera Presets</Label>
          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
            <SelectTrigger className="rounded-xl border-2">
              <SelectValue placeholder="Choose a preset..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orbit">Orbit Around Logo</SelectItem>
              <SelectItem value="dollyZoom">Dolly Zoom</SelectItem>
              <SelectItem value="flyThrough">Fly-Through</SelectItem>
              <SelectItem value="tracking">Tracking Shot</SelectItem>
            </SelectContent>
          </Select>

          {selectedPreset && (
            <div className="space-y-4 p-4 rounded-xl bg-muted/50">
              {selectedPreset === 'orbit' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Orbit Radius</Label>
                    <Slider
                      value={[presetRadius]}
                      onValueChange={([value]) => setPresetRadius(value)}
                      min={3}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{presetRadius.toFixed(1)}</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Direction</Label>
                    <Select value={presetDirection} onValueChange={(v) => setPresetDirection(v as any)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clockwise">Clockwise</SelectItem>
                        <SelectItem value="counterclockwise">Counter-clockwise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <Button
                onClick={handleApplyPreset}
                className="w-full bg-purple-500 hover:bg-purple-600 rounded-xl"
              >
                Apply Preset
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

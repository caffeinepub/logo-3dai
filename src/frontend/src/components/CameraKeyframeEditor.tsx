import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Camera } from 'lucide-react';
import { CameraKeyframe } from '../hooks/useCameraAnimation';

interface CameraKeyframeEditorProps {
  keyframe: CameraKeyframe;
  onChange: (keyframe: CameraKeyframe) => void;
  onDelete: () => void;
}

export default function CameraKeyframeEditor({
  keyframe,
  onChange,
  onDelete,
}: CameraKeyframeEditorProps) {
  const updatePosition = (axis: number, value: number) => {
    const newPosition: [number, number, number] = [...keyframe.position];
    newPosition[axis] = value;
    onChange({ ...keyframe, position: newPosition });
  };

  const updateRotation = (axis: number, value: number) => {
    const newRotation: [number, number, number] = [...keyframe.rotation];
    newRotation[axis] = (value * Math.PI) / 180; // Convert degrees to radians
    onChange({ ...keyframe, rotation: newRotation });
  };

  const updateFOV = (value: number) => {
    onChange({ ...keyframe, fov: value });
  };

  const updateTime = (value: number) => {
    onChange({ ...keyframe, time: value });
  };

  return (
    <Card className="shadow-soft border-2 border-teal-500">
      <CardHeader className="bg-gradient-to-r from-teal-400/20 to-purple-400/20 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          Camera Keyframe
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Edit camera position, rotation, and FOV
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Time */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Time (seconds)</Label>
          <Input
            type="number"
            value={keyframe.time.toFixed(2)}
            onChange={(e) => updateTime(parseFloat(e.target.value) || 0)}
            step={0.1}
            min={0}
            className="rounded-xl border-2"
          />
        </div>

        {/* Position */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Position</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">X</Label>
              <Input
                type="number"
                value={keyframe.position[0].toFixed(2)}
                onChange={(e) => updatePosition(0, parseFloat(e.target.value) || 0)}
                step={0.1}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Y</Label>
              <Input
                type="number"
                value={keyframe.position[1].toFixed(2)}
                onChange={(e) => updatePosition(1, parseFloat(e.target.value) || 0)}
                step={0.1}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Z</Label>
              <Input
                type="number"
                value={keyframe.position[2].toFixed(2)}
                onChange={(e) => updatePosition(2, parseFloat(e.target.value) || 0)}
                step={0.1}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Rotation (degrees)</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Pitch</Label>
              <Input
                type="number"
                value={((keyframe.rotation[0] * 180) / Math.PI).toFixed(1)}
                onChange={(e) => updateRotation(0, parseFloat(e.target.value) || 0)}
                step={1}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Yaw</Label>
              <Input
                type="number"
                value={((keyframe.rotation[1] * 180) / Math.PI).toFixed(1)}
                onChange={(e) => updateRotation(1, parseFloat(e.target.value) || 0)}
                step={1}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Roll</Label>
              <Input
                type="number"
                value={((keyframe.rotation[2] * 180) / Math.PI).toFixed(1)}
                onChange={(e) => updateRotation(2, parseFloat(e.target.value) || 0)}
                step={1}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* FOV */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Field of View</Label>
          <Input
            type="number"
            value={keyframe.fov.toFixed(1)}
            onChange={(e) => updateFOV(parseFloat(e.target.value) || 50)}
            step={1}
            min={20}
            max={120}
            className="rounded-xl border-2"
          />
        </div>

        {/* Delete Button */}
        <Button
          onClick={onDelete}
          variant="destructive"
          className="w-full rounded-xl"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Camera Keyframe
        </Button>
      </CardContent>
    </Card>
  );
}

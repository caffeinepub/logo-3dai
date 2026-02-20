import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Plus, Camera } from 'lucide-react';
import { Keyframe } from '../hooks/useAnimationSettings';
import { CameraKeyframe } from '../hooks/useCameraAnimation';

interface TimelineProps {
  keyframes: Keyframe[];
  cameraKeyframes?: CameraKeyframe[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  selectedKeyframeId: string | null;
  selectedCameraKeyframeId?: string | null;
  onAddKeyframe: (timestamp: number) => void;
  onAddCameraKeyframe?: (timestamp: number) => void;
  onSelectKeyframe: (id: string | null) => void;
  onSelectCameraKeyframe?: (id: string | null) => void;
  onSeek: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function Timeline({
  keyframes,
  cameraKeyframes = [],
  currentTime,
  duration,
  isPlaying,
  selectedKeyframeId,
  selectedCameraKeyframeId,
  onAddKeyframe,
  onAddCameraKeyframe,
  onSelectKeyframe,
  onSelectCameraKeyframe,
  onSeek,
  onPlay,
  onPause,
  onReset,
}: TimelineProps) {
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const timestamp = percentage * duration;
    onSeek(timestamp);
  };

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            <Button
              onClick={isPlaying ? onPause : onPlay}
              size="icon"
              className="rounded-full w-12 h-12 bg-coral-500 hover:bg-coral-600"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button
              onClick={onReset}
              size="icon"
              variant="outline"
              className="rounded-full w-12 h-12 border-2"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-sm font-semibold text-foreground">
                {currentTime.toFixed(2)}s / {duration}s
              </span>
            </div>
            <Button
              onClick={() => onAddKeyframe(currentTime)}
              size="sm"
              className="rounded-full bg-purple-500 hover:bg-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Keyframe
            </Button>
            {onAddCameraKeyframe && (
              <Button
                onClick={() => onAddCameraKeyframe(currentTime)}
                size="sm"
                className="rounded-full bg-teal-500 hover:bg-teal-600"
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
            )}
          </div>

          {/* Timeline Track */}
          <div
            className="relative h-20 bg-muted rounded-2xl cursor-pointer overflow-hidden border-2 border-border"
            onClick={handleSeek}
          >
            {/* Progress Bar */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-coral-500/20 to-purple-500/20 transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />

            {/* Animation Keyframes (top half) */}
            {keyframes.map((kf) => (
              <div
                key={kf.id}
                className={`absolute top-2 -translate-y-0 w-4 h-4 rounded-full cursor-pointer transition-all ${
                  selectedKeyframeId === kf.id
                    ? 'bg-coral-500 ring-4 ring-coral-500/30 scale-125'
                    : 'bg-purple-500 hover:scale-110'
                }`}
                style={{ left: `${(kf.timestamp / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectKeyframe(kf.id);
                  if (onSelectCameraKeyframe) onSelectCameraKeyframe(null);
                }}
                title="Animation Keyframe"
              />
            ))}

            {/* Camera Keyframes (bottom half) */}
            {cameraKeyframes.map((kf) => (
              <div
                key={kf.id}
                className={`absolute bottom-2 translate-y-0 cursor-pointer transition-all ${
                  selectedCameraKeyframeId === kf.id
                    ? 'scale-125'
                    : 'hover:scale-110'
                }`}
                style={{ left: `${(kf.time / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectCameraKeyframe) onSelectCameraKeyframe(kf.id);
                  onSelectKeyframe(null);
                }}
                title="Camera Keyframe"
              >
                <div className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] ${
                  selectedCameraKeyframeId === kf.id
                    ? 'border-b-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]'
                    : 'border-b-teal-400'
                }`} />
              </div>
            ))}

            {/* Current Time Indicator */}
            <div
              className="absolute top-0 w-1 h-full bg-coral-500 transition-all pointer-events-none"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Instructions */}
          <p className="text-xs text-center text-muted-foreground">
            Click timeline to seek • Purple circles = animation • Teal triangles = camera
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Download, Video, RotateCcw, CheckCircle2, Music } from 'lucide-react';
import { useVideoExport } from '../hooks/useVideoExport';
import { AnimationSettings } from '../hooks/useAnimationSettings';

interface ExportControlsProps {
  logoImageUrl: string | null;
  animationSettings: AnimationSettings;
  onStartOver: () => void;
  audioUrl?: string | null;
  soundEffects?: {
    rotation: boolean;
    scale: boolean;
    particle: boolean;
  };
}

export default function ExportControls({ 
  logoImageUrl, 
  animationSettings, 
  onStartOver,
  audioUrl,
  soundEffects
}: ExportControlsProps) {
  const [duration, setDuration] = useState('5');
  const [resolution, setResolution] = useState('1080');
  const [frameRate, setFrameRate] = useState('30');

  const { exportVideo, isExporting, exportProgress, downloadUrl, error } = useVideoExport();

  const handleExport = async () => {
    if (!logoImageUrl) return;

    await exportVideo({
      logoImageUrl,
      animationSettings,
      duration: parseInt(duration),
      resolution: parseInt(resolution),
      frameRate: parseInt(frameRate),
      audioUrl: audioUrl || undefined,
      soundEffects: soundEffects || { rotation: false, scale: false, particle: false },
    });
  };

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-teal-400/10 to-coral-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          Export Video
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure and export your 3D animation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Audio Status */}
        {audioUrl && (
          <div className="p-3 rounded-xl bg-purple-500/10 border-2 border-purple-500/20">
            <div className="flex items-center gap-2 text-sm">
              <Music className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-foreground">Audio will be included</span>
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-semibold text-foreground">
            Duration (seconds)
          </Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration" className="rounded-xl border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 seconds</SelectItem>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="15">15 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resolution */}
        <div className="space-y-2">
          <Label htmlFor="resolution" className="text-sm font-semibold text-foreground">
            Resolution
          </Label>
          <Select value={resolution} onValueChange={setResolution}>
            <SelectTrigger id="resolution" className="rounded-xl border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720">720p (HD)</SelectItem>
              <SelectItem value="1080">1080p (Full HD)</SelectItem>
              <SelectItem value="1440">1440p (2K)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Frame Rate */}
        <div className="space-y-2">
          <Label htmlFor="framerate" className="text-sm font-semibold text-foreground">
            Frame Rate
          </Label>
          <Select value={frameRate} onValueChange={setFrameRate}>
            <SelectTrigger id="framerate" className="rounded-xl border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 fps (Cinematic)</SelectItem>
              <SelectItem value="30">30 fps (Standard)</SelectItem>
              <SelectItem value="60">60 fps (Smooth)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Exporting...</span>
              <span className="font-bold text-coral-500">{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="h-3" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border-2 border-destructive/20">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {downloadUrl && (
          <div className="p-4 rounded-xl bg-teal-500/10 border-2 border-teal-500/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-teal-500" />
              <span className="font-semibold text-foreground">Export Complete!</span>
            </div>
            <Button
              asChild
              className="w-full rounded-full bg-teal-500 hover:bg-teal-600"
            >
              <a href={downloadUrl} download="logo-animation.mp4">
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </a>
            </Button>
          </div>
        )}

        {/* Export Button */}
        {!downloadUrl && (
          <Button
            onClick={handleExport}
            disabled={isExporting || !logoImageUrl}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white font-semibold"
            size="lg"
          >
            {isExporting ? 'Exporting...' : 'Export Video'}
          </Button>
        )}

        {/* Start Over Button */}
        <Button
          onClick={onStartOver}
          variant="outline"
          className="w-full rounded-full border-2"
          size="lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </CardContent>
    </Card>
  );
}

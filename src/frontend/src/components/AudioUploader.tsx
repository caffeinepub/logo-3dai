import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Music, X, Play, Pause } from 'lucide-react';
import { useAudioUpload } from '../hooks/useAudioUpload';
import { useState, useRef } from 'react';

interface AudioUploaderProps {
  onAudioUploaded: (audioUrl: string) => void;
  onPlayPreview: (url: string) => void;
  onStopPreview: () => void;
}

export default function AudioUploader({ onAudioUploaded, onPlayPreview, onStopPreview }: AudioUploaderProps) {
  const { uploadAudio, clearAudio, isUploading, uploadProgress, audioUrl, audioMetadata, error } = useAudioUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    await uploadAudio(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handlePlayPause = () => {
    if (audioUrl) {
      if (isPlaying) {
        onStopPreview();
        setIsPlaying(false);
      } else {
        onPlayPreview(audioUrl);
        setIsPlaying(true);
      }
    }
  };

  const handleClear = () => {
    clearAudio();
    onStopPreview();
    setIsPlaying(false);
  };

  const handleUploadComplete = () => {
    if (audioUrl) {
      onAudioUploaded(audioUrl);
    }
  };

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-coral-400/10 to-purple-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-coral-500 flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          Upload Custom Audio
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          MP3 or WAV files, up to 20MB
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {!audioUrl ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? 'border-coral-500 bg-coral-500/5'
                : 'border-border hover:border-coral-300 hover:bg-coral-500/5'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-coral-500/10 flex items-center justify-center">
                <Music className="w-8 h-8 text-coral-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Drag and drop your audio file here
                </p>
                <p className="text-xs text-muted-foreground">or</p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-full bg-coral-500 hover:bg-coral-600"
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/mp3,audio/mpeg,audio/wav"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
            {isUploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
              </div>
            )}
            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border-2 border-coral-500 bg-coral-500/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-coral-500 flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{audioMetadata?.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {audioMetadata?.duration.toFixed(1)}s • {(audioMetadata!.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleClear}
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isPlaying ? 'default' : 'outline'}
                  onClick={handlePlayPause}
                  className="rounded-full flex-1"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Preview
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleUploadComplete}
              className="w-full rounded-full bg-coral-500 hover:bg-coral-600"
            >
              Use This Audio
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

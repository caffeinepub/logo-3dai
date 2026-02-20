import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause } from 'lucide-react';
import { useState } from 'react';

interface MusicTrack {
  id: string;
  name: string;
  duration: string;
  url: string;
}

const musicTracks: MusicTrack[] = [
  { id: 'default-track-1', name: 'Upbeat Energy', duration: '0:30', url: '/assets/music/default-track-1.mp3' },
  { id: 'default-track-2', name: 'Smooth Vibes', duration: '0:30', url: '/assets/music/default-track-2.mp3' },
  { id: 'default-track-3', name: 'Tech Flow', duration: '0:30', url: '/assets/music/default-track-3.mp3' },
];

interface MusicLibraryProps {
  selectedTrack: string | null;
  onSelectTrack: (trackId: string) => void;
  onPlayPreview: (url: string) => void;
  onStopPreview: () => void;
}

export default function MusicLibrary({ selectedTrack, onSelectTrack, onPlayPreview, onStopPreview }: MusicLibraryProps) {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const handlePlayPause = (track: MusicTrack) => {
    if (playingTrack === track.id) {
      onStopPreview();
      setPlayingTrack(null);
    } else {
      onPlayPreview(track.url);
      setPlayingTrack(track.id);
    }
  };

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-purple-400/10 to-teal-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          Background Music
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose a track to accompany your animation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-6">
        {musicTracks.map((track) => (
          <div
            key={track.id}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedTrack === track.id
                ? 'border-purple-500 bg-purple-500/5 shadow-soft'
                : 'border-border bg-card hover:border-purple-300 hover:shadow-soft'
            }`}
            onClick={() => onSelectTrack(track.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{track.name}</h4>
                <p className="text-sm text-muted-foreground">{track.duration}</p>
              </div>
              <Button
                size="icon"
                variant={playingTrack === track.id ? 'default' : 'outline'}
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause(track);
                }}
              >
                {playingTrack === track.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

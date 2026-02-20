import { useState, useCallback } from 'react';

export interface AudioState {
  selectedMusicTrack: string | null;
  customAudioUrl: string | null;
  soundEffects: {
    rotation: boolean;
    scale: boolean;
    particle: boolean;
  };
  previewAudio: HTMLAudioElement | null;
}

export function useAudioManager() {
  const [selectedMusicTrack, setSelectedMusicTrack] = useState<string | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [soundEffects, setSoundEffects] = useState({
    rotation: false,
    scale: false,
    particle: false,
  });
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const selectMusicTrack = useCallback((trackId: string) => {
    setSelectedMusicTrack(trackId);
    setCustomAudioUrl(null);
  }, []);

  const selectCustomAudio = useCallback((audioUrl: string) => {
    setCustomAudioUrl(audioUrl);
    setSelectedMusicTrack(null);
  }, []);

  const toggleSoundEffect = useCallback((effect: 'rotation' | 'scale' | 'particle') => {
    setSoundEffects((prev) => ({
      ...prev,
      [effect]: !prev[effect],
    }));
  }, []);

  const playPreview = useCallback((audioUrl: string) => {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    }
    const audio = new Audio(audioUrl);
    audio.play();
    setPreviewAudio(audio);
  }, [previewAudio]);

  const stopPreview = useCallback(() => {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
      setPreviewAudio(null);
    }
  }, [previewAudio]);

  const getSelectedAudioUrl = useCallback(() => {
    if (customAudioUrl) return customAudioUrl;
    if (selectedMusicTrack) return `/assets/music/${selectedMusicTrack}.mp3`;
    return null;
  }, [customAudioUrl, selectedMusicTrack]);

  return {
    selectedMusicTrack,
    customAudioUrl,
    soundEffects,
    selectMusicTrack,
    selectCustomAudio,
    toggleSoundEffect,
    playPreview,
    stopPreview,
    getSelectedAudioUrl,
  };
}

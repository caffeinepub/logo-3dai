import { useState, useCallback } from 'react';

interface AudioMetadata {
  name: string;
  duration: number;
  size: number;
}

export function useAudioUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<AudioMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadAudio = useCallback(async (file: File) => {
    setError(null);
    setUploadProgress(0);
    setIsUploading(true);

    try {
      // Validate file type
      if (!file.type.match(/audio\/(mp3|mpeg|wav)/)) {
        throw new Error('Please upload an MP3 or WAV file');
      }

      // Validate file size (20MB max)
      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size must be less than 20MB');
      }

      // Create object URL for preview
      const url = URL.createObjectURL(file);

      // Get audio duration
      const audio = new Audio(url);
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve();
        });
        audio.addEventListener('error', () => {
          reject(new Error('Failed to load audio file'));
        });
      });

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      setAudioUrl(url);
      setAudioMetadata({
        name: file.name,
        duration: audio.duration,
        size: file.size,
      });
      setIsUploading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload audio');
      setIsUploading(false);
    }
  }, []);

  const clearAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioMetadata(null);
    setError(null);
    setUploadProgress(0);
  }, [audioUrl]);

  return {
    uploadAudio,
    clearAudio,
    isUploading,
    uploadProgress,
    audioUrl,
    audioMetadata,
    error,
  };
}

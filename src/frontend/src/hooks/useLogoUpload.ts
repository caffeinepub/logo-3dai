import { useState, useCallback } from 'react';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function useLogoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = useCallback(async (file: File): Promise<string | null> => {
    setError(null);
    setUploadProgress(0);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a PNG, JPG, or SVG file.');
      return null;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 10MB.');
      return null;
    }

    setIsUploading(true);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setPreviewUrl(objectUrl);
      setIsUploading(false);

      return objectUrl;
    } catch (err) {
      setError('Failed to upload logo. Please try again.');
      setIsUploading(false);
      return null;
    }
  }, []);

  return {
    uploadLogo,
    isUploading,
    uploadProgress,
    previewUrl,
    error,
  };
}

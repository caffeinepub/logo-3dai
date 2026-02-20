/**
 * Captures a frame from a canvas element as a Blob
 */
export async function captureFrame(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to capture frame'));
        }
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Captures multiple frames from a canvas at specified intervals
 */
export async function captureFrames(
  canvas: HTMLCanvasElement,
  frameCount: number,
  onProgress?: (progress: number) => void
): Promise<Blob[]> {
  const frames: Blob[] = [];

  for (let i = 0; i < frameCount; i++) {
    const frame = await captureFrame(canvas);
    frames.push(frame);

    if (onProgress) {
      onProgress(((i + 1) / frameCount) * 100);
    }

    // Small delay between captures
    await new Promise((resolve) => setTimeout(resolve, 16));
  }

  return frames;
}

/**
 * Converts frames to video data (placeholder for actual video encoding)
 */
export async function framesToVideo(
  frames: Blob[],
  frameRate: number
): Promise<Blob> {
  // In a real implementation, this would use a video encoding library
  // For now, return a placeholder blob
  return new Blob(['video data'], { type: 'video/mp4' });
}

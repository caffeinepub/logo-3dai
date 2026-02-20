import { AnimationSettings } from '../hooks/useAnimationSettings';

export interface AudioMixingOptions {
  backgroundMusicUrl: string | null;
  soundEffects: {
    rotation: boolean;
    scale: boolean;
    particle: boolean;
  };
  animationSettings: AnimationSettings;
  duration: number;
}

export function calculateSoundEffectTriggers(
  animationSettings: AnimationSettings,
  duration: number
): { rotation: number[]; scale: number[]; particle: number[] } {
  const triggers = {
    rotation: [] as number[],
    scale: [] as number[],
    particle: [] as number[],
  };

  // If there are keyframes, calculate triggers based on keyframe changes
  if (animationSettings.keyframes.length > 0) {
    const sortedKeyframes = [...animationSettings.keyframes].sort((a, b) => a.timestamp - b.timestamp);
    
    for (let i = 0; i < sortedKeyframes.length; i++) {
      const kf = sortedKeyframes[i];
      
      // Check for rotation changes
      if (kf.settings.enableRotation && kf.settings.rotationSpeed > 0) {
        triggers.rotation.push(kf.timestamp);
      }
      
      // Check for scale changes
      if (i > 0) {
        const prevKf = sortedKeyframes[i - 1];
        if (Math.abs(kf.settings.scale - prevKf.settings.scale) > 0.1) {
          triggers.scale.push(kf.timestamp);
        }
      }
      
      // Check for particle effects
      if (kf.settings.particleTrailEnabled) {
        triggers.particle.push(kf.timestamp);
      }
    }
  } else {
    // For non-keyframe animations, add triggers at regular intervals
    if (animationSettings.enableRotation) {
      triggers.rotation.push(0);
    }
    if (animationSettings.particleTrailEnabled) {
      triggers.particle.push(0);
    }
  }

  return triggers;
}

export async function mixAudioForExport(options: AudioMixingOptions): Promise<Blob | null> {
  // This is a placeholder for actual audio mixing implementation
  // In a real implementation, this would use Web Audio API to mix tracks
  
  if (!options.backgroundMusicUrl) {
    return null;
  }

  // For now, just return the background music as-is
  // In production, this would mix background music with sound effects
  try {
    const response = await fetch(options.backgroundMusicUrl);
    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('Failed to load audio for mixing:', error);
    return null;
  }
}

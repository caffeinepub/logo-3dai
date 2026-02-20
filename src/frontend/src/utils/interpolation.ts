import { AnimationSettings, Keyframe } from '../hooks/useAnimationSettings';

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(color1: string, color2: string, t: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function interpolateSettings(
  settings: AnimationSettings,
  currentTime: number
): AnimationSettings {
  const { keyframes } = settings;

  // If no keyframes, return current settings
  if (keyframes.length === 0) {
    return settings;
  }

  // Sort keyframes by timestamp
  const sortedKeyframes = [...keyframes].sort((a, b) => a.timestamp - b.timestamp);

  // Find surrounding keyframes
  let prevKeyframe: Keyframe | null = null;
  let nextKeyframe: Keyframe | null = null;

  for (let i = 0; i < sortedKeyframes.length; i++) {
    if (sortedKeyframes[i].timestamp <= currentTime) {
      prevKeyframe = sortedKeyframes[i];
    }
    if (sortedKeyframes[i].timestamp > currentTime && !nextKeyframe) {
      nextKeyframe = sortedKeyframes[i];
      break;
    }
  }

  // If before first keyframe, use first keyframe settings
  if (!prevKeyframe && nextKeyframe) {
    return { ...settings, ...nextKeyframe.settings };
  }

  // If after last keyframe, use last keyframe settings
  if (prevKeyframe && !nextKeyframe) {
    return { ...settings, ...prevKeyframe.settings };
  }

  // If between two keyframes, interpolate
  if (prevKeyframe && nextKeyframe) {
    const t = (currentTime - prevKeyframe.timestamp) / (nextKeyframe.timestamp - prevKeyframe.timestamp);
    
    return {
      ...settings,
      rotationSpeed: lerp(prevKeyframe.settings.rotationSpeed, nextKeyframe.settings.rotationSpeed, t),
      rotationAxis: {
        x: lerp(prevKeyframe.settings.rotationAxis.x, nextKeyframe.settings.rotationAxis.x, t),
        y: lerp(prevKeyframe.settings.rotationAxis.y, nextKeyframe.settings.rotationAxis.y, t),
        z: lerp(prevKeyframe.settings.rotationAxis.z, nextKeyframe.settings.rotationAxis.z, t),
      },
      scale: lerp(prevKeyframe.settings.scale, nextKeyframe.settings.scale, t),
      positionX: lerp(prevKeyframe.settings.positionX, nextKeyframe.settings.positionX, t),
      positionY: lerp(prevKeyframe.settings.positionY, nextKeyframe.settings.positionY, t),
      positionZ: lerp(prevKeyframe.settings.positionZ, nextKeyframe.settings.positionZ, t),
      opacity: lerp(prevKeyframe.settings.opacity, nextKeyframe.settings.opacity, t),
      colorTint: lerpColor(prevKeyframe.settings.colorTint, nextKeyframe.settings.colorTint, t),
      glowIntensity: lerp(prevKeyframe.settings.glowIntensity, nextKeyframe.settings.glowIntensity, t),
      shadowIntensity: lerp(prevKeyframe.settings.shadowIntensity, nextKeyframe.settings.shadowIntensity, t),
      enableRotation: t < 0.5 ? prevKeyframe.settings.enableRotation : nextKeyframe.settings.enableRotation,
      glowEnabled: t < 0.5 ? prevKeyframe.settings.glowEnabled : nextKeyframe.settings.glowEnabled,
      particleTrailEnabled: t < 0.5 ? prevKeyframe.settings.particleTrailEnabled : nextKeyframe.settings.particleTrailEnabled,
    };
  }

  return settings;
}

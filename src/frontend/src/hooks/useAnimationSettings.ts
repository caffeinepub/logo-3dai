export interface Keyframe {
  id: string;
  timestamp: number; // in seconds
  settings: Omit<AnimationSettings, 'keyframes' | 'duration' | 'renderMode'>;
}

export interface AnimationSettings {
  // Basic rotation
  rotationSpeed: number;
  rotationAxis: {
    x: number;
    y: number;
    z: number;
  };
  scale: number;
  enableRotation: boolean;
  
  // Position offset
  positionX: number;
  positionY: number;
  positionZ: number;
  
  // Appearance
  opacity: number; // 0-1
  colorTint: string; // hex color
  
  // Visual effects
  glowEnabled: boolean;
  glowIntensity: number; // 0-1
  particleTrailEnabled: boolean;
  shadowIntensity: number; // 0-1
  
  // Render mode
  renderMode: '2D' | '3D';
  
  // Timeline
  keyframes: Keyframe[];
  duration: number; // in seconds
}

export const defaultAnimationSettings: AnimationSettings = {
  rotationSpeed: 1,
  rotationAxis: { x: 0, y: 1, z: 0 },
  scale: 1,
  enableRotation: true,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  opacity: 1,
  colorTint: '#ffffff',
  glowEnabled: false,
  glowIntensity: 0.5,
  particleTrailEnabled: false,
  shadowIntensity: 0.5,
  renderMode: '3D',
  keyframes: [],
  duration: 5,
};

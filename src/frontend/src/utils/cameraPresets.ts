import { CameraKeyframe } from '../hooks/useCameraAnimation';

export interface PresetOptions {
  duration: number;
  radius?: number;
  speed?: number;
  direction?: 'clockwise' | 'counterclockwise';
  logoPosition?: [number, number, number];
}

export function generateOrbitPreset(options: PresetOptions): Omit<CameraKeyframe, 'id'>[] {
  const { duration, radius = 5, direction = 'clockwise', logoPosition = [0, 0, 0] } = options;
  const keyframes: Omit<CameraKeyframe, 'id'>[] = [];
  const numKeyframes = 8;
  const angleMultiplier = direction === 'clockwise' ? 1 : -1;

  for (let i = 0; i <= numKeyframes; i++) {
    const t = i / numKeyframes;
    const time = t * duration;
    const angle = t * Math.PI * 2 * angleMultiplier;

    keyframes.push({
      time,
      position: [
        logoPosition[0] + Math.cos(angle) * radius,
        logoPosition[1],
        logoPosition[2] + Math.sin(angle) * radius,
      ],
      rotation: [0, -angle, 0],
      fov: 50,
    });
  }

  return keyframes;
}

export function generateDollyZoomPreset(options: PresetOptions): Omit<CameraKeyframe, 'id'>[] {
  const { duration, logoPosition = [0, 0, 0] } = options;
  const startDistance = 8;
  const endDistance = 3;
  const startFOV = 35;
  const endFOV = 70;

  return [
    {
      time: 0,
      position: [logoPosition[0], logoPosition[1], logoPosition[2] + startDistance],
      rotation: [0, 0, 0],
      fov: startFOV,
    },
    {
      time: duration / 2,
      position: [logoPosition[0], logoPosition[1], logoPosition[2] + (startDistance + endDistance) / 2],
      rotation: [0, 0, 0],
      fov: (startFOV + endFOV) / 2,
    },
    {
      time: duration,
      position: [logoPosition[0], logoPosition[1], logoPosition[2] + endDistance],
      rotation: [0, 0, 0],
      fov: endFOV,
    },
  ];
}

export function generateFlyThroughPreset(options: PresetOptions): Omit<CameraKeyframe, 'id'>[] {
  const { duration, logoPosition = [0, 0, 0] } = options;

  return [
    {
      time: 0,
      position: [-5, 2, 8],
      rotation: [-0.2, -0.5, 0],
      fov: 50,
    },
    {
      time: duration * 0.3,
      position: [logoPosition[0] - 2, logoPosition[1] + 1, logoPosition[2] + 3],
      rotation: [-0.1, -0.3, 0],
      fov: 50,
    },
    {
      time: duration * 0.7,
      position: [logoPosition[0] + 2, logoPosition[1] - 1, logoPosition[2] + 3],
      rotation: [0.1, 0.3, 0],
      fov: 50,
    },
    {
      time: duration,
      position: [5, -2, 8],
      rotation: [0.2, 0.5, 0],
      fov: 50,
    },
  ];
}

export function generateTrackingShotPreset(options: PresetOptions): Omit<CameraKeyframe, 'id'>[] {
  const { duration, logoPosition = [0, 0, 0] } = options;
  const offset = [3, 1, 3];

  return [
    {
      time: 0,
      position: [logoPosition[0] + offset[0], logoPosition[1] + offset[1], logoPosition[2] + offset[2]],
      rotation: [-0.2, -0.6, 0],
      fov: 50,
    },
    {
      time: duration / 2,
      position: [logoPosition[0] + offset[0], logoPosition[1] + offset[1] + 1, logoPosition[2] + offset[2]],
      rotation: [-0.3, -0.6, 0],
      fov: 50,
    },
    {
      time: duration,
      position: [logoPosition[0] + offset[0], logoPosition[1] + offset[1], logoPosition[2] + offset[2]],
      rotation: [-0.2, -0.6, 0],
      fov: 50,
    },
  ];
}

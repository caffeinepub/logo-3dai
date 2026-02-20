/**
 * Effect generation utility that creates animation profiles based on logo analysis
 */

import { AnimationSettings, Keyframe } from '../hooks/useAnimationSettings';
import { LogoAnalysis } from './logoAnalysis';
import { WorkflowMode } from '../App';

/**
 * Generates a complete animation profile based on logo analysis and workflow mode
 */
export function generateAnimationProfile(
  analysis: LogoAnalysis,
  currentSettings: AnimationSettings,
  workflowMode: WorkflowMode = '3D'
): AnimationSettings {
  if (workflowMode === '2D') {
    return generate2DProfile(analysis, currentSettings);
  }
  return generate3DProfile(analysis, currentSettings);
}

/**
 * Generates 2D-optimized animation profile (NO ROTATION)
 */
function generate2DProfile(
  analysis: LogoAnalysis,
  currentSettings: AnimationSettings
): AnimationSettings {
  // 2D mode: NO rotation at all
  const rotationSpeed = 0;
  const rotationAxis = { x: 0, y: 0, z: 0 };
  
  // Enable glow for bright, colorful logos
  const glowEnabled = analysis.brightness > 0.5 && analysis.colorfulness > 0.3;
  const glowIntensity = Math.min(0.9, analysis.colorfulness * 1.2);
  
  // Enable particles for colorful logos
  const particleTrailEnabled = analysis.colorfulness > 0.4;
  
  // Shadow intensity based on brightness
  const shadowIntensity = analysis.brightness > 0.5 ? 0.5 : 0.2;
  
  // Generate 2D keyframes with slide and fade effects (NO ROTATION)
  const duration = 5;
  const keyframes: Keyframe[] = [];
  
  // Starting keyframe - slide in from left with fade
  keyframes.push({
    id: `kf-2d-auto-0`,
    timestamp: 0,
    settings: {
      rotationSpeed: 0,
      rotationAxis: { x: 0, y: 0, z: 0 },
      scale: 0.8,
      enableRotation: false,
      positionX: -3,
      positionY: 0,
      positionZ: 0,
      opacity: 0,
      colorTint: '#ffffff',
      glowEnabled: false,
      glowIntensity: 0,
      particleTrailEnabled: false,
      shadowIntensity: 0,
    },
  });
  
  // Mid keyframe - center with full effect
  keyframes.push({
    id: `kf-2d-auto-1`,
    timestamp: duration * 0.3,
    settings: {
      rotationSpeed: 0,
      rotationAxis: { x: 0, y: 0, z: 0 },
      scale: 1.1,
      enableRotation: false,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      opacity: 1,
      colorTint: analysis.dominantColors[0] || '#ffffff',
      glowEnabled,
      glowIntensity,
      particleTrailEnabled,
      shadowIntensity,
    },
  });
  
  // Another variation - slight movement
  keyframes.push({
    id: `kf-2d-auto-2`,
    timestamp: duration * 0.7,
    settings: {
      rotationSpeed: 0,
      rotationAxis: { x: 0, y: 0, z: 0 },
      scale: 1,
      enableRotation: false,
      positionX: 0,
      positionY: 0.2,
      positionZ: 0,
      opacity: 1,
      colorTint: analysis.dominantColors[1] || analysis.dominantColors[0] || '#ffffff',
      glowEnabled,
      glowIntensity: glowIntensity * 0.8,
      particleTrailEnabled,
      shadowIntensity,
    },
  });
  
  // Ending keyframe - settle
  keyframes.push({
    id: `kf-2d-auto-3`,
    timestamp: duration,
    settings: {
      rotationSpeed: 0,
      rotationAxis: { x: 0, y: 0, z: 0 },
      scale: 1,
      enableRotation: false,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      opacity: 1,
      colorTint: '#ffffff',
      glowEnabled,
      glowIntensity: glowIntensity * 0.6,
      particleTrailEnabled,
      shadowIntensity,
    },
  });
  
  return {
    ...currentSettings,
    rotationSpeed: 0,
    rotationAxis: { x: 0, y: 0, z: 0 },
    enableRotation: false,
    scale: 1,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    opacity: 1,
    colorTint: '#ffffff',
    glowEnabled,
    glowIntensity,
    particleTrailEnabled,
    shadowIntensity,
    renderMode: '2D',
    keyframes,
    duration,
  };
}

/**
 * Generates 3D-optimized animation profile
 */
function generate3DProfile(
  analysis: LogoAnalysis,
  currentSettings: AnimationSettings
): AnimationSettings {
  // Determine rotation speed based on complexity
  const rotationSpeed = analysis.complexity < 0.3 ? 2.5 : analysis.complexity < 0.6 ? 1.5 : 0.8;
  
  // Determine rotation axis based on aspect ratio
  let rotationAxis = { x: 0, y: 1, z: 0 };
  if (analysis.aspectRatio > 1.5) {
    rotationAxis = { x: 0.3, y: 0.7, z: 0 };
  } else if (analysis.aspectRatio < 0.7) {
    rotationAxis = { x: 0, y: 0.7, z: 0.3 };
  }
  
  // Enable glow for bright, colorful logos
  const glowEnabled = analysis.brightness > 0.5 && analysis.colorfulness > 0.3;
  const glowIntensity = Math.min(0.9, analysis.colorfulness * 1.2);
  
  // Enable particles for colorful logos
  const particleTrailEnabled = analysis.colorfulness > 0.4;
  
  // Shadow intensity based on brightness
  const shadowIntensity = analysis.brightness > 0.5 ? 0.7 : 0.3;
  
  // Generate 3D keyframes
  const duration = 5;
  const keyframes: Keyframe[] = [];
  
  // Starting keyframe
  keyframes.push({
    id: `kf-3d-auto-0`,
    timestamp: 0,
    settings: {
      rotationSpeed: rotationSpeed * 0.5,
      rotationAxis: { ...rotationAxis },
      scale: 0.5,
      enableRotation: true,
      positionX: 0,
      positionY: 0,
      positionZ: -2,
      opacity: 0,
      colorTint: '#ffffff',
      glowEnabled: false,
      glowIntensity: 0,
      particleTrailEnabled: false,
      shadowIntensity: 0,
    },
  });
  
  // Mid keyframe - full effect
  keyframes.push({
    id: `kf-3d-auto-1`,
    timestamp: duration * 0.4,
    settings: {
      rotationSpeed,
      rotationAxis: { ...rotationAxis },
      scale: 1.2,
      enableRotation: true,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      opacity: 1,
      colorTint: analysis.dominantColors[0] || '#ffffff',
      glowEnabled,
      glowIntensity,
      particleTrailEnabled,
      shadowIntensity,
    },
  });
  
  // Another variation
  keyframes.push({
    id: `kf-3d-auto-2`,
    timestamp: duration * 0.7,
    settings: {
      rotationSpeed: rotationSpeed * 1.5,
      rotationAxis: { x: rotationAxis.y, y: rotationAxis.x, z: rotationAxis.z },
      scale: 1,
      enableRotation: true,
      positionX: 0.5,
      positionY: 0,
      positionZ: 0,
      opacity: 1,
      colorTint: analysis.dominantColors[1] || analysis.dominantColors[0] || '#ffffff',
      glowEnabled,
      glowIntensity: glowIntensity * 0.8,
      particleTrailEnabled,
      shadowIntensity,
    },
  });
  
  // Ending keyframe
  keyframes.push({
    id: `kf-3d-auto-3`,
    timestamp: duration,
    settings: {
      rotationSpeed: rotationSpeed * 0.8,
      rotationAxis: { ...rotationAxis },
      scale: 1,
      enableRotation: true,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      opacity: 1,
      colorTint: '#ffffff',
      glowEnabled,
      glowIntensity: glowIntensity * 0.6,
      particleTrailEnabled,
      shadowIntensity,
    },
  });
  
  return {
    ...currentSettings,
    rotationSpeed,
    rotationAxis,
    enableRotation: true,
    scale: 1,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    opacity: 1,
    colorTint: '#ffffff',
    glowEnabled,
    glowIntensity,
    particleTrailEnabled,
    shadowIntensity,
    renderMode: '3D',
    keyframes,
    duration,
  };
}

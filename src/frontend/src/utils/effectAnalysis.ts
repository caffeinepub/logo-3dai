/**
 * Effect analysis utility that provides intelligent recommendations
 */

import { AnimationSettings } from '../hooks/useAnimationSettings';
import { LogoAnalysis } from './logoAnalysis';
import { SceneElement } from '../hooks/useSceneElements';
import { WorkflowMode } from '../App';

export interface EffectRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'animation' | 'effects' | 'camera' | 'scene';
  changes: Partial<AnimationSettings>;
}

/**
 * Analyzes current animation settings and provides recommendations
 */
export function analyzeEffects(
  settings: AnimationSettings,
  logoAnalysis: LogoAnalysis | null,
  sceneElements: SceneElement[],
  workflowMode: WorkflowMode = '3D'
): EffectRecommendation[] {
  if (workflowMode === '2D') {
    return analyze2DEffects(settings, logoAnalysis);
  }
  return analyze3DEffects(settings, logoAnalysis, sceneElements);
}

/**
 * Analyzes 2D workflow effects (NO ROTATION recommendations)
 */
function analyze2DEffects(
  settings: AnimationSettings,
  logoAnalysis: LogoAnalysis | null
): EffectRecommendation[] {
  const recommendations: EffectRecommendation[] = [];

  // Position recommendations
  if (settings.positionX === 0 && settings.positionY === 0) {
    recommendations.push({
      id: 'add-movement-2d',
      title: 'Add Movement',
      description: 'Add subtle position changes to create dynamic motion in your 2D animation',
      priority: 'medium',
      category: 'animation',
      changes: {
        keyframes: [
          {
            id: 'rec-kf-0',
            timestamp: 0,
            settings: {
              ...settings,
              positionX: -1,
              positionY: 0,
            },
          },
          {
            id: 'rec-kf-1',
            timestamp: settings.duration / 2,
            settings: {
              ...settings,
              positionX: 0,
              positionY: 0.5,
            },
          },
          {
            id: 'rec-kf-2',
            timestamp: settings.duration,
            settings: {
              ...settings,
              positionX: 1,
              positionY: 0,
            },
          },
        ],
      },
    });
  }

  // Scale animation
  if (settings.scale === 1 && settings.keyframes.length === 0) {
    recommendations.push({
      id: 'add-scale-animation',
      title: 'Add Scale Animation',
      description: 'Create a zoom effect by animating the scale over time',
      priority: 'medium',
      category: 'animation',
      changes: {
        keyframes: [
          {
            id: 'rec-scale-0',
            timestamp: 0,
            settings: {
              ...settings,
              scale: 0.5,
            },
          },
          {
            id: 'rec-scale-1',
            timestamp: settings.duration / 2,
            settings: {
              ...settings,
              scale: 1.2,
            },
          },
          {
            id: 'rec-scale-2',
            timestamp: settings.duration,
            settings: {
              ...settings,
              scale: 1,
            },
          },
        ],
      },
    });
  }

  // Glow effect for colorful logos
  if (logoAnalysis && logoAnalysis.colorfulness > 0.4 && !settings.glowEnabled) {
    recommendations.push({
      id: 'enable-glow-2d',
      title: 'Enable Glow Effect',
      description: 'Your colorful logo would benefit from a glow effect',
      priority: 'high',
      category: 'effects',
      changes: {
        glowEnabled: true,
        glowIntensity: Math.min(0.8, logoAnalysis.colorfulness),
      },
    });
  }

  // Particle trail
  if (logoAnalysis && logoAnalysis.colorfulness > 0.5 && !settings.particleTrailEnabled) {
    recommendations.push({
      id: 'enable-particles-2d',
      title: 'Add Particle Trail',
      description: 'Enhance your animation with a particle trail effect',
      priority: 'medium',
      category: 'effects',
      changes: {
        particleTrailEnabled: true,
      },
    });
  }

  // Fade in/out
  if (settings.opacity === 1 && settings.keyframes.length === 0) {
    recommendations.push({
      id: 'add-fade-2d',
      title: 'Add Fade Effect',
      description: 'Create a smooth entrance and exit with opacity animation',
      priority: 'low',
      category: 'animation',
      changes: {
        keyframes: [
          {
            id: 'rec-fade-0',
            timestamp: 0,
            settings: {
              ...settings,
              opacity: 0,
            },
          },
          {
            id: 'rec-fade-1',
            timestamp: settings.duration * 0.2,
            settings: {
              ...settings,
              opacity: 1,
            },
          },
          {
            id: 'rec-fade-2',
            timestamp: settings.duration * 0.8,
            settings: {
              ...settings,
              opacity: 1,
            },
          },
          {
            id: 'rec-fade-3',
            timestamp: settings.duration,
            settings: {
              ...settings,
              opacity: 0,
            },
          },
        ],
      },
    });
  }

  return recommendations;
}

/**
 * Analyzes 3D workflow effects
 */
function analyze3DEffects(
  settings: AnimationSettings,
  logoAnalysis: LogoAnalysis | null,
  sceneElements: SceneElement[]
): EffectRecommendation[] {
  const recommendations: EffectRecommendation[] = [];

  // Rotation recommendations
  if (!settings.enableRotation) {
    recommendations.push({
      id: 'enable-rotation',
      title: 'Enable Rotation',
      description: 'Add dynamic rotation to bring your 3D logo to life',
      priority: 'high',
      category: 'animation',
      changes: {
        enableRotation: true,
        rotationSpeed: 1.5,
      },
    });
  } else if (settings.rotationSpeed < 0.5) {
    recommendations.push({
      id: 'increase-rotation-speed',
      title: 'Increase Rotation Speed',
      description: 'Your rotation is quite slow. Consider increasing the speed for more impact',
      priority: 'medium',
      category: 'animation',
      changes: {
        rotationSpeed: 1.5,
      },
    });
  }

  // Multi-axis rotation
  const activeAxes = [settings.rotationAxis.x, settings.rotationAxis.y, settings.rotationAxis.z].filter(v => v > 0).length;
  if (settings.enableRotation && activeAxes === 1) {
    recommendations.push({
      id: 'multi-axis-rotation',
      title: 'Add Multi-Axis Rotation',
      description: 'Create more interesting movement by rotating on multiple axes',
      priority: 'medium',
      category: 'animation',
      changes: {
        rotationAxis: { x: 0.3, y: 0.7, z: 0.2 },
      },
    });
  }

  // Position depth
  if (settings.positionZ === 0 && settings.keyframes.length === 0) {
    recommendations.push({
      id: 'add-depth-movement',
      title: 'Add Depth Movement',
      description: 'Use Z-axis position to create depth and perspective in your animation',
      priority: 'high',
      category: 'animation',
      changes: {
        keyframes: [
          {
            id: 'rec-depth-0',
            timestamp: 0,
            settings: {
              ...settings,
              positionZ: -3,
            },
          },
          {
            id: 'rec-depth-1',
            timestamp: settings.duration / 2,
            settings: {
              ...settings,
              positionZ: 1,
            },
          },
          {
            id: 'rec-depth-2',
            timestamp: settings.duration,
            settings: {
              ...settings,
              positionZ: 0,
            },
          },
        ],
      },
    });
  }

  // Glow effect
  if (logoAnalysis && logoAnalysis.colorfulness > 0.4 && !settings.glowEnabled) {
    recommendations.push({
      id: 'enable-glow',
      title: 'Enable Glow Effect',
      description: 'Your colorful logo would benefit from a glow effect',
      priority: 'high',
      category: 'effects',
      changes: {
        glowEnabled: true,
        glowIntensity: Math.min(0.8, logoAnalysis.colorfulness),
      },
    });
  }

  // Particle trail
  if (logoAnalysis && logoAnalysis.colorfulness > 0.5 && !settings.particleTrailEnabled) {
    recommendations.push({
      id: 'enable-particles',
      title: 'Add Particle Trail',
      description: 'Enhance your animation with a particle trail effect',
      priority: 'medium',
      category: 'effects',
      changes: {
        particleTrailEnabled: true,
      },
    });
  }

  // Shadow intensity
  if (settings.shadowIntensity < 0.3) {
    recommendations.push({
      id: 'increase-shadows',
      title: 'Increase Shadow Intensity',
      description: 'Stronger shadows will add depth and realism to your 3D scene',
      priority: 'low',
      category: 'effects',
      changes: {
        shadowIntensity: 0.6,
      },
    });
  }

  // Scene elements
  if (sceneElements.length === 0) {
    recommendations.push({
      id: 'add-scene-elements',
      title: 'Add Scene Elements',
      description: 'Enhance your scene by adding 3D shapes like cubes, spheres, or planes',
      priority: 'low',
      category: 'scene',
      changes: {},
    });
  }

  return recommendations;
}

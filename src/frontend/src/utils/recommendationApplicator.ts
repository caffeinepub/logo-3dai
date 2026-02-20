/**
 * Utility to apply effect recommendations to animation settings
 */

import { AnimationSettings, Keyframe } from '../hooks/useAnimationSettings';
import { EffectRecommendation } from './effectAnalysis';

/**
 * Applies a recommendation to the current animation settings
 */
export function applyRecommendation(
  currentSettings: AnimationSettings,
  recommendation: EffectRecommendation
): AnimationSettings {
  const newSettings = { ...currentSettings };
  
  // Apply changes from recommendation
  Object.entries(recommendation.changes).forEach(([key, value]) => {
    if (key === 'rotationAxis' && typeof value === 'object') {
      newSettings.rotationAxis = { ...(value as { x: number; y: number; z: number }) };
    } else if (key === 'keyframes' && Array.isArray(value)) {
      // Replace keyframes with recommended ones
      newSettings.keyframes = value as Keyframe[];
    } else {
      // Direct property assignment
      (newSettings as any)[key] = value;
    }
  });
  
  return newSettings;
}

/**
 * Applies multiple recommendations at once
 */
export function applyMultipleRecommendations(
  currentSettings: AnimationSettings,
  recommendations: EffectRecommendation[]
): AnimationSettings {
  let newSettings = { ...currentSettings };
  
  recommendations.forEach((rec) => {
    newSettings = applyRecommendation(newSettings, rec);
  });
  
  return newSettings;
}

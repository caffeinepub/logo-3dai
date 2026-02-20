import { useState, useCallback } from 'react';
import * as THREE from 'three';

export interface CameraKeyframe {
  id: string;
  time: number; // in seconds
  position: [number, number, number];
  rotation: [number, number, number]; // pitch, yaw, roll in radians
  fov: number;
}

export type RecordingState = 'idle' | 'recording';

export interface CameraAnimationState {
  keyframes: CameraKeyframe[];
  recordingState: RecordingState;
  selectedKeyframeId: string | null;
}

export function useCameraAnimation() {
  const [state, setState] = useState<CameraAnimationState>({
    keyframes: [],
    recordingState: 'idle',
    selectedKeyframeId: null,
  });

  const startRecording = useCallback(() => {
    setState((prev) => ({ ...prev, recordingState: 'recording' }));
  }, []);

  const stopRecording = useCallback(() => {
    setState((prev) => ({ ...prev, recordingState: 'idle' }));
  }, []);

  const addKeyframe = useCallback((keyframe: Omit<CameraKeyframe, 'id'>) => {
    const newKeyframe: CameraKeyframe = {
      ...keyframe,
      id: `cam-kf-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      keyframes: [...prev.keyframes, newKeyframe].sort((a, b) => a.time - b.time),
    }));
    return newKeyframe.id;
  }, []);

  const updateKeyframe = useCallback((id: string, updates: Partial<Omit<CameraKeyframe, 'id'>>) => {
    setState((prev) => ({
      ...prev,
      keyframes: prev.keyframes.map((kf) =>
        kf.id === id ? { ...kf, ...updates } : kf
      ).sort((a, b) => a.time - b.time),
    }));
  }, []);

  const deleteKeyframe = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      keyframes: prev.keyframes.filter((kf) => kf.id !== id),
      selectedKeyframeId: prev.selectedKeyframeId === id ? null : prev.selectedKeyframeId,
    }));
  }, []);

  const clearPath = useCallback(() => {
    setState((prev) => ({
      ...prev,
      keyframes: [],
      selectedKeyframeId: null,
    }));
  }, []);

  const setSelectedKeyframeId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedKeyframeId: id }));
  }, []);

  const interpolateCameraState = useCallback((time: number): CameraKeyframe | null => {
    if (state.keyframes.length === 0) return null;
    if (state.keyframes.length === 1) return state.keyframes[0];

    // Find surrounding keyframes
    let prevKf: CameraKeyframe | null = null;
    let nextKf: CameraKeyframe | null = null;

    for (let i = 0; i < state.keyframes.length; i++) {
      if (state.keyframes[i].time <= time) {
        prevKf = state.keyframes[i];
      }
      if (state.keyframes[i].time >= time && !nextKf) {
        nextKf = state.keyframes[i];
        break;
      }
    }

    if (!prevKf) return state.keyframes[0];
    if (!nextKf) return state.keyframes[state.keyframes.length - 1];
    if (prevKf === nextKf) return prevKf;

    // Interpolate with easing
    const t = (time - prevKf.time) / (nextKf.time - prevKf.time);
    const easedT = easeInOutCubic(t);

    return {
      id: 'interpolated',
      time,
      position: [
        THREE.MathUtils.lerp(prevKf.position[0], nextKf.position[0], easedT),
        THREE.MathUtils.lerp(prevKf.position[1], nextKf.position[1], easedT),
        THREE.MathUtils.lerp(prevKf.position[2], nextKf.position[2], easedT),
      ],
      rotation: [
        THREE.MathUtils.lerp(prevKf.rotation[0], nextKf.rotation[0], easedT),
        THREE.MathUtils.lerp(prevKf.rotation[1], nextKf.rotation[1], easedT),
        THREE.MathUtils.lerp(prevKf.rotation[2], nextKf.rotation[2], easedT),
      ],
      fov: THREE.MathUtils.lerp(prevKf.fov, nextKf.fov, easedT),
    };
  }, [state.keyframes]);

  const applyPresetKeyframes = useCallback((keyframes: Omit<CameraKeyframe, 'id'>[]) => {
    setState((prev) => ({
      ...prev,
      keyframes: keyframes.map((kf, i) => ({
        ...kf,
        id: `cam-kf-preset-${Date.now()}-${i}`,
      })).sort((a, b) => a.time - b.time),
    }));
  }, []);

  return {
    keyframes: state.keyframes,
    recordingState: state.recordingState,
    selectedKeyframeId: state.selectedKeyframeId,
    startRecording,
    stopRecording,
    addKeyframe,
    updateKeyframe,
    deleteKeyframe,
    clearPath,
    setSelectedKeyframeId,
    interpolateCameraState,
    applyPresetKeyframes,
  };
}

// Easing function for smooth interpolation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

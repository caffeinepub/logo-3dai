import * as THREE from 'three';

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function lerpPosition(
  start: [number, number, number],
  end: [number, number, number],
  t: number
): [number, number, number] {
  const easedT = easeInOutCubic(t);
  return [
    THREE.MathUtils.lerp(start[0], end[0], easedT),
    THREE.MathUtils.lerp(start[1], end[1], easedT),
    THREE.MathUtils.lerp(start[2], end[2], easedT),
  ];
}

export function slerpRotation(
  start: [number, number, number],
  end: [number, number, number],
  t: number
): [number, number, number] {
  const easedT = easeInOutCubic(t);
  
  // Convert Euler angles to quaternions for proper rotation interpolation
  const startQuat = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(start[0], start[1], start[2])
  );
  const endQuat = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(end[0], end[1], end[2])
  );
  
  // Slerp between quaternions
  const resultQuat = new THREE.Quaternion().slerpQuaternions(startQuat, endQuat, easedT);
  
  // Convert back to Euler angles
  const resultEuler = new THREE.Euler().setFromQuaternion(resultQuat);
  return [resultEuler.x, resultEuler.y, resultEuler.z];
}

export function lerpFOV(start: number, end: number, t: number): number {
  const easedT = easeInOutCubic(t);
  return THREE.MathUtils.lerp(start, end, easedT);
}

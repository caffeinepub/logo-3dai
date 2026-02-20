import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, MeshStandardMaterial } from 'three';
import { AnimationSettings } from '../hooks/useAnimationSettings';
import { WorkflowMode } from '../App';

interface LogoModel3DProps {
  imageUrl: string;
  animationSettings: AnimationSettings;
  workflowMode: WorkflowMode;
}

export default function LogoModel3D({ imageUrl, animationSettings, workflowMode }: LogoModel3DProps) {
  const meshRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, imageUrl);

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: animationSettings.opacity,
      emissive: animationSettings.colorTint,
      emissiveIntensity: animationSettings.glowEnabled ? animationSettings.glowIntensity : 0,
    });
    return mat;
  }, [texture, animationSettings.opacity, animationSettings.colorTint, animationSettings.glowEnabled, animationSettings.glowIntensity]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // In 2D mode, do NOT apply any rotation
    if (workflowMode === '2D') {
      // Keep rotation at zero for 2D flat plane
      meshRef.current.rotation.set(0, 0, 0);
      return;
    }

    // 3D mode: apply rotation animation
    if (animationSettings.enableRotation) {
      const { x, y, z } = animationSettings.rotationAxis;
      const speed = animationSettings.rotationSpeed;
      
      meshRef.current.rotation.x += delta * speed * x;
      meshRef.current.rotation.y += delta * speed * y;
      meshRef.current.rotation.z += delta * speed * z;
    }
  });

  // Determine geometry based on workflow mode
  const geometry = workflowMode === '2D' ? (
    <planeGeometry args={[2, 2]} />
  ) : animationSettings.renderMode === '2D' ? (
    <planeGeometry args={[2, 2]} />
  ) : (
    <boxGeometry args={[2, 2, 0.2]} />
  );

  return (
    <mesh
      ref={meshRef}
      position={[
        animationSettings.positionX,
        animationSettings.positionY,
        animationSettings.positionZ,
      ]}
      scale={animationSettings.scale}
      castShadow={animationSettings.shadowIntensity > 0}
      receiveShadow
    >
      {geometry}
      <primitive object={material} attach="material" />
    </mesh>
  );
}

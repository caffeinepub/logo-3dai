/**
 * 3D mesh component for rendering scene elements
 */

import { useRef } from 'react';
import { Mesh } from 'three';
import { SceneElement } from '../hooks/useSceneElements';

interface SceneElement3DProps {
  element: SceneElement;
}

export default function SceneElement3D({ element }: SceneElement3DProps) {
  const meshRef = useRef<Mesh>(null);

  // Determine material properties based on type
  const getMaterialProps = () => {
    switch (element.material) {
      case 'metallic':
        return { metalness: 0.8, roughness: 0.2 };
      case 'glass':
        return { metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.6 };
      default:
        return { metalness: 0.2, roughness: 0.8 };
    }
  };

  const materialProps = getMaterialProps();

  return (
    <mesh
      ref={meshRef}
      position={element.position}
      scale={element.scale}
      rotation={element.rotation}
      castShadow
      receiveShadow
    >
      {element.type === 'cube' && <boxGeometry args={[1, 1, 1]} />}
      {element.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
      {element.type === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
      {element.type === 'plane' && <planeGeometry args={[2, 2]} />}
      
      <meshStandardMaterial
        color={element.color}
        {...materialProps}
      />
    </mesh>
  );
}

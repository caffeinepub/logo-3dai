import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import LogoModel3D from './LogoModel3D';
import SceneElement3D from './SceneElement3D';
import { AnimationSettings } from '../hooks/useAnimationSettings';
import { SceneElement } from '../hooks/useSceneElements';
import { CameraKeyframe } from '../hooks/useCameraAnimation';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { WorkflowMode } from '../App';

interface Preview3DProps {
  logoImageUrl: string;
  animationSettings: AnimationSettings;
  useTimelineAnimation?: boolean;
  sceneElements?: SceneElement[];
  cameraKeyframes?: CameraKeyframe[];
  currentCameraState?: { position: [number, number, number]; rotation: [number, number, number]; fov: number } | null;
  isRecording?: boolean;
  onCaptureKeyframe?: (position: [number, number, number], rotation: [number, number, number], fov: number) => void;
  workflowMode?: WorkflowMode;
}

export default function Preview3D({
  logoImageUrl,
  animationSettings,
  useTimelineAnimation = false,
  sceneElements = [],
  cameraKeyframes = [],
  currentCameraState = null,
  isRecording = false,
  onCaptureKeyframe,
  workflowMode = '3D',
}: Preview3DProps) {
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (currentCameraState && cameraRef.current) {
      const { position, rotation, fov } = currentCameraState;
      cameraRef.current.position.set(...position);
      cameraRef.current.rotation.set(...rotation);
      cameraRef.current.fov = fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [currentCameraState]);

  const handleCaptureClick = () => {
    if (cameraRef.current && onCaptureKeyframe) {
      const position: [number, number, number] = [
        cameraRef.current.position.x,
        cameraRef.current.position.y,
        cameraRef.current.position.z,
      ];
      const rotation: [number, number, number] = [
        cameraRef.current.rotation.x,
        cameraRef.current.rotation.y,
        cameraRef.current.rotation.z,
      ];
      const fov = cameraRef.current.fov;
      onCaptureKeyframe(position, rotation, fov);
    }
  };

  const cameraPathPoints = cameraKeyframes
    .sort((a, b) => a.time - b.time)
    .map((kf) => kf.position);

  const is2DMode = workflowMode === '2D';

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        className="bg-gradient-to-br from-background to-muted"
      >
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={is2DMode ? [0, 0, 5] : [0, 0, 5]}
          fov={50}
        />
        
        {!is2DMode && (
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            enabled={!currentCameraState}
          />
        )}

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />

        <LogoModel3D
          imageUrl={logoImageUrl}
          animationSettings={animationSettings}
          workflowMode={workflowMode}
        />

        {!is2DMode && sceneElements.map((element) => (
          <SceneElement3D key={element.id} element={element} />
        ))}

        {!is2DMode && cameraPathPoints.length > 1 && (
          <Line
            points={cameraPathPoints}
            color="teal"
            lineWidth={2}
            dashed={false}
          />
        )}
      </Canvas>

      {isRecording && onCaptureKeyframe && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={handleCaptureClick}
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-2xl shadow-lg"
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture Keyframe
          </Button>
        </div>
      )}
    </div>
  );
}

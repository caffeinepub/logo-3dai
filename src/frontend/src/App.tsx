import { useState } from 'react';
import AppLayout from './components/AppLayout';
import WorkflowSelector from './components/WorkflowSelector';
import LogoUploader from './components/LogoUploader';
import Preview3D from './components/Preview3D';
import AnimationControls from './components/AnimationControls';
import AnimationControls2D from './components/AnimationControls2D';
import EffectsControls from './components/EffectsControls';
import Timeline from './components/Timeline';
import KeyframeEditor from './components/KeyframeEditor';
import CameraControls from './components/CameraControls';
import CameraKeyframeEditor from './components/CameraKeyframeEditor';
import ExportControls from './components/ExportControls';
import MusicLibrary from './components/MusicLibrary';
import AudioUploader from './components/AudioUploader';
import SoundEffectsPanel from './components/SoundEffectsPanel';
import AutoEffectButton from './components/AutoEffectButton';
import ElementInserter from './components/ElementInserter';
import ElementControls from './components/ElementControls';
import EffectAnalysisPanel from './components/EffectAnalysisPanel';
import CollapsibleControlPanel from './components/CollapsibleControlPanel';
import { AnimationSettings, Keyframe, defaultAnimationSettings } from './hooks/useAnimationSettings';
import { useTimelinePlayback } from './hooks/useTimelinePlayback';
import { useAudioManager } from './hooks/useAudioManager';
import { useSceneElements } from './hooks/useSceneElements';
import { useCameraAnimation, CameraKeyframe } from './hooks/useCameraAnimation';
import { LogoAnalysis } from './utils/logoAnalysis';
import { generateOrbitPreset, generateDollyZoomPreset, generateFlyThroughPreset, generateTrackingShotPreset } from './utils/cameraPresets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';

export type WorkflowStep = 'workflow-select' | 'upload' | 'preview' | 'export';
export type WorkflowMode = '2D' | '3D';

function App() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('workflow-select');
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('3D');
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>(defaultAnimationSettings);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
  const [logoAnalysis, setLogoAnalysis] = useState<LogoAnalysis | null>(null);

  const { isPlaying, currentTime, play, pause, seek, reset, interpolatedSettings } = 
    useTimelinePlayback(animationSettings);

  const {
    selectedMusicTrack,
    customAudioUrl,
    soundEffects,
    selectMusicTrack,
    selectCustomAudio,
    toggleSoundEffect,
    playPreview,
    stopPreview,
    getSelectedAudioUrl,
  } = useAudioManager();

  const {
    elements: sceneElements,
    selectedElement,
    selectedElementId,
    addElement,
    updateElement,
    removeElement,
    setSelectedElementId,
  } = useSceneElements();

  const {
    keyframes: cameraKeyframes,
    recordingState,
    selectedKeyframeId: selectedCameraKeyframeId,
    startRecording,
    stopRecording,
    addKeyframe: addCameraKeyframe,
    updateKeyframe: updateCameraKeyframe,
    deleteKeyframe: deleteCameraKeyframe,
    clearPath: clearCameraPath,
    setSelectedKeyframeId: setSelectedCameraKeyframeId,
    interpolateCameraState,
    applyPresetKeyframes,
  } = useCameraAnimation();

  const handleWorkflowSelected = (mode: WorkflowMode) => {
    setWorkflowMode(mode);
    setAnimationSettings({
      ...defaultAnimationSettings,
      renderMode: mode,
    });
    setCurrentStep('upload');
  };

  const handleLogoUploaded = (imageUrl: string) => {
    setLogoImageUrl(imageUrl);
    setCurrentStep('preview');
  };

  const handleStartOver = () => {
    setLogoImageUrl(null);
    setCurrentStep('workflow-select');
    setWorkflowMode('3D');
    setAnimationSettings(defaultAnimationSettings);
    setSelectedKeyframeId(null);
    setSelectedCameraKeyframeId(null);
    setLogoAnalysis(null);
    stopPreview();
    clearCameraPath();
  };

  const handleAddKeyframe = (timestamp: number) => {
    const newKeyframe: Keyframe = {
      id: `kf-${Date.now()}`,
      timestamp,
      settings: {
        rotationSpeed: animationSettings.rotationSpeed,
        rotationAxis: { ...animationSettings.rotationAxis },
        scale: animationSettings.scale,
        enableRotation: animationSettings.enableRotation,
        positionX: animationSettings.positionX,
        positionY: animationSettings.positionY,
        positionZ: animationSettings.positionZ,
        opacity: animationSettings.opacity,
        colorTint: animationSettings.colorTint,
        glowEnabled: animationSettings.glowEnabled,
        glowIntensity: animationSettings.glowIntensity,
        particleTrailEnabled: animationSettings.particleTrailEnabled,
        shadowIntensity: animationSettings.shadowIntensity,
      },
    };

    setAnimationSettings({
      ...animationSettings,
      keyframes: [...animationSettings.keyframes, newKeyframe],
    });
    setSelectedKeyframeId(newKeyframe.id);
    setSelectedCameraKeyframeId(null);
  };

  const handleUpdateKeyframe = (updatedKeyframe: Keyframe) => {
    setAnimationSettings({
      ...animationSettings,
      keyframes: animationSettings.keyframes.map((kf) =>
        kf.id === updatedKeyframe.id ? updatedKeyframe : kf
      ),
    });
  };

  const handleDeleteKeyframe = (keyframeId: string) => {
    setAnimationSettings({
      ...animationSettings,
      keyframes: animationSettings.keyframes.filter((kf) => kf.id !== keyframeId),
    });
    setSelectedKeyframeId(null);
  };

  const handleAutoEffectsGenerated = (settings: AnimationSettings, analysis: LogoAnalysis) => {
    setAnimationSettings(settings);
    setLogoAnalysis(analysis);
  };

  const handleAddCameraKeyframe = (timestamp: number) => {
    addCameraKeyframe({
      time: timestamp,
      position: [0, 0, 5],
      rotation: [0, 0, 0],
      fov: 50,
    });
    setSelectedKeyframeId(null);
  };

  const handleCaptureKeyframe = (position: [number, number, number], rotation: [number, number, number], fov: number) => {
    addCameraKeyframe({
      time: currentTime,
      position,
      rotation,
      fov,
    });
  };

  const handleApplyPreset = (preset: string, options: { radius: number; speed: number; direction: 'clockwise' | 'counterclockwise' }) => {
    const presetOptions = {
      duration: animationSettings.duration,
      radius: options.radius,
      speed: options.speed,
      direction: options.direction,
      logoPosition: [animationSettings.positionX, animationSettings.positionY, animationSettings.positionZ] as [number, number, number],
    };

    let keyframes;
    switch (preset) {
      case 'orbit':
        keyframes = generateOrbitPreset(presetOptions);
        break;
      case 'dollyZoom':
        keyframes = generateDollyZoomPreset(presetOptions);
        break;
      case 'flyThrough':
        keyframes = generateFlyThroughPreset(presetOptions);
        break;
      case 'tracking':
        keyframes = generateTrackingShotPreset(presetOptions);
        break;
      default:
        return;
    }

    applyPresetKeyframes(keyframes);
  };

  const handleUpdateCameraKeyframe = (keyframe: CameraKeyframe) => {
    updateCameraKeyframe(keyframe.id, {
      time: keyframe.time,
      position: keyframe.position,
      rotation: keyframe.rotation,
      fov: keyframe.fov,
    });
  };

  const selectedKeyframe = animationSettings.keyframes.find(
    (kf) => kf.id === selectedKeyframeId
  );

  const selectedCameraKeyframe = cameraKeyframes.find(
    (kf) => kf.id === selectedCameraKeyframeId
  );

  // Use interpolated settings when timeline has keyframes and is playing
  const displaySettings = animationSettings.keyframes.length > 0 && isPlaying
    ? interpolatedSettings
    : animationSettings;

  // Get current camera state for animation
  const currentCameraState = isPlaying ? interpolateCameraState(currentTime) : null;

  return (
    <AppLayout>
      <Toaster />
      <div className="flex flex-col h-full">
        {currentStep === 'workflow-select' && (
          <WorkflowSelector onSelectWorkflow={handleWorkflowSelected} />
        )}

        {currentStep === 'upload' && (
          <LogoUploader 
            onLogoUploaded={handleLogoUploaded}
            workflowMode={workflowMode}
          />
        )}

        {(currentStep === 'preview' || currentStep === 'export') && logoImageUrl && (
          <div className="flex flex-col h-full overflow-hidden relative">
            {/* Fixed Preview Viewport at Top */}
            <div className="fixed top-0 left-0 right-0 z-20 bg-background border-b-2 border-border shadow-lg">
              <div className="h-[50vh] min-h-[400px]">
                <Preview3D 
                  logoImageUrl={logoImageUrl} 
                  animationSettings={displaySettings}
                  useTimelineAnimation={animationSettings.keyframes.length > 0}
                  sceneElements={sceneElements}
                  cameraKeyframes={cameraKeyframes}
                  currentCameraState={currentCameraState}
                  isRecording={recordingState === 'recording'}
                  onCaptureKeyframe={handleCaptureKeyframe}
                  workflowMode={workflowMode}
                />
              </div>
            </div>

            {/* Scrollable Controls Area Below - with top padding to account for fixed viewport */}
            <div className="flex-1 overflow-y-auto pt-[50vh] min-pt-[400px]">
              <div className="container mx-auto px-4 py-6 space-y-4 max-w-7xl">
                {/* Workflow Mode Badge and Auto-Generate Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-2xl w-fit">
                    <div className={`w-3 h-3 rounded-full ${workflowMode === '2D' ? 'bg-coral-500' : 'bg-teal-500'}`} />
                    <span className="text-sm font-semibold text-foreground">
                      {workflowMode} Animation Mode
                    </span>
                  </div>
                  
                  {/* Auto-Generate Button */}
                  {logoImageUrl && !selectedKeyframe && !selectedCameraKeyframe && !selectedElement && (
                    <AutoEffectButton
                      logoUrl={logoImageUrl}
                      currentSettings={animationSettings}
                      onSettingsGenerated={handleAutoEffectsGenerated}
                      workflowMode={workflowMode}
                    />
                  )}
                </div>

                {/* Keyframe/Element Editors */}
                {selectedKeyframe ? (
                  <KeyframeEditor
                    keyframe={selectedKeyframe}
                    onChange={handleUpdateKeyframe}
                    onDelete={() => handleDeleteKeyframe(selectedKeyframe.id)}
                  />
                ) : selectedCameraKeyframe ? (
                  <CameraKeyframeEditor
                    keyframe={selectedCameraKeyframe}
                    onChange={handleUpdateCameraKeyframe}
                    onDelete={() => deleteCameraKeyframe(selectedCameraKeyframe.id)}
                  />
                ) : selectedElement ? (
                  <ElementControls
                    element={selectedElement}
                    onUpdate={updateElement}
                  />
                ) : (
                  <div className="space-y-3">
                    {/* Animation & Effects Panel */}
                    <CollapsibleControlPanel title="Animation & Effects" defaultOpen={true}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {workflowMode === '2D' ? (
                          <AnimationControls2D
                            settings={animationSettings}
                            onSettingsChange={setAnimationSettings}
                          />
                        ) : (
                          <AnimationControls
                            settings={animationSettings}
                            onSettingsChange={setAnimationSettings}
                          />
                        )}
                        <EffectsControls
                          settings={animationSettings}
                          onSettingsChange={setAnimationSettings}
                        />
                      </div>
                    </CollapsibleControlPanel>

                    {/* Camera & Scene Panel (3D only) */}
                    {workflowMode === '3D' && (
                      <CollapsibleControlPanel title="Camera & Scene" defaultOpen={false}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <CameraControls
                            recordingState={recordingState}
                            keyframeCount={cameraKeyframes.length}
                            onStartRecording={startRecording}
                            onStopRecording={stopRecording}
                            onClearPath={clearCameraPath}
                            onApplyPreset={handleApplyPreset}
                          />
                          <ElementInserter
                            elements={sceneElements}
                            selectedElementId={selectedElementId}
                            onAddElement={addElement}
                            onSelectElement={setSelectedElementId}
                            onRemoveElement={removeElement}
                          />
                        </div>
                      </CollapsibleControlPanel>
                    )}

                    {/* Audio & Music Panel */}
                    <CollapsibleControlPanel title="Audio & Music" defaultOpen={false}>
                      <Tabs defaultValue="music" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-muted rounded-2xl p-1">
                          <TabsTrigger value="music" className="rounded-xl">Music</TabsTrigger>
                          <TabsTrigger value="effects" className="rounded-xl">Sound FX</TabsTrigger>
                        </TabsList>
                        <TabsContent value="music" className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <MusicLibrary
                              selectedTrack={selectedMusicTrack}
                              onSelectTrack={selectMusicTrack}
                              onPlayPreview={playPreview}
                              onStopPreview={stopPreview}
                            />
                            <AudioUploader
                              onAudioUploaded={selectCustomAudio}
                              onPlayPreview={playPreview}
                              onStopPreview={stopPreview}
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="effects" className="mt-4">
                          <SoundEffectsPanel
                            soundEffects={soundEffects}
                            onToggleSoundEffect={toggleSoundEffect}
                          />
                        </TabsContent>
                      </Tabs>
                    </CollapsibleControlPanel>

                    {/* AI Analysis & Recommendations Panel */}
                    <CollapsibleControlPanel title="AI Analysis & Recommendations" defaultOpen={false}>
                      <EffectAnalysisPanel
                        animationSettings={animationSettings}
                        logoAnalysis={logoAnalysis}
                        sceneElements={sceneElements}
                        onApplyRecommendations={setAnimationSettings}
                        workflowMode={workflowMode}
                      />
                    </CollapsibleControlPanel>
                  </div>
                )}

                {/* Timeline */}
                <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t-2 border-border -mx-4 px-4 z-10">
                  <Timeline
                    keyframes={animationSettings.keyframes}
                    cameraKeyframes={cameraKeyframes}
                    currentTime={currentTime}
                    duration={animationSettings.duration}
                    isPlaying={isPlaying}
                    selectedKeyframeId={selectedKeyframeId}
                    selectedCameraKeyframeId={selectedCameraKeyframeId}
                    onAddKeyframe={handleAddKeyframe}
                    onAddCameraKeyframe={handleAddCameraKeyframe}
                    onSelectKeyframe={setSelectedKeyframeId}
                    onSelectCameraKeyframe={setSelectedCameraKeyframeId}
                    onSeek={seek}
                    onPlay={play}
                    onPause={pause}
                    onReset={reset}
                  />
                  
                  <div className="mt-4">
                    <ExportControls
                      logoImageUrl={logoImageUrl}
                      animationSettings={animationSettings}
                      onStartOver={handleStartOver}
                      audioUrl={getSelectedAudioUrl()}
                      soundEffects={soundEffects}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default App;

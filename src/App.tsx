import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ParticleState, MemoryPhoto, AppSettings, GestureType } from './types';
import { INITIAL_PHOTOS } from './utils/presetPhotos';
import { THEME_PRESETS } from './utils/themes';
import { ThreeCanvas, ThreeCanvasRef } from './components/ThreeCanvas';
import { GestureDetector } from './components/GestureDetector';
import { ControlOverlay } from './components/ControlOverlay';
import { PhotoManagerModal } from './components/PhotoManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { GreetingCardModal } from './components/GreetingCardModal';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [particleState, setParticleState] = useState<ParticleState>('TREE');
  const [photos, setPhotos] = useState<MemoryPhoto[]>(INITIAL_PHOTOS);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | undefined>(undefined);

  // Hand gesture state from AI Camera
  const [handX, setHandX] = useState<number>(0.5);
  const [isHandActive, setIsHandActive] = useState<boolean>(false);

  // Modal visibility states
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGreetingCardOpen, setIsGreetingCardOpen] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  // App Settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'classic_gold_red',
    customTreeText: 'MERRY CHRISTMAS',
    customHeartText: 'I LOVE YOU ❤️',
    snowfallEnabled: true,
    particleQuality: 'medium',
    autoRotate: true,
    soundEnabled: true,
    musicTrack: 'jingle_bells',
    musicVolume: 0.8,
    sfxVolume: 0.8
  });

  const canvasRef = useRef<ThreeCanvasRef>(null);

  // Transition state (optional sound on manual UI click)
  const changeParticleState = useCallback((newState: ParticleState, playSound: boolean = false) => {
    setParticleState(newState);
    if (playSound && settings.soundEnabled) {
      if (newState === 'TREE') audioEngine.playSFX('tree');
      else if (newState === 'EXPLODE') audioEngine.playSFX('explode');
      else if (newState === 'HEART') audioEngine.playSFX('heart');
      else if (newState === 'PHOTO') audioEngine.playSFX('photo');
    }
  }, [settings.soundEnabled]);

  const handleStart = () => {
    setIsStarted(true);
    setIsPlayingMusic(true);
    audioEngine.startMusic(settings.musicTrack as any, customAudioUrl);
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      audioEngine.stopMusic();
      setIsPlayingMusic(false);
    } else {
      audioEngine.startMusic(settings.musicTrack as any, customAudioUrl);
      setIsPlayingMusic(true);
    }
  };

  // Process Gestures from MediaPipe - completely silent without SFX sound
  const handleGestureDetected = useCallback((gesture: GestureType, newHandX: number) => {
    if (gesture === 'NONE') {
      setIsHandActive(false);
      return;
    }

    setIsHandActive(true);
    setHandX(newHandX);

    if (gesture === 'HEART' && particleState !== 'HEART') {
      setParticleState('HEART');
    } else if (gesture === 'OPEN' && particleState !== 'EXPLODE') {
      setParticleState('EXPLODE');
    } else if (gesture === 'FIST' && particleState !== 'TREE') {
      setParticleState('TREE');
    } else if (gesture === 'PINCH' && particleState !== 'PHOTO') {
      setParticleState('PHOTO');
    }
  }, [particleState]);

  const handleOpenGreetingCard = () => {
    if (canvasRef.current) {
      const snap = canvasRef.current.captureSnapshot();
      setSnapshotUrl(snap);
    }
    setIsGreetingCardOpen(true);
  };

  const currentTheme = THEME_PRESETS.find(t => t.id === settings.theme) || THEME_PRESETS[0];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans"
      style={{
        background: currentTheme.bgGlow
      }}
    >
      {/* 3D Three.js Canvas */}
      <ThreeCanvas
        ref={canvasRef}
        state={particleState}
        setState={changeParticleState}
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        setSelectedPhotoIndex={setSelectedPhotoIndex}
        settings={settings}
        handX={handX}
        isHandActive={isHandActive}
      />

      {/* MediaPipe Hands AI Camera Tracker */}
      {isStarted && (
        <GestureDetector
          isCameraActive={isCameraActive}
          onGestureDetected={handleGestureDetected}
          currentState={particleState}
        />
      )}

      {/* Main UI Overlay & HUD */}
      <ControlOverlay
        state={particleState}
        setState={changeParticleState}
        isStarted={isStarted}
        onStart={handleStart}
        isCameraActive={isCameraActive}
        setIsCameraActive={setIsCameraActive}
        isPlayingMusic={isPlayingMusic}
        toggleMusic={toggleMusic}
        openSettings={() => setIsSettingsOpen(true)}
        openPhotoManager={() => setIsPhotoManagerOpen(true)}
        openGreetingCard={handleOpenGreetingCard}
        resetView={() => canvasRef.current?.resetCamera()}
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
      />

      {/* Photo Manager Modal */}
      <PhotoManagerModal
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        photos={photos}
        setPhotos={setPhotos}
        onSelectPhoto={(idx) => {
          setSelectedPhotoIndex(idx);
          changeParticleState('PHOTO');
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
        onCustomAudioUpload={(url) => {
          setCustomAudioUrl(url);
          audioEngine.startMusic('custom', url);
          setIsPlayingMusic(true);
        }}
      />

      {/* Holiday Greeting Card & Snapshot Export Modal */}
      <GreetingCardModal
        isOpen={isGreetingCardOpen}
        onClose={() => setIsGreetingCardOpen(false)}
        snapshotUrl={snapshotUrl}
      />
    </div>
  );
}

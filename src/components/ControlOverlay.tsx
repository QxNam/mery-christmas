import React from 'react';
import { ParticleState, MemoryPhoto } from '../types';
import {
  TreePine,
  Sparkles,
  Heart,
  Image as ImageIcon,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  Images,
  Share2,
  RotateCcw
} from 'lucide-react';

interface Props {
  state: ParticleState;
  setState: (s: ParticleState) => void;
  isStarted: boolean;
  onStart: () => void;
  isCameraActive: boolean;
  setIsCameraActive: (active: boolean) => void;
  isPlayingMusic: boolean;
  toggleMusic: () => void;
  openSettings: () => void;
  openPhotoManager: () => void;
  openGreetingCard: () => void;
  resetView: () => void;
  photos: MemoryPhoto[];
  selectedPhotoIndex: number;
}

export const ControlOverlay: React.FC<Props> = ({
  state,
  setState,
  isStarted,
  onStart,
  isCameraActive,
  setIsCameraActive,
  isPlayingMusic,
  toggleMusic,
  openSettings,
  openPhotoManager,
  openGreetingCard,
  resetView,
  photos,
  selectedPhotoIndex
}) => {
  if (!isStarted) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center select-none">
        <div className="max-w-md w-full bg-gradient-to-b from-neutral-900/90 to-black/90 border border-amber-500/40 rounded-3xl p-8 shadow-2xl shadow-red-900/40 flex flex-col items-center text-white">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-5">
            <TreePine className="w-9 h-9 text-white animate-bounce" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-red-400 bg-clip-text text-transparent mb-3">
            Magic Christmas 3D
          </h1>

          <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
            Experience an interactive 3D particle Christmas tree with hand gestures, music, memory carousel, and festive holiday magic on both Laptop & Mobile!
          </p>

          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 text-left space-y-2.5 text-xs text-neutral-300">
            <div className="font-semibold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Interactive Controls:
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-md border border-amber-500/30">✊ Fist</span>
              <span>Spiral 3D Christmas Tree</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-500/20 text-red-300 font-mono px-2 py-0.5 rounded-md border border-red-500/30">🖐 Open Hand</span>
              <span>Explode into Memory Carousel</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-pink-500/20 text-pink-300 font-mono px-2 py-0.5 rounded-md border border-pink-500/30">🫶 2 Hands</span>
              <span>Heart & Love Message</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-md border border-cyan-500/30">👆 Drag / Tap</span>
              <span>Full Touch & Mouse Control Supported</span>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 px-8 rounded-2xl font-black text-lg tracking-wider text-white bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 border-2 border-amber-300 shadow-xl shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            START MAGIC ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Header / Mode Switcher */}
      <header className="fixed top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Branding & Quick Reset */}
        <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-2xl shadow-lg">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-red-600 to-amber-400 flex items-center justify-center shadow-sm">
            <TreePine className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold bg-gradient-to-r from-amber-200 to-red-300 bg-clip-text text-transparent">
              Magic Christmas
            </div>
            <div className="text-[10px] text-white/50 hidden sm:block">
              © by qxnam & React 3D
            </div>
          </div>
          <button
            onClick={resetView}
            title="Reset 3D View"
            className="ml-1 p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Quick Mode Switch Buttons (Desktop & Tablet) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/15 p-1 rounded-2xl shadow-xl">
          <button
            onClick={() => setState('TREE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              state === 'TREE'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-900/50 scale-105'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Tree</span>
          </button>

          <button
            onClick={() => setState('EXPLODE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              state === 'EXPLODE'
                ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-md shadow-amber-900/50 scale-105'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Carousel</span>
          </button>

          <button
            onClick={() => setState('HEART')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              state === 'HEART'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-rose-900/50 scale-105'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Love Heart</span>
          </button>

          <button
            onClick={() => setState('PHOTO')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              state === 'PHOTO'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-blue-900/50 scale-105'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo Zoom</span>
          </button>
        </div>
      </header>

      {/* Center Top Gesture Guide Prompt */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 text-xs shadow-xl">
          <span>🖐 <b>Open:</b> Explode Carousel</span>
          <span className="text-white/30">|</span>
          <span>🫶 <b>Heart:</b> Love</span>
          <span className="text-white/30">|</span>
          <span>✊ <b>Fist:</b> Tree</span>
          <span className="text-white/30">|</span>
          <span>🤏 <b>Pinch:</b> Zoom</span>
        </div>
      </div>

      {/* Selected Photo Caption Toast (when in EXPLODE or PHOTO) */}
      {(state === 'EXPLODE' || state === 'PHOTO') && photos[selectedPhotoIndex] && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 text-center animate-fade-in">
          <div className="bg-black/75 backdrop-blur-md border border-amber-500/40 px-4 py-1.5 rounded-2xl shadow-xl text-xs text-amber-200">
            Memory #{selectedPhotoIndex + 1}: <b className="text-white">{photos[selectedPhotoIndex].caption}</b>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Dock */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-neutral-950/80 backdrop-blur-xl border border-white/15 p-2 rounded-2xl sm:rounded-full shadow-2xl max-w-[95vw] overflow-x-auto">
        {/* Mobile Quick Mode Selector */}
        <div className="flex md:hidden items-center gap-1 pr-2 border-r border-white/10">
          <button
            onClick={() => setState('TREE')}
            className={`p-2 rounded-full transition-all ${
              state === 'TREE' ? 'bg-emerald-600 text-white' : 'text-white/70 hover:bg-white/10'
            }`}
            title="Tree Mode"
          >
            <TreePine className="w-4 h-4" />
          </button>
          <button
            onClick={() => setState('EXPLODE')}
            className={`p-2 rounded-full transition-all ${
              state === 'EXPLODE' ? 'bg-amber-600 text-white' : 'text-white/70 hover:bg-white/10'
            }`}
            title="Explode Carousel"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setState('HEART')}
            className={`p-2 rounded-full transition-all ${
              state === 'HEART' ? 'bg-rose-600 text-white' : 'text-white/70 hover:bg-white/10'
            }`}
            title="Heart Mode"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setState('PHOTO')}
            className={`p-2 rounded-full transition-all ${
              state === 'PHOTO' ? 'bg-cyan-600 text-white' : 'text-white/70 hover:bg-white/10'
            }`}
            title="Photo Mode"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Camera AI Gesture Toggle */}
        <button
          onClick={() => setIsCameraActive(!isCameraActive)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isCameraActive
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40 font-bold'
              : 'text-white/80 hover:bg-white/10 border border-white/10'
          }`}
          title="Toggle AI Camera Gesture Recognition"
        >
          {isCameraActive ? <Camera className="w-4 h-4 text-black" /> : <CameraOff className="w-4 h-4" />}
          <span className="hidden sm:inline">{isCameraActive ? 'Cam ON' : 'Cam OFF'}</span>
        </button>

        {/* Music Sound Toggle */}
        <button
          onClick={toggleMusic}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isPlayingMusic
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
              : 'text-white/80 hover:bg-white/10 border border-white/10'
          }`}
          title="Toggle Holiday Music"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{isPlayingMusic ? 'Music ON' : 'Muted'}</span>
        </button>

        {/* Manage Photos Button */}
        <button
          onClick={openPhotoManager}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-white/90 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          title="Upload & Manage Photos"
        >
          <Images className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Photos ({photos.length})</span>
        </button>

        {/* Create Card / Snapshot Button */}
        <button
          onClick={openGreetingCard}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 shadow-md shadow-red-900/40 transition-transform active:scale-95 cursor-pointer"
          title="Capture Card Snapshot"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Greeting Card</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={openSettings}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="Visual & Sound Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </nav>
    </>
  );
};

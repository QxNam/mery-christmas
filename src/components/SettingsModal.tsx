import React, { useRef } from 'react';
import { AppSettings } from '../types';
import { THEME_PRESETS } from '../utils/themes';
import {
  X,
  Palette,
  Type,
  Music,
  Snowflake,
  Sliders,
  Sparkles,
  Volume2,
  Upload
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onCustomAudioUpload: (url: string) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  onCustomAudioUpload
}) => {
  const audioInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onCustomAudioUpload(url);
      setSettings(prev => ({ ...prev, musicTrack: 'custom' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-950 border border-white/20 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Experience & Visual Settings</h2>
              <p className="text-xs text-white/50">Personalize themes, 3D text, music, and performance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 1. Theme Selection */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300 mb-3">
              <Palette className="w-4 h-4" />
              <span>3D Color Theme</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_PRESETS.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    settings.theme === theme.id
                      ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400'
                      : 'border-white/10 bg-neutral-900/60 hover:bg-neutral-900'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-tr ${theme.accentClass} shadow-md shrink-0`}
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white">{theme.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Custom 3D Billboard Text */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <Type className="w-4 h-4" />
              <span>Custom 3D Billboard Messages</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-white/70 mb-1 block">Tree Banner Text (Default: MERRY CHRISTMAS)</label>
                <input
                  type="text"
                  value={settings.customTreeText}
                  onChange={e => setSettings(prev => ({ ...prev, customTreeText: e.target.value }))}
                  placeholder="MERRY CHRISTMAS"
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-white/70 mb-1 block">Heart Mode Message (Default: I LOVE YOU ❤️)</label>
                <input
                  type="text"
                  value={settings.customHeartText}
                  onChange={e => setSettings(prev => ({ ...prev, customHeartText: e.target.value }))}
                  placeholder="I LOVE YOU ❤️"
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>

          {/* 3. Audio & Music Selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <Music className="w-4 h-4" />
              <span>Holiday Music & Volume</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => {
                  setSettings(prev => ({ ...prev, musicTrack: 'jingle_bells' }));
                  audioEngine.startMusic('jingle_bells');
                }}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  settings.musicTrack === 'jingle_bells'
                    ? 'border-red-500 bg-red-500/20 text-white'
                    : 'border-white/10 bg-neutral-900 text-white/70 hover:text-white'
                }`}
              >
                🔔 Jingle Bells
              </button>

              <button
                onClick={() => {
                  setSettings(prev => ({ ...prev, musicTrack: 'silent_night' }));
                  audioEngine.startMusic('silent_night');
                }}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  settings.musicTrack === 'silent_night'
                    ? 'border-red-500 bg-red-500/20 text-white'
                    : 'border-white/10 bg-neutral-900 text-white/70 hover:text-white'
                }`}
              >
                ✨ Silent Night
              </button>

              <button
                onClick={() => audioInputRef.current?.click()}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all flex items-center justify-center gap-1 ${
                  settings.musicTrack === 'custom'
                    ? 'border-red-500 bg-red-500/20 text-white'
                    : 'border-white/10 bg-neutral-900 text-white/70 hover:text-white'
                }`}
              >
                <Upload className="w-3 h-3" /> Custom MP3
              </button>
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioFile}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Volume2 className="w-4 h-4 text-white/60" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={e => {
                  const vol = parseFloat(e.target.value);
                  setSettings(prev => ({ ...prev, musicVolume: vol }));
                  audioEngine.setVolume(vol);
                }}
                className="w-full accent-amber-400"
              />
              <span className="text-xs text-white/60 w-8">
                {Math.round(settings.musicVolume * 100)}%
              </span>
            </div>
          </div>

          {/* 4. Particle Quality & Falling Snow */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Visual Effects & Performance</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <Snowflake className="w-4 h-4 text-cyan-300" />
                <span>3D Snowfall Animation</span>
              </div>
              <input
                type="checkbox"
                checked={settings.snowfallEnabled}
                onChange={e => setSettings(prev => ({ ...prev, snowfallEnabled: e.target.checked }))}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-2xl border border-white/10">
              <div className="text-xs">
                <div className="font-semibold text-white">Particle Quality Density</div>
                <div className="text-[11px] text-white/50">Low for smooth mobile performance, High for PCs</div>
              </div>
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => setSettings(prev => ({ ...prev, particleQuality: q }))}
                    className={`px-2.5 py-1 text-xs rounded-lg uppercase font-bold transition-all ${
                      settings.particleQuality === q
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-white/10 bg-neutral-900/50">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-transform active:scale-95 cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export type ParticleState = 'TREE' | 'EXPLODE' | 'HEART' | 'PHOTO';

export interface ThemeOption {
  id: string;
  name: string;
  goldHex: number;
  redHex: number;
  giftHex: number;
  bgGlow: string;
  accentClass: string;
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
}

export type GestureType = 'OPEN' | 'FIST' | 'HEART' | 'PINCH' | 'NONE';

export interface AppSettings {
  theme: string;
  customTreeText: string;
  customHeartText: string;
  snowfallEnabled: boolean;
  particleQuality: 'low' | 'medium' | 'high';
  autoRotate: boolean;
  soundEnabled: boolean;
  musicTrack: string;
  musicVolume: number;
  sfxVolume: number;
}

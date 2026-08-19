import { ThemeOption } from '../types';

export const THEME_PRESETS: ThemeOption[] = [
  {
    id: 'classic_gold_red',
    name: 'Classic Gold & Ruby',
    goldHex: 0xFFD700,
    redHex: 0xEF4444,
    giftHex: 0xFFFFFF,
    bgGlow: 'radial-gradient(ellipse at center, #2e0811 0%, #080306 100%)',
    accentClass: 'from-amber-400 to-red-600'
  },
  {
    id: 'emerald_starlight',
    name: 'Emerald Evergreen',
    goldHex: 0x34D399,
    redHex: 0xF59E0B,
    giftHex: 0xE0E7FF,
    bgGlow: 'radial-gradient(ellipse at center, #062419 0%, #020b08 100%)',
    accentClass: 'from-emerald-400 to-amber-500'
  },
  {
    id: 'romantic_rose',
    name: 'Romantic Rose Gold',
    goldHex: 0xFDA4AF,
    redHex: 0xF43F5E,
    giftHex: 0xFFE4E6,
    bgGlow: 'radial-gradient(ellipse at center, #2b0c1c 0%, #0a0307 100%)',
    accentClass: 'from-pink-400 to-rose-600'
  },
  {
    id: 'ice_sapphire',
    name: 'Crystal Winter Blue',
    goldHex: 0x38BDF8,
    redHex: 0x818CF8,
    giftHex: 0xF0F9FF,
    bgGlow: 'radial-gradient(ellipse at center, #0c1a2e 0%, #030712 100%)',
    accentClass: 'from-cyan-400 to-blue-600'
  },
  {
    id: 'cyber_aurora',
    name: 'Cyber Aurora Magic',
    goldHex: 0xA855F7,
    redHex: 0x06B6D4,
    giftHex: 0xFDF4FF,
    bgGlow: 'radial-gradient(ellipse at center, #1b0c2e 0%, #05020c 100%)',
    accentClass: 'from-purple-400 to-cyan-500'
  }
];

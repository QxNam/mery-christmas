import { MemoryPhoto } from '../types';

// Generate colorful, artistic holiday memory cards via HTML5 Canvas Data URLs
function generateHolidayCard(title: string, subtitle: string, color1: string, color2: string, iconType: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 600, 600);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 600);

  // Decorative border
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
  ctx.lineWidth = 14;
  ctx.strokeRect(18, 18, 564, 564);

  // Inner subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 536, 536);

  // Sparkles & Stars in background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 540 + 30;
    const y = Math.random() * 540 + 30;
    const r = Math.random() * 3 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw central icon
  ctx.save();
  ctx.translate(300, 240);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
  ctx.shadowBlur = 25;

  if (iconType === 'tree') {
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.moveTo(0, -90);
    ctx.lineTo(60, -20);
    ctx.lineTo(35, -20);
    ctx.lineTo(80, 50);
    ctx.lineTo(50, 50);
    ctx.lineTo(100, 110);
    ctx.lineTo(-100, 110);
    ctx.lineTo(-50, 50);
    ctx.lineTo(-80, 50);
    ctx.lineTo(-35, -20);
    ctx.lineTo(-60, -20);
    ctx.closePath();
    ctx.fill();

    // Tree star
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(0, -95, 16, 0, Math.PI * 2);
    ctx.fill();
  } else if (iconType === 'gift') {
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(-70, -40, 140, 120);
    ctx.fillStyle = '#FDE047';
    ctx.fillRect(-15, -40, 30, 120);
    ctx.fillRect(-70, 10, 140, 30);
    // Ribbon bow
    ctx.beginPath();
    ctx.arc(-25, -60, 25, 0, Math.PI * 2);
    ctx.arc(25, -60, 25, 0, Math.PI * 2);
    ctx.fill();
  } else if (iconType === 'heart') {
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.bezierCurveTo(-70, -40, -110, -10, -50, -80);
    ctx.bezierCurveTo(-10, -90, 0, -60, 0, -40);
    ctx.bezierCurveTo(0, -60, 10, -90, 50, -80);
    ctx.bezierCurveTo(110, -10, 70, -40, 0, 30);
    ctx.fill();
  } else if (iconType === 'bell') {
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(0, -40, 50, Math.PI, 0, false);
    ctx.lineTo(65, 50);
    ctx.lineTo(-65, 50);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.arc(0, 55, 16, 0, Math.PI * 2);
    ctx.fill();
  } else if (iconType === 'snowman') {
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.arc(0, 50, 65, 0, Math.PI * 2);
    ctx.arc(0, -40, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(30, -35);
    ctx.lineTo(0, -30);
    ctx.fill();
  } else {
    // Star
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * 75, -Math.sin((18 + i * 72) / 180 * Math.PI) * 75);
      ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * 32, -Math.sin((54 + i * 72) / 180 * Math.PI) * 32);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Title Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText(title, 300, 440);

  // Subtitle Text
  ctx.fillStyle = '#FDE047';
  ctx.font = 'italic 24px "Segoe UI", sans-serif';
  ctx.fillText(subtitle, 300, 490);

  return canvas.toDataURL('image/jpeg', 0.9);
}

export const INITIAL_PHOTOS: MemoryPhoto[] = [
  {
    id: '1',
    url: generateHolidayCard('Warm Winter Gatherings', 'Cozy fireplace & festive joy', '#881337', '#1e1b4b', 'tree'),
    caption: 'Warm Winter Gatherings'
  },
  {
    id: '2',
    url: generateHolidayCard('Precious Holiday Gifts', 'Unwrapping magic & smiles', '#991b1b', '#3b0764', 'gift'),
    caption: 'Precious Holiday Gifts'
  },
  {
    id: '3',
    url: generateHolidayCard('Endless Sweet Love', 'Forever in my heart', '#be123c', '#4c0519', 'heart'),
    caption: 'Endless Sweet Love'
  },
  {
    id: '4',
    url: generateHolidayCard('Golden Jingle Bells', 'Ringing in happiness', '#78350f', '#0f172a', 'bell'),
    caption: 'Golden Jingle Bells'
  },
  {
    id: '5',
    url: generateHolidayCard('Pure Snow Wonders', 'Frosty days & starry nights', '#0369a1', '#09090b', 'snowman'),
    caption: 'Pure Snow Wonders'
  },
  {
    id: '6',
    url: generateHolidayCard('Christmas Starlight', 'Shining bright forever', '#831843', '#172554', 'star'),
    caption: 'Christmas Starlight'
  }
];

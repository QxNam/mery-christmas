import * as THREE from 'three';

export function createParticleTexture(type: 'gold' | 'red' | 'gift' | 'snow' | 'sparkle'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 64;
  const cy = 64;

  if (type === 'gold') {
    // Shimmering Golden Fairy Light
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
    grd.addColorStop(0, '#FFFFFF');
    grd.addColorStop(0.15, '#FFFEE0');
    grd.addColorStop(0.4, '#FFD700');
    grd.addColorStop(0.75, 'rgba(255, 170, 0, 0.4)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);

    // Cross star sparkle in the center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy); ctx.lineTo(cx + 24, cy);
    ctx.moveTo(cx, cy - 24); ctx.lineTo(cx, cy + 24);
    ctx.stroke();

  } else if (type === 'red') {
    // Rich Ruby / Crimson Ornament Glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
    grd.addColorStop(0, '#FFFFFF');
    grd.addColorStop(0.2, '#FFAAAA');
    grd.addColorStop(0.5, '#EF4444');
    grd.addColorStop(0.8, 'rgba(185, 28, 28, 0.35)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);

    // Inner highlight reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(cx - 10, cy - 10, 8, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'gift') {
    // 3D Gift Box with Golden Ribbons
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(22, 22, 84, 84, 10) : ctx.rect(22, 22, 84, 84);
    ctx.fill();

    // Gold ribbon bands
    ctx.fillStyle = '#FDE047';
    ctx.fillRect(52, 22, 24, 84);
    ctx.fillRect(22, 52, 84, 24);

    // Subtle edge border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(22, 22, 84, 84);

    // Ribbon bow
    ctx.beginPath();
    ctx.arc(50, 22, 14, 0, Math.PI * 2);
    ctx.arc(78, 22, 14, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'snow') {
    // Soft realistic snowflake crystal
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 45);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    grd.addColorStop(0.5, 'rgba(220, 240, 255, 0.6)');
    grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);

    // Snowflake 6 arms
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((i * 60 * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 38);
      // branch v
      ctx.moveTo(0, 22); ctx.lineTo(10, 30);
      ctx.moveTo(0, 22); ctx.lineTo(-10, 30);
      ctx.stroke();
      ctx.restore();
    }
  } else {
    // Sparkle star
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
    grd.addColorStop(0, '#FFFFFF');
    grd.addColorStop(0.3, '#E0F2FE');
    grd.addColorStop(0.7, 'rgba(56, 189, 248, 0.3)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createTextTexture(text: string, subText = '', color = '#FFD700', shadowColor = '#FF0000'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 1024, 256);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = 35;
  ctx.fillStyle = color;
  ctx.font = 'bold 84px "Times New Roman", Georgia, serif';
  ctx.fillText(text, 512, subText ? 105 : 128);

  if (subText) {
    ctx.font = 'italic 40px "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 20;
    ctx.fillText(subText, 512, 185);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createTreeStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 128;
  const cy = 128;
  const outerRadius = 105;
  const innerRadius = 45;

  // Background glow
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
  grd.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
  grd.addColorStop(0.3, 'rgba(255, 215, 0, 0.6)');
  grd.addColorStop(1, 'rgba(255, 180, 0, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#FFF888';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 25;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(
      cx + Math.cos(((18 + i * 72) / 180) * Math.PI) * outerRadius,
      cy - Math.sin(((18 + i * 72) / 180) * Math.PI) * outerRadius
    );
    ctx.lineTo(
      cx + Math.cos(((54 + i * 72) / 180) * Math.PI) * innerRadius,
      cy - Math.sin(((54 + i * 72) / 180) * Math.PI) * innerRadius
    );
  }
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

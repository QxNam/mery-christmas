import React, { useState } from 'react';
import { X, Download, Share2, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  snapshotUrl: string | null;
}

export const GreetingCardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  snapshotUrl
}) => {
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('Wishing you a magical holiday season filled with warmth, endless joy, and precious moments!');
  const [cardTheme, setCardTheme] = useState<'gold' | 'ruby' | 'winter'>('gold');

  if (!isOpen) return null;

  const downloadCard = () => {
    // Generate framed greeting card via canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient based on theme
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 900);
    if (cardTheme === 'gold') {
      bgGrad.addColorStop(0, '#1c1103');
      bgGrad.addColorStop(1, '#050201');
    } else if (cardTheme === 'ruby') {
      bgGrad.addColorStop(0, '#2e0811');
      bgGrad.addColorStop(1, '#080104');
    } else {
      bgGrad.addColorStop(0, '#0c1a2e');
      bgGrad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 900);

    // Outer border
    ctx.strokeStyle = cardTheme === 'gold' ? '#FFD700' : cardTheme === 'ruby' ? '#F43F5E' : '#38BDF8';
    ctx.lineWidth = 16;
    ctx.strokeRect(20, 20, 1160, 860);

    // Inner gold hairline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, 1128, 828);

    const renderCard = () => {
      // Card Header
      ctx.fillStyle = cardTheme === 'gold' ? '#FFD700' : cardTheme === 'ruby' ? '#FDA4AF' : '#7DD3FC';
      ctx.font = 'bold 44px "Times New Roman", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(recipient ? `For ${recipient}` : 'Season Greetings', 600, 95);

      // Card Message
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '22px "Segoe UI", sans-serif';
      ctx.fillText(message, 600, 770);

      if (sender) {
        ctx.fillStyle = '#FDE047';
        ctx.font = 'italic bold 24px "Segoe UI", sans-serif';
        ctx.fillText(`With love, ${sender}`, 600, 815);
      }

      // Watermark / Credit
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '14px "Segoe UI", sans-serif';
      ctx.fillText('Magic Christmas 3D Card', 600, 850);

      // Download
      const link = document.createElement('a');
      link.download = `holiday-magic-greeting-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Throw festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    // Draw 3D snapshot in center
    if (snapshotUrl) {
      const img = new Image();
      img.onload = () => {
        // Draw image frame
        ctx.save();
        ctx.drawImage(img, 150, 130, 900, 580);
        ctx.restore();
        renderCard();
      };
      img.src = snapshotUrl;
    } else {
      renderCard();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-neutral-950 border border-white/20 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Holiday Greeting Card Creator</h2>
              <p className="text-xs text-white/50">Export your 3D Christmas scene as a keepsake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Snapshot Preview */}
          {snapshotUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 shadow-lg bg-black">
              <img src={snapshotUrl} alt="3D Scene Snapshot" className="w-full h-48 object-cover" />
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] text-amber-300 px-2 py-0.5 rounded border border-white/10">
                Captured Live
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-white/70 mb-1 block">To (Recipient Name)</label>
              <input
                type="text"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="e.g. My Dear Love, Best Friend"
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-white/70 mb-1 block">From (Your Name)</label>
              <input
                type="text"
                value={sender}
                onChange={e => setSender(e.target.value)}
                placeholder="e.g. Santa, Nam"
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="text-white/70 mb-1 block">Greeting Message</label>
            <textarea
              rows={2}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Theme border style */}
          <div className="text-xs">
            <label className="text-white/70 mb-1.5 block">Card Frame Color</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCardTheme('gold')}
                className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                  cardTheme === 'gold'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                    : 'border-white/10 bg-neutral-900 text-white/70'
                }`}
              >
                ✨ Royal Gold
              </button>
              <button
                onClick={() => setCardTheme('ruby')}
                className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                  cardTheme === 'ruby'
                    ? 'border-rose-400 bg-rose-500/20 text-rose-300'
                    : 'border-white/10 bg-neutral-900 text-white/70'
                }`}
              >
                💖 Ruby Heart
              </button>
              <button
                onClick={() => setCardTheme('winter')}
                className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                  cardTheme === 'winter'
                    ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                    : 'border-white/10 bg-neutral-900 text-white/70'
                }`}
              >
                ❄️ Winter Frost
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-neutral-900/50">
          <button
            onClick={onClose}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={downloadCard}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-red-900/50 transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};

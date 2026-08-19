import React, { useEffect, useRef, useState } from 'react';
import { GestureType, ParticleState } from '../types';
import { Camera as CameraIcon, RefreshCw, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  isCameraActive: boolean;
  onGestureDetected: (gesture: GestureType, handX: number) => void;
  currentState: ParticleState;
  onCameraError?: (msg: string) => void;
}

declare global {
  interface Window {
    Hands: unknown;
    Camera: unknown;
  }
}

export const GestureDetector: React.FC<Props> = ({
  isCameraActive,
  onGestureDetected,
  currentState
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [detectedGesture, setDetectedGesture] = useState<GestureType>('NONE');
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handsInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);

  // Load MediaPipe scripts dynamically if missing
  const loadMediaPipeScripts = async (): Promise<boolean> => {
    if (window.Hands && window.Camera) return true;

    return new Promise(resolve => {
      const loadScript = (src: string) =>
        new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = src;
          s.crossOrigin = 'anonymous';
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        });

      Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
      ])
        .then(() => resolve(true))
        .catch(err => {
          console.warn('Failed to load MediaPipe from CDN:', err);
          resolve(false);
        });
    });
  };

  useEffect(() => {
    let isCancelled = false;

    const initHands = async () => {
      if (!isCameraActive) {
        if (cameraInstanceRef.current) {
          try { cameraInstanceRef.current.stop(); } catch {}
          cameraInstanceRef.current = null;
        }
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      const loaded = await loadMediaPipeScripts();
      if (isCancelled) return;

      if (!loaded || !window.Hands || !window.Camera) {
        setErrorMsg('MediaPipe gesture tracker unavailable. You can still use Touch/Mouse controls!');
        setLoading(false);
        return;
      }

      try {
        const HandsClass = window.Hands as any;
        const CameraClass = window.Camera as any;

        const hands = new HandsClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results: any) => {
          if (isCancelled) return;
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx && results.image) {
              const tw = canvas.width;
              const th = canvas.height;
              const sw = results.image.width || 320;
              const sh = results.image.height || 240;

              ctx.clearRect(0, 0, tw, th);
              ctx.save();
              ctx.translate(tw, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(results.image, 0, 0, sw, sh, 0, 0, tw, th);

              // Draw hand landmark connectors if present
              if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                  ctx.fillStyle = '#FFD700';
                  for (const lm of landmarks) {
                    ctx.beginPath();
                    ctx.arc(lm.x * tw, lm.y * th, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                  }
                }
              }
              ctx.restore();
            }
          }

          // Gesture Recognition Logic
          const multi = results.multiHandLandmarks;
          if (multi && multi.length === 2) {
            const h1 = multi[0];
            const h2 = multi[1];
            const distIndex = Math.hypot(h1[8].x - h2[8].x, h1[8].y - h2[8].y);
            const distThumb = Math.hypot(h1[4].x - h2[4].x, h1[4].y - h2[4].y);

            // Two hands making heart shape
            if (distIndex < 0.18 && distThumb < 0.18) {
              setDetectedGesture('HEART');
              onGestureDetected('HEART', 0.5);
              return;
            }
          }

          if (multi && multi.length > 0) {
            const lm = multi[0];
            const handX = lm[9].x; // Middle MCP horizontal pos
            const tips = [8, 12, 16, 20];
            const wrist = lm[0];

            let openDist = 0;
            tips.forEach(idx => {
              openDist += Math.hypot(lm[idx].x - wrist.x, lm[idx].y - wrist.y);
            });
            const avgDist = openDist / 4;
            const pinchDist = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);

            if (avgDist < 0.24) {
              setDetectedGesture('FIST');
              onGestureDetected('FIST', handX);
            } else if (pinchDist < 0.055) {
              setDetectedGesture('PINCH');
              onGestureDetected('PINCH', handX);
            } else {
              setDetectedGesture('OPEN');
              onGestureDetected('OPEN', handX);
            }
          } else {
            setDetectedGesture('NONE');
            onGestureDetected('NONE', 0.5);
          }
        });

        handsInstanceRef.current = hands;

        const video = videoRef.current;
        if (video) {
          const camera = new CameraClass(video, {
            onFrame: async () => {
              if (handsInstanceRef.current && video.readyState >= 2) {
                await handsInstanceRef.current.send({ image: video });
              }
            },
            width: 320,
            height: 240,
            facingMode: facingMode
          });

          await camera.start();
          cameraInstanceRef.current = camera;
          setLoading(false);
        }
      } catch (err: any) {
        console.warn('Camera/Gesture init error:', err);
        setErrorMsg('Camera access denied or unavailable.');
        setLoading(false);
      }
    };

    initHands();

    return () => {
      isCancelled = true;
      if (cameraInstanceRef.current) {
        try { cameraInstanceRef.current.stop(); } catch {}
      }
    };
  }, [isCameraActive, facingMode]);

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  if (!isCameraActive) return null;

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col items-end pointer-events-auto">
      <video ref={videoRef} className="hidden" playsInline muted autoPlay />

      <div className="bg-black/75 backdrop-blur-md border border-amber-500/40 rounded-2xl p-2.5 shadow-2xl transition-all duration-300">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10 text-xs text-white/80">
          <div className="flex items-center gap-1.5 font-medium">
            <CameraIcon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI Gesture Cam</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleFacingMode}
              title="Switch Camera (Front/Back)"
              className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Expand Preview' : 'Minimize Preview'}
              className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            >
              {isMinimized ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Video Canvas PIP */}
        {!isMinimized && (
          <div className="relative w-32 h-24 sm:w-40 sm:h-30 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-inner">
            <canvas
              ref={canvasRef}
              width={160}
              height={120}
              className="w-full h-full object-cover"
            />

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-amber-400 text-xs gap-1">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Starting Cam...</span>
              </div>
            )}

            {errorMsg && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-black/90 text-rose-300 text-[10px] text-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Live Recognized Gesture Badge */}
        <div className="mt-2 flex items-center justify-between gap-2 px-1">
          <span className="text-[11px] text-white/60">Detected:</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all ${
              detectedGesture === 'HEART'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                : detectedGesture === 'OPEN'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : detectedGesture === 'FIST'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : detectedGesture === 'PINCH'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-white/10 text-white/40 border-white/10'
            }`}
          >
            {detectedGesture === 'HEART' && '🫶 Heart Love'}
            {detectedGesture === 'OPEN' && '🖐 Open (Explode)'}
            {detectedGesture === 'FIST' && '✊ Fist (Tree)'}
            {detectedGesture === 'PINCH' && '🤏 Pinch (Zoom)'}
            {detectedGesture === 'NONE' && 'Ready / Idle'}
          </span>
        </div>
      </div>
    </div>
  );
};

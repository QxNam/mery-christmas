// Web Audio API Festive Sound Synthesizer & Music Player

class HolidayAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingMusic = false;
  private musicTimer: number | null = null;
  private melodyIndex = 0;
  private customAudio: HTMLAudioElement | null = null;
  public volume = 0.8;
  public sfxVolume = 0.8;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Melodies formatted as [freq, durationInSeconds, pauseAfterInSeconds]
  private jingleBellsNotes: [number, number, number][] = [
    [659.25, 0.25, 0.05], [659.25, 0.25, 0.05], [659.25, 0.5, 0.1], // E E E
    [659.25, 0.25, 0.05], [659.25, 0.25, 0.05], [659.25, 0.5, 0.1], // E E E
    [659.25, 0.25, 0.05], [783.99, 0.25, 0.05], [523.25, 0.35, 0.05], [587.33, 0.15, 0.05], [659.25, 0.8, 0.15], // E G C D E
    [698.46, 0.25, 0.05], [698.46, 0.25, 0.05], [698.46, 0.35, 0.05], [698.46, 0.15, 0.05], // F F F F
    [698.46, 0.25, 0.05], [659.25, 0.25, 0.05], [659.25, 0.25, 0.05], [659.25, 0.15, 0.05], [659.25, 0.15, 0.05], // F E E E E
    [783.99, 0.25, 0.05], [783.99, 0.25, 0.05], [698.46, 0.25, 0.05], [587.33, 0.25, 0.05], [523.25, 0.8, 0.3], // G G F D C
  ];

  private silentNightNotes: [number, number, number][] = [
    [783.99, 0.6, 0.1], [880.00, 0.3, 0.05], [783.99, 0.5, 0.1], [659.25, 1.0, 0.2], // G A G E
    [783.99, 0.6, 0.1], [880.00, 0.3, 0.05], [783.99, 0.5, 0.1], [659.25, 1.0, 0.2], // G A G E
    [1174.66, 0.6, 0.1], [1174.66, 0.4, 0.1], [987.77, 0.9, 0.2], // D D B
    [1046.50, 0.6, 0.1], [1046.50, 0.4, 0.1], [783.99, 0.9, 0.2], // C C G
    [880.00, 0.5, 0.05], [880.00, 0.3, 0.05], [1046.50, 0.4, 0.05], [987.77, 0.3, 0.05], [880.00, 0.4, 0.05], // A A C B A
    [783.99, 0.6, 0.05], [880.00, 0.3, 0.05], [783.99, 0.4, 0.05], [659.25, 0.8, 0.2], // G A G E
  ];

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainMultiplier = 1.0) {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const totalGain = Math.max(0, Math.min(1, this.volume * gainMultiplier));
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(totalGain * 0.3, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay restrictions before user interaction
    }
  }

  // Play magical Bell / Celesta note
  public playChimeNote(freq: number, duration = 0.8) {
    try {
      const ctx = this.getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);
      osc2.frequency.setValueAtTime(freq * 2.02, ctx.currentTime); // shimmering overtone

      const level = this.volume * 0.25;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(level, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    } catch {
      // Ignored if user hasn't clicked yet
    }
  }

  public playSFX(name: 'tree' | 'explode' | 'heart' | 'photo' | 'click') {
    try {
      const ctx = this.getAudioContext();
      if (name === 'tree') {
        // Shimmering ascending harp/bells
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((note, i) => {
          setTimeout(() => this.playChimeNote(note, 0.6), i * 70);
        });
      } else if (name === 'explode') {
        // Soft sparkling burst whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(this.sfxVolume * 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        setTimeout(() => this.playChimeNote(1046.5, 0.8), 100);
      } else if (name === 'heart') {
        // Deep warm heartbeat pulse + sweet melody
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.setValueAtTime(85, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
        setTimeout(() => this.playChimeNote(880, 0.9), 120);
      } else if (name === 'photo') {
        // Focus ping
        this.playChimeNote(1318.51, 0.5);
      } else {
        this.playChimeNote(987.77, 0.2);
      }
    } catch {
      // audio suspended
    }
  }

  public startMusic(track: 'jingle_bells' | 'silent_night' | 'custom' = 'jingle_bells', customUrl?: string) {
    this.stopMusic();
    this.isPlayingMusic = true;

    if (track === 'custom' && customUrl) {
      if (!this.customAudio) {
        this.customAudio = new Audio();
      }
      this.customAudio.src = customUrl;
      this.customAudio.loop = true;
      this.customAudio.volume = this.volume;
      this.customAudio.play().catch(() => {});
      return;
    }

    const melody = track === 'silent_night' ? this.silentNightNotes : this.jingleBellsNotes;
    this.melodyIndex = 0;

    const playNext = () => {
      if (!this.isPlayingMusic) return;
      const note = melody[this.melodyIndex];
      if (note) {
        const [freq, dur, pause] = note;
        this.playChimeNote(freq, dur);
        this.melodyIndex = (this.melodyIndex + 1) % melody.length;
        this.musicTimer = window.setTimeout(playNext, (dur + pause) * 1000);
      }
    };

    playNext();
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer !== null) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }
}

export const audioEngine = new HolidayAudioEngine();

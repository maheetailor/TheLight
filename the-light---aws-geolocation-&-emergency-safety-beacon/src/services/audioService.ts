// Web Audio API acoustic distress synthesizer for laptop/mobile speakers

export type SirenType = 'wail' | 'horn' | 'sos' | 'chirp';

class AudioAlarmService {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentType: SirenType = 'wail';
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentType(): SirenType {
    return this.currentType;
  }

  public start(type: SirenType = 'wail') {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentType = type;

    if (type === 'wail') {
      this.startWailSiren();
    } else if (type === 'horn') {
      this.startHornAlarm();
    } else if (type === 'sos') {
      this.startSosBeeps();
    } else if (type === 'chirp') {
      this.startPiercingChirp();
    }
  }

  public stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
        this.osc1 = null;
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
        this.osc2 = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch {
      // ignore
    }

    this.isPlaying = false;
  }

  private startWailSiren() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, now);

    // LFO modulator for continuous rising/falling wail
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.6, now); // ~0.6 Hz cycle
    lfoGain.gain.setValueAtTime(450, now); // frequency excursion +- 450Hz

    lfo.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.35, now);

    osc.start(now);
    lfo.start(now);

    this.osc1 = osc;
    this.osc2 = lfo;
    this.gainNode = gain;
  }

  private startHornAlarm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Pulse volume on and off
    let on = true;
    gain.gain.setValueAtTime(0.4, now);

    this.intervalId = window.setInterval(() => {
      if (!this.ctx || !this.gainNode) return;
      on = !on;
      const t = this.ctx.currentTime;
      this.gainNode.gain.cancelScheduledValues(t);
      this.gainNode.gain.setValueAtTime(on ? 0.4 : 0.001, t);
    }, 280);

    osc.start(now);
    this.osc1 = osc;
    this.gainNode = gain;
  }

  private startSosBeeps() {
    if (!this.ctx) return;

    // Morse SOS pattern: 3 dots (0.2s), 3 dashes (0.6s), 3 dots (0.2s)
    const pattern = [
      { on: 0.18, off: 0.12 }, // S .
      { on: 0.18, off: 0.12 }, // S .
      { on: 0.18, off: 0.4 },  // S .
      { on: 0.5, off: 0.15 },  // O -
      { on: 0.5, off: 0.15 },  // O -
      { on: 0.5, off: 0.4 },   // O -
      { on: 0.18, off: 0.12 }, // S .
      { on: 0.18, off: 0.12 }, // S .
      { on: 0.18, off: 0.8 },  // S . then repeat gap
    ];

    let step = 0;

    const playNext = () => {
      if (!this.isPlaying || !this.ctx) return;
      const cur = pattern[step];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.setValueAtTime(0.001, now + cur.on);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + cur.on);

      const totalTime = (cur.on + cur.off) * 1000;
      step = (step + 1) % pattern.length;

      this.intervalId = window.setTimeout(playNext, totalTime);
    };

    playNext();
  }

  private startPiercingChirp() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, now);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    lfo.type = 'sawtooth';
    lfo.frequency.setValueAtTime(8, now); // 8 Hz rapid chirp
    lfoGain.gain.setValueAtTime(600, now);

    lfo.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.3, now);

    osc.start(now);
    lfo.start(now);

    this.osc1 = osc;
    this.osc2 = lfo;
    this.gainNode = gain;
  }
}

export const audioAlarm = new AudioAlarmService();

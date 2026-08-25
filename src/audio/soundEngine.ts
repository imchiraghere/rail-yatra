/**
 * Indian Railway Sound Engine & Procedural Nostalgia Music Synthesizer
 * Uses Web Audio API to create authentic sleeper-coach soundscapes & warm acoustic music
 */

class RailwaySoundEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Master and channel gain nodes
  private masterGain: GainNode | null = null;
  private trackGain: GainNode | null = null;
  private fanGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private chaiGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  // Ambient intervals / sources
  private trackIntervalId: number | null = null;
  private fanOscillator: OscillatorNode | null = null;
  private fanGainSub: GainNode | null = null;
  private windNoiseNode: AudioNode | null = null;
  private rainNoiseNode: AudioNode | null = null;
  private chaiIntervalId: number | null = null;

  // Music playback state
  private isMusicPlaying = false;
  private currentSongKey = 'nostalgic_90s';
  private musicIntervalId: number | null = null;
  private musicStep = 0;
  private activeMusicNodes: AudioNode[] = [];

  // Custom Audio element support
  private customAudio: HTMLAudioElement | null = null;
  private customAudioSource: MediaElementAudioSourceNode | null = null;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Channel busses
      this.trackGain = this.ctx.createGain();
      this.trackGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.trackGain.connect(this.masterGain);

      this.fanGain = this.ctx.createGain();
      this.fanGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.fanGain.connect(this.masterGain);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.windGain.connect(this.masterGain);

      this.chaiGain = this.ctx.createGain();
      this.chaiGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.chaiGain.connect(this.masterGain);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.isInitialized = true;
      this.startTrackRhythm('medium');
      this.startFanAmbience('medium');
      this.startWindAmbience();
      this.scheduleChaiCalls();
    } catch (e) {
      console.warn('Web Audio could not be initialized yet:', e);
    }
  }

  private bgTrainAudio: HTMLAudioElement | null = null;
  private bgTrainSource: MediaElementAudioSourceNode | null = null;

  // --- TRAIN TRACK RHYTHM — REAL AUDIO ---
  public startTrackRhythm(speed: 'slow' | 'medium' | 'fast' = 'medium') {
    if (!this.ctx || !this.trackGain) return;

    if (!this.bgTrainAudio) {
      this.bgTrainAudio = new Audio('/audio/bg-train.mp3');
      this.bgTrainAudio.loop = true;
      this.bgTrainAudio.crossOrigin = 'anonymous';

      try {
        this.bgTrainSource = this.ctx.createMediaElementSource(this.bgTrainAudio);
        this.bgTrainSource.connect(this.trackGain);
      } catch (e) {
        console.warn('Could not route bg-train through Web Audio', e);
      }
    }

    const rate = speed === 'slow' ? 0.85 : speed === 'fast' ? 1.2 : 1.0;
    this.bgTrainAudio.playbackRate = rate;

    this.bgTrainAudio.play().catch(e => console.warn('Background train playback failed', e));
  }

  // --- CEILING FAN HUM & MOTOR BUZZ ---
  public startFanAmbience(speed: 'off' | 'slow' | 'medium' | 'fast' = 'medium') {
    if (!this.ctx || !this.fanGain) return;

    if (this.fanOscillator) {
      try {
        this.fanOscillator.stop();
        this.fanOscillator.disconnect();
      } catch {
        // ignore
      }
      this.fanOscillator = null;
    }

    if (speed === 'off') {
      this.fanGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      return;
    }

    const freq = speed === 'slow' ? 42 : speed === 'fast' ? 70 : 54;
    const bladeSpeedHz = speed === 'slow' ? 2.5 : speed === 'fast' ? 5.2 : 3.8;

    this.fanOscillator = this.ctx.createOscillator();
    this.fanOscillator.type = 'sine';
    this.fanOscillator.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Motor 50Hz subtle buzz
    const motorFilter = this.ctx.createBiquadFilter();
    motorFilter.type = 'lowpass';
    motorFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

    // Blade rotation modulation LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(bladeSpeedHz, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.fanGainSub = this.ctx.createGain();
    this.fanGainSub.gain.setValueAtTime(0.25, this.ctx.currentTime);

    lfo.connect(this.fanGainSub.gain);
    this.fanOscillator.connect(motorFilter);
    motorFilter.connect(this.fanGainSub);
    this.fanGainSub.connect(this.fanGain);

    this.fanOscillator.start();
    lfo.start();
  }

  // --- WINDOW BREEZE & RUSHING AIR ---
  public startWindAmbience() {
    if (!this.ctx || !this.windGain) return;
    if (this.windNoiseNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    // Generate smooth pink-brown noise
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // Gentle wind gust modulation
    const gustLfo = this.ctx.createOscillator();
    gustLfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    const gustGain = this.ctx.createGain();
    gustGain.gain.setValueAtTime(120, this.ctx.currentTime);

    gustLfo.connect(gustGain);
    gustGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.windGain);

    noise.start();
    gustLfo.start();
    this.windNoiseNode = noise;
  }

  // --- MONSOON RAIN ON TRAIN TIN ROOF ---
  public setRainIntensity(intensity: number) {
    if (!this.ctx || !this.rainGain) return;
    this.rainGain.gain.setTargetAtTime(intensity * 0.6, this.ctx.currentTime, 0.5);

    if (intensity > 0 && !this.rainNoiseNode) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = buffer;
      rainSource.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);
      rainFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

      rainSource.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      rainSource.start();
      this.rainNoiseNode = rainSource;
    }
  }

  // --- ICONIC INDIAN ELECTRIC LOCOMOTIVE HORN (WAP-7 POOOOO-POOO) ---
  public playLocoHorn() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // Harmonic dual horn notes: D#4 (311Hz) + G#4 (415Hz) + C5 (523Hz)
    const freqs = [311.13, 415.3, 523.25, 622.25];
    const duration = 2.4;

    const hornBus = this.ctx.createGain();
    const convolver = this.ctx.createBiquadFilter();
    convolver.type = 'lowpass';
    convolver.frequency.setValueAtTime(1800, now);

    hornBus.gain.setValueAtTime(0.001, now);
    hornBus.gain.linearRampToValueAtTime(0.45, now + 0.25);
    hornBus.gain.setValueAtTime(0.45, now + duration - 0.5);
    hornBus.gain.exponentialRampToValueAtTime(0.001, now + duration);

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // Subtle Doppler downward pitch bend
      osc.frequency.exponentialRampToValueAtTime(freq * 0.97, now + duration);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc.connect(filter);
      filter.connect(hornBus);
      osc.start(now);
      osc.stop(now + duration + 0.1);
    });

    hornBus.connect(convolver);
    convolver.connect(this.masterGain);
  }

  // --- HELPER: Play a real audio file via HTMLAudio, routed through master gain ---
  private playRealAudio(path: string, volume = 0.9) {
    this.init();
    try {
      const audio = new Audio(path);
      audio.volume = Math.min(1, volume);
      audio.play().catch((e) => console.warn('[SoundEngine] Audio play failed:', e));
      // Also route through Web Audio master if ctx exists
      if (this.ctx && this.masterGain) {
        try {
          const src = this.ctx.createMediaElementSource(audio);
          src.connect(this.masterGain);
        } catch {
          // If already connected (AudioNode reuse), just play raw
        }
      }
    } catch (e) {
      console.warn('[SoundEngine] Real audio playback error:', e);
    }
  }

  // --- CHAI VENDOR CALL ("चाय... गरम चाय...") — REAL AUDIO ---
  public triggerChaiCall() {
    this.playRealAudio('/audio/chai-wala.mp3', 0.85);
  }

  private scheduleChaiCalls() {
    if (this.chaiIntervalId) window.clearInterval(this.chaiIntervalId);
    // Periodically trigger a distant chai vendor call every ~45 seconds
    this.chaiIntervalId = window.setInterval(() => {
      if (this.chaiGain && this.chaiGain.gain.value > 0.1 && Math.random() > 0.4) {
        this.triggerChaiCall();
      }
    }, 42000);
  }

  // --- PROCEDURAL INDIAN NOSTALGIA MUSIC SYNTHESIZER ---
  public playSong(audioKey: string) {
    this.init();
    this.currentSongKey = audioKey;
    this.isMusicPlaying = true;
    this.stopMusicEngine();
    this.startMusicEngine();
  }

  public pauseMusic() {
    this.isMusicPlaying = false;
    this.stopMusicEngine();
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public resumeMusic() {
    this.init();
    this.isMusicPlaying = true;
    if (this.customAudio && this.customAudio.src) {
      this.customAudio.play();
    } else {
      this.startMusicEngine();
    }
  }

  public setMasterVolume(v: number) {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime, 0.1);
  }

  public setChannelVolume(channel: 'track' | 'fan' | 'wind' | 'chai' | 'music', volume: number) {
    if (!this.ctx) return;
    const gainMap: Record<string, GainNode | null> = {
      track: this.trackGain,
      fan: this.fanGain,
      wind: this.windGain,
      chai: this.chaiGain,
      music: this.musicGain,
    };
    const node = gainMap[channel];
    if (node) {
      node.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.1);
    }
  }

  private startMusicEngine() {
    if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;

    // Musical progressions based on Indian nostalgic scales (Raag Yaman, Raag Bhairavi, 90s Romance Major 7ths)
    const chordScales: Record<string, { roots: number[]; notes: number[]; scaleName: string; tempo: number }> = {
      nostalgic_90s: {
        roots: [130.81, 146.83, 164.81, 174.61], // C3, D3, E3, F3
        notes: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C Major / 90s Alka-Kumar Sanu scale
        scaleName: '90s Melodic Romance',
        tempo: 450
      },
      bansuri_lofi: {
        roots: [110.00, 130.81, 146.83, 164.81], // A2, C3, D3, E3
        notes: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33], // A Minor Pentatonic / Raag Shivranjani
        scaleName: 'Shivranjani Flute Lo-Fi',
        tempo: 490
      },
      retro_classic: {
        roots: [123.47, 146.83, 164.81, 185.00], // B2, D3, E3, F#3
        notes: [246.94, 293.66, 329.63, 369.99, 440.00, 493.88, 587.33],
        scaleName: 'Kishore Da Acoustic',
        tempo: 420
      },
      ghazal_soul: {
        roots: [98.00, 116.54, 130.81, 146.83], // G2, Bb2, C3, D3
        notes: [196.00, 233.08, 261.63, 293.66, 349.23, 392.00, 466.16], // Raag Darbari / Ghazal
        scaleName: 'Soulful Darbari',
        tempo: 580
      },
      wanderlust_journey: {
        roots: [146.83, 174.61, 196.00, 220.00],
        notes: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25],
        scaleName: 'Swades Wanderlust',
        tempo: 380
      },
      first_love_90s: {
        roots: [130.81, 164.81, 174.61, 196.00],
        notes: [261.63, 329.63, 392.00, 493.88, 523.25, 659.25],
        scaleName: 'Pehla Nasha Strings',
        tempo: 440
      },
      midnight_raga: {
        roots: [87.31, 110.00, 130.81, 146.83],
        notes: [174.61, 220.00, 261.63, 329.63, 392.00, 440.00, 523.25],
        scaleName: 'Midnight Yaman Kalyan',
        tempo: 620
      },
      monsoon_ambient: {
        roots: [116.54, 130.81, 155.56, 174.61],
        notes: [233.08, 261.63, 311.13, 349.23, 415.30, 466.16, 523.25],
        scaleName: 'Raag Megh Monsoon',
        tempo: 520
      }
    };

    const currentConfig = chordScales[this.currentSongKey] || chordScales.nostalgic_90s;
    this.musicStep = 0;

    const playMusicalBeat = () => {
      if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;
      const now = this.ctx.currentTime;
      const step = this.musicStep;
      this.musicStep = (this.musicStep + 1) % 32;

      // 1. Warm Acoustic / Rhodes Bass Drone every 4 beats
      if (step % 4 === 0) {
        const rootIdx = Math.floor(step / 8) % currentConfig.roots.length;
        const rootFreq = currentConfig.roots[rootIdx];
        this.playAcousticBass(rootFreq, now, 1.8);
        this.playWarmPadChord(rootFreq, currentConfig.notes, now, 2.2);
      }

      // 2. Soothing Bansuri / Acoustic Guitar Melody note
      if (Math.random() > 0.25) {
        const noteIdx = Math.floor(Math.random() * currentConfig.notes.length);
        const noteFreq = currentConfig.notes[noteIdx];
        const isBansuri = this.currentSongKey.includes('bansuri') || this.currentSongKey.includes('raga') || Math.random() > 0.5;
        if (isBansuri) {
          this.playBansuriNote(noteFreq, now, 0.9);
        } else {
          this.playAcousticGuitarNote(noteFreq, now, 0.7);
        }
      }

      // 3. Gentle Lo-Fi Tabla / Finger Snap every 2 beats
      if (step % 2 === 0) {
        this.playGentleTablaBeat(now, step % 4 === 0);
      }
    };

    playMusicalBeat();
    this.musicIntervalId = window.setInterval(playMusicalBeat, currentConfig.tempo);
  }

  private playAcousticBass(freq: number, t: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration + 0.1);
  }

  private playWarmPadChord(rootFreq: number, scale: number[], t: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const chordNotes = [rootFreq * 2, rootFreq * 2.5, rootFreq * 3];

    chordNotes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.2, t);
      filter.Q.setValueAtTime(1.5, t);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), t + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(t);
      osc.stop(t + duration + 0.1);
    });
  }

  private playBansuriNote(freq: number, t: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    // Gentle Bansuri breath vibrato / meend (pitch glide)
    const glide = (Math.random() - 0.5) * 6;
    osc.frequency.setValueAtTime(freq + glide, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.15);

    // Subtle breath noise layer
    const breathOsc = this.ctx.createOscillator();
    breathOsc.type = 'triangle';
    breathOsc.frequency.setValueAtTime(freq * 2.02, t);

    // Vibrato LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(5.2, t); // 5Hz vibrato
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(4.5, t);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.12);
    gain.gain.setValueAtTime(0.15, t + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    const breathGain = this.ctx.createGain();
    breathGain.gain.setValueAtTime(0.03, t);

    osc.connect(filter);
    breathOsc.connect(breathGain);
    breathGain.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    breathOsc.start(t);
    lfo.start(t);

    osc.stop(t + duration + 0.1);
    breathOsc.stop(t + duration + 0.1);
    lfo.stop(t + duration + 0.1);
  }

  private playAcousticGuitarNote(freq: number, t: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.exponentialRampToValueAtTime(450, t + duration * 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  private playGentleTablaBeat(t: number, isBayanThud: boolean) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';

    if (isBayanThud) {
      // Bayan (Dha/Ghe) bass resonance with pitch modulation
      osc.frequency.setValueAtTime(115, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.22);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(t);
      osc.stop(t + 0.3);
    } else {
      // Dayan (Tin/Ta) high bell-like ringing overtone
      osc.frequency.setValueAtTime(320, t);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(640, t);
      filter.Q.setValueAtTime(4.0, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  }

  private stopMusicEngine() {
    if (this.musicIntervalId) {
      window.clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.activeMusicNodes.forEach((node) => {
      try {
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeMusicNodes = [];
  }

  // --- CUSTOM USER AUDIO FILE / STREAM ---
  public playCustomAudioFile(file: File) {
    this.init();
    if (!this.ctx || !this.musicGain) return;

    this.stopMusicEngine();
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
    }

    const url = URL.createObjectURL(file);
    this.customAudio = new Audio(url);
    this.customAudio.crossOrigin = 'anonymous';

    try {
      this.customAudioSource = this.ctx.createMediaElementSource(this.customAudio);
      this.customAudioSource.connect(this.musicGain);
    } catch {
      // already connected or reuse
    }

    this.customAudio.play();
    this.isMusicPlaying = true;
  }

  public playCustomStreamUrl(url: string) {
    this.init();
    if (!this.ctx || !this.musicGain) return;

    this.stopMusicEngine();
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
    }

    this.customAudio = new Audio(url);
    this.customAudio.crossOrigin = 'anonymous';

    try {
      this.customAudioSource = this.ctx.createMediaElementSource(this.customAudio);
      this.customAudioSource.connect(this.musicGain);
    } catch {
      // ignore
    }

    this.customAudio.play();
    this.isMusicPlaying = true;
  }

  // --- SAMOSA WALA CALL — REAL AUDIO ---
  public triggerSamosaCall() {
    // Re-using chai sound or station arrival for now
    this.playRealAudio('/audio/train-arrival.mp3', 0.85);
  }

  // --- STATION ANNOUNCEMENT — REAL AUDIO ---
  public playStationAnnouncement() {
    this.playRealAudio('/audio/station-announcement.mp3', 1.0);
  }
}

export const soundEngine = new RailwaySoundEngine();

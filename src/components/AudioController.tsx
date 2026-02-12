import { useCallback, useRef, useState } from 'react';

const SOUNDS = {
  paperRustle: () => createNoise(0.08, 0.3, 800, 2000),
  stamp: () => createTone(200, 0.05, 0.1, 'sine'),
  click: () => createTone(600, 0.03, 0.05, 'sine'),
  success: () => {
    const ctx = new AudioContext();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.15 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  },
};

function createTone(freq: number, vol: number, dur: number, type: OscillatorType) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function createNoise(vol: number, dur: number, lowFreq: number, highFreq: number) {
  const ctx = new AudioContext();
  const bufferSize = ctx.sampleRate * dur;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * vol;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = (lowFreq + highFreq) / 2;
  bandpass.Q.value = 0.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
  source.connect(bandpass).connect(gain).connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + dur);
}

export function useAudio() {
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  const play = useCallback((sound: keyof typeof SOUNDS) => {
    if (mutedRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    try {
      SOUNDS[sound]();
    } catch {
      // Silently fail
    }
  }, []);

  return { muted, toggleMute, play };
}

interface AudioControllerProps {
  muted: boolean;
  onToggle: () => void;
}

const AudioController = ({ muted, onToggle }: AudioControllerProps) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-secondary flex items-center justify-center
                 border border-border shadow-sm hover:shadow-md transition-shadow"
      aria-label={muted ? 'Activar sonido' : 'Silenciar'}
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
};

export default AudioController;

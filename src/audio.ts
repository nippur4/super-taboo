// Sonidos por osciladores Web Audio (sin archivos de audio) + vibración,
// portados 1:1 del prototipo de diseño.
import { SONIDOS_ON, VIBRACION_ON } from './constants';

let ac: AudioContext | null = null;

function ctx(): AudioContext {
  if (!ac) ac = new AudioContext();
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

// Llamar en el primer gesto del usuario para desbloquear el AudioContext.
export function desbloquearAudio() {
  try { ctx(); } catch { /* sin audio */ }
}

function beep(f: number, d: number, tipo: OscillatorType, g = 0.3, cuando = 0, fFin?: number) {
  if (!SONIDOS_ON) return;
  try {
    const c = ctx();
    const t0 = c.currentTime + cuando;
    const o = c.createOscillator();
    const ga = c.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(f, t0);
    if (fFin) o.frequency.exponentialRampToValueAtTime(fFin, t0 + d);
    ga.gain.setValueAtTime(g, t0);
    ga.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(ga);
    ga.connect(c.destination);
    o.start(t0);
    o.stop(t0 + d + 0.05);
  } catch { /* sin audio */ }
}

export function vibrar(pat: number | number[]) {
  if (VIBRACION_ON && navigator.vibrate) {
    try { navigator.vibrate(pat); } catch { /* sin vibración */ }
  }
}

export function sonidoAcierto() { beep(660, 0.09, 'triangle', 0.3); beep(990, 0.14, 'triangle', 0.3, 0.08); }
export function sonidoBuzzer() { beep(520, 0.55, 'sawtooth', 0.4, 0, 180); beep(392, 0.55, 'sawtooth', 0.3, 0.12, 140); }
export function sonidoRonda() { beep(523, 0.12, 'triangle', 0.3); beep(659, 0.12, 'triangle', 0.3, 0.11); beep(784, 0.22, 'triangle', 0.32, 0.22); }
export function sonidoTic() { beep(1150, 0.05, 'square', 0.2); }

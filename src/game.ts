import { Mode } from './constants';
import { MODOS, COLORES_EQUIPO } from './constants';
import { PALABRAS, CATEGORIAS, Palabra } from './palabras';

export type Screen = 'home' | 'setup' | 'sorteo' | 'preturn' | 'turn' | 'timeup' | 'roundend' | 'gameover';

export interface Team {
  name: string;
  score: number;
  color: string;
}

// Devuelve el primer color de la paleta que no esté usado por otro equipo.
export function colorLibre(teams: Team[]): string {
  return COLORES_EQUIPO.find((c) => !teams.some((t) => t.color === c)) || COLORES_EQUIPO[0];
}

export interface GameState {
  screen: Screen;
  mode: Mode;
  teams: Team[];
  tiempo: number;
  pasar: boolean;
  jugadores: number;
  porJugador: number;
  catsSel: string[];
  deck: Palabra[];
  pool: number[];
  roundIdx: number;
  teamIdx: number;
  timeLeft: number;
  turnScore: number;
  running: boolean;
  // true si el turno terminó por falta (y no por tiempo)
  falta: boolean;
}

export const ESTADO_INICIAL: GameState = {
  screen: 'home',
  mode: 'super',
  teams: [
    { name: 'Equipo 1', score: 0, color: COLORES_EQUIPO[0] },
    { name: 'Equipo 2', score: 0, color: COLORES_EQUIPO[1] },
  ],
  tiempo: 30,
  pasar: true,
  jugadores: 6,
  porJugador: 3,
  catsSel: CATEGORIAS.slice(),
  deck: [],
  pool: [],
  roundIdx: 0,
  teamIdx: 0,
  timeLeft: 0,
  turnScore: 0,
  running: false,
  falta: false,
};

// ── Persistencia de la última configuración usada ──
// El teléfono recuerda equipos, tiempo, reglas, mazo y categorías del último
// juego para no tener que reconfigurar todo cada vez.
const CONFIG_KEY = 'decilo-config-v1';

export function guardarConfig(s: GameState) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({
      mode: s.mode,
      teams: s.teams.map((t) => ({ name: t.name, color: t.color })),
      tiempo: s.tiempo,
      pasar: s.pasar,
      jugadores: s.jugadores,
      porJugador: s.porJugador,
      catsSel: s.catsSel,
    }));
  } catch { /* sin storage */ }
}

export function cargarConfig(): Partial<GameState> {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return {};
    const c = JSON.parse(raw);
    const out: Partial<GameState> = {};
    if (c.mode && MODOS[c.mode as Mode]) out.mode = c.mode;
    if (Array.isArray(c.teams) && c.teams.length >= 2) {
      const teams: Team[] = [];
      c.teams.slice(0, 4).forEach((t: any, i: number) => {
        const name = typeof t === 'string' ? t : String(t?.name ?? `Equipo ${i + 1}`);
        let color = typeof t === 'object' && COLORES_EQUIPO.includes(t?.color) ? t.color : COLORES_EQUIPO[i];
        if (teams.some((x) => x.color === color)) color = colorLibre(teams); // sin colores repetidos
        teams.push({ name, score: 0, color });
      });
      out.teams = teams;
    }
    if (typeof c.tiempo === 'number') out.tiempo = c.tiempo;
    if (typeof c.pasar === 'boolean') out.pasar = c.pasar;
    if (typeof c.jugadores === 'number') out.jugadores = Math.min(16, Math.max(4, c.jugadores));
    if ([3, 5, 7].includes(c.porJugador)) out.porJugador = c.porJugador;
    if (Array.isArray(c.catsSel)) {
      const cats = c.catsSel.filter((x: unknown) => CATEGORIAS.includes(x as string));
      if (cats.length) out.catsSel = cats;
    }
    return out;
  } catch { return {}; }
}

export function mezclar<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function palabrasFiltradas(catsSel: string[]): Palabra[] {
  const sel = catsSel.length ? catsSel : CATEGORIAS;
  return PALABRAS.filter((w) => sel.includes(w.c));
}

export function armarPartida(s: GameState): Pick<GameState, 'deck' | 'pool' | 'roundIdx' | 'teamIdx' | 'teams'> {
  const disponibles = mezclar(palabrasFiltradas(s.catsSel));
  const modo = MODOS[s.mode];
  const deck = modo.infinito
    ? disponibles
    : disponibles.slice(0, Math.min(s.jugadores * s.porJugador, disponibles.length));
  return {
    deck,
    pool: mezclar(deck.map((_, i) => i)),
    roundIdx: 0,
    teamIdx: 0,
    teams: s.teams.map((t) => ({ ...t, score: 0 })),
  };
}

import { Mode } from './constants';
import { MODOS } from './constants';
import { PALABRAS, CATEGORIAS, Palabra } from './palabras';

export type Screen = 'home' | 'setup' | 'preturn' | 'turn' | 'timeup' | 'roundend' | 'gameover';

export interface Team {
  name: string;
  score: number;
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
}

export const ESTADO_INICIAL: GameState = {
  screen: 'home',
  mode: 'super',
  teams: [{ name: 'Equipo 1', score: 0 }, { name: 'Equipo 2', score: 0 }],
  tiempo: 45,
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
};

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

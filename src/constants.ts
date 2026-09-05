// Rojo, azul, amarillo, violeta, negro, verde, naranja, marrón.
export const COLORES_EQUIPO = ['#FF4E45', '#3E7BFF', '#FFC93C', '#9B5DE5', '#201233', '#00C489', '#FF8A3D', '#9C6B3F'];
// Versión suave de cada color de equipo, para teñir el fondo del turno.
export const COLORES_EQUIPO_SUAVE = ['#FFEAE4', '#E3ECFF', '#FFF3D1', '#F0E6FC', '#E5E1EC', '#D6F5EA', '#FFE9D6', '#EEE0D2'];
// Color de texto legible sobre cada color de equipo (amarillo y naranja piden tinta oscura).
export const COLORES_EQUIPO_TEXTO = ['#FAF4E8', '#FAF4E8', '#201233', '#FAF4E8', '#FAF4E8', '#FAF4E8', '#201233', '#FAF4E8'];

// El color de cada equipo ahora es elegible, así que derivamos su variante suave
// y su color de texto a partir del color elegido (no del índice del equipo).
export function suaveDe(color: string): string {
  const i = COLORES_EQUIPO.indexOf(color);
  return COLORES_EQUIPO_SUAVE[i >= 0 ? i : 0];
}
export function textoDe(color: string): string {
  const i = COLORES_EQUIPO.indexOf(color);
  return COLORES_EQUIPO_TEXTO[i >= 0 ? i : 0];
}

export type RondaKey = 'taboo' | 'palabra' | 'mimica' | 'sonidos';
export type Mode = 'clasico' | 'super' | 'extremo';

export interface RondaDef {
  n: string;
  regla: string;
  color: string;
  texto: string;
  suave: string;
}

export const RONDAS: Record<RondaKey, RondaDef> = {
  taboo:   { n: 'PALABRAS PROHIBIDAS', regla: 'Describí la palabra sin decir ninguna de las prohibidas. Un punto por acierto.', color: '#FF4E45', texto: '#FAF4E8', suave: '#FFEAE4' },
  palabra: { n: 'UNA SOLA PALABRA', regla: 'Una única palabra como pista, ni una más. Las palabras prohibidas siguen prohibidas.', color: '#3E7BFF', texto: '#FAF4E8', suave: '#E3ECFF' },
  mimica:  { n: 'MÍMICA', regla: 'Prohibido hablar: solo gestos. Ya conocés las palabras, ahora actualas.', color: '#FFC93C', texto: '#201233', suave: '#FFF3D1' },
  sonidos: { n: 'SOLO SONIDOS', regla: 'Sin palabras y sin gestos: solo sonidos. La ronda final para valientes.', color: '#9B5DE5', texto: '#FAF4E8', suave: '#F0E6FC' },
};

export const MODOS: Record<Mode, { nombre: string; rondas: RondaKey[]; infinito: boolean }> = {
  clasico: { nombre: 'CLÁSICO', rondas: ['taboo'], infinito: true },
  super:   { nombre: 'SUPER DECILO', rondas: ['taboo', 'palabra', 'mimica'], infinito: false },
  extremo: { nombre: 'DECILO EXTREMO', rondas: ['taboo', 'palabra', 'mimica', 'sonidos'], infinito: false },
};

export const INSTRUCCIONES: Partial<Record<RondaKey, string>> = {
  palabra: 'SOLO UNA PALABRA DE PISTA',
  mimica: 'SIN HABLAR — SOLO GESTOS',
  sonidos: 'SIN PALABRAS NI GESTOS',
};

// Avisos configurables
export const SONIDOS_ON = true;
export const VIBRACION_ON = true;
export const SEGUNDOS_AVISO = 5;

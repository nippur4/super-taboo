import { Mode } from '../constants';

const FICHAS = [
  { letra: 'T', bg: '#FF4E45', color: '#FAF4E8', rot: -5 },
  { letra: 'A', bg: '#3E7BFF', color: '#FAF4E8', rot: 4 },
  { letra: 'B', bg: '#FFC93C', color: '#201233', rot: -3 },
  { letra: 'O', bg: '#9B5DE5', color: '#FAF4E8', rot: 5 },
  { letra: 'O', bg: '#00C489', color: '#FAF4E8', rot: -4 },
];

interface Props {
  onElegir: (mode: Mode) => void;
  onVerReglas: () => void;
}

export default function Home({ onElegir, onVerReglas }: Props) {
  return (
    <div className="screen home">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <div className="home-super">SUPER</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 14 }}>
        {FICHAS.map((f, i) => (
          <div key={i} className="home-tile" style={{ background: f.bg, color: f.color, transform: `rotate(${f.rot}deg)` }}>
            {f.letra}
          </div>
        ))}
      </div>
      <p className="home-tagline">Palabras prohibidas, mímica y caos. Pasá el teléfono y a jugar.</p>

      <div className="home-label">ELEGÍ CÓMO JUGAR</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="mode-card" onClick={() => onElegir('clasico')}>
          <div className="titulo">TABOO CLÁSICO</div>
          <div className="desc">El de siempre: hacé adivinar la palabra sin decir las prohibidas.</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="mode-pill" style={{ background: '#FF4E45' }}>TABOO</span>
          </div>
        </div>

        <div className="mode-card" onClick={() => onElegir('super')}>
          <div className="titulo">SUPER TABOO</div>
          <div className="desc">3 rondas con las mismas palabras. Cada ronda es más difícil.</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="mode-pill" style={{ background: '#FF4E45' }}>TABOO</span>
            <span className="mode-pill" style={{ background: '#3E7BFF' }}>UNA PALABRA</span>
            <span className="mode-pill" style={{ background: '#FFC93C', color: '#201233' }}>MÍMICA</span>
          </div>
        </div>

        <div className="mode-card dark" onClick={() => onElegir('extremo')}>
          <div className="titulo">SUPER TABOO EXTREMO</div>
          <div className="desc">Las 3 rondas + una final solo con sonidos. Para valientes.</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="mode-pill" style={{ background: '#FF4E45' }}>TABOO</span>
            <span className="mode-pill" style={{ background: '#3E7BFF' }}>UNA PALABRA</span>
            <span className="mode-pill" style={{ background: '#FFC93C', color: '#201233' }}>MÍMICA</span>
            <span className="mode-pill" style={{ background: '#9B5DE5' }}>SONIDOS</span>
          </div>
        </div>
      </div>

      <div className="link-menu" style={{ marginTop: 24 }} onClick={onVerReglas}>Ver reglas</div>
    </div>
  );
}

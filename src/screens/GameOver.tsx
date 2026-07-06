export interface FilaRanking {
  pos: string;
  name: string;
  score: number;
  color: string;
  bg: string;
}

interface Props {
  ganadorTxt: string;
  ranking: FilaRanking[];
  onJugarDeNuevo: () => void;
  onSalirMenu: () => void;
}

const CONFETI = [
  { left: '8%', width: 12, height: 20, background: '#FF4E45', round: false, dur: 3.2, delay: 0 },
  { left: '24%', width: 14, height: 14, background: '#3E7BFF', round: true, dur: 4.1, delay: 0.6 },
  { left: '43%', width: 12, height: 22, background: '#9B5DE5', round: false, dur: 3.6, delay: 1.2 },
  { left: '62%', width: 14, height: 14, background: '#00C489', round: true, dur: 4.4, delay: 0.3 },
  { left: '78%', width: 12, height: 20, background: '#FAF4E8', round: false, dur: 3.4, delay: 1.7 },
  { left: '90%', width: 12, height: 16, background: '#FF4E45', round: false, dur: 3.9, delay: 2.2 },
];

export default function GameOver(p: Props) {
  return (
    <div className="screen gameover">
      {CONFETI.map((c, i) => (
        <div
          key={i}
          className="confeti"
          style={{
            left: c.left,
            width: c.width,
            height: c.height,
            background: c.background,
            borderRadius: c.round ? '50%' : 0,
            animation: `caerConfeti ${c.dur}s linear ${c.delay}s infinite`,
          }}
        />
      ))}
      <div className="gameover-scroll">
        <div className="gameover-fin">FIN DEL JUEGO</div>
        <div className="gameover-ganador">{p.ganadorTxt}</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 30 }}>
          {p.ranking.map((fila, i) => (
            <div key={i} className="ranking-fila" style={{ background: fila.bg }}>
              <div className="ranking-pos">{fila.pos}</div>
              <div className="dot dot-14" style={{ background: fila.color }} />
              <div className="ranking-nombre">{fila.name}</div>
              <div className="ranking-puntos">{fila.score}</div>
            </div>
          ))}
        </div>
        <div
          className="cta press cta-oscura-crema"
          onClick={p.onJugarDeNuevo}
          style={{ width: '100%', background: '#201233', color: '#FAF4E8', fontSize: 20, boxShadow: '5px 5px 0 #FAF4E8' }}
        >
          JUGAR DE NUEVO
        </div>
        <div className="gameover-link" onClick={p.onSalirMenu}>Volver al menú</div>
      </div>
    </div>
  );
}

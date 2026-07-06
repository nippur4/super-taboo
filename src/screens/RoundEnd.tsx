import { FilaTabla } from './PreTurn';

interface Props {
  rondaBadge: string;
  tabla: FilaTabla[];
  continuarTxt: string;
  onContinuar: () => void;
}

export default function RoundEnd(p: Props) {
  return (
    <div className="screen roundend">
      <div className="ronda-badge" style={{ background: '#00C489', color: '#FAF4E8', fontSize: 14 }}>{p.rondaBadge}</div>
      <div className="roundend-titulo">¡RONDA COMPLETADA!</div>
      <div className="roundend-sub">Se adivinaron todas las palabras.</div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
        {p.tabla.map((fila, i) => (
          <div key={i} className="score-row" style={{ background: '#FFFFFF', padding: '10px 14px' }}>
            <div className="dot dot-14" style={{ background: fila.color }} />
            <div className="nombre">{fila.name}</div>
            <div className="puntos">{fila.score}</div>
          </div>
        ))}
      </div>
      <div
        className="cta press press-4"
        onClick={p.onContinuar}
        style={{ width: '100%', background: '#201233', color: '#FAF4E8', fontSize: 19, letterSpacing: 1.5, boxShadow: '5px 5px 0 #00C489' }}
      >
        {p.continuarTxt}
      </div>
    </div>
  );
}

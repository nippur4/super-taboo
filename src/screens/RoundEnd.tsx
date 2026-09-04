import { useState } from 'react';
import { RondaDef } from '../constants';
import { FilaTabla } from './PreTurn';

interface Props {
  rondaBadge: string;
  tabla: FilaTabla[];
  continuarTxt: string;
  reglaSiguiente: RondaDef | null;
  onContinuar: () => void;
}

export default function RoundEnd(p: Props) {
  const [verReglas, setVerReglas] = useState(false);
  const sig = p.reglaSiguiente;
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
      {sig && (
        <div className="roundend-verreglas press press-2" onClick={() => setVerReglas(true)}>
          📖 VER REGLAS DE LA SIGUIENTE RONDA
        </div>
      )}

      {verReglas && sig && (
        <div className="reglas-overlay" onClick={() => setVerReglas(false)}>
          <div className="reglas-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ronda-badge" style={{ background: sig.color, color: sig.texto, fontSize: 14, alignSelf: 'center' }}>
              {sig.n}
            </div>
            <p className="reglas-modal-texto">{sig.regla}</p>
            <div
              className="cta press press-3"
              onClick={() => setVerReglas(false)}
              style={{ width: '100%', background: '#201233', color: '#FAF4E8', fontSize: 18, boxShadow: `4px 4px 0 ${sig.color}` }}
            >
              ¡ENTENDIDO!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

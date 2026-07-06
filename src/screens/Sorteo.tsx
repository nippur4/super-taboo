import { useEffect, useRef, useState } from 'react';
import { COLORES_EQUIPO } from '../constants';
import { Team } from '../game';
import { sonidoTic, sonidoRonda, vibrar } from '../audio';

interface Props {
  teams: Team[];
  // índice del equipo ganador del sorteo (ya decidido); la animación cae ahí
  targetIdx: number;
  onListo: () => void;
}

export default function Sorteo({ teams, targetIdx, onListo }: Props) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    const n = teams.length;
    // la ruleta da ~3 vueltas y termina exactamente en targetIdx
    const pasos = n * 3 + targetIdx;
    let delay = 90;
    let t = 0;
    for (let i = 1; i <= pasos; i++) {
      t += delay;
      delay = Math.min(delay * 1.16, 420); // desacelera
      const esUltimo = i === pasos;
      timeouts.current.push(window.setTimeout(() => {
        setIdx(i % n);
        if (esUltimo) {
          sonidoRonda();
          vibrar([80, 60, 120]);
          setDone(true);
        } else {
          sonidoTic();
          vibrar(15);
        }
      }, t));
    }
    return () => timeouts.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nombre = teams[idx]?.name || `Equipo ${idx + 1}`;

  return (
    <div className="screen sorteo">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="ronda-badge" style={{ background: '#FFC93C', color: '#201233' }}>SORTEO</div>
      </div>
      <div className="sorteo-titulo">¿QUIÉN EMPIEZA?</div>

      <div className={`sorteo-card${done ? ' pop' : ''}`}>
        <div className="preturn-letoca">{done ? 'EMPIEZA' : 'SORTEANDO…'}</div>
        <div className="preturn-equipo" style={{ color: COLORES_EQUIPO[idx] }}>{nombre}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 26 }}>
        {teams.map((_, i) => (
          <div
            key={i}
            className="dot dot-18"
            style={{ background: COLORES_EQUIPO[i], opacity: i === idx ? 1 : 0.35, transform: i === idx ? 'scale(1.2)' : 'scale(1)', transition: 'opacity .1s, transform .1s' }}
          />
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div
          className="cta press press-4"
          onClick={done ? onListo : undefined}
          style={{ background: '#201233', color: '#FAF4E8', fontSize: 22, boxShadow: '5px 5px 0 #FFC93C', opacity: done ? 1 : 0.35, pointerEvents: done ? 'auto' : 'none', transition: 'opacity .2s' }}
        >
          ¡A JUGAR!
        </div>
      </div>
    </div>
  );
}

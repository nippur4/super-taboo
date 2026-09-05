import { RondaDef } from '../constants';

interface Props {
  ronda: RondaDef;
  fondo: string;
  equipoNombre: string;
  equipoColor: string;
  equipoTexto: string;
  turnScore: number;
  timeLeft: number;
  timerPct: string;
  urgente: boolean;
  palabra: string;
  categoria: string;
  esRondaTaboo: boolean;
  verProhibidas: boolean;
  prohibidas: string[];
  instruccion: string;
  verRestantes: boolean;
  restantesTxt: string;
  verPasar: boolean;
  onPasar: () => void;
  onAcierto: () => void;
  onFalta: () => void;
  puedeDeshacer: boolean;
  onDeshacer: () => void;
}

export default function Turn(p: Props) {
  const timerColor = p.urgente ? '#FF4E45' : '#201233';
  return (
    <div className="screen turn" style={{ background: p.fondo }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div className="dot dot-14" style={{ background: p.equipoColor }} />
          <div className="turn-equipo">{p.equipoNombre}</div>
        </div>
        <div className="turn-pill">+{p.turnScore} este turno</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '10px 0 4px' }}>
        <div className="turn-timer" style={{ color: timerColor, animation: p.urgente ? 'pulsoUrgente 1s ease-in-out infinite' : 'none' }}>
          {p.timeLeft}
        </div>
      </div>
      <div className="turn-barra">
        <div style={{ width: p.timerPct, background: timerColor }} />
      </div>

      <div className="word-card">
        <div className="word-card-banda" style={{ background: p.equipoColor, color: p.equipoTexto }}>
          <div className="word-card-ronda">{p.ronda.n}</div>
          <div className="word-card-cat">{p.categoria}</div>
        </div>
        <div className="word-card-centro">
          <div className="word-palabra">{p.palabra}</div>
          {!p.esRondaTaboo && <div className="instruccion-pill">{p.instruccion}</div>}
          {p.verProhibidas && (
            <div className="prohibidas-box" style={{ borderColor: p.equipoColor }}>
              <div className="prohibidas-head" style={{ background: p.equipoColor, color: p.equipoTexto }}>PROHIBIDO DECIR</div>
              {p.prohibidas.map((t, i) => (
                <div key={i} className="prohibidas-fila">{t}</div>
              ))}
            </div>
          )}
        </div>
        {p.verRestantes && <div className="word-card-restantes">{p.restantesTxt}</div>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {p.verPasar && (
            <div className="btn-pasar press press-3" onClick={p.onPasar}>PASAR</div>
          )}
          <div className="btn-acierto press press-3" onClick={p.onAcierto}>¡ACIERTO! +1</div>
        </div>
        <div className="btn-falta press press-3" onClick={p.onFalta}>FALTA — TERMINAR TURNO</div>
        <div
          className={`btn-deshacer press press-2${p.puedeDeshacer ? '' : ' btn-deshacer-off'}`}
          onClick={p.puedeDeshacer ? p.onDeshacer : undefined}
        >
          ↶ DESHACER
        </div>
      </div>
    </div>
  );
}

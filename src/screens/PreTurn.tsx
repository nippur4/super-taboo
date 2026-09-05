import { RondaDef } from '../constants';

export interface FilaTabla {
  name: string;
  score: number;
  color: string;
  bg: string;
}

interface Props {
  ronda: RondaDef;
  rondaBadge: string;
  equipoNombre: string;
  equipoColor: string;
  verRestantes: boolean;
  restantesTxt: string;
  tabla: FilaTabla[];
  verTerminar: boolean;
  terminando: boolean;
  onTerminar: () => void;
  onEmpezarTurno: () => void;
  onSalirMenu: () => void;
}

export default function PreTurn(p: Props) {
  return (
    <div className="screen preturn" style={{ background: p.ronda.suave }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="ronda-badge" style={{ background: p.ronda.color, color: p.ronda.texto }}>{p.rondaBadge}</div>
      </div>
      <div className="preturn-nombre">{p.ronda.n}</div>
      <p className="preturn-regla">{p.ronda.regla}</p>

      <div className="preturn-card">
        <div className="preturn-letoca">LE TOCA A</div>
        <div className="preturn-equipo" style={{ color: p.equipoColor }}>{p.equipoNombre}</div>
        {p.verRestantes && <div className="preturn-restantes">{p.restantesTxt}</div>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
        {p.tabla.map((fila, i) => (
          <div key={i} className="score-row" style={{ background: fila.bg }}>
            <div className="dot dot-14" style={{ background: fila.color }} />
            <div className="nombre">{fila.name}</div>
            <div className="puntos">{fila.score}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div
          className="cta press press-4"
          onClick={p.onEmpezarTurno}
          style={{ background: '#201233', color: '#FAF4E8', fontSize: 22, boxShadow: `5px 5px 0 ${p.ronda.color}` }}
        >
          ¡EMPEZAR TURNO!
        </div>
        {p.verTerminar && (
          p.terminando ? (
            <div className="preturn-ultima">🏁 ÚLTIMA VUELTA · que jueguen los que faltan</div>
          ) : (
            <div className="btn-terminar" onClick={p.onTerminar}>TERMINAR PARTIDA</div>
          )
        )}
        <div className="link-menu" style={{ marginTop: 12 }} onClick={p.onSalirMenu}>Salir al menú</div>
      </div>
    </div>
  );
}

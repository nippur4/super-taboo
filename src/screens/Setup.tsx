import { COLORES_EQUIPO } from '../constants';
import { CATEGORIAS } from '../palabras';
import { Team } from '../game';

interface Props {
  titulo: string;
  sub: string;
  teams: Team[];
  onRename: (i: number, name: string) => void;
  onRemove: (i: number) => void;
  onAgregar: () => void;
  tiempo: number;
  onTiempo: (v: number) => void;
  pasar: boolean;
  onTogglePasar: () => void;
  esModoSuper: boolean;
  jugadores: number;
  onJugadores: (delta: number) => void;
  porJugador: number;
  onPorJugador: (v: number) => void;
  totalPalabrasTxt: string;
  catsSel: string[];
  onToggleCat: (c: string) => void;
  onVolver: () => void;
  onEmpezar: () => void;
}

export default function Setup(p: Props) {
  return (
    <div className="screen setup">
      <div className="setup-scroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div className="btn-volver press press-2" onClick={p.onVolver}>←</div>
          <div>
            <div className="setup-titulo">{p.titulo}</div>
            <div className="setup-sub">{p.sub}</div>
          </div>
        </div>

        <div className="section-label">EQUIPOS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {p.teams.map((eq, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="dot dot-18" style={{ background: COLORES_EQUIPO[i] }} />
              <input
                className="team-input"
                value={eq.name}
                placeholder="Nombre del equipo"
                onChange={(e) => p.onRename(i, e.target.value)}
              />
              {p.teams.length > 2 && (
                <div className="btn-quitar" onClick={() => p.onRemove(i)}>×</div>
              )}
            </div>
          ))}
          {p.teams.length < 4 && (
            <div className="btn-agregar" onClick={p.onAgregar}>+ Agregar equipo</div>
          )}
        </div>

        <div className="section-label">TIEMPO POR TURNO</div>
        <div style={{ display: 'flex', gap: 7 }}>
          {[30, 45, 60, 75, 90].map((v) => (
            <div
              key={v}
              className="chip-tiempo"
              onClick={() => p.onTiempo(v)}
              style={{
                background: p.tiempo === v ? '#201233' : '#FFFFFF',
                color: p.tiempo === v ? '#FAF4E8' : '#201233',
                boxShadow: p.tiempo === v ? '3px 3px 0 #FF4E45' : 'none',
              }}
            >
              {v}s
            </div>
          ))}
        </div>

        <div className="section-label">REGLAS</div>
        <div className="card-blanca" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Se puede pasar</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8A7E6C' }}>Saltear una palabra no resta puntos</div>
          </div>
          <div className="toggle" onClick={p.onTogglePasar} style={{ background: p.pasar ? '#00C489' : '#D8D0C4' }}>
            <div className="knob" style={{ left: p.pasar ? 29 : 2 }} />
          </div>
        </div>

        {p.esModoSuper && (
          <>
            <div className="section-label">EL MAZO</div>
            <div className="card-blanca">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>Jugadores en total</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="stepper-btn" onClick={() => p.onJugadores(-1)}>−</div>
                  <div className="stepper-num">{p.jugadores}</div>
                  <div className="stepper-btn" onClick={() => p.onJugadores(1)}>+</div>
                </div>
              </div>
              <div style={{ height: 3, background: '#EFE7D8', margin: '13px 0' }} />
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 9 }}>Palabras por jugador</div>
              <div style={{ display: 'flex', gap: 7 }}>
                {[3, 5, 7].map((v) => (
                  <div
                    key={v}
                    className="chip-pj"
                    onClick={() => p.onPorJugador(v)}
                    style={{
                      background: p.porJugador === v ? '#201233' : '#FAF4E8',
                      color: p.porJugador === v ? '#FAF4E8' : '#201233',
                    }}
                  >
                    {v}
                  </div>
                ))}
              </div>
              <div className="aviso-mazo">{p.totalPalabrasTxt}</div>
            </div>
          </>
        )}

        <div className="section-label">CATEGORÍAS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {CATEGORIAS.map((c) => {
            const activa = p.catsSel.includes(c);
            return (
              <div
                key={c}
                className="chip-cat"
                onClick={() => p.onToggleCat(c)}
                style={{
                  background: activa ? '#201233' : '#FFFFFF',
                  color: activa ? '#FAF4E8' : '#8A7E6C',
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
      </div>

      <div className="setup-cta-wrap">
        <div className="cta press press-4" onClick={p.onEmpezar} style={{ background: '#FF4E45', color: '#FAF4E8', fontSize: 22 }}>
          ¡EMPEZAR!
        </div>
      </div>
    </div>
  );
}

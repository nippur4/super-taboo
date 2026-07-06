interface Props {
  onCerrar: () => void;
}

const RONDAS_INFO = [
  { n: 'TABOO', color: '#FF4E45', texto: '#FAF4E8', desc: 'Describí la palabra sin decir ninguna de las 5 prohibidas. Un punto por acierto.' },
  { n: 'UNA PALABRA', color: '#3E7BFF', texto: '#FAF4E8', desc: 'Una única palabra como pista, ni una más. Las prohibidas del Taboo siguen valiendo.' },
  { n: 'MÍMICA', color: '#FFC93C', texto: '#201233', desc: 'Prohibido hablar: solo gestos.' },
  { n: 'SONIDOS', color: '#9B5DE5', texto: '#FAF4E8', desc: 'Sin palabras y sin gestos: solo sonidos.' },
];

export default function Reglas({ onCerrar }: Props) {
  return (
    <div className="screen reglas">
      <div className="setup-scroll" style={{ paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div className="btn-volver press press-2" onClick={onCerrar}>←</div>
          <div className="setup-titulo">REGLAS</div>
        </div>

        <div className="section-label">EL JUEGO</div>
        <div className="card-blanca reglas-texto">
          Se juega por equipos con un solo teléfono que se pasa de mano en mano.
          En cada turno, un jugador tiene el teléfono y hace adivinar palabras a su
          equipo contrarreloj. Cada palabra adivinada suma un punto.
        </div>

        <div className="section-label">EL TURNO</div>
        <div className="card-blanca reglas-texto">
          <b>¡Acierto! +1</b> — tu equipo adivinó: sumás un punto y pasás a la siguiente palabra.
          <br /><br />
          <b>Pasar</b> — mandás la palabra al final del mazo, sin perder puntos
          (si la regla está activada).
          <br /><br />
          <b>Falta</b> — dijiste una prohibida o rompiste la regla de la ronda:
          el turno termina ahí, pero conservás los puntos que ya sumaste.
        </div>

        <div className="section-label">LAS RONDAS</div>
        <div className="card-blanca" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {RONDAS_INFO.map((r) => (
            <div key={r.n}>
              <span className="mode-pill" style={{ background: r.color, color: r.texto }}>{r.n}</span>
              <div className="reglas-texto" style={{ marginTop: 6 }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <div className="section-label">LOS MODOS</div>
        <div className="card-blanca reglas-texto">
          <b>Taboo Clásico</b> — una sola ronda de Taboo con palabras sin fin.
          Termina cuando quieran, gana el que más puntos tiene.
          <br /><br />
          <b>Super Taboo</b> — 3 rondas con el mismo mazo: Taboo, Una Palabra y Mímica.
          Como ya escucharon las palabras en la primera ronda, ¡la memoria es parte del juego!
          <br /><br />
          <b>Super Taboo Extremo</b> — las 3 rondas más una final de Solo Sonidos.
          Para valientes.
        </div>
      </div>
    </div>
  );
}

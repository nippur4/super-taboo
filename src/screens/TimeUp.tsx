interface Props {
  titulo: string;
  equipoNombre: string;
  turnScore: number;
  siguienteNombre: string;
  onSiguienteTurno: () => void;
  puedeDeshacer?: boolean;
  onDeshacer?: () => void;
}

export default function TimeUp(p: Props) {
  return (
    <div className="screen timeup">
      <div className="timeup-titulo">{p.titulo}</div>
      <div className="timeup-card">
        <div className="timeup-sumo">{p.equipoNombre} SUMÓ</div>
        <div className="timeup-plus">+{p.turnScore}</div>
        <div className="timeup-palabras">
          {p.turnScore === 1 ? '1 palabra adivinada' : `${p.turnScore} palabras adivinadas`}
        </div>
      </div>
      <div className="timeup-pasale">
        Pasale el teléfono a <span style={{ textDecoration: 'underline' }}>{p.siguienteNombre}</span>
      </div>
      <div
        className="cta press cta-oscura-crema"
        onClick={p.onSiguienteTurno}
        style={{ width: '100%', background: '#201233', color: '#FAF4E8', fontSize: 20, boxShadow: '5px 5px 0 #FAF4E8' }}
      >
        LISTO, SEGUIMOS
      </div>
      {p.puedeDeshacer && (
        <div className="btn-deshacer-timeup press press-2" onClick={p.onDeshacer}>
          ↶ ME EQUIVOQUÉ, SEGUIR JUGANDO
        </div>
      )}
    </div>
  );
}

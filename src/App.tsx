import { useEffect, useRef, useState } from 'react';
import { COLORES_EQUIPO, MODOS, RONDAS, INSTRUCCIONES, SEGUNDOS_AVISO, Mode } from './constants';
import { GameState, ESTADO_INICIAL, armarPartida, mezclar, palabrasFiltradas } from './game';
import { desbloquearAudio, vibrar, sonidoAcierto, sonidoBuzzer, sonidoRonda, sonidoTic, sonidoFalta } from './audio';
import { initAds, mostrarBanner, ocultarBanner, prepararInterstitial, mostrarInterstitial } from './ads';
import Home from './screens/Home';
import Setup from './screens/Setup';
import Sorteo from './screens/Sorteo';
import PreTurn from './screens/PreTurn';
import Turn from './screens/Turn';
import TimeUp from './screens/TimeUp';
import RoundEnd from './screens/RoundEnd';
import GameOver from './screens/GameOver';
import Reglas from './screens/Reglas';

export default function App() {
  const [g, setG] = useState<GameState>(ESTADO_INICIAL);
  const [verReglas, setVerReglas] = useState(false);
  const gRef = useRef(g);
  gRef.current = g;
  const intRef = useRef<number | null>(null);
  // Pila de "deshacer": snapshots del estado ANTES de cada acierto/falta/pasar
  // del turno actual, para revertir un toque equivocado y seguir donde estabas.
  const undoRef = useRef<GameState[]>([]);
  const [undoLen, setUndoLen] = useState(0);

  // ── timer ──
  const pararTimer = () => {
    if (intRef.current !== null) {
      clearInterval(intRef.current);
      intRef.current = null;
    }
  };

  const arrancarTimer = () => {
    pararTimer();
    intRef.current = window.setInterval(() => {
      const s = gRef.current;
      const t = s.timeLeft - 1;
      if (t > 0) {
        if (t <= SEGUNDOS_AVISO) {
          sonidoTic();
          vibrar(40);
        }
        setG({ ...s, timeLeft: t });
      } else {
        pararTimer();
        sonidoBuzzer();
        vibrar([300, 120, 500]);
        setG({ ...s, timeLeft: 0, running: false, screen: 'timeup' });
      }
    }, 1000);
  };

  useEffect(() => pararTimer, []);

  // ── deshacer ──
  const pushUndo = (s: GameState) => {
    undoRef.current = [...undoRef.current, s];
    setUndoLen(undoRef.current.length);
  };
  const limpiarUndo = () => {
    undoRef.current = [];
    setUndoLen(0);
  };
  const deshacer = () => {
    const st = undoRef.current;
    if (!st.length) return;
    const snap = st[st.length - 1];
    undoRef.current = st.slice(0, -1);
    setUndoLen(undoRef.current.length);
    vibrar(20);
    const cur = gRef.current;
    const restaurado: GameState = { ...snap, screen: 'turn', running: true, falta: false };
    if (cur.screen === 'turn' && cur.running) {
      // Deshacer en pleno turno (acierto/pasar): el reloj sigue, no regalamos segundos.
      restaurado.timeLeft = cur.timeLeft;
      setG(restaurado);
    } else {
      // Deshacer una falta (o un acierto que cerró la ronda): retomamos el turno.
      setG(restaurado);
      arrancarTimer();
    }
  };

  // ── ads ──
  useEffect(() => {
    initAds();
  }, []);

  useEffect(() => {
    // Banner solo fuera del juego, para no tocar el diseño de la partida.
    if (g.screen === 'home' || g.screen === 'setup') mostrarBanner();
    else ocultarBanner();
    // El interstitial se precarga al llegar a resultados y se muestra al salir.
    if (g.screen === 'gameover') prepararInterstitial();
  }, [g.screen]);

  // ── pantalla siempre encendida durante el turno ──
  useEffect(() => {
    if (g.screen !== 'turn') return;
    let wl: { release(): Promise<void> } | null = null;
    (async () => {
      try {
        wl = await (navigator as any).wakeLock?.request('screen');
      } catch { /* sin wake lock */ }
    })();
    return () => {
      wl?.release().catch(() => {});
    };
  }, [g.screen]);

  // ── flujo del juego (portado 1:1 del prototipo) ──
  const elegirModo = (mode: Mode) => setG({ ...g, mode, screen: 'setup' });

  const empezarPartida = () => {
    const base = armarPartida(g);
    if (!base.deck.length) return;
    desbloquearAudio();
    // el equipo que empieza se sortea; la ruleta de la pantalla de sorteo cae ahí
    const teamIdx = Math.floor(Math.random() * g.teams.length);
    setG({ ...g, ...base, teamIdx, screen: 'sorteo' });
  };

  const empezarTurno = () => {
    desbloquearAudio();
    limpiarUndo();
    setG({ ...gRef.current, timeLeft: g.tiempo, turnScore: 0, running: true, falta: false, screen: 'turn' });
    arrancarTimer();
  };

  const falta = () => {
    const s = gRef.current;
    if (!s.running) return;
    pushUndo(s);
    pararTimer();
    sonidoFalta();
    vibrar([200, 80, 200]);
    setG({ ...s, running: false, falta: true, screen: 'timeup' });
  };

  const acierto = () => {
    const s = gRef.current;
    if (!s.running) return;
    pushUndo(s);
    sonidoAcierto();
    vibrar(35);
    const pool = s.pool.slice(1);
    const teams = s.teams.map((t, i) => (i === s.teamIdx ? { ...t, score: t.score + 1 } : t));
    const turnScore = s.turnScore + 1;
    if (pool.length === 0) {
      if (MODOS[s.mode].infinito) {
        setG({ ...s, teams, turnScore, pool: mezclar(s.deck.map((_, i) => i)) });
      } else {
        pararTimer();
        sonidoRonda();
        vibrar([120, 80, 120]);
        setG({ ...s, teams, turnScore, pool, running: false, screen: 'roundend' });
      }
    } else {
      setG({ ...s, teams, turnScore, pool });
    }
  };

  const pasar = () => {
    const s = gRef.current;
    if (!s.running || s.pool.length < 2) return;
    pushUndo(s);
    setG({ ...s, pool: s.pool.slice(1).concat(s.pool[0]) });
  };

  const siguienteTurno = () => {
    setG({ ...g, teamIdx: (g.teamIdx + 1) % g.teams.length, screen: 'preturn' });
  };

  const continuarRonda = () => {
    const modo = MODOS[g.mode];
    if (g.roundIdx + 1 < modo.rondas.length) {
      setG({
        ...g,
        roundIdx: g.roundIdx + 1,
        pool: mezclar(g.deck.map((_, i) => i)),
        teamIdx: (g.teamIdx + 1) % g.teams.length,
        screen: 'preturn',
      });
    } else {
      setG({ ...g, screen: 'gameover' });
    }
  };

  const salirMenu = () => {
    pararTimer();
    limpiarUndo();
    setG({ ...g, screen: 'home' });
  };

  const jugarDeNuevo = () => {
    mostrarInterstitial();
    const base = armarPartida(g);
    const teamIdx = Math.floor(Math.random() * g.teams.length);
    setG({ ...g, ...base, teamIdx, screen: 'sorteo', turnScore: 0 });
  };

  const salirMenuDesdeResultados = () => {
    mostrarInterstitial();
    salirMenu();
  };

  // ── derivados ──
  const modo = MODOS[g.mode];
  const rondaKey = modo.rondas[Math.min(g.roundIdx, modo.rondas.length - 1)];
  const ronda = RONDAS[rondaKey];
  const carta = g.deck.length && g.pool.length ? g.deck[g.pool[0]] : null;
  const urgente = g.running && g.timeLeft <= SEGUNDOS_AVISO;
  const nEq = g.teams.length;

  const nombreEquipo = (i: number) => g.teams[i]?.name || `Equipo ${i + 1}`;
  const rondaBadge = modo.infinito
    ? 'RONDA ÚNICA'
    : `RONDA ${Math.min(g.roundIdx + 1, modo.rondas.length)} DE ${modo.rondas.length}`;
  const restantesTxt = g.pool.length === 1 ? 'Queda 1 palabra' : `Quedan ${g.pool.length} palabras`;

  const tabla = g.teams.map((t, i) => ({
    name: nombreEquipo(i),
    score: t.score,
    color: COLORES_EQUIPO[i],
    bg: i === g.teamIdx && g.screen === 'preturn' ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
  }));

  if (verReglas) {
    return <Reglas onCerrar={() => setVerReglas(false)} />;
  }

  switch (g.screen) {
    case 'home':
      return <Home onElegir={elegirModo} onVerReglas={() => setVerReglas(true)} />;

    case 'setup': {
      const disponibles = palabrasFiltradas(g.catsSel).length;
      const pedidas = g.jugadores * g.porJugador;
      const totalMazo = Math.min(pedidas, disponibles);
      const totalPalabrasTxt = pedidas > disponibles
        ? `Mazo: ${totalMazo} palabras (máx. con estas categorías)`
        : `Mazo: ${totalMazo} palabras para adivinar`;
      return (
        <Setup
          titulo={modo.nombre}
          sub={modo.infinito ? 'PALABRAS SIN FIN · 1 RONDA' : `${modo.rondas.length} RONDAS · MISMAS PALABRAS`}
          teams={g.teams}
          onRename={(i, name) => setG({ ...g, teams: g.teams.map((t, j) => (j === i ? { ...t, name } : t)) })}
          onRemove={(i) => { if (nEq > 2) setG({ ...g, teams: g.teams.filter((_, j) => j !== i) }); }}
          onAgregar={() => { if (nEq < 4) setG({ ...g, teams: g.teams.concat({ name: `Equipo ${nEq + 1}`, score: 0 }) }); }}
          tiempo={g.tiempo}
          onTiempo={(tiempo) => setG({ ...g, tiempo })}
          pasar={g.pasar}
          onTogglePasar={() => setG({ ...g, pasar: !g.pasar })}
          esModoSuper={!modo.infinito}
          jugadores={g.jugadores}
          onJugadores={(d) => setG({ ...g, jugadores: Math.min(16, Math.max(2, g.jugadores + d)) })}
          porJugador={g.porJugador}
          onPorJugador={(porJugador) => setG({ ...g, porJugador })}
          totalPalabrasTxt={totalPalabrasTxt}
          palabrasPosibles={disponibles}
          catsSel={g.catsSel}
          onToggleCat={(c) => setG({
            ...g,
            catsSel: g.catsSel.includes(c) ? g.catsSel.filter((x) => x !== c) : g.catsSel.concat(c),
          })}
          onVolver={() => setG({ ...g, screen: 'home' })}
          onEmpezar={empezarPartida}
        />
      );
    }

    case 'sorteo':
      return (
        <Sorteo
          key={g.deck.length + '-' + g.teamIdx}
          teams={g.teams}
          targetIdx={g.teamIdx}
          onListo={() => setG({ ...gRef.current, screen: 'preturn' })}
        />
      );

    case 'preturn':
      return (
        <PreTurn
          ronda={ronda}
          rondaBadge={rondaBadge}
          equipoNombre={nombreEquipo(g.teamIdx)}
          equipoColor={COLORES_EQUIPO[g.teamIdx]}
          verRestantes={!modo.infinito}
          restantesTxt={restantesTxt}
          tabla={tabla}
          esClasico={modo.infinito}
          onEmpezarTurno={empezarTurno}
          onFinalizarPartida={() => setG({ ...g, screen: 'gameover' })}
          onSalirMenu={salirMenu}
        />
      );

    case 'turn':
      return (
        <Turn
          ronda={ronda}
          equipoNombre={nombreEquipo(g.teamIdx)}
          equipoColor={COLORES_EQUIPO[g.teamIdx]}
          turnScore={g.turnScore}
          timeLeft={g.timeLeft}
          timerPct={`${g.tiempo ? (g.timeLeft / g.tiempo) * 100 : 0}%`}
          urgente={urgente}
          palabra={carta ? carta.p : ''}
          categoria={carta ? carta.c.toUpperCase() : ''}
          esRondaTaboo={rondaKey === 'taboo'}
          verProhibidas={rondaKey === 'taboo' || rondaKey === 'palabra'}
          prohibidas={carta ? carta.x : []}
          instruccion={INSTRUCCIONES[rondaKey] || ''}
          verRestantes={!modo.infinito}
          restantesTxt={restantesTxt}
          verPasar={g.pasar && g.pool.length > 1}
          onPasar={pasar}
          onAcierto={acierto}
          onFalta={falta}
          puedeDeshacer={undoLen > 0}
          onDeshacer={deshacer}
        />
      );

    case 'timeup':
      return (
        <TimeUp
          titulo={g.falta ? '¡FALTA!' : '¡TIEMPO!'}
          equipoNombre={nombreEquipo(g.teamIdx)}
          turnScore={g.turnScore}
          siguienteNombre={nombreEquipo((g.teamIdx + 1) % nEq)}
          onSiguienteTurno={siguienteTurno}
          puedeDeshacer={g.falta && undoLen > 0}
          onDeshacer={deshacer}
        />
      );

    case 'roundend': {
      const haySiguiente = g.roundIdx + 1 < modo.rondas.length;
      return (
        <RoundEnd
          rondaBadge={rondaBadge}
          tabla={tabla}
          continuarTxt={haySiguiente ? `SIGUIENTE RONDA: ${RONDAS[modo.rondas[g.roundIdx + 1]].n}` : 'VER RESULTADOS'}
          onContinuar={continuarRonda}
        />
      );
    }

    case 'gameover': {
      const max = Math.max(...g.teams.map((t) => t.score));
      const empate = g.teams.filter((t) => t.score === max).length > 1;
      const ordenados = g.teams
        .map((t, i) => ({ ...t, name: nombreEquipo(i), color: COLORES_EQUIPO[i] }))
        .sort((a, b) => b.score - a.score);
      const ranking = ordenados.map((t, i) => ({
        pos: `${i + 1}°`,
        name: t.name,
        score: t.score,
        color: t.color,
        bg: t.score === max && !empate ? '#FFFFFF' : '#FFF6DE',
      }));
      return (
        <GameOver
          ganadorTxt={empate ? '¡EMPATE!' : `¡GANA ${ordenados[0].name.toUpperCase()}!`}
          ranking={ranking}
          onJugarDeNuevo={jugarDeNuevo}
          onSalirMenu={salirMenuDesdeResultados}
        />
      );
    }
  }
}

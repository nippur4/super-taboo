# Handoff: Super Taboo — app móvil de juego de fiesta

## Overview
**Super Taboo** es un juego de fiesta para un solo teléfono que se pasa de mano en mano. Mezcla Taboo con Dígalo con Mímica: los equipos hacen adivinar palabras por turnos contrarreloj, la app lleva el puntaje y avisa cuando se corta el tiempo (sonido + vibración).

Tres modalidades:
1. **Taboo Clásico** — 1 ronda infinita de Taboo (describir sin decir las palabras prohibidas).
2. **Super Taboo** — 3 rondas con **el mismo mazo de palabras**: ① Taboo → ② Una sola palabra de pista → ③ Mímica.
3. **Super Taboo Extremo** — las 3 rondas anteriores + ④ Solo sonidos (sin palabras ni gestos).

## About the Design Files
Los archivos de este paquete son **referencias de diseño hechas en HTML** — un prototipo funcional que muestra el look y el comportamiento esperado. **No son código de producción para copiar tal cual.** La tarea es **recrear estos diseños en el entorno del proyecto destino** (React Native, Flutter, Swift, Kotlin, o web/PWA con React, etc.) usando sus patrones y librerías. Si todavía no existe un codebase, elegir el framework más apropiado para una app móvil de este tipo (recomendado: React Native/Expo o una PWA) e implementar ahí.

- `Super Taboo (standalone).html` — **abrir este archivo en un navegador** para ver y jugar el prototipo exacto (autocontenido, funciona offline). Es la referencia visual y de comportamiento definitiva.
- `Super Taboo.dc.html` — fuente del prototipo: el markup con estilos inline (dentro de `<x-dc>`) + la lógica del juego (clase `Component`, estilo React class component) al final del archivo. **Toda la lógica de juego está acá y es portable casi 1:1.**
- `palabras.js` — el mazo completo: 88 palabras en español, 8 categorías, cada una con 5 palabras prohibidas.
- `ios-frame.jsx` — solo el marco decorativo de iPhone del prototipo. **No implementar**: en la app real la UI ocupa la pantalla completa.
- `screenshots/` — capturas de cada pantalla.

## Fidelity
**High-fidelity (hifi).** Colores, tipografía, espaciados, copy e interacciones son finales. Recrear pixel-perfect (adaptando a safe areas reales del dispositivo).

## Design Tokens
Colores (exactos):
- Tinta / texto principal: `#201233` (violeta casi negro)
- Fondo app: `#FAF4E8` (crema)
- Coral (primario / ronda Taboo / equipo 1): `#FF4E45`
- Azul (ronda Una Palabra / equipo 2): `#3E7BFF`
- Amarillo (ronda Mímica / equipo 3 / pantalla resultados): `#FFC93C`
- Violeta (ronda Sonidos / equipo 4): `#9B5DE5`
- Verde (acierto / toggle on / fin de ronda): `#00C489` (texto verde oscuro: `#00A473`)
- Fondos suaves por ronda: Taboo `#FFEAE4`, Una Palabra `#E3ECFF`, Mímica `#FFF3D1`, Sonidos `#F0E6FC`; fin de ronda `#DFF7EE`
- Texto secundario: `#5C5142` / `#4A4034`; texto atenuado/labels: `#8A7E6C`; placeholder/bordes inactivos: `#B4AA9A`
- Blanco de tarjetas: `#FFFFFF`; rojo texto prohibidas: `#C22F28`; borde filas prohibidas: `#FFD9D6`
- Fondo fuera del teléfono (solo prototipo): `#201233` con puntos `rgba(255,255,255,0.07)` cada 26px

Tipografía (Google Fonts):
- Display: **Anton** (títulos, palabras, números del timer, botones grandes; siempre mayúsculas, letter-spacing 1–4px)
- UI/cuerpo: **Archivo** (pesos 400–900; labels de sección en 800–900)
- Escala usada: labels de sección 13px/espaciado 3px · cuerpo 13–15px · títulos de tarjeta 23px · título de pantalla 26px · nombre de ronda 44px · nombre de equipo 34px · palabra en juego 42px · timer 64px · "¡TIEMPO!" 64px

Estilo de componentes ("neo-brutalista de juguete"):
- Bordes: `3px solid #201233` en TODO (tarjetas, chips, inputs, botones, dots)
- Sombras duras sin blur: `4px 4px 0 #201233` (tarjetas chicas), `5px 5px 0` (tarjetas grandes/CTAs), `6px 6px 0` (tarjeta de palabra). Algunas sombras usan color de acento (p. ej. CTA oscuro con sombra coral/verde/crema).
- Radios: chips/pills `999px` · inputs y chips rectangulares `12px` · tarjetas `16–22px`
- Efecto al presionar (todos los botones): `transform: translate(3–4px, 3–4px)` + sombra a `0 0 0` (el botón "se hunde"). Hover en tarjetas: `translate(-2px,-2px)` + sombra crece. Transición `.1–.12s`.

## Screens / Views
(Las capturas en `screenshots/` siguen esta numeración.)

### 1. Inicio (`01-inicio.png`)
- Logo: pill coral "SUPER" (Anton 18px, flotando con animación suave de 3s) sobre 5 fichas-letra "T A B O O" de 52×60px, cada una rotada (−5°, 4°, −3°, 5°, −4°) con color coral/azul/amarillo/violeta/verde, borde y sombra dura.
- Tagline centrada (max-width 260px): "Palabras prohibidas, mímica y caos. Pasá el teléfono y a jugar."
- Label "ELEGÍ CÓMO JUGAR" y 3 tarjetas de modo (blancas; la de Extremo es oscura `#201233` con sombra violeta). Cada tarjeta: nombre en Anton 23px, descripción 13px, y pills de las rondas que incluye (coral TABOO, azul UNA PALABRA, amarillo MÍMICA, violeta SONIDOS).
- Tap en una tarjeta → Configuración con ese modo.

### 2. Configuración (`02-configuracion.png`)
- Header: botón volver (←, 40×40) + nombre del modo + subtítulo ("3 RONDAS · MISMAS PALABRAS" o "PALABRAS SIN FIN · 1 RONDA").
- **EQUIPOS**: 2–4 filas con dot de color del equipo + input de texto para el nombre + botón × para borrar (solo visible si hay >2). Botón "+ Agregar equipo" con borde punteado (oculto con 4 equipos). Colores de equipo en orden: coral, azul, amarillo, violeta.
- **TIEMPO POR TURNO**: 5 chips (30s / 45s / 60s / 75s / 90s), default 45. Chip activo: fondo `#201233`, texto crema, sombra coral `3px 3px 0 #FF4E45`.
- **REGLAS**: tarjeta con toggle "Se puede pasar" (subtexto "Saltear una palabra no resta puntos"). Toggle 60×34, knob blanco, on = verde, off = `#D8D0C4`. Default: on.
- **EL MAZO** (solo modos Super/Extremo): stepper "Jugadores en total" (− / número / +, rango 2–16, default 6) y chips "Palabras por jugador" (3 / 5 / 7, default 3). Abajo, aviso amarillo: "Mazo: N palabras para adivinar" (N = jugadores × porJugador, limitado por palabras disponibles; si se limita, dice "(máx. con estas categorías)").
- **CATEGORÍAS**: 8 chips toggle (Animales, Comida, Cine y series, Deportes, Objetos, Lugares, Música y famosos, Acciones). Activas por default. Activa = fondo tinta/texto crema; inactiva = blanca/texto atenuado. Si se desactivan todas, se usa el mazo completo.
- CTA fija abajo con degradé de fade: botón coral "¡EMPEZAR!" (Anton 22px).

### 3. Antes del turno (`03-antes-del-turno.png`)
- Fondo = color suave de la ronda actual.
- Pill superior "RONDA X DE Y" (color pleno de la ronda) o "RONDA ÚNICA" en clásico; nombre de la ronda en Anton 44px; regla en 1–2 líneas.
- Tarjeta blanca central: "LE TOCA A" + nombre del equipo (Anton 34px, color del equipo con stroke tinta 1px) + "Quedan N palabras" (solo modos Super).
- Tabla de puntajes: una fila por equipo (dot color + nombre + puntos en Anton 20px). La fila del equipo actual es blanca opaca; el resto semitransparente.
- CTA oscura "¡EMPEZAR TURNO!" (sombra del color de la ronda). En clásico, botón secundario blanco "TERMINAR PARTIDA". Link subrayado "Salir al menú".
- Textos de regla por ronda:
  - Taboo: "Describí la palabra sin decir ninguna de las prohibidas. Un punto por acierto."
  - Una sola palabra: "Una única palabra como pista, ni una más. Son las mismas palabras de la ronda anterior."
  - Mímica: "Prohibido hablar: solo gestos. Ya conocés las palabras, ahora actualas."
  - Solo sonidos: "Sin palabras y sin gestos: solo sonidos. La ronda final para valientes."

### 4. Turno (`04-turno-taboo.png`, `06-turno-una-palabra.png`, `07-turno-mimica.png`, `08-turno-sonidos.png`)
- Fondo = color suave de la ronda.
- Fila superior: dot + nombre del equipo (izq.) y pill oscura "+N este turno" (der.).
- Timer: número gigante Anton 64px + barra de progreso (14px, borde tinta, relleno = color del timer, `transition: width 1s linear`). En los últimos N segundos (default 5): número y barra pasan a coral y el número pulsa (`scale 1→1.08`, 1s loop).
- Tarjeta de palabra (blanca, radio 22px, sombra 6×6): banda superior con color pleno de la ronda — nombre de la ronda (izq.) y CATEGORÍA en mayúsculas (der.). Centro: la palabra en Anton 42px.
  - Ronda Taboo: debajo de la palabra, caja "PROHIBIDO DECIR" (header coral + 5 filas con las prohibidas en rojo `#C22F28`).
  - Otras rondas: pill oscura con la instrucción: "SOLO UNA PALABRA DE PISTA" / "SIN HABLAR — SOLO GESTOS" / "SIN PALABRAS NI GESTOS".
  - Pie de tarjeta (modos Super): "Quedan N palabras".
- Botonera inferior: "PASAR" (blanco, flex 1; solo si la regla está activa y queda >1 palabra) y "¡ACIERTO! +1" (verde, flex 2).

### 5. ¡Tiempo! (overlay de fin de turno)
- Pantalla completa coral. "¡TIEMPO!" en Anton 64px crema con stroke tinta y sombra dura 5×5, rotado −3°.
- Tarjeta blanca: "{EQUIPO} SUMÓ" + "+N" gigante en verde + "N palabras adivinadas".
- Texto "Pasale el teléfono a {siguiente equipo}" y CTA oscura "LISTO, SEGUIMOS".
- Al llegar a 0 la app reproduce la chicharra y vibra `[300,120,500]`.
- (No hay screenshot de esta pantalla; el layout es análogo a `05-fin-de-ronda.png` con los estilos descriptos.)

### 6. Fin de ronda (`05-fin-de-ronda.png`) — solo modos Super/Extremo
- Aparece cuando se adivinan TODAS las palabras del mazo (puede ser en medio de un turno; el tiempo restante se descarta).
- Fondo `#DFF7EE`, pill verde "RONDA X DE Y", título "¡RONDA COMPLETADA!", subtítulo "Se adivinaron todas las palabras.", tabla de puntajes, CTA "SIGUIENTE RONDA: {NOMBRE}" o "VER RESULTADOS" si era la última.

### 7. Resultados (`09-resultados.png`)
- Fondo amarillo con 6 piezas de confeti (rects y círculos de colores con borde tinta) cayendo en loop (translateY + rotate, 3.2–4.4s, delays escalonados).
- "FIN DEL JUEGO" chico rotado −2° + "¡GANA {EQUIPO}!" (o "¡EMPATE!") en Anton 46px crema con stroke y sombra dura.
- Ranking ordenado por puntos: posición (1°, 2°…), dot, nombre, puntos. La fila del ganador es blanca; el resto `#FFF6DE`.
- CTA "JUGAR DE NUEVO" (rearma el mazo con la misma configuración, puntajes en 0) y link "Volver al menú".

## Interactions & Behavior
- **Navegación**: inicio → configuración → antes del turno → turno → (¡tiempo! → antes del turno …) → fin de ronda → … → resultados. "Salir al menú" cancela la partida y detiene el timer.
- **Timer**: cuenta regresiva de 1s. Tick sonoro + vibración corta (40ms) en cada segundo de los últimos 5 (configurable). Al llegar a 0: chicharra grave + vibración `[300,120,500]` + pantalla ¡Tiempo!.
- **Acierto**: +1 al equipo actual, blip sonoro ascendente, vibración 35ms, pasa a la siguiente palabra. Si era la última palabra del mazo: en modos Super termina la ronda (campanita ascendente + vibración doble); en clásico se rebaraja el mazo y sigue.
- **Pasar**: mueve la palabra actual al final de la cola. No resta puntos. Deshabilitado si la regla está apagada o queda 1 sola palabra.
- **Rotación de equipos**: al terminar cada turno pasa al siguiente equipo (orden circular). Al empezar una nueva ronda también avanza el equipo.
- **Sonidos** (Web Audio, osciladores; sin archivos de audio): tick 1150Hz square 50ms · acierto: triangle 660→990Hz · chicharra: sawtooth 520→180Hz + 392→140Hz · fin de ronda: arpegio triangle 523/659/784Hz. Vibración vía `navigator.vibrate`.
- Botones con estado pressed "hundido" (ver Design Tokens). Sin hover en mobile; el prototipo define hover para desktop.

## State Management
Estado global de la partida:
- `screen`: 'home' | 'setup' | 'preturn' | 'turn' | 'timeup' | 'roundend' | 'gameover'
- `mode`: 'clasico' | 'super' | 'extremo' → define `rondas` (['taboo'] | ['taboo','palabra','mimica'] | + 'sonidos') e `infinito`
- `teams`: array 2–4 de `{ name, score }` (colores por índice: coral/azul/amarillo/violeta)
- Configuración: `tiempo` (30–90, def. 45) · `pasar` (bool, def. true) · `jugadores` (2–16, def. 6) · `porJugador` (3|5|7, def. 3) · `catsSel` (categorías activas)
- Partida: `deck` (cartas de la partida) · `pool` (cola de índices pendientes de la ronda actual; se rebaraja al empezar cada ronda) · `roundIdx` · `teamIdx` · `timeLeft` · `turnScore` · `running`
- Armado del mazo: barajar palabras de las categorías activas; modos Super toman `min(jugadores × porJugador, disponibles)`; clásico usa todas.
- La palabra visible siempre es `deck[pool[0]]`.
- Persistencia recomendada en la app real: guardar partida en curso (no existe en el prototipo).

## Assets
Sin imágenes ni íconos. Todo es tipografía + CSS. Fuentes: Anton y Archivo (Google Fonts). El mazo (`palabras.js`) es contenido propio del proyecto: 88 entradas `{ p: palabra, c: categoría, x: [5 prohibidas] }` — usar tal cual y ampliar a futuro.

## Files
- `Super Taboo (standalone).html` — prototipo jugable autocontenido (abrir en navegador)
- `Super Taboo.dc.html` — fuente: markup + lógica del juego
- `palabras.js` — mazo de palabras
- `ios-frame.jsx` — marco decorativo del prototipo (no implementar)
- `screenshots/01…09` — capturas de todas las pantallas

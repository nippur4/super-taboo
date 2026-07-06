# Super Taboo — app Android

Juego de fiesta para un solo teléfono que se pasa de mano en mano (Taboo + Mímica).
Implementación fiel al diseño de [design_handoff_super_taboo/](design_handoff_super_taboo/) con
**React + TypeScript + Vite**, empaquetada como app Android nativa con **Capacitor** y
monetizada con **AdMob**.

## Estructura

- `src/` — la app completa (pantallas en `src/screens/`, lógica en `src/game.ts`,
  sonidos por osciladores en `src/audio.ts`, mazo en `src/palabras.ts`).
- `src/ads.ts` — toda la monetización (banner + interstitial). **Acá van tus IDs de AdMob.**
- `android/` — proyecto Android nativo generado por Capacitor (se compila con Android Studio).
- `design_handoff_super_taboo/` — el paquete de diseño de referencia.

## Correr en el navegador (desarrollo)

```powershell
npm install
npm run dev
```

Abre http://localhost:5173 — la app es 100% jugable en el navegador (sin ads, que son nativos).

## Compilar el APK para Android

Requisito único: **instalar [Android Studio](https://developer.android.com/studio)**
(incluye el SDK y el JDK que faltan en esta máquina).

```powershell
npm run android
```

Ese comando hace el build web, lo sincroniza y abre Android Studio con el proyecto.
Desde ahí: **Run** en un emulador/teléfono, o **Build > Build App Bundles / APKs** para
generar el APK. Para publicar en Play Store: **Build > Generate Signed App Bundle**.

Si preferís línea de comandos (con `ANDROID_HOME` y JDK 17 configurados):

```powershell
npm run build; npx cap sync android; cd android; .\gradlew assembleDebug
# APK en android\app\build\outputs\apk\debug\app-debug.apk
```

## Monetización (AdMob)

La integración ya está hecha y funciona con los **anuncios de prueba de Google**:

- **Banner** anclado abajo, solo en las pantallas de inicio y configuración
  (nunca durante la partida, para no romper el diseño ni las políticas de AdMob).
- **Interstitial** al salir de la pantalla de resultados (corte natural del juego),
  con un cooldown de 3 minutos para no espantar jugadores.

Para cobrar de verdad:

1. Crear cuenta en [admob.google.com](https://admob.google.com) y registrar la app.
2. Crear un bloque *Banner* y uno *Interstitial*; pegar los IDs en [src/ads.ts](src/ads.ts)
   y poner `TESTING = false`.
3. Reemplazar el `APPLICATION_ID` de prueba en
   [android/app/src/main/AndroidManifest.xml](android/app/src/main/AndroidManifest.xml)
   por el ID real de la app (formato `ca-app-pub-XXXX~YYYY`).

> ⚠️ No clickear anuncios reales propios durante pruebas: Google suspende la cuenta.
> Mientras `TESTING = true` se usan los anuncios de test y no hay riesgo.

## Pendientes sugeridos antes de publicar

- Ícono y splash screen propios (los actuales son los default de Capacitor);
  se generan con `npx @capacitor/assets generate` a partir de un logo.
- Cambiar el `appId` (`com.nico.supertaboo` en `capacitor.config.ts`) si querés otro
  identificador de paquete — hay que decidirlo **antes** de la primera publicación.

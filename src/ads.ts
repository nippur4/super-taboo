// Monetización con AdMob (via @capacitor-community/admob).
//
// ── PARA COBRAR DE VERDAD ──
// Cuenta AdMob: pub-7044201893544579. App ID y bloques ya creados (abajo).
// El único paso que falta para cobrar es poner TESTING = false, y eso se hace
// SOLO en el build final de producción (una vez publicada la app en Play).
// Mientras TESTING sea true se usan los anuncios de PRUEBA de Google: es
// obligatorio durante el desarrollo/testing porque clickear anuncios reales
// propios puede hacer que Google suspenda la cuenta.
import { AdMob, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const TESTING = true;

// IDs reales de la cuenta (se usan solo con TESTING = false).
const REAL_BANNER_AD_ID = 'ca-app-pub-7044201893544579/6166646575';
const REAL_INTERSTITIAL_AD_ID = 'ca-app-pub-7044201893544579/3899575886';
// App ID real (referencia; el que cuenta va en el AndroidManifest):
//   ca-app-pub-7044201893544579~9371394419

// IDs de prueba oficiales de Google (se usan con TESTING = true).
const TEST_BANNER_AD_ID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_INTERSTITIAL_AD_ID = 'ca-app-pub-3940256099942544/1033173712';

const BANNER_AD_ID = TESTING ? TEST_BANNER_AD_ID : REAL_BANNER_AD_ID;
const INTERSTITIAL_AD_ID = TESTING ? TEST_INTERSTITIAL_AD_ID : REAL_INTERSTITIAL_AD_ID;

// No mostrar más de un interstitial cada N ms para no espantar jugadores
// (y cumplir las políticas de AdMob).
const INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000;
let ultimoInterstitial = 0;
let interstitialListo = false;

const esNativo = Capacitor.isNativePlatform();

export async function initAds() {
  if (!esNativo) return;
  try {
    await AdMob.initialize({ initializeForTesting: TESTING });
  } catch { /* sin ads */ }
}

let bannerVisible = false;

export async function mostrarBanner() {
  if (!esNativo || bannerVisible) return;
  try {
    await AdMob.showBanner({
      adId: BANNER_AD_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      isTesting: TESTING,
    });
    bannerVisible = true;
    document.body.classList.add('has-banner');
  } catch { /* sin ads */ }
}

export async function ocultarBanner() {
  if (!esNativo || !bannerVisible) return;
  try {
    await AdMob.hideBanner();
  } catch { /* sin ads */ }
  bannerVisible = false;
  document.body.classList.remove('has-banner');
}

export async function prepararInterstitial() {
  if (!esNativo || interstitialListo) return;
  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID, isTesting: TESTING });
    interstitialListo = true;
  } catch { /* sin ads */ }
}

// Se muestra al salir de la pantalla de resultados (corte natural del juego).
export async function mostrarInterstitial() {
  if (!esNativo || !interstitialListo) return;
  if (Date.now() - ultimoInterstitial < INTERSTITIAL_COOLDOWN_MS) return;
  try {
    await AdMob.showInterstitial();
    ultimoInterstitial = Date.now();
  } catch { /* sin ads */ }
  interstitialListo = false;
}

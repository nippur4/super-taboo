// Monetización con AdMob (via @capacitor-community/admob).
//
// ── PARA COBRAR DE VERDAD ──
// 1. Crear cuenta en https://admob.google.com y registrar la app.
// 2. Crear un bloque "Banner" y uno "Interstitial" y pegar sus IDs abajo.
// 3. Reemplazar el APPLICATION_ID en android/app/src/main/AndroidManifest.xml.
// 4. Poner TESTING en false.
// Mientras TESTING sea true se usan los anuncios de prueba de Google
// (obligatorio durante el desarrollo: clickear anuncios reales propios
// puede hacer que Google suspenda la cuenta).
import { AdMob, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const TESTING = true;

// IDs de prueba oficiales de Google — reemplazar por los propios.
const BANNER_AD_ID = 'ca-app-pub-3940256099942544/6300978111';
const INTERSTITIAL_AD_ID = 'ca-app-pub-3940256099942544/1033173712';

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

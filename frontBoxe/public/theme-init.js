/* Applique le thème avant le premier rendu (évite le flash). Fichier externe :
   la CSP (script-src 'self') interdit les scripts inline. Logique miroir de
   src/app/shared/components/theme-switcher/theme.ts */
(function () {
  var ok = { ring: 1, azur: 1, club: 1 };
  var t = null;
  try { t = new URLSearchParams(location.search).get('theme'); } catch (e) {}
  if (!ok[t]) { try { t = localStorage.getItem('esct_theme'); } catch (e) { t = null; } }
  if (!ok[t]) t = 'ring';
  document.documentElement.setAttribute('data-theme', t);
})();

#!/usr/bin/env bash
# =============================================================================
# ESCT Boxe — compile le site Angular sur le PC et l'envoie (bêta : ~/esct-beta.redkards-dev.fr, public : ~/esct.redkards-dev.fr)
# (à lancer depuis Git Bash, à la racine du dépôt) :
#   bash deploy/publish-front.sh          # bêta privée (mot de passe + noindex)
#   bash deploy/publish-front.sh --public # mise en ligne publique (v1.0, après confirmation)
# =============================================================================
set -euo pipefail

SSH_TARGET="${SSH_TARGET:-bopu6118@redkards-dev.fr}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519_o2switch}"
MODE="beta"; [ "${1:-}" = "--public" ] && MODE="public"
# Bêta sur esct-beta.redkards-dev.fr, version publique sur redkards-dev.fr
if [ "${MODE}" = "beta" ]; then WEB_DIR="esct-beta.redkards-dev.fr"; SITE="https://esct-beta.redkards-dev.fr"; else WEB_DIR="esct.redkards-dev.fr"; SITE="https://esct.redkards-dev.fr"; fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ssh_() { ssh -i "${SSH_KEY}" -o BatchMode=yes "${SSH_TARGET}" "$@"; }

echo "🥊 Compilation de production"
cd "${ROOT}/frontBoxe"
rm -rf dist
CONF="$([ "${MODE}" = "beta" ] && echo beta || echo production)"
npx ng build --configuration="${CONF}"
OUT="dist/esct-boxe-front/browser"
[ -f "${OUT}/index.html" ] && [ -f "${OUT}/.htaccess" ] || { echo "Build incomplet (index.html ou .htaccess manquant)"; exit 1; }

echo "🥊 Envoi (${MODE})"
tar -C "${OUT}" -czf - . | ssh_ "set -e
  STAGE=\$HOME/.esct-boxe-front-new
  rm -rf \"\$STAGE\" && mkdir -p \"\$STAGE\" && tar -xzf - -C \"\$STAGE\"
  if [ '${MODE}' = 'beta' ]; then
    { printf 'AuthType Basic\nAuthName \"ESCT Boxe - beta privee\"\nAuthUserFile %s/.htpasswds/esct-boxe-beta\nRequire valid-user\nHeader always set X-Robots-Tag \"noindex, nofollow\"\n\n' \"\$HOME\"; cat \"\$STAGE/.htaccess\"; } > \"\$STAGE/.htaccess.tmp\" && mv \"\$STAGE/.htaccess.tmp\" \"\$STAGE/.htaccess\"
  fi
  mkdir -p \$HOME/${WEB_DIR}
  # On garde le dossier web (permissions cPanel) et on synchronise son contenu ;
  # la version précédente est copiée pour un retour arrière rapide.
  mkdir -p \$HOME/${WEB_DIR}.previous
  rsync -a --delete \$HOME/${WEB_DIR}/ \$HOME/${WEB_DIR}.previous/
  rsync -a --delete --chmod=D755,F644 \"\$STAGE\"/ \$HOME/${WEB_DIR}/
  rm -rf \"\$STAGE\"
  echo 'Site publié dans ${WEB_DIR}'"

echo "🥊 Terminé : ${SITE} (${MODE})"

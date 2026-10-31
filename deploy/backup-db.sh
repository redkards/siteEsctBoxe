#!/usr/bin/env bash
# =============================================================================
# ESCT Boxe — sauvegarde de la base MariaDB (lancée chaque nuit par le cron)
#   bash ~/esct-boxe/deploy/backup-db.sh
# Écrit ~/sauvegardes-esct/esct-AAAA-MM-JJ_HHMM.sql.gz (droits 600, hors racine web)
# et garde les KEEP_DAYS derniers jours (14 par défaut). Le mot de passe n'apparaît
# jamais en ligne de commande : il passe par un fichier d'options temporaire.
# =============================================================================
set -euo pipefail
umask 077

CPANEL_USER="$(whoami)"
DB_NAME="${CPANEL_USER}_esct"
DB_USER="${CPANEL_USER}_esct"
SECRETS="${HOME}/.esct-boxe-secrets"
DEST="${BACKUP_DIR:-${HOME}/sauvegardes-esct}"
KEEP_DAYS="${KEEP_DAYS:-14}"

[ -f "${SECRETS}/db_password" ] || { echo "Mot de passe de la base introuvable (${SECRETS}/db_password)"; exit 1; }
mkdir -p "${DEST}" && chmod 700 "${DEST}"

OPTS="$(mktemp)"
trap 'rm -f "${OPTS}" "${OUT:-}.part"' EXIT
printf '[client]\nuser=%s\npassword="%s"\nhost=localhost\n' "${DB_USER}" "$(cat "${SECRETS}/db_password")" > "${OPTS}"

OUT="${DEST}/esct-$(date +%F_%H%M).sql.gz"
# --single-transaction : copie cohérente sans bloquer le site (tables InnoDB)
mysqldump --defaults-extra-file="${OPTS}" --single-transaction --quick --routines --triggers \
  --default-character-set=utf8mb4 "${DB_NAME}" | gzip -9 > "${OUT}.part"
gzip -t "${OUT}.part"
mv "${OUT}.part" "${OUT}"

find "${DEST}" -name 'esct-*.sql.gz' -type f -mtime "+${KEEP_DAYS}" -delete

echo "🥊 Sauvegarde : ${OUT} ($(du -h "${OUT}" | cut -f1)), $(find "${DEST}" -name 'esct-*.sql.gz' | wc -l) fichier(s) conservé(s)"

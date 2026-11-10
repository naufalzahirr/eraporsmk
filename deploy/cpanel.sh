#!/bin/bash
set -euo pipefail

SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
TARGET="${ERAPOR_DEPLOY_PATH:-$HOME/apps/erapor}"
PHP_BIN="${ERAPOR_PHP_BIN:-/opt/cpanel/ea-php82/root/usr/bin/php}"

if [[ "$TARGET" != /* || "$TARGET" == / || "$TARGET" == "$HOME" ]]; then
    echo 'Target harus berupa direktori aplikasi absolut, bukan / atau home.' >&2
    exit 1
fi
mkdir -p "$TARGET"
TARGET="$(cd "$TARGET" && pwd -P)"
case "$TARGET/" in
    "$SOURCE/"*) echo 'Target tidak boleh di dalam repository sumber.' >&2; exit 1 ;;
esac
case "$SOURCE/" in
    "$TARGET/"*) echo 'Repository sumber tidak boleh di dalam target.' >&2; exit 1 ;;
esac
if [[ ! -x "$PHP_BIN" ]]; then
    echo 'PHP 8.2 cPanel tidak ditemukan. Atur ERAPOR_PHP_BIN.' >&2
    exit 1
fi

# Pemeriksaan konfigurasi target dilakukan sebelum menyalin aplikasi.
"$PHP_BIN" "$SOURCE/deploy/preflight.php" "$TARGET"

# Tidak memakai --delete: data runtime tidak dihapus saat deploy ulang.
/usr/bin/rsync -a \
    --exclude='/.git/' --exclude='/.gitignore' --exclude='/.cpanel.yml' \
    --exclude='/.env' --exclude='/.env.*' --exclude='/.encapp' \
    --exclude='/.encapp.example' --exclude='/private-install/' \
    --exclude='/dist/' --exclude='/writable/' \
    --exclude='/public/uploads/' --exclude='/public/pdf/' \
    --exclude='/public/excel/' --exclude='/public/restore/' \
    --exclude='/public/restoresp/' --exclude='/public/tempup/' \
    --exclude='/public/bcfile/' --exclude='*.log' \
    "$SOURCE/" "$TARGET/"

for dir in writable/cache writable/debugbar writable/logs writable/session writable/uploads \
    public/uploads public/pdf public/excel public/restore public/restoresp public/tempup public/bcfile; do
    mkdir -p "$TARGET/$dir"
    chmod 0750 "$TARGET/$dir"
done
cp "$SOURCE/writable/.htaccess" "$TARGET/writable/.htaccess"
cp "$SOURCE/writable/index.html" "$TARGET/writable/index.html"
chmod 0750 "$TARGET/writable"
chmod 0600 "$TARGET/.env" "$TARGET/.encapp"
echo "File deployment selesai. Document root domain: $TARGET/public"
echo 'Lanjutkan pengujian web, koneksi database, dan Dapodik; ini belum merupakan uji aplikasi.'

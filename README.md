# e-Rapor SMK 2025.1 — persiapan cPanel Linux

Paket aplikasi diekstrak dari installer yang diberikan pengguna, tanpa menjalankan
installer Windows. Kode aplikasi bawaan dan vendor dipertahankan. Tambahan pada
paket ini adalah template konfigurasi dan alat deployment.

**Status: siap untuk konfigurasi dan uji pada VPS, belum terbukti berfungsi di Linux.**
Sebanyak 366 file PHP aplikasi memakai ionCube. Mesin lokal belum memiliki Loader
dan tidak ada akses VPS yang digunakan, sehingga login, database, lisensi Loader,
backup/restore, update online, cetak, dan koneksi Dapodik belum diuji. Bagian yang
menggunakan executable/path Windows mungkin memerlukan dukungan pengembang.
Jangan menganggap salinan deployment sebagai instalasi produksi yang sudah lulus uji.

## Kebutuhan VPS

- PHP 8.2 untuk domain DAN CLI deployment.
- ionCube Loader Linux yang kompatibel dengan file paket; uji file asli di server.
- PostgreSQL yang kompatibel dengan dump asal PostgreSQL 14.17 (dump dibuat pg_dump 15.2).
- Ekstensi PHP: pgsql, pdo_pgsql, intl, mbstring, curl, gd, zip, dom, xml, fileinfo, openssl.
- Apache/LiteSpeed dengan rewrite dan dukungan .htaccess; HTTPS aktif pada subdomain.
- SSH/Terminal, rsync, dan ruang disk yang cukup untuk aplikasi, database, cetakan, backup.

Pada WHM/EasyApache pasang Loader untuk PHP domain. Loader milik PHP internal cPanel
tidak otomatis berarti Loader sudah aktif pada PHP website. Periksa keduanya.
Jangan mengganti driver database dengan MySQL/MariaDB.

## Instalasi dari ZIP (tanpa GitHub)

1. Upload ZIP aplikasi ke direktori privat, misalnya `/home/USER/apps/erapor`,
   lalu ekstrak di sana. ZIP berisi file langsung di root, bukan satu folder pembungkus.
2. Di cPanel Domains buat subdomain dan set document root ke
   `/home/USER/apps/erapor/public`. Pilih PHP 8.2 dan aktifkan sertifikat HTTPS.
   Jangan jadikan seluruh folder aplikasi sebagai document root.
3. Buat database PostgreSQL baru dan user dengan hak akses database tersebut.
   Gunakan nama lengkap berprefiks akun yang ditampilkan cPanel.
4. Salin `.env.example` ke `.env` dan `.encapp.example` ke `.encapp` di root aplikasi.
   Ganti domain dan semua `CHANGE_ME`. Samakan user/password/port pada kedua file.
   Gunakan port PostgreSQL VPS (umumnya 5432), bukan port installer Windows.
   `.encapp` mempertahankan format konfigurasi bawaan; pemakaiannya di Linux masih perlu diuji.
5. Jalankan dari Terminal cPanel di direktori aplikasi:

   ```bash
   chmod 600 .env .encapp
   mkdir -p writable/cache writable/debugbar writable/logs writable/session writable/uploads
   mkdir -p public/uploads public/pdf public/excel public/restore public/restoresp public/tempup public/bcfile
   chmod 750 writable writable/cache writable/debugbar writable/logs writable/session writable/uploads
   chmod 750 public/uploads public/pdf public/excel public/restore public/restoresp public/tempup public/bcfile
   /opt/cpanel/ea-php82/root/usr/bin/php deploy/preflight.php
   ```

   Ganti path PHP jika instalasi panel berbeda. Pastikan PHP domain memakai modul yang sama.
   Script preflight tidak memuat aplikasi dan tidak menguji koneksi database.
6. Restore database awal terpisah sesuai bagian berikut. Buka HTTPS subdomain dan
   jalankan registrasi/pengaturan sesuai panduan resmi. Ganti password akun awal.

## Database awal, terpisah dari Git dan ZIP aplikasi

Salinan lokal: `private-install/initial.cpanel.sql`. Tidak ada data siswa/nilai/sekolah
di blok COPY dump awal yang diperiksa; ada referensi aplikasi dan satu akun awal.
File ini tetap privat dan tidak disertakan dalam ZIP aplikasi.

Upload file tersebut ke direktori di luar `public`, misalnya
`/home/USER/private/erapor/initial.cpanel.sql`, dengan izin file 600.
Pemilik database pada dump sudah dinetralkan: 144 pernyataan `ALTER ... OWNER TO`
dihapus dari salinan, tanpa mengganti data. Dump asli tetap pada lokasi ekstraksi.

HANYA pada database baru yang kosong, jalankan (ganti nama user/database/path):

```bash
psql -X -h 127.0.0.1 -p 5432 -U USER_DATABASE -d DATABASE_BARU -W \
  -v ON_ERROR_STOP=1 --single-transaction -f /home/USER/private/erapor/initial.cpanel.sql
```

Password diminta oleh psql, jangan ditulis pada perintah. Restore dilakukan manual
sekali; script deployment tidak merestore atau menghapus database. Jika import
gagal, selesaikan error yang dilaporkan sebelum melanjutkan. Jangan import ke
database produksi berisi data.

## GitHub private dan Git Version Control cPanel

Folder ini adalah repository Git lokal. GitHub belum dibuat/push. Autentikasi gh
lokal saat diperiksa tidak valid. Setelah login GitHub diperbaiki, buat repository
private lalu push branch `main` ke remote yang dipilih.

Vendor bawaan sengaja ikut version control agar dependency persis dengan paket
installer; jangan menjalankan `composer update`. File `.env`, `.encapp`, database,
log, runtime uploads, dan ZIP diabaikan Git. PDF panduan besar tidak masuk Git;
untuk deployment Git, salin manual `public/file_panduan/panduan.pdf` dari ZIP aplikasi
jika tautan panduan dalam aplikasi diperlukan.

1. Clone repository private melalui Git Version Control cPanel ke
   `/home/USER/repositories/erapor-cpanel`, di luar direktori web.
   Atur akses deploy key sesuai kebutuhan GitHub/cPanel.
2. Buat target `/home/USER/apps/erapor` dan letakkan `.env` serta `.encapp` yang
   sudah terisi di target itu sebelum deployment pertama. Restore database terpisah.
3. Atur document root domain ke `/home/USER/apps/erapor/public`.
4. Gunakan **Update from Remote**, lalu **Deploy HEAD Commit** di cPanel.
   `.cpanel.yml` memanggil `deploy/cpanel.sh`, yang secara default menggunakan
   `$HOME/apps/erapor` dan PHP `/opt/cpanel/ea-php82/root/usr/bin/php`.

GitHub push tidak otomatis men-deploy cPanel tanpa pengaturan tambahan. Untuk
deployment manual melalui shell, target dan PHP bisa diganti lewat
`ERAPOR_DEPLOY_PATH` dan `ERAPOR_PHP_BIN`. Untuk deployment UI cPanel, sesuaikan
default script sebelum commit jika path server berbeda. Jangan memasukkan rahasia
ke `.cpanel.yml` atau script.

Deployment tidak memakai `--delete`, tidak menimpa `.env`/`.encapp`, dan tidak
menyalin ulang writable/hasil unggahan. Pembaruan yang mengganti nama atau menghapus
file aplikasi perlu ditinjau manual; script bukan mekanisme rollback atomik.
Cadangkan file dan database sebelum pembaruan produksi.

## Uji yang harus dilakukan di VPS

- Preflight CLI lulus; Loader juga aktif pada PHP web.
- Halaman login dan registrasi terbuka, tidak ada error Loader/lisensi/path.
- Login, konfigurasi sekolah, input nilai, unggah, serta cetak PDF/Excel berfungsi.
- Tarik data dan kirim nilai Dapodik berhasil. IP lokal sekolah tidak bisa langsung
  diakses VPS; sediakan koneksi privat/VPN yang sesuai dan aturan webservice.
- Backup dan restore diuji pada database uji. Kode bagian ini terenkripsi, sehingga
  penggunaan utilitas Windows belum bisa dikesampingkan.
- Uji update online pada salinan uji sebelum produksi; jangan otomatis menimpa
  deployment Linux dengan paket pembaruan Windows.
- Pastikan HTTP dialihkan ke HTTPS dan file konfigurasi/database tidak dapat
  diunduh melalui URL. Gunakan aturan firewall yang diperlukan saja.

## Referensi

- [Deployment CodeIgniter](https://codeigniter.com/user_guide/installation/deployment.html)
- [Git deployment cPanel](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/)
- [PostgreSQL cPanel](https://docs.cpanel.net/cpanel/databases/postgresql-databases/)
- [ionCube Loader resmi](https://www.ioncube.com/loaders.php)

Catatan hak penggunaan aplikasi ada pada `UPSTREAM-NOTICE.txt` dan
`UPSTREAM-README.txt`. File LICENSE di root adalah lisensi framework bawaan,
bukan pernyataan lisensi baru untuk aplikasi e-Rapor.

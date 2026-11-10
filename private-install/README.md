Database awal dari installer tersedia secara lokal pada direktori ini sebagai
`initial.cpanel.sql`. File tersebut tidak dimasukkan ke Git atau ZIP aplikasi.
Simpan dan unggah terpisah ke direktori privat di VPS, di luar document root.
Database ini memuat referensi bawaan dan satu akun awal; perlakukan sebagai file
privat dan ganti password akun awal setelah registrasi/login.

Hanya pernyataan ALTER ... OWNER TO pada salinan dump yang dihapus agar restore
bisa memakai pemilik database cPanel, bukan role postgres. Data tidak diubah.
Restore harus dilakukan ke database BARU yang kosong. Lihat README utama.

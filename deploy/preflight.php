<?php

// Pemeriksaan lingkungan saja; tidak menjalankan kode aplikasi terenkripsi.
$target = $argv[1] ?? dirname(__DIR__);
$failed = false;
$check = static function (string $name, bool $ok) use (&$failed): void {
    echo ($ok ? '[OK] ' : '[FAIL] ') . $name . PHP_EOL;
    $failed = $failed || !$ok;
};
$check('PHP 8.2 (versi paket installer)', PHP_MAJOR_VERSION === 8 && PHP_MINOR_VERSION === 2);
foreach (['ionCube Loader', 'pgsql', 'pdo_pgsql', 'intl', 'mbstring', 'curl', 'gd', 'zip', 'dom', 'xml', 'fileinfo', 'openssl'] as $extension) {
    $check('Ekstensi ' . $extension, extension_loaded($extension));
}
foreach (['.env', '.encapp'] as $file) {
    $path = $target . '/' . $file;
    $text = is_readable($path) ? file_get_contents($path) : '';
    $check($file . ' tersedia dan placeholder telah diganti', $text !== '' && !str_contains($text, 'CHANGE_ME') && !str_contains($text, 'example.sch.id'));
    if ($file === '.env' && $text !== '') {
        $check('CI_ENVIRONMENT production', (bool) preg_match('/^\s*CI_ENVIRONMENT\s*=\s*[\'"]?production[\'"]?\s*$/m', $text));
        $check('baseURL HTTPS', (bool) preg_match('/^\s*app\.baseURL\s*=\s*[\'"]https:\/\//m', $text));
        $check('Driver PostgreSQL', (bool) preg_match('/^\s*database\.default\.DBDriver\s*=\s*[\'"]?Postgre[\'"]?\s*$/m', $text));
    }
}
$check('Vendor bawaan tersedia', is_file(dirname(__DIR__) . '/vendor/autoload.php'));
echo 'Pemeriksaan ini belum memvalidasi lisensi ionCube, database, atau fitur aplikasi.' . PHP_EOL;
exit($failed ? 1 : 0);

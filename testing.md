# Testing Checklist Replate

## Auth
- [-] Register akun baru
- [-] Login
- [-] Logout
- [-] Admin auto-redirect ke /admin/dashboard
- [-] Partner auto-redirect ke /partner/dashboard
- [x] User blacklisted tidak bisa login

## Upload Produk
- [ -] Upload dengan semua field terisi → berhasil
- [-] Upload tanpa foto → error muncul (toast merah)
- [-] Upload tanpa judul → error muncul
- [-] Upload kategori "olahan" dengan akun biasa → ditolak
- [ ] Upload tanpa lokasi di profil → redirect ke profil
- [-] Pilih satuan "kotak" → quantity tampil benar di detail

## Marketplace
- [-] Produk tampil dengan foto, harga, badge
- [-] Filter kategori berfungsi
- [-] Filter kondisi berfungsi
- [-] Filter mode transaksi berfungsi
- [-] Search by judul berfungsi
- [-] Sorting (terbaru, harga, timeout) berfungsi

## Jual-Beli
- [-] Klik "Beli" → transaksi pending
- [-] Tidak bisa beli produk sendiri
- [-] Penjual konfirmasi → status confirmed
- [-] Pembeli konfirmasi terima → status completed + produk sold
- [-] Pembeli lapor basi (dispute) → status dispute_spoiled + produk dibatalkan + report dibuat
- [-] Penjual dapat RePoin setelah complete
- [-] Cancel transaksi berfungsi

## Barter
- [-] Ajukan barter → tawaran masuk ke penjual
- [-] Timer produk pause saat ada barter offer
- [-] Penjual setuju → transaksi barter dibuat
- [-] Penjual tolak → produk kembali tayang
- [-] Timer unpause kalau semua barter ditolak

## Donasi
- [-] Upload produk mode donasi → tampil di marketplace
- [-] Klaim donasi → transaksi pending
- [-] Konfirmasi → selesai + produk donated

## Timeout
- [-] php artisan products:process-timeout → jalan tanpa error
- [-] Stage 1: harga turun 25%
- [-] Stage 2: masuk jalur donasi
- [-] Stage 3: dialihkan ke partner (cek kuota)

## Chat
- [-] Chat dari detail produk → buka percakapan
- [-] Kirim pesan → muncul di penerima
- [-] Balas pesan → muncul di pengirim
- [-] Inbox menampilkan semua percakapan

## Admin
- [-] Dashboard: chart tampil dengan data
- [-] Verifikasi: approve → user jadi verified_seller
- [-] Verifikasi: reject → status rejected + catatan
- [-] Reports: review → produk dihapus + warning ke penjual
- [-] Reports: dismiss → laporan diabaikan
- [-] Partner: tambah partner baru
- [-] Partner: toggle aktif/nonaktif
- [-] Users: blacklist user

## Partner
- [-] Dashboard: produk yang dialihkan tampil
- [-] Konfirmasi pengambilan → transaksi selesai
- [-] Penjual dapat RePoin setelah partner konfirmasi

## RePoin
- [-] Poin muncul di sidebar
- [-] Halaman /points menampilkan saldo + riwayat
- [-] Formula: layak konsumsi 3x, layak olah 2x, pakan 1x

## Notifikasi
- [-] Bell icon menampilkan badge unread
- [-] Halaman notifikasi menampilkan semua notif
- [-] Buka halaman → badge hilang (sudah dibaca)

## Profil Penjual
- [-] Klik nama penjual → lihat profil + produk aktif
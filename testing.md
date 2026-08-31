# Testing Checklist Replate

## Auth & Hak Akses Role
- [ ] Register akun baru (role: user)
- [ ] Login user biasa → akses dashboard pengguna & marketplace
- [ ] Login Admin → auto-redirect ke `/admin/dashboard` (hanya navigasi admin, tanpa tombol Upload/Beli)
- [ ] Login Partner → auto-redirect ke `/partner/dashboard` (hanya navigasi mitra, tanpa tombol Upload/Beli)
- [v] Logout
- [ ] User blacklisted tidak bisa login

## Upload Produk
- [ ] Upload dengan semua field terisi → berhasil
- [ ] Input alamat penjemputan & catatan penjemputan khusus (opsional)
- [ ] Pilih jenis penjemputan ("Diambil Pembeli/Mitra" atau "Diantar Penjual")
- [ ] Upload tanpa foto → error muncul (toast merah)
- [ ] Upload tanpa judul → error muncul
- [ ] Upload kategori "olahan" dengan akun biasa → ditolak (harus UMKM/Verified Seller)
- [ ] Upload tanpa lokasi di profil → redirect ke profil
- [ ] Pilih kondisi produk:
  - Layak Konsumsi / Siap Santap
  - Bahan Olahan / Perlu Diolah
  - Pakan / Kompos
- [ ] Pilih satuan (kg, gram, porsi, bungkus, buah, dll.) → quantity & berat tampil benar di detail

## Marketplace
- [ ] Produk tampil dengan foto, harga, badge kategori & kondisi
- [ ] Filter kategori berfungsi
- [ ] Filter kondisi berfungsi (Layak Konsumsi, Bahan Olahan, Pakan/Kompos)
- [ ] Filter mode transaksi berfungsi (Jual, Barter, Donasi)
- [ ] Search by judul/deskripsi berfungsi
- [ ] Sorting (terbaru, harga termurah/termahal, sisa waktu) berfungsi

## Jual-Beli & Pembelian Parsial
- [ ] Halaman detail produk menampilkan harga satuan (Rp/kg atau Rp/unit)
- [ ] Pengaturan jumlah pembelian (selector `-` dan `+` atau input angka) untuk produk dengan stok > 1
- [ ] Total harga terhitung otomatis sesuai jumlah yang dipilih
- [ ] Klik "Beli" → transaksi pending dibuat dengan kuantitas yang dipilih
- [ ] Tidak bisa beli produk sendiri
- [ ] Admin / Mitra tidak dapat membeli produk (tampil badge informasi mode khusus)
- [ ] Penjual konfirmasi pesanan → status confirmed
- [ ] Pembeli konfirmasi terima → status completed + produk sold / kuantitas berkurang
- [ ] Pembeli lapor basi (dispute) → status dispute_spoiled + dialihkan ke mitra + laporan dibuat
- [ ] Penjual dapat RePoin setelah transaksi complete
- [ ] Cancel transaksi berfungsi sebelum dikonfirmasi penjual

## Barter
- [ ] Ajukan barter → tawaran masuk ke penjual
- [ ] Timer produk pause saat ada barter offer
- [ ] Penjual setuju → transaksi barter dibuat
- [ ] Penjual tolak → produk kembali tayang
- [ ] Timer unpause kalau semua tawaran barter ditolak

## Donasi
- [ ] Upload produk mode donasi → tampil di marketplace dengan badge gratis
- [ ] Klaim donasi → transaksi pending
- [ ] Konfirmasi serah terima → selesai + produk status donated
- [ ] Penjual/pendonor mendapat RePoin

## Timeout & Alih Fungsi Otomatis
- [ ] Jalankan `php artisan products:process-timeout`
- [ ] Stage 1 (75% durasi): harga otomatis turun diskon 25%
- [ ] Stage 2 (100% durasi): produk otomatis beralih ke jalur donasi
- [ ] Stage 3 (24 jam pasca donasi): otomatis dialihkan ke tugas mitra (sesuai kuota & kapasitas harian)

## Chat
- [ ] Chat dari detail produk → buka percakapan dengan penjual
- [ ] Kirim pesan teks → muncul di penerima secara realtime
- [ ] Balas pesan → muncul di pengirim
- [ ] Inbox (`/chat`) menampilkan seluruh daftar percakapan aktif

## Admin Panel
- [ ] Dashboard (`/admin/dashboard`): ringkasan metrik & chart transaksi
- [ ] Verifikasi (`/admin/verifications`): approve penjual olahan → verified seller
- [ ] Verifikasi: reject → status ditolak dengan catatan
- [ ] Laporan (`/admin/reports`): tinjau laporan produk / sengketa
- [ ] Partner (`/admin/partners`): tambah mitra baru, atur kapasitas harian (kg), toggle status aktif
- [ ] Pengguna (`/admin/users`): kelola pengguna & blacklist
- [ ] Tukar RePoin (`/admin/redeem`): cari user berdasarkan nomor HP / nama, proses penukaran poin ke sembako / voucher

## Partner Panel (Mitra Pengolah)
- [ ] Sidebar navigasi mitra: **Tugas Penjemputan** dan **Riwayat Penerimaan**
- [ ] **Tugas Penjemputan (`/partner/dashboard`)**:
  - Daftar produk yang dialihkan ke mitra
  - Menampilkan alamat penjemputan lengkap (`pickup_address` / alamat profil) & catatan penjemputan
  - Menampilkan nama & kontak penjual + tombol langsung chat WhatsApp
  - Menampilkan jumlah unit, berat (kg/gram), dan tipe pengantaran
  - Tombol "Konfirmasi Diterima" → alih fungsi selesai
- [ ] **Riwayat Penerimaan (`/partner/history`)**:
  - Menampilkan seluruh log penerimaan yang telah selesai
  - Filter / pencarian riwayat berdasarkan nama produk, penjual, atau desa
  - Rekapitulasi total kilogram makanan yang berhasil diselamatkan
- [ ] Penjual menerima RePoin setelah mitra menyelesaikan konfirmasi

## RePoin & Poin Reward
- [ ] Saldo RePoin tampil di sidebar user
- [ ] Halaman `/points` menampilkan saldo aktif dan riwayat perolehan/pengeluaran
- [ ] Formula kalkulasi:
  - Layak Konsumsi: 3 poin / kg
  - Bahan Olahan: 2 poin / kg
  - Pakan / Kompos: 1 poin / kg

## Notifikasi
- [ ] Ikon lonceng (bell) menampilkan badge counter belum dibaca (unread)
- [ ] Halaman `/notifications` menampilkan daftar notifikasi aktivitas
- [ ] Membuka halaman notifikasi otomatis membersihkan badge unread

## Profil Penjual
- [ ] Klik nama penjual di detail produk → membuka halaman profil publik penjual
- [ ] Profil menampilkan reputasi, statistik barang terjual/tersalurkan, dan daftar produk aktif yang sedang dijual
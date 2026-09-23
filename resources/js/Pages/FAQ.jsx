import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown, ArrowLeft, HelpCircle } from 'lucide-react';
import NavbarLayout from '@/Layouts/NavbarLayout';

function FAQItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left"
            >
                <span className="text-sm sm:text-base font-bold text-gray-900 pr-4">{question}</span>
                <ChevronDown
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="pb-5 -mt-2">
                    <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

const faqData = [
    {
        category: 'Umum & Konsep',
        items: [
            {
                question: 'Apa itu Replate?',
                answer: 'Replate adalah platform digital sirkular pangan desa yang menghubungkan warga, warung, petani, dan UMKM penghasil surplus makanan dengan pihak yang membutuhkan — melalui jual-beli berdiskon, barter hasil bumi, donasi gratis, dan pengalihan ke mitra peternak & kompos.',
            },
            {
                question: 'Siapa saja yang bisa menggunakan Replate?',
                answer: 'Seluruh warga desa: rumah tangga, warung makan, petani, toko sembako, dan katering. Mitra pengolah seperti peternak sapi/kambing, pembudidaya maggot BSF, dan pengompos desa juga terintegrasi langsung.',
            },
            {
                question: 'Apakah aplikasi Replate memungut biaya?',
                answer: 'Tidak, Replate 100% gratis digunakan oleh warga dan dikelola secara terdesentralisasi bersama BUMDes untuk ketahanan pangan desa.',
            },
            {
                question: 'Apa itu BUMDes Hub / Titik Serah Terima?',
                answer: 'BUMDes Hub adalah posko fisik di balai desa / kantor BUMDes yang berfungsi sebagai lokasi serah terima pangan, pos penukaran RePoin sembako, dan pusat koordinasi logistik mitra desa.',
            },
        ],
    },
    {
        category: 'Jual-Beli & Pembelian Parsial',
        items: [
            {
                question: 'Bagaimana cara membeli produk di Replate?',
                answer: 'Buka menu Marketplace, pilih produk yang Anda inginkan, tentukan jumlah kuantitas pembelian (jika stok lebih dari 1), lalu klik tombol "Beli". Pesanan akan masuk ke penjual untuk dikonfirmasi.',
            },
            {
                question: 'Apakah saya bisa membeli sebagian jumlah produk saja (parsial)?',
                answer: 'Ya! Untuk produk dengan stok lebih dari 1 (misal 5 kg beras atau 10 porsi roti), pembeli bebas memilih jumlah yang ingin dibeli dengan tombol (+) dan (-). Sisa stok akan tetap tayang di marketplace untuk pembeli lain.',
            },
            {
                question: 'Bagaimana metode pembayaran dan pengambilan barang?',
                answer: 'Pembayaran dilakukan secara langsung (COD tunai atau QRIS penjual) saat serah terima barang. Lokasi pengambilan dapat berupa COD di alamat penjual atau diantar penjual sesuai opsi penjemputan yang dicantumkan.',
            },
            {
                question: 'Kapan transaksi dinyatakan selesai?',
                answer: 'Setelah pembeli menerima makanan dan mengecek kondisinya, pembeli menekan tombol "Konfirmasi Terima Pesanan" di halaman detail transaksi. Sistem akan mencatat transaksi selesai dan memberikan RePoin ke penjual.',
            },
        ],
    },
    {
        category: 'Donasi & Barter',
        items: [
            {
                question: 'Bagaimana cara mengklaim donasi makanan?',
                answer: 'Produk berlabel donasi gratis dapat diklaim langsung di marketplace. Anda bisa menentukan berapa porsi/unit donasi yang diambil, lalu mengonfirmasi janji temu serah terima dengan pendonor.',
            },
            {
                question: 'Bagaimana alur barter hasil bumi di Replate?',
                answer: 'Pada produk berlabel "Barter" atau "Jual & Barter", klik tombol "Ajukan Barter", tentukan barang yang Anda tawarkan (misal: 2 sisir pisang ditukar 1 kg cabai). Penjual dapat menerima, menolak, atau bernegosiasi via fitur Chat.',
            },
            {
                question: 'Apa yang terjadi jika tawaran barter ditolak?',
                answer: 'Jika tawaran barter ditolak, produk akan kembali aktif di marketplace sehingga pengguna lain dapat mengajukan penawaran baru.',
            },
        ],
    },
    {
        category: 'Sistem RePoin & Penukaran Reward',
        items: [
            {
                question: 'Apa itu RePoin dan bagaimana perhitungannya?',
                answer: 'RePoin adalah poin apresiasi yang otomatis didapatkan penjual/pendonor setiap berhasil menyelamatkan makanan. Formula perolehan: Layak Konsumsi = 3 poin/kg, Bahan Olahan = 2 poin/kg, Pakan Ternak & Kompos = 1 poin/kg.',
            },
            {
                question: 'Kapan saldo RePoin bertambah?',
                answer: 'RePoin otomatis masuk ke saldo akun Anda sesaat setelah pihak penerima (pembeli/penerima donasi/mitra) menekan konfirmasi penerimaan barang fisik.',
            },
            {
                question: 'Bagaimana cara menukarkan RePoin?',
                answer: 'Kunjungi halaman RePoin (/points) untuk melihat katalog reward (paket beras, minyak goreng, gula pasir, voucher diskon). Kunjungi BUMDes Hub dan tunjukkan Kode Unik Klaim QR Anda kepada petugas admin untuk mengambil barang.',
            },
        ],
    },
    {
        category: 'Timeout & Mitra Pengolah Desa',
        items: [
            {
                question: 'Apa itu alih fungsi otomatis berjenjang (3-Stage Timeout)?',
                answer: 'Tahap 1 (75% durasi): Diskon harga otomatis 25% agar cepat terjual. Tahap 2 (100% durasi): Otomatis dialihkan ke jalur donasi gratis. Tahap 3 (24 jam pasca donasi): Otomatis dialihkan ke tugas penjemputan mitra peternak & kompos desa.',
            },
            {
                question: 'Siapa itu Mitra Pengolah dan apa tugasnya?',
                answer: 'Mitra Pengolah adalah kelompok peternak, pembudidaya maggot, dan pengelola kompos organik desa yang bertugas mengambil sisa makanan yang tidak habis atau makanan basi untuk dimanfaatkan sebagai pakan dan pupuk.',
            },
        ],
    },
    {
        category: 'Kualitas & Penanganan Sengketa (Dispute)',
        items: [
            {
                question: 'Bagaimana jika makanan yang diterima ternyata basi / rusak?',
                answer: 'Pembeli dapat menekan tombol "Laporkan Basi / Sengketa" di halaman detail transaksi sebelum menekan selesai. Status transaksi akan beralih menjadi sengketa, dan sisa bahan tersebut otomatis diarahkan ke pos mitra pengolah untuk dijadikan kompos tanpa terbuang ke TPA.',
            },
            {
                question: 'Bagaimana cara menjadi Penjual Olahan Terverifikasi (UMKM)?',
                answer: 'Warga yang ingin menjual produk olahan siap santap/kemasan dapat mengajukan verifikasi di menu "Daftar Penjual Olahan" dengan melampirkan foto tempat produksi dan izin PIRT/rekomendasi desa untuk diverifikasi oleh Admin BUMDes.',
            },
            {
                question: 'Siapa yang bertanggung jawab atas kualitas makanan yang dijual?',
                answer: 'Penjual sepenuhnya bertanggung jawab atas keakuratan deskripsi produk dan kondisi pangan yang ditawarkan. Replate menyediakan mekanisme pelaporan sengketa sebagai jaring pengaman, namun tidak berperan sebagai perantara keuangan maupun penjamin kualitas pihak ketiga.',
            },
        ],
    },
    {
        category: 'Menjadi Mitra Pengolah',
        items: [
            {
                question: 'Siapa saja yang bisa mendaftar sebagai Mitra Pengolah di Replate?',
                answer: 'Ada tiga jenis mitra yang bisa bergabung: (1) Peternak — pemilik kandang sapi, kambing, ayam, atau bebek yang membutuhkan suplai pakan rutin; (2) Pembudidaya Maggot BSF — yang memanfaatkan sisa organik untuk pakan larva; (3) Pengelola Kompos Desa — kelompok tani atau individu yang mengolah limbah organik menjadi pupuk kompos.',
            },
            {
                question: 'Bagaimana cara mendaftar sebagai Mitra Pengolah?',
                answer: 'Pendaftaran dilakukan langsung melalui Admin BUMDes desa Anda. Datang ke kantor BUMDes atau hubungi admin via nomor resmi desa, lalu sampaikan jenis usaha pengolahan, kapasitas penerimaan per minggu (dalam kg), dan alamat lokasi pengambilan. Admin akan mendaftarkan akun partner Anda ke sistem Replate.',
            },
            {
                question: 'Apa saja kewajiban dan tugas Mitra Pengolah?',
                answer: 'Mitra wajib: (1) Merespons dan mengambil sisa pangan yang dialihkan sistem dalam waktu 24 jam; (2) Memastikan kendaraan pengambilan layak dan higienis; (3) Melaporkan jumlah penerimaan aktual (kg) ke sistem setelah pengambilan selesai sebagai bukti daur ulang. Mitra yang tidak responsif selama 3 kali berturut-turut dapat dinonaktifkan oleh admin.',
            },
            {
                question: 'Apakah Mitra Pengolah mendapat kompensasi atau keuntungan?',
                answer: 'Mitra mendapatkan: (1) Suplai bahan pakan/kompos organik secara gratis atau dengan harga sangat terjangkau; (2) Akses ke dashboard khusus untuk melihat jadwal penjemputan dan riwayat penerimaan; (3) Sertifikat kontribusi lingkungan dari BUMDes sebagai bukti partisipasi program sirkular desa yang dapat digunakan untuk pengajuan CSR atau hibah desa.',
            },
            {
                question: 'Berapa kapasitas minimum penerimaan untuk bisa menjadi Mitra?',
                answer: 'Tidak ada batas minimum yang ketat. Mitra dengan kapasitas kecil pun bisa bergabung (misalnya pembudidaya maggot skala rumahan yang sanggup menerima 5 kg/minggu). Yang terpenting adalah komitmen untuk hadir dan mengambil sisa pangan sesuai jadwal yang disepakati bersama admin BUMDes.',
            },
        ],
    },
    {
        category: 'Akun & Keamanan Data',
        items: [
            {
                question: 'Data apa saja yang dikumpulkan Replate dari pengguna?',
                answer: 'Replate hanya mengumpulkan data yang diperlukan untuk operasional platform: nama, nomor telepon/email, desa asal, dan riwayat transaksi anonim. Data tidak dijual kepada pihak ketiga manapun dan dikelola sepenuhnya oleh BUMDes setempat sesuai prinsip kedaulatan data desa.',
            },
            {
                question: 'Bagaimana cara mengubah kata sandi atau email akun saya?',
                answer: 'Masuk ke menu Profil → Pengaturan Akun → pilih "Ubah Email" atau "Ubah Kata Sandi". Anda akan menerima kode verifikasi OTP ke nomor telepon atau email terdaftar untuk mengonfirmasi perubahan.',
            },
            {
                question: 'Apa yang terjadi jika akun saya tidak aktif dalam waktu lama?',
                answer: 'Akun yang tidak aktif lebih dari 12 bulan akan diarsipkan secara otomatis. Saldo RePoin Anda tetap tersimpan dan dapat diaktifkan kembali dengan login. Listing produk aktif akan dinonaktifkan sementara selama periode tidak aktif.',
            },
            {
                question: 'Apakah saya bisa menghapus akun dan data saya secara permanen?',
                answer: 'Ya. Anda dapat mengajukan penghapusan akun melalui menu Profil → Pengaturan → "Hapus Akun". Admin BUMDes akan memproses permintaan dalam 7 hari kerja. Riwayat transaksi yang telah selesai disimpan dalam laporan agregat anonim desa sesuai kebijakan tata kelola BUMDes.',
            },
        ],
    },
    {
        category: 'Notifikasi & Chat',
        items: [
            {
                question: 'Bagaimana cara berkomunikasi dengan penjual atau pembeli?',
                answer: 'Setiap listing produk memiliki tombol "Chat" untuk memulai percakapan langsung dengan penjual. Riwayat chat tersimpan di menu Pesan dan dapat diakses kapan saja. Chat hanya dapat dimulai setelah produk masih aktif/tersedia.',
            },
            {
                question: 'Notifikasi apa saja yang akan saya terima dari Replate?',
                answer: 'Anda akan mendapat notifikasi untuk: (1) pesanan masuk/dikonfirmasi, (2) diskon otomatis tahap 1 produk Anda, (3) produk yang hampir kedaluwarsa, (4) RePoin yang baru masuk, (5) pengumuman program desa dari admin BUMDes.',
            },
            {
                question: 'Apakah notifikasi bisa dimatikan untuk kategori tertentu?',
                answer: 'Ya. Buka Profil → Pengaturan Notifikasi, lalu pilih kategori notifikasi mana yang ingin dinyalakan atau dimatikan secara individual. Notifikasi darurat dari admin BUMDes tidak dapat dimatikan demi kepentingan keselamatan warga.',
            },
        ],
    },
    {
        category: 'Akses & Konektivitas',
        items: [
            {
                question: 'Apakah Replate bisa diakses tanpa koneksi internet?',
                answer: 'Replate adalah aplikasi berbasis web yang membutuhkan koneksi internet untuk transaksi real-time. Namun, halaman katalog produk yang pernah dibuka akan tersimpan sementara di cache browser sehingga bisa dilihat secara offline dalam kondisi terbatas.',
            },
            {
                question: 'Apakah Replate tersedia sebagai aplikasi mobile (Android/iOS)?',
                answer: 'Saat ini Replate diakses melalui browser di smartphone maupun komputer. Versi Progressive Web App (PWA) memungkinkan Anda "menginstal" Replate di layar utama smartphone seperti aplikasi native tanpa perlu mengunduh dari toko aplikasi.',
            },
            {
                question: 'Browser apa yang direkomendasikan untuk menggunakan Replate?',
                answer: 'Replate berjalan optimal di Google Chrome, Mozilla Firefox, Microsoft Edge, dan Safari versi terbaru. Untuk pengalaman terbaik di perangkat mobile, gunakan Chrome for Android atau Safari for iOS.',
            },
        ],
    },
];

export default function FAQ() {
    return (
        <NavbarLayout>
            <Head title="FAQ & Pusat Bantuan — Replate" />

            <div className="w-full max-w-4xl mx-auto space-y-8 py-2 sm:py-4">
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-xs">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Pertanyaan yang Sering Diajukan
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
                        Temukan informasi lengkap seputar mekanisme sirkular pangan, batas waktu aman, transaksi, hingga peran BUMDes di Replate.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqData.map((section) => (
                        <div key={section.category} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                            <h2 className="text-base font-extrabold text-emerald-800 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                                {section.category}
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {section.items.map((item, i) => (
                                    <FAQItem key={i} question={item.question} answer={item.answer} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </NavbarLayout>
    );
}
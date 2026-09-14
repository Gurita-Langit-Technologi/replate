import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';

function FAQItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left"
            >
                <span className="text-sm font-medium text-gray-900 pr-4">{question}</span>
                <ChevronDown
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="pb-5 -mt-2">
                    <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
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
        ],
    },
];

export default function FAQ() {
    return (
        <>
            <Head title="FAQ — Replate" />
            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5">
                            <img src="/image/logo(2).png" alt="Replate" className="w-auto h-12 rounded-lg object-cover" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Masuk</Link>
                            <Link href="/register" className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700">Daftar</Link>
                        </div>
                    </div>
                </nav>

                <div className="max-w-3xl mx-auto px-4 py-16">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
                        <ArrowLeft size={16} /> Kembali ke beranda
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Pertanyaan yang Sering Diajukan</h1>
                    <p className="text-gray-500 mb-10">Temukan jawaban tentang cara kerja Replate</p>

                    {faqData.map((section) => (
                        <div key={section.category} className="mb-8">
                            <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">{section.category}</h2>
                            <div className="bg-white rounded-xl border border-gray-100 px-5">
                                {section.items.map((item, i) => (
                                    <FAQItem key={i} question={item.question} answer={item.answer} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer mini */}
                <div className="border-t border-gray-100 py-6 text-center">
                    <p className="text-xs text-gray-400">© 2026 Replate</p>
                </div>
            </div>
        </>
    );
}
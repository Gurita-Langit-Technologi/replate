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
        category: 'Umum',
        items: [
            {
                question: 'Apa itu Replate?',
                answer: 'Replate adalah platform digital berbasis circular economy yang menghubungkan penghasil food waste dengan pihak yang dapat memanfaatkannya — melalui jual-beli, barter, donasi, dan kemitraan. Tujuannya agar tidak ada makanan yang berakhir menjadi sampah.',
            },
            {
                question: 'Siapa yang bisa menggunakan Replate?',
                answer: 'Semua warga desa bisa menggunakan Replate: rumah tangga, warung/restoran, petani, toko roti, minimarket, katering, dan lainnya. Peternak, pengelola kompos, dan pembudidaya maggot juga bisa bergabung sebagai mitra pengolah.',
            },
            {
                question: 'Apakah Replate gratis?',
                answer: 'Ya, seluruh fitur Replate gratis untuk semua pengguna. Platform ini dirancang untuk dikelola oleh BUMDes sebagai bagian dari ekosistem ekonomi desa.',
            },
            {
                question: 'Apa itu BUMDes Hub / Drop Point?',
                answer: 'Drop Point adalah titik kumpul fisik di kantor desa atau warung yang ditunjuk. Warga bisa menitipkan food waste di sana tanpa harus janjian langsung dengan pembeli. Penerima tinggal mengambilnya nanti.',
            },
        ],
    },
    {
        category: 'Produk & Upload',
        items: [
            {
                question: 'Produk apa saja yang bisa di-upload?',
                answer: 'Ada 3 kategori: (1) Food waste mentah — nasi sisa, sayuran layu, roti mendekati expired, buah terlalu matang. (2) Food waste olahan — kompos, pupuk organik, selai, dried fruit (khusus penjual terverifikasi). (3) Hasil bumi — singkong, telur, sayuran segar yang berlebih (untuk barter).',
            },
            {
                question: 'Apa saja tingkat kondisi produk?',
                answer: 'Ada 3 tingkat: (1) Layak Konsumsi — masih bisa dimakan langsung. (2) Layak Olah Ulang — perlu diproses dulu (tumis, jus, selai). (3) Layak Pakan/Kompos — untuk pakan ternak, kompos, atau maggot. Tingkat kondisi ini menentukan durasi tayang dan jalur distribusi produk.',
            },
            {
                question: 'Produk apa yang tidak boleh di-upload?',
                answer: 'Produk yang berjamur parah, berlendir, berbau busuk menyengat, bercampur sampah non-organik, atau mengandung bahan berbahaya tidak diperbolehkan. Produk yang melanggar akan dihapus oleh admin.',
            },
            {
                question: 'Bagaimana cara menjual produk olahan?',
                answer: 'Anda perlu mengajukan verifikasi penjual olahan terlebih dahulu. Upload dokumen PIRT atau surat rekomendasi dari Kepala Desa/BUMDes beserta foto tempat produksi. Setelah disetujui admin, Anda bisa menjual produk olahan.',
            },
        ],
    },
    {
        category: 'Barter',
        items: [
            {
                question: 'Bagaimana cara barter di Replate?',
                answer: 'Saat upload produk, pilih mode "Barter" atau "Jual & Barter", lalu tulis deskripsi barang yang Anda terima sebagai ganti. Pembeli yang tertarik bisa mengajukan tawaran barter melalui platform. Anda bisa menerima atau menolak tawaran tersebut.',
            },
            {
                question: 'Apakah barter bisa dicampur dengan uang?',
                answer: 'Ya, negosiasi barter bersifat fleksibel. Anda bisa menyepakati campuran barang + uang melalui fitur chat. Semua kesepakatan berdasarkan negosiasi kedua pihak.',
            },
            {
                question: 'Apa yang terjadi kalau barter tidak deal?',
                answer: 'Produk kembali tayang di marketplace dan timer timeout tetap berjalan (tidak di-reset). Anda bisa menerima tawaran barter dari orang lain.',
            },
        ],
    },
    {
        category: 'Timeout & Donasi',
        items: [
            {
                question: 'Apa itu sistem timeout bertingkat?',
                answer: 'Setiap produk punya batas waktu tayang. Tahap 1: mendekati batas waktu → harga turun otomatis 25%. Tahap 2: waktu habis → produk masuk jalur donasi. Tahap 3: 24 jam tidak ada yang klaim → produk dialihkan ke mitra pengolah (peternak/kompos/maggot). Tujuannya agar tidak ada food waste yang terbuang.',
            },
            {
                question: 'Berapa lama produk bisa tayang?',
                answer: 'Tergantung kondisi: Layak Konsumsi = 48 jam, Layak Olah = 5 hari, Layak Pakan/Kompos = 7 hari, Produk Olahan = 30 hari.',
            },
            {
                question: 'Apa yang terjadi saat ada negosiasi barter dan waktu hampir habis?',
                answer: 'Timer otomatis di-pause selama maksimal 12 jam saat ada tawaran barter yang sedang dinegosiasi. Kalau 12 jam tidak ada kesepakatan, timer lanjut berjalan dan tawaran otomatis dibatalkan.',
            },
        ],
    },
    {
        category: 'RePoin',
        items: [
            {
                question: 'Apa itu RePoin?',
                answer: 'RePoin adalah sistem poin reward untuk warga yang menyalurkan food waste melalui Replate. Poin dihitung berdasarkan berat barang dan kondisi kelayakan: Layak Konsumsi = 3 poin/kg, Layak Olah = 2 poin/kg, Layak Pakan/Kompos = 1 poin/kg.',
            },
            {
                question: 'Kapan RePoin masuk ke akun saya?',
                answer: 'RePoin baru cair setelah penerima (pembeli, penerima donasi, atau mitra pengolah) mengkonfirmasi bahwa barang fisik sudah diterima. Ini untuk mencegah penyalahgunaan poin.',
            },
            {
                question: 'RePoin bisa digunakan untuk apa?',
                answer: 'RePoin dapat ditukarkan menjadi potongan harga sembako, pupuk organik, atau bibit tanaman di unit BUMDes. 1 RePoin setara dengan nilai 1 kg sampah organik yang tersalurkan.',
            },
        ],
    },
    {
        category: 'Keamanan',
        items: [
            {
                question: 'Bagaimana jika produk tidak sesuai deskripsi?',
                answer: 'Anda bisa melaporkan produk melalui tombol "Laporkan" di halaman detail produk. Admin akan meninjau laporan tersebut. Jika terbukti, produk akan dihapus dan penjual diberi peringatan. 3x peringatan dikonfirmasi → akun ditangguhkan.',
            },
            {
                question: 'Siapa yang bertanggung jawab atas kondisi produk?',
                answer: 'Replate bertindak sebagai perantara, bukan penjamin kualitas. Tanggung jawab kondisi produk sepenuhnya ada pada penjual. Setiap upload disertai disclaimer yang harus disetujui.',
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
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import NavbarLayout from '@/Layouts/NavbarLayout';

export default function Terms() {
    return (
        <NavbarLayout>
            <Head title="Syarat & Ketentuan — Replate" />

            <div className="w-full max-w-4xl mx-auto space-y-8 py-2 sm:py-4">
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-xs">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Syarat & Ketentuan
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
                        Ketentuan pemanfaatan platform sirkular pangan Replate untuk warga, mitra pengolah, dan pengelola BUMDes.
                    </p>
                </div>

                    <div className="prose prose-sm prose-gray max-w-none space-y-8">
                        {/* 1 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Tentang Replate</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed space-y-3">
                                <p>Replate adalah platform digital berbasis web yang bertujuan mengoptimalkan pemanfaatan food waste melalui empat jalur distribusi: jual-beli, barter, donasi, dan kemitraan.</p>
                                <p>Platform ini dirancang untuk dikelola oleh BUMDes (Badan Usaha Milik Desa) sebagai bagian dari ekosistem ekonomi desa yang mandiri dan berkelanjutan.</p>
                            </div>
                        </section>

                        {/* 2 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Ketentuan Pengguna</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed space-y-3">
                                <p>Dengan mendaftar dan menggunakan Replate, pengguna menyetujui ketentuan berikut:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Pengguna wajib memberikan informasi yang benar dan akurat saat mendaftar, termasuk nama, lokasi desa/kecamatan, dan nomor WhatsApp.</li>
                                    <li>Setiap pengguna bertanggung jawab atas keamanan akun masing-masing.</li>
                                    <li>Pengguna dilarang membuat akun palsu atau melakukan tindakan yang merugikan pengguna lain.</li>
                                    <li>Replate berhak menangguhkan akun yang terbukti melanggar ketentuan setelah mendapat 3 (tiga) laporan yang dikonfirmasi oleh admin.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 3 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Ketentuan Produk</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed space-y-3">
                                <p>Produk yang diunggah ke platform harus memenuhi ketentuan berikut:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Produk harus berupa food waste, hasil bumi berlebih, atau produk olahan dari food waste.</li>
                                    <li>Wajib menyertakan foto produk yang jelas dan representatif.</li>
                                    <li>Wajib memilih klasifikasi kondisi yang sesuai: Layak Konsumsi, Layak Olah Ulang, atau Layak Pakan/Kompos.</li>
                                    <li>Produk yang berjamur parah, berlendir, berbau busuk, bercampur sampah non-organik, atau mengandung bahan berbahaya <strong>tidak diperbolehkan</strong>.</li>
                                    <li>Produk olahan hanya dapat diunggah oleh penjual yang telah terverifikasi.</li>
                                    <li>Penjual bertanggung jawab penuh atas kondisi dan kebenaran deskripsi produk yang diunggah.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 4 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Sistem Timeout Otomatis</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed space-y-3">
                                <p>Setiap produk yang diunggah memiliki batas waktu tayang yang ditentukan berdasarkan kondisi produk:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Layak Konsumsi:</strong> 48 jam</li>
                                    <li><strong>Layak Olah Ulang:</strong> 5 hari</li>
                                    <li><strong>Layak Pakan/Kompos:</strong> 7 hari</li>
                                    <li><strong>Produk Olahan:</strong> 30 hari</li>
                                </ul>
                                <p>Mekanisme timeout bertingkat:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Tahap 1:</strong> Mendekati batas waktu → harga turun otomatis 25%.</li>
                                    <li><strong>Tahap 2:</strong> Batas waktu habis → produk masuk jalur donasi.</li>
                                    <li><strong>Tahap 3:</strong> 24 jam tidak diklaim → produk dialihkan ke mitra pengolah sesuai kategori dan kuota.</li>
                                </ul>
                                <p>Pengguna memahami dan menyetujui bahwa mekanisme ini berjalan secara otomatis untuk memastikan setiap produk tersalurkan.</p>
                            </div>
                        </section>

                        {/* 5 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Ketentuan Barter</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed space-y-3">
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Barter dilakukan melalui negosiasi langsung antara kedua pihak via fitur chat atau tawaran barter.</li>
                                    <li>Barter dapat berupa barang dengan barang, atau campuran barang dengan uang — berdasarkan kesepakatan kedua pihak.</li>
                                    <li>Timer produk akan di-pause selama maksimal 12 jam saat ada tawaran barter yang sedang dinegosiasi.</li>
                                    <li>Persetujuan barter bersifat final setelah kedua pihak mengkonfirmasi.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 6 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Sistem RePoin</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed space-y-3">
                                <p>RePoin adalah sistem reward yang diberikan kepada pengguna yang menyalurkan food waste melalui platform:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Layak Konsumsi:</strong> 3 RePoin per kilogram</li>
                                    <li><strong>Layak Olah Ulang:</strong> 2 RePoin per kilogram</li>
                                    <li><strong>Layak Pakan/Kompos:</strong> 1 RePoin per kilogram</li>
                                </ul>
                                <p>RePoin baru dicairkan setelah penerima mengkonfirmasi penerimaan barang fisik. RePoin dapat ditukarkan di unit BUMDes sesuai ketentuan yang berlaku.</p>
                                <p>Replate menerapkan mekanisme pengamanan (database locking) untuk mencegah eksploitasi poin ganda.</p>
                            </div>
                        </section>

                        {/* 7 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Tanggung Jawab & Batasan</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed space-y-3">
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Replate bertindak sebagai <strong>perantara</strong>, bukan penjamin kualitas produk.</li>
                                    <li>Replate tidak bertanggung jawab atas kerugian yang timbul akibat kondisi produk yang tidak sesuai deskripsi.</li>
                                    <li>Pengguna dapat melaporkan produk yang tidak sesuai melalui fitur pelaporan.</li>
                                    <li>Transaksi pembayaran dilakukan di luar platform (COD/transfer manual). Replate tidak memproses pembayaran.</li>
                                    <li>Replate berhak mengubah syarat dan ketentuan ini sewaktu-waktu dengan pemberitahuan melalui platform.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 8 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Mitra Pengolah (Partner)</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed space-y-3">
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Mitra pengolah didaftarkan oleh admin BUMDes dan terdiri dari peternak, pengelola kompos, pembudidaya maggot, atau UMKM pengolah food waste.</li>
                                    <li>Setiap mitra memiliki kuota harian penerimaan (dalam kilogram) yang diatur oleh admin.</li>
                                    <li>Mitra wajib mengkonfirmasi pengambilan produk yang dialihkan melalui platform.</li>
                                    <li>Kuota harian mitra di-reset setiap hari pada pukul 00:00.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 9 */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Kontak</h2>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-600 leading-relaxed">
                                <p>Untuk pertanyaan, saran, atau keluhan terkait platform Replate, silakan hubungi admin BUMDes melalui fitur chat di platform atau melalui kontak yang tersedia di kantor BUMDes setempat.</p>
                            </div>
                        </section>
                    </div>
                </div>
        </NavbarLayout>
    );
}
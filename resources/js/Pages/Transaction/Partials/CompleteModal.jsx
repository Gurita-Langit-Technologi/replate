import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    Camera,
    CheckCircle2,
    UploadCloud,
    X,
    AlertCircle,
    ShieldCheck,
    Image as ImageIcon,
} from 'lucide-react';

export default function CompleteModal({ transaction, onClose }) {
    const existingPhoto = transaction?.proof_photo;
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
            setErrorMessage('File harus berupa gambar (JPG, PNG, atau WebP).');
            return;
        }

        if (selectedFile.size > 4 * 1024 * 1024) {
            setErrorMessage('Ukuran file maksimal 4MB.');
            return;
        }

        setErrorMessage('');
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
    };

    const handleClearFile = () => {
        setFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Jika belum ada foto di database dan pembeli belum memilih foto
        if (!existingPhoto && !file) {
            setErrorMessage('Wajib mengunggah foto produk yang Anda terima.');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        if (file) {
            const formData = new FormData();
            formData.append('proof_photo', file);
            formData.append('_method', 'PATCH');

            router.post(`/transactions/${transaction.id}/complete`, formData, {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setErrorMessage(firstError || 'Gagal menyelesaikan transaksi. Silakan coba lagi.');
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        } else {
            // Sudah ada foto dari penjual / sebelumnya
            router.patch(`/transactions/${transaction.id}/complete`, {}, {
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setErrorMessage(firstError || 'Gagal menyelesaikan transaksi.');
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                >
                    <X size={18} />
                </button>

                {/* Header Badge & Title */}
                <div className="text-center mb-5">
                    <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-3 ring-8 ring-emerald-50/50">
                        <CheckCircle2 size={28} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Konfirmasi Barang Diterima</h2>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                        Pastikan Anda telah memeriksa kondisi produk secara langsung sebelum menyelesaikan transaksi.
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-150">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span className="font-medium">{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Bagian Status Foto Bukti */}
                    {existingPhoto && !previewUrl ? (
                        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                                    <ShieldCheck size={16} className="text-emerald-600" />
                                    Foto Bukti Tersedia
                                </span>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[11px] font-medium text-emerald-700 hover:underline"
                                >
                                    Ganti Foto Baru
                                </button>
                            </div>
                            <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 border border-emerald-100">
                                <img
                                    src={`/storage/${existingPhoto}`}
                                    alt="Bukti serah terima"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-[11px] text-emerald-700">
                                Foto bukti serah terima sudah diunggah. Anda dapat langsung mengonfirmasi penerimaan barang.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                    <Camera size={14} className="text-emerald-600" />
                                    Foto Bukti Penerimaan Produk
                                    <span className="text-red-500 text-xs">*</span>
                                </label>
                                {previewUrl && (
                                    <button
                                        type="button"
                                        onClick={handleClearFile}
                                        className="text-[11px] font-medium text-red-600 hover:text-red-700 hover:underline"
                                    >
                                        Hapus Foto
                                    </button>
                                )}
                            </div>

                            {previewUrl ? (
                                <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-emerald-200 ring-2 ring-emerald-500/20 group">
                                    <img
                                        src={previewUrl}
                                        alt="Preview bukti"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition"
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/70 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center mx-auto mb-2 text-gray-400 group-hover:text-emerald-600 group-hover:border-emerald-200 transition">
                                        <UploadCloud size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-gray-700 group-hover:text-emerald-700">
                                        Ambil Foto atau Pilih Gambar
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        JPG, PNG, atau WebP (Maks. 4MB)
                                    </p>
                                    <p className="text-[10px] text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded-md inline-block mt-2 border border-amber-200">
                                        Wajib untuk menyelesaikan transaksi
                                    </p>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Edukasi Keamanan Singkat */}
                    <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 space-y-1 border border-gray-100">
                        <p className="font-semibold text-gray-700 flex items-center gap-1">
                            <ShieldCheck size={13} className="text-emerald-600" /> Keamanan Bersama
                        </p>
                        <p>
                            Foto ini berfungsi sebagai bukti sah bahwa produk fisik telah sampai di tangan Anda dan sesuai dengan deskripsi.
                        </p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition active:scale-98 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (!existingPhoto && !file)}
                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm hover:shadow-emerald-500/20 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                            {loading ? (
                                'Memproses...'
                            ) : (
                                <>
                                    <CheckCircle2 size={15} />
                                    Konfirmasi & Selesai
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

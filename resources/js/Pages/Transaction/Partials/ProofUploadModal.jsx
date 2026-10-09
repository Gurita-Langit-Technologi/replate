import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Camera, UploadCloud, X, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function ProofUploadModal({ transactionId, onClose }) {
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
        setPreviewUrl(URL.createObjectURL(selectedFile));
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
        if (!file) return;

        setLoading(true);
        setErrorMessage('');
        const formData = new FormData();
        formData.append('proof_photo', file);

        router.post(`/transactions/${transactionId}/proof-photo`, formData, {
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                setErrorMessage(firstError || 'Gagal mengunggah foto bukti.');
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                >
                    <X size={18} />
                </button>

                <div className="text-center mb-4">
                    <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-2 ring-8 ring-emerald-50/50">
                        <Camera size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Unggah Bukti Serah Terima</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Foto makanan/produk saat serah terima sebagai dokumentasi resmi.
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {previewUrl ? (
                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-emerald-200 ring-2 ring-emerald-500/20 group">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg shadow-sm hover:bg-gray-100"
                                >
                                    Ganti
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFile}
                                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-red-700"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/70 hover:bg-emerald-50/30 rounded-2xl p-5 text-center cursor-pointer transition group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center mx-auto mb-2 text-gray-400 group-hover:text-emerald-600 transition">
                                <UploadCloud size={20} />
                            </div>
                            <p className="text-xs font-bold text-gray-700 group-hover:text-emerald-700">
                                Ambil Foto / Pilih Gambar
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                JPG, PNG, atau WebP (Maks. 4MB)
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

                    <div className="flex gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loading ? 'Mengunggah...' : 'Unggah Foto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name,
        email: user.email,
        whatsapp_number: user.whatsapp_number || '',
        desa: user.desa || '',
        kecamatan: user.kecamatan || '',
        address: user.address || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Informasi Pribadi</h2>
                <p className="text-xs text-gray-500 mt-0.5">Perbarui data diri, nomor kontak, dan wilayah domisili Anda.</p>
            </header>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nama lengkap *</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-0"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-0"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
                    <input
                        type="text"
                        value={data.whatsapp_number}
                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-0"
                        placeholder="628123456789"
                    />
                    {errors.whatsapp_number && <p className="text-red-600 text-xs mt-1">{errors.whatsapp_number}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Desa *</label>
                        <input
                            type="text"
                            value={data.desa}
                            onChange={(e) => setData('desa', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-0"
                            placeholder="Sumbermulyo"
                        />
                        {errors.desa && <p className="text-red-600 text-xs mt-1">{errors.desa}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Kecamatan *</label>
                        <input
                            type="text"
                            value={data.kecamatan}
                            onChange={(e) => setData('kecamatan', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-0"
                            placeholder="Bambanglipuro"
                        />
                        {errors.kecamatan && <p className="text-red-600 text-xs mt-1">{errors.kecamatan}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat lengkap</label>
                    <textarea
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:ring-0"
                        rows={2}
                        placeholder="Dusun Krajan RT 03/RW 01, rumah cat biru"
                    />
                    {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                        Email Anda belum diverifikasi.
                        {status === 'verification-link-sent' && (
                            <span className="text-emerald-700 ml-1 font-semibold">Link verifikasi baru sudah dikirim.</span>
                        )}
                    </div>
                )}

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </section>
    );
}
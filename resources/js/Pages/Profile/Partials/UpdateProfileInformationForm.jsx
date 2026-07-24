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
            <header className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Informasi Profil</h2>
                <p className="text-sm text-gray-500">Perbarui data diri dan lokasi Anda</p>
            </header>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Nama lengkap *</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Email *</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Nomor WhatsApp</label>
                    <input
                        type="text"
                        value={data.whatsapp_number}
                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        placeholder="628123456789"
                    />
                    {errors.whatsapp_number && <p className="text-red-500 text-xs mt-1">{errors.whatsapp_number}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Desa *</label>
                        <input
                            type="text"
                            value={data.desa}
                            onChange={(e) => setData('desa', e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            placeholder="Sumbermulyo"
                        />
                        {errors.desa && <p className="text-red-500 text-xs mt-1">{errors.desa}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Kecamatan *</label>
                        <input
                            type="text"
                            value={data.kecamatan}
                            onChange={(e) => setData('kecamatan', e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            placeholder="Bambanglipuro"
                        />
                        {errors.kecamatan && <p className="text-red-500 text-xs mt-1">{errors.kecamatan}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Alamat lengkap</label>
                    <textarea
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        rows={2}
                        placeholder="Dusun Krajan RT 03/RW 01, rumah cat biru"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                        Email Anda belum diverifikasi.
                        {status === 'verification-link-sent' && (
                            <span className="text-green-600 ml-1">Link verifikasi baru sudah dikirim.</span>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                    {processing ? 'Menyimpan...' : 'Simpan perubahan'}
                </button>
            </form>
        </section>
    );
}
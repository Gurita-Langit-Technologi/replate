import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

            {/* Header / Judul */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Daftar ke Replate</h2>
                <p className="text-sm text-gray-500 mt-1">Buat akun baru kamu</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Field Nama Lengkap */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        placeholder="Nama Lengkap"
                        autoComplete="name"
                        autoFocus
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

                {/* Field Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        placeholder="email@contoh.com"
                        autoComplete="username"
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Field Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Field Konfirmasi Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Konfirmasi Password
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                {/* Tombol Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                    {processing ? 'Memproses...' : 'Daftar'}
                </button>

                {/* Link ke Halaman Login */}
                <p className="text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link href={route('login')} className="text-green-600 font-medium hover:text-green-700">
                        Masuk sekarang
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
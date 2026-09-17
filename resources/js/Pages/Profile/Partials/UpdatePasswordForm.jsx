import { useState, useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">
                    Perbarui Kata Sandi
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                    Gunakan kata sandi yang kuat dan aman untuk melindungi akun Anda.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Kata Sandi Saat Ini *
                    </label>
                    <div className="relative">
                        <input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type={showCurrentPassword ? 'text' : 'password'}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 pr-10 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
                            title={showCurrentPassword ? 'Sembunyikan password' : 'Lihat password'}
                        >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.current_password && (
                        <p className="text-red-600 text-xs mt-1">{errors.current_password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Kata Sandi Baru *
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 pr-10 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
                            title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Konfirmasi Kata Sandi Baru *
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 pr-10 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
                            title={showPasswordConfirmation ? 'Sembunyikan konfirmasi password' : 'Lihat konfirmasi password'}
                        >
                            {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-red-600 text-xs mt-1">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs text-emerald-700 font-semibold">
                            Kata sandi berhasil diperbarui.
                        </p>
                    </Transition>

                    <button
                        type="submit"
                        disabled={processing}
                        className="ml-auto px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                    </button>
                </div>
            </form>
        </section>
    );
}

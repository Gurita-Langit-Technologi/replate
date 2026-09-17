import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-4 ${className}`}>
            <header className="pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">
                    Hapus Akun
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                    Setelah akun Anda dihapus, semua data dan riwayat transaksi akan dihapus secara permanen.
                </p>
            </header>

            <div>
                <DangerButton onClick={confirmUserDeletion} className="text-xs font-semibold py-2 px-3.5 rounded-lg">
                    Hapus Akun Permanen
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-5 space-y-4">
                    <h2 className="text-base font-bold text-gray-900">
                        Apakah Anda yakin ingin menghapus akun?
                    </h2>

                    <p className="text-xs text-gray-600 leading-relaxed">
                        Tindakan ini tidak dapat dibatalkan. Masukkan kata sandi Anda untuk mengonfirmasi penghapusan akun permanen.
                    </p>

                    <div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                            placeholder="Kata sandi konfirmasi"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-1 text-xs text-red-600"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

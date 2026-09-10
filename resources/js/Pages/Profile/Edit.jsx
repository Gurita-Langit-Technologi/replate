import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SellerVerificationSection from './Partials/SellerVerificationSection';

export default function Edit({ mustVerifyEmail, status, verification }) {
    return (
        <AppLayout>
            <Head title="Profil Pengguna" />

            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Kelola identitas akun, status verifikasi penjual, dan keamanan password Anda.</p>
                </div>

                <div className="space-y-6">
                    {/* Status & Pengajuan Verifikasi Penjual */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <SellerVerificationSection verification={verification} />
                    </div>

                    {/* Informasi Dasar Akun */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Keamanan & Password */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Hapus Akun */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
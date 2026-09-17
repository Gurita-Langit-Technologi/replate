import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SellerVerificationSection from './Partials/SellerVerificationSection';

export default function Edit({ mustVerifyEmail, status, verification }) {
    return (
        <AppLayout>
            <Head title="Pengaturan Profil" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Pengaturan Profil</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Kelola identitas akun, status verifikasi penjual olahan, dan keamanan kata sandi Anda.
                    </p>
                </div>

                <div className="space-y-5">
                    {/* Status & Pengajuan Verifikasi Penjual */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
                        <SellerVerificationSection verification={verification} />
                    </div>

                    {/* Informasi Dasar Akun */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Keamanan & Password */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
                        <UpdatePasswordForm />
                    </div>

                    {/* Hapus Akun */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
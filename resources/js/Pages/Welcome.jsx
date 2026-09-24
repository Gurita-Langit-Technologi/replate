import { Head } from '@inertiajs/react';
import Navbar from './Welcome/Partials/Navbar';
import HeroSection from './Welcome/Partials/HeroSection';
import ImpactTicker from './Welcome/Partials/ImpactTicker';
import FourPillarsSection from './Welcome/Partials/FourPillarsSection';
import TimeoutWorkflowSection from './Welcome/Partials/TimeoutWorkflowSection';
import StakeholdersSection from './Welcome/Partials/StakeholdersSection';
import ImpactHighlightSection from './Welcome/Partials/ImpactHighlightSection';
import CtaSection from './Welcome/Partials/CtaSection';
import Footer from './Welcome/Partials/Footer';

export default function Welcome({ auth, impact }) {
    const stats = {
        weightKg: impact?.total_weight_kg ?? 0,
        co2Kg: impact?.total_co2_kg ?? 0,
        meals: impact?.total_meals_saved ?? 0,
        completedTx: impact?.total_completed_tx ?? 0,
        totalUsers: (impact?.total_users ?? 0) + (impact?.total_partners ?? 0),
        economicValue: impact?.total_economic_value ?? 0,
    };

    return (
        <>
            <Head title="Replate — Dari Sisa Menjadi Sinergi | Digitalisasi Pangan Desa Berkelanjutan" />

            <div className="min-h-screen bg-white">
                <Navbar auth={auth} />
                <HeroSection stats={stats} />
                <ImpactTicker stats={stats} />
                <FourPillarsSection />
                <TimeoutWorkflowSection />
                <StakeholdersSection />
                <ImpactHighlightSection />
                <CtaSection />
                <Footer />
            </div>
        </>
    );
}
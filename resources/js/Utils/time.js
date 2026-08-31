/**
 * Format sisa waktu produk lengkap.
 * Contoh: "2 hari 5 jam", "5 jam 30 menit", "45 menit"
 */
export function formatTimeLeft(dateString) {
    if (!dateString) return '0 menit';
    const diffMs = new Date(dateString) - new Date();
    if (diffMs <= 0) return 'Waktu habis';

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    if (days > 0) {
        return hours > 0 ? `${days} hari ${hours} jam` : `${days} hari`;
    }
    if (hours > 0) {
        return minutes > 0 ? `${hours} jam ${minutes} menit` : `${hours} jam`;
    }
    return `${minutes} menit`;
}

/**
 * Format sisa waktu untuk badge pada kartu produk.
 * Contoh: "2 hari 5 jam lagi", "5 jam lagi", "30 menit lagi"
 */
export function formatTimeLeftShort(dateString) {
    if (!dateString) return '0 menit';
    const diffMs = new Date(dateString) - new Date();
    if (diffMs <= 0) return 'Habis';

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    if (days > 0) {
        return hours > 0 ? `${days} hari ${hours} jam lagi` : `${days} hari lagi`;
    }
    if (hours > 0) {
        return `${hours} jam lagi`;
    }
    return `${minutes} menit lagi`;
}

import { Check, X, AlertTriangle } from 'lucide-react';

const steps = ['pending', 'confirmed', 'completed'];

export default function StatusTracker({ currentStatus }) {
    const isCancelled = currentStatus === 'cancelled';
    const isDispute = currentStatus === 'dispute_spoiled';
    const currentIdx = steps.indexOf(currentStatus);

    const stepLabels = {
        pending: 'Menunggu',
        confirmed: 'Dikonfirmasi',
        completed: 'Selesai',
    };

    if (isCancelled) {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <X size={16} className="text-red-500" />
                </div>
                <p className="text-sm font-medium text-red-700">Transaksi dibatalkan</p>
            </div>
        );
    }

    if (isDispute) {
        return (
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <AlertTriangle size={18} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-orange-700">Sedang dalam dispute</p>
                    <p className="text-xs text-orange-500 mt-0.5">Produk dialihkan ke mitra pengolah dan admin sedang meninjau laporan.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
                const isDone = idx <= currentIdx;
                const isActive = idx === currentIdx;
                return (
                    <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition
                                    ${isDone ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}
                                    ${isActive ? 'ring-4 ring-green-100' : ''}`}
                            >
                                {isDone && idx < currentIdx ? <Check size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                            </div>
                            <p className={`text-[11px] mt-1.5 font-medium ${isDone ? 'text-green-600' : 'text-gray-400'}`}>
                                {stepLabels[step]}
                            </p>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 mb-5 ${idx < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

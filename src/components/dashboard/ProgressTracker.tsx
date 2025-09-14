// TypeScript
import Reveal from '../Reveal';

interface ProgressTrackerProps {
    totalHours: number;
}

const TIERS = [
    { name: 'Bronze', hours: 25, icon: 'fa-award text-yellow-600' },
    { name: 'Silver', hours: 50, icon: 'fa-award text-gray-300' },
    { name: 'Gold', hours: 100, icon: 'fa-award text-yellow-400' },
    { name: 'Presidential', hours: 250, icon: 'fa-medal text-blue-400' },
];

const ProgressTracker = ({ totalHours }: ProgressTrackerProps) => {
    const nextTier = TIERS.find(tier => totalHours < tier.hours);
    const currentTier = [...TIERS].reverse().find(tier => totalHours >= tier.hours);

    const progressPercent = nextTier ? (totalHours / nextTier.hours) * 100 : 100;

    return (
        <Reveal className="bg-dark-card p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-dark-heading">Service Award Progress</h3>
                {currentTier && (
                    <div className="flex items-center gap-2 text-sm font-semibold bg-dark-bg px-3 py-1 rounded-full">
                        <i className={`fas ${currentTier.icon}`}></i>
                        <span>{currentTier.name} Tier</span>
                    </div>
                )}
            </div>
            
            {nextTier ? (
                <>
                    <p className="text-sm text-dark-text mb-3">
                        You're <span className="font-bold text-primary">{(nextTier.hours - totalHours).toFixed(1)}</span> hours away from the <span className="font-bold text-white">{nextTier.name}</span> award!
                    </p>
                    <div className="w-full bg-dark-bg rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-dark-text mt-1">
                        <span>{totalHours.toFixed(1)} hrs</span>
                        <span>{nextTier.hours} hrs</span>
                    </div>
                </>
            ) : (
                <p className="text-sm text-primary font-semibold text-center mt-4">
                    <i className="fas fa-star mr-2"></i>
                    Incredible! You've achieved the highest award tier!
                </p>
            )}
        </Reveal>
    );
};

export default ProgressTracker;

// TypeScript
import Reveal from '../Reveal';

interface ImpactCardProps {
    icon: string;
    label: string;
    value: string | number;
    colorClass: 'text-primary' | 'text-secondary';
}

const ImpactCard = ({ icon, label, value, colorClass }: ImpactCardProps) => {
    return (
        <Reveal className="bg-dark-card p-6 rounded-lg border border-gray-700 flex items-center gap-6">
            <div className={`text-3xl ${colorClass}`}>
                <i className={`fas ${icon}`}></i>
            </div>
            <div>
                <p className="text-3xl font-bold text-dark-heading">{value}</p>
                <p className="text-sm font-semibold uppercase tracking-wider text-dark-text">{label}</p>
            </div>
        </Reveal>
    );
};

export default ImpactCard;

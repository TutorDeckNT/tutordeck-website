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
        <Reveal className="bg-black/20 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg flex items-center gap-6">
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

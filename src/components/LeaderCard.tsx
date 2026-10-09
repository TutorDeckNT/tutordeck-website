import type { Leader } from '../data/leaders';

const LeaderCard = ({ leader, className = "" }: { leader: Leader; className?: string }) => (
  <article className={`min-h-96 bg-gray-800 rounded-2xl relative overflow-hidden hover:-translate-y-2 transition-transform duration-300 flex items-end ${className}`}>
    <div className={`absolute inset-0 opacity-20 ${leader.color}`} />
    <div className="relative w-full p-6 pt-20 bg-gradient-to-t from-black to-transparent">
      {leader.quote && <p className="text-gray-300 italic mb-2">"{leader.quote}"</p>}
      <h3 className="text-2xl font-bold text-white">{leader.name}</h3>
      <p className={`text-sm font-bold uppercase tracking-wider ${leader.color.replace('bg-', 'text-')}`}>{leader.role}</p>
      {leader.chapter && <p className="text-xs font-semibold uppercase tracking-wide text-gray-300 mt-1">{leader.chapter}</p>}
    </div>
  </article>
);

export default LeaderCard;

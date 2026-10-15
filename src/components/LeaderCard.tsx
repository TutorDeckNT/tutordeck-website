import { ChartNoAxesCombined, Code2, GraduationCap, Network, UsersRound, Wallet } from 'lucide-react';
import type { Leader } from '../data/leaders';

const LeaderCard = ({ leader, className = '', compact = false }: { leader: Leader; className?: string; compact?: boolean }) => {
  const [title, school] = leader.role.split(' · ');
  const chapter = leader.chapter || (compact ? school : undefined);
  const role = leader.role.toLowerCase();
  const RoleIcon = /tech|engineer|developer/.test(role) ? Code2
    : /analytics/.test(role) ? ChartNoAxesCombined
    : /treasurer/.test(role) ? Wallet
    : /growth|expansion/.test(role) ? Network
    : /next generation/.test(role) ? GraduationCap
    : UsersRound;
  return (
    <article className={`leader-card ${compact ? 'leader-card--row' : ''} ${className}`} >
      <div className="leader-card__identity">
        <span className="leader-card__icon" aria-hidden="true"><RoleIcon size={20} strokeWidth={1.75} /></span>
        <h3>{leader.name}</h3>
      </div>
      <p className="leader-card__role">{compact && school ? title : leader.role}</p>
      {chapter && <p className="leader-card__chapter">{chapter}</p>}
      {!compact && leader.quote && <blockquote className="leader-card__quote">“{leader.quote}”</blockquote>}
    </article>
  );
};

export default LeaderCard;

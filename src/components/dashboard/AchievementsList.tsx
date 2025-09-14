// TypeScript
import Reveal from '../Reveal';
import { achievements, Achievement } from '../../lib/achievements';

interface VolunteerActivity {
    id: string;
    activityType: string;
    activityDate: { _seconds: number; _nanoseconds: number; };
    hours: number;
    proofLink: string;
}

interface AchievementsListProps {
    activities: VolunteerActivity[];
}

const AchievementItem = ({ ach, earned }: { ach: Achievement, earned: boolean }) => (
    <div className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${earned ? 'bg-dark-bg' : 'bg-transparent opacity-40'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${earned ? 'bg-primary text-dark-bg' : 'bg-gray-700 text-gray-400'}`}>
            <i className={`fas ${ach.icon}`}></i>
        </div>
        <div>
            <h4 className={`font-bold ${earned ? 'text-dark-heading' : 'text-gray-400'}`}>{ach.title}</h4>
            <p className="text-sm text-dark-text">{ach.description}</p>
        </div>
    </div>
);

const AchievementsList = ({ activities }: AchievementsListProps) => {
    const earnedAchievements = achievements.filter(ach => ach.isAchieved(activities));
    const unearnedAchievements = achievements.filter(ach => !ach.isAchieved(activities));

    return (
        <Reveal>
            <h2 className="text-3xl font-bold text-dark-heading mb-6 text-center md:text-left">Your Achievements</h2>
            <div className="bg-dark-card p-4 sm:p-6 rounded-lg border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {earnedAchievements.map(ach => <AchievementItem key={ach.id} ach={ach} earned={true} />)}
                    {unearnedAchievements.map(ach => <AchievementItem key={ach.id} ach={ach} earned={false} />)}
                </div>
            </div>
        </Reveal>
    );
};

export default AchievementsList;

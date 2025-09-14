// TypeScript

// Define the structure for a single volunteer activity
interface VolunteerActivity {
    id: string;
    activityType: string;
    activityDate: { 
        _seconds: number; 
        _nanoseconds: number; 
    };
    hours: number;
    proofLink: string;
}

// Define the structure for an Achievement
export interface Achievement {
    id: string;
    icon: string;
    title: string;
    description: string;
    isAchieved: (activities: VolunteerActivity[]) => boolean;
}

// Calculate total hours helper
const getTotalHours = (activities: VolunteerActivity[]): number => {
    return activities.reduce((sum, act) => sum + (act.hours || 0), 0);
};

// Define all available achievements
export const achievements: Achievement[] = [
    {
        id: 'first_step',
        icon: 'fa-shoe-prints',
        title: 'First Step',
        description: 'Logged your very first volunteer activity.',
        isAchieved: (activities) => activities.length > 0,
    },
    {
        id: 'hour_hero_10',
        icon: 'fa-star',
        title: 'Hour Hero (10)',
        description: 'Reached a total of 10 volunteer hours.',
        isAchieved: (activities) => getTotalHours(activities) >= 10,
    },
    {
        id: 'mentor_initiate',
        icon: 'fa-user-friends',
        title: 'Mentor Initiate',
        description: 'Completed your first mentorship session.',
        isAchieved: (activities) => activities.some(act => act.activityType === 'Mentorship'),
    },
    {
        id: 'tutor_titan_5',
        icon: 'fa-book-reader',
        title: 'Tutor Titan (5)',
        description: 'Completed 5 peer tutoring sessions.',
        isAchieved: (activities) => activities.filter(act => act.activityType === 'Peer Tutoring').length >= 5,
    },
    {
        id: 'hour_hero_25',
        icon: 'fa-award',
        title: 'Hour Hero (25)',
        description: 'Reached a total of 25 volunteer hours.',
        isAchieved: (activities) => getTotalHours(activities) >= 25,
    },
    {
        id: 'consistency_king',
        icon: 'fa-calendar-check',
        title: 'Consistency King',
        description: 'Logged activities in two different months.',
        isAchieved: (activities) => {
            if (activities.length < 2) return false;
            const months = new Set(activities.map(act => new Date(act.activityDate._seconds * 1000).getMonth()));
            return months.size >= 2;
        }
    }
];

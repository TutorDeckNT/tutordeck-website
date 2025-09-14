// TypeScript
import { useMemo } from 'react';
import Reveal from '../Reveal';

interface VolunteerActivity {
    activityDate: { _seconds: number; };
    hours: number;
}

interface ActivityChartProps {
    activities: VolunteerActivity[];
}

const ActivityChart = ({ activities }: ActivityChartProps) => {
    const chartData = useMemo(() => {
        const monthlyHours: { [key: string]: number } = {};
        const monthLabels: string[] = [];

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = d.toLocaleString('default', { month: 'short' });
            monthlyHours[monthKey] = 0;
            if (!monthLabels.includes(monthLabel)) {
                monthLabels.push(monthLabel);
            }
        }
        
        activities.forEach(act => {
            const date = new Date(act.activityDate._seconds * 1000);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyHours.hasOwnProperty(monthKey)) {
                monthlyHours[monthKey] += act.hours;
            }
        });

        const dataPoints = Object.values(monthlyHours);
        const maxHours = Math.max(...dataPoints, 5); // Ensure a minimum height for the chart

        return { labels: monthLabels, data: dataPoints, maxHours };
    }, [activities]);

    return (
        <Reveal className="bg-dark-card p-6 rounded-lg border border-gray-700">
            <h3 className="font-bold text-dark-heading mb-4">Monthly Impact</h3>
            <div className="h-48 w-full">
                {activities.length > 0 ? (
                    <svg width="100%" height="100%" viewBox={`0 0 100 50`} preserveAspectRatio="none">
                        {chartData.data.map((hours, index) => {
                            const barHeight = (hours / chartData.maxHours) * 45; // 45 to leave space for labels
                            const x = (100 / chartData.data.length) * index + 2;
                            const barWidth = (100 / chartData.data.length) - 4;
                            return (
                                <g key={index}>
                                    <rect
                                        x={x}
                                        y={45 - barHeight}
                                        width={barWidth}
                                        height={barHeight}
                                        className="fill-current text-secondary hover:text-secondary-dark transition-colors"
                                        rx="1"
                                    />
                                    <text x={x + barWidth / 2} y="50" textAnchor="middle" className="text-[5px] fill-current text-dark-text">{chartData.labels[index]}</text>
                                </g>
                            );
                        })}
                    </svg>
                ) : (
                    <div className="h-full flex items-center justify-center text-dark-text text-sm">No activity data to display chart.</div>
                )}
            </div>
        </Reveal>
    );
};

export default ActivityChart;

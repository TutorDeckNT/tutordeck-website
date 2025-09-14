// TypeScript
import { useMemo } from 'react';
import Reveal from '../Reveal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface VolunteerActivity {
    activityDate: { _seconds: number; };
    hours: number;
}

interface ActivityChartProps {
    activities: VolunteerActivity[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-card p-3 border border-gray-700 rounded-lg shadow-lg">
                <p className="label text-sm font-bold text-dark-heading">{`${label}`}</p>
                <p className="intro text-xs text-secondary">{`Total Hours : ${payload[0].value.toFixed(1)}`}</p>
            </div>
        );
    }
    return null;
};

const ActivityChart = ({ activities }: ActivityChartProps) => {
    const chartData = useMemo(() => {
        const monthlyHours: { [key: string]: { name: string, hours: number } } = {};
        
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthLabel = d.toLocaleString('default', { month: 'short' });
            const yearMonthKey = `${d.getFullYear()}-${d.getMonth()}`;
            monthlyHours[yearMonthKey] = { name: monthLabel, hours: 0 };
        }
        
        activities.forEach(act => {
            const date = new Date(act.activityDate._seconds * 1000);
            const yearMonthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (monthlyHours[yearMonthKey]) {
                monthlyHours[yearMonthKey].hours += act.hours;
            }
        });

        return Object.values(monthlyHours);
    }, [activities]);

    return (
        <Reveal className="bg-dark-card p-6 rounded-lg border border-gray-700 h-80">
            <h3 className="font-bold text-dark-heading mb-4">Monthly Impact</h3>
            {activities.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#d1d5db" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }}/>
                        <Bar dataKey="hours" name="Hours" radius={[4, 4, 0, 0]}>
                           {chartData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.hours > 0 ? '#3b82f6' : '#374151'} />
                           ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-dark-text text-sm pb-10">No activity data to display chart.</div>
            )}
        </Reveal>
    );
};

export default ActivityChart;

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Papa from 'papaparse';
import Reveal from '../components/Reveal';

interface VolunteerActivity {
    Timestamp: string;
    'Email Address': string;
    'What type of volunteering did you accomplish?': string;
    'How many hours did you tutor your peer/mentor for?': string;
    'Please upload your proof of volunteering.': string;
}

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_naSGKiijwCoOzf_FDpu-gd5CXOT7G8Y5q8EB6608m_u3Zafqb9FTlfK6ziP128WZFPIJtkWhPJ3-/pub?gid=198215125&single=true&output=csv';

const DashboardPage = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<VolunteerActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.email) return;

        const fetchAndParseData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(GOOGLE_SHEET_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const csvText = await response.text();
                
                Papa.parse<VolunteerActivity>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const userActivities = results.data.filter(
                            row => row['Email Address']?.trim().toLowerCase() === user.email?.trim().toLowerCase()
                        );
                        setActivities(userActivities);
                    },
                    error: (err: Error) => { // <-- THIS IS THE FIX
                        throw new Error(`Parsing error: ${err.message}`);
                    }
                });

            } catch (e) {
                console.error(e);
                setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndParseData();
    }, [user]);

    const totalHours = activities.reduce((sum, activity) => {
        const hours = parseFloat(activity['How many hours did you tutor your peer/mentor for?']);
        return sum + (isNaN(hours) ? 0 : hours);
    }, 0);

    const totalSessions = activities.length;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-dark-bg"><p className="text-primary text-xl">Loading your dashboard...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-dark-bg"><p className="text-red-500 text-xl">Error: {error}</p></div>;
    }

    return (
        <main className="container mx-auto px-6 py-20 mt-16">
            <Reveal className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-dark-heading">Your Dashboard</h1>
                <p className="text-lg mt-4 max-w-3xl mx-auto text-dark-text">Welcome back, {user?.displayName?.split(' ')[0] || 'Volunteer'}!</p>
            </Reveal>

            <Reveal as="section" id="impact-summary" className="mb-16">
                <h2 className="text-3xl font-bold text-dark-heading mb-8 text-center">Your Impact Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <div className="bg-dark-card p-8 rounded-lg text-center border border-primary/50">
                        <p className="text-5xl font-bold text-primary mb-2">{totalHours.toFixed(1)}</p>
                        <p className="text-lg font-semibold uppercase tracking-wider text-dark-text">Total Hours</p>
                    </div>
                    <div className="bg-dark-card p-8 rounded-lg text-center border border-secondary/50">
                        <p className="text-5xl font-bold text-secondary mb-2">{totalSessions}</p>
                        <p className="text-lg font-semibold uppercase tracking-wider text-dark-text">Sessions Completed</p>
                    </div>
                </div>
            </Reveal>

            <Reveal as="section" id="transcript">
                <h2 className="text-3xl font-bold text-dark-heading mb-8 text-center">Volunteer Transcript</h2>
                <div className="bg-dark-card rounded-lg shadow-lg border border-gray-700 max-w-4xl mx-auto overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-bg">
                                <tr>
                                    <th className="p-4 font-semibold text-primary">Date</th>
                                    <th className="p-4 font-semibold text-primary">Activity</th>
                                    <th className="p-4 font-semibold text-primary text-right">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.length > 0 ? (
                                    activities.map((activity, index) => (
                                        <tr key={index} className="border-t border-gray-700 hover:bg-gray-800/50">
                                            <td className="p-4 text-dark-text whitespace-nowrap">{new Date(activity.Timestamp).toLocaleDateString()}</td>
                                            <td className="p-4 text-dark-text">{activity['What type of volunteering did you accomplish?']}</td>
                                            <td className="p-4 text-dark-heading font-bold text-right">{parseFloat(activity['How many hours did you tutor your peer/mentor for?']).toFixed(1)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center p-8 text-gray-500">
                                            You have no volunteer activities logged yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Reveal>
        </main>
    );
};

export default DashboardPage;

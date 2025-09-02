import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Papa from 'papaparse';
import Reveal from '../components/Reveal';
import EmailModal from '../components/EmailModal';

// --- Interfaces and Constants (unchanged) ---
interface VolunteerActivity {
    Timestamp: string;
    'Email Address': string;
    'What type of volunteering did you accomplish?': string;
    'How many hours did you tutor your peer/mentor for?': string;
}

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_naSGKiijwCoOzf_FDpu-gd5CXOT7G8Y5q8EB6608m_u3Zafqb9FTlfK6ziP128WZFPIJtkWhPJ3-/pub?gid=198215125&single=true&output=csv';

// --- Simple Modal for "Coming Soon" Feature ---
const ComingSoonModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-dark-card rounded-lg shadow-2xl p-8 w-full max-w-sm text-center border border-gray-700" onClick={e => e.stopPropagation()}>
                <i className="fas fa-tools text-4xl text-secondary mb-4"></i>
                <h2 className="text-2xl font-bold text-dark-heading mb-2">Feature Coming Soon!</h2>
                <p className="text-dark-text mb-6">The "Tutor Your Friend" feature is under construction. Stay tuned!</p>
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-secondary hover:bg-secondary-dark text-white transition-colors">Got it</button>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<VolunteerActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);

    // --- Data Fetching and Processing (unchanged logic) ---
    useEffect(() => {
        if (!user?.email) return;
        const fetchAndParseData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(GOOGLE_SHEET_URL);
                if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
                const csvText = await response.text();
                Papa.parse<VolunteerActivity>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const userActivities = results.data.filter(row => row['Email Address']?.trim().toLowerCase() === user.email?.trim().toLowerCase());
                        userActivities.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());
                        setActivities(userActivities);
                    },
                    error: (err: Error) => { throw new Error(`Parsing error: ${err.message}`); }
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchAndParseData();
    }, [user]);

    const stats = useMemo(() => {
        const totalHours = activities.reduce((sum, act) => sum + (parseFloat(act['How many hours did you tutor your peer/mentor for?']) || 0), 0);
        return { totalHours, totalSessions: activities.length };
    }, [activities]);

    const handleGenerateTranscript = async (email: string) => {
        if (!user) return;
        setIsGenerating(true);
        setServerMessage(null);
        try {
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/generate-transcript`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred.');
            setServerMessage({ type: 'success', text: data.message });
        } catch (err) {
            setServerMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to generate transcript.' });
        } finally {
            setIsGenerating(false);
            setIsEmailModalOpen(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-bg"><p className="text-primary text-xl">Loading your dashboard...</p></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-dark-bg"><p className="text-red-500 text-xl">Error: {error}</p></div>;

    // --- NEW Layout matching the wireframe ---
    return (
        <>
            <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} onSubmit={handleGenerateTranscript} isLoading={isGenerating} defaultEmail={user?.email || ''} />
            <ComingSoonModal isOpen={isComingSoonModalOpen} onClose={() => setIsComingSoonModalOpen(false)} />

            <main className="container mx-auto px-6 py-20 mt-16">
                {/* --- Top Row Cards --- */}
                <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* Welcome Card */}
                    <div className="lg:col-span-1 bg-dark-card p-6 rounded-2xl border border-gray-700 flex items-center gap-6">
                        <img className="w-20 h-20 rounded-xl" src={user?.photoURL || '/mascot.avif'} alt="User Profile" />
                        <div>
                            <p className="text-xl font-bold text-dark-heading">Your Dashboard</p>
                            <p className="text-3xl font-bold text-dark-heading">Hi, {user?.displayName?.split(' ')[0] || 'Volunteer'}</p>
                        </div>
                    </div>

                    {/* Impact Summary Card */}
                    <div className="md:col-span-1 lg:col-span-2 bg-dark-card p-6 rounded-2xl border border-gray-700">
                        <h2 className="text-xl font-bold text-dark-heading mb-4">Your Impact Summary</h2>
                        <div className="flex items-center justify-around text-center">
                            <div>
                                <p className="text-6xl font-extrabold text-primary">{stats.totalHours.toFixed(1)}</p>
                                <p className="text-sm font-semibold uppercase tracking-wider text-dark-text">Total Hours</p>
                            </div>
                            <div>
                                <p className="text-6xl font-extrabold text-secondary">{stats.totalSessions}</p>
                                <p className="text-sm font-semibold uppercase tracking-wider text-dark-text">Sessions Completed</p>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {serverMessage && (
                    <Reveal className="mb-8">
                        <div className={`p-4 rounded-lg text-center ${serverMessage.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                            {serverMessage.text}
                        </div>
                    </Reveal>
                )}

                {/* --- Bottom Section (Transcript & Resources) --- */}
                <Reveal className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Transcript Table */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-dark-heading mb-4">Volunteer Transcript</h2>
                        <div className="bg-dark-card rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
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
                                                <tr key={index} className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
                                                    <td className="p-4 whitespace-nowrap">{new Date(activity.Timestamp).toLocaleDateString()}</td>
                                                    <td className="p-4">{activity['What type of volunteering did you accomplish?']}</td>
                                                    <td className="p-4 font-bold text-right text-primary">{(parseFloat(activity['How many hours did you tutor your peer/mentor for?']) || 0).toFixed(1)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={3} className="text-center p-8 text-gray-500">Your transcript is empty. Start volunteering to see your impact!</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Resources Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-dark-card p-6 rounded-2xl border border-gray-700 mt-12">
                            <h2 className="text-xl font-bold text-dark-heading mb-6 text-center">Resources</h2>
                            <div className="flex justify-around items-start">
                                <button onClick={() => setIsComingSoonModalOpen(true)} className="flex flex-col items-center gap-2 group text-center">
                                    <div className="w-20 h-20 bg-red-500/80 rounded-2xl flex items-center justify-center text-white text-3xl shadow-md group-hover:bg-red-500 transition-all transform group-hover:scale-105">
                                        <i className="fas fa-video"></i>
                                    </div>
                                    <span className="font-semibold text-sm text-dark-text mt-1">Tutor a Friend</span>
                                </button>
                                <button onClick={() => { setServerMessage(null); setIsEmailModalOpen(true); }} disabled={activities.length === 0} className="flex flex-col items-center gap-2 group text-center disabled:opacity-50 disabled:cursor-not-allowed">
                                    <div className="w-20 h-20 bg-red-500/80 rounded-2xl flex items-center justify-center text-white text-3xl shadow-md group-hover:bg-red-500 transition-all transform group-hover:scale-105">
                                        <i className="fas fa-download"></i>
                                    </div>
                                    <span className="font-semibold text-sm text-dark-text mt-1">Download<br/>Transcript</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </main>
        </>
    );
};
export default DashboardPage;

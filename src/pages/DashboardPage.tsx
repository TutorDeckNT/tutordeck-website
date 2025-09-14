import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Reveal from '../components/Reveal';
import EmailModal from '../components/EmailModal';
import LogActivityModal from '../components/LogActivityModal'; // Updated import

// Interface for Firestore data
interface VolunteerActivity {
    id: string;
    activityType: string;
    activityDate: { seconds: number; nanoseconds: number; }; // Firestore Timestamp format
    hours: number;
    proofLink: string;
}

// Interface for our client-side cache structure
interface CachedData {
    timestamp: number;
    activities: VolunteerActivity[];
}

const CACHE_KEY = 'cachedActivities';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

const DashboardPage = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<VolunteerActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for the two modals
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchActivities = useCallback(async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);

        try {
            const cachedItem = localStorage.getItem(CACHE_KEY);
            if (cachedItem) {
                const cachedData: CachedData = JSON.parse(cachedItem);
                const isCacheValid = (new Date().getTime() - cachedData.timestamp) < CACHE_DURATION_MS;

                if (isCacheValid) {
                    setActivities(cachedData.activities);
                    setLoading(false);
                    return;
                }
            }
        } catch (e) {
            console.error("Failed to read from local cache:", e);
            localStorage.removeItem(CACHE_KEY);
        }

        try {
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/activities`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch activities.');
            }
            const data: VolunteerActivity[] = await response.json();
            setActivities(data);

            const newCachedData: CachedData = {
                timestamp: new Date().getTime(),
                activities: data
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(newCachedData));

        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handleActivityAdded = () => {
        localStorage.removeItem(CACHE_KEY);
        fetchActivities();
    };

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

    const totalHours = activities.reduce((sum, act) => sum + (act.hours || 0), 0);

    return (
        <>
            <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} onSubmit={handleGenerateTranscript} isLoading={isGenerating} defaultEmail={user?.email || ''} />
            <LogActivityModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} onActivityAdded={handleActivityAdded} />

            <main className="container mx-auto px-6 py-20 mt-16">
                <Reveal className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-dark-heading">Your Dashboard</h1>
                    <p className="text-lg mt-4">Welcome back, {user?.displayName?.split(' ')[0] || 'Volunteer'}!</p>
                </Reveal>
                
                {serverMessage && (
                    <Reveal className="max-w-4xl mx-auto mb-8">
                        <div className={`p-4 rounded-lg text-center ${serverMessage.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                            {serverMessage.text}
                        </div>
                    </Reveal>
                )}

                <Reveal as="section" className="mb-16">
                    <h2 className="text-3xl font-bold text-dark-heading mb-8 text-center">Your Impact Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div className="bg-dark-card p-8 rounded-lg text-center border border-primary/50">
                            <p className="text-5xl font-bold text-primary mb-2">{totalHours.toFixed(1)}</p>
                            <p className="text-lg font-semibold uppercase tracking-wider">Total Hours</p>
                        </div>
                        <div className="bg-dark-card p-8 rounded-lg text-center border border-secondary/50">
                            <p className="text-5xl font-bold text-secondary mb-2">{activities.length}</p>
                            <p className="text-lg font-semibold uppercase tracking-wider">Sessions Completed</p>
                        </div>
                    </div>
                </Reveal>

                <Reveal as="section">
                    <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto mb-8 gap-4">
                        <h2 className="text-3xl font-bold text-dark-heading">Volunteer Transcript</h2>
                        {/* NEW BUTTON LAYOUT */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button onClick={() => setIsLogModalOpen(true)} className="w-full sm:w-auto bg-primary text-dark-bg font-semibold px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                                <i className="fas fa-plus-circle"></i>
                                Log New Activity
                            </button>
                            <button onClick={() => { setServerMessage(null); setIsEmailModalOpen(true); }} disabled={activities.length === 0} className="w-full sm:w-auto bg-secondary text-white font-semibold px-5 py-2 rounded-lg hover:bg-secondary-dark transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <i className="fas fa-envelope"></i>
                                Generate & Email Transcript
                            </button>
                        </div>
                    </div>
                    <div className="bg-dark-card rounded-lg shadow-lg border border-gray-700 max-w-4xl mx-auto overflow-hidden">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <p className="text-center p-8 text-gray-400">Loading activities...</p>
                            ) : error ? (
                                <p className="text-center p-8 text-red-400">Error: {error}</p>
                            ) : (
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
                                            activities.map((activity) => (
                                                <tr key={activity.id} className="border-t border-gray-700">
                                                    {/* VERIFIED DATE FORMATTING */}
                                                    <td className="p-4 whitespace-nowrap">{new Date(activity.activityDate.seconds * 1000).toLocaleDateString()}</td>
                                                    <td className="p-4">{activity.activityType}</td>
                                                    <td className="p-4 font-bold text-right">{activity.hours.toFixed(1)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={3} className="text-center p-8 text-gray-500">You have no volunteer activities logged yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </Reveal>
            </main>
        </>
    );
};
export default DashboardPage;

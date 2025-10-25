// src/pages/DashboardPage.tsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Reveal from '../components/Reveal';
import EmailModal from '../components/EmailModal';
import LogActivityModal from '../components/LogActivityModal';

import ImpactCard from '../components/dashboard/ImpactCard';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import ActivityChart from '../components/dashboard/ActivityChart';
import AchievementsList from '../components/dashboard/AchievementsList';

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

interface CachedData {
    lastModified: { _seconds: number, _nanoseconds: number } | null;
    activities: VolunteerActivity[];
}

const CACHE_KEY = 'cachedActivities';
const REFRESH_TIMESTAMP_KEY = 'lastRefreshTimestamp';
const AUTO_SYNC_TIMESTAMP_KEY = 'lastAutoSyncTimestamp';
const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const DashboardPage = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<VolunteerActivity[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRefreshButton, setShowRefreshButton] = useState(true);
    
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState<{ key: 'date' | 'hours', order: 'asc' | 'desc' }>({ key: 'date', order: 'desc' });

    const [testResult, setTestResult] = useState('');
    // --- DIAGNOSTIC STEP 2.2: State for health check result ---
    const [healthCheckResult, setHealthCheckResult] = useState('');

    const smartSync = useCallback(async (isManualRefresh = false) => {
        if (!user) return;
        setIsRefreshing(true);
        setError(null);

        const cachedItem = localStorage.getItem(CACHE_KEY);
        const cachedData: CachedData | null = cachedItem ? JSON.parse(cachedItem) : null;

        try {
            const token = await user.getIdToken();
            const fetchOptions = {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-cache' as RequestCache
            };

            const metaResponse = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/metadata`, fetchOptions);
            if (!metaResponse.ok) throw new Error('Could not check for updates.');
            const serverMeta = await metaResponse.json();

            const serverTimestamp = serverMeta.lastModified?._seconds;
            const localTimestamp = cachedData?.lastModified?._seconds;

            if (!isManualRefresh && serverTimestamp === localTimestamp) {
                setIsRefreshing(false);
                return;
            }

            const activitiesResponse = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/activities`, fetchOptions);
            if (!activitiesResponse.ok) throw new Error('Failed to fetch activities.');
            const serverActivities: VolunteerActivity[] = await activitiesResponse.json();
            
            setActivities(serverActivities);
            localStorage.setItem(CACHE_KEY, JSON.stringify({ lastModified: serverMeta.lastModified, activities: serverActivities }));

            if (!isManualRefresh) {
                localStorage.setItem(AUTO_SYNC_TIMESTAMP_KEY, Date.now().toString());
            }
        } catch (e) {
            console.error("Data sync failed:", e);
            let errorMessage = 'An unknown error occurred during data sync.';
            if (e instanceof Error) {
                if (e.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error: Failed to sync data. Please check your internet connection. If the problem persists, the server may be temporarily unavailable.';
                } else {
                    errorMessage = e.message;
                }
            }
            setError(errorMessage);
        } finally {
            setIsRefreshing(false);
        }
    }, [user]);

    const handleTestConnectivity = async () => {
        setTestResult('Testing...');
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
            if (!response.ok) {
                throw new Error(`Response not OK. Status: ${response.status}`);
            }
            const data = await response.json();
            setTestResult(`SUCCESS: Fetched test data. Title: "${data.title}"`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setTestResult(`ERROR: Failed to fetch from test API. Message: ${errorMessage}`);
        }
    };

    // --- DIAGNOSTIC STEP 2.2: Handler function to test your backend's health check endpoint ---
    const handleHealthCheck = async () => {
        setHealthCheckResult('Testing...');
        try {
            const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/healthcheck`);
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            const data = await response.json();
            setHealthCheckResult(`SUCCESS: Health check passed. Message: "${data.message}"`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setHealthCheckResult(`ERROR: Health check failed. Message: ${errorMessage}`);
        }
    };

    useEffect(() => {
        const cachedItem = localStorage.getItem(CACHE_KEY);
        if (cachedItem) {
            setActivities(JSON.parse(cachedItem).activities);
        }
        setInitialLoading(false);

        const lastAutoSync = localStorage.getItem(AUTO_SYNC_TIMESTAMP_KEY);
        const shouldAutoSync = !lastAutoSync || (Date.now() - parseInt(lastAutoSync, 10)) > ONE_DAY_MS;

        if (shouldAutoSync) {
            smartSync(false);
        }

        const lastManualRefresh = localStorage.getItem(REFRESH_TIMESTAMP_KEY);
        if (lastManualRefresh) {
            const timeSinceLastRefresh = Date.now() - parseInt(lastManualRefresh, 10);
            if (timeSinceLastRefresh < ONE_HOUR_MS) {
                setShowRefreshButton(false);
                const timeRemaining = ONE_HOUR_MS - timeSinceLastRefresh;
                const timeoutId = setTimeout(() => setShowRefreshButton(true), timeRemaining);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [smartSync]);

    const handleRefreshClick = () => {
        const now = Date.now();
        localStorage.setItem(REFRESH_TIMESTAMP_KEY, now.toString());
        setShowRefreshButton(false);
        smartSync(true);
        setTimeout(() => setShowRefreshButton(true), ONE_HOUR_MS);
    };

    const handleActivityAdded = (newActivity: VolunteerActivity) => {
        const updatedActivities = [newActivity, ...activities];
        setActivities(updatedActivities);
        
        const cachedItem = localStorage.getItem(CACHE_KEY);
        const cachedData: CachedData = cachedItem ? JSON.parse(cachedItem) : { lastModified: null, activities: [] };
        cachedData.activities = updatedActivities;
        cachedData.lastModified = null; 
        localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
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

    const totalHours = useMemo(() => activities.reduce((sum, act) => sum + (act.hours || 0), 0), [activities]);
    const totalSessions = activities.length;

    const filteredAndSortedActivities = useMemo(() => {
        return [...activities]
            .filter(act => filter === 'All' || act.activityType === filter)
            .sort((a, b) => {
                if (sort.key === 'date') {
                    return sort.order === 'asc' ? a.activityDate._seconds - b.activityDate._seconds : b.activityDate._seconds - a.activityDate._seconds;
                } else {
                    return sort.order === 'asc' ? a.hours - b.hours : b.hours - a.hours;
                }
            });
    }, [activities, filter, sort]);

    const handleSort = (key: 'date' | 'hours') => {
        setSort(prev => ({
            key,
            order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const SortIcon = ({ column }: { column: 'date' | 'hours' }) => {
        if (sort.key !== column) return <i className="fas fa-sort text-gray-400 ml-2"></i>;
        return sort.order === 'desc' ? <i className="fas fa-sort-down text-white ml-2"></i> : <i className="fas fa-sort-up text-white ml-2"></i>;
    };

    const SkeletonLoader = () => (
        <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8"><div className="h-24 bg-dark-card rounded-2xl animate-pulse"></div><div className="h-24 bg-dark-card rounded-2xl animate-pulse"></div><div className="h-24 bg-dark-card rounded-2xl animate-pulse"></div></div>
            <div className="grid lg:grid-cols-3 gap-8"><div className="lg:col-span-1 h-80 bg-dark-card rounded-2xl animate-pulse"></div><div className="lg:col-span-2 h-80 bg-dark-card rounded-2xl animate-pulse"></div></div>
        </div>
    );

    return (
        <>
            <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} onSubmit={handleGenerateTranscript} isLoading={isGenerating} defaultEmail={user?.email || ''} />
            <LogActivityModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} onActivityAdded={handleActivityAdded} />

            <main className="container mx-auto px-6 py-20 mt-16">
                <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-dark-heading">Mission Control</h1>
                        <p className="text-lg mt-2 text-dark-text">Welcome back, {user?.displayName?.split(' ')[0] || 'Volunteer'}!</p>
                    </div>
                    <div className="flex gap-4 mt-6 md:mt-0">
                        {showRefreshButton && (
                            <button onClick={handleRefreshClick} disabled={isRefreshing} className="bg-white/10 backdrop-blur-md border border-white/20 text-dark-heading font-semibold px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                                <i className={`fas fa-sync ${isRefreshing ? 'fa-spin' : ''}`}></i>
                                <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                            </button>
                        )}
                        <button onClick={() => setIsLogModalOpen(true)} className="bg-primary/80 backdrop-blur-md border border-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2 cta-button">
                            <i className="fas fa-plus-circle"></i><span>Log Activity</span>
                        </button>
                    </div>
                </Reveal>

                <Reveal className="mb-8">
                    <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-2xl space-y-4">
                        <div>
                            <h3 className="font-bold text-gray-300 text-lg mb-2">Diagnostic Panel (Step 1.2)</h3>
                            <button onClick={handleTestConnectivity} className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                                Test General Connectivity
                            </button>
                            {testResult && (
                                <div className="mt-2 p-3 bg-black/30 rounded-lg">
                                    <p className="font-mono text-gray-200 whitespace-pre-wrap">{testResult}</p>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-gray-700 pt-4">
                            <h3 className="font-bold text-blue-300 text-lg mb-2">Diagnostic Panel (Step 2.2)</h3>
                            <p className="text-sm text-blue-400 mb-4">Now, please click this new button and report the exact message.</p>
                            <button onClick={handleHealthCheck} className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                Test TutorDeck API Health
                            </button>
                            {healthCheckResult && (
                                <div className="mt-2 p-3 bg-black/30 rounded-lg">
                                    <p className="font-mono text-blue-200 whitespace-pre-wrap">{healthCheckResult}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Reveal>

                {serverMessage && (<Reveal className="mb-8"><div className={`p-4 rounded-2xl text-center backdrop-blur-xl border ${serverMessage.type === 'success' ? 'bg-green-500/20 border-green-400 text-green-200' : 'bg-red-500/20 border-red-400 text-red-200'}`}>{serverMessage.text}</div></Reveal>)}

                {initialLoading ? <SkeletonLoader /> : error ? <p className="text-center p-8 text-red-400 bg-black/20 backdrop-blur-xl border border-red-400/50 rounded-2xl">{error}</p> : (
                    <div className="space-y-12">
                        {/* The rest of the component remains unchanged */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-8">
                                <ImpactCard icon="fa-clock" label="Total Hours Logged" value={totalHours.toFixed(1)} colorClass="text-primary" />
                                <ImpactCard icon="fa-check-circle" label="Sessions Completed" value={totalSessions} colorClass="text-secondary" />
                                <ProgressTracker totalHours={totalHours} />
                            </div>
                            <div className="lg:col-span-2 space-y-8">
                                <ActivityChart activities={activities} />
                                <Reveal>
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                        <h2 className="text-2xl font-bold text-dark-heading">Volunteer Transcript</h2>
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <select onChange={(e) => setFilter(e.target.value)} value={filter} className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-xl py-2 px-3 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-auto">
                                                <option>All</option><option>Peer Tutoring</option><option>Mentorship</option>
                                            </select>
                                            <button onClick={() => { setServerMessage(null); setIsEmailModalOpen(true); }} disabled={activities.length === 0} className="bg-secondary/80 backdrop-blur-md text-white font-semibold px-4 py-2 rounded-xl hover:bg-secondary transition-colors disabled:bg-gray-500/20 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm border border-secondary">
                                                <i className="fas fa-envelope"></i><span>Email</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="border-b border-white/20">
                                                    <tr>
                                                        <th className="p-4 font-semibold text-primary cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('date')}>Date <SortIcon column="date" /></th>
                                                        <th className="p-4 font-semibold text-primary">Activity</th>
                                                        <th className="p-4 font-semibold text-primary text-right cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('hours')}>Hours <SortIcon column="hours" /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredAndSortedActivities.length > 0 ? (
                                                        filteredAndSortedActivities.map((activity) => (
                                                            <tr key={activity.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                                                                <td className="p-4 whitespace-nowrap">{new Date(activity.activityDate._seconds * 1000).toLocaleDateString()}</td>
                                                                <td className="p-4">{activity.activityType}</td>
                                                                <td className="p-4 font-bold text-right">{activity.hours.toFixed(1)}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={3} className="text-center p-8 text-gray-400">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <i className="fas fa-folder-open text-4xl text-gray-500"></i>
                                                                <span className="font-semibold">No Activities Found</span>
                                                                <p className="text-sm max-w-xs">Log your first volunteer session to see your transcript and start tracking your impact!</p>
                                                            </div>
                                                        </td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                        <AchievementsList activities={activities} />
                    </div>
                )}
            </main>
        </>
    );
};
export default DashboardPage;

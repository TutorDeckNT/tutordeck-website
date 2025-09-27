// TypeScript
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

// The cache now also stores the timestamp from the server's metadata
interface CachedData {
    lastModified: { _seconds: number, _nanoseconds: number } | null;
    activities: VolunteerActivity[];
}

const CACHE_KEY = 'cachedActivities';

const DashboardPage = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<VolunteerActivity[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState<{ key: 'date' | 'hours', order: 'asc' | 'desc' }>({ key: 'date', order: 'desc' });

    const smartSync = useCallback(async (forceRefresh = false) => {
        if (!user) return;
        setIsRefreshing(true);
        setError(null);

        const cachedItem = localStorage.getItem(CACHE_KEY);
        const cachedData: CachedData | null = cachedItem ? JSON.parse(cachedItem) : null;

        try {
            const token = await user.getIdToken();
            
            // 1. Always fetch the cheap metadata first.
            const metaResponse = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/metadata`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!metaResponse.ok) throw new Error('Could not check for updates.');
            const serverMeta = await metaResponse.json();

            // 2. Compare timestamps to see if a full sync is needed.
            const serverTimestamp = serverMeta.lastModified?._seconds;
            const localTimestamp = cachedData?.lastModified?._seconds;

            if (!forceRefresh && serverTimestamp === localTimestamp) {
                console.log("Cache is fresh. No full sync needed. Reads: 1");
                setIsRefreshing(false);
                return; // EXIT: The cache is up-to-date.
            }

            // 3. Only if timestamps differ (or on forced refresh), fetch all activities.
            console.log("Cache is stale. Performing full sync...");
            const activitiesResponse = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/activities`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!activitiesResponse.ok) throw new Error('Failed to fetch activities.');
            const serverActivities: VolunteerActivity[] = await activitiesResponse.json();
            
            setActivities(serverActivities);
            
            // 4. Update the cache with the new data and the new server timestamp.
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                lastModified: serverMeta.lastModified,
                activities: serverActivities
            }));

        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        // On initial load, populate from cache first for instant UI.
        const cachedItem = localStorage.getItem(CACHE_KEY);
        if (cachedItem) {
            setActivities(JSON.parse(cachedItem).activities);
        }
        setInitialLoading(false);

        // Then, kick off the smart sync in the background.
        smartSync();
    }, [smartSync]);

    const handleActivityAdded = (newActivity: VolunteerActivity) => {
        // Optimistically update the UI for a snappy experience.
        const updatedActivities = [newActivity, ...activities];
        setActivities(updatedActivities);
        
        // We don't know the new server timestamp, so we mark our cache as potentially stale
        // by setting the timestamp to null. The next background sync will fix it.
        const cachedItem = localStorage.getItem(CACHE_KEY);
        
        // --- FIX STARTS HERE ---
        // Initialize with a default structure if nothing is in the cache.
        // This guarantees cachedData is an object and satisfies TypeScript.
        const cachedData: CachedData = cachedItem 
            ? JSON.parse(cachedItem) 
            : { lastModified: null, activities: [] };

        // Now we can safely modify the properties.
        cachedData.activities = updatedActivities;
        cachedData.lastModified = null; // Invalidate timestamp to force a sync on next load
        // --- FIX ENDS HERE ---

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
        if (sort.key !== column) return <i className="fas fa-sort text-gray-500 ml-2"></i>;
        return sort.order === 'desc' ? <i className="fas fa-sort-down text-white ml-2"></i> : <i className="fas fa-sort-up text-white ml-2"></i>;
    };

    const SkeletonLoader = () => (
        <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8"><div className="h-24 bg-dark-card rounded-lg animate-pulse"></div><div className="h-24 bg-dark-card rounded-lg animate-pulse"></div><div className="h-24 bg-dark-card rounded-lg animate-pulse"></div></div>
            <div className="grid lg:grid-cols-3 gap-8"><div className="lg:col-span-1 h-80 bg-dark-card rounded-lg animate-pulse"></div><div className="lg:col-span-2 h-80 bg-dark-card rounded-lg animate-pulse"></div></div>
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
                        <button onClick={() => smartSync(true)} disabled={isRefreshing} className="bg-dark-card border border-gray-600 text-dark-text font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                            <i className={`fas fa-sync ${isRefreshing ? 'fa-spin' : ''}`}></i>
                            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                        </button>
                        <button onClick={() => setIsLogModalOpen(true)} className="bg-primary text-dark-bg font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 cta-button">
                            <i className="fas fa-plus-circle"></i><span>Log Activity</span>
                        </button>
                    </div>
                </Reveal>

                {serverMessage && (<Reveal className="mb-8"><div className={`p-4 rounded-lg text-center ${serverMessage.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>{serverMessage.text}</div></Reveal>)}

                {initialLoading ? <SkeletonLoader /> : error ? <p className="text-center p-8 text-red-400">Error: {error}</p> : (
                    <div className="space-y-12">
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
                                            <select onChange={(e) => setFilter(e.target.value)} value={filter} className="bg-dark-card border border-gray-600 rounded-lg py-2 px-3 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-auto">
                                                <option>All</option><option>Peer Tutoring</option><option>Mentorship</option>
                                            </select>
                                            <button onClick={() => { setServerMessage(null); setIsEmailModalOpen(true); }} disabled={activities.length === 0} className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                                                <i className="fas fa-envelope"></i><span>Email</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-dark-card rounded-lg border border-gray-700 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-dark-bg">
                                                    <tr>
                                                        <th className="p-4 font-semibold text-primary cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => handleSort('date')}>Date <SortIcon column="date" /></th>
                                                        <th className="p-4 font-semibold text-primary">Activity</th>
                                                        <th className="p-4 font-semibold text-primary text-right cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => handleSort('hours')}>Hours <SortIcon column="hours" /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredAndSortedActivities.length > 0 ? (
                                                        filteredAndSortedActivities.map((activity) => (
                                                            <tr key={activity.id} className="border-t border-gray-700 hover:bg-dark-bg transition-colors">
                                                                <td className="p-4 whitespace-nowrap">{new Date(activity.activityDate._seconds * 1000).toLocaleDateString()}</td>
                                                                <td className="p-4">{activity.activityType}</td>
                                                                <td className="p-4 font-bold text-right">{activity.hours.toFixed(1)}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={3} className="text-center p-8 text-gray-500">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <i className="fas fa-folder-open text-4xl text-gray-600"></i>
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

import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Reveal from './Reveal';

interface LogActivityFormProps {
    onActivityAdded: () => void; // Callback to refresh the list
}

const LogActivityForm = ({ onActivityAdded }: LogActivityFormProps) => {
    const { user } = useAuth();
    const [activityType, setActivityType] = useState('Peer Tutoring');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');
    const [proofLink, setProofLink] = useState('');
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to submit an activity.");
            return;
        }

        // Basic validation
        if (!activityType || !activityDate || !hours || !proofLink) {
            setError("Please fill out all fields.");
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    activityType,
                    activityDate,
                    hours: parseFloat(hours),
                    proofLink
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "An unknown error occurred.");
            }

            setSuccess("Activity logged successfully!");
            // Reset form
            setActivityType('Peer Tutoring');
            setActivityDate(new Date().toISOString().split('T')[0]);
            setHours('');
            setProofLink('');
            // Trigger refresh on dashboard
            onActivityAdded();

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit activity.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Reveal as="section" className="max-w-4xl mx-auto bg-dark-card p-8 rounded-lg border border-gray-700">
            <h2 className="text-3xl font-bold text-dark-heading mb-6">Log a New Volunteer Activity</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                    <label htmlFor="activityType" className="block text-sm font-medium text-dark-text mb-2">Activity Type</label>
                    <select id="activityType" value={activityType} onChange={e => setActivityType(e.target.value)} className="w-full bg-dark-bg border border-gray-600 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Peer Tutoring</option>
                        <option>Mentorship</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="activityDate" className="block text-sm font-medium text-dark-text mb-2">Date of Activity</label>
                    <input type="date" id="activityDate" value={activityDate} onChange={e => setActivityDate(e.target.value)} required className="w-full bg-dark-bg border border-gray-600 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <div>
                    <label htmlFor="hours" className="block text-sm font-medium text-dark-text mb-2">Hours Completed</label>
                    <input type="number" id="hours" value={hours} onChange={e => setHours(e.target.value)} required min="0.1" step="0.1" placeholder="e.g., 1.5" className="w-full bg-dark-bg border border-gray-600 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="proofLink" className="block text-sm font-medium text-dark-text mb-2">
                        Proof of Activity (Dropbox Link)
                        <span className="group relative ml-2">
                            <i className="fas fa-info-circle text-gray-400 cursor-pointer"></i>
                            <span className="absolute bottom-full mb-2 w-72 bg-dark-bg border border-gray-600 text-dark-text text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2">
                                1. Upload your audio/video proof to your Dropbox account.
                                <br />2. Click 'Share' then 'Copy link'.
                                <br />3. Ensure link settings are 'Anyone with the link can view'.
                                <br />4. Paste the link here.
                            </span>
                        </span>
                    </label>
                    <input type="url" id="proofLink" value={proofLink} onChange={e => setProofLink(e.target.value)} required placeholder="https://www.dropbox.com/..." className="w-full bg-dark-bg border border-gray-600 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <div className="md:col-span-2 text-right">
                    <button type="submit" disabled={submitting} className="bg-primary text-dark-bg font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-600 disabled:cursor-wait flex items-center gap-2 ml-auto">
                        {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : 'Log Activity'}
                    </button>
                </div>

                {error && <p className="md:col-span-2 text-red-400 text-sm text-center">{error}</p>}
                {success && <p className="md:col-span-2 text-green-400 text-sm text-center">{success}</p>}
            </form>
        </Reveal>
    );
};

export default LogActivityForm;

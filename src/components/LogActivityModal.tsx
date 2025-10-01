// src/components/LogActivityModal.tsx

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

declare const flatpickr: any;

interface VolunteerActivity {
    id: string;
    activityType: string;
    activityDate: { _seconds: number; _nanoseconds: number; };
    hours: number;
    proofLink: string;
}

interface LogActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onActivityAdded: (newActivity: VolunteerActivity) => void;
}

const LogActivityModal = ({ isOpen, onClose, onActivityAdded }: LogActivityModalProps) => {
    const { user } = useAuth();
    const [activityType, setActivityType] = useState('');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T'));
    const [hours, setHours] = useState('');
    const [proofLink, setProofLink] = useState('');
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && dateInputRef.current) {
            const instance = flatpickr(dateInputRef.current, {
                dateFormat: "Y-m-d",
                defaultDate: new Date().toISOString().split('T'),
                onChange: (selectedDates: Date[]) => {
                    if (selectedDates) {
                        setActivityDate(selectedDates.toISOString().split('T'));
                    }
                },
            });
            return () => { instance.destroy(); };
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setActivityType('');
            setActivityDate(new Date().toISOString().split('T'));
            setHours('');
            setProofLink('');
            setError(null);
            setSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!user) { setError("You must be logged in to submit an activity."); return; }
        if (parseFloat(hours) <= 0) { setError("Hours must be a positive number."); return; }
        if (parseFloat(hours) > 8) { setError("You cannot log more than 8 hours for a single activity."); return; }
        setSubmitting(true);
        try {
            const token = await user.getIdToken();
            
            const activityData = { activityType, activityDate, hours: parseFloat(hours), proofLink };
            
            const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/activities`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: token,
                    ...activityData 
                })
            });

            const data = await response.json();
            if (!response.ok) { throw new Error(data.message || "An unknown error occurred."); }
            onActivityAdded(data);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit activity.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-black/20 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-dark-heading">Log a New Activity</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><i className="fas fa-times text-xl"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="activityType" className="block text-sm font-medium text-dark-text mb-2">Activity Type</label>
                        <select id="activityType" value={activityType} onChange={e => setActivityType(e.target.value)} required className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="" disabled>Select an activity type...</option><option>Peer Tutoring</option><option>Mentorship</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="activityDate" className="block text-sm font-medium text-dark-text mb-2">Date of Activity</label>
                        <input ref={dateInputRef} type="text" id="activityDate" required placeholder="Select date" className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary custom-calendar-icon" />
                    </div>
                    <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-dark-text mb-2">Hours (Max 8)</label>
                        <input type="number" id="hours" value={hours} onChange={e => setHours(e.target.value)} required min="0.1" max="8" step="0.1" placeholder="e.g., 1.5" className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="proofLink" className="block text-sm font-medium text-dark-text mb-2">Proof of Activity (Dropbox Link)</label>
                        <input type="url" id="proofLink" value={proofLink} onChange={e => setProofLink(e.target.value)} required placeholder="https://www.dropbox.com/..." className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    {error && <p className="md:col-span-2 text-red-400 text-sm text-center -my-2">{error}</p>}
                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-6 py-2 rounded-lg bg-primary text-dark-bg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-500 disabled:cursor-wait flex items-center gap-2">
                            {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : 'Log Activity'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogActivityModal;

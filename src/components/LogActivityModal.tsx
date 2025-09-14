import { useState, FormEvent, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Since we are loading Flowbite from a CDN, we need to tell TypeScript
// that the 'Datepicker' global variable will exist.
declare const Datepicker: any;

interface LogActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onActivityAdded: () => void;
}

const LogActivityModal = ({ isOpen, onClose, onActivityAdded }: LogActivityModalProps) => {
    const { user } = useAuth();
    const [activityType, setActivityType] = useState('');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');
    const [proofLink, setProofLink] = useState('');
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create a ref for the datepicker input element
    const datepickerInputRef = useRef<HTMLInputElement>(null);

    // This effect initializes and destroys the datepicker instance
    useEffect(() => {
        if (isOpen && datepickerInputRef.current) {
            const datepicker = new Datepicker(datepickerInputRef.current, {
                autohide: true,
                format: 'yyyy-mm-dd',
                todayHighlight: true,
            });

            // Function to handle date changes from the datepicker
            const handleChangeDate = (e: any) => {
                const newDate = e.detail.date;
                if (newDate) {
                    // Format the date to YYYY-MM-DD string to store in state
                    const year = newDate.getFullYear();
                    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
                    const day = newDate.getDate().toString().padStart(2, '0');
                    setActivityDate(`${year}-${month}-${day}`);
                }
            };

            datepickerInputRef.current.addEventListener('changeDate', handleChangeDate);

            // Cleanup function to destroy the datepicker when the modal closes
            return () => {
                datepicker.destroy();
                datepickerInputRef.current?.removeEventListener('changeDate', handleChangeDate);
            };
        }
    }, [isOpen]); // Re-run the effect when the modal opens

    // Reset form state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setActivityType('');
            setActivityDate(new Date().toISOString().split('T')[0]);
            setHours('');
            setProofLink('');
            setError(null);
            setSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError("You must be logged in to submit an activity.");
            return;
        }

        if (parseFloat(hours) > 8) {
            setError("You cannot log more than 8 hours for a single activity.");
            return;
        }

        setSubmitting(true);

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

            onActivityAdded();
            onClose();

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit activity.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-dark-card rounded-lg shadow-2xl p-8 w-full max-w-lg border border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-dark-heading">Log a New Activity</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="activityType" className="block text-sm font-medium text-dark-text mb-2">Activity Type</label>
                        <select id="activityType" value={activityType} onChange={e => setActivityType(e.target.value)} required className="w-full bg-dark-bg border border-gray-600 rounded-lg py-2.5 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="" disabled>Select an activity type...</option>
                            <option>Peer Tutoring</option>
                            <option>Mentorship</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="activityDate" className="block text-sm font-medium text-dark-text mb-2">Date of Activity</label>
                        {/* Flowbite Datepicker HTML Structure */}
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                </svg>
                            </div>
                            <input 
                                ref={datepickerInputRef}
                                type="text" 
                                id="activityDate"
                                value={activityDate}
                                onInput={(e) => setActivityDate((e.target as HTMLInputElement).value)} // Keep state in sync
                                required 
                                className="bg-dark-bg border border-gray-600 text-dark-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5" 
                                placeholder="Select date"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-dark-text mb-2">Hours (Max 8)</label>
                        <input type="number" id="hours" value={hours} onChange={e => setHours(e.target.value)} required min="0.1" max="8" step="0.1" placeholder="e.g., 1.5" className="w-full bg-dark-bg border border-gray-600 rounded-lg py-2.5 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="proofLink" className="block text-sm font-medium text-dark-text mb-2">Proof of Activity (Dropbox Link)</label>
                        <input type="url" id="proofLink" value={proofLink} onChange={e => setProofLink(e.target.value)} required placeholder="https://www.dropbox.com/..." className="w-full bg-dark-bg border border-gray-600 rounded-lg py-2.5 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>

                    {error && <p className="md:col-span-2 text-red-400 text-sm text-center -my-2">{error}</p>}

                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
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

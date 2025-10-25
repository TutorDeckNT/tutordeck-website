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
    const [currentStep, setCurrentStep] = useState(0);
    
    // Form State
    const [activityType, setActivityType] = useState<'Peer Tutoring' | 'Mentorship' | ''>('');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');
    const [proofLink, setProofLink] = useState('');
    
    // Control State
    const [isStepValid, setIsStepValid] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const dateInputRef = useRef<HTMLInputElement>(null);
    const hoursInputRef = useRef<HTMLInputElement>(null);
    const proofInputRef = useRef<HTMLInputElement>(null);

    const steps = [
        { id: 'type', title: 'Activity Type', icon: 'fa-tags' },
        { id: 'date', title: 'Date', icon: 'fa-calendar-alt' },
        { id: 'hours', title: 'Hours', icon: 'fa-clock' },
        { id: 'proof', title: 'Proof', icon: 'fa-link' },
        { id: 'review', title: 'Review', icon: 'fa-check-double' }
    ];
    const totalSteps = steps.length;

    // Reset state when modal is closed or opened
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setActivityType('');
            setActivityDate(new Date().toISOString().split('T')[0]);
            setHours('');
            setProofLink('');
            setApiError(null);
            setSubmitting(false);
            setIsSuccess(false);
        }
    }, [isOpen]);

    // Validate the current step whenever a relevant value changes
    useEffect(() => {
        const validate = () => {
            switch (currentStep) {
                case 0: return !!activityType;
                case 1: return !!activityDate;
                case 2:
                    const numHours = parseFloat(hours);
                    return !isNaN(numHours) && numHours > 0 && numHours <= 8;
                case 3:
                    if (!proofLink) return false;
                    try { new URL(proofLink); return true; } catch { return false; }
                default: return true;
            }
        };
        setIsStepValid(validate());
    }, [currentStep, activityType, activityDate, hours, proofLink]);

    // Initialize Flatpickr when the date step is active
    useEffect(() => {
        let instance: any = null;
        if (isOpen && currentStep === 1 && dateInputRef.current) {
            instance = flatpickr(dateInputRef.current, {
                dateFormat: "Y-m-d",
                defaultDate: activityDate,
                maxDate: new Date(),
                onChange: (selectedDates: Date[]) => {
                    if (selectedDates[0]) {
                        setActivityDate(selectedDates[0].toISOString().split('T')[0]);
                    }
                },
            });
        }
        return () => { if (instance) instance.destroy(); };
    }, [isOpen, currentStep, activityDate]);

    // Auto-focus inputs on step change
    useEffect(() => {
        if (currentStep === 1) dateInputRef.current?.focus();
        if (currentStep === 2) hoursInputRef.current?.focus();
        if (currentStep === 3) proofInputRef.current?.focus();
    }, [currentStep]);

    const handleNext = () => {
        if (isStepValid && currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSelectActivityType = (type: 'Peer Tutoring' | 'Mentorship') => {
        setActivityType(type);
        setTimeout(() => setCurrentStep(1), 200);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isStepValid) return;
        setApiError(null);
        if (!user) { setApiError("You must be logged in."); return; }
        
        setSubmitting(true);
        try {
            const token = await user.getIdToken();
            const activityData = { activityType, activityDate, hours: parseFloat(hours), proofLink };
            
            const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, ...activityData })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "An unknown error occurred.");
            
            onActivityAdded(data);
            setIsSuccess(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to submit activity.";
            setApiError(errorMessage.includes('Failed to fetch') ? 'Network Error: Could not connect to the server.' : errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentStep >= 1 && currentStep < totalSteps - 1) {
            e.preventDefault();
            handleNext();
        }
    };

    if (!isOpen) return null;

    const renderStepContent = () => {
        if (isSuccess) {
            return (
                <div className="text-center flex flex-col items-center justify-center h-full p-8">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6"><i className="fas fa-check-circle text-5xl text-primary"></i></div>
                    <h2 className="text-3xl font-bold text-dark-heading mb-2">Activity Logged!</h2>
                    <p className="text-dark-text mb-8">Your contribution has been recorded. Thank you!</p>
                    <button onClick={onClose} className="cta-button bg-primary text-dark-bg font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors">Close</button>
                </div>
            );
        }

        const stepDetails = [
            { title: 'Select Activity Type', description: 'Choose the category that best fits your volunteer work.' },
            { title: 'Select the Date', description: 'When did this activity take place? Use the calendar to select a date.' },
            { title: 'Log Your Hours', description: 'Enter the number of hours you volunteered for this session (e.g., 1.5).' },
            { title: 'Provide Proof', description: 'Link to a document or image that verifies your activity (e.g., Dropbox, Google Drive).' },
            { title: 'Review & Submit', description: 'Please confirm the details below are correct before submitting.' }
        ];

        return (
            <div className="flex flex-col h-full">
                <div className="p-8 md:p-10 flex-grow" onKeyDown={handleKeyPress}>
                    <h2 className="text-3xl font-bold text-dark-heading mb-2">{stepDetails[currentStep].title}</h2>
                    <p className="text-dark-text mb-8">{stepDetails[currentStep].description}</p>
                    
                    <div className="relative h-48">
                        {/* Step 0: Activity Type */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => handleSelectActivityType('Peer Tutoring')} className="p-6 flex-1 bg-white/5 border-2 border-white/10 hover:border-primary rounded-xl text-left transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"><i className="fas fa-book-reader text-2xl text-primary mb-2"></i><h3 className="text-lg font-bold text-dark-heading">Peer Tutoring</h3></button>
                                <button onClick={() => handleSelectActivityType('Mentorship')} className="p-6 flex-1 bg-white/5 border-2 border-white/10 hover:border-secondary rounded-xl text-left transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary"><i className="fas fa-user-friends text-2xl text-secondary mb-2"></i><h3 className="text-lg font-bold text-dark-heading">Mentorship</h3></button>
                            </div>
                        </div>
                        {/* Step 1: Date */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <label htmlFor="activityDate" className="block text-sm font-medium text-dark-text mb-2">Date</label>
                            <input ref={dateInputRef} id="activityDate" type="text" placeholder="YYYY-MM-DD" className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary custom-calendar-icon" />
                        </div>
                        {/* Step 2: Hours */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <label htmlFor="hours" className="block text-sm font-medium text-dark-text mb-2">Hours Volunteered</label>
                            <input ref={hoursInputRef} id="hours" type="number" value={hours} onChange={e => setHours(e.target.value)} min="0.1" max="8" step="0.1" placeholder="e.g., 1.5" className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        {/* Step 3: Proof Link */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <label htmlFor="proofLink" className="block text-sm font-medium text-dark-text mb-2">Proof URL</label>
                            <input ref={proofInputRef} id="proofLink" type="url" value={proofLink} onChange={e => setProofLink(e.target.value)} placeholder="https://www.dropbox.com/..." className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        {/* Step 4: Review */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <div className="bg-black/20 border border-white/20 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="font-semibold text-dark-text">Type:</span><span className="text-dark-heading font-bold">{activityType}</span></div>
                                <div className="flex justify-between"><span className="font-semibold text-dark-text">Date:</span><span className="text-dark-heading font-bold">{new Date(activityDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
                                <div className="flex justify-between"><span className="font-semibold text-dark-text">Hours:</span><span className="text-dark-heading font-bold">{parseFloat(hours || '0').toFixed(1)}</span></div>
                            </div>
                            {apiError && <p className="text-red-400 text-xs text-center pt-2">{apiError}</p>}
                        </div>
                    </div>
                </div>
                {/* Navigation Footer */}
                <div className="flex-shrink-0 p-6 bg-black/20 border-t border-white/10 rounded-b-lg flex items-center justify-between">
                    <button onClick={handleBack} disabled={currentStep === 0 || submitting} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                    {currentStep < totalSteps - 1 ? (
                        <button onClick={handleNext} disabled={!isStepValid} className="px-8 py-2 rounded-lg bg-primary text-dark-bg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-500/40 disabled:text-gray-400 disabled:cursor-not-allowed">Next</button>
                    ) : (
                        <button onClick={handleSubmit} disabled={submitting || !isStepValid} className="px-8 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark transition-colors disabled:bg-gray-500/40 disabled:text-gray-400 disabled:cursor-wait flex items-center gap-2">
                            {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : 'Submit Activity'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-dark-card/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Left Navigation Panel */}
                <div className="w-1/3 bg-black/20 p-8 border-r border-white/10 hidden md:block">
                    <h3 className="font-bold text-dark-heading text-xl mb-8">Log New Activity</h3>
                    <ul className="space-y-4">
                        {steps.map((step, index) => {
                            const isCompleted = currentStep > index;
                            const isActive = currentStep === index;
                            return (
                                <li key={step.id} className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary/20' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isCompleted ? 'bg-primary text-dark-bg' : isActive ? 'bg-primary text-dark-bg ring-4 ring-primary/30' : 'bg-white/10 text-dark-text'}`}>
                                        {isCompleted ? <i className="fas fa-check"></i> : <i className={`fas ${step.icon}`}></i>}
                                    </div>
                                    <span className={`font-semibold ${isCompleted ? 'text-dark-text' : isActive ? 'text-primary' : 'text-gray-500'}`}>{step.title}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {/* Right Content Panel */}
                <div className="w-full md:w-2/3">
                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
};

export default LogActivityModal;

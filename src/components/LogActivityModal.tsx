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
    const [activityType, setActivityType] = useState('');
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [otherActivityText, setOtherActivityText] = useState('');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('1');
    const [proofLink, setProofLink] = useState('');
    
    // Control State
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shakeError, setShakeError] = useState(false);
    const [proofValidationState, setProofValidationState] = useState<'idle' | 'invalid' | 'valid'>('idle');
    const [showProofTooltip, setShowProofTooltip] = useState(false);

    const calendarContainerRef = useRef<HTMLDivElement>(null);
    const flatpickrInstance = useRef<any>(null);
    const otherInputRef = useRef<HTMLInputElement>(null);

    const steps = [
        { id: 'type', title: 'What type of activity did you complete?', subtitle: 'Choose one of the options below.' },
        { id: 'date', title: 'When did this activity take place?', subtitle: 'You can select a date from the calendar.' },
        { id: 'hours', title: 'How many hours did you volunteer?', subtitle: 'Enter a value between 0.1 and 8.' },
        { id: 'proof', title: 'Please provide a link to your proof.', subtitle: 'A valid URL to a screenshot or document is required.' },
        { id: 'review', title: 'Ready to submit?', subtitle: 'Please review the details before confirming.' }
    ];
    const totalSteps = steps.length;

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 0: return !!activityType;
            case 1: return !!activityDate;
            case 2: const h = parseFloat(hours); return !isNaN(h) && h > 0 && h <= 8;
            case 3: return proofValidationState === 'valid';
            default: return false;
        }
    };

    // Reset state when modal is closed or opened
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setActivityType('');
            setIsOtherSelected(false);
            setOtherActivityText('');
            setActivityDate(new Date().toISOString().split('T')[0]);
            setHours('1');
            setProofLink('');
            setErrors({});
            setApiError(null);
            setSubmitting(false);
            setIsSuccess(false);
            setProofValidationState('idle');
        }
    }, [isOpen]);

    // Initialize or update Flatpickr when the date step is active
    useEffect(() => {
        if (isOpen && currentStep === 1 && calendarContainerRef.current) {
            if (!flatpickrInstance.current) {
                flatpickrInstance.current = flatpickr(calendarContainerRef.current, {
                    inline: true,
                    dateFormat: "Y-m-d",
                    defaultDate: activityDate,
                    maxDate: new Date(),
                    onChange: (selectedDates: Date[]) => {
                        if (selectedDates[0]) {
                            setActivityDate(selectedDates[0].toISOString().split('T')[0]);
                            setErrors({});
                        }
                    },
                });
            }
        }
    }, [isOpen, currentStep, activityDate]);

    const triggerShake = () => {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 820);
    };

    const validateStep = (step: number): boolean => {
        const newErrors: { [key: string]: string | null } = {};
        let isValid = true;

        switch (step) {
            case 0:
                if (!activityType) {
                    newErrors.type = 'Please select an activity type.';
                    isValid = false;
                }
                break;
            case 2:
                const numHours = parseFloat(hours);
                if (!hours || isNaN(numHours)) newErrors.hours = 'Please enter a valid number.';
                else if (numHours <= 0) newErrors.hours = 'Hours must be a positive number.';
                else if (numHours > 8) newErrors.hours = 'You cannot log more than 8 hours.';
                if (newErrors.hours) isValid = false;
                break;
            case 3:
                if (proofValidationState !== 'valid') {
                    newErrors.proof = 'Please enter a valid URL.';
                    isValid = false;
                }
                break;
        }
        setErrors(newErrors);
        if (!isValid) triggerShake();
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setErrors({});
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleSelectActivityType = (type: string) => {
        setIsOtherSelected(false);
        setActivityType(type);
        setErrors({});
        setTimeout(() => setCurrentStep(1), 300);
    };

    const handleOtherClick = () => {
        setActivityType('');
        setIsOtherSelected(true);
        setTimeout(() => otherInputRef.current?.focus(), 100);
    };

    const handleConfirmOther = () => {
        if (otherActivityText.trim()) {
            setActivityType(otherActivityText.trim());
            setIsOtherSelected(false);
            setErrors({});
            setTimeout(() => setCurrentStep(1), 300);
        } else {
            setErrors({ type: 'Please describe your activity.' });
            triggerShake();
        }
    };
    
    const handleHoursChange = (amount: number) => {
        const currentHours = parseFloat(hours) || 0;
        const newHours = Math.max(0.1, Math.min(8, currentHours + amount));
        setHours(newHours.toFixed(1));
    };

    const handleProofLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setProofLink(url);
        if (url === '') {
            setProofValidationState('idle');
            return;
        }
        try {
            new URL(url);
            setProofValidationState('valid');
            setErrors({});
        } catch (_) {
            setProofValidationState('invalid');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
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

    const renderStepContent = () => {
        if (isSuccess) {
            return (
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6"><i className="fas fa-check-circle text-5xl text-primary"></i></div>
                    <h2 className="text-3xl font-bold text-dark-heading mb-2">Activity Logged!</h2>
                    <p className="text-dark-text mb-8">Your contribution has been recorded. Thank you!</p>
                    <button onClick={onClose} className="cta-button bg-primary text-dark-bg font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light">Close</button>
                </div>
            );
        }

        const step = steps[currentStep];
        return (
            <div className="relative h-full">
                <div className={`absolute inset-0 transition-all duration-500 ease-in-out flex flex-col justify-center ${shakeError ? 'shake' : ''}`}>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark-heading">{step.title}</h2>
                        <p className="text-dark-text mt-2">{step.subtitle}</p>
                    </div>
                    
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${isOtherSelected ? 'opacity-50 pointer-events-none' : ''}`}>
                                <button onClick={() => handleSelectActivityType('Peer Tutoring')} className={`p-6 bg-white/5 border-2 rounded-xl text-left transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card ${activityType === 'Peer Tutoring' ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}><i className="fas fa-book-reader text-3xl text-primary mb-3"></i><h3 className="text-xl font-bold text-dark-heading">Peer Tutoring</h3></button>
                                <button onClick={() => handleSelectActivityType('Mentorship')} className={`p-6 bg-white/5 border-2 rounded-xl text-left transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card ${activityType === 'Mentorship' ? 'border-secondary' : 'border-transparent hover:border-secondary/50'}`}><i className="fas fa-user-friends text-3xl text-secondary mb-3"></i><h3 className="text-xl font-bold text-dark-heading">Mentorship</h3></button>
                            </div>
                            <div className={`p-6 bg-white/5 border-2 rounded-xl text-left transition-all duration-300 ${isOtherSelected ? 'border-primary' : 'border-transparent'}`}>
                                {!isOtherSelected ? (
                                    <button onClick={handleOtherClick} className="w-full flex items-center gap-4 focus:outline-none"><i className="fas fa-plus-circle text-3xl text-gray-400"></i><h3 className="text-xl font-bold text-dark-heading">Other</h3></button>
                                ) : (
                                    <div>
                                        <input ref={otherInputRef} type="text" value={otherActivityText} onChange={e => setOtherActivityText(e.target.value)} placeholder="Describe your activity..." className="w-full bg-transparent border-b-2 border-white/20 focus:border-primary text-dark-heading text-lg py-2 focus:outline-none transition-colors"/>
                                        <div className="text-right mt-4"><button onClick={handleConfirmOther} className="px-4 py-1.5 rounded-md bg-primary text-dark-bg text-sm font-semibold">Confirm</button></div>
                                    </div>
                                )}
                            </div>
                            {errors.type && <p role="alert" aria-live="polite" className="text-red-400 text-sm text-center mt-2">{errors.type}</p>}
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="flex flex-col items-center">
                            <div className="flex gap-2 mb-4">
                                <button onClick={() => flatpickrInstance.current?.setDate(new Date(), true)} className="px-4 py-1.5 text-sm rounded-full bg-white/10 hover:bg-white/20">Today</button>
                                <button onClick={() => { const d = new Date(); d.setDate(d.getDate() - 1); flatpickrInstance.current?.setDate(d, true); }} className="px-4 py-1.5 text-sm rounded-full bg-white/10 hover:bg-white/20">Yesterday</button>
                            </div>
                            <div ref={calendarContainerRef} className="w-full max-w-sm mx-auto"></div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="w-full max-w-xs mx-auto flex items-center justify-center gap-4">
                            <button onClick={() => handleHoursChange(-0.5)} aria-label="Decrease hours by 0.5" className="w-12 h-12 rounded-full bg-white/10 text-2xl font-bold hover:bg-white/20">-</button>
                            <div className="relative w-40 text-center">
                                <input type="number" value={hours} onChange={e => setHours(e.target.value)} min="0.1" max="8" step="0.1" className="w-full bg-white/5 rounded-lg text-dark-heading text-4xl font-bold text-center py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
                                <span className="absolute right-4 bottom-2 text-sm text-dark-text">hours</span>
                            </div>
                            <button onClick={() => handleHoursChange(0.5)} aria-label="Increase hours by 0.5" className="w-12 h-12 rounded-full bg-white/10 text-2xl font-bold hover:bg-white/20">+</button>
                            {errors.hours && <p role="alert" aria-live="polite" className="absolute -bottom-8 text-red-400 text-sm text-center w-full">{errors.hours}</p>}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="w-full max-w-md mx-auto relative">
                            <div className="relative">
                                <input type="url" value={proofLink} onChange={handleProofLinkChange} placeholder="https://..." className={`w-full bg-white/5 border-2 rounded-lg text-dark-heading text-lg text-center py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${proofValidationState === 'invalid' ? 'border-yellow-500' : proofValidationState === 'valid' ? 'border-green-500' : 'border-white/20'}`} />
                                <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center">
                                    {proofValidationState === 'invalid' && <i className="fas fa-exclamation-triangle text-yellow-500"></i>}
                                    {proofValidationState === 'valid' && <i className="fas fa-check-circle text-green-500"></i>}
                                    <button onClick={() => setShowProofTooltip(!showProofTooltip)} onBlur={() => setShowProofTooltip(false)} className="ml-2 text-dark-text hover:text-white"><i className="fas fa-info-circle"></i></button>
                                </div>
                            </div>
                            {showProofTooltip && <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-dark-bg border border-white/20 rounded-lg text-xs text-center shadow-lg z-10">A link to a screenshot (e.g., Dropbox, Google Drive) of your session or a confirmation from your mentee.</div>}
                            {errors.proof && <p role="alert" aria-live="polite" className="text-red-400 text-sm text-center mt-2">{errors.proof}</p>}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="bg-black/20 border border-white/20 rounded-xl p-6 max-w-md mx-auto w-full text-left space-y-3">
                            <div><span className="font-semibold text-dark-text">Type:</span><p className="text-dark-heading font-bold text-lg">{activityType}</p></div>
                            <div><span className="font-semibold text-dark-text">Date:</span><p className="text-dark-heading font-bold text-lg">{new Date(activityDate + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                            <div><span className="font-semibold text-dark-text">Hours:</span><p className="text-dark-heading font-bold text-lg">{parseFloat(hours).toFixed(1)}</p></div>
                            {apiError && <p role="alert" aria-live="polite" className="text-red-400 text-sm text-center pt-2">{apiError}</p>}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-dark-card/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl h-[40rem] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="w-full bg-white/10 rounded-t-2xl h-2"><div className="bg-primary h-2 rounded-t-2xl transition-all duration-500" style={{ width: `${((isSuccess ? totalSteps + 1 : currentStep + 1) / (totalSteps + 1)) * 100}%` }}></div></div>
                <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"><i className="fas fa-times text-2xl"></i></button>
                <div className="flex-grow p-8 md:p-12 overflow-hidden">{renderStepContent()}</div>
                {!isSuccess && (
                    <div className="flex-shrink-0 p-6 bg-black/20 border-t border-white/10 rounded-b-2xl flex items-center justify-between">
                        <button onClick={handleBack} disabled={currentStep === 0 || submitting} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                        {currentStep < totalSteps - 1 ? (
                            <button onClick={handleNext} className={`px-8 py-2 rounded-lg bg-primary text-dark-bg font-semibold hover:bg-primary-dark transition-all duration-300 ${isStepValid(currentStep) ? 'shadow-lg shadow-primary/30' : 'opacity-50 cursor-not-allowed'}`}>Next</button>
                        ) : (
                            <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark transition-colors disabled:bg-gray-500 disabled:cursor-wait flex items-center gap-2">
                                {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : 'Submit Activity'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogActivityModal;

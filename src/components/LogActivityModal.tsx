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
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const dateInputRef = useRef<HTMLInputElement>(null);
    const hoursInputRef = useRef<HTMLInputElement>(null);
    const proofInputRef = useRef<HTMLInputElement>(null);

    const steps = [
        { id: 'type', title: 'First, what type of activity did you complete?' },
        { id: 'date', title: 'Great! When did this activity take place?' },
        { id: 'hours', title: 'Got it. How many hours did you volunteer?' },
        { id: 'proof', title: 'Almost done. Please provide a link to your proof.' },
        { id: 'review', title: 'Ready to submit?' }
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
            setErrors({});
            setApiError(null);
            setSubmitting(false);
            setIsSuccess(false);
        }
    }, [isOpen]);

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
            // Auto-open the calendar
            setTimeout(() => instance.open(), 100);
        }
        return () => {
            if (instance) instance.destroy();
        };
    }, [isOpen, currentStep, activityDate]);

    // Auto-focus inputs on step change
    useEffect(() => {
        if (currentStep === 2) hoursInputRef.current?.focus();
        if (currentStep === 3) proofInputRef.current?.focus();
    }, [currentStep]);

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
                if (!hours || isNaN(numHours)) {
                    newErrors.hours = 'Please enter a valid number.';
                    isValid = false;
                } else if (numHours <= 0) {
                    newErrors.hours = 'Hours must be a positive number.';
                    isValid = false;
                } else if (numHours > 8) {
                    newErrors.hours = 'You cannot log more than 8 hours for a single activity.';
                    isValid = false;
                }
                break;
            case 3:
                if (!proofLink) {
                    newErrors.proof = 'A proof link is required.';
                    isValid = false;
                } else {
                    try {
                        new URL(proofLink);
                    } catch (_) {
                        newErrors.proof = 'Please enter a valid URL.';
                        isValid = false;
                    }
                }
                break;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps - 1) {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const handleBack = () => {
        setErrors({});
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSelectActivityType = (type: 'Peer Tutoring' | 'Mentorship') => {
        setActivityType(type);
        setErrors({});
        setTimeout(() => setCurrentStep(1), 300); // Add a small delay for UX
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
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                        <i className="fas fa-check-circle text-5xl text-primary"></i>
                    </div>
                    <h2 className="text-3xl font-bold text-dark-heading mb-2">Activity Logged!</h2>
                    <p className="text-dark-text mb-8">Your contribution has been recorded. Thank you!</p>
                    <button onClick={onClose} className="cta-button bg-primary text-dark-bg font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors">
                        Close
                    </button>
                </div>
            );
        }

        return (
            <div className="relative h-full" onKeyDown={handleKeyPress}>
                {steps.map((step, index) => (
                    <div key={step.id} className={`absolute inset-0 transition-all duration-500 ease-in-out flex flex-col justify-center ${currentStep === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}>
                        <h2 className="text-2xl md:text-3xl font-bold text-dark-heading text-center mb-8">{step.title}</h2>
                        
                        {/* Step 0: Activity Type */}
                        {index === 0 && (
                            <div className="flex flex-col md:flex-row gap-4">
                                <button onClick={() => handleSelectActivityType('Peer Tutoring')} className="p-8 flex-1 bg-white/5 border-2 border-white/10 hover:border-primary rounded-xl text-left transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <i className="fas fa-book-reader text-3xl text-primary mb-3"></i>
                                    <h3 className="text-xl font-bold text-dark-heading">Peer Tutoring</h3>
                                    <p className="text-sm text-dark-text">Helping a fellow student with course material.</p>
                                </button>
                                <button onClick={() => handleSelectActivityType('Mentorship')} className="p-8 flex-1 bg-white/5 border-2 border-white/10 hover:border-secondary rounded-xl text-left transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary">
                                    <i className="fas fa-user-friends text-3xl text-secondary mb-3"></i>
                                    <h3 className="text-xl font-bold text-dark-heading">Mentorship</h3>
                                    <p className="text-sm text-dark-text">Guiding or advising another student.</p>
                                </button>
                                {errors.type && <p className="md:col-span-2 text-red-400 text-sm text-center mt-2">{errors.type}</p>}
                            </div>
                        )}

                        {/* Step 1: Date */}
                        {index === 1 && (
                            <input ref={dateInputRef} type="text" placeholder="Select date" className="w-full max-w-sm mx-auto bg-transparent border-b-2 border-white/20 focus:border-primary text-dark-heading text-2xl text-center py-3 focus:outline-none transition-colors custom-calendar-icon" />
                        )}

                        {/* Step 2: Hours */}
                        {index === 2 && (
                            <div className="w-full max-w-sm mx-auto">
                                <input ref={hoursInputRef} type="number" value={hours} onChange={e => setHours(e.target.value)} min="0.1" max="8" step="0.1" placeholder="e.g., 1.5" className="w-full bg-transparent border-b-2 border-white/20 focus:border-primary text-dark-heading text-2xl text-center py-3 focus:outline-none transition-colors" />
                                {errors.hours && <p className="text-red-400 text-sm text-center mt-4">{errors.hours}</p>}
                            </div>
                        )}

                        {/* Step 3: Proof Link */}
                        {index === 3 && (
                            <div className="w-full max-w-md mx-auto">
                                <input ref={proofInputRef} type="url" value={proofLink} onChange={e => setProofLink(e.target.value)} placeholder="https://www.dropbox.com/..." className="w-full bg-transparent border-b-2 border-white/20 focus:border-primary text-dark-heading text-xl text-center py-3 focus:outline-none transition-colors" />
                                {errors.proof && <p className="text-red-400 text-sm text-center mt-4">{errors.proof}</p>}
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {index === 4 && (
                            <div className="bg-black/20 border border-white/20 rounded-xl p-6 max-w-md mx-auto w-full text-left space-y-3">
                                <div><span className="font-semibold text-dark-text">Type:</span><p className="text-dark-heading font-bold text-lg">{activityType}</p></div>
                                <div><span className="font-semibold text-dark-text">Date:</span><p className="text-dark-heading font-bold text-lg">{new Date(activityDate + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                                <div><span className="font-semibold text-dark-text">Hours:</span><p className="text-dark-heading font-bold text-lg">{parseFloat(hours).toFixed(1)}</p></div>
                                {apiError && <p className="text-red-400 text-sm text-center pt-2">{apiError}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-dark-card/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl min-h-[32rem] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-t-2xl h-2">
                    <div className="bg-primary h-2 rounded-t-2xl transition-all duration-500" style={{ width: `${((currentStep + (isSuccess ? 1 : 0)) / totalSteps) * 100}%` }}></div>
                </div>
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"><i className="fas fa-times text-2xl"></i></button>

                <div className="flex-grow p-8 md:p-12 overflow-hidden">
                    {renderStepContent()}
                </div>

                {/* Navigation */}
                {!isSuccess && (
                    <div className="flex-shrink-0 p-6 bg-black/20 border-t border-white/10 rounded-b-2xl flex items-center justify-between">
                        <button onClick={handleBack} disabled={currentStep === 0 || submitting} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                        
                        {currentStep < totalSteps - 1 ? (
                            <button onClick={handleNext} className="px-8 py-2 rounded-lg bg-primary text-dark-bg font-semibold hover:bg-primary-dark transition-colors">Next</button>
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

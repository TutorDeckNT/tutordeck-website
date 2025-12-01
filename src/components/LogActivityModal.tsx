// src/components/LogActivityModal.tsx

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProofLinkHistory } from '../hooks/useProofLinkHistory';
import TutorDeckStudioModal from './TutorDeckStudioModal';
import DirectUploader from './DirectUploader';
import Portal from './Portal';

declare const flatpickr: any;

interface VolunteerActivity {
    id: string;
    activityType: string;
    activityDate: { _seconds: number; _nanoseconds: number; };
    hours: number;
    proofLink: string;
    justification?: string;
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
    const [detectedDuration, setDetectedDuration] = useState<number | null>(null); // In seconds
    const [justification, setJustification] = useState('');
    
    // Validation State
    const [isStepValid, setIsStepValid] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [linkError, setLinkError] = useState<string | null>(null);
    const [isStudioOpen, setIsStudioOpen] = useState(false);

    const { isDuplicate, addLinkToHistory } = useProofLinkHistory();

    const dateInputRef = useRef<HTMLInputElement>(null);
    const hoursInputRef = useRef<HTMLInputElement>(null);
    const proofInputRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<any>(null);

    // --- REORDERED STEPS ---
    const steps = [
        { id: 'type', title: 'Activity Type', icon: 'fa-tags' },
        { id: 'date', title: 'Date', icon: 'fa-calendar-alt' },
        { id: 'proof', title: 'Proof', icon: 'fa-link' }, // Moved Up
        { id: 'hours', title: 'Hours', icon: 'fa-clock' }, // Moved Down
        { id: 'review', title: 'Review', icon: 'fa-check-double' }
    ];
    const totalSteps = steps.length;

    // --- HELPERS ---
    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    const countValidSentences = (text: string) => {
        // Split by sentence terminators (. ? !)
        // Filter segments that have at least 3 words to be considered a real sentence
        const segments = text.split(/[.?!]+/).filter(seg => seg.trim().split(/\s+/).length >= 3);
        return segments.length;
    };

    const validateProofLink = (link: string) => {
        if (!link) {
            setLinkError(null);
            return false;
        }
        if (!link.startsWith('https://www.dropbox.com/')) {
            setLinkError("Validation Error: Only Dropbox share links are accepted.");
            return false;
        }
        if (isDuplicate(link)) {
            setLinkError("Validation Error: This link has already been submitted as proof.");
            return false;
        }
        setLinkError(null);
        return true;
    };

    // --- EFFECTS ---
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setActivityType('');
            setActivityDate(new Date().toISOString().split('T')[0]);
            setHours('');
            setProofLink('');
            setDetectedDuration(null);
            setJustification('');
            setApiError(null);
            setSubmitting(false);
            setIsSuccess(false);
            setLinkError(null);
        }
    }, [isOpen]);

    useEffect(() => {
        const validate = () => {
            switch (currentStep) {
                case 0: return !!activityType;
                case 1: return !!activityDate;
                case 2: // Proof Step
                    return validateProofLink(proofLink);
                case 3: // Hours Step
                    const numHours = parseFloat(hours);
                    if (isNaN(numHours) || numHours <= 0 || numHours > 8) return false;
                    
                    // Check for discrepancy
                    if (detectedDuration !== null) {
                        const claimedSeconds = numHours * 3600;
                        if (claimedSeconds > detectedDuration) {
                            // Require 2 sentences
                            return countValidSentences(justification) >= 2;
                        }
                    }
                    return true;
                default: return true;
            }
        };
        setIsStepValid(validate());
    }, [currentStep, activityType, activityDate, hours, proofLink, detectedDuration, justification, isDuplicate]);

    useEffect(() => {
        if (isOpen && currentStep === 1 && dateInputRef.current) {
            flatpickrInstance.current = flatpickr(dateInputRef.current, {
                dateFormat: "Y-m-d", defaultDate: activityDate, maxDate: new Date(), clickOpens: false,
                onChange: (selectedDates: Date[]) => { if (selectedDates[0]) setActivityDate(selectedDates[0].toISOString().split('T')[0]); },
            });
        }
        return () => { if (flatpickrInstance.current) { flatpickrInstance.current.destroy(); flatpickrInstance.current = null; } };
    }, [isOpen, currentStep, activityDate]);

    useEffect(() => {
        if (currentStep === 3) hoursInputRef.current?.focus();
        if (currentStep === 2) proofInputRef.current?.focus();
    }, [currentStep]);

    // --- HANDLERS ---
    const handleNext = () => { if (isStepValid && currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1); };
    const handleBack = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };
    const handleSelectActivityType = (type: 'Peer Tutoring' | 'Mentorship') => { setActivityType(type); setTimeout(() => setCurrentStep(1), 200); };

    const handleProofSuccess = (link: string, duration: number) => {
        setProofLink(link);
        setDetectedDuration(duration);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isStepValid) return;
        setApiError(null);
        if (!user) { setApiError("You must be logged in."); return; }
        
        setSubmitting(true);
        try {
            const token = await user.getIdToken();
            
            // Append measured time to justification if it exists
            let finalJustification = justification;
            if (detectedDuration !== null && justification) {
                finalJustification = `${justification} (Measured: ${formatDuration(detectedDuration)})`;
            }

            const activityData = { 
                activityType, 
                activityDate, 
                hours: parseFloat(hours), 
                proofLink,
                justification: finalJustification 
            };
            
            const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, ...activityData })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "An unknown error occurred.");
            
            addLinkToHistory(proofLink);
            onActivityAdded(data);
            setIsSuccess(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to submit activity.";
            setApiError(errorMessage.includes('Failed to fetch') ? 'Network Error: Could not connect to the server.' : errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && currentStep !== 3 && currentStep < totalSteps - 1) { e.preventDefault(); handleNext(); } };

    const handleCloseAll = () => {
        setIsStudioOpen(false);
        onClose();
    };

    if (!isOpen) return null;

    // --- RENDER HELPERS ---
    const renderStepContent = () => {
        if (isSuccess) {
            return (
                <div className="text-center flex flex-col items-center justify-center h-full p-8">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6"><i className="fas fa-check-circle text-5xl text-primary"></i></div>
                    <h2 className="text-3xl font-bold text-dark-heading mb-2">Activity Logged!</h2>
                    <p className="text-dark-text mb-8">Your contribution has been recorded. Thank you!</p>
                    <button onClick={handleCloseAll} className="cta-button bg-primary text-dark-bg font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors">Close</button>
                </div>
            );
        }

        const stepDetails = [
            { title: 'Select Activity Type', description: 'Choose the category that best fits your volunteer work.' },
            { title: 'Select the Date', description: 'When did this activity take place? Use the calendar to select a date.' },
            { title: 'Provide Proof of Activity', description: 'Upload an audio file or record one as evidence for this session.' },
            { title: 'Log Your Hours', description: 'Enter the number of hours you volunteered for this session.' },
            { title: 'Review & Submit', description: 'Please confirm the details below are correct before submitting.' }
        ];

        // Logic for Step 3 (Hours) Discrepancy
        const claimedSeconds = parseFloat(hours || '0') * 3600;
        const hasDiscrepancy = detectedDuration !== null && claimedSeconds > detectedDuration;
        const sentenceCount = countValidSentences(justification);
        const isJustificationValid = sentenceCount >= 2;

        return (
            <div className="flex flex-col h-full">
                <div className="p-8 md:p-10 flex-grow overflow-y-auto" onKeyDown={handleKeyPress}>
                    <h2 className="text-3xl font-bold text-dark-heading mb-2">{stepDetails[currentStep].title}</h2>
                    <p className="text-dark-text mb-8">{stepDetails[currentStep].description}</p>
                    
                    <div className="relative min-h-[220px]">
                        
                        {/* Step 0: Type */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}><div className="flex flex-col sm:flex-row gap-4"><button onClick={() => handleSelectActivityType('Peer Tutoring')} className="p-6 flex-1 bg-white/5 border-2 border-white/10 hover:border-primary rounded-xl text-left transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"><i className="fas fa-book-reader text-2xl text-primary mb-2"></i><h3 className="text-lg font-bold text-dark-heading">Peer Tutoring</h3></button><button onClick={() => handleSelectActivityType('Mentorship')} className="p-6 flex-1 bg-white/5 border-2 border-white/10 hover:border-secondary rounded-xl text-left transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary"><i className="fas fa-user-friends text-2xl text-secondary mb-2"></i><h3 className="text-lg font-bold text-dark-heading">Mentorship</h3></button></div></div>
                        
                        {/* Step 1: Date */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}><div className="relative"><input ref={dateInputRef} id="activityDate" type="text" placeholder="YYYY-MM-DD" className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 pr-10 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" /><button type="button" onClick={() => flatpickrInstance.current?.open()} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-primary transition-colors" aria-label="Open calendar"><i className="fas fa-calendar-alt"></i></button></div></div>
                        
                        {/* Step 2: Proof (Moved Up) */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <label htmlFor="proofLink" className="block text-sm font-medium text-dark-text mb-2">Dropbox Share Link</label>
                            <input ref={proofInputRef} id="proofLink" type="url" value={proofLink} onChange={e => setProofLink(e.target.value)} placeholder="Link will be auto-filled after upload..." className={`w-full bg-black/30 border rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 ${linkError ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary'}`} />
                            {linkError && <p className="text-red-400 text-xs mt-2">{linkError}</p>}
                            
                            {detectedDuration !== null && (
                                <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-3">
                                    <i className="fas fa-stopwatch text-primary text-xl"></i>
                                    <div>
                                        <p className="text-sm font-bold text-primary">Evidence Analyzed</p>
                                        <p className="text-xs text-dark-text">Measured Duration: <span className="text-white font-mono">{formatDuration(detectedDuration)}</span></p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DirectUploader onUploadSuccess={handleProofSuccess} />
                                    <button type="button" onClick={() => setIsStudioOpen(true)} className="w-full p-3 bg-white/5 border border-white/10 hover:border-primary rounded-xl text-center transition-colors"><i className="fas fa-microphone mr-2 text-primary"></i>Record Audio</button>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Hours (Moved Down & Enhanced) */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <label htmlFor="hours" className="block text-sm font-medium text-dark-text mb-2">Hours Volunteered</label>
                            <input ref={hoursInputRef} id="hours" type="number" value={hours} onChange={e => setHours(e.target.value)} min="0.1" max="8" step="0.1" placeholder="e.g., 1.5" className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                            
                            {/* Justification Panel */}
                            <div className={`mt-6 transition-all duration-500 ease-in-out overflow-hidden ${hasDiscrepancy ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <i className="fas fa-exclamation-triangle text-yellow-500 mt-1"></i>
                                        <div>
                                            <h4 className="font-bold text-yellow-500 text-sm">Time Discrepancy Detected</h4>
                                            <p className="text-xs text-gray-300 mt-1">
                                                You are claiming <strong>{parseFloat(hours || '0').toFixed(1)} hrs</strong>, but your evidence is only <strong>{formatDuration(detectedDuration || 0)}</strong>.
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2 italic">
                                                "We do not expect you to record the entire session, but we would like the majority for verification purposes."
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wide">
                                        Justification Required (Min. 2 Sentences)
                                    </label>
                                    <textarea
                                        value={justification}
                                        onChange={(e) => setJustification(e.target.value)}
                                        placeholder="Please explain the discrepancy to go up to 1.5x of your measured time..."
                                        className={`w-full bg-black/40 border rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 transition-colors h-24 resize-none ${isJustificationValid ? 'border-green-500/50 focus:ring-green-500' : 'border-red-500/50 focus:ring-red-500'}`}
                                    ></textarea>
                                    <div className="flex justify-end mt-2">
                                        <span className={`text-xs font-bold ${isJustificationValid ? 'text-green-400' : 'text-red-400'}`}>
                                            {sentenceCount} / 2 Sentences
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Review */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentStep === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <div className="bg-black/20 border border-white/20 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="font-semibold text-dark-text">Type:</span><span className="text-dark-heading font-bold">{activityType}</span></div>
                                <div className="flex justify-between"><span className="font-semibold text-dark-text">Date:</span><span className="text-dark-heading font-bold">{new Date(activityDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
                                <div className="flex justify-between"><span className="font-semibold text-dark-text">Hours:</span><span className="text-dark-heading font-bold">{parseFloat(hours || '0').toFixed(1)}</span></div>
                                {detectedDuration !== null && (
                                    <div className="flex justify-between"><span className="font-semibold text-dark-text">Evidence:</span><span className="text-gray-400 font-mono">{formatDuration(detectedDuration)}</span></div>
                                )}
                                {justification && (
                                    <div className="pt-2 mt-2 border-t border-white/10">
                                        <span className="font-semibold text-dark-text block mb-1">Justification:</span>
                                        <p className="text-xs text-gray-400 italic">"{justification}"</p>
                                    </div>
                                )}
                            </div>
                            {apiError && <p className="text-red-400 text-xs text-center pt-2">{apiError}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 p-6 bg-black/20 border-t border-white/10 rounded-b-lg flex items-center justify-between">
                    <button onClick={handleBack} disabled={currentStep === 0 || submitting} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                    {currentStep < totalSteps - 1 ? (<button onClick={handleNext} disabled={!isStepValid} className="px-8 py-2 rounded-lg bg-primary text-dark-bg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-500/40 disabled:text-gray-400 disabled:cursor-not-allowed">Next</button>) : (<button onClick={handleSubmit} disabled={submitting || !isStepValid} className="px-8 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark transition-colors disabled:bg-gray-500/40 disabled:text-gray-400 disabled:cursor-wait flex items-center gap-2">{submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : 'Submit Activity'}</button>)}
                </div>
            </div>
        );
    };

    return (
        <>
            <TutorDeckStudioModal isOpen={isStudioOpen} onClose={() => setIsStudioOpen(false)} onSuccess={handleProofSuccess} />
            <Portal>
                <div 
                    className={`fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isStudioOpen ? 'opacity-60 pointer-events-none' : ''}`} 
                    onClick={handleCloseAll}
                >
                    <div className="bg-dark-card/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden" onClick={e => e.stopPropagation()}>
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
                        <div className="w-full md:w-2/3">
                            {renderStepContent()}
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
};

export default LogActivityModal;

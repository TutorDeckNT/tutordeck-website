// src/components/LogActivityModal.tsx

import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Animation Variants
const slideVariants = {
    enter: (direction: number) => ({
        y: direction > 0 ? 50 : -50,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        zIndex: 1,
        y: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        y: direction < 0 ? 50 : -50,
        opacity: 0,
        scale: 0.95
    })
};

const LogActivityModal = ({ isOpen, onClose, onActivityAdded }: LogActivityModalProps) => {
    const { user } = useAuth();
    
    // --- State ---
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    
    // Form Data
    const [activityType, setActivityType] = useState<'Peer Tutoring' | 'Mentorship' | ''>('');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');
    const [proofLink, setProofLink] = useState('');
    const [detectedDuration, setDetectedDuration] = useState<number | null>(null); // In seconds
    const [justification, setJustification] = useState('');
    
    // UI State
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isStudioOpen, setIsStudioOpen] = useState(false);

    const { isDuplicate, addLinkToHistory } = useProofLinkHistory();

    // Refs
    const dateInputRef = useRef<HTMLInputElement>(null);
    const hoursInputRef = useRef<HTMLInputElement>(null);
    const justificationRef = useRef<HTMLTextAreaElement>(null);
    const flatpickrInstance = useRef<any>(null);

    // --- Steps Configuration ---
    // We determine total steps dynamically based on if justification is needed
    const needsJustification = (() => {
        const numHours = parseFloat(hours);
        if (isNaN(numHours) || detectedDuration === null) return false;
        const claimedSeconds = numHours * 3600;
        return claimedSeconds > detectedDuration;
    })();

    // 0: Type, 1: Date, 2: Proof, 3: Hours, 4: Justification (Optional), 5: Review
    const totalSteps = needsJustification ? 6 : 5;

    // --- Helpers ---
    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    const countValidSentences = (text: string) => {
        return text.split(/[.?!]+/).filter(seg => seg.trim().split(/\s+/).length >= 3).length;
    };

    // --- Validation Logic ---
    const validateStep = (step: number): boolean => {
        setErrorMsg(null);
        switch (step) {
            case 0: // Type
                if (!activityType) { setErrorMsg("Please select an activity type."); return false; }
                return true;
            case 1: // Date
                if (!activityDate) { setErrorMsg("Please select a date."); return false; }
                return true;
            case 2: // Proof
                if (!proofLink) { 
                    setErrorMsg("Proof is required. Please upload or record audio.");
                    return false;
                }
                if (!proofLink.startsWith('https://www.dropbox.com/')) {
                    setErrorMsg("Only Dropbox links are accepted.");
                    return false;
                }
                if (isDuplicate(proofLink)) {
                    setErrorMsg("This link has already been used.");
                    return false;
                }
                return true;
            case 3: // Hours
                const h = parseFloat(hours);
                if (!hours || isNaN(h) || h <= 0) { setErrorMsg("Please enter a valid number of hours."); return false; }
                if (h > 8) { setErrorMsg("Please log less than 8 hours at a time."); return false; }
                return true;
            case 4: // Justification (Only if we are on this step)
                 if (needsJustification && currentStep === 4) {
                    if (countValidSentences(justification) < 2) {
                        setErrorMsg("Please provide at least 2 full sentences explaining the discrepancy.");
                        return false;
                    }
                 }
                 return true;
            default: return true;
        }
    };

    // --- Navigation ---
    
    // Direct selection handler to fix the "Works only on second click" bug.
    // This bypasses the async state check by assuming the button click itself is valid.
    const handleTypeSelection = (type: 'Peer Tutoring' | 'Mentorship') => {
        setActivityType(type);
        setDirection(1);
        setCurrentStep(prev => prev + 1);
        setErrorMsg(null);
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            triggerShake();
            return;
        }

        let nextIndex = currentStep + 1;

        // Skip Justification step if not needed
        if (currentStep === 3 && !needsJustification) {
            nextIndex = 5; // Skip to Review
        } 
        
        if (nextIndex < 6) { 
            setDirection(1);
            setCurrentStep(nextIndex);
        }
    };

    const handleBack = () => {
        let prevIndex = currentStep - 1;
        
        // Skip Justification going back
        if (currentStep === 5 && !needsJustification) {
            prevIndex = 3;
        }

        if (prevIndex >= 0) {
            setDirection(-1);
            setCurrentStep(prevIndex);
        }
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    // --- Reset & Effects ---
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setDirection(0);
            setActivityType('');
            setActivityDate(new Date().toISOString().split('T')[0]);
            setHours('');
            setProofLink('');
            setDetectedDuration(null);
            setJustification('');
            setIsSuccess(false);
            setSubmitting(false);
            setErrorMsg(null);
        }
    }, [isOpen]);

    // Keyboard Listeners
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                // Prevent Enter on textarea to allow multiline
                if (document.activeElement?.tagName === 'TEXTAREA') return;
                
                // Allow Submit on Enter if on Review step
                if ((currentStep === 5) || (currentStep === 4 && !needsJustification && currentStep === totalSteps - 1)) {
                    handleSubmit(e as any);
                } else if (!isSuccess) {
                    handleNext();
                }
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentStep, needsJustification, activityType, activityDate, hours, proofLink, justification, isSuccess]);

    // Auto-focus Logic
    useEffect(() => {
        setTimeout(() => {
            if (currentStep === 1) dateInputRef.current?.focus();
            if (currentStep === 3) hoursInputRef.current?.focus();
            if (currentStep === 4 && needsJustification) justificationRef.current?.focus();
        }, 500); // Wait for animation
    }, [currentStep, needsJustification]);

    // Flatpickr
    useEffect(() => {
        if (isOpen && currentStep === 1 && dateInputRef.current) {
            flatpickrInstance.current = flatpickr(dateInputRef.current, {
                dateFormat: "Y-m-d", defaultDate: activityDate, maxDate: new Date(),
                onChange: (selectedDates: Date[]) => { if (selectedDates[0]) setActivityDate(selectedDates[0].toISOString().split('T')[0]); },
            });
        }
        return () => { if (flatpickrInstance.current) flatpickrInstance.current.destroy(); };
    }, [isOpen, currentStep]);


    // --- Submission ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setSubmitting(true);
        try {
            const token = await user.getIdToken();
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
            if (!response.ok) throw new Error(data.message || "Error submitting.");
            
            addLinkToHistory(proofLink);
            onActivityAdded(data);
            setIsSuccess(true);
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
            triggerShake();
        } finally {
            setSubmitting(false);
        }
    };

    const handleProofSuccess = (link: string, duration: number) => {
        setProofLink(link);
        setDetectedDuration(duration);
        setErrorMsg(null);
        // Manually advance to avoid stale state closure in handleNext
        setTimeout(() => {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        }, 1000);
    };

    // --- Renderers for Steps ---

    const renderTypeStep = () => (
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
            {['Peer Tutoring', 'Mentorship'].map((type, idx) => (
                <button
                    key={type}
                    onClick={() => handleTypeSelection(type as any)}
                    className={`flex-1 group relative p-8 md:p-12 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${activityType === type ? 'bg-primary text-dark-bg border-primary' : 'bg-white/5 border-white/10 hover:border-primary/50'}`}
                >
                    <div className="text-sm font-bold opacity-60 mb-4 uppercase tracking-wider">Option {idx + 1}</div>
                    <i className={`fas ${type === 'Peer Tutoring' ? 'fa-book-reader' : 'fa-user-friends'} text-5xl mb-6 ${activityType === type ? 'text-dark-bg' : 'text-primary'}`}></i>
                    <h3 className="text-3xl md:text-4xl font-bold">{type}</h3>
                    <div className={`mt-4 text-sm ${activityType === type ? 'text-dark-bg/80' : 'text-gray-400'}`}>
                        {type === 'Peer Tutoring' ? 'Helping students with academic coursework.' : 'Guiding peers in personal or leadership growth.'}
                    </div>
                    <div className="absolute top-4 right-4 font-mono text-xs opacity-50 border border-current px-2 py-1 rounded">Key: {idx + 1}</div>
                </button>
            ))}
        </div>
    );

    const renderDateStep = () => (
        <div className="w-full max-w-2xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">When did you volunteer?</h2>
            <div className="relative inline-block w-full">
                <input
                    ref={dateInputRef}
                    type="text"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="w-full bg-transparent text-center text-5xl md:text-7xl font-bold text-primary placeholder-gray-700 focus:outline-none border-b-2 border-white/20 focus:border-primary pb-4 transition-colors font-mono"
                    placeholder="YYYY-MM-DD"
                />
                <i className="fas fa-calendar-alt absolute right-4 bottom-8 text-2xl text-gray-500 pointer-events-none"></i>
            </div>
            <div className="flex justify-center gap-3 mt-8">
                <button onClick={() => setActivityDate(new Date().toISOString().split('T')[0])} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors">Today</button>
                <button onClick={() => {const d = new Date(); d.setDate(d.getDate() - 1); setActivityDate(d.toISOString().split('T')[0])}} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors">Yesterday</button>
            </div>
        </div>
    );

    const renderProofStep = () => (
        <div className="w-full max-w-2xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Evidence Required</h2>
            <p className="text-xl text-gray-400 mb-10">Upload audio proof to verify your session.</p>
            
            <div className={`relative border-2 border-dashed rounded-3xl p-10 transition-colors ${proofLink ? 'border-green-500 bg-green-500/10' : 'border-white/20 bg-white/5 hover:border-primary/50'}`}>
                {proofLink ? (
                    <div className="flex flex-col items-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                            <i className="fas fa-check text-3xl text-dark-bg"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Evidence Secured</h3>
                        <p className="text-green-400 font-mono text-sm break-all max-w-md">{proofLink}</p>
                        {detectedDuration !== null && (
                            <div className="mt-4 px-4 py-2 bg-black/40 rounded-lg border border-white/10">
                                <span className="text-gray-400 text-sm">Analyzed Duration: </span>
                                <span className="text-primary font-bold font-mono">{formatDuration(detectedDuration)}</span>
                            </div>
                        )}
                        <button onClick={() => { setProofLink(''); setDetectedDuration(null); }} className="mt-6 text-sm text-gray-400 hover:text-white underline">Remove & Upload Different File</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
                                <i className="fas fa-cloud-upload-alt text-4xl"></i>
                            </div>
                        </div>
                        <div>
                            <DirectUploader onUploadSuccess={handleProofSuccess} />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-dark-bg text-gray-500">OR</span></div>
                        </div>
                        <button onClick={() => setIsStudioOpen(true)} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
                            <i className="fas fa-microphone text-red-500"></i> Record Audio Directly
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderHoursStep = () => (
        <div className="w-full max-w-3xl text-center">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 leading-tight">
                I volunteered for <br/>
                <span className="relative inline-block mt-4">
                    <input
                        ref={hoursInputRef}
                        type="number"
                        min="0"
                        max="8"
                        step="0.1"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        className="w-48 bg-transparent text-center text-7xl md:text-8xl font-bold text-primary placeholder-gray-700 focus:outline-none border-b-4 border-white/20 focus:border-primary pb-2 transition-colors font-mono"
                        placeholder="0.0"
                    />
                    <span className="text-2xl md:text-4xl text-gray-500 ml-4 font-normal">hours</span>
                </span>
             </h2>
             <p className="text-gray-400 text-lg">Enter the total duration of your session.</p>
        </div>
    );

    const renderJustificationStep = () => {
        const sentences = countValidSentences(justification);
        const isValid = sentences >= 2;
        
        return (
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-4 mb-8 text-yellow-500 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                    <i className="fas fa-exclamation-triangle text-2xl"></i>
                    <div>
                        <h3 className="font-bold text-lg">Time Discrepancy Detected</h3>
                        <p className="text-sm opacity-90">You logged <strong>{hours} hours</strong>, but the evidence is only <strong>{formatDuration(detectedDuration || 0)}</strong>.</p>
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-6">Care to explain?</h2>
                <p className="text-gray-400 mb-4">Please provide context (e.g., "Forgot to record start," "Prep time"). Min 2 sentences.</p>
                
                <textarea
                    ref={justificationRef}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="w-full h-48 bg-white/5 border border-white/20 rounded-xl p-6 text-xl text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    placeholder="Type your explanation here..."
                ></textarea>
                
                <div className="flex justify-end mt-2">
                    <span className={`text-sm font-bold transition-colors ${isValid ? 'text-green-400' : 'text-gray-500'}`}>
                        {sentences} / 2 Sentences
                    </span>
                </div>
            </div>
        );
    };

    const renderReviewStep = () => (
        <div className="w-full max-w-md">
            <div className="bg-white text-black p-8 rounded-xl shadow-2xl relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Receipt visual elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-widest">Receipt</h2>
                    <p className="text-xs text-gray-500 font-mono mt-1">{new Date().toLocaleTimeString()}</p>
                </div>

                <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Activity</span>
                        <span className="font-bold">{activityType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-bold">{activityDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Evidence</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded truncate max-w-[150px]">{proofLink ? 'Uploaded' : 'Missing'}</span>
                    </div>
                    {needsJustification && (
                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                            <span className="text-gray-500">Note</span>
                            <span className="text-xs text-right max-w-[60%] italic">"{justification.substring(0, 30)}..."</span>
                        </div>
                    )}
                </div>

                <div className="border-t-2 border-black pt-4 mt-6 flex justify-between items-end">
                    <span className="font-bold text-xl">Total</span>
                    <span className="font-black text-4xl">{hours} <span className="text-sm font-normal text-gray-600">hrs</span></span>
                </div>
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="w-full mt-8 bg-primary hover:bg-primary-dark text-dark-bg font-black text-xl py-4 rounded-xl shadow-lg shadow-primary/20 transform hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
                {submitting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                <span>Submit Activity</span>
            </button>
        </div>
    );

    const renderSuccessStep = () => (
        <div className="text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl text-white mb-6 mx-auto animate-bounce">
                <i className="fas fa-check"></i>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Logged Successfully!</h2>
            <p className="text-gray-400 mb-8">Your hours have been recorded and are pending verification.</p>
            <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-bold transition-colors">
                Close
            </button>
        </div>
    );

    if (!isOpen) return null;

    return (
        <>
            <TutorDeckStudioModal isOpen={isStudioOpen} onClose={() => setIsStudioOpen(false)} onSuccess={handleProofSuccess} />
            
            <Portal>
                <div className="fixed inset-0 z-50 flex flex-col bg-dark-bg/95 backdrop-blur-xl">
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/5">
                        <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(((currentStep + 1) / totalSteps) * 100, 100)}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Controls Header */}
                    <div className="absolute top-6 right-6 z-50">
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Step Counter */}
                    <div className="absolute top-6 left-6 z-40 font-mono text-xs text-gray-500 uppercase tracking-widest">
                        {isSuccess ? 'Complete' : `Step ${currentStep + 1} of ${totalSteps}`}
                    </div>

                    {/* Main Stage */}
                    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-0">
                        <AnimatePresence initial={false} mode="wait" custom={direction}>
                            {isSuccess ? (
                                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center p-4">
                                    {renderSuccessStep()}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : "center"}
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="absolute w-full flex justify-center"
                                >
                                    {currentStep === 0 && renderTypeStep()}
                                    {currentStep === 1 && renderDateStep()}
                                    {currentStep === 2 && renderProofStep()}
                                    {currentStep === 3 && renderHoursStep()}
                                    {currentStep === 4 && needsJustification && renderJustificationStep()}
                                    {/* Handle Review Logic: index 5, or 4 if skipping justification */}
                                    {((currentStep === 5) || (currentStep === 4 && !needsJustification)) && renderReviewStep()}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Toast */}
                        <AnimatePresence>
                            {errorMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-24 bg-red-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold"
                                >
                                    <i className="fas fa-exclamation-circle"></i>
                                    {errorMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Footer */}
                    {!isSuccess && (
                        <div className="h-24 border-t border-white/10 flex items-center justify-between px-6 md:px-12 bg-dark-bg/50 backdrop-blur-md">
                            <button 
                                onClick={handleBack} 
                                disabled={currentStep === 0}
                                className={`text-lg font-bold flex items-center gap-2 transition-colors ${currentStep === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
                            >
                                <i className="fas fa-arrow-left"></i> Back
                            </button>
                            
                            <div className="flex items-center gap-4">
                                <span className="hidden md:inline-block text-xs text-gray-500 uppercase font-bold tracking-wider mr-4">
                                    Press <span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">Enter ↵</span>
                                </span>
                                {((currentStep === 5) || (currentStep === 4 && !needsJustification)) ? (
                                    // Submit Button is inside renderReviewStep for visual hierarchy
                                    <div className="w-0"></div>
                                ) : (
                                    <button 
                                        onClick={handleNext}
                                        className="bg-primary hover:bg-primary-dark text-dark-bg px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-105 flex items-center gap-2"
                                    >
                                        Next <i className="fas fa-arrow-right"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Portal>
        </>
    );
};

export default LogActivityModal;

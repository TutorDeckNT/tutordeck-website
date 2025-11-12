// src/components/TutorDeckStudioModal.tsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Portal from './Portal'; // Import the Portal component

// --- Types ---
const RecordingStatus = {
  IDLE: 'idle',
  GETTING_PERMISSION: 'getting_permission',
  RECORDING: 'recording',
  STOPPED: 'stopped',
  ERROR: 'error',
} as const;

type RecordingStatusType = typeof RecordingStatus[keyof typeof RecordingStatus];

// --- Icons (as internal components) ---
const WaveformIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM7.5 6.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM11.25 4.5h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm1.5-18h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5zm3 18h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5zm-3-1.5h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0-3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0-3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0-3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm-3 4.5h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0-3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM15 6.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm3.75-12h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zm0 3h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5z" /></svg>);
const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>);
const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 11-15 0" /></svg>);
const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>);

// --- Recorder Hook ---
const useOpusRecorder = () => {
    const [status, setStatus] = useState<RecordingStatusType>(RecordingStatus.IDLE);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const cleanup = useCallback(() => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
        streamRef.current = null;
        audioChunksRef.current = [];
    }, []);

    const resetRecording = useCallback(() => {
        cleanup();
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setRecordingTime(0);
        setError(null);
        setStatus(RecordingStatus.IDLE);
    }, [cleanup, audioUrl]);

    const startRecording = useCallback(async () => {
        resetRecording();
        const mimeType = ['audio/opus', 'audio/webm;codecs=opus'].find(MediaRecorder.isTypeSupported);
        if (!navigator.mediaDevices?.getUserMedia || !mimeType) {
            setError('Audio recording is not supported in this browser.');
            setStatus(RecordingStatus.ERROR);
            return;
        }
        
        setStatus(RecordingStatus.GETTING_PERMISSION);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setStatus(RecordingStatus.RECORDING);
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                setAudioUrl(URL.createObjectURL(audioBlob));
                setStatus(RecordingStatus.STOPPED);
                cleanup();
            };
            mediaRecorderRef.current.onerror = (event) => { setError(`Recording error: ${(event as any).error.message}`); setStatus(RecordingStatus.ERROR); cleanup(); };
            mediaRecorderRef.current.start();
            const startTime = Date.now();
            timerIntervalRef.current = window.setInterval(() => setRecordingTime(Math.floor((Date.now() - startTime) / 1000)), 1000);
        } catch (err) {
            const msg = err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') ? 'Microphone permission was denied.' : (err as Error).message;
            setError(msg);
            setStatus(RecordingStatus.ERROR);
            cleanup();
        }
    }, [resetRecording, cleanup]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && status === RecordingStatus.RECORDING) {
            mediaRecorderRef.current.stop();
        }
    }, [status]);

    useEffect(() => {
        return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); cleanup(); };
    }, [audioUrl, cleanup]);

    return { status, audioUrl, recordingTime, error, startRecording, stopRecording, resetRecording };
};

// --- Main Modal Component ---
interface TutorDeckStudioModalProps { isOpen: boolean; onClose: () => void; }

const TutorDeckStudioModal = ({ isOpen, onClose }: TutorDeckStudioModalProps) => {
    const { status, audioUrl, recordingTime, error, startRecording, stopRecording, resetRecording } = useOpusRecorder();
    const isRecording = status === RecordingStatus.RECORDING;
    const isStopped = status === RecordingStatus.STOPPED;

    useEffect(() => { if (!isOpen) resetRecording(); }, [isOpen, resetRecording]);
    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-[60] p-4" onClick={onClose}>
                <div className="w-full max-w-md bg-dark-card/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 flex flex-col items-center border border-white/20" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center space-x-3"><WaveformIcon className="w-8 h-8 text-primary" /><h1 className="text-3xl font-bold text-dark-heading">TutorDeck Studio</h1></div>
                    <div className="flex items-center justify-center space-x-2 bg-black/20 px-4 py-2 rounded-full">
                        <span className={`relative flex h-3 w-3`}><span className={`absolute inline-flex h-full w-full rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-gray-400'}`}></span><span className={`relative inline-flex rounded-full h-3 w-3 ${isRecording ? 'bg-red-500' : 'bg-gray-400'}`}></span></span>
                        <span className="text-sm text-dark-text">{isRecording ? 'Recording...' : 'Ready to Record'}</span>
                    </div>
                    <div className="bg-black/30 w-48 h-24 flex items-center justify-center rounded-xl border border-white/20"><p className="text-5xl font-mono text-dark-heading tracking-wider">{`${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`}</p></div>
                    {error && <div className="bg-red-900/50 text-red-300 border border-red-700 rounded-lg p-3 text-center text-sm w-full"><p className="font-semibold">An Error Occurred</p><p>{error}</p></div>}
                    
                    {isStopped && audioUrl ? (
                        <div className="w-full pt-4 space-y-4 text-center">
                            <div className="bg-black/20 border border-primary/50 rounded-xl p-4 text-left text-sm">
                                <h3 className="font-bold text-primary mb-2">Next Steps:</h3>
                                <ol className="list-decimal list-inside space-y-1 text-dark-text">
                                    <li>Click "Download Recording" to save the audio file.</li>
                                    <li>Upload the file to your Dropbox account.</li>
                                    <li>Copy the Dropbox share link.</li>
                                    <li>Close this window and paste the link into the proof field.</li>
                                </ol>
                            </div>
                            <a href={audioUrl} download={`recording-${new Date().toISOString()}.opus`} className="w-full flex items-center justify-center bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"><DownloadIcon className="w-5 h-5 mr-2" />Download Recording</a>
                            <button onClick={resetRecording} className="w-full text-center bg-white/10 hover:bg-white/20 text-dark-heading font-semibold py-3 px-4 rounded-xl transition-colors duration-200">Record Again</button>
                        </div>
                    ) : (
                        <div className="w-full pt-4">
                            <button onClick={isRecording ? stopRecording : startRecording} disabled={status === RecordingStatus.GETTING_PERMISSION || !!error} className={`w-full flex items-center justify-center text-xl font-semibold py-4 px-6 rounded-xl transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 ${status === RecordingStatus.GETTING_PERMISSION || !!error ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : isRecording ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400' : 'bg-primary hover:bg-primary-dark text-dark-bg focus:ring-primary/50'}`}>
                                {isRecording ? <><StopIcon className="w-7 h-7 mr-3" /><span>Stop Recording</span></> : <><MicrophoneIcon className="w-7 h-7 mr-3" /><span>Start Recording</span></>}
                                {isRecording && <div className="absolute w-full h-full rounded-xl bg-red-500 animate-ping -z-10 opacity-50"></div>}
                            </button>
                        </div>
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-dark-text hover:bg-white/20 transition-colors z-10"><i className="fas fa-times"></i></button>
                </div>
            </div>
        </Portal>
    );
};

export default TutorDeckStudioModal;

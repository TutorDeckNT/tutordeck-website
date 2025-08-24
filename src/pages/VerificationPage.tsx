import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';

interface TranscriptData { userName: string; createdAt: string; }

const VerificationPage = () => {
    const { transcriptId } = useParams<{ transcriptId: string }>();
    const [status, setStatus] = useState<'loading' | 'verified' | 'invalid'>('loading');
    const [data, setData] = useState<TranscriptData | null>(null);

    useEffect(() => {
        if (!transcriptId) {
            setStatus('invalid');
            return;
        }

        // --- CHANGE #1: Add a timeout controller for robustness ---
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

        const verify = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/verify/${transcriptId}`, {
                    signal: controller.signal // Link the timeout to the fetch request
                });

                // This is the key: if the server returns 404, it's not "ok"
                if (!response.ok) {
                    throw new Error('Verification failed: Document not found.');
                }

                const result: TranscriptData = await response.json();
                setData(result);
                setStatus('verified');
            } catch (error) {
                console.error(error); // Log the actual error for debugging
                setStatus('invalid');
            } finally {
                // --- CHANGE #2: Always clear the timeout ---
                clearTimeout(timeoutId);
            }
        };

        verify();

        // Cleanup function to cancel the timeout if the user navigates away
        return () => {
            clearTimeout(timeoutId);
        };
    }, [transcriptId]);

    const downloadUrl = `${import.meta.env.VITE_RENDER_API_URL}/download-transcript/${transcriptId}`;

    const Content = () => {
        if (status === 'loading') return <>
            <i className="fas fa-spinner fa-spin text-5xl text-secondary mb-6"></i>
            <h1 className="text-4xl font-extrabold">Verifying...</h1>
        </>;
        
        // --- CHANGE #3: Update the invalid/expired message ---
        if (status === 'invalid') return <>
            <i className="fas fa-exclamation-circle text-6xl text-yellow-400 mb-6"></i>
            <h1 className="text-4xl font-extrabold">Document Not Found</h1>
            <p className="mt-2 text-dark-text max-w-md mx-auto">This verification link may be invalid, or the document may have expired and been removed from our system.</p>
        </>;
        
        return <>
            <i className="fas fa-check-circle text-6xl text-primary mb-6"></i>
            <h1 className="text-4xl font-extrabold">Transcript Verified</h1>
            <div className="text-left bg-dark-bg p-6 rounded-lg mt-8 w-full max-w-lg mx-auto border border-gray-700">
                <p className="text-lg"><strong>Volunteer:</strong> <span>{data?.userName}</span></p>
                <p className="text-lg mt-2"><strong>Date Issued:</strong> <span>{new Date(data?.createdAt || '').toLocaleDateString()}</span></p>
            </div>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="cta-button mt-8 inline-block bg-secondary text-white font-bold text-lg px-10 py-4 rounded-lg">
                Download Official Document <i className="fas fa-download ml-2"></i>
            </a>
        </>;
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-dark-bg bg-dot-pattern">
            <Reveal className="container mx-auto px-6 text-center">
                <div className="bg-dark-card max-w-2xl mx-auto p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-700">
                    <Content />
                </div>
            </Reveal>
        </main>
    );
};
export default VerificationPage;

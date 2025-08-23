import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';

interface TranscriptData { userName: string; createdAt: string; }

const VerificationPage = () => {
    const { transcriptId } = useParams<{ transcriptId: string }>();
    const [status, setStatus] = useState<'loading' | 'verified' | 'invalid'>('loading');
    const [data, setData] = useState<TranscriptData | null>(null);

    useEffect(() => {
        if (!transcriptId) { setStatus('invalid'); return; }
        const verify = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/verify/${transcriptId}`);
                if (!response.ok) throw new Error('Verification failed');
                const result: TranscriptData = await response.json();
                setData(result);
                setStatus('verified');
            } catch (error) {
                setStatus('invalid');
            }
        };
        verify();
    }, [transcriptId]);

    const downloadUrl = `${import.meta.env.VITE_RENDER_API_URL}/download-transcript/${transcriptId}`;

    const Content = () => {
        if (status === 'loading') return <>
            <i className="fas fa-spinner fa-spin text-5xl text-secondary mb-6"></i>
            <h1 className="text-4xl font-extrabold">Verifying...</h1>
        </>;
        if (status === 'invalid') return <>
            <i className="fas fa-times-circle text-6xl text-red-500 mb-6"></i>
            <h1 className="text-4xl font-extrabold">Verification Failed</h1>
            <p className="mt-2">The transcript ID is invalid or could not be found.</p>
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
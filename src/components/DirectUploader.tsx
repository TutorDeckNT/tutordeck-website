// src/components/DirectUploader.tsx

import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface DirectUploaderProps {
    onUploadSuccess: (link: string) => void;
}

const DirectUploader = ({ onUploadSuccess }: DirectUploaderProps) => {
    const { user } = useAuth();
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) {
            return;
        }

        // --- FIX: Add JavaScript validation for audio files ---
        if (!file.type.startsWith('audio/')) {
            setStatus('error');
            setErrorMessage('Invalid file type. Please select an audio file.');
            // Reset file input to allow re-selection
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setStatus('uploading');
        setErrorMessage(null);

        const formData = new FormData();
        formData.append('proofFile', file);

        try {
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_RENDER_API_URL}/api/upload-proof`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed.');
            }

            setStatus('success');
            onUploadSuccess(data.link); // Pass the link up to the parent
            setTimeout(() => setStatus('idle'), 3000);

        } catch (err) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            // Reset file input to allow re-uploading the same file
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const getStatusContent = () => {
        switch (status) {
            case 'uploading':
                return <p className="text-sm text-blue-400 font-semibold">Uploading, please wait...</p>;
            case 'success':
                return <p className="text-sm text-green-400 font-semibold">✅ Success! Link has been added.</p>;
            case 'error':
                return <p className="text-sm text-red-400 font-semibold">❌ Error: {errorMessage}</p>;
            case 'idle':
            default:
                return null;
        }
    };

    return (
        <div className="w-full space-y-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                // --- FIX: Update accept attribute to hint for audio files ---
                accept="audio/*"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={status === 'uploading'}
                className="w-full p-3 bg-white/5 border border-white/10 hover:border-blue-400 rounded-xl text-center transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
                <i className="fas fa-upload mr-2 text-blue-400"></i>
                {status === 'uploading' ? 'Uploading...' : 'Upload Audio Proof'}
            </button>
            <div className="h-6 flex items-center justify-center px-2 text-center">
                {getStatusContent()}
            </div>
        </div>
    );
};

export default DirectUploader;

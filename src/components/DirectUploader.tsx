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

    const allowedExtensions = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'opus', 'flac', 'webm'];

    const isAllowedAudio = (file: File) => {
        // Get the file name, trim whitespace, convert to lowercase
        const fileName = file.name.trim().toLowerCase();
        
        // Extract extension after the last dot
        const lastDot = fileName.lastIndexOf('.');
        if (lastDot === -1) {
            console.log('No extension found in:', file.name);
            return false;
        }
        
        const extension = fileName.substring(lastDot + 1);
        console.log('File:', file.name, 'Extension:', extension, 'Type:', file.type);
        
        return allowedExtensions.includes(extension);
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) {
            return;
        }

        if (!isAllowedAudio(file)) {
            setStatus('error');
            setErrorMessage('Invalid file type. Please select an audio file (mp3, wav, m4a, aac, ogg, opus).');
            if (fileInputRef.current) {
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
            onUploadSuccess(data.link);
            setTimeout(() => setStatus('idle'), 3000);

        } catch (err) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            if (fileInputRef.current) {
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
                accept=".mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.webm,audio/*"
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

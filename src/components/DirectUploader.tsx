// src/components/DirectUploader.tsx

import React, { useState, useRef } from 'react';
import { useDropbox } from '../contexts/DropboxContext';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface DirectUploaderProps {
    onUploadSuccess: (link: string) => void;
}

const DirectUploader = ({ onUploadSuccess }: DirectUploaderProps) => {
    const { isAuthenticated, login, dbx } = useDropbox();
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allowedExtensions = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'opus', 'flac', 'webm'];

    const isAllowedAudio = (file: File) => {
        const fileName = file.name.trim().toLowerCase();
        const lastDot = fileName.lastIndexOf('.');
        if (lastDot === -1) return false;
        const extension = fileName.substring(lastDot + 1);
        return allowedExtensions.includes(extension);
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!isAuthenticated || !dbx) {
            setErrorMessage("Please connect to Dropbox first.");
            return;
        }

        if (!isAllowedAudio(file)) {
            setStatus('error');
            setErrorMessage('Invalid file type. Please select an audio file.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setStatus('uploading');
        setErrorMessage(null);

        try {
            // 1. Upload File
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.name}`;
            const uploadResponse = await dbx.filesUpload({
                path: '/' + fileName, // Uploads to App Folder root
                contents: file
            });

            // 2. Create Shared Link
            const shareResponse = await dbx.sharingCreateSharedLinkWithSettings({
                path: uploadResponse.result.path_display || '/' + fileName,
                settings: { requested_visibility: { '.tag': 'public' } }
            });

            setStatus('success');
            onUploadSuccess(shareResponse.result.url);
            setTimeout(() => setStatus('idle'), 3000);

        } catch (err: any) {
            console.error("Dropbox Upload Error", err);
            setStatus('error');
            // Handle specific Dropbox errors
            if (err.error && err.error.error_summary && err.error.error_summary.includes('expired_access_token')) {
                setErrorMessage('Session expired. Please reconnect Dropbox.');
            } else {
                setErrorMessage('Upload failed. Check your connection.');
            }
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const getStatusContent = () => {
        switch (status) {
            case 'uploading': return <p className="text-sm text-blue-400 font-semibold">Uploading to your Dropbox...</p>;
            case 'success': return <p className="text-sm text-green-400 font-semibold">✅ Success! Link added.</p>;
            case 'error': return <p className="text-sm text-red-400 font-semibold">❌ {errorMessage}</p>;
            default: return null;
        }
    };

    if (!isAuthenticated) {
        return (
            <button
                type="button"
                onClick={login}
                className="w-full p-3 bg-[#0061FE] hover:bg-[#0061FE]/90 text-white rounded-xl text-center transition-colors font-semibold"
            >
                <i className="fab fa-dropbox mr-2"></i>
                Connect Dropbox to Upload
            </button>
        );
    }

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

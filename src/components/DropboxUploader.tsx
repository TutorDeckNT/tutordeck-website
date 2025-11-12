// src/components/DropboxUploader.tsx

import React, { useState, useRef } from 'react';

// TypeScript declaration for the global Dropbox object
declare const Dropbox: any;

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const DropboxUploader = () => {
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // useRef to access the hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setStatus('uploading');
        setProgress(0);
        setErrorMessage(null);

        // The Dropbox Saver API can upload directly from a URL.
        // We create a temporary local URL for the selected file.
        const fileUrl = URL.createObjectURL(file);

        Dropbox.save({
            files: [{ url: fileUrl, filename: file.name }],
            success: () => {
                // Important: Revoke the temporary URL to prevent memory leaks
                URL.revokeObjectURL(fileUrl);
                setStatus('success');
                setProgress(100);
                // Reset the status message after a few seconds
                setTimeout(() => setStatus('idle'), 5000);
            },
            progress: (uploadProgress: number) => {
                setProgress(Math.round(uploadProgress * 100));
            },
            cancel: () => {
                URL.revokeObjectURL(fileUrl);
                setStatus('idle');
            },
            error: (err: Error) => {
                URL.revokeObjectURL(fileUrl);
                setStatus('error');
                setErrorMessage(err ? err.toString() : 'An unknown error occurred during upload.');
            },
        });

        // Reset the file input value to allow re-uploading the same file if needed
        event.target.value = '';
    };

    const getStatusContent = () => {
        switch (status) {
            case 'uploading':
                return (
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                );
            case 'success':
                return <p className="text-sm text-green-400 font-semibold">✅ Upload complete! Now click "Choose Existing File" to select it.</p>;
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
                accept=".pdf,.png,.jpeg,.jpg,.opus,.mp3,.wav,.m4a"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={status === 'uploading'}
                className="w-full p-3 bg-white/5 border border-white/10 hover:border-blue-400 rounded-xl text-center transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
                <i className="fas fa-upload mr-2 text-blue-400"></i>
                {status === 'uploading' ? `Uploading... ${progress}%` : 'Upload New File to Dropbox'}
            </button>
            <div className="h-6 flex items-center justify-center px-2 text-center">
                {getStatusContent()}
            </div>
        </div>
    );
};

export default DropboxUploader;

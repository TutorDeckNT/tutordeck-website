import { useState, useEffect, FormEvent } from 'react';

interface EmailModalProps { isOpen: boolean; onClose: () => void; onSubmit: (email: string) => void; isLoading: boolean; defaultEmail: string; }

const EmailModal = ({ isOpen, onClose, onSubmit, isLoading, defaultEmail }: EmailModalProps) => {
    const [email, setEmail] = useState(defaultEmail);
    useEffect(() => { setEmail(defaultEmail); }, [defaultEmail, isOpen]);
    const handleSubmit = (e: FormEvent) => { e.preventDefault(); if (email) onSubmit(email); };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-dark-card rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-dark-heading mb-4">Generate & Email Transcript</h2>
                <p className="text-dark-text mb-6">Confirm the email address where your official transcript should be sent.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-dark-bg border border-gray-600 rounded-lg py-2 px-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-secondary hover:bg-secondary-dark transition-colors disabled:bg-gray-500 disabled:cursor-wait flex items-center gap-2">
                            {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : 'Confirm & Send'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default EmailModal;
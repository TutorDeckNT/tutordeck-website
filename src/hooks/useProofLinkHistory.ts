// src/hooks/useProofLinkHistory.ts

import { useCallback } from 'react';

const HISTORY_KEY = 'tutorDeckProofLinkHistory';

/**
 * A hook to manage a persistent history of all submitted proof links.
 * This is used to prevent duplicate link submissions on the client-side.
 */
export const useProofLinkHistory = () => {
    /**
     * Retrieves the entire link history from localStorage.
     * @returns {string[]} An array of all previously submitted links.
     */
    const getHistory = (): string[] => {
        try {
            const historyJson = localStorage.getItem(HISTORY_KEY);
            return historyJson ? JSON.parse(historyJson) : [];
        } catch (error) {
            console.error("Failed to parse link history from localStorage:", error);
            return [];
        }
    };

    /**
     * Checks if a given link already exists in the submission history.
     * @param {string} link - The link to check.
     * @returns {boolean} - True if the link is a duplicate, false otherwise.
     */
    const isDuplicate = useCallback((link: string): boolean => {
        if (!link) return false;
        const history = getHistory();
        return history.includes(link);
    }, []);

    /**
     * Adds a new link to the submission history.
     * @param {string} newLink - The link to add to the history.
     */
    const addLinkToHistory = useCallback((newLink: string) => {
        if (!newLink) return;
        try {
            const history = getHistory();
            // Add the new link without checking for duplicates here,
            // as we assume validation has already happened.
            const updatedHistory = [...history, newLink];
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
            console.error("Failed to save link history to localStorage:", error);
        }
    }, []);

    return { isDuplicate, addLinkToHistory };
};

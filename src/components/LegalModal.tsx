// src/components/LegalModal.tsx

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Portal from './Portal';
import { LegalDocumentData } from '../lib/legal';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: LegalDocumentData | null;
}

const LegalModal = ({ isOpen, onClose, data }: LegalModalProps) => {
    const [activeSection, setActiveSection] = useState<string>('');
    const contentRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: contentRef });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Scroll Spy Logic
    useEffect(() => {
        const contentEl = contentRef.current;
        if (!contentEl || !data) return;

        const handleScroll = () => {
            const sections = data.sections;
            for (const section of sections) {
                const el = document.getElementById(`legal-section-${section.id}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const containerRect = contentEl.getBoundingClientRect();
                    // If the section top is within the top half of the container
                    if (rect.top >= containerRect.top - 50 && rect.top < containerRect.top + containerRect.height / 2) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        contentEl.addEventListener('scroll', handleScroll);
        return () => contentEl.removeEventListener('scroll', handleScroll);
    }, [data, isOpen]);

    if (!isOpen || !data) return null;

    const handleScrollTo = (id: string) => {
        const el = document.getElementById(`legal-section-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
    };

    return (
        <Portal>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center">
                        {/* Backdrop with Blur */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
                        />

                        {/* The Terminal Window */}
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            className="relative w-full max-w-6xl h-[90vh] md:h-[85vh] bg-[#0B1121] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden m-4"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Reading Progress Bar */}
                            <motion.div 
                                className="absolute top-0 left-0 right-0 h-[2px] bg-primary z-50 origin-left"
                                style={{ scaleX }}
                            />

                            {/* Header / Control Bar */}
                            <div className="flex-shrink-0 h-16 border-b border-white/5 bg-[#0B1121] flex items-center justify-between px-6 select-none relative z-20">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                                    <div>
                                        <h1 className="text-sm font-bold text-white tracking-wide uppercase">{data.title}</h1>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                            <span>{data.version}</span>
                                            <span>•</span>
                                            <span>Last Upd: {data.lastUpdated}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => window.print()}
                                        className="hidden md:flex items-center justify-center w-8 h-8 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                        title="Print"
                                    >
                                        <i className="fas fa-print"></i>
                                    </button>
                                    <button 
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-mono text-gray-300 transition-colors"
                                    >
                                        <span>ESC</span>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Main Body */}
                            <div className="flex flex-1 overflow-hidden relative">
                                
                                {/* Sidebar (Desktop Only) */}
                                <aside className="hidden md:block w-72 bg-[#020617]/50 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Table of Contents</h3>
                                    <nav className="space-y-1">
                                        {data.sections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => handleScrollTo(section.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                                                    activeSection === section.id 
                                                    ? 'bg-primary/5 border-primary text-primary font-medium' 
                                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                                }`}
                                            >
                                                {section.title}
                                            </button>
                                        ))}
                                    </nav>
                                    
                                    <div className="mt-12 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                                            <i className="fas fa-shield-alt"></i>
                                            <span className="text-xs font-bold uppercase">Secure Docs</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 leading-tight">
                                            This document represents a binding agreement within the TutorDeck ecosystem.
                                        </p>
                                    </div>
                                </aside>

                                {/* Content Stream */}
                                <div 
                                    ref={contentRef}
                                    className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth custom-scrollbar relative"
                                >
                                    {/* Mobile TOC (Horizontal Scroll) */}
                                    <div className="md:hidden flex overflow-x-auto gap-2 pb-6 mb-6 border-b border-white/5 no-scrollbar">
                                        {data.sections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => handleScrollTo(section.id)}
                                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border ${
                                                    activeSection === section.id
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-white/5 border-white/10 text-gray-400'
                                                }`}
                                            >
                                                {section.title}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Intro */}
                                    <div className="max-w-3xl mx-auto mb-12">
                                        {data.intro}
                                    </div>

                                    {/* Sections */}
                                    <div className="max-w-3xl mx-auto space-y-16 pb-24">
                                        {data.sections.map((section, index) => (
                                            <section key={section.id} id={`legal-section-${section.id}`} className="scroll-mt-6">
                                                {/* System Line Divider */}
                                                <div className="flex items-center gap-4 mb-6">
                                                    <span className="font-mono text-[10px] text-primary/50">
                                                        // SECTION 0{index + 1}
                                                    </span>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
                                                </div>

                                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                                    {section.title}
                                                </h2>
                                                <div className="text-gray-300 leading-loose text-base md:text-lg space-y-4">
                                                    {section.content}
                                                </div>
                                            </section>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer */}
                            <div className="flex-shrink-0 p-4 border-t border-white/5 bg-[#0B1121] flex justify-end">
                                <button 
                                    onClick={onClose}
                                    className="px-8 py-3 bg-primary text-[#020617] font-bold rounded-lg hover:bg-primary-dark hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)] flex items-center gap-2"
                                >
                                    <i className="fas fa-check-circle"></i>
                                    I Understand
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Portal>
    );
};

export default LegalModal;

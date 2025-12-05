// src/components/Footer.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LegalModal from './LegalModal';
import { termsOfServiceData, privacyPolicyData, LegalDocumentData } from '../lib/legal';

// --- UTILITY COMPONENTS ---

/**
 * ShiftText: A precision mechanical slide effect. 
 * Replaces chaotic scrambles with a smooth elevator transition.
 */
const ShiftText = ({ text, isActive = false }: { text: string, isActive?: boolean }) => {
    return (
        <div className="relative overflow-hidden h-[1.5em] flex flex-col items-start leading-snug">
            {/* Layer 1: The Idle Text (Slides Up) */}
            <span 
                className={`block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full ${isActive ? 'text-primary font-bold' : 'text-gray-300 font-medium'}`}
            >
                {text}
            </span>
            
            {/* Layer 2: The Active Text (Slides In from Bottom) */}
            <span 
                className="absolute top-0 left-0 block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover:translate-y-0 text-primary font-bold tracking-wide"
            >
                {text}
            </span>
        </div>
    );
};

/**
 * SpotlightCard: A container that illuminates based on mouse position.
 */
const SpotlightCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div 
            className={`relative group border border-white/10 bg-dark-card/30 overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onClick={onClick}
        >
            {/* Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(52, 211, 153, 0.10),
                            transparent 80%
                        )
                    `,
                }}
            />
            {/* Border Highlight on Hover */}
            <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 transition-colors duration-500 rounded-lg pointer-events-none"></div>
            
            <div className="relative h-full z-10">{children}</div>
        </div>
    );
};

// --- MAIN FOOTER COMPONENT ---

const Footer = () => {
    const { user } = useAuth();
    // State holds the structured data object for the Legal Terminal
    const [currentDoc, setCurrentDoc] = useState<LegalDocumentData | null>(null);

    const openModal = (type: 'terms' | 'privacy') => {
        setCurrentDoc(type === 'terms' ? termsOfServiceData : privacyPolicyData);
    };

    return (
        <>
            <LegalModal 
                isOpen={!!currentDoc} 
                onClose={() => setCurrentDoc(null)} 
                data={currentDoc} 
            />

            <footer className="relative bg-[#020617] text-white pt-20 pb-10 overflow-hidden">
                
                {/* 1. THE LIGHT HORIZON (Top Separator) */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-primary/5 blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    
                    {/* 2. THE BENTO GRID (Main Modules) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
                        
                        {/* MODULE A: BRAND IDENTITY (Left - 5 Cols) */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                            <div>
                                <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
                                    <div className="relative w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl group-hover:border-primary/50 transition-colors duration-500">
                                        <img src="/mascot.svg" alt="Mascot" className="w-8 h-8 opacity-90 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors duration-500">TUTORDECK</span>
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-gray-400 transition-colors">Est. 2022 • Texas</span>
                                    </div>
                                </Link>
                                <p className="text-gray-400 max-w-sm leading-relaxed text-lg">
                                    Redefining peer education through a student-led, tech-forward initiative. <span className="text-gray-500">We build leaders, not just scholars.</span>
                                </p>
                            </div>
                            
                            {/* Mission Pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-mono text-gray-300">System Status: Operational</span>
                            </div>
                        </div>

                        {/* MODULE B: NAVIGATION STACK (Center - 4 Cols) */}
                        <div className="lg:col-span-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <i className="fas fa-layer-group"></i> Navigation
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { name: 'Home', path: '/' },
                                    { name: 'About Mission', path: '/about' },
                                    { name: 'Find Chapters', path: '/chapters' },
                                    { name: 'Get Involved', path: '/get-involved' },
                                    user ? { name: 'Dashboard', path: '/dashboard', highlight: true } : { name: 'Login Portal', path: '/login' }
                                ].map((link) => (
                                    <Link key={link.path} to={link.path}>
                                        <SpotlightCard className={`rounded-lg px-6 py-3 transition-all duration-300 active:scale-95 ${link.highlight ? 'bg-primary/5 border-primary/20' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                {/* ShiftText Component for smooth hover effect */}
                                                <ShiftText text={link.name} isActive={!!link.highlight} />
                                                
                                                {link.highlight && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1"></div>
                                                )}
                                            </div>
                                        </SpotlightCard>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* MODULE C: ACTION SECTOR (Right - 3 Cols) */}
                        <div className="lg:col-span-3 flex flex-col gap-4">
                            {/* Magnetic CTA Card */}
                            <Link to="/get-involved" className="block h-full group">
                                <SpotlightCard className="rounded-2xl p-6 h-full flex flex-col justify-between min-h-[180px] bg-gradient-to-b from-white/5 to-transparent">
                                    <div>
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-500">
                                            <i className="fas fa-rocket"></i>
                                        </div>
                                        <h3 className="text-xl font-bold text-white leading-tight mb-1">Start a Chapter</h3>
                                        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Launch TutorDeck at your school.</p>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                                            <i className="fas fa-arrow-right text-xs -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </Link>
                            
                            {/* Social Magnetic Strip */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { icon: 'twitter', url: '#' },
                                    { icon: 'instagram', url: 'https://www.instagram.com/tutordeck___/' },
                                    { icon: 'linkedin', url: '#' }
                                ].map((social, idx) => (
                                    <a 
                                        key={idx} 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group bg-white/5 border border-white/10 rounded-lg h-12 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden relative"
                                    >
                                        <div className="relative z-10 text-gray-400 group-hover:text-primary transition-colors">
                                             <i className={`fab fa-${social.icon} text-lg group-hover:-translate-y-1 transition-transform duration-300`}></i>
                                        </div>
                                        {/* Subtle glow behind icon on hover */}
                                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. THE SYSTEM BAR (Bottom) */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
                        
                        <div className="flex items-center gap-2">
                            <span>© 2025 TutorDeck Initiative.</span>
                            <span className="hidden md:inline text-gray-700">|</span>
                            <span className="hidden md:inline">Built by Students, for Students.</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <button onClick={() => openModal('terms')} className="hover:text-primary transition-colors uppercase tracking-wider">Terms</button>
                            <button onClick={() => openModal('privacy')} className="hover:text-primary transition-colors uppercase tracking-wider">Privacy</button>
                            <a href="mailto:join@tutordeck.org" className="hover:text-primary transition-colors uppercase tracking-wider">Contact</a>
                        </div>

                    </div>
                </div>

                {/* Background Noise Texture */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </footer>
        </>
    );
};

export default Footer;
